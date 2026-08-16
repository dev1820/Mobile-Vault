import { useState } from "react";
import { imageUrl } from "../../api/client";
import { Lightbox } from "../ui/Lightbox";

interface GalleryImage {
  id: number;
  url: string;
}

export function ImageGallery({ images, alt }: { images: GalleryImage[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-vault-charcoal text-vault-silver/30">
        No Photos Available
      </div>
    );
  }

  const active = images[activeIndex] ?? images[0];

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightboxOpen(true)}
        className="block aspect-square w-full cursor-zoom-in overflow-hidden rounded-lg bg-vault-charcoal"
      >
        <img
          src={imageUrl(active.url)}
          alt={alt}
          className="h-full w-full snap-center object-cover"
        />
      </button>
      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                index === activeIndex ? "border-vault-gold" : "border-transparent opacity-70"
              }`}
            >
              <img src={imageUrl(image.url)} alt={`${alt} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
      {lightboxOpen && (
        <Lightbox
          images={images}
          activeIndex={activeIndex}
          alt={alt}
          onClose={() => setLightboxOpen(false)}
          onNavigate={setActiveIndex}
        />
      )}
    </div>
  );
}
