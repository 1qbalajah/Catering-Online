import LoginForm from "@/components/LoginForm";
import Link from "next/link";

type LoginPageProps = {
  searchParams: Promise<{
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="auth-shell">
      <section className="auth-panel">
        {/* Back Button - CSS only hover */}
        <Link
          href="/"
          className="back-button"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            color: "#f97316",
            fontSize: "13px",
            fontWeight: 600,
            textDecoration: "none",
            padding: "6px 10px",
            marginBottom: "18px",
            borderRadius: "6px",
            transition: "background 0.15s ease, color 0.15s ease",
            width: "fit-content",
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span>Kembali</span>
        </Link>

        {/* Inline style untuk hover effect */}
        <style>{`
          .back-button:hover {
            background: #fff7ed !important;
            color: #ea580c !important;
          }
        `}</style>

        <h1 style={{ marginTop: 0 }}>Login</h1>
        <p className="muted">Masuk ke dashboard sesuai role akun kamu.</p>
        <LoginForm next={params.next ?? ""} />
      </section>
    </main>
  );
}