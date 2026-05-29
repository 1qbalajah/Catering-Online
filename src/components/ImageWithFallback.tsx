"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";

type ImageWithFallbackProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName: string;
  iconSize?: number;
};

export function cleanImageUrl(src?: string | null) {
  const value = typeof src === "string" ? src.trim() : "";
  return value.length > 0 ? value : null;
}

export default function ImageWithFallback({
  src,
  alt,
  className,
  fallbackClassName,
  iconSize = 32,
}: ImageWithFallbackProps) {
  const [failed, setFailed] = useState(false);
  const imageUrl = cleanImageUrl(src);

  if (!imageUrl || failed) {
    return (
      <div className={fallbackClassName}>
        <ImageIcon size={iconSize} aria-hidden="true" />
      </div>
    );
  }

  return <img src={imageUrl} alt={alt} className={className} onError={() => setFailed(true)} />;
}
