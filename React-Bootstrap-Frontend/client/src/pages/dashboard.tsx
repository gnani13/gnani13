import { useAuth } from "@/hooks/use-auth";
import { useDashboardStats, useUserStats } from "@/hooks/use-analytics";
import { useAvailableDonations } from "@/hooks/use-donations";
import { Link } from "wouter";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from "recharts";
import { Plus, Search, Truck, Heart, Loader2, Map as MapIcon } from "lucide-react";
import { motion } from "framer-motion";
import DonationMap from "../components/DonationMap";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: userStats, isLoading: userStatsLoading } = useUserStats();
  const { data: availableDonations } = useAvailableDonations();

  if (statsLoading || userStatsLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Sample data for charts
  const chartData = [
    { name: 'Donations', value: stats?.totalDonations || 0, color: '#16a34a' },
    { name: 'Active', value: stats?.activeDonations || 0, color: '#eab308' },
    { name: 'Meals Saved', value: stats?.totalMealsSaved || 0, color: '#2563eb' },
  ];

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <div className="bg-card rounded-2xl p-6 border border-border shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
        <h3 className="text-3xl font-display font-bold text-foreground">{value}</h3>
      </div>
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );

  const donorFeatures = [
    { title: "Active Donations", count: userStats?.donationsCount || 0, icon: Search, color: "bg-blue-100 text-blue-600" },
    { title: "Total Impact", count: userStats?.impactScore || 0, icon: Heart, color: "bg-red-100 text-red-600" },
  ];

  const ngoFeatures = [
    { title: "Claimed Items", count: userStats?.donationsCount || 0, icon: Truck, color: "bg-green-100 text-green-600" },
    { title: "Beneficiaries Helped", count: (userStats?.impactScore || 0) * 2, icon: Heart, color: "bg-pink-100 text-pink-600" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">
            {user?.role === 'DONOR' ? 'Donor Portal' : user?.role === 'NGO' ? 'NGO Distribution Hub' : user?.role === 'VOLUNTEER' ? 'Volunteer Dispatch' : 'Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === 'DONOR' ? 'Manage your contributions and track your impact.' : 
             user?.role === 'NGO' ? 'Browse available food and coordinate distribution.' : 
             'Track and complete your delivery assignments.'}
          </p>
        </div>
        
        {user?.role === 'DONOR' && (
          <Link href="/donations/new">
            <button className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Donation
            </button>
          </Link>
        )}
        
        {user?.role === 'NGO' && (
          <Link href="/donations/available">
            <button className="btn-primary bg-accent hover:bg-accent/90 shadow-accent/20">
              <Search className="w-4 h-4 mr-2" />
              Find Donations
            </button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Global Donations" 
          value={stats?.totalDonations || 0} 
          icon={Heart} 
          colorClass="bg-red-100 text-red-600" 
        />
        <StatCard 
          title="Active Listings" 
          value={stats?.activeDonations || 0} 
          icon={Search} 
          colorClass="bg-yellow-100 text-yellow-600" 
        />
        <StatCard 
          title="Meals Saved" 
          value={stats?.totalMealsSaved || 0} 
          icon={Truck} 
          colorClass="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title={user?.role === 'DONOR' ? "My Donations" : user?.role === 'NGO' ? "My Claims" : "My Impact"} 
          value={userStats?.donationsCount || 0} 
          icon={Heart} 
          colorClass="bg-green-100 text-green-600" 
        />
      </div>

      {user?.role === 'DONOR' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border">
            <h3 className="font-bold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              {donorFeatures.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${f.color}`}><f.icon className="w-4 h-4" /></div>
                    <span className="font-medium">{f.title}</span>
                  </div>
                  <span className="font-bold">{f.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-primary/5 p-6 rounded-2xl border border-primary/10 flex flex-col justify-center">
            <h3 className="font-bold text-primary mb-2">Ready to give?</h3>
            <p className="text-sm text-muted-foreground mb-4">Every donation helps someone in need. Start a new listing now.</p>
            <Link href="/donations/new">
              <button className="btn-primary w-fit">Create Donation</button>
            </Link>
          </div>
        </div>
      )}

      {user?.role === 'NGO' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-card p-6 rounded-2xl border border-border">
            <h3 className="font-bold mb-4">Distribution Metrics</h3>
            <div className="space-y-4">
              {ngoFeatures.map((f, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${f.color}`}><f.icon className="w-4 h-4" /></div>
                    <span className="font-medium">{f.title}</span>
                  </div>
                  <span className="font-bold">{f.count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-accent/5 p-6 rounded-2xl border border-accent/10 flex flex-col justify-center">
            <h3 className="font-bold text-accent mb-2">Find more food</h3>
            <p className="text-sm text-muted-foreground mb-4">New donations are added daily. Browse the map to find nearby items.</p>
            <Link href="/donations/available">
              <button className="btn-primary bg-accent hover:bg-accent/90 w-fit">Browse Available</button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {user?.role === 'VOLUNTEER' && (
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg text-primary">Nearby Deliveries</h3>
              <Link href="/donations/available">
                <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                  View All <Search className="w-3 h-3" />
                </button>
              </Link>
            </div>
            <DonationMap donations={Array.isArray(availableDonations) ? availableDonations : []} />
          </div>
        )}

        {(user?.role === 'DONOR' || user?.role === 'NGO') && (
          <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6">Platform Impact</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.3} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 14 }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-secondary to-secondary/90 rounded-2xl p-8 text-secondary-foreground shadow-lg flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10">
            <h3 className="text-2xl font-display font-bold mb-4">Your Contribution</h3>
            <p className="text-secondary-foreground/80 mb-8 leading-relaxed">
              Every donation counts. Your participation helps us reduce food waste and support communities in need.
              Keep up the great work!
            </p>
            
            <div className="flex gap-8">
              <div>
                <span className="block text-4xl font-bold">{userStats?.donationsCount || 0}</span>
                <span className="text-sm opacity-70">
                  {user?.role === 'DONOR' ? 'Donations' : user?.role === 'NGO' ? 'Claims' : 'Deliveries'}
                </span>
              </div>
              <div>
                <span className="block text-4xl font-bold">{userStats?.impactScore || 0}</span>
                <span className="text-sm opacity-70">Impact Score</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
