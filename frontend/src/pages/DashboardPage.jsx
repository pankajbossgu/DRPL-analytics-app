import { useEffect, useMemo, useState } from "react";
import ChartsPanel from "../components/ChartsPanel";
import DeliveryTable from "../components/DeliveryTable";
import MetricCard from "../components/MetricCard";
import { fallbackAnalytics, fallbackOrders } from "../data/fallbackData";
import DashboardLayout from "../layouts/DashboardLayout";
import { fetchAnalytics, fetchOrders } from "../services/api";

function DashboardPage() {
  const [analytics, setAnalytics] = useState(fallbackAnalytics);
  const [orders, setOrders] = useState(fallbackOrders);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [analyticsData, ordersData] = await Promise.all([fetchAnalytics(), fetchOrders()]);
        setAnalytics(analyticsData);
        setOrders(ordersData);
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    loadDashboardData();
  }, []);

  const lineChartData = useMemo(
    () => [
      { name: "Mon", delivered: 100, pending: 24 },
      { name: "Tue", delivered: 120, pending: 20 },
      { name: "Wed", delivered: 140, pending: 18 },
      { name: "Thu", delivered: 110, pending: 26 },
      { name: "Fri", delivered: 170, pending: 16 },
      { name: "Sat", delivered: 150, pending: 22 },
      { name: "Sun", delivered: 130, pending: 19 },
    ],
    []
  );

  const barChartData = useMemo(
    () => [
      { name: "New York", orders: 180 },
      { name: "San Francisco", orders: 140 },
      { name: "Austin", orders: 120 },
      { name: "Chicago", orders: 100 },
      { name: "Seattle", orders: 85 },
    ],
    []
  );

  return (
    <DashboardLayout>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <MetricCard title="Total Orders" value={analytics.totalOrders} subtitle="Across all regions" />
        <MetricCard title="Delivered" value={analytics.delivered} subtitle="Successfully completed" />
        <MetricCard title="Pending" value={analytics.pending} subtitle="Awaiting dispatch or delivery" />
        <MetricCard
          title="Avg Delivery Time"
          value={`${analytics.averageDeliveryTime || 0} min`}
          subtitle="Placeholder analytics metric"
        />
      </section>

      <div className="space-y-4">
        <ChartsPanel lineData={lineChartData} barData={barChartData} />
        <DeliveryTable records={orders} />
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
