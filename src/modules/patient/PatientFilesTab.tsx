/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  File as FileIcon,
  FileArchive,
  FileImage,
  FileSpreadsheet,
  FileText,
  FolderOpen,
  Info,
  LayoutGrid,
  List,
  Maximize2,
  Scan,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { CustomButton } from "../../components/custom/Button";
import { Loader } from "../../components/custom/Loader";
import { DeleteConfirmationDialog } from "../../components/custom/DeleteConfirmationDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { BASE_URL } from "../../utils";
import type { Attachment } from "../../utils";
import {
  addPatientAttachments,
  removePatientAttachment,
  type PatientAttachmentField,
} from "./patientApi";

const MAX_FILE_BYTES = 20 * 1024 * 1024;

const resolveUrl = (url: string) =>
  url.startsWith("http") ? url : `${BASE_URL}${url}`;

const formatBytes = (bytes?: number) => {
  if (!bytes) return "—";
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const isImage = (contentType?: string) => !!contentType?.startsWith("image/");
const isPdf = (contentType?: string) => contentType === "application/pdf";

const extensionOf = (name: string) =>
  name.includes(".") ? name.split(".").pop()!.toLowerCase() : "";

/**
 * Badge + icon treatment per file type, so a list of documents stays scannable
 * without thumbnails to lean on.
 */
const describeType = (file: { name: string; content_type?: string }) => {
  const ext = extensionOf(file.name);

  if (isImage(file.content_type))
    return {
      label: ext.toUpperCase() || "IMAGE",
      Icon: FileImage,
      tone: "bg-violet-50 text-violet-600 ring-violet-100",
    };
  if (isPdf(file.content_type))
    return {
      label: "PDF",
      Icon: FileText,
      tone: "bg-rose-50 text-rose-600 ring-rose-100",
    };
  if (["doc", "docx", "odt", "rtf", "txt"].includes(ext))
    return {
      label: ext.toUpperCase(),
      Icon: FileText,
      tone: "bg-blue-50 text-blue-600 ring-blue-100",
    };
  if (["xls", "xlsx", "csv", "ods"].includes(ext))
    return {
      label: ext.toUpperCase(),
      Icon: FileSpreadsheet,
      tone: "bg-emerald-50 text-emerald-600 ring-emerald-100",
    };
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return {
      label: ext.toUpperCase(),
      Icon: FileArchive,
      tone: "bg-amber-50 text-amber-600 ring-amber-100",
    };

  return {
    label: ext.toUpperCase() || "FILE",
    Icon: FileIcon,
    tone: "bg-gray-100 text-gray-500 ring-gray-200",
  };
};

const DOCUMENT_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "odt",
  "rtf",
  "txt",
  "xls",
  "xlsx",
  "csv",
  "ods",
];

type Variant = {
  title: string;
  /** Singular noun used in counts, toasts and aria labels. */
  subject: string;
  subjectPlural: string;
  Icon: typeof Scan;
  /** `accept` for the hidden file input. */
  accept: string;
  hint: string;
  emptyTitle: string;
  emptyHint: string;
  dropTitle: string;
  defaultView: ViewMode;
  /** Radiographs read best on a dark plate; paperwork does not. */
  plate: string;
  isAllowed: (file: File) => boolean;
};

type ViewMode = "grid" | "list";

const VARIANTS: Record<PatientAttachmentField, Variant> = {
  x_rays: {
    title: "Medical X-Rays",
    subject: "X-ray",
    subjectPlural: "X-rays",
    Icon: Scan,
    accept: "image/*,application/pdf",
    hint: "JPG, PNG or PDF · up to 20 MB each",
    emptyTitle: "No X-rays yet",
    emptyHint:
      "Drop radiographs here or browse your device — they will show up as a gallery.",
    dropTitle: "Drop to add X-rays",
    defaultView: "grid",
    plate: "bg-gray-900",
    isAllowed: (file) =>
      isImage(file.type) ||
      isPdf(file.type) ||
      extensionOf(file.name) === "pdf",
  },
  documents: {
    title: "Documents",
    subject: "document",
    subjectPlural: "documents",
    Icon: FolderOpen,
    accept:
      "image/*,application/pdf,.doc,.docx,.odt,.rtf,.txt,.xls,.xlsx,.csv,.ods",
    hint: "PDF, Word, Excel, text or image · up to 20 MB each",
    emptyTitle: "No documents yet",
    emptyHint:
      "Reports, prescriptions, consent forms and referrals uploaded for this patient will appear here.",
    dropTitle: "Drop to add documents",
    defaultView: "list",
    plate: "bg-gray-50",
    isAllowed: (file) =>
      isImage(file.type) ||
      isPdf(file.type) ||
      DOCUMENT_EXTENSIONS.includes(extensionOf(file.name)),
  },
};

