const { hasValidSession, json } = require("./_utils");

module.exports = async (req, res) => {
  return json(res, 200, { ok: hasValidSession(req) });
};
