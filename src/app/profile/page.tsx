import Link from "next/link";
import PublicHeader from "@/components/PublicHeader";
import { requireRole } from "@/lib/auth";
import { getPelangganProfile } from "@/lib/pelanggan";

export default async function ProfilePage() {
  const user = await requireRole(["user"]);
  const profile = user.accountType === "pelanggan" ? await getPelangganProfile(user.id) : null;
  const name = profile?.nama_pelanggan ?? user.name;

  return (
    <main className="public-shell">
      <PublicHeader user={user} />
      <section className="public-section">
        <article className="profile-main-card">
          <div className="profile-hero-row">
            {profile?.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img alt={name} className="profile-photo large" src={profile.foto} />
            ) : (
              <div className="avatar large">{name.slice(0, 1).toUpperCase()}</div>
            )}
            <div>
              <p className="eyebrow">Profile Pelanggan</p>
              <h1>{name}</h1>
              <p className="muted">{user.email}</p>
              <p className="profile-phone">{profile?.telepon ?? "Nomor telepon belum diisi"}</p>
            </div>
          </div>
          <div className="profile-info-grid">
            <div>
              <span>Nama</span>
              <strong>{name}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
            <div>
              <span>Tanggal Lahir</span>
              <strong>{profile?.tgl_lahir ?? "Belum diisi"}</strong>
            </div>
            <div>
              <span>Kartu Identitas</span>
              <strong>{profile?.kartu_id ?? "Belum diisi"}</strong>
            </div>
            <div>
              <span>Alamat Utama</span>
              <strong>{profile?.alamat1 ?? "Belum diisi"}</strong>
            </div>
            <div>
              <span>Alamat Cadangan 1</span>
              <strong>{profile?.alamat2 ?? "Belum diisi"}</strong>
            </div>
            <div>
              <span>Alamat Cadangan 2</span>
              <strong>{profile?.alamat3 ?? "Belum diisi"}</strong>
            </div>
          </div>
          <Link className="button profile-edit-button" href="/profile/edit">
            Edit Profile
          </Link>
        </article>
      </section>
    </main>
  );
}
