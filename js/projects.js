/* ============================================================
   PT Soft — Portfolio data
   ------------------------------------------------------------
   To add a project, append one object to PTS_PROJECTS:

   {
     name:        "Project name",              // required
     description: "One or two sentences.",     // required
     tech:        ["Stack", "Items"],          // required
     status:      "live" | "development" | "planned",  // required
     cover:       "assets/covers/my-cover.jpg",// optional — omit to
                                               // auto-generate an
                                               // abstract brand cover
     link:        "https://…"                  // optional
   }

   The grid layout scales automatically as entries grow.
   ============================================================ */

const PTS_PROJECT_STATUS = {
  live:        { label: "Live",           color: "#43c6a8" },
  development: { label: "In development", color: "#e8a13a" },
  planned:     { label: "Planned",        color: "#3b6ea5" },
};

const PTS_PROJECTS = [
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
