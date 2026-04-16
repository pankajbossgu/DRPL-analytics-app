function DeliveryTable({ records }) {
  return (
    <section className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm overflow-x-auto">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Recent Delivery Records</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="pb-3 pr-4">Order ID</th>
            <th className="pb-3 pr-4">Status</th>
            <th className="pb-3 pr-4">Delivery Time (min)</th>
            <th className="pb-3 pr-4">Location</th>
            <th className="pb-3">Created At</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="5" className="py-6 text-center text-slate-400">
                No records available.
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.id} className="border-b border-slate-100 text-slate-700">
                <td className="py-3 pr-4 font-medium">{record.id}</td>
                <td className="py-3 pr-4">{record.status}</td>
                <td className="py-3 pr-4">{record.deliveryTime}</td>
                <td className="py-3 pr-4">{record.location}</td>
                <td className="py-3">{new Date(record.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default DeliveryTable;
