import { createServiceClient } from "@/lib/supabase";

const publicBuckets = ["profiles", "packages", "payments", "deliveries"] as const;

export type PublicBucket = (typeof publicBuckets)[number];

export async function ensurePublicBucket(bucket: PublicBucket) {
  const supabase = createServiceClient();
  const { data } = await supabase.storage.getBucket(bucket);

  if (!data) {
    await supabase.storage.createBucket(bucket, {
      public: true,
      fileSizeLimit: 1024 * 1024 * 5,
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    });
  }
}

export async function uploadPublicImage(bucket: PublicBucket, file: File, folder: string) {
  if (!file.size) return null;

  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Format gambar harus JPG, PNG, atau WEBP.");
  }

  if (file.size > 1024 * 1024 * 5) {
    throw new Error("Ukuran gambar maksimal 5MB.");
  }

  await ensurePublicBucket(bucket);

  const supabase = createServiceClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}
