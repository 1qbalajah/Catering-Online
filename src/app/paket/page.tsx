import PackageCard from "@/components/PackageCard";
import PublicHeader from "@/components/PublicHeader";
import { getCurrentUser } from "@/lib/auth";
import { getPublicPackages } from "@/lib/packages";

export default async function PaketPage() {
  const [user, packages] = await Promise.all([getCurrentUser(), getPublicPackages()]);

  return (
    <main className="public-shell relative min-h-screen bg-white overflow-hidden">
      {/* Efek glow orange tipis & terlokalisir */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(249, 115, 22, 0.15) 0%, transparent 55%),
            radial-gradient(ellipse at 85% 30%, rgba(234, 88, 12, 0.1) 0%, transparent 50%)
          `,
          filter: "blur(50px)",
        }}
      />

      {/* Konten utama */}
      <div className="relative z-10">
        <PublicHeader user={user} />
        <section className="public-section">
          <div className="section-heading">
            <div>
              <h1>Paket Catering</h1>
              <p className="muted">
                Guest boleh melihat paket. Untuk membeli, wajib login/register dahulu.
              </p>
            </div>
          </div>
          <div className="package-grid">
            {packages.map((paket) => (
              <PackageCard isLoggedIn={Boolean(user)} key={paket.id} paket={paket} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
