const links = ["Dashboard", "Orders", "Analytics", "Settings"];

function Sidebar() {
  return (
    <aside className="hidden md:block w-64 min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-xl font-semibold mb-8">DRPL Analytics</h1>
      <nav className="space-y-2">
        {links.map((link) => (
          <button
            key={link}
            type="button"
            className="w-full text-left px-3 py-2 rounded-md hover:bg-slate-800 transition"
          >
            {link}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
