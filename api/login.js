const { verifyPassword, makeSessionCookie, json } = require("./_utils");

module.exports = async (req, res) => {
  if (req.method !== "POST") return json(res, 405, { error: "method not allowed" });

  const password = req.body && typeof req.body.password === "string" ? req.body.password : "";
  if (!password) return json(res, 400, { error: "password required" });

  if (!verifyPassword(password, process.env.ADMIN_PASSWORD_HASH)) {
    // Small fixed delay to blunt brute-force attempts.
    await new Promise((r) => setTimeout(r, 800));
    return json(res, 401, { error: "invalid credentials" });
  }

  res.setHeader("Set-Cookie", makeSessionCookie());
  return json(res, 200, { ok: true });
};
