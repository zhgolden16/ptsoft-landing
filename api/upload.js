const { put } = require("@vercel/blob");
const { isAuthorized, json } = require("./_utils");

const MAX_BYTES = 4 * 1024 * 1024; // Vercel function body limit is ~4.5 MB
const ALLOWED = {
  "video/mp4": ".mp4",
  "video/webm": ".webm",
  "image/gif": ".gif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

function readRawBody(req) {
  if (req.body && Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (c) => {
      size += c.length;
      if (size > MAX_BYTES) { reject(new Error("file too large (max 4 MB)")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "method not allowed" });
  if (!isAuthorized(req)) return json(res, 401, { error: "unauthorized" });

  const contentType = (req.headers["content-type"] || "").split(";")[0].trim();
  const ext = ALLOWED[contentType];
  if (!ext) return json(res, 415, { error: `unsupported type: ${contentType}` });

  try {
    const body = await readRawBody(req);
    if (!body.length) return json(res, 400, { error: "empty body" });
    if (body.length > MAX_BYTES) return json(res, 413, { error: "file too large (max 4 MB)" });

    const stamp = new Date().toISOString().slice(0, 10);
    const rand = Math.random().toString(36).slice(2, 8);
    const blob = await put(`media/${stamp}-${rand}${ext}`, body, {
      access: "public",
      contentType,
    });
    return json(res, 200, { url: blob.url, type: contentType.startsWith("video") ? "video" : contentType === "image/gif" ? "gif" : "image" });
  } catch (err) {
    return json(res, 400, { error: err.message || "upload failed" });
  }
};
