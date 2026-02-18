import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-[var(--color-sidebar)] text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-white/20">
        Monstera Admin
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block p-3 rounded hover:bg-[var(--color-sidebar-hover)] transition ${isActive ? "bg-[var(--color-sidebar-hover)]" : ""
            }`
          }
        >
          Dashboard
        </NavLink>
        <a className="block p-3 rounded hover:bg-[var(--color-sidebar-hover)] transition">
          Users
        </a>
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
      </nav>

      <div className="p-4 border-t border-white/20">
        <button className="w-full bg-red-500 hover:bg-red-600 p-2 rounded transition">
          Exit
        </button>
      </div>
    </aside>

  );
};

export default Sidebar;
