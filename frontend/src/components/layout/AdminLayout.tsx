import { Link, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { useAuth } from "../../auth/AuthContext";
import { Button } from "../ui/Button";

export function AdminLayout() {
  const { username, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-vault-black">
      <header className="border-b border-vault-silver/10 bg-vault-charcoal/40">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/admin" className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="font-display text-sm uppercase tracking-widest text-vault-gold">
              Admin Dashboard
            </span>
          </Link>
          <div className="flex items-center gap-4">
            {username && <span className="hidden text-sm text-vault-silver sm:inline">{username}</span>}
            <Button variant="ghost" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
