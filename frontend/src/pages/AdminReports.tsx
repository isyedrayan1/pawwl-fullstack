import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import AdminShell from "@/components/AdminShell";
import { apiRequest, formatPrice } from "@/lib/api";

type AnalyticsData = {
  revenueData: { date: string; revenue: number }[];
  aov: number;
  retentionRate: number;
  topProducts: { name: string; sales: number }[];
  totalRevenue: number;
  ordersCount: number;
};

const AdminReports = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => apiRequest<AnalyticsData>("/api/admin/analytics"),
  });

  if (isLoading) return <AdminShell title="Reports"><p>Loading reports...</p></AdminShell>;
  if (error) return <AdminShell title="Reports"><p className="text-rose-500">Failed to load reports. Super Admin access required.</p></AdminShell>;

  return (
    <AdminShell title="Analytics & Reports" description="Deep insights into your business performance over the last 30 days.">
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Total Revenue (30d)</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{formatPrice(data?.totalRevenue || 0)}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Orders (30d)</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{data?.ordersCount || 0}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Average Order Value</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{formatPrice(data?.aov || 0)}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">Customer Retention</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{data?.retentionRate.toFixed(1) || 0}%</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950 mb-4">Revenue over Time</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.revenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip cursor={{ stroke: "#e2e8f0", strokeWidth: 2 }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: "#0f172a" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-bold text-slate-950 mb-4">Top Selling Products</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.topProducts} layout="vertical" margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12, fill: "#64748b" }} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "#f1f5f9" }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AdminShell>
  );
};

export default AdminReports;
