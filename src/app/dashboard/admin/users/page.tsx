import EmptyState from "@/components/EmptyState";
import { requireRole } from "@/lib/auth";

export default async function AdminUsersPage() {
  await requireRole(["admin"]);

  return (
    <div className="page">
      <div>
        <h1>Manajemen User</h1>
        <p className="muted">Daftar user akan dibaca dari tabel users memakai service role setelah role admin valid.</p>
      </div>
      <EmptyState title="Belum ada query user management." />
    </div>
  );
}
