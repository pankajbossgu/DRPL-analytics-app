const CATEGORY_OPTIONS = ["DELIVERED", "IN_TRANSIT", "NDR", "RTO", "OTHER"];

function StatusMappingTable({ rows, onChangeMappedCategory, onToggleSaveFuture }) {
  return (
    <section className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm overflow-x-auto">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Status Mapping Review</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="pb-3 pr-4">Raw Status</th>
            <th className="pb-3 pr-4">Auto Mapped To</th>
            <th className="pb-3 pr-4">Order Count</th>
            <th className="pb-3 pr-4">Change Category</th>
            <th className="pb-3">Save for Future</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-6 text-center text-slate-400">
                Upload a file to review status mappings.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.rawStatus} className="border-b border-slate-100 text-slate-700">
                <td className="py-3 pr-4 font-medium">{row.rawStatus}</td>
                <td className="py-3 pr-4">{row.autoMappedTo}</td>
                <td className="py-3 pr-4">{row.orderCount}</td>
                <td className="py-3 pr-4">
                  <select
                    className="border border-slate-300 rounded-md px-2 py-1"
                    value={row.selectedCategory}
                    onChange={(event) => onChangeMappedCategory(row.rawStatus, event.target.value)}
                  >
                    {CATEGORY_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3">
                  <input
                    type="checkbox"
                    checked={Boolean(row.saveForFuture)}
                    onChange={(event) => onToggleSaveFuture(row.rawStatus, event.target.checked)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default StatusMappingTable;
