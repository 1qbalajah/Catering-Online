"use client";

import { useActionState } from "react";
import { createPaymentMethodAction, updatePaymentMethodAction } from "@/actions/payments";
import type { PaymentMethod } from "@/lib/payments";

const initialState = { error: "" };

export default function PaymentMethodForm({ method }: { method?: PaymentMethod }) {
  const detail = method?.detail_jenis_pembayarans?.[0];
  const [state, action, pending] = useActionState(method ? updatePaymentMethodAction : createPaymentMethodAction, initialState);

  return (
    <form action={action} className="form">
      {state?.error ? <div className="error">{state.error}</div> : null}
      {method ? (
        <>
          <input name="id" type="hidden" value={method.id} />
          <input name="detail_id" type="hidden" value={detail?.id ?? ""} />
          <input name="current_logo" type="hidden" value={detail?.logo ?? ""} />
        </>
      ) : null}
      <label className="field">
        <span>Metode Pembayaran</span>
        <input
          className="input"
          defaultValue={method?.metode_pembayaran ?? ""}
          name="metode_pembayaran"
          placeholder="Transfer Bank / COD / E-Wallet"
          required
        />
      </label>
      <label className="field">
        <span>No Rekening / Nomor Pembayaran</span>
        <input className="input" defaultValue={detail?.no_rek ?? ""} name="no_rek" placeholder="1234567890" required />
      </label>
      <label className="field">
        <span>Tempat Bayar</span>
        <input className="input" defaultValue={detail?.tempat_bayar ?? ""} name="tempat_bayar" placeholder="BCA / GoPay / COD" required />
      </label>
      <label className="field">
        <span>Logo</span>
        <input className="input" accept="image/jpeg,image/png,image/webp" name="logo" type="file" />
      </label>
      <button className="button" disabled={pending} type="submit">
        {pending ? "Menyimpan..." : method ? "Update Metode" : "Tambah Metode"}
      </button>
    </form>
  );
}
