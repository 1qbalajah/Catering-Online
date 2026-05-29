-- Dummy data untuk table pakets.
-- Catatan: foto1/foto2/foto3 sebaiknya diganti dengan URL public dari Supabase Storage bucket `packages`.

INSERT INTO pakets (
    nama_paket,
    jenis,
    kategori,
    jumlah_pax,
    harga_paket,
    deskripsi,
    foto1,
    foto2,
    foto3
)
VALUES
(
    'Paket Wedding Silver',
    'Prasmanan',
    'Pernikahan',
    100,
    5000000,
    'Menu prasmanan lengkap untuk resepsi pernikahan dengan hidangan utama, sayur, lauk, dessert, dan minuman.',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/wedding-silver-1.jpg',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/wedding-silver-2.jpg',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/wedding-silver-3.jpg'
),
(
    'Paket Wedding Gold',
    'Prasmanan',
    'Pernikahan',
    200,
    9500000,
    'Paket premium untuk pernikahan dengan pilihan menu lebih lengkap dan layanan penyajian acara besar.',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/wedding-gold-1.jpg',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/wedding-gold-2.jpg',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/wedding-gold-3.jpg'
),
(
    'Paket Selamatan Keluarga',
    'Prasmanan',
    'Selamatan',
    50,
    1800000,
    'Menu rumahan untuk acara selamatan keluarga dengan nasi, ayam, sayur, sambal, dan buah.',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/selamatan-1.jpg',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/selamatan-2.jpg',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/selamatan-3.jpg'
),
(
    'Paket Ulang Tahun Ceria',
    'Box',
    'Ulang Tahun',
    40,
    1200000,
    'Nasi box praktis untuk ulang tahun dengan menu anak dan keluarga, lengkap snack dan minuman.',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/ulang-tahun-1.jpg',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/ulang-tahun-2.jpg',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/ulang-tahun-3.jpg'
),
(
    'Paket Studi Tour Hemat',
    'Box',
    'Studi Tour',
    80,
    2400000,
    'Paket nasi box untuk perjalanan sekolah atau kampus dengan menu tahan perjalanan dan mudah dibagikan.',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/studi-tour-1.jpg',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/studi-tour-2.jpg',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/studi-tour-3.jpg'
),
(
    'Paket Rapat Executive',
    'Box',
    'Rapat',
    30,
    1050000,
    'Nasi box meeting dengan menu profesional, snack, dan minuman untuk kebutuhan rapat kantor.',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/rapat-1.jpg',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/rapat-2.jpg',
    'https://agvmwfflbndxhdrjfamm.supabase.co/storage/v1/object/public/packages/dummy/rapat-3.jpg'
);
