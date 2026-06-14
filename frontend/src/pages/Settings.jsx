import { useState } from "react";
import api from "../api";

function Toggle({ label, description, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
      <div>
        <p className="font-black">{label}</p>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{description}</p>
      </div>
      {/* Ensure 'checked' is always a boolean to prevent React uncontrolled input warnings */}
      <input 
        className="h-5 w-5 accent-cyan-400" 
        checked={checked || false} 
        type="checkbox" 
        onChange={(event) => onChange(event.target.checked)} 
      />
    </label>
  );
}

function Settings({ location, setLocation, settings, setSettings, theme, setTheme }) {
  const [pincode, setPincode] = useState(location?.pincode || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateSetting = (key, value) => {
    setSettings((current) => {
      // Create the new state
      const updatedSettings = { ...current, [key]: value };
      
      // Save it to localStorage so it persists on reload!
      localStorage.setItem("trafficundo_settings", JSON.stringify(updatedSettings));
      
      return updatedSettings;
    });
  };

  const updateLocation = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      const response = await api.post("/location/pincode", { pincode });
      localStorage.setItem("trafficundo_location", JSON.stringify(response.data));
      setLocation(response.data);
      setMessage(`Location updated to ${response.data.label}.`);
    } catch (err) {
      setError(err.response?.data?.error || "Unable to update location.");
    }
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <p className="eyebrow">Preferences</p>
          <h1>Settings</h1>
          <p>Control theme, realtime notification behavior, heatmap visibility, and Kerala pincode location.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="glass-panel p-5">
          <h2 className="text-2xl font-black">Theme Toggle</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {["dark", "light"].map((mode) => (
              <button className={`rounded-2xl px-5 py-4 font-black ${theme === mode ? "bg-cyan-400 text-slate-950" : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white"}`} key={mode} type="button" onClick={() => setTheme(mode)}>
                {mode[0].toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {/* Added Optional Chaining (?) just in case settings is initially null */}
            <Toggle 
              checked={settings?.notifications} 
              description="Show realtime toast alerts when new reports arrive." 
              label="Enable Notifications" 
              onChange={(value) => updateSetting("notifications", value)} 
            />
            <Toggle 
              checked={settings?.autoRefresh} 
              description="Keep report views synchronized with realtime updates." 
              label="Auto Refresh Reports" 
              onChange={(value) => updateSetting("autoRefresh", value)} 
            />
            <Toggle 
              checked={settings?.heatmap} 
              description="Display traffic density and flood alert circles on the map." 
              label="Show Traffic Heatmap" 
              onChange={(value) => updateSetting("heatmap", value)} 
            />
          </div>
        </div>

        {/* ... Location Form remains the same ... */}
        <form className="glass-panel p-5" onSubmit={updateLocation}>
          <h2 className="text-2xl font-black">Location</h2>
          <p className="mt-2 text-sm font-semibold text-slate-500 dark:text-slate-300">
            Current: {location?.label || "Not selected"}
          </p>
          <input className="mt-5 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-lg font-bold outline-none dark:border-white/10 dark:bg-slate-900" inputMode="numeric" maxLength="6" placeholder="Kerala pincode" value={pincode} onChange={(event) => setPincode(event.target.value)} />
          {message && <p className="mt-4 rounded-2xl bg-emerald-500/10 p-3 font-bold text-emerald-600 dark:text-emerald-200">{message}</p>}
          {error && <p className="mt-4 rounded-2xl bg-rose-500/10 p-3 font-bold text-rose-600 dark:text-rose-200">{error}</p>}
          <button className="mt-5 w-full rounded-2xl bg-cyan-400 px-5 py-3 font-black text-slate-950" type="submit">
            Save Location
          </button>
        </form>
      </div>
    </section>
  );
}

export default Settings;