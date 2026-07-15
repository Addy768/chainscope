const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function req(path, opts = {}) {
  const r = await fetch(`${BASE}${path}`, opts);
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.json();
}

export const api = {
  health:      () => req("/api/health"),
  version:     () => req("/api/version"),
  riskSchema:  () => req("/api/risk-score/schema"),
  risk:        (body) =>
    req("/api/risk-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  classify: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return req("/api/classify", { method: "POST", body: fd });
  },
  detect: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return req("/api/detect-components", { method: "POST", body: fd });
  },
};
