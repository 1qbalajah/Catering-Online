"use client";

import { useActionState } from "react";
import { rejectOrderAction } from "@/actions/orders";

const initialState = { error: "", success: "" };

export default function RejectOrderForm({ orderId }: { orderId: string }) {
  const [state, action, pending] = useActionState(rejectOrderAction, initialState);

  return (
    <form action={action} className="reject-form">
      <input name="id" type="hidden" value={orderId} />
      <textarea
        className="input textarea"
        name="alasan_pembatalan"
        placeholder="Alasan pembatalan"
        required
      />
      {state?.error ? <div className="error">{state.error}</div> : null}
      {state?.success ? <div className="success">{state.success}</div> : null}
      <button className="button compact danger" disabled={pending} type="submit">
        Batalkan Pesanan
      </button>
    </form>
  );
}
