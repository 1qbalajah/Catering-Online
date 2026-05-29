update pengirimans
set status_kirim = 'Menunggu Kurir'
where status_kirim is null
   or status_kirim in ('Menunggu', 'Pending', 'Menunggu Konfirmasi');

update pengirimans
set status_kirim = 'Sedang Dikirim'
where status_kirim in ('Dikirim', 'Dalam Pengiriman');

update pengirimans
set status_kirim = 'Tiba Ditujuan'
where status_kirim in ('Selesai', 'Tiba Di Tujuan', 'Tiba di Tujuan', 'Tiba Ditujukan');

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
