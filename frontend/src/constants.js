export const KERALA_CENTER = [10.8505, 76.2711];

export const KERALA_DISTRICTS = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

export const REPORT_REASONS = [
  "Accident",
  "Road Work",
  "Flood",
  "Tree Fall",
  "Political Event",
  "Other",
];

export const DEFAULT_SETTINGS = {
  notifications: true,
  autoRefresh: true,
  heatmap: true,
};

export const UPI_ID = "pranavartist1@okaxis";

export function getAnonymousUser() {
  const stored = localStorage.getItem("trafficundo_user");
  if (stored) {
    return JSON.parse(stored);
  }

  const suffix = Math.floor(1000 + Math.random() * 9000);
  const user = {
    id: crypto.randomUUID ? crypto.randomUUID() : `anon-${Date.now()}`,
    username: `User_${suffix}`,
  };
  localStorage.setItem("trafficundo_user", JSON.stringify(user));
  return user;
}

export function formatDate(value) {
  if (!value) {
    return "Just now";
  }
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function createUpiLink(amount, reference) {
  const query = new URLSearchParams({
    pa: UPI_ID,
    pn: "TrafficUndo Homeless Support",
    am: String(amount || ""),
    cu: "INR",
    tn: reference || "TrafficUndo Donation",
  });
  return `upi://pay?${query.toString()}`;
}

export function createQrUrl(upiLink) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`;
}
