alter table if exists detail_pemesanans
  add column if not exists jumlah integer,
  add column if not exists harga_satuan numeric;

update detail_pemesanans dp
set
  jumlah = coalesce(dp.jumlah, 1),
  harga_satuan = coalesce(dp.harga_satuan, p.harga_paket, dp.subtotal)
from pakets p
where p.id = dp.id_paket;

alter table if exists detail_pemesanans
  alter column jumlah set default 1;
