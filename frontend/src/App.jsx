import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";

import api, { SOCKET_URL } from "./api";
import Navbar from "./components/Navbar";
import { DEFAULT_SETTINGS, KERALA_CENTER, getAnonymousUser } from "./constants";
import About from "./pages/About";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import DistrictChat from "./pages/DistrictChat";
import ReportBlock from "./pages/ReportBlock";
import Settings from "./pages/Settings";
import TrafficMap from "./pages/TrafficMap";

function PincodeModal({ onLocationSet }) {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await api.post("/location/pincode", { pincode });
      localStorage.setItem("trafficundo_location", JSON.stringify(response.data));
      onLocationSet(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Enter a valid Kerala pincode.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-xl">
      <form className="w-full max-w-md rounded-[2rem] border border-white/15 bg-white/95 p-6 shadow-2xl dark:bg-slate-900/95" onSubmit={submit}>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-300">Kerala location</p>
        <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">Enter Your Kerala Pincode</h2>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          TrafficUndo will center the live map and district tools around your local area.
        </p>
        <input
          className="mt-6 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-bold text-slate-950 outline-none ring-cyan-400 transition focus:ring-4 dark:border-white/10 dark:bg-slate-950 dark:text-white"
          inputMode="numeric"
          maxLength="6"
          placeholder="Example: 682011"
          required
          value={pincode}
          onChange={(event) => setPincode(event.target.value)}
        />
        {error && <p className="mt-3 rounded-2xl bg-rose-100 px-4 py-3 text-sm font-bold text-rose-700 dark:bg-rose-500/15 dark:text-rose-200">{error}</p>}
        <button className="mt-5 w-full rounded-2xl bg-cyan-400 px-5 py-3 font-black text-slate-950 shadow-lg shadow-cyan-500/25 transition hover:bg-cyan-300" disabled={loading} type="submit">
          {loading ? "Locating..." : "Continue"}
        </button>
      </form>
    </div>
  );
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed right-4 top-4 z-[2100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-3">
      {toasts.map((toast) => (
        <div className="rounded-2xl border border-white/20 bg-slate-950/90 p-4 text-white shadow-2xl backdrop-blur" key={toast.id}>
          <p className="text-sm font-black">{toast.title}</p>
          <p className="mt-1 text-sm text-slate-300">{toast.message}</p>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [theme, setThemeState] = useState(localStorage.getItem("trafficundo_theme") || "dark");
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem("trafficundo_settings");
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });
  const [location, setLocation] = useState(() => {
    const stored = localStorage.getItem("trafficundo_location");
    return stored ? JSON.parse(stored) : null;
  });
  const [collapsed, setCollapsed] = useState(true);
  const [reportsVersion, setReportsVersion] = useState(0);
  const [toasts, setToasts] = useState([]);
  const user = useMemo(() => getAnonymousUser(), []);
  const socket = useMemo(() => io(SOCKET_URL, { transports: ["websocket", "polling"] }), []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("trafficundo_theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("trafficundo_settings", JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    const notify = (title, message) => {
      if (!settings.notifications) {
        return;
      }
      const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
      setToasts((current) => [...current, { id, title, message }].slice(-4));
      window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
      }, 4500);
    };

    socket.on("new_report", (report) => {
      setReportsVersion((value) => value + 1);
      notify("New road block reported", `${report.reason} in ${report.district}`);
    });
    socket.on("report_updated", () => setReportsVersion((value) => value + 1));

    return () => {
      socket.off("new_report");
      socket.off("report_updated");
    };
  }, [settings.notifications, socket]);

  const currentLocation = location
    ? [location.latitude, location.longitude]
    : KERALA_CENTER;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950 transition dark:bg-slate-950 dark:text-white">
      {!location && <PincodeModal onLocationSet={setLocation} />}
      <Navbar collapsed={collapsed} setCollapsed={setCollapsed} theme={theme} setTheme={setThemeState} />
      <ToastStack toasts={toasts} />

      <main className="min-h-screen px-4 py-5 transition lg:ml-72 lg:px-8">
        <Routes>
          <Route path="/" element={<Dashboard reportsVersion={reportsVersion} />} />
          <Route path="/map" element={<TrafficMap center={currentLocation} location={location} reportsVersion={reportsVersion} settings={settings} user={user} />} />
          <Route path="/report" element={<ReportBlock center={currentLocation} location={location} socket={socket} user={user} />} />
          <Route path="/chat" element={<DistrictChat location={location} socket={socket} user={user} />} />
          <Route path="/analytics" element={<Analytics reportsVersion={reportsVersion} />} />
          <Route path="/settings" element={<Settings location={location} setLocation={setLocation} settings={settings} setSettings={setSettings} theme={theme} setTheme={setThemeState} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
