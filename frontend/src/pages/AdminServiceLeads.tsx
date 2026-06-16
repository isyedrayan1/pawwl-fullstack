import AdminShell from "@/components/AdminShell";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { format } from "date-fns";
import { Users, Calendar, AlertTriangle } from "lucide-react";

export default function AdminServiceLeads() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-service-leads"],
    queryFn: () => apiRequest<{ leads: any[] }>("/api/admin/leads/services"),
  });

  return (
    <AdminShell title="Service Bookings" description="Manage incoming service booking requests.">
      <div className="bg-white rounded-xl shadow-sm border border-border-design p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
             <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"></div>
             <p className="mt-4 text-[#666]">Loading bookings...</p>
          </div>
        ) : error || !data?.leads || data.leads.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No bookings yet</h3>
            <p className="mt-1 text-sm text-slate-500">There are no service bookings to display right now.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3">Client</th>
                  <th className="px-6 py-3">Pet Details</th>
                  <th className="px-6 py-3">Service</th>
                  <th className="px-6 py-3">Date & Time</th>
                  <th className="px-6 py-3">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {data?.leads?.map((lead) => (
                  <tr key={lead.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold">{lead.name}</p>
                      <p className="text-xs text-gray-500">{lead.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium">{lead.petName || "N/A"}</p>
                      <p className="text-xs text-gray-500">{lead.petType || "N/A"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {lead.service}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p>{format(new Date(lead.date), "PPP")}</p>
                      <p className="text-xs text-gray-500">{lead.timeSlot}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(lead.createdAt), "PPp")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
