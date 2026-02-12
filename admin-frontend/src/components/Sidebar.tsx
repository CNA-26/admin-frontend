const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-[var(--color-sidebar)] text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-white/20">
        Monstera Admin
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <a className="block p-3 rounded hover:bg-[var(--color-sidebar-hover)] transition">
          Dashboard
        </a>
        <a className="block p-3 rounded hover:bg-[var(--color-sidebar-hover)] transition">
          Users
        </a>
        <a className="block p-3 rounded hover:bg-[var(--color-sidebar-hover)] transition">
          Products
        </a>
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
