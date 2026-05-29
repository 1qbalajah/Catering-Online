"use client";

import { useActionState } from "react";
import { createPackageAction, updatePackageAction } from "@/actions/packages";
import type { Paket } from "@/lib/packages";

const initialState = { error: "" };

const jenisOptions = ["Prasmanan", "Box"];
const kategoriOptions = ["Pernikahan", "Selamatan", "Ulang Tahun", "Studi Tour", "Rapat"];

export default function PackageForm({ paket }: { paket?: Paket }) {
  const action = paket ? updatePackageAction : createPackageAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="form">
      {state?.error ? <div className="error">{state.error}</div> : null}
      {paket ? <input name="id" type="hidden" value={paket.id} /> : null}
      <label className="field">
        <span>Nama Paket</span>
        <input className="input" defaultValue={paket?.nama_paket ?? ""} name="nama_paket" required />
      </label>
      <label className="field">
        <span>Jenis</span>
        <select className="input" defaultValue={paket?.jenis ?? "Prasmanan"} name="jenis">
          {jenisOptions.map((jenis) => (
            <option key={jenis}>{jenis}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Kategori</span>
        <select className="input" defaultValue={paket?.kategori ?? "Pernikahan"} name="kategori">
          {kategoriOptions.map((kategori) => (
            <option key={kategori}>{kategori}</option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Jumlah Pax</span>
        <input className="input" defaultValue={paket?.jumlah_pax ?? ""} min={1} name="jumlah_pax" type="number" />
      </label>
      <label className="field">
        <span>Harga Paket</span>
        <input className="input" defaultValue={paket?.harga_paket ?? ""} min={1} name="harga_paket" type="number" />
      </label>
      <label className="field">
        <span>Deskripsi Makanan</span>
        <textarea className="input textarea" defaultValue={paket?.deskripsi ?? ""} name="deskripsi" required />
      </label>
      <label className="field">
        <span>Foto 1</span>
        <input className="input" accept="image/jpeg,image/png,image/webp" name="foto1" type="file" />
      </label>
      <label className="field">
        <span>Foto 2</span>
        <input className="input" accept="image/jpeg,image/png,image/webp" name="foto2" type="file" />
      </label>
      <label className="field">
        <span>Foto 3</span>
        <input className="input" accept="image/jpeg,image/png,image/webp" name="foto3" type="file" />
      </label>
      <button className="button" disabled={pending} type="submit">
        {pending ? "Menyimpan..." : "Simpan Paket"}
      </button>
    </form>
  );
}
