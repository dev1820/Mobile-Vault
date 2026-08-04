import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { useAuth } from "../../auth/AuthContext";
import { Button } from "../ui/Button";

const NAV_LINKS = [
  { to: "/admin", label: "Listings", end: true },
  { to: "/admin/orders", label: "Orders", end: false },
  { to: "/admin/sell-requests", label: "Sell Requests", end: false },
  { to: "/admin/device-requests", label: "Device Requests", end: false },
  { to: "/admin/complaints", label: "Complaints", end: false },
];

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
        <div className="mx-auto flex max-w-6xl flex-wrap gap-x-6 gap-y-2 px-4 pb-3 sm:px-6">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `text-sm uppercase tracking-wide transition-colors ${
                  isActive ? "text-vault-gold" : "text-vault-silver hover:text-vault-white"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
