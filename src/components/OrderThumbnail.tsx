import ImageWithFallback from "@/components/ImageWithFallback";

type OrderThumbnailProps = {
  src?: string | null;
  alt?: string;
};

export default function OrderThumbnail({ src, alt = "Paket catering" }: OrderThumbnailProps) {
  return (
    <div className="order-thumb" aria-label={alt}>
      <ImageWithFallback src={src} alt={alt} fallbackClassName="order-thumb-fallback" iconSize={22} />
    </div>
  );
}
