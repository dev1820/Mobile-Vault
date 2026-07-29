import { useState } from "react";
import type { ProductImage } from "../../types/product";
import { imageUrl } from "../../api/client";

export function ImageGallery({ images, alt }: { images: ProductImage[]; alt: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

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
      <div className="aspect-square overflow-hidden rounded-lg bg-vault-charcoal">
        <img
          src={imageUrl(active.url)}
          alt={alt}
          className="h-full w-full snap-center object-cover"
        />
      </div>
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
    </div>
  );
}
