import { useEffect, useRef, useState, useMemo } from "react";
import { MessageSquare, Send, Activity, Navigation2, AlertCircle, CheckCircle2 } from "lucide-react";

import api from "../api";
import { KERALA_DISTRICTS, formatDate } from "../constants";

// Helper to generate deterministic mock traffic data based on district name
// In production, replace this with actual data from your API
function getDistrictTrafficStats(districtName) {
  let hash = 0;
  for (let i = 0; i < districtName.length; i++) {
    hash = districtName.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const baseHealth = 70 + (Math.abs(hash) % 30); // Health between 70 and 100
  const totalRoutes = 100 + (Math.abs(hash) % 50);
  const clearRoutes = Math.floor((baseHealth / 100) * totalRoutes);
  
  // Generate sparkline points
  const points = [];
  let currentY = baseHealth;
  for (let i = 0; i < 10; i++) {
    currentY = Math.min(100, Math.max(40, currentY + (Math.random() * 20 - 10)));
    points.push(currentY);
  }
  
  // Format points for SVG polygon/polyline
  const chartHeight = 40;
  const chartWidth = 100;
  const svgPoints = points.map((p, i) => `${(i / 9) * chartWidth},${chartHeight - (p / 100) * chartHeight}`).join(" ");

  let status, colorClass, strokeColor, Icon;
  if (baseHealth >= 90) {
    status = "OPERATIONAL";
    colorClass = "text-emerald-400";
    strokeColor = "#34d399";
    Icon = CheckCircle2;
  } else if (baseHealth >= 80) {
    status = "PARTIAL OUTAGE";
    colorClass = "text-yellow-400";
    strokeColor = "#facc15";
    Icon = AlertCircle;
  } else {
    status = "SEVERE TRAFFIC";
    colorClass = "text-rose-500";
    strokeColor = "#f43f5e";
    Icon = Activity;
  }

  return { percentage: baseHealth.toFixed(1), clearRoutes, totalRoutes, status, svgPoints, colorClass, strokeColor, Icon };
}


function DistrictChat({ location, socket, user }) {
  const [district, setDistrict] = useState(location?.district || "Ernakulam");
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  // Generate the chart stats whenever the district changes
  const trafficStats = useMemo(() => getDistrictTrafficStats(district), [district]);

  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      try {
        const response = await api.get(`/chat/${district}`);
        if (!cancelled) {
          setMessages(response.data);
          setError("");
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || "Unable to load district chat.");
        }
      }
    };

    socket.emit("join_district", { district, username: user.username });
    loadMessages();

    return () => {
      cancelled = true;
      socket.emit("leave_district", { district, username: user.username });
    };
  }, [district, socket, user.username]);

  useEffect(() => {
    const receive = (message) => {
      if (message.district === district) {
        setMessages((current) => [...current, message].slice(-120));
      }
    };

    socket.on("receive_message", receive);
    return () => socket.off("receive_message", receive);
  }, [district, socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (event) => {
    event.preventDefault();
    const message = draft.trim();
    if (!message) {
      return;
    }
    socket.emit("send_message", { district, username: user.username, message });
    setDraft("");
  };

  return (
    <section className="animate-fade-in pb-10 max-w-screen-2xl mx-auto px-4 md:px-6">
      
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-cyan-600 font-bold tracking-wider uppercase text-xs md:text-sm mb-1 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Live Intercom
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
            District Command Chat
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
            Coordinate anonymously with nearby commuters and verify roadblocks in real-time.
          </p>
        </div>
        <div className="rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 px-4 py-2 text-sm font-black text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-500/20 shadow-sm shrink-0">
          Signed in as @{user.username}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        
        {/* District Selector Sidebar */}
        <aside className="glass-panel p-4 md:p-5 rounded-3xl border border-slate-200 bg-white/50 dark:bg-slate-900/50 dark:border-white/10 shadow-sm h-fit">
          <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-3">
            <Navigation2 className="h-5 w-5 text-cyan-600" />
            Districts
          </h2>
          <div className="mt-4 grid gap-1.5 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
            {KERALA_DISTRICTS.map((item) => (
              <button
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-black transition-all ${
                  district === item 
                    ? "bg-cyan-500 text-white shadow-md dark:bg-cyan-600" 
                    : "bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-slate-200"
                }`}
                key={item}
                type="button"
                onClick={() => setDistrict(item)}
              >
                {item}
                {district === item && <div className="h-2 w-2 rounded-full bg-white animate-pulse" />}
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <div className="glass-panel flex h-[75vh] min-h-[600px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white dark:bg-[#111111] dark:border-white/10 shadow-sm">
          
          {/* Dashboard-Style Traffic Chart Header */}
          <div className="border-b border-slate-200 dark:border-[#222] bg-slate-50 dark:bg-[#1a1a1a] p-5 shrink-0">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-wide">{district}</h2>
                <p className="text-xs font-bold text-slate-500 dark:text-[#888] tracking-widest uppercase mt-1">
                  {trafficStats.clearRoutes}/{trafficStats.totalRoutes} routes clear
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`h-2 w-2 rounded-full ${trafficStats.colorClass.replace('text-', 'bg-')} animate-pulse`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${trafficStats.colorClass}`}>
                  {trafficStats.status}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end mt-4">
              <span className={`text-3xl font-black ${trafficStats.colorClass}`}>
                {trafficStats.percentage}%
              </span>
              
              {/* Inline SVG Sparkline Chart */}
              <div className="w-32 md:w-48 h-12 relative">
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                  {/* Subtle Grid Line */}
                  <line x1="0" y1="35" x2="100" y2="35" stroke="#333" strokeWidth="0.5" strokeDasharray="2" />
                  
                  {/* The Line Chart */}
                  <polyline
                    fill="none"
                    stroke={trafficStats.strokeColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points={trafficStats.svgPoints}
                  />
                  
                  {/* Gradient Area under the line (optional, for aesthetics) */}
                  <polygon
                    fill={`url(#gradient-${district})`}
                    points={`0,40 ${trafficStats.svgPoints} 100,40`}
                    className="opacity-20"
                  />
                  <defs>
                    <linearGradient id={`gradient-${district}`} x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor={trafficStats.strokeColor} />
                      <stop offset="100%" stopColor={trafficStats.strokeColor} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Time Labels */}
                <div className="flex justify-between text-[8px] font-bold text-slate-400 dark:text-[#666] mt-1 uppercase tracking-widest">
                  <span>12:00am</span>
                  <span>7:10am</span>
                  <span>Now</span>
                </div>
              </div>
            </div>
          </div>

          {error && <div className="mx-5 mt-5 rounded-2xl bg-rose-500/10 p-3 text-sm font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-2 shrink-0"><AlertCircle className="h-4 w-4"/> {error}</div>}

          {/* Messages Feed */}
          <div className="scrollbar-soft flex-1 space-y-4 overflow-y-auto p-5 bg-slate-50/50 dark:bg-transparent">
            {messages.length === 0 && !error && (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 opacity-50 space-y-3">
                <MessageSquare className="h-10 w-10" />
                <p className="font-bold text-sm">No messages yet. Start the coordination for {district}.</p>
              </div>
            )}
            
            {messages.map((message, index) => {
              const mine = message.username === user.username;
              return (
                <div className={`flex ${mine ? "justify-end" : "justify-start"} animate-slide-up`} key={message.id || `${message.username}-${index}`}>
                  <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                    mine 
                      ? "bg-cyan-500 text-white rounded-br-sm" 
                      : "bg-white border border-slate-100 text-slate-800 dark:border-[#333] dark:bg-[#1a1a1a] dark:text-slate-200 rounded-bl-sm"
                  }`}>
                    <div className={`flex items-center justify-between gap-4 text-[10px] font-black uppercase tracking-wider mb-1 ${
                      mine ? "text-cyan-100" : "text-cyan-600 dark:text-cyan-500"
                    }`}>
                      <span>@{message.username}</span>
                      <span className="opacity-75">{formatDate(message.created_at)}</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed break-words">{message.message}</p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input Form */}
          <form className="border-t border-slate-200 bg-white p-4 dark:border-[#222] dark:bg-[#111] shrink-0" onSubmit={send}>
            <div className="flex gap-2 md:gap-3 relative">
              <input 
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 pl-5 pr-12 py-3.5 text-sm font-semibold outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all dark:border-[#333] dark:bg-[#1a1a1a] dark:text-white dark:focus:border-cyan-500" 
                placeholder={`Send intel to ${district}...`} 
                value={draft} 
                onChange={(event) => setDraft(event.target.value)} 
              />
              <button 
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-cyan-500 p-2 text-white hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:hover:bg-cyan-500" 
                type="submit"
                disabled={!draft.trim()}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default DistrictChat;