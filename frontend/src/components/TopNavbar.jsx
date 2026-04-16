function TopNavbar() {
  return (
    <header className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-slate-900">Delivery Dashboard</h2>
        <p className="text-sm text-slate-500">Monitor delivery operations in real time</p>
      </div>
      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
        AD
      </div>
    </header>
  );
}

export default TopNavbar;
