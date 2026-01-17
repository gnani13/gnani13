import { useQuery, useMutation } from "@tanstack/react-query";
import { Donation } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, XCircle, CheckCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { data: donations, isLoading } = useQuery<Donation[]>({
    queryKey: ['/api/admin/donations'],
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("POST", `/api/admin/donations/${id}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/donations'] });
      toast({ title: "Donation Cancelled", description: "The donation has been reset to available." });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground">Manage all donations and system orders.</p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold text-sm">Donation</th>
                <th className="px-6 py-4 font-semibold text-sm">Status</th>
                <th className="px-6 py-4 font-semibold text-sm">Quantity</th>
                <th className="px-6 py-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {donations?.map((donation) => (
                <tr key={donation.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium">{donation.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      donation.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                      donation.status === 'CLAIMED' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {donation.status === 'AVAILABLE' && <CheckCircle className="w-3 h-3" />}
                      {donation.status === 'CLAIMED' && <Clock className="w-3 h-3" />}
                      {donation.status === 'DELIVERED' && <CheckCircle className="w-3 h-3" />}
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{donation.quantity}</td>
                  <td className="px-6 py-4 text-sm">
                    {donation.status !== 'AVAILABLE' && (
                      <button 
                        onClick={() => cancelMutation.mutate(donation.id)}
                        disabled={cancelMutation.isPending}
                        className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel Order
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
