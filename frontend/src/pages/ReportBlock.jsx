import L from "leaflet";
import { useState } from "react";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMapEvents } from "react-leaflet";

import api from "../api";
import { KERALA_DISTRICTS, REPORT_REASONS } from "../constants";

const pointIcon = (label) =>
  L.divIcon({
    className: "",
    html: `<div class="tu-marker">${label}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

function PointSelector({ setPoints }) {
  useMapEvents({
    click(event) {
      setPoints((current) => {
        if (!current.from) {
          return { ...current, from: event.latlng };
        }
        if (!current.to) {
          return { ...current, to: event.latlng };
        }
        return { from: event.latlng, to: null };
      });
    },
  });
  return null;
}

function ReportBlock({ center, location, user }) {
  const [points, setPoints] = useState({ from: null, to: null });
  const [form, setForm] = useState({
    district: location?.district || "Ernakulam",
    from_label: "Point A",
    to_label: "Point B",
    road_name: "",
    description: "",
    reason: "Accident",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateForm = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!points.from || !points.to) {
      setError("Select both Point A and Point B on the map.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/reports", {
        ...form,
        user_id: user.id,
        from_lat: points.from.lat,
        from_lng: points.from.lng,
        to_lat: points.to.lat,
        to_lng: points.to.lng,
        status: "Active",
      });
      setMessage("Road block reported successfully. Live map users will see it now.");
      setPoints({ from: null, to: null });
      setForm((current) => ({ ...current, description: "", road_name: "" }));
    } catch (err) {
      setError(err.response?.data?.error || "Unable to submit report.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <div className="page-title">
        <div>
          <p className="eyebrow">Community block reporting</p>
          <h1>Report Block</h1>
          <p>Click on the map to choose Point A and Point B. TrafficUndo draws the blocked route and broadcasts it instantly.</p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="glass-panel p-3">
          <MapContainer center={center} zoom={12} scrollWheelZoom className="h-[72vh] min-h-[540px]">
            <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <PointSelector setPoints={setPoints} />
            {points.from && (
              <Marker icon={pointIcon("A")} position={points.from}>
                <Popup>Point A</Popup>
              </Marker>
            )}
            {points.to && (
              <Marker icon={pointIcon("B")} position={points.to}>
                <Popup>Point B</Popup>
              </Marker>
            )}
            {points.from && points.to && <Polyline className="report-line" color="#ef4444" positions={[points.from, points.to]} weight={6} />}
          </MapContainer>
        </div>

        <form className="glass-panel p-5" onSubmit={submit}>
          <h2 className="text-2xl font-black">Block Details</h2>
          <div className="mt-5 space-y-4">
            <div>
              <label className="text-sm font-black text-slate-600 dark:text-slate-300">District</label>
              <select className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none dark:border-white/10 dark:bg-slate-900" value={form.district} onChange={(event) => updateForm("district", event.target.value)}>
                {KERALA_DISTRICTS.map((district) => (
                  <option key={district}>{district}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none dark:border-white/10 dark:bg-slate-900" placeholder="From Point A label" value={form.from_label} onChange={(event) => updateForm("from_label", event.target.value)} />
              <input className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none dark:border-white/10 dark:bg-slate-900" placeholder="To Point B label" value={form.to_label} onChange={(event) => updateForm("to_label", event.target.value)} />
            </div>
            <input className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none dark:border-white/10 dark:bg-slate-900" placeholder="Road name or route" value={form.road_name} onChange={(event) => updateForm("road_name", event.target.value)} />
            <select className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none dark:border-white/10 dark:bg-slate-900" value={form.reason} onChange={(event) => updateForm("reason", event.target.value)}>
              {REPORT_REASONS.map((reason) => (
                <option key={reason}>{reason}</option>
              ))}
            </select>
            <textarea className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-bold outline-none dark:border-white/10 dark:bg-slate-900" placeholder="Description" required value={form.description} onChange={(event) => updateForm("description", event.target.value)} />
            <div className="rounded-2xl bg-slate-100 p-4 text-sm font-bold text-slate-600 dark:bg-white/5 dark:text-slate-300">
              Point A: {points.from ? `${points.from.lat.toFixed(5)}, ${points.from.lng.toFixed(5)}` : "not selected"}
              <br />
              Point B: {points.to ? `${points.to.lat.toFixed(5)}, ${points.to.lng.toFixed(5)}` : "not selected"}
            </div>
            {error && <p className="rounded-2xl bg-rose-500/10 p-3 font-bold text-rose-600 dark:text-rose-200">{error}</p>}
            {message && <p className="rounded-2xl bg-emerald-500/10 p-3 font-bold text-emerald-600 dark:text-emerald-200">{message}</p>}
            <button className="w-full rounded-2xl bg-rose-500 px-5 py-3 font-black text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-400" disabled={saving} type="submit">
              {saving ? "Submitting..." : "Submit Road Block"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default ReportBlock;
