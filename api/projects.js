const { isAuthorized, loadProjects, saveProjects, json } = require("./_utils");

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const data = await loadProjects();
      return json(res, 200, data);
    }

    if (req.method === "PUT" || req.method === "POST") {
      if (!isAuthorized(req)) return json(res, 401, { error: "unauthorized" });
      const body = req.body || {};
      const saved = await saveProjects(body.projects);
      return json(res, 200, saved);
    }

    return json(res, 405, { error: "method not allowed" });
  } catch (err) {
    return json(res, 400, { error: err.message || "request failed" });
  }
};
