import AdminShell from "@/components/AdminShell";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { format } from "date-fns";
import { Briefcase, AlertTriangle } from "lucide-react";

export default function AdminJobApplications() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-job-applications"],
    queryFn: () => apiRequest<{ applications: any[] }>("/api/admin/leads/careers"),
  });

  return (
    <AdminShell title="Job Applications" description="Manage career applications from candidates.">
      <div className="bg-white rounded-xl shadow-sm border border-border-design p-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
             <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-blue border-t-transparent"></div>
             <p className="mt-4 text-[#666]">Loading applications...</p>
          </div>
        ) : error || !data?.applications || data.applications.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No applications yet</h3>
            <p className="mt-1 text-sm text-slate-500">There are no job applications to display right now.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3">Applicant</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3 max-w-xs">Cover Letter</th>
                  <th className="px-6 py-3">Applied At</th>
                </tr>
              </thead>
              <tbody>
                {data?.applications?.map((app) => (
                  <tr key={app.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-semibold">{app.name}</p>
                      <p className="text-xs text-gray-500">{app.email}</p>
                      <p className="text-xs text-gray-500">{app.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {app.jobTitle}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={app.coverLetter}>
                      {app.coverLetter || "No cover letter provided"}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {format(new Date(app.createdAt), "PPp")}
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
