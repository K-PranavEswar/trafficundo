import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "grid" },
  { to: "/map", label: "Live Map", icon: "map" },
  { to: "/report", label: "Report Block", icon: "alert" },
  { to: "/chat", label: "District Chat", icon: "chat" },
  { to: "/analytics", label: "Analytics", icon: "chart" },
  { to: "/settings", label: "Settings", icon: "settings" },
  { to: "/about", label: "About Us", icon: "info" },
];

function Icon({ name }) {
  const common = "h-5 w-5";
  const icons = {
    grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
    map: <path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Zm0 0V3m6 18V6" />,
    alert: <path d="M12 3 2 21h20L12 3Zm0 7v5m0 3h.01" />,
    chat: <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />,
    heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />,
    chart: <path d="M4 19V5m0 14h17M8 16v-5m5 5V8m5 8v-9" />,
    settings: <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm8-3a8 8 0 0 0-.1-1.3l2-1.5-2-3.5-2.4 1a8 8 0 0 0-2.2-1.3L15 3h-4l-.4 2.4a8 8 0 0 0-2.2 1.3l-2.4-1-2 3.5 2 1.5A8 8 0 0 0 6 12c0 .4 0 .9.1 1.3l-2 1.5 2 3.5 2.4-1a8 8 0 0 0 2.2 1.3L11 21h4l.4-2.4a8 8 0 0 0 2.2-1.3l2.4 1 2-3.5-2-1.5c.1-.4.1-.9.1-1.3Z" />,
    info: <path d="M12 17v-6m0-4h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0Z" />,
  };

  return (
    <svg className={common} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" viewBox="0 0 24 24">
      {icons[name]}
    </svg>
  );
}

function Navbar({ collapsed, setCollapsed, theme, setTheme }) {
  return (
    <>
      <button
        className="fixed left-4 top-4 z-[1100] rounded-2xl border border-white/20 bg-slate-950/80 p-3 text-white shadow-xl backdrop-blur lg:hidden"
        type="button"
        onClick={() => setCollapsed((value) => !value)}
      >
        <span className="sr-only">Toggle sidebar</span>
        <Icon name="grid" />
      </button>

      <aside
        className={`fixed inset-y-0 left-0 z-[1050] w-72 border-r border-white/10 bg-slate-950/90 text-white shadow-2xl backdrop-blur-2xl transition-transform duration-300 dark:bg-slate-950/95 lg:translate-x-0 ${
          collapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="flex h-full flex-col p-5">
          <div className="mb-8 flex items-center justify-between">
            <NavLink className="group" to="/" onClick={() => setCollapsed(true)}>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-cyan-300">TrafficUndo</p>
              <h1 className="text-xl font-black tracking-tight">Kerala Traffic Ops</h1>
            </NavLink>
            <button className="rounded-xl border border-white/10 p-2 text-slate-300 lg:hidden" type="button" onClick={() => setCollapsed(true)}>
              X
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-2">
            {links.map((link) => (
              <NavLink
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? "bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
                key={link.to}
                to={link.to}
                onClick={() => setCollapsed(true)}
              >
                <Icon name={link.icon} />
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Theme</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {["light", "dark"].map((mode) => (
                <button
                  className={`rounded-2xl px-3 py-2 text-sm font-black ${
                    theme === mode ? "bg-white text-slate-950" : "bg-white/10 text-slate-300"
                  }`}
                  key={mode}
                  type="button"
                  onClick={() => setTheme(mode)}
                >
                  {mode[0].toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Navbar;
