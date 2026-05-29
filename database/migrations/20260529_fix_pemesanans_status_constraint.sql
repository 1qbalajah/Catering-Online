update pemesanans
set status_pesan = 'Menunggu Konfirmasi'
where status_pesan is null
   or status_pesan in ('Pending', 'Menunggu');

update pemesanans
set status_pesan = 'Menunggu Kurir'
where status_pesan in ('Menunggu Pengiriman', 'Siap Dikirim');

update pemesanans
set status_pesan = 'Selesai'
where status_pesan in ('Tiba Ditujuan', 'Tiba Di Tujuan', 'Tiba di Tujuan');

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
  check (
    status_pesan in (
      'Menunggu Konfirmasi',
      'Sedang Diproses',
      'Menunggu Kurir',
      'Dibatalkan',
      'Selesai'
    )
  );
