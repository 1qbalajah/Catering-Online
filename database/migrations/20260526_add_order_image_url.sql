alter table if exists pemesanans
  add column if not exists image_url text;

comment on column pemesanans.image_url is 'Snapshot URL gambar paket saat pesanan dibuat.';
