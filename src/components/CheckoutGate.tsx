"use client";

import Link from "next/link";
import { useState } from "react";

export default function CheckoutGate({ href, isLoggedIn }: { href: string; isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  const btnBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "11px 26px",
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    textDecoration: "none",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    flexShrink: 0,
    fontFamily: "inherit",
  };

  const primaryBtn: React.CSSProperties = {
    ...btnBase,
    background: "linear-gradient(135deg, #f5a623 0%, #f7b733 100%)",
    color: "#fff",
    boxShadow: "0 2px 10px rgba(245,166,35,0.25)",
  };

  if (isLoggedIn) {
    return (
      <Link href={href} style={primaryBtn}>
        Beli
      </Link>
    );
  }

  return (
    <>
      <button onClick={() => setOpen(true)} type="button" style={primaryBtn}>
        Beli
      </button>

      {open && (
        <>
          <style>{`
            @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
            .checkout-modal-enter { animation: modalIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
          `}</style>
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(15, 23, 42, 0.45)",
              backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              padding: 24,
            }}
            onClick={() => setOpen(false)}
          >
            <div
              className="checkout-modal-enter"
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "32px 28px 26px",
                maxWidth: 380,
                width: "100%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)",
                textAlign: "center",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  background: "#fff7ed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                  fontSize: 22,
                }}
              >
                🔒
              </div>
              
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>
                Login Diperlukan
              </h3>
              
              <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 24 }}>
                Silakan masuk ke akun Anda terlebih dahulu untuk melanjutkan pemesanan paket catering.
              </p>

              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <Link
                  href={`/login?next=${encodeURIComponent(href)}`}
                  style={primaryBtn}
                >
                  Masuk
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  type="button"
                  style={{
                    ...btnBase,
                    background: "transparent",
                    color: "#4b5563",
                    border: "1.5px solid #e5e7eb",
                  }}
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
