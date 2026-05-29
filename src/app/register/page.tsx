import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <h1>Register</h1>
        <p className="muted">Akun publik otomatis dibuat sebagai pelanggan.</p>
        <RegisterForm />
      </section>
    </main>
  );
}
