"use client";

import { useActionState } from "react";
import { finishDeliveryAction } from "@/actions/orders";

const initialState = { error: "" };

export default function DeliveryFinishForm({ id, compact = false }: { id: string; compact?: boolean }) {
  const [state, action, pending] = useActionState(finishDeliveryAction, initialState);

  return (
    <form action={action} className="actions-cell">
      {state?.error ? <div className="error">{state.error}</div> : null}
      <input name="id" type="hidden" value={id} />
      <input accept="image/jpeg,image/png,image/webp" className="input delivery-file-input" name="bukti_foto" type="file" required />
      <button className="button compact" disabled={pending} type="submit">
        {compact ? "Konfirmasi Sampai" : "Paket Telah Sampai"}
      </button>
    </form>
  );
}
