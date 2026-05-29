"use client";

import Link from "next/link";
import CheckoutGate from "@/components/CheckoutGate";
import { formatRupiah, type Paket } from "@/lib/packages";

type PackageCardProps = {
  paket: Paket;
  isLoggedIn?: boolean;
};

export default function PackageCard({ paket, isLoggedIn = false }: PackageCardProps) {
  return (
    <article
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #f0f0f0",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-4px)";
        el.style.boxShadow = "0 12px 40px rgba(0,0,0,0.08)";
        el.style.borderColor = "#f5a623";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = "none";
        el.style.borderColor = "#f0f0f0";
      }}
    >
      {/* Image */}
      <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: "#f8f9fc" }}>
        {paket.foto1 ? (
          <img
            alt={paket.nama_paket}
            src={paket.foto1}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = "scale(1)";
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #fff3e0, #ffe0b2)",
              fontSize: 48,
            }}
          >
            🍽️
          </div>
        )}
        {/* Category badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            padding: "5px 12px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            color: "#1a1a2e",
            letterSpacing: 0.3,
          }}
        >
          {paket.kategori}
        </div>
        {/* Pax badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "rgba(245,166,35,0.9)",
            backdropFilter: "blur(8px)",
            padding: "5px 12px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          {paket.jumlah_pax} pax
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "20px 20px 0", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Jenis tag */}
        <span
          style={{
            display: "inline-block",
            background: "#fff3e0",
            color: "#e8941a",
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 10,
            width: "fit-content",
          }}
        >
          {paket.jenis}
        </span>

        {/* Title */}
        <h3
          style={{
            fontSize: 17,
            fontWeight: 700,
            color: "#1a1a2e",
            lineHeight: 1.3,
            marginBottom: 8,
            letterSpacing: -0.3,
          }}
        >
          {paket.nama_paket}
        </h3>

        {/* Description */}
        <p
          style={{
            fontSize: 13,
            color: "#9ca3af",
            lineHeight: 1.6,
            marginBottom: 20,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {paket.deskripsi}
        </p>

        {/* Divider */}
        <div style={{ height: 1, background: "#f0f0f0", margin: "0 -20px" }} />

        {/* Footer */}
        <div style={{ padding: "16px 0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <span style={{ fontSize: 11, color: "#9ca3af", display: "block", marginBottom: 2, fontWeight: 500 }}>
              Mulai dari
            </span>
            <strong style={{ fontSize: 20, fontWeight: 800, color: "#f5a623", letterSpacing: -0.5 }}>
              {formatRupiah(paket.harga_paket)}
            </strong>
          </div>
          <CheckoutGate href={`/paket/${paket.id}/beli`} isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </article>
  );
}
