function DeliveryTable({ records }) {
  return (
    <section className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm overflow-x-auto">
      <h3 className="text-base font-semibold text-slate-900 mb-4">Processed Orders</h3>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-slate-500 border-b border-slate-200">
            <th className="pb-3 pr-4">Order ID</th>
            <th className="pb-3 pr-4">Store</th>
            <th className="pb-3 pr-4">Raw Status</th>
            <th className="pb-3 pr-4">Mapped Status</th>
            <th className="pb-3 pr-4">Revenue</th>
            <th className="pb-3 pr-4">Profit</th>
            <th className="pb-3 pr-4">Margin %</th>
            <th className="pb-3">Order Date</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="8" className="py-6 text-center text-slate-400">
                No records available.
              </td>
            </tr>
          ) : (
            records.slice(0, 100).map((record, idx) => (
              <tr key={`${record.Order_ID}-${idx}`} className="border-b border-slate-100 text-slate-700">
                <td className="py-3 pr-4 font-medium">{record.Order_ID}</td>
                <td className="py-3 pr-4">{record.Store_Name}</td>
                <td className="py-3 pr-4">{record.raw_order_status}</td>
                <td className="py-3 pr-4">{record.mapped_status}</td>
                <td className="py-3 pr-4">₹{Number(record.row_revenue || 0).toFixed(2)}</td>
                <td className="py-3 pr-4">₹{Number(record.row_profit || 0).toFixed(2)}</td>
                <td className="py-3 pr-4">{Number(record.row_margin_percent || 0).toFixed(2)}%</td>
                <td className="py-3">{record.Order_Date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default DeliveryTable;
