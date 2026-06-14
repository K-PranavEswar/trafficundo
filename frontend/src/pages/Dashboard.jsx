import { useEffect, useState } from "react";
import { AlertTriangle, CloudRain, PhoneCall, ShieldAlert, MapPin, Clock, MessageSquare, ListFilter } from "lucide-react";

import api from "../api";
import StatsCard from "../components/StatsCard";
import { formatDate } from "../constants";

function Dashboard({ reportsVersion }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Mobile-specific view toggle ('reports' or 'intel')
  const [mobileView, setMobileView] = useState("reports");

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        const response = await api.get("/dashboard");
        if (!cancelled) {
          setDashboard(response.data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || "Unable to load dashboard.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [reportsVersion]);

  return (
    <section className="animate-fade-in px-4 py-4 md:px-6 md:py-8 pb-16 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-6 md:mb-8">
        <p className="text-cyan-600 font-bold tracking-wider uppercase text-xs md:text-sm mb-1">
          Kerala Traffic Intelligence
        </p>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
          TrafficUndo Command Center
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl">
          Real-time roadblock reporting, inter-district coordination, monsoon alerts, and community traffic analytics across all 14 districts.
        </p>

        {/* Kerala-Specific Alert Banner */}
        <div className="mt-4 flex flex-col sm:flex-row items-start gap-3 rounded-2xl border border-rose-500/30 bg-gradient-to-br from-rose-500/10 to-orange-500/10 p-4 text-sm font-bold text-rose-700 dark:text-rose-200 shadow-sm">
          <CloudRain className="h-5 w-5 md:h-6 md:w-6 shrink-0 text-rose-500 animate-pulse mt-0.5" />
          <div>
            <span className="block text-sm md:text-base mb-0.5 font-black">Statewide Monsoon & Ghat Alert</span>
            <span className="font-medium text-xs md:text-sm opacity-90 leading-relaxed">
              Verify active waterlogging reports in coastal regions and potential landslide warnings in Idukki/Wayanad before traveling.
            </span>
          </div>
        </div>
      </div>

      {loading && (
        <div className="glass-panel p-8 text-center text-sm font-bold text-slate-500 animate-pulse rounded-2xl border border-slate-200 dark:border-white/10">
          Syncing statewide data...
        </div>
      )}
      
      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-4 text-sm font-bold text-rose-600 dark:bg-rose-500/10 dark:text-rose-200">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {dashboard && (
        <div className="space-y-6 md:space-y-8">
          {/* Stats Grid - Handles 1 col on mobile, 2 on tablet, 4 on large screens */}
          <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
            <StatsCard label="Total Reports" value={dashboard.total_reports} detail="Submissions" tone="cyan" />
            <StatsCard label="Active Blocks" value={dashboard.active_blocks} detail="Needs attention" tone="rose" />
            <StatsCard label="Routes Cleared" value={dashboard.resolved_reports} detail="By community" tone="green" />
            <StatsCard label="Volunteers" value={dashboard.community_helpers} detail="Contributors" tone="violet" />
          </div>

          {/* Touch-Friendly Mobile View Toggle Bar (Hidden on Desktop) */}
          <div className="xl:hidden flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl font-bold text-sm">
            <button 
              onClick={() => setMobileView("reports")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
                mobileView === "reports" 
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white" 
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <ListFilter className="h-4 w-4" />
              Live Reports ({dashboard.recent_reports.length})
            </button>
            <button 
              onClick={() => setMobileView("intel")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all ${
                mobileView === "intel" 
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-white" 
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              District Intel
            </button>
          </div>

          {/* Main Content Layout */}
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            
            {/* Live Reports Column - Controlled by tab state on mobile, always visible on desktop */}
            <div className={`glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50 shadow-sm ${
              mobileView === "reports" ? "block" : "hidden xl:block"
            }`}>
              <div className="mb-4 md:mb-6 flex items-center justify-between border-b border-slate-200 pb-3 md:pb-4 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">Live Road Reports</h2>
                </div>
                <span className="flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-2.5 py-1 text-xs font-black text-cyan-700 dark:text-cyan-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                  </span>
                  Live
                </span>
              </div>

              {/* Feed container with smooth mobile touch scrolling */}
              <div className="space-y-3 max-h-[500px] xl:max-h-[600px] overflow-y-auto pr-1 custom-scrollbar -webkit-overflow-scrolling-touch">
                {dashboard.recent_reports.map((report) => (
                  <article className="group relative rounded-xl md:rounded-2xl border border-slate-200 bg-white p-3 md:p-4 transition-all dark:border-white/10 dark:bg-slate-800/50" key={report.id}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white flex items-start gap-1.5 break-words">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                          <span>{report.road_name || `${report.from_label} → ${report.to_label}`}</span>
                        </h3>
                        <p className="mt-1 text-xs md:text-sm font-medium text-slate-600 dark:text-slate-300 pl-5 line-clamp-3">
                          {report.description}
                        </p>
                      </div>
                      <span className={`self-start shrink-0 rounded-full border px-2.5 py-0.5 text-[11px] font-black shadow-sm ${
                        report.status === "Active" 
                          ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300" 
                          : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    
                    {/* Metadata strip - handles wrapping elegantly on narrow screens */}
                    <div className="mt-3 pl-5 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700 dark:bg-slate-700 dark:text-slate-200 whitespace-nowrap">
                        📍 {report.district}
                      </span>
                      <span className="rounded bg-amber-100/50 px-1.5 py-0.5 text-amber-800 dark:bg-amber-500/10 dark:text-amber-300 whitespace-nowrap">
                        ⚠️ {report.reason}
                      </span>
                      <span className="text-cyan-600 dark:text-cyan-400 whitespace-nowrap">
                        ✓ {report.verify_votes} Verified
                      </span>
                      <span className="flex items-center gap-1 text-slate-400 dark:text-slate-500 ml-auto sm:ml-0 pt-1 sm:pt-0">
                        <Clock className="h-3 w-3" />
                        {formatDate(report.created_at)}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Right Column: Helplines & Intel - Controlled by tab state on mobile, always visible on desktop */}
            <div className={`space-y-4 md:space-y-6 ${
              mobileView === "intel" ? "block" : "hidden xl:block"
            }`}>
              
              {/* Regional Helplines */}
              <div className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-slate-900/30">
                <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 mb-3 md:mb-4">
                  <PhoneCall className="h-4 w-4 md:h-5 w-5 text-rose-500" />
                  Kerala Emergency Helplines
                </h2>
                {/* 2x2 grid fits securely on small mobile panels */}
                <div className="grid grid-cols-2 gap-2 md:gap-3 text-sm">
                  <a href="tel:1077" className="active:scale-98 transition-transform block rounded-xl bg-white p-2.5 md:p-3 border border-slate-200 dark:bg-slate-800 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Disaster Mgmt</p>
                    <p className="font-black text-rose-600 dark:text-rose-400 text-base md:text-lg">1077</p>
                  </a>
                  <a href="tel:9846100100" className="active:scale-98 transition-transform block rounded-xl bg-white p-2.5 md:p-3 border border-slate-200 dark:bg-slate-800 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Highway Police</p>
                    <p className="font-black text-rose-600 dark:text-rose-400 text-xs md:text-sm truncate">9846 100 100</p>
                  </a>
                  <a href="tel:108" className="active:scale-98 transition-transform block rounded-xl bg-white p-2.5 md:p-3 border border-slate-200 dark:bg-slate-800 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Ambulance</p>
                    <p className="font-black text-rose-600 dark:text-rose-400 text-base md:text-lg">108</p>
                  </a>
                  <a href="tel:1912" className="active:scale-98 transition-transform block rounded-xl bg-white p-2.5 md:p-3 border border-slate-200 dark:bg-slate-800 dark:border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">KSEB (Power)</p>
                    <p className="font-black text-rose-600 dark:text-rose-400 text-base md:text-lg">1912</p>
                  </a>
                </div>
              </div>

              {/* District Coordination Feed */}
              <div className="glass-panel p-4 md:p-6 rounded-2xl md:rounded-3xl border border-slate-200 bg-white/50 backdrop-blur-md dark:border-white/10 dark:bg-slate-900/50 shadow-sm">
                <h2 className="text-base md:text-lg font-black text-slate-900 dark:text-white border-b border-slate-200 pb-2 md:pb-3 dark:border-white/10">
                  District Coordination
                </h2>
                <div className="mt-3 md:mt-4 space-y-2 max-h-[300px] xl:max-h-[350px] overflow-y-auto pr-1 custom-scrollbar -webkit-overflow-scrolling-touch">
                  {dashboard.latest_messages.map((message) => (
                    <div className="rounded-xl bg-white p-3 shadow-sm border border-slate-100 dark:border-white/5 dark:bg-slate-800/80" key={message.id}>
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-[10px] font-black text-cyan-700 dark:text-cyan-300 bg-cyan-50 dark:bg-cyan-500/10 px-1.5 py-0.5 rounded truncate max-w-[120px]">
                          @{message.username}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 whitespace-nowrap">
                          {message.district}
                        </span>
                      </div>
                      <p className="mt-1.5 text-xs md:text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed break-words">
                        {message.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Dashboard;