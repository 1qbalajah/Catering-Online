import type { AppUser } from "@/types";

type NavbarProps = {
  user: AppUser;
};

export default function Navbar({ user }: NavbarProps) {
  return (
    <header className="navbar">
      <div>
        <div className="navbar-title">Dashboard</div>
        <div className="muted" style={{ margin: 0 }}>
          Selamat datang, {user.name}
        </div>
      </div>
      <div className="navbar-user">
        <span className="role-badge">{user.role}</span>
      </div>
    </header>
  );
}
