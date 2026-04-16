import { useMemo, useState } from "react";
import ChartsPanel from "../components/ChartsPanel";
import DeliveryTable from "../components/DeliveryTable";
import MetricCard from "../components/MetricCard";
import StatusMappingTable from "../components/StatusMappingTable";
import DashboardLayout from "../layouts/DashboardLayout";
import { recalculateReport, saveStatusMappings, uploadReport } from "../services/api";

const INITIAL_METRICS = {
  totalOrders: 0,
  delivered: 0,
  inTransit: 0,
  ndr: 0,
  rto: 0,
  other: 0,
  deliveryPercent: 0,
  totalRevenue: 0,
  totalProfit: 0,
  marginPercent: 0,
};

function DashboardPage() {
  const [analytics, setAnalytics] = useState({ metrics: INITIAL_METRICS, dateWiseTrend: [], storeWise: [] });
  const [processedRows, setProcessedRows] = useState([]);
  const [mappingRows, setMappingRows] = useState([]);
  const [uploadSummary, setUploadSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const lineChartData = useMemo(
    () =>
      (analytics.dateWiseTrend || []).map((item) => ({
        name: item.date,
        delivered: item.delivered,
        pending: item.inTransit + item.ndr + item.rto + item.other,
      })),
    [analytics.dateWiseTrend]
  );

  const barChartData = useMemo(
    () =>
      (analytics.storeWise || []).map((item) => ({
        name: item.key,
        orders: item.orders,
      })),
    [analytics.storeWise]
  );

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await uploadReport({ file, clientId: "demo-client" });
      setAnalytics(response.analytics || { metrics: INITIAL_METRICS, dateWiseTrend: [], storeWise: [] });
      setProcessedRows(response.processedRows || []);
      setUploadSummary(response.uploadSummary || null);
      setMappingRows(
        (response.detectedRawStatuses || []).map((item) => ({
          ...item,
          selectedCategory: item.autoMappedTo,
          saveForFuture: false,
        }))
      );
    } catch (uploadError) {
      setError(uploadError.response?.data?.error || "Upload failed. Please validate your CSV template.");
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  };

  const handleChangeCategory = (rawStatus, selectedCategory) => {
    setMappingRows((prev) => prev.map((row) => (row.rawStatus === rawStatus ? { ...row, selectedCategory } : row)));
  };

  const handleToggleSaveFuture = (rawStatus, checked) => {
    setMappingRows((prev) => prev.map((row) => (row.rawStatus === rawStatus ? { ...row, saveForFuture: checked } : row)));
  };

  const handleSaveAndUpdate = async () => {
    if (!processedRows.length) {
      setError("Please upload a CSV file first.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const mappingOverrides = mappingRows.map((row) => ({
        rawStatus: row.rawStatus,
        mappedCategory: row.selectedCategory,
        source: "client_override",
      }));

      const recalculated = await recalculateReport({
        clientId: "demo-client",
        processedRows,
        mappingOverrides,
      });

      setAnalytics(recalculated.analytics || analytics);
      setProcessedRows(recalculated.processedRows || processedRows);
      setUploadSummary(recalculated.uploadSummary || uploadSummary);
      setMappingRows(
        (recalculated.detectedRawStatuses || []).map((item) => {
          const existing = mappingRows.find((row) => row.rawStatus === item.rawStatus);
          return {
            ...item,
            selectedCategory: existing?.selectedCategory || item.autoMappedTo,
            saveForFuture: existing?.saveForFuture || false,
          };
        })
      );

      const mappingsToPersist = mappingRows
        .filter((row) => row.saveForFuture)
        .map((row) => ({ rawStatus: row.rawStatus, mappedCategory: row.selectedCategory, source: "client_saved" }));

      if (mappingsToPersist.length) {
        await saveStatusMappings({ clientId: "demo-client", mappings: mappingsToPersist });
      }
    } catch (updateError) {
      setError(updateError.response?.data?.error || "Failed to recalculate report.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <section className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <input type="file" accept=".csv" onChange={handleUpload} className="block text-sm text-slate-700" />
          <button
            type="button"
            onClick={handleSaveAndUpdate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={isLoading || !processedRows.length}
          >
            {isLoading ? "Processing..." : "Save & Update Report"}
          </button>
        </div>
        {uploadSummary ? (
          <p className="text-sm text-slate-600 mt-2">
            Uploaded rows: {uploadSummary.totalRows} | Invalid rows: {uploadSummary.invalidRows}
          </p>
        ) : null}
        {error ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <MetricCard title="Total Orders" value={analytics.metrics?.totalOrders || 0} subtitle="Processed rows" />
        <MetricCard title="Delivered" value={analytics.metrics?.delivered || 0} subtitle="Mapped DELIVERED" />
        <MetricCard
          title="Delivery %"
          value={`${analytics.metrics?.deliveryPercent || 0}%`}
          subtitle="DELIVERED / (DELIVERED+IN_TRANSIT+NDR+RTO)"
        />
        <MetricCard title="Revenue" value={`₹${analytics.metrics?.totalRevenue || 0}`} subtitle="From Order_Amount" />
        <MetricCard title="Profit" value={`₹${analytics.metrics?.totalProfit || 0}`} subtitle="Revenue - all costs" />
        <MetricCard title="Margin %" value={`${analytics.metrics?.marginPercent || 0}%`} subtitle="Profit / Revenue" />
      </section>

      <div className="space-y-4">
        <ChartsPanel lineData={lineChartData} barData={barChartData} />
        <StatusMappingTable
          rows={mappingRows}
          onChangeMappedCategory={handleChangeCategory}
          onToggleSaveFuture={handleToggleSaveFuture}
        />
        <DeliveryTable records={analytics.tableRows || []} />
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
