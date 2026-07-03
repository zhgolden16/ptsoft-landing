/* ============================================================
   PT Soft — Landing page behavior
   Vanilla JS only: video source selection, reveal animations,
   3D tilt, process timeline, portfolio rendering.
   ============================================================ */
(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;

  /* ---------- Hero video: dedicated asset per device class ----------
     Only the appropriate video is ever loaded — the other one is
     never requested, keeping mobile data usage low. */
  const heroVideo = document.getElementById("heroVideo");
  const mobileQuery = window.matchMedia("(max-width: 820px)");

  function applyHeroSource(isMobile) {
    const src = isMobile ? "assets/hero-mobile.mp4" : "assets/hero-desktop.mp4";
    if (heroVideo.getAttribute("data-current") === src) return;
    heroVideo.setAttribute("data-current", src);
    heroVideo.src = src;
    heroVideo.load();
    heroVideo.play().catch(() => { /* autoplay may be deferred until interaction */ });
  }
  applyHeroSource(mobileQuery.matches);
  mobileQuery.addEventListener("change", (e) => applyHeroSource(e.matches));

  /* ---------- Navigation ---------- */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = document.getElementById("navBurger");
  const navLinks = document.getElementById("navLinks");
  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      navLinks.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
    }
  });

  /* ---------- Portfolio rendering ---------- */
  function abstractCover(index) {
    // Generated abstract brand illustration (pulse line over gradient mesh).
    const hues = [
      ["#1d3a5f", "#2f9d7f"],
      ["#14213a", "#3b6ea5"],
      ["#2f9d7f", "#43c6a8"],
    ];
    const [a, b] = hues[index % hues.length];
    const seed = (index * 137) % 60;
    return `
      <svg viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="pc${index}" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/>
          </linearGradient>
          <radialGradient id="pg${index}" cx="0.8" cy="0.15" r="0.9">
            <stop offset="0" stop-color="rgba(255,255,255,0.22)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/>
          </radialGradient>
        </defs>
        <rect width="640" height="360" fill="url(#pc${index})"/>
        <rect width="640" height="360" fill="url(#pg${index})"/>
        <g stroke="rgba(255,255,255,0.12)" stroke-width="1">
          ${[0, 1, 2, 3, 4].map(i => `<circle cx="${520 - seed}" cy="${60 + seed}" r="${60 + i * 46}" fill="none"/>`).join("")}
        </g>
        <path d="M40 ${190 + seed / 3} h120 l24-56 32 112 28-84 20 28 h336"
              fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="5"
              stroke-linecap="round" stroke-linejoin="round"/>
        <text x="48" y="322" font-family="Sora, sans-serif" font-size="30" font-weight="700"
              fill="rgba(255,255,255,0.5)" letter-spacing="8">{ / }</text>
      </svg>`;
  }

  function renderPortfolio() {
    const grid = document.getElementById("portfolioGrid");
    if (!grid || typeof PTS_PROJECTS === "undefined") return;

    grid.innerHTML = PTS_PROJECTS.map((p, i) => {
      const status = PTS_PROJECT_STATUS[p.status] || PTS_PROJECT_STATUS.planned;
      const cover = p.cover
        ? `<img src="${p.cover}" alt="${p.name} — cover" loading="lazy" decoding="async" />`
        : abstractCover(i);
      const tech = p.tech.map((t) => `<span>${t}</span>`).join("");
      const link = p.link
        ? `<a class="project__link" href="${p.link}"${p.link.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>
             View project
             <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M7 17 17 7m0 0H9m8 0v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
           </a>`
        : "";
      return `
        <article class="card project tilt reveal" style="--reveal-delay:${(i % 3) * 0.12}s">
          <div class="project__cover">
            ${cover}
            <span class="project__status" style="--status-color:${status.color}">${status.label}</span>
          </div>
          <div class="project__body">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="project__tech">${tech}</div>
            ${link}
          </div>
        </article>`;
    }).join("");
  }
  renderPortfolio();

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach((el, i) => {
    if (!el.style.getPropertyValue("--reveal-delay")) {
      // Light stagger within each section for a composed entrance.
      el.style.setProperty("--reveal-delay", `${(i % 4) * 0.08}s`);
    }
    revealObserver.observe(el);
  });

  /* ---------- 3D tilt (desktop pointer only) ---------- */
  if (!isTouch && !prefersReducedMotion) {
    const MAX_TILT = 7;
    document.querySelectorAll(".tilt").forEach((el) => {
      let raf = 0;
      el.addEventListener("pointermove", (e) => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform =
            `perspective(900px) rotateY(${px * MAX_TILT}deg) rotateX(${-py * MAX_TILT}deg) translateY(-4px)`;
          raf = 0;
        });
      });
      el.addEventListener("pointerleave", () => {
        cancelAnimationFrame(raf);
        raf = 0;
        el.style.transform = "";
      });
    });
  }

  /* ---------- Process timeline: line fills + dots light up ---------- */
  const track = document.getElementById("processTrack");
  if (track) {
    const steps = Array.from(track.querySelectorAll(".process__step"));

    const stepObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-active");
            stepObserver.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.6 }
    );
    steps.forEach((s) => stepObserver.observe(s));

    const updateLine = () => {
      const r = track.getBoundingClientRect();
      const viewportAnchor = window.innerHeight * 0.72;
      const progress = Math.min(1, Math.max(0, (viewportAnchor - r.top) / r.height));
      track.style.setProperty("--line-progress", `${(progress * 100).toFixed(1)}%`);
    };
    updateLine();
    window.addEventListener("scroll", updateLine, { passive: true });
    window.addEventListener("resize", updateLine, { passive: true });
  }

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
