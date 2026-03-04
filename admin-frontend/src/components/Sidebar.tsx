import type { MouseEvent } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { buildAuthenticatedStoreUrl } from "../utils/storeFrontendUtils";

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleExit = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const handleStoreClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = buildAuthenticatedStoreUrl("/");
  };

  const handleStoreProfileClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = buildAuthenticatedStoreUrl("/profile");
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[var(--color-sidebar)] text-white flex flex-col overflow-y-auto">
      <div className="p-6 text-2xl font-bold border-b border-white/20">
        Monstera Admin
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <div className="px-3 pt-1 pb-2 text-xs font-semibold tracking-wide text-white/70 uppercase">
          Admin
        </div>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block p-3 rounded hover:bg-[var(--color-sidebar-hover)] transition ${isActive ? "bg-[var(--color-sidebar-hover)]" : ""
            }`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) =>
            `block p-3 rounded hover:bg-[var(--color-sidebar-hover)] transition ${
              isActive ? "bg-[var(--color-sidebar-hover)]" : ""
            }`
          }
        >
          Users
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `block p-3 rounded hover:bg-[var(--color-sidebar-hover)] transition ${
              isActive ? "bg-[var(--color-sidebar-hover)]" : ""
            }`
          }
        >
          Products
        </NavLink>

        <div className="my-2 border-t border-white/20" />
        <div className="px-3 pt-1 pb-2 text-xs font-semibold tracking-wide text-white/70 uppercase">
          Store
        </div>
        <a
          href="https://store-frontend-git-store-frontend.2.rahtiapp.fi/"
          onClick={handleStoreClick}
          className="block p-3 rounded hover:bg-[var(--color-sidebar-hover)] transition"
        >
          Store
        </a>
        <a
          href="https://store-frontend-git-store-frontend.2.rahtiapp.fi/profile"
          onClick={handleStoreProfileClick}
          className="block p-3 rounded hover:bg-[var(--color-sidebar-hover)] transition"
        >
          Profile
        </a>
      </nav>

      <div className="sticky bottom-0 p-4 border-t border-white/20 bg-[var(--color-sidebar)]">
        <button
          onClick={handleExit}
          className="w-full bg-red-500 hover:bg-red-600 p-2 rounded transition"
        >
          Exit
        </button>
      </div>
    </aside>

  );
};

export default Sidebar;
