/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  FileWarning,
  ImageOff,
  Maximize2,
  Scan,
  Trash2,
  Upload,
  X,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
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
import { addPatientXRays, removePatientXRay } from "./patientApi";

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const ACCEPTED = "image/*,application/pdf";

const resolveUrl = (url: string) =>
  url.startsWith("http") ? url : `${BASE_URL}${url}`;

const formatBytes = (bytes: number) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
};

const isImage = (contentType?: string) => !!contentType?.startsWith("image/");

type PatientXRaysTabProps = {
  companyId: number;
  patientId: number;
  xRays: Attachment[];
  /** Refetches the patient so the grid reflects what the server now holds. */
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

export function PatientXRaysTab({
  companyId,
  patientId,
  xRays,
  onChanged,
}: PatientXRaysTabProps) {
  const [staged, setStaged] = useState<StagedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Attachment | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const totalBytes = xRays.reduce((sum, x) => sum + (x.byte_size ?? 0), 0);

  /**
   * Every write re-sends the surviving X-rays by signed id. Without them we can
   * only replace the whole collection, so the write actions are disabled rather
   * than silently purging the patient's history.
   */
  const canMutate = xRays.every((x) => Boolean(x.signed_id));
  const survivingIds = useMemo(
    () => xRays.map((x) => x.signed_id).filter(Boolean),
    [xRays]
  );

  const acceptFiles = useCallback((incoming: FileList | null) => {
    if (!incoming?.length) return;

    const accepted: StagedFile[] = [];
    const rejected: string[] = [];

    Array.from(incoming).forEach((file) => {
      if (!isImage(file.type) && file.type !== "application/pdf") {
        rejected.push(`${file.name} — not an image or PDF`);
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
  }, []);

  const clearStaged = useCallback(() => {
    setStaged((current) => {
      revoke(current);
      return [];
    });
  }, []);

  const handleUpload = async () => {
    if (!staged.length) return;

    setUploading(true);
    try {
      await addPatientXRays(
        companyId,
        patientId,
        survivingIds,
        staged.map((entry) => entry.file)
      );
      toast.success(
        `${staged.length} X-ray${staged.length > 1 ? "s" : ""} uploaded`
      );
      clearStaged();
      await onChanged();
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload X-rays");
    } finally {
      setUploading(false);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    await removePatientXRay(
      companyId,
      patientId,
      xRays.filter((x) => x.id !== pendingDelete.id).map((x) => x.signed_id)
    );
  };

  // Arrow keys / Esc move through the lightbox.
  useEffect(() => {
    if (viewerIndex === null) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight")
        setViewerIndex((index) =>
          index === null ? index : (index + 1) % xRays.length
        );
      if (event.key === "ArrowLeft")
        setViewerIndex((index) =>
          index === null ? index : (index - 1 + xRays.length) % xRays.length
        );
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewerIndex, xRays.length]);

  const active = viewerIndex === null ? null : xRays[viewerIndex];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-100 bg-white p-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-(--color-primary-dark)">
            <Scan size={20} />
          </span>
          <div>
            <h2 className="font-semibold text-gray-900">Medical X-Rays</h2>
            <p className="text-xs text-gray-500">
              {xRays.length} file{xRays.length === 1 ? "" : "s"}
              {totalBytes > 0 && ` · ${formatBytes(totalBytes)} total`}
            </p>
          </div>
        </div>

        <CustomButton
          variantType="primary"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || !canMutate}
        >
          <Upload size={16} className="mr-1" />
          Add X-rays
        </CustomButton>
      </div>

      {!canMutate && (
        <p className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <FileWarning size={16} className="mt-0.5 shrink-0" />
          These X-rays were loaded without an attachment <code>signed_id</code>,
          so uploading or deleting would replace the whole set. Refresh once the
          API returns <code>signed_id</code> for each file.
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED}
        multiple
        hidden
        onChange={(event) => {
          acceptFiles(event.target.files);
          // let the same file be picked again after removing it
          event.target.value = "";
        }}
      />

      {/* Drop zone */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (canMutate) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (canMutate) acceptFiles(event.dataTransfer.files);
        }}
        onClick={() => canMutate && inputRef.current?.click()}
        className={cn(
          "cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          dragging
            ? "border-(--color-primary) bg-primary/10"
            : "border-gray-200 bg-gray-50/60 hover:border-gray-300",
          !canMutate && "pointer-events-none opacity-50"
        )}
      >
        <Upload size={22} className="mx-auto mb-2 text-gray-400" />
        <p className="text-sm font-medium text-gray-700">
          Drop X-ray images here, or click to browse
        </p>
        <p className="mt-0.5 text-xs text-gray-500">
          JPG, PNG or PDF · up to {formatBytes(MAX_FILE_BYTES)} each
        </p>
      </div>

      {/* Staged, not yet uploaded */}
      {staged.length > 0 && (
        <div className="rounded-lg border border-gray-100 bg-white p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-gray-900">
              {staged.length} file{staged.length === 1 ? "" : "s"} ready to
              upload
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearStaged}
                disabled={uploading}
              >
                Clear
              </Button>
              <CustomButton
                variantType="primary"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading && <Loader className="mr-1 text-white" />}
                {uploading ? "Uploading…" : "Upload"}
              </CustomButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {staged.map(({ file, url }, index) => (
              <div
                key={`${file.name}-${index}`}
                className="relative overflow-hidden rounded-lg border border-gray-200"
              >
                <div className="flex aspect-square items-center justify-center bg-gray-900">
                  {url ? (
                    <img
                      src={url}
                      alt={file.name}
                      className="size-full object-contain"
                    />
                  ) : (
                    <FileWarning size={24} className="text-gray-400" />
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
                  <X size={12} />
                </button>
                <p className="truncate px-2 py-1.5 text-[11px] text-gray-600">
                  {file.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Gallery */}
      {xRays.length === 0 ? (
        <div className="rounded-lg border border-gray-100 bg-white p-12 text-center">
          <ImageOff size={40} className="mx-auto mb-3 text-gray-300" />
          <p className="font-medium text-gray-700">No X-rays yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Uploaded radiographs for this patient will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {xRays.map((xRay, index) => {
            const url = resolveUrl(xRay.url);

            return (
              <figure
                key={xRay.id}
                className="group overflow-hidden rounded-lg border border-gray-100 bg-white transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-square bg-gray-900">
                  {isImage(xRay.content_type) ? (
                    <img
                      src={url}
                      alt={xRay.name}
                      loading="lazy"
                      className="size-full object-contain"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <FileWarning size={28} className="text-gray-500" />
                    </div>
                  )}

                  {/* actions reveal on hover, and on keyboard focus within */}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => setViewerIndex(index)}
                      title="View full size"
                      aria-label={`View ${xRay.name}`}
                      className="rounded-full bg-white/95 p-2 text-gray-800 transition-transform hover:scale-105"
                    >
                      <Maximize2 size={16} />
                    </button>
                    <a
                      href={url}
                      download={xRay.name}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Download"
                      aria-label={`Download ${xRay.name}`}
                      className="rounded-full bg-white/95 p-2 text-gray-800 transition-transform hover:scale-105"
                    >
                      <Download size={16} />
                    </a>
                    <button
                      type="button"
                      disabled={!canMutate}
                      onClick={() => setPendingDelete(xRay)}
                      title="Delete"
                      aria-label={`Delete ${xRay.name}`}
                      className="rounded-full bg-white/95 p-2 text-red-600 transition-transform hover:scale-105 disabled:opacity-40"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <figcaption className="p-3">
                  <p
                    className="truncate text-sm font-medium text-gray-900"
                    title={xRay.name}
                  >
                    {xRay.name}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {formatBytes(xRay.byte_size)}
                    {xRay.created_at &&
                      ` · ${new Date(xRay.created_at).toLocaleDateString()}`}
                  </p>
                </figcaption>
              </figure>
            );
          })}
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

          <div className="relative flex min-h-[50vh] items-center justify-center rounded-lg bg-gray-900">
            {active && isImage(active.content_type) ? (
              <img
                src={resolveUrl(active.url)}
                alt={active.name}
                className="max-h-[70vh] w-auto object-contain"
              />
            ) : (
              <p className="p-10 text-sm text-gray-300">
                Preview is not available for this file type.
              </p>
            )}

            {xRays.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Previous X-ray"
                  onClick={() =>
                    setViewerIndex((index) =>
                      index === null
                        ? index
                        : (index - 1 + xRays.length) % xRays.length
                    )
                  }
                  className="absolute left-2 rounded-full bg-white/90 p-2 text-gray-800 hover:bg-white"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next X-ray"
                  onClick={() =>
                    setViewerIndex((index) =>
                      index === null ? index : (index + 1) % xRays.length
                    )
                  }
                  className="absolute right-2 rounded-full bg-white/90 p-2 text-gray-800 hover:bg-white"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              {active && formatBytes(active.byte_size)}
              {xRays.length > 1 &&
                ` · ${(viewerIndex ?? 0) + 1} of ${xRays.length}`}
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
        itemName={pendingDelete?.name ?? "X-ray"}
        onConfirm={confirmDelete}
        reloadTable={onChanged}
      />
    </div>
  );
}
