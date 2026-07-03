/* ============================================================
   PT Soft — Landing page behavior  v2
   Vanilla JS: brand splash, neural canvas, scroll-linked 3D
   engine, carousels, tilt, interactive process, portfolio.
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

  /* ================= Neural network canvas ================= */
  const canvas = document.getElementById("neuralCanvas");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    let W = 0, H = 0, nodes = [], running = true;
    const pointer = { x: -9999, y: -9999 };
    const COUNT = () => (mobileQuery.matches ? 26 : 60);
    const LINK = 130;

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

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of nodes) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        // gentle pull toward pointer
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

    // Pause when hero is off-screen or tab hidden
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

  /* ================= Scroll engine (single rAF) =================
     Drives: progress bar, hero parallax, floating elements,
     ECG dividers, process line. Transform/opacity only. */
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

    // progress bar
    scrollPulse.style.transform = `scaleX(${docH > 0 ? y / docH : 0})`;

    // hero parallax: video drifts slower + slight zoom
    if (y < vh * 1.2) {
      heroVideo.style.transform = `translateY(${y * 0.3}px) scale(${1 + y / vh * 0.08})`;
    }

    // floating layers
    if (!reduced) {
      for (const el of floats) {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-center * parseFloat(el.dataset.float) * 0.2).toFixed(1)}px, 0)`;
      }
    }

    // ECG dividers draw with scroll
    for (const p of dividers) {
      const r = p.closest(".ecg-divider").getBoundingClientRect();
      const prog = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.9)));
      const len = parseFloat(p.style.getPropertyValue("--ecg-len"));
      p.style.strokeDashoffset = len * (1 - prog);
    }

    // process line fill
    if (track) {
      const r = track.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (vh * 0.72 - r.top) / r.height));
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

  // Active section highlighting
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

  /* ================= Portfolio rendering ================= */
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

  function projectMedia(p, i) {
    // media: { type: "gif" | "image" | "video", src } — falls back to
    // legacy `cover` (image), then to a generated abstract illustration.
    const m = p.media || (p.cover ? { type: "image", src: p.cover } : null);
    if (!m) return abstractCover(i);
    if (m.type === "video") {
      return `<video src="${m.src}" muted loop autoplay playsinline preload="metadata" aria-label="${p.name} — preview"></video>`;
    }
    return `<img src="${m.src}" alt="${p.name} — preview" loading="lazy" decoding="async" />`;
  }

  function renderPortfolio() {
    const grid = document.getElementById("portfolioGrid");
    if (!grid || typeof PTS_PROJECTS === "undefined") return;
    grid.innerHTML = PTS_PROJECTS.map((p, i) => {
      const status = PTS_PROJECT_STATUS[p.status] || PTS_PROJECT_STATUS.planned;
      const tech = p.tech.map((t) => `<span>${t}</span>`).join("");
      const link = p.link
        ? `<a class="project__link" href="${p.link}"${p.link.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>
             View project
             <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true"><path d="M7 17 17 7m0 0H9m8 0v8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
           </a>`
        : "";
      return `
        <article class="card project tilt reveal glow-track" style="--reveal-delay:${(i % 3) * 0.12}s">
          <div class="project__cover">
            ${projectMedia(p, i)}
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

  /* ================= Scroll reveal (3D) ================= */
  const revealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

  document.querySelectorAll(".reveal").forEach((el, i) => {
    if (!el.style.getPropertyValue("--reveal-delay")) {
      el.style.setProperty("--reveal-delay", `${(i % 4) * 0.08}s`);
    }
    revealObserver.observe(el);
  });

  /* ================= 3D tilt + cursor glow ================= */
  document.querySelectorAll(".glow-track").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });
  });

  if (!isTouch && !reduced) {
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

    // Magnetic buttons
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
    // Open the first step by default so the pattern is discoverable
    steps[0].classList.add("is-open");
    steps[0].querySelector(".process__head").setAttribute("aria-expanded", "true");
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
        .then(() => showToast("Copied ✓"))
        .catch(() => showToast(btn.dataset.copy));
    });
  });

  /* ================= Back to top ================= */
  const toTop = document.getElementById("toTop");
  window.addEventListener("scroll", () => {
    toTop.classList.toggle("is-visible", window.scrollY > 700);
  }, { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

  /* ================= Footer year ================= */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
