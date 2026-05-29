"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/actions/auth";

const initialState = {
  error: "",
};

export default function LoginForm({ next = "" }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialState);

  return (
    <form action={action} className="form">
      {state?.error ? <div className="error">{state.error}</div> : null}
      <input name="next" type="hidden" value={next} />
      <label className="field">
        <span>Email</span>
        <input className="input" name="email" placeholder="user@email.com" type="email" required />
      </label>
      <label className="field">
        <span>Password</span>
        <input className="input" name="password" placeholder="Minimal 8 karakter" type="password" required />
      </label>
      <button className="button" disabled={pending} type="submit">
        {pending ? "Memproses..." : "Login"}
      </button>
      <p className="muted" style={{ margin: 0 }}>
        Belum punya akun? <Link href="/register">Register</Link>
      </p>
    </form>
  );
}
