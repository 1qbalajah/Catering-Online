import PublicHeader from "@/components/PublicHeader";
import ProfileEditForm from "@/components/ProfileEditForm";
import { requireRole } from "@/lib/auth";
import { getPelangganProfile } from "@/lib/pelanggan";

export default async function EditProfilePage() {
  const user = await requireRole(["user"]);
  const profile = user.accountType === "pelanggan" ? await getPelangganProfile(user.id) : null;

  if (!profile) {
    return (
      <main className="public-shell">
        <PublicHeader user={user} />
        <section className="public-section">
          <div className="error">Profile pelanggan tidak ditemukan.</div>
        </section>
      </main>
    );
  }

  return (
    <main className="public-shell">
      <PublicHeader user={user} />
      <section className="public-section">
        <div className="checkout-panel">
          <h1>Edit Profile</h1>
          <p className="muted">Lengkapi alamat utama, dua alamat cadangan, kartu identitas, dan foto profil.</p>
          <ProfileEditForm profile={profile} />
        </div>
      </section>
    </main>
  );
}
