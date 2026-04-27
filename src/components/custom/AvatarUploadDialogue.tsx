/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Upload, X } from "lucide-react";
import { CustomButton } from "../../components/custom/Button";

interface AvatarUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (formData: FormData) => Promise<void>; // 🔥 injected API
  onSuccess: () => Promise<void>;
  title?: string;
  fieldName?: string; // default: "avatar"
}

export function AvatarUploadDialog({
  open,
  onOpenChange,
  onUpload,
  onSuccess,
  title = "Upload Avatar",
  fieldName = "avatar",
}: AvatarUploadDialogProps) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append(fieldName, file);

      await onUpload(formData);

      toast.success("Avatar uploaded successfully!");
      handleClose();
      await onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {preview ? (
            <div className="relative w-32 h-32 mx-auto">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 mx-auto bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
              <Upload size={32} className="text-gray-400" />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md cursor-pointer text-sm"
          />

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <CustomButton
              variantType="primary"
              onClick={handleUpload}
              disabled={!file || loading}
            >
              {loading ? "Uploading..." : "Upload"}
            </CustomButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
