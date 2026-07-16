import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, ReceiptText, History, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/products", label: "Inventory", icon: Package },
  { to: "/pos", label: "New Sale", icon: ReceiptText },
  { to: "/history", label: "Sales History", icon: History },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Sidebar */}
      <aside className="w-60 shrink-0 bg-ink text-paper flex flex-col">
        <div className="px-6 py-6 border-b border-ink-light">
          <p className="font-mono text-xs tracking-widest text-amber uppercase">System</p>
          <h1 className="text-lg font-semibold leading-tight mt-1">Sales &amp; Inventory</h1>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-amber text-ink"
                    : "text-paper/70 hover:bg-ink-light hover:text-paper"
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-ink-light">
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="font-mono text-xs text-paper/50 uppercase tracking-wide">{user?.role}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex items-center gap-2 text-xs text-paper/60 hover:text-rust transition-colors"
          >
            <LogOut size={14} />
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
