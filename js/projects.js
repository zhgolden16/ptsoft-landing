/* ============================================================
   PT Soft — Portfolio data
   ------------------------------------------------------------
   To add a project, append one object to PTS_PROJECTS:

   {
     name:        "Project name",              // required
     description: "One or two sentences.",     // required
     tech:        ["Stack", "Items"],          // required
     status:      "live" | "development" | "planned",  // required
     media: {                                  // optional — best way
       type: "gif" | "image" | "video",        // to show the software
       src:  "assets/work/my-demo.gif"         // in action
     },
     cover:       "assets/work/cover.jpg",     // optional (legacy image)
     link:        "https://…"                  // optional
   }

   Recommended media specs:
   - GIF/video: 16:9, ~800×450, under 3 MB, short loop (5–10 s)
   - Videos (.mp4) are lighter than GIFs for the same quality —
     prefer mp4 when possible; they autoplay muted in a loop.
   - Drop files into site/assets/work/ and reference them here.

   If no media/cover is given, a premium abstract brand
   illustration is generated automatically.
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
