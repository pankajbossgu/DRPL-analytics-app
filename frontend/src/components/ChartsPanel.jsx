import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function ChartsPanel({ lineData, barData }) {
  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm h-80">
        <h3 className="text-base font-semibold text-slate-900 mb-3">Weekly Deliveries Trend</h3>
        <ResponsiveContainer width="100%" height="88%">
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="delivered" stroke="#2563eb" strokeWidth={2} />
            <Line type="monotone" dataKey="pending" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm h-80">
        <h3 className="text-base font-semibold text-slate-900 mb-3">City Distribution</h3>
        <ResponsiveContainer width="100%" height="88%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="orders" fill="#1d4ed8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

export default ChartsPanel;
