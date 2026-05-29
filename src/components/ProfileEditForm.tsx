"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/actions/profile";
import type { PelangganProfile } from "@/lib/pelanggan";

const initialState = {
  error: "",
};

export default function ProfileEditForm({ profile }: { profile: PelangganProfile }) {
  const [state, action, pending] = useActionState(updateProfileAction, initialState);

  return (
    <form action={action} className="form">
      {state?.error ? <div className="error">{state.error}</div> : null}
      <label className="field">
        <span>Nama Pelanggan</span>
        <input className="input" defaultValue={profile.nama_pelanggan} name="nama_pelanggan" required />
      </label>
      <label className="field">
        <span>Email</span>
        <input className="input" defaultValue={profile.email} disabled />
      </label>
      <label className="field">
        <span>Tanggal Lahir</span>
        <input className="input" defaultValue={profile.tgl_lahir ?? ""} name="tgl_lahir" type="date" />
      </label>
      <label className="field">
        <span>Telepon</span>
        <input className="input" defaultValue={profile.telepon ?? ""} name="telepon" />
      </label>
      <label className="field">
        <span>Alamat Utama</span>
        <input className="input" defaultValue={profile.alamat1 ?? ""} name="alamat1" required />
      </label>
      <label className="field">
        <span>Alamat Cadangan 1</span>
        <input className="input" defaultValue={profile.alamat2 ?? ""} name="alamat2" />
      </label>
      <label className="field">
        <span>Alamat Cadangan 2</span>
        <input className="input" defaultValue={profile.alamat3 ?? ""} name="alamat3" />
      </label>
      <label className="field">
        <span>Kartu Identitas</span>
        <input className="input" defaultValue={profile.kartu_id ?? ""} name="kartu_id" />
      </label>
      <label className="field">
        <span>Foto Profile</span>
        <input className="input" accept="image/jpeg,image/png,image/webp" name="foto" type="file" />
      </label>
      <button className="button" disabled={pending} type="submit">
        {pending ? "Menyimpan..." : "Simpan Profile"}
      </button>
    </form>
  );
}
