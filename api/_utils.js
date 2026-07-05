/* Shared helpers for PTS API functions.
   Files prefixed with "_" are not exposed as endpoints by Vercel. */
const crypto = require("crypto");
const { put, list } = require("@vercel/blob");

const SESSION_COOKIE = "pts_s";
const SESSION_DAYS = 7;
const PROJECTS_PATH = "data/projects.json";

/* ---------- password (scrypt) ---------- */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = crypto.scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${key}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, keyHex] = stored.split(":");
  const expected = Buffer.from(keyHex, "hex");
  const actual = crypto.scryptSync(password, salt, expected.length);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

/* ---------- signed session cookie ---------- */
function sign(value) {
  return crypto.createHmac("sha256", process.env.SESSION_SECRET).update(value).digest("hex");
}

function makeSessionCookie() {
  const exp = Date.now() + SESSION_DAYS * 864e5;
  const value = `${exp}.${sign(String(exp))}`;
  const maxAge = SESSION_DAYS * 86400;
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

function readCookie(req, name) {
  const raw = req.headers.cookie || "";
  for (const part of raw.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k === name) return v.join("=");
  }
  return null;
}

function hasValidSession(req) {
  const value = readCookie(req, SESSION_COOKIE);
  if (!value) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig) return false;
  if (Number(exp) < Date.now()) return false;
  const expected = sign(exp);
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

/* Owner session OR API key (for the future automation system). */
function isAuthorized(req) {
  const key = req.headers["x-api-key"];
  if (key && process.env.PTS_API_KEY && key === process.env.PTS_API_KEY) return true;
  return hasValidSession(req);
}

/* ---------- projects storage (Vercel Blob) ---------- */
const DEFAULT_PROJECTS = [
  {
    name: "Pulse Tailor Suite",
    description:
      "Our flagship atelier management platform: orders, measurements, production tracking, and client billing for tailoring workshops — fully automated end to end.",
    tech: ["Desktop", "Android", "AI"],
    status: "development",
  },
  {
    name: "PTS Automation Core",
    description:
      "The in-house automation engine powering our client systems: document generation, smart notifications, stock movements, and scheduled reporting.",
    tech: ["Web", "API", "Automation"],
    status: "development",
  },
  {
    name: "Your project, next",
    description:
      "This space is reserved for the system we build around your business. Tell us how you work — we will engineer the rest.",
    tech: ["AI-first", "Tailored"],
    status: "planned",
    link: "#contact",
  },
];

async function loadProjects() {
  const { blobs } = await list({ prefix: PROJECTS_PATH, limit: 1 });
  if (!blobs.length) return { projects: DEFAULT_PROJECTS, updatedAt: null };
  // Cache-busting query so we never read a stale CDN copy after a save.
  const res = await fetch(`${blobs[0].url}?t=${Date.now()}`);
  if (!res.ok) return { projects: DEFAULT_PROJECTS, updatedAt: null };
  return res.json();
}

const STATUSES = new Set(["live", "development", "planned"]);

function sanitizeProjects(input) {
  if (!Array.isArray(input)) throw new Error("projects must be an array");
  if (input.length > 200) throw new Error("too many projects");
  return input.map((p) => {
    const s = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
    const out = {
      name: s(p.name, 120),
      description: s(p.description, 600),
      tech: Array.isArray(p.tech) ? p.tech.slice(0, 8).map((t) => s(t, 30)).filter(Boolean) : [],
      status: STATUSES.has(p.status) ? p.status : "planned",
    };
    if (!out.name) throw new Error("every project needs a name");
    const link = s(p.link, 400);
    if (link) out.link = link;
    if (p.media && typeof p.media === "object") {
      const type = ["gif", "image", "video"].includes(p.media.type) ? p.media.type : "image";
      const src = s(p.media.src, 500);
      if (src) out.media = { type, src };
    }
    // Gallery: ordered mixed media (images + videos) shown in the visitor
    // lightbox. First item doubles as the card cover.
    if (Array.isArray(p.gallery)) {
      const gallery = p.gallery.slice(0, 10).map((m) => {
        if (!m || typeof m !== "object") return null;
        const type = ["gif", "image", "video"].includes(m.type) ? m.type : "image";
        const src = s(m.src, 500);
        if (!src) return null;
        const item = { type, src };
        if (["portrait", "landscape"].includes(m.orientation)) item.orientation = m.orientation;
        return item;
      }).filter(Boolean);
      if (gallery.length) {
        out.gallery = gallery;
        // keep legacy single-media field in sync so older cached frontends
        // still render a cover
        out.media = { type: gallery[0].type, src: gallery[0].src };
      }
    }
    return out;
  });
}

async function saveProjects(projects) {
  const payload = { projects: sanitizeProjects(projects), updatedAt: new Date().toISOString() };
  await put(PROJECTS_PATH, JSON.stringify(payload, null, 2), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
  return payload;
}

/* ---------- misc ---------- */
function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

module.exports = {
  hashPassword,
  verifyPassword,
  makeSessionCookie,
  clearSessionCookie,
  hasValidSession,
  isAuthorized,
  loadProjects,
  saveProjects,
  json,
};
