const { clearSessionCookie, json } = require("./_utils");

module.exports = async (req, res) => {
  res.setHeader("Set-Cookie", clearSessionCookie());
  return json(res, 200, { ok: true });
};