type PatientFilesTabProps = {
  companyId: number;
  patientId: number;
  field: PatientAttachmentField;
  files: Attachment[];
  /** Refetches the patient so the list reflects what the server now holds. */
  onChanged: () => Promise<void>;
};

/**
 * A file waiting to be uploaded, together with its preview object URL. The URL
 * is created when the file is staged and revoked wherever the entry is dropped
 * — deriving it in render would leave StrictMode's double-invoked cleanup
 * revoking URLs that never get recreated.
 */
type StagedFile = { file: File; url: string | null };

const revoke = (entries: StagedFile[]) =>
  entries.forEach((entry) => entry.url && URL.revokeObjectURL(entry.url));

/** Hover/focus actions shared by the grid tile and the list row. */
function FileActions({
  file,
  canMutate,
  onPreview,
  onDelete,
  className,
}: {
  file: Attachment;
  canMutate: boolean;
  onPreview: () => void;
  onDelete: () => void;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={onPreview}
        title="Preview"
        aria-label={`Preview ${file.name}`}
        className="rounded-lg bg-white/95 p-2 text-gray-700 shadow-sm transition-colors hover:bg-white hover:text-gray-900"
      >
        <Maximize2 size={15} />
      </button>
      <a
        href={resolveUrl(file.url)}
        download={file.name}
        target="_blank"
        rel="noopener noreferrer"
        title="Download"
        aria-label={`Download ${file.name}`}
        className="rounded-lg bg-white/95 p-2 text-gray-700 shadow-sm transition-colors hover:bg-white hover:text-gray-900"
      >
        <Download size={15} />
      </a>
      <button
        type="button"
        disabled={!canMutate}
        onClick={onDelete}
        title="Delete"
        aria-label={`Delete ${file.name}`}
        className="rounded-lg bg-white/95 p-2 text-red-600 shadow-sm transition-colors hover:bg-red-50 disabled:opacity-40"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export function PatientFilesTab({
  companyId,
  patientId,
  field,
  files,
  onChanged,
}: PatientFilesTabProps) {
  const variant = VARIANTS[field];

  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [view, setView] = useState<ViewMode>(variant.defaultView);
  const [query, setQuery] = useState("");
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Attachment | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  // dragenter/dragleave fire for every child element — count them so the
  // overlay does not flicker while the pointer moves across the grid.
  const dragDepth = useRef(0);

  const totalBytes = files.reduce((sum, f) => sum + (f.byte_size ?? 0), 0);

  /**
   * Every write re-sends the surviving files by signed id. Without them we can
   * only replace the whole collection, so the write actions are disabled rather
   * than silently purging the patient's history.
   */
  const canMutate = files.every((f) => Boolean(f.signed_id));
  const survivingIds = useMemo(
    () => files.map((f) => f.signed_id).filter(Boolean),
    [files]
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return files;
    return files.filter((f) => f.name.toLowerCase().includes(needle));
  }, [files, query]);

  const acceptFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming?.length) return;

      const accepted: StagedFile[] = [];
      const rejected: string[] = [];

      Array.from(incoming).forEach((file) => {
        if (!variant.isAllowed(file)) {
          rejected.push(`${file.name} — unsupported file type`);
          return;
        }
        if (file.size > MAX_FILE_BYTES) {
          rejected.push(`${file.name} — over ${formatBytes(MAX_FILE_BYTES)}`);
          return;
        }
        accepted.push({
          file,
          url: isImage(file.type) ? URL.createObjectURL(file) : null,
        });
      });

      if (accepted.length) {
        setStaged((current) => [...current, ...accepted]);
      }
      rejected.forEach((message) => toast.error(message));
    },
    [variant]
  );

  const clearStaged = useCallback(() => {
    setStaged((current) => {
      revoke(current);
      return [];
    });
  }, []);

  // Release preview object URLs if the tab unmounts with files still staged.
  // The ref is what the cleanup can safely read — a state updater scheduled on
  // an unmounting component would never run.
  const stagedRef = useRef<StagedFile[]>([]);
  stagedRef.current = staged;
  useEffect(() => () => revoke(stagedRef.current), []);

  const handleUpload = async () => {
    if (!staged.length) return;

    setUploading(true);
    try {
      await addPatientAttachments(
        companyId,
        patientId,
        field,
        survivingIds,
        staged.map((entry) => entry.file)
      );
      toast.success(
        `${staged.length} ${
          staged.length > 1 ? variant.subjectPlural : variant.subject
        } uploaded`
      );
      clearStaged();
      await onChanged();
    } catch (error: any) {
      toast.error(
        error?.message || `Failed to upload ${variant.subjectPlural}`
      );
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await removePatientAttachment(
      companyId,
      patientId,
      field,
      files.filter((f) => f.id !== pendingDelete.id).map((f) => f.signed_id)
    );
  };

  // Arrow keys move through the lightbox (Esc is handled by the dialog).
  useEffect(() => {
    if (viewerIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight")
        setViewerIndex((index) =>
          index === null ? index : (index + 1) % visible.length
        );
      if (event.key === "ArrowLeft")
        setViewerIndex((index) =>
          index === null ? index : (index - 1 + visible.length) % visible.length
        );
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerIndex, visible.length]);

  // `?? null` keeps the dialog closed if a refetch shrinks the list underneath
  // an open viewer.
  const active = viewerIndex === null ? null : (visible[viewerIndex] ?? null);
  const browse = () => canMutate && inputRef.current?.click();

  return (
    <div
      className="relative"
      onDragEnter={(event) => {
        // ignore text/element drags — only a file drag should tint the panel
        if (!event.dataTransfer.types.includes("Files")) return;
        event.preventDefault();
        dragDepth.current += 1;
        if (canMutate) setDragging(true);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDragLeave={() => {
        dragDepth.current = Math.max(0, dragDepth.current - 1);
        if (dragDepth.current === 0) setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        if (canMutate) acceptFiles(event.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={variant.accept}
        multiple
        hidden
        onChange={(event) => {
          acceptFiles(event.target.files);
          // let the same file be picked again after removing it
          event.target.value = "";
        }}
      />

      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-(--color-primary-dark) ring-1 ring-emerald-100">
              <variant.Icon size={20} />
            </span>
            <div className="min-w-0">
              <h2 className="truncate font-semibold text-gray-900">
                {variant.title}
              </h2>
              <p className="text-xs text-gray-500">
                {files.length}{" "}
                {files.length === 1 ? variant.subject : variant.subjectPlural}
                {totalBytes > 0 && ` · ${formatBytes(totalBytes)}`}
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
            {files.length > 3 && (
              <div className="relative w-full sm:w-56">
                <Search
                  size={14}
                  className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-gray-400"
                />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name…"
                  className="h-9 pl-8"
                />
              </div>
            )}

            <div className="flex items-center rounded-lg border border-gray-200 p-0.5">
              {(
                [
                  { mode: "grid", Icon: LayoutGrid, label: "Grid view" },
                  { mode: "list", Icon: List, label: "List view" },
                ] as const
              ).map(({ mode, Icon, label }) => (
                <button
                  key={mode}
                  type="button"
                  title={label}
                  aria-label={label}
                  aria-pressed={view === mode}
                  onClick={() => setView(mode)}
                  className={cn(
                    "rounded-md p-1.5 transition-colors",
                    view === mode
                      ? "bg-gray-900 text-white"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  )}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>

            <CustomButton
              variantType="primary"
              className="h-9"
              onClick={browse}
              disabled={uploading || !canMutate}
            >
              <Upload size={16} className="mr-1" />
              Upload
            </CustomButton>
          </div>
        </div>

        {!canMutate && files.length > 0 && (
          <p className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <Info size={16} className="mt-0.5 shrink-0" />
            <span>
              These {variant.subjectPlural} were loaded without an attachment{" "}
              <code>signed_id</code>, so uploading or deleting would replace the
              whole set. Uploads stay disabled until the API returns{" "}
              <code>signed_id</code> for each file.
            </span>
          </p>
        )}

        {/* Staged, not yet uploaded */}
        {staged.length > 0 && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-medium text-gray-900">
                {staged.length} file{staged.length === 1 ? "" : "s"} ready to
                upload
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 bg-white"
                  onClick={clearStaged}
                  disabled={uploading}
                >
                  Clear
                </Button>
                <CustomButton
                  variantType="primary"
                  className="h-9"
                  onClick={handleUpload}
                  disabled={uploading}
                >
                  {uploading && <Loader className="mr-1 text-white" />}
                  {uploading ? "Uploading…" : "Upload all"}
                </CustomButton>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1">
              {staged.map(({ file, url }, index) => {
                const type = describeType({
                  name: file.name,
                  content_type: file.type,
                });

                return (
                  <div
                    key={`${file.name}-${index}`}
                    className="group/staged relative w-32 shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white"
                  >
                    <div className="flex h-20 items-center justify-center bg-gray-50">
                      {url ? (
                        <img
                          src={url}
                          alt={file.name}
                          className="size-full object-cover"
                        />
                      ) : (
                        <type.Icon size={22} className="text-gray-400" />
                      )}
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      disabled={uploading}
                      onClick={() =>
                        setStaged((current) => {
                          revoke(current.filter((_, i) => i === index));
                          return current.filter((_, i) => i !== index);
                        })
                      }
                      className="absolute top-1.5 right-1.5 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-red-600"
                    >
                      <X size={11} />
                    </button>
                    <p
                      className="truncate px-2 py-1.5 text-[11px] text-gray-600"
                      title={file.name}
                    >
                      {file.name}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Content */}
        {files.length === 0 ? (
          <button
            type="button"
            onClick={browse}
            disabled={!canMutate}
            className={cn(
              "flex w-full flex-col items-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 px-6 py-14 text-center transition-colors",
              canMutate
                ? "cursor-pointer hover:border-(--color-primary) hover:bg-emerald-50/40"
                : "cursor-not-allowed opacity-60"
            )}
          >
            <span className="mb-4 flex size-14 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm">
              <Upload size={22} />
            </span>
            <span className="font-medium text-gray-800">
              {variant.emptyTitle}
            </span>
            <span className="mt-1 max-w-sm text-sm text-gray-500">
              {variant.emptyHint}
            </span>
            <span className="mt-3 text-xs text-gray-400">{variant.hint}</span>
          </button>
        ) : visible.length === 0 ? (
          <div className="rounded-xl border border-gray-100 bg-white p-12 text-center">
            <Search size={28} className="mx-auto mb-3 text-gray-300" />
            <p className="font-medium text-gray-700">
              No matches for "{query}"
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-2 text-sm text-(--color-primary-dark) hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
            {visible.map((file, index) => {
              const type = describeType(file);
              const url = resolveUrl(file.url);

              return (
                <figure
                  key={file.id}
                  className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-gray-200 hover:shadow-md"
                >
                  <div className={cn("relative aspect-4/3", variant.plate)}>
                    {isImage(file.content_type) ? (
                      <img
                        src={url}
                        alt={file.name}
                        loading="lazy"
                        className="size-full object-contain"
                      />
                    ) : (
                      <div className="flex size-full flex-col items-center justify-center gap-2">
                        <type.Icon
                          size={30}
                          className={cn(
                            variant.plate === "bg-gray-900"
                              ? "text-gray-500"
                              : "text-gray-400"
                          )}
                        />
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
                            type.tone
                          )}
                        >
                          {type.label}
                        </span>
                      </div>
                    )}

                    {/* actions reveal on hover, and on keyboard focus within */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                      <FileActions
                        file={file}
                        canMutate={canMutate}
                        onPreview={() => setViewerIndex(index)}
                        onDelete={() => setPendingDelete(file)}
                      />
                    </div>
                  </div>

                  <figcaption className="flex items-center gap-2 p-3">
                    <span
                      className={cn(
                        "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
                        type.tone
                      )}
                    >
                      {type.label}
                    </span>
                    <div className="min-w-0">
                      <p
                        className="truncate text-sm font-medium text-gray-900"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-500">
                        {formatBytes(file.byte_size)}
                        {file.created_at && ` · ${formatDate(file.created_at)}`}
                      </p>
                    </div>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
            {visible.map((file, index) => {
              const type = describeType(file);

              return (
                <div
                  key={file.id}
                  className="group flex items-center gap-3 border-b border-gray-100 p-3 transition-colors last:border-b-0 hover:bg-gray-50/80"
                >
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg ring-1 ring-inset",
                      type.tone
                    )}
                  >
                    {isImage(file.content_type) ? (
                      <img
                        src={resolveUrl(file.url)}
                        alt={file.name}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : (
                      <type.Icon size={18} />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-sm font-medium text-gray-900"
                      title={file.name}
                    >
                      {file.name}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      <span className="font-medium text-gray-600">
                        {type.label}
                      </span>
                      {" · "}
                      {formatBytes(file.byte_size)}
                      {file.created_at && ` · ${formatDate(file.created_at)}`}
                    </p>
                  </div>

                  <FileActions
                    file={file}
                    canMutate={canMutate}
                    onPreview={() => setViewerIndex(index)}
                    onDelete={() => setPendingDelete(file)}
                    className="opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100"
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Drag overlay — the whole tab is the drop target */}
      {dragging && canMutate && (
        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-(--color-primary) bg-emerald-50/85 backdrop-blur-[1px]">
          <Upload size={26} className="mb-2 text-(--color-primary-dark)" />
          <p className="font-semibold text-gray-900">{variant.dropTitle}</p>
          <p className="mt-0.5 text-xs text-gray-600">{variant.hint}</p>
        </div>
      )}

      {/* Lightbox */}
      <Dialog
        open={active !== null}
        onOpenChange={(open) => !open && setViewerIndex(null)}
      >
        <DialogContent className="max-w-5xl gap-3 p-4">
          <DialogHeader>
            <DialogTitle className="truncate pr-8 text-base">
              {active?.name}
            </DialogTitle>
          </DialogHeader>

          <div
            className={cn(
              "relative flex min-h-[50vh] items-center justify-center overflow-hidden rounded-lg",
              active && isImage(active.content_type)
                ? "bg-gray-900"
                : "bg-gray-100"
            )}
          >
            {active && isImage(active.content_type) ? (
              <img
                src={resolveUrl(active.url)}
                alt={active.name}
                className="max-h-[70vh] w-auto object-contain"
              />
            ) : active && isPdf(active.content_type) ? (
              <iframe
                src={resolveUrl(active.url)}
                title={active.name}
                className="h-[70vh] w-full bg-white"
              />
            ) : (
              <div className="p-10 text-center">
                <FileIcon size={34} className="mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Preview is not available for this file type.
                </p>
                {active && (
                  <a
                    href={resolveUrl(active.url)}
                    download={active.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 text-sm text-(--color-primary-dark) hover:underline"
                  >
                    <Download size={14} />
                    Download to open it
                  </a>
                )}
              </div>
            )}

            {visible.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label={`Previous ${variant.subject}`}
                  onClick={() =>
                    setViewerIndex((index) =>
                      index === null
                        ? index
                        : (index - 1 + visible.length) % visible.length
                    )
                  }
                  className="absolute left-2 rounded-full bg-white/90 p-2 text-gray-800 shadow-sm hover:bg-white"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label={`Next ${variant.subject}`}
                  onClick={() =>
                    setViewerIndex((index) =>
                      index === null ? index : (index + 1) % visible.length
                    )
                  }
                  className="absolute right-2 rounded-full bg-white/90 p-2 text-gray-800 shadow-sm hover:bg-white"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              {active && formatBytes(active.byte_size)}
              {active?.created_at && ` · ${formatDate(active.created_at)}`}
              {visible.length > 1 &&
                ` · ${(viewerIndex ?? 0) + 1} of ${visible.length}`}
            </p>
            {active && (
              <a
                href={resolveUrl(active.url)}
                download={active.name}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-(--color-primary-dark) hover:underline"
              >
                <Download size={14} />
                Download
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        itemName={pendingDelete?.name ?? variant.subject}
        onConfirm={confirmDelete}
        reloadTable={onChanged}
      />
    </div>
  );
}
