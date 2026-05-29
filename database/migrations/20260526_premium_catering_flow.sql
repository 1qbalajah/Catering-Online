alter table if exists pemesanans
  add column if not exists catatan text,
  add column if not exists alasan_pembatalan text,
  add column if not exists invoice_code text,
  add column if not exists deleted_at timestamptz;

alter table if exists pengirimans
  add column if not exists no_resi text,
  add column if not exists estimasi_tiba timestamptz;

alter table if exists pengirimans
  alter column id_user drop not null;

update pemesanans
set status_pesan = 'Sedang Diproses'
where status_pesan in ('Menunggu Kurir', 'Selesai');

update pengirimans
set status_kirim = 'Menunggu Kurir'
where status_kirim is null;

do $$
declare
  constraint_name text;
begin
  select conname into constraint_name
  from pg_constraint
  where conrelid = 'pemesanans'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%status_pesan%';

  if constraint_name is not null then
    execute format('alter table pemesanans drop constraint %I', constraint_name);
  end if;
end $$;

alter table pemesanans
  add constraint pemesanans_status_pesan_check
  check (status_pesan in ('Menunggu Konfirmasi', 'Sedang Diproses', 'Dibatalkan'));

do $$
declare
  constraint_name text;
begin
  select conname into constraint_name
  from pg_constraint
  where conrelid = 'pengirimans'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%status_kirim%';

  if constraint_name is not null then
    execute format('alter table pengirimans drop constraint %I', constraint_name);
  end if;
end $$;

alter table pengirimans
  add constraint pengirimans_status_kirim_check
  check (status_kirim in ('Menunggu Kurir', 'Sedang Dikirim', 'Tiba Ditujuan'));

create unique index if not exists pemesanans_invoice_code_idx
  on pemesanans(invoice_code)
  where invoice_code is not null;

create index if not exists pengirimans_id_pesan_idx on pengirimans(id_pesan);
create index if not exists pemesanans_status_tgl_idx on pemesanans(status_pesan, tgl_pesan);
