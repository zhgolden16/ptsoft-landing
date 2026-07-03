/* ============================================================
   PTS Control Room — admin logic
   Session-gated CRUD over /api/projects + media upload.
   ============================================================ */
(() => {
  "use strict";

  const gate = document.getElementById("gate");
  const room = document.getElementById("room");
  const plist = document.getElementById("plist");
  const savebar = document.getElementById("savebar");
  const toast = document.getElementById("toast");
  const tpl = document.getElementById("itemTpl");

  const STATUS_LABELS = { planned: "قيد التخطيط", development: "قيد التطوير", live: "تم التطوير" };
  const TECH_PRESETS = ["AI", "Web App", "Desktop", "Android", "Automation", "Enterprise", "Integration", "API"];

  /** @type {Array<object>} working copy */
  let projects = [];
  /** last published snapshot (for dirty check / discard) */
  let published = [];
  let radioSeq = 0;

  /* ---------------- helpers ---------------- */
  let toastTimer = 0;
  function say(msg, isError = false) {
    toast.textContent = msg;
    toast.classList.toggle("is-error", isError);
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  const clone = (o) => JSON.parse(JSON.stringify(o));
  const isDirty = () => JSON.stringify(projects) !== JSON.stringify(published);

  function refreshDirty() {
    savebar.hidden = !isDirty();
    document.getElementById("projectCount").textContent = projects.length ? `${projects.length}` : "";
  }

  async function api(path, opts = {}) {
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
      credentials: "same-origin",
      ...opts,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
    return data;
  }

  /* ---------------- auth flow ---------------- */
  async function boot() {
    try {
      const { ok } = await api("/api/session");
      if (ok) return enterRoom();
    } catch { /* fall through to gate */ }
    gate.hidden = false;
    document.getElementById("gatePassword").focus();
  }

  document.getElementById("gateForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("gateBtn");
    const err = document.getElementById("gateError");
    btn.disabled = true;
    err.hidden = true;
    try {
      await api("/api/login", {
        method: "POST",
        body: JSON.stringify({ password: document.getElementById("gatePassword").value }),
      });
      gate.hidden = true;
      enterRoom();
    } catch {
      err.hidden = false;
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById("logoutBtn").addEventListener("click", async () => {
    await api("/api/logout", { method: "POST" }).catch(() => {});
    location.reload();
  });

  async function enterRoom() {
    room.hidden = false;
    try {
      const data = await api("/api/projects");
      published = clone(data.projects || []);
      projects = clone(published);
      renderList();
    } catch (e) {
      say(`تعذر تحميل المشاريع: ${e.message}`, true);
    }
  }

  /* ---------------- rendering ---------------- */
  function renderList() {
    plist.innerHTML = "";
    if (!projects.length) {
      plist.innerHTML = `<div class="plist__empty">لا توجد مشاريع بعد — أضف أول مشروع من زر «+ مشروع جديد»</div>`;
    } else {
      projects.forEach((p, i) => plist.appendChild(renderItem(p, i)));
    }
    refreshDirty();
  }

  function renderItem(p, index) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const $ = (sel) => node.querySelector(sel);

    /* header bindings */
    const syncHeader = () => {
      $('[data-bind="name"]').textContent = p.name || "مشروع بدون اسم";
      const st = $('[data-bind="statusLabel"]');
      st.textContent = STATUS_LABELS[p.status] || STATUS_LABELS.planned;
      st.dataset.status = p.status || "planned";
    };
    syncHeader();

    /* open/close */
    const body = $(".pitem__body");
    $('[data-act="toggle"]').addEventListener("click", () => {
      const open = body.hidden;
      body.hidden = !open;
      node.classList.toggle("is-open", open);
    });

    /* order + delete */
    $('[data-act="up"]').addEventListener("click", () => move(index, -1));
    $('[data-act="down"]').addEventListener("click", () => move(index, 1));
    $('[data-act="delete"]').addEventListener("click", () => {
      if (!confirm(`حذف «${p.name || "المشروع"}»؟`)) return;
      projects.splice(index, 1);
      renderList();
    });

    /* text fields */
    const nameInput = $('[data-field="name"]');
    nameInput.value = p.name || "";
    nameInput.addEventListener("input", () => { p.name = nameInput.value; syncHeader(); refreshDirty(); });

    const descInput = $('[data-field="description"]');
    descInput.value = p.description || "";
    descInput.addEventListener("input", () => { p.description = descInput.value; refreshDirty(); });

    const linkInput = $('[data-field="link"]');
    linkInput.value = p.link || "";
    linkInput.addEventListener("input", () => {
      if (linkInput.value.trim()) p.link = linkInput.value.trim(); else delete p.link;
      refreshDirty();
    });

    /* tech chips */
    const chipsWrap = $('[data-field="tech"]');
    const customInput = chipsWrap.querySelector(".chips__custom");
    const row = document.createElement("div");
    row.className = "chips__row";
    chipsWrap.insertBefore(row, customInput);
    p.tech = Array.isArray(p.tech) ? p.tech : [];

    const drawChips = () => {
      row.innerHTML = "";
      const all = [...new Set([...TECH_PRESETS, ...p.tech])];
      for (const t of all) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip-opt" + (p.tech.includes(t) ? " is-on" : "");
        b.textContent = t;
        b.addEventListener("click", () => {
          if (p.tech.includes(t)) p.tech = p.tech.filter((x) => x !== t);
          else if (p.tech.length < 4) p.tech = [...p.tech, t];
          else return say("أقصى عدد 4 أنواع لكل مشروع", true);
          drawChips();
          refreshDirty();
        });
        row.appendChild(b);
      }
    };
    drawChips();
    customInput.addEventListener("keydown", (e) => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      const v = customInput.value.trim();
      if (!v) return;
      if (p.tech.length >= 4) return say("أقصى عدد 4 أنواع لكل مشروع", true);
      if (!p.tech.includes(v)) p.tech = [...p.tech, v];
      customInput.value = "";
      drawChips();
      refreshDirty();
    });

    /* status radios (unique name per item) */
    const group = `st-${radioSeq++}`;
    $('[data-field="status"]').querySelectorAll("input[type=radio]").forEach((r) => {
      r.name = group;
      r.checked = (p.status || "planned") === r.value;
      r.addEventListener("change", () => {
        if (r.checked) { p.status = r.value; syncHeader(); refreshDirty(); }
      });
    });

    /* media */
    const mediaBox = $('[data-bind="media"]');
    const clearBtn = $('[data-act="clearMedia"]');
    const fileInput = $('[data-act="upload"]');
    const prog = $(".upprog");

    const drawMedia = () => {
      if (p.media && p.media.src) {
        mediaBox.innerHTML = p.media.type === "video"
          ? `<video src="${p.media.src}" muted loop autoplay playsinline></video>`
          : `<img src="${p.media.src}" alt="" />`;
        clearBtn.hidden = false;
      } else {
        mediaBox.innerHTML = `<span class="mediabox__empty">بدون وسائط — سيُولَّد غلاف فني تلقائياً</span>`;
        clearBtn.hidden = true;
      }
    };
    drawMedia();

    clearBtn.addEventListener("click", () => { delete p.media; drawMedia(); refreshDirty(); });

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files[0];
      if (!file) return;
      if (file.size > 4 * 1024 * 1024) return say("الملف أكبر من 4MB — اضغطه أولاً", true);
      prog.hidden = false;
      prog.removeAttribute("value"); // indeterminate
      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": file.type },
          credentials: "same-origin",
          body: file,
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "فشل الرفع");
        p.media = { type: data.type, src: data.url };
        drawMedia();
        refreshDirty();
        say("تم رفع الوسائط ✓");
      } catch (e) {
        say(e.message, true);
      } finally {
        prog.hidden = true;
        fileInput.value = "";
      }
    });

    return node;
  }

  function move(index, dir) {
    const j = index + dir;
    if (j < 0 || j >= projects.length) return;
    [projects[index], projects[j]] = [projects[j], projects[index]];
    renderList();
  }

  /* ---------------- top actions ---------------- */
  document.getElementById("addBtn").addEventListener("click", () => {
    projects.unshift({ name: "", description: "", tech: [], status: "planned" });
    renderList();
    // open the new item's editor immediately
    const first = plist.querySelector(".pitem");
    if (first) first.querySelector('[data-act="toggle"]').click();
  });

  document.getElementById("discardBtn").addEventListener("click", () => {
    if (!confirm("تجاهل كل التغييرات غير المنشورة؟")) return;
    projects = clone(published);
    renderList();
  });

  document.getElementById("saveBtn").addEventListener("click", async () => {
    const btn = document.getElementById("saveBtn");
    const invalid = projects.find((p) => !p.name || !p.name.trim());
    if (invalid) return say("كل مشروع يحتاج اسماً قبل النشر", true);
    btn.disabled = true;
    btn.textContent = "جارٍ النشر…";
    try {
      const saved = await api("/api/projects", { method: "PUT", body: JSON.stringify({ projects }) });
      published = clone(saved.projects);
      projects = clone(published);
      renderList();
      say("تم النشر — التغييرات مباشرة الآن ✓");
    } catch (e) {
      say(`فشل النشر: ${e.message}`, true);
    } finally {
      btn.disabled = false;
      btn.textContent = "نشر التغييرات";
    }
  });

  window.addEventListener("beforeunload", (e) => {
    if (isDirty()) { e.preventDefault(); e.returnValue = ""; }
  });

  boot();
})();
