import { useEffect, useState } from "react";
import { BarChart3, AlertTriangle, TrendingUp, Activity, Route, Clock, ShieldAlert, AlertOctagon } from "lucide-react";

import api from "../api";
import TrafficChart from "../components/TrafficChart";
import StatsCard from "../components/StatsCard";
import { formatDate } from "../constants";

function Analytics({ reportsVersion }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const response = await api.get("/analytics");
        if (!cancelled) {
          setAnalytics(response.data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || "Unable to load analytics.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [reportsVersion]);

  const districtLabels = Object.keys(analytics?.district_reports || {});
  const districtValues = Object.values(analytics?.district_reports || {});
  const reasonLabels = Object.keys(analytics?.reason_counts || {});
  const reasonValues = Object.values(analytics?.reason_counts || {});

  return (
    <section className="animate-fade-in pb-10 max-w-screen-2xl mx-auto px-4 md:px-6">
      {/* Header Section */}
      <div className="mb-8">
        <p className="text-cyan-600 font-bold tracking-wider uppercase text-xs md:text-sm mb-1 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" /> Kerala Statewide Data
        </p>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
          Traffic Intelligence Analytics
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Track district report density, repeated route bottlenecks, primary traffic hazard reasons, and the impact of community support across the state.
        </p>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="glass-panel p-8 text-center text-sm font-bold text-slate-500 animate-pulse rounded-3xl border border-slate-200 dark:border-white/10">
          Compiling statewide analytics...
        </div>
      )}
      
      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Analytics Content */}
      {analytics && (
        <div className="space-y-6 md:space-y-8">
          
          {/* Stats Grid - 3 columns to balance the 3 stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <StatsCard label="Total Reports" value={analytics.total_reports} detail="All-time submissions" tone="cyan" />
            <StatsCard label="Active Blocks" value={analytics.active_blocks} detail="Current statewide hazards" tone="rose" />
            <StatsCard label="Resolved Reports" value={analytics.resolved_reports} detail="Successfully cleared" tone="green" />
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 xl:grid-cols-2">
            <div className="glass-panel p-5 md:p-6 rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3 dark:border-white/10">
                <TrendingUp className="h-5 w-5 text-cyan-600" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">District-wise Reports</h2>
              </div>
              <div className="h-64 md:h-80 relative">
                <TrafficChart labels={districtLabels} values={districtValues} type="bar" />
              </div>
            </div>

            <div className="glass-panel p-5 md:p-6 rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3 dark:border-white/10">
                <AlertOctagon className="h-5 w-5 text-rose-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Traffic Reason Split</h2>
              </div>
              <div className="h-64 md:h-80 relative flex items-center justify-center">
                <TrafficChart labels={reasonLabels} values={reasonValues} type="doughnut" />
              </div>
            </div>
          </div>

          {/* Bottom Row: Routes & Activity */}
          <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
            
            {/* Most Blocked Routes - Styled as a Leaderboard */}
            <div className="glass-panel p-5 md:p-6 rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-200 pb-3 dark:border-white/10">
                <Route className="h-5 w-5 text-amber-500" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Most Blocked Routes</h2>
              </div>
              
              <div className="mt-4 space-y-3">
                {analytics.most_blocked_routes.map((route, index) => (
                  <div className="group flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-slate-100 transition-all hover:shadow-md dark:border-white/5 dark:bg-slate-800/80" key={route.route}>
                    <div className="flex items-center gap-4">
                      {/* Rank Number */}
                      <span className={`text-lg font-black ${index < 3 ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}`}>
                        #{index + 1}
                      </span>
                      <span className="font-bold text-sm md:text-base text-slate-900 dark:text-white">{route.route}</span>
                    </div>
                    <span className="flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-1 text-xs font-black text-rose-600 border border-rose-100 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                      <ShieldAlert className="h-3 w-3" />
                      {route.count} Incidents
                    </span>
                  </div>
                ))}
                
                {analytics.most_blocked_routes.length === 0 && (
                  <div className="text-center text-sm font-bold text-slate-400 py-8">
                    No highly recurring route blocks recorded yet.
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity - Styled as a Vertical Timeline */}
            <div className="glass-panel p-5 md:p-6 rounded-3xl border border-slate-200 bg-slate-50 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/30 shadow-sm">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 dark:border-white/10">
                <Activity className="h-5 w-5 text-cyan-600" />
                <h2 className="text-lg font-black text-slate-900 dark:text-white">System Activity Log</h2>
              </div>
              
              <div className="relative pl-5 border-l-2 border-slate-200 dark:border-slate-700 space-y-6 mt-2">
                {analytics.recent_activity.map((activity, index) => (
                  <div className="relative" key={`${activity.label}-${index}`}>
                    {/* Timeline Node */}
                    <div className="absolute -left-[27px] top-1.5 h-3.5 w-3.5 rounded-full bg-cyan-500 ring-4 ring-slate-50 dark:ring-slate-900"></div>
                    
                    <div className="flex flex-col">
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-tight">
                        {activity.label}
                      </p>
                      <p className="flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
}

export default Analytics;