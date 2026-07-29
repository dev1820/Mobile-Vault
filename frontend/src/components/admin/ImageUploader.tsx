import { useRef, useState } from "react";
import type { ProductImage } from "../../types/product";
import { imageUrl } from "../../api/client";
import { Button } from "../ui/Button";

interface ImageUploaderProps {
  images: ProductImage[];
  onUpload: (files: File[]) => Promise<void>;
  onDeleteImage: (imageId: number) => Promise<void>;
}

export function ImageUploader({ images, onUpload, onDeleteImage }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);
    try {
      await onUpload(Array.from(fileList));
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(imageId: number) {
    setDeletingId(imageId);
    try {
      await onDeleteImage(imageId);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      {images.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative aspect-square overflow-hidden rounded-md bg-vault-charcoal-light">
              <img src={imageUrl(image.url)} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => handleDelete(image.id)}
                disabled={deletingId === image.id}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-100"
                aria-label="Remove image"
              >
                {deletingId === image.id ? "…" : "×"}
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        id="image-upload-input"
      />
      <label htmlFor="image-upload-input">
        <Button
          type="button"
          variant="secondary"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Add Photos"}
        </Button>
      </label>
      <p className="mt-2 text-xs text-vault-silver/60">JPG, PNG or WEBP. You can select multiple photos at once.</p>
    </div>
  );
}
