/* ============================================================
   PT Soft — Landing page behavior  v3
   Splash, neural canvas, scroll-linked 3D engine, carousels,
   live portfolio from /api/projects, hidden owner entrance.
   ============================================================ */
(() => {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches;
  const mobileQuery = window.matchMedia("(max-width: 820px)");

  /* ================= Brand splash ================= */
  const splash = document.getElementById("splash");
  if (reduced) {
    splash.remove();
  } else {
    document.body.classList.add("is-locked");
    const closeSplash = () => {
      splash.classList.add("is-done");
      document.body.classList.remove("is-locked");
      setTimeout(() => splash.remove(), 700);
    };
    setTimeout(closeSplash, 2100);
    splash.addEventListener("click", closeSplash);
  }

  /* ================= Hero video (dedicated per device) ================= */
  const heroVideo = document.getElementById("heroVideo");
  function applyHeroSource(isMobile) {
    const src = isMobile ? "assets/hero-mobile.mp4" : "assets/hero-desktop.mp4";
    if (heroVideo.getAttribute("data-current") === src) return;
    heroVideo.setAttribute("data-current", src);
    heroVideo.src = src;
    heroVideo.load();
    heroVideo.play().catch(() => {});
  }
  applyHeroSource(mobileQuery.matches);
  mobileQuery.addEventListener("change", (e) => applyHeroSource(e.matches));
  // The looping hero video keeps decoding even when scrolled far past it —
  // pause it off-screen (perf), resume when the hero returns.
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) heroVideo.play().catch(() => {});
    else heroVideo.pause();
  }).observe(document.getElementById("hero"));

  /* ================= Neural network canvas ================= */
  const canvas = document.getElementById("neuralCanvas");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, nodes = [], running = true;
    const pointer = { x: -9999, y: -9999 };
    const COUNT = () => (mobileQuery.matches ? 18 : 42);
    const LINK = 130;
    const FRAME_MS = 33; // ~30fps is plenty for ambient motion, halves the cost

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = COUNT();
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.2 + Math.random() * 1.8,
      }));
    }

    let lastFrame = 0;
    function frame(now) {
      if (!running) return;
      if (now && now - lastFrame < FRAME_MS) { requestAnimationFrame(frame); return; }
      lastFrame = now || 0;
      ctx.clearRect(0, 0, W, H);
      for (const p of nodes) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        const dx = pointer.x - p.x, dy = pointer.y - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 22500) { p.x += dx * 0.002; p.y += dy * 0.002; }
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK) {
            ctx.strokeStyle = `rgba(47, 157, 127, ${(1 - dist / LINK) * 0.35})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const p of nodes) {
        ctx.fillStyle = "rgba(29, 58, 95, 0.55)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    }, { passive: true });

    new IntersectionObserver(([entry]) => {
      const was = running;
      running = entry.isIntersecting && !document.hidden;
      if (running && !was) requestAnimationFrame(frame);
    }).observe(canvas);
    document.addEventListener("visibilitychange", () => {
      const was = running;
      running = !document.hidden;
      if (running && !was) requestAnimationFrame(frame);
    });
    requestAnimationFrame(frame);
  }

  /* ================= Scroll engine (single rAF) ================= */
  const scrollPulse = document.getElementById("scrollPulse");
  const floats = Array.from(document.querySelectorAll("[data-float]"));
  const dividers = Array.from(document.querySelectorAll(".ecg-divider__path"));
  dividers.forEach((p) => {
    const len = p.getTotalLength();
    p.style.setProperty("--ecg-len", len);
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });
  const track = document.getElementById("processTrack");
  let ticking = false;

  function onScrollFrame() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight - vh;

    scrollPulse.style.transform = `scaleX(${docH > 0 ? y / docH : 0})`;

    if (y < vh * 1.2) {
      heroVideo.style.transform = `translateY(${y * 0.3}px) scale(${1 + y / vh * 0.08})`;
    }

    // Batch all layout READS first, then all WRITES — interleaving them
    // forces a reflow per element and was a main source of jank.
    const floatRects = reduced ? null : floats.map((el) => el.getBoundingClientRect());
    const dividerRects = dividers.map((p) => p.closest(".ecg-divider").getBoundingClientRect());
    const trackRect = track ? track.getBoundingClientRect() : null;

    if (floatRects) {
      floats.forEach((el, i) => {
        const r = floatRects[i];
        const center = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-center * parseFloat(el.dataset.float) * 0.2).toFixed(1)}px, 0)`;
      });
    }

    dividers.forEach((p, i) => {
      const r = dividerRects[i];
      const prog = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9)));
      const len = parseFloat(p.style.getPropertyValue("--ecg-len"));
      p.style.strokeDashoffset = len * (1 - prog);
    });

    if (trackRect) {
      const progress = Math.min(1, Math.max(0, (vh * 0.72 - trackRect.top) / trackRect.height));
      track.style.setProperty("--line-progress", `${(progress * 100).toFixed(1)}%`);
    }
  }
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); }
  }, { passive: true });
  window.addEventListener("resize", onScrollFrame, { passive: true });
  onScrollFrame();

  /* ================= Navigation ================= */
  const nav = document.getElementById("nav");
  const setNavState = () => nav.classList.toggle("is-scrolled", window.scrollY > 24);
  setNavState();
  window.addEventListener("scroll", setNavState, { passive: true });

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

  // In-page anchor navigation done fully by hand. Both native hash-jumps
  // and browser smooth scrolling (scroll-behavior / scrollIntoView smooth)
  // proved unreliable on this page in Chromium, so we animate the scroll
  // ourselves with instant per-frame scrollTo steps — nothing to stall.
  // setTimeout (not rAF) drives the steps so the scroll still completes in
  // throttled/background tabs where rAF is paused.
  let scrollAnim = 0;
  function animateScrollTo(targetY) {
    clearTimeout(scrollAnim);
    const startY = window.scrollY;
    const dist = targetY - startY;
    if (Math.abs(dist) < 2) return;
    if (reduced) return window.scrollTo(0, targetY);
    const dur = Math.min(900, 380 + Math.abs(dist) * 0.22);
    const t0 = performance.now();
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = () => {
      const p = Math.min(1, (performance.now() - t0) / dur);
      window.scrollTo(0, startY + dist * ease(p));
      if (p < 1) scrollAnim = setTimeout(step, 16);
    };
    step();
  }
  // A wheel/touch interaction from the user takes over immediately.
  window.addEventListener("wheel", () => clearTimeout(scrollAnim), { passive: true });
  window.addEventListener("touchstart", () => clearTimeout(scrollAnim), { passive: true });

  document.addEventListener("click", (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link || link.getAttribute("href").length < 2) return;
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const navH = (nav && nav.offsetHeight) || 76;
    animateScrollTo(target.getBoundingClientRect().top + window.scrollY - navH - 8);
    history.pushState(null, "", link.getAttribute("href"));
  });

  const navMap = new Map();
  document.querySelectorAll("[data-nav]").forEach((a) => navMap.set(a.dataset.nav, a));
  const sectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const link = navMap.get(entry.target.id);
      if (link && entry.isIntersecting) {
        navMap.forEach((a) => a.classList.remove("is-active"));
        link.classList.add("is-active");
      }
    }
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["about", "services", "portfolio", "why", "process"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  /* ================= Hero title word cascade ================= */
  const heroTitle = document.getElementById("heroTitle");
  if (heroTitle) {
    let wi = 0;
    heroTitle.querySelectorAll(".line").forEach((line) => {
      const words = line.textContent.trim().split(/\s+/);
      line.textContent = "";
      words.forEach((w, i) => {
        const span = document.createElement("span");
        span.className = "word";
        span.textContent = w;
        span.style.setProperty("--wd", `${0.35 + wi * 0.09}s`);
        line.appendChild(span);
        if (i < words.length - 1) line.appendChild(document.createTextNode(" "));
        wi++;
      });
    });
    setTimeout(() => heroTitle.classList.add("is-in"), reduced ? 0 : 400);
  }

  /* ================= Card FX (reusable for dynamic cards) ================= */
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
        // Once the reveal transition (0.85s + up to 0.24s delay) is over,
        // drop it so inline transforms (tilt) respond instantly.
        setTimeout(() => entry.target.classList.add("has-revealed"), 1200);
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  let revealSeq = 0;
  function wireReveal(el) {
    if (!el.style.getPropertyValue("--reveal-delay")) {
      el.style.setProperty("--reveal-delay", `${(revealSeq++ % 4) * 0.08}s`);
    }
    revealObserver.observe(el);
  }

  function wireGlow(el) {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  const MAX_TILT = 7;
  function wireTilt(el) {
    if (isTouch || reduced) return;
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
  }

  function wireCardFX(root) {
    root.querySelectorAll(".reveal").forEach(wireReveal);
    root.querySelectorAll(".glow-track").forEach(wireGlow);
    root.querySelectorAll(".tilt").forEach(wireTilt);
  }
  wireCardFX(document);

  if (!isTouch && !reduced) {
    document.querySelectorAll(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  /* ================= Portfolio (live data from API) ================= */
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function abstractCover(index) {
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

  /* full media list for the lightbox: gallery array, else legacy single */
  function galleryOf(p) {
    if (Array.isArray(p.gallery) && p.gallery.length) return p.gallery;
    const m = p.media || (p.cover ? { type: "image", src: p.cover } : null);
    return m && m.src ? [m] : [];
  }

  function projectMedia(p, i) {
    const items = galleryOf(p);
    if (!items.length) return abstractCover(i);
    const m = items[0];
    if (m.type === "video") {
      // no autoplay attribute — an IntersectionObserver plays covers only
      // while they are on screen (page was getting heavy with all videos
      // running at once)
      return `<video src="${esc(m.src)}" muted loop playsinline preload="metadata" data-cover-video aria-label="${esc(p.name)} — preview"></video>`;
    }
    return `<img src="${esc(m.src)}" alt="${esc(p.name)} — preview" loading="lazy" decoding="async" />`;
  }

  /* play card cover videos only while visible */
  const coverVideoIO = new IntersectionObserver((entries) => {
    for (const en of entries) {
      if (en.isIntersecting) en.target.play().catch(() => {});
      else en.target.pause();
    }
  }, { threshold: 0.25 });

  let lastProjects = [];

  function renderPortfolio(projects) {
    const grid = document.getElementById("portfolioGrid");
    if (!grid) return;
    lastProjects = projects;
    const t = window.ptsT || ((k) => k);
    grid.innerHTML = projects.map((p, i) => {
      const status = PTS_PROJECT_STATUS[p.status] || PTS_PROJECT_STATUS.planned;
      const statusLabel = t(`st.${p.status}`) !== `st.${p.status}` ? t(`st.${p.status}`) : status.label;
      const tech = (p.tech || []).map((t2) => `<span>${esc(t2)}</span>`).join("");
      const items = galleryOf(p);
      const peek = items.length
        ? `<div class="project__peek" aria-hidden="true">
             <svg viewBox="0 0 24 24" width="17" height="17"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>
             <span>${esc(t("lb.open"))}</span>
             <span class="project__peek-count">${items.length}</span>
           </div>`
        : "";
      const link = p.link
        ? `<a class="project__link" href="${esc(p.link)}"${p.link.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>
             ${esc(t("pf.view"))}
             <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M7 17 17 7m0 0H9m8 0v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
           </a>`
        : "";
      return `
        <article class="card project tilt reveal glow-track${items.length ? " project--openable" : ""}" data-project-index="${i}" style="--reveal-delay:${(i % 3) * 0.12}s"${items.length ? ` tabindex="0" role="button" aria-label="${esc(p.name)} — ${esc(t("lb.open"))}"` : ""}>
          <div class="project__cover">
            ${projectMedia(p, i)}
            <span class="project__status" style="--status-color:${status.color}">${esc(statusLabel)}</span>
            ${peek}
          </div>
          <div class="project__body">
            <h3>${esc(p.name)}</h3>
            <p>${esc(p.description)}</p>
            <div class="project__tech">${tech}</div>
            ${link}
          </div>
        </article>`;
    }).join("");
    wireCardFX(grid);
    grid.querySelectorAll("[data-cover-video]").forEach((v) => coverVideoIO.observe(v));
    window.dispatchEvent(new CustomEvent("pts:portfolio-rendered"));
  }

  /* open the gallery from anywhere on an openable card (except real links) */
  const portfolioGridEl = document.getElementById("portfolioGrid");
  if (portfolioGridEl) {
    portfolioGridEl.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;
      const card = e.target.closest(".project--openable");
      if (card) openLightbox(lastProjects[Number(card.dataset.projectIndex)]);
    });
    portfolioGridEl.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".project--openable");
      if (card) { e.preventDefault(); openLightbox(lastProjects[Number(card.dataset.projectIndex)]); }
    });
  }

  /* ================= Media lightbox (fullscreen gallery) ================= */
  const lb = document.createElement("div");
  lb.className = "lb";
  lb.hidden = true;
  lb.innerHTML = `
    <button class="lb__close" aria-label="Close">✕</button>
    <div class="lb__stage">
      <button class="lb__nav lb__nav--prev" aria-label="Previous">‹</button>
      <div class="lb__track" tabindex="-1"></div>
      <button class="lb__nav lb__nav--next" aria-label="Next">›</button>
    </div>
    <div class="lb__meta">
      <h3 class="lb__title"></h3>
      <span class="lb__counter"></span>
    </div>`;
  document.body.appendChild(lb);
  const lbTrack = lb.querySelector(".lb__track");
  const lbTitle = lb.querySelector(".lb__title");
  const lbCounter = lb.querySelector(".lb__counter");
  let lbCount = 0;
  let lbIndex = 0;

  // element-scroll animator (same instant-steps approach as page anchors —
  // browser smooth scrolling is unreliable on this site)
  let lbAnim = 0;
  function lbScrollToSlide(idx) {
    clearTimeout(lbAnim);
    const w = lbTrack.clientWidth;
    const dirMul = document.documentElement.dir === "rtl" ? -1 : 1;
    const target = idx * w * dirMul;
    const start = lbTrack.scrollLeft;
    const dist = target - start;
    if (!dist) return;
    if (reduced) { lbTrack.scrollLeft = target; return; }
    const t0 = performance.now();
    const dur = 320;
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const step = () => {
      const pr = Math.min(1, (performance.now() - t0) / dur);
      lbTrack.scrollLeft = start + dist * ease(pr);
      if (pr < 1) lbAnim = setTimeout(step, 16);
    };
    step();
  }

  function lbSyncIndex() {
    const w = lbTrack.clientWidth || 1;
    const idx = Math.min(lbCount - 1, Math.max(0, Math.round(Math.abs(lbTrack.scrollLeft) / w)));
    if (idx === lbIndex) return;
    lbIndex = idx;
    lbUpdate();
  }
  let lbScrollRaf = 0;
  lbTrack.addEventListener("scroll", () => {
    if (lbScrollRaf) return;
    lbScrollRaf = requestAnimationFrame(() => { lbSyncIndex(); lbScrollRaf = 0; });
  }, { passive: true });

  function lbUpdate() {
    lbCounter.textContent = `${lbIndex + 1} / ${lbCount}`;
    lb.querySelector(".lb__nav--prev").disabled = lbIndex === 0;
    lb.querySelector(".lb__nav--next").disabled = lbIndex === lbCount - 1;
    // play only the active slide's video, pause the rest
    lbTrack.querySelectorAll("video").forEach((v, vi) => {
      if (Number(v.dataset.slide) === lbIndex) v.play().catch(() => {});
      else v.pause();
    });
  }

  function openLightbox(project) {
    if (!project) return;
    const items = galleryOf(project);
    if (!items.length) return;
    lbCount = items.length;
    lbIndex = 0;
    lbTitle.textContent = project.name || "";
    lbTrack.innerHTML = items.map((m, mi) => {
      const portrait = m.orientation === "portrait" ? " lb__media--portrait" : "";
      const media = m.type === "video"
        ? `<video src="${esc(m.src)}" class="lb__media${portrait}" data-slide="${mi}" controls playsinline preload="metadata"></video>`
        : `<img src="${esc(m.src)}" class="lb__media${portrait}" alt="${esc(project.name)} — ${mi + 1}" loading="lazy" decoding="async" />`;
      return `<div class="lb__slide">${media}</div>`;
    }).join("");
    lb.hidden = false;
    document.body.classList.add("is-locked");
    lbTrack.scrollLeft = 0;
    lbUpdate();
    lb.querySelector(".lb__close").focus();
  }

  function closeLightbox() {
    lbTrack.querySelectorAll("video").forEach((v) => v.pause());
    lb.hidden = true;
    document.body.classList.remove("is-locked");
    lbTrack.innerHTML = "";
  }

  lb.querySelector(".lb__close").addEventListener("click", closeLightbox);
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLightbox(); });
  lb.querySelector(".lb__nav--prev").addEventListener("click", () => lbScrollToSlide(Math.max(0, lbIndex - 1)));
  lb.querySelector(".lb__nav--next").addEventListener("click", () => lbScrollToSlide(Math.min(lbCount - 1, lbIndex + 1)));
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") lbScrollToSlide(Math.min(lbCount - 1, lbIndex + 1));
    else if (e.key === "ArrowLeft") lbScrollToSlide(Math.max(0, lbIndex - 1));
  });

  // Fallback seed renders instantly; live data replaces it when it arrives.
  if (typeof PTS_PROJECTS !== "undefined") renderPortfolio(PTS_PROJECTS);
  fetch("/api/projects")
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((data) => {
      if (Array.isArray(data.projects) && data.projects.length) renderPortfolio(data.projects);
    })
    .catch(() => { /* offline/local — seed stays */ });

  /* ================= Carousel dots (mobile) ================= */
  document.querySelectorAll(".carousel-dots").forEach((dotsEl) => {
    const carousel = document.getElementById(dotsEl.dataset.dotsFor);
    if (!carousel) return;
    const build = () => {
      if (!mobileQuery.matches) { dotsEl.innerHTML = ""; return; }
      const count = carousel.children.length;
      dotsEl.innerHTML = Array.from({ length: count }, () => "<span></span>").join("");
      update();
    };
    const update = () => {
      const dots = dotsEl.children;
      if (!dots.length) return;
      const idx = Math.round(carousel.scrollLeft / (carousel.scrollWidth - carousel.clientWidth) * (dots.length - 1)) || 0;
      Array.from(dots).forEach((d, i) => d.classList.toggle("is-active", i === idx));
    };
    build();
    mobileQuery.addEventListener("change", build);
    window.addEventListener("pts:portfolio-rendered", build);
    let raf = 0;
    carousel.addEventListener("scroll", () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { update(); raf = 0; });
    }, { passive: true });
  });

  /* ================= Process: expandable steps ================= */
  if (track) {
    const steps = Array.from(track.querySelectorAll(".process__step"));
    const stepObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-active");
          stepObserver.unobserve(entry.target);
        }
      }
    }, { threshold: 0.6 });
    steps.forEach((s) => stepObserver.observe(s));

    steps.forEach((step) => {
      const head = step.querySelector(".process__head");
      head.addEventListener("click", () => {
        const open = step.classList.toggle("is-open");
        head.setAttribute("aria-expanded", String(open));
      });
    });
    steps[0].classList.add("is-open");
    steps[0].querySelector(".process__head").setAttribute("aria-expanded", "true");
  }

  /* ================= Founders: expandable cards ================= */
  const foundersGrid = document.querySelector(".founders__grid");
  if (foundersGrid) {
    foundersGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".founder");
      if (!card) return;
      const open = card.classList.toggle("is-open");
      card.setAttribute("aria-expanded", String(open));
    });
    foundersGrid.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest(".founder");
      if (!card) return;
      e.preventDefault();
      const open = card.classList.toggle("is-open");
      card.setAttribute("aria-expanded", String(open));
    });
  }

  /* ================= Copy to clipboard + toast ================= */
  const toast = document.getElementById("toast");
  let toastTimer = 0;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  }
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(btn.dataset.copy)
        .then(() => showToast((window.ptsT || ((k) => k))("toast.copied")))
        .catch(() => showToast(btn.dataset.copy));
    });
  });

  /* ================= Hidden owner entrance =================
     5 quick taps on the footer logo open the owner gate.
     Security lives server-side (password + signed session) —
     this is only a discreet doorway. */
  const footerLogo = document.getElementById("footerLogo");
  const ownerGate = document.getElementById("ownerGate");
  if (footerLogo && ownerGate) {
    let taps = 0, tapTimer = 0;
    footerLogo.addEventListener("click", (e) => {
      e.preventDefault(); // guard against any stray double-tap-zoom side effects
      taps++;
      clearTimeout(tapTimer);
      tapTimer = setTimeout(() => { taps = 0; }, 1500);
      if (taps >= 5) {
        taps = 0;
        openGate();
      }
    });

    function openGate() {
      ownerGate.hidden = false;
      // setTimeout (not rAF) so the fade-in reliably fires even when the
      // page isn't actively painting (e.g. tab was just switched to).
      setTimeout(() => {
        ownerGate.classList.add("is-open");
        ownerGate.querySelector("input").focus();
      }, 20);
    }

    const closeGate = () => {
      ownerGate.classList.remove("is-open");
      setTimeout(() => { ownerGate.hidden = true; }, 350);
    };
    ownerGate.addEventListener("click", (e) => { if (e.target === ownerGate) closeGate(); });
    ownerGate.querySelector(".ownergate__close").addEventListener("click", closeGate);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !ownerGate.hidden) closeGate();
    });

    // Show/hide password toggle — avoids silent typos on mobile keyboards.
    const pwInput = ownerGate.querySelector("input");
    const eyeBtn = ownerGate.querySelector(".ownergate__eye");
    eyeBtn.addEventListener("click", () => {
      const showing = pwInput.type === "text";
      pwInput.type = showing ? "password" : "text";
      eyeBtn.textContent = showing ? "👁" : "🙈";
      eyeBtn.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    });

    ownerGate.querySelector("form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const errEl = ownerGate.querySelector(".ownergate__error");
      const btn = ownerGate.querySelector("button[type=submit]");
      const label = btn.querySelector(".ownergate__btn-label");
      const t = window.ptsT || ((k) => k);
      errEl.hidden = true;
      btn.disabled = true;
      label.textContent = t("gate.checking");
      let failMsg = "";
      try {
        const res = await fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "same-origin",
          body: JSON.stringify({ password: pwInput.value }),
        });
        if (res.status === 401) failMsg = t("gate.wrong");
        else if (!res.ok) failMsg = t("gate.server");
      } catch {
        failMsg = t("gate.conn");
      }
      if (failMsg) {
        errEl.textContent = failMsg;
        errEl.hidden = false;
        btn.disabled = false;
        label.textContent = t("gate.btn");
        return;
      }
      label.textContent = t("gate.welcome");
      location.href = "/admin";
    });
  }

  /* ================= Back to top ================= */
  const toTop = document.getElementById("toTop");
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("is-visible", window.scrollY > 700);
  }, { passive: true });
  toTop.addEventListener("click", () => animateScrollTo(0));

  /* ================= Footer year ================= */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
