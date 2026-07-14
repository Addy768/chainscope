const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function post(path, body, { form = false } = {}) {
  const opts = { method: "POST" };
  if (form) {
    opts.body = body;
  } else {
    opts.headers = { "Content-Type": "application/json" };
    opts.body = JSON.stringify(body);
  }
  const r = await fetch(`${BASE}${path}`, opts);
  if (!r.ok) throw new Error(`${path}: ${r.status}`);
  return r.json();
}

export const api = {
  health: () => fetch(`${BASE}/api/health`).then((r) => r.json()),
  classify: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return post("/api/classify", fd, { form: true });
  },
  detect: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return post("/api/detect-components", fd, { form: true });
  },
  risk: (features) => post("/api/risk-score", features),
};
