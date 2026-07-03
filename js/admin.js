/* ============================================================
   PTS Control Room — admin logic
   Session-gated CRUD over /api/projects + media upload.
   Trilingual UI (AR default / EN / FR) with live switching.
   ============================================================ */
(() => {
  "use strict";

  /* ---------------- i18n ---------------- */
  const DICT = {
    ar: {
      "doc.title": "PTS — غرفة التحكم",
      "gate.h1": "غرفة التحكم",
      "gate.p": "هذه المنطقة مخصصة لمالك PT Soft فقط.",
      "gate.pw": "كلمة المرور",
      "gate.enter": "دخول",
      "gate.err": "كلمة المرور غير صحيحة",
      "bar.title": "غرفة التحكم",
      "bar.sub": "إدارة مشاريع PT Soft",
      "bar.view": "عرض الموقع ↗",
      "bar.logout": "خروج",
      "panel.h2": "المشاريع المعروضة",
      "panel.add": "+ مشروع جديد",
      "panel.hint": "التغييرات تظهر للزوار فور الضغط على «نشر التغييرات». الوسائط المفضلة: فيديو MP4 أفقي 16:9 أقل من 4MB (أخف وأنقى من GIF).",
      "list.empty": "لا توجد مشاريع بعد — أضف أول مشروع من زر «+ مشروع جديد»",
      "list.retry": "إعادة المحاولة",
      "save.msg": "لديك تغييرات غير منشورة",
      "save.discard": "تراجع",
      "save.publish": "نشر التغييرات",
      "save.publishing": "جارٍ النشر…",
      "item.untitled": "مشروع بدون اسم",
      "item.edit": "تحرير",
      "item.delete": "حذف",
      "item.up": "تحريك لأعلى",
      "item.down": "تحريك لأسفل",
      "f.name": "اسم المشروع",
      "f.desc": "الوصف (يظهر على البطاقة)",
      "f.tech": "نوع المشروع / التقنيات (حتى 4)",
      "f.techCustom": "+ نوع مخصص ثم Enter",
      "f.status": "حالة المشروع",
      "f.link": "رابط خارجي (اختياري)",
      "st.planned": "قيد التخطيط",
      "st.development": "قيد التطوير",
      "st.live": "مباشر",
      "media.label": "وسائط البطاقة",
      "media.empty": "بدون وسائط — سيُولَّد غلاف فني تلقائياً",
      "media.upload": "رفع فيديو / صورة",
      "media.clear": "إزالة الوسائط",
      "msg.loadFail": "تعذر تحميل المشاريع",
      "msg.published": "تم النشر — التغييرات مباشرة الآن ✓",
      "msg.publishFail": "فشل النشر",
      "msg.needName": "كل مشروع يحتاج اسماً قبل النشر",
      "msg.max4": "أقصى عدد 4 أنواع لكل مشروع",
      "msg.uploaded": "تم رفع الوسائط ✓",
      "msg.tooBig": "الملف أكبر من 4MB — اضغطه أولاً",
      "msg.uploadFail": "فشل الرفع",
      "msg.confirmDelete": "حذف «{name}»؟",
      "msg.confirmDiscard": "تجاهل كل التغييرات غير المنشورة؟",
    },
    en: {
      "doc.title": "PTS — Control Room",
      "gate.h1": "Control Room",
      "gate.p": "This area is for the PT Soft owner only.",
      "gate.pw": "Password",
      "gate.enter": "Enter",
      "gate.err": "Wrong password",
      "bar.title": "Control Room",
      "bar.sub": "PT Soft project management",
      "bar.view": "View site ↗",
      "bar.logout": "Log out",
      "panel.h2": "Published projects",
      "panel.add": "+ New project",
      "panel.hint": "Changes go live for visitors the moment you press “Publish changes”. Preferred media: landscape 16:9 MP4 video under 4MB (lighter and cleaner than GIF).",
      "list.empty": "No projects yet — add your first one with the “+ New project” button",
      "list.retry": "Retry",
      "save.msg": "You have unpublished changes",
      "save.discard": "Discard",
      "save.publish": "Publish changes",
      "save.publishing": "Publishing…",
      "item.untitled": "Untitled project",
      "item.edit": "Edit",
      "item.delete": "Delete",
      "item.up": "Move up",
      "item.down": "Move down",
      "f.name": "Project name",
      "f.desc": "Description (shown on the card)",
      "f.tech": "Project type / technologies (up to 4)",
      "f.techCustom": "+ custom type, then Enter",
      "f.status": "Project status",
      "f.link": "External link (optional)",
      "st.planned": "Planned",
      "st.development": "In development",
      "st.live": "Live",
      "media.label": "Card media",
      "media.empty": "No media — an abstract brand cover will be generated",
      "media.upload": "Upload video / image",
      "media.clear": "Remove media",
      "msg.loadFail": "Couldn't load projects",
      "msg.published": "Published — changes are live now ✓",
      "msg.publishFail": "Publish failed",
      "msg.needName": "Every project needs a name before publishing",
      "msg.max4": "Maximum of 4 types per project",
      "msg.uploaded": "Media uploaded ✓",
      "msg.tooBig": "File is over 4MB — compress it first",
      "msg.uploadFail": "Upload failed",
      "msg.confirmDelete": "Delete “{name}”?",
      "msg.confirmDiscard": "Discard all unpublished changes?",
    },
    fr: {
      "doc.title": "PTS — Salle de contrôle",
      "gate.h1": "Salle de contrôle",
      "gate.p": "Cette zone est réservée au propriétaire de PT Soft.",
      "gate.pw": "Mot de passe",
      "gate.enter": "Entrer",
      "gate.err": "Mot de passe incorrect",
      "bar.title": "Salle de contrôle",
      "bar.sub": "Gestion des projets PT Soft",
      "bar.view": "Voir le site ↗",
      "bar.logout": "Déconnexion",
      "panel.h2": "Projets publiés",
      "panel.add": "+ Nouveau projet",
      "panel.hint": "Les changements sont visibles dès que vous appuyez sur « Publier les changements ». Média conseillé : vidéo MP4 paysage 16:9 de moins de 4 Mo (plus légère et plus nette qu'un GIF).",
      "list.empty": "Aucun projet pour l'instant — ajoutez le premier avec « + Nouveau projet »",
      "list.retry": "Réessayer",
      "save.msg": "Vous avez des changements non publiés",
      "save.discard": "Annuler",
      "save.publish": "Publier les changements",
      "save.publishing": "Publication…",
      "item.untitled": "Projet sans nom",
      "item.edit": "Modifier",
      "item.delete": "Supprimer",
      "item.up": "Monter",
      "item.down": "Descendre",
      "f.name": "Nom du projet",
      "f.desc": "Description (affichée sur la carte)",
      "f.tech": "Type de projet / technologies (jusqu'à 4)",
      "f.techCustom": "+ type personnalisé, puis Entrée",
      "f.status": "Statut du projet",
      "f.link": "Lien externe (optionnel)",
      "st.planned": "Planifié",
      "st.development": "En développement",
      "st.live": "En ligne",
      "media.label": "Média de la carte",
      "media.empty": "Sans média — une couverture artistique sera générée",
      "media.upload": "Téléverser vidéo / image",
      "media.clear": "Retirer le média",
      "msg.loadFail": "Impossible de charger les projets",
      "msg.published": "Publié — les changements sont en ligne ✓",
      "msg.publishFail": "Échec de la publication",
      "msg.needName": "Chaque projet doit avoir un nom avant publication",
      "msg.max4": "Maximum de 4 types par projet",
      "msg.uploaded": "Média téléversé ✓",
      "msg.tooBig": "Fichier de plus de 4 Mo — compressez-le d'abord",
      "msg.uploadFail": "Échec du téléversement",
      "msg.confirmDelete": "Supprimer « {name} » ?",
      "msg.confirmDiscard": "Abandonner tous les changements non publiés ?",
    },
  };

  const LANGS = ["ar", "en", "fr"];
  let LANG = localStorage.getItem("pts_admin_lang") || localStorage.getItem("pts_lang") || "ar";
  if (!LANGS.includes(LANG)) LANG = "ar";

  const t = (key) => DICT[LANG][key] ?? DICT.ar[key] ?? key;

  function applyLang() {
    document.documentElement.lang = LANG;
    document.documentElement.dir = LANG === "ar" ? "rtl" : "ltr";
    document.title = t("doc.title");
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    document.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = t(el.dataset.i18nTitle); });
    document.querySelectorAll("[data-lang-switch]").forEach((sw) => {
      const cur = sw.querySelector(".lang__cur");
      cur.textContent = LANG === "ar" ? "ع" : LANG.toUpperCase();
      cur.classList.toggle("lang__cur--ar", LANG === "ar");
      sw.querySelectorAll("[data-lang-opt]").forEach((opt) => {
        opt.classList.toggle("is-current", opt.dataset.langOpt === LANG);
      });
    });
  }

  function wireLangSwitchers() {
    document.querySelectorAll("[data-lang-switch]").forEach((sw) => {
      const btn = sw.querySelector(".lang__btn");
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const open = sw.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(open));
      });
      sw.querySelectorAll("[data-lang-opt]").forEach((opt) => {
        opt.addEventListener("click", () => {
          if (opt.dataset.langOpt === LANG) return;
          LANG = opt.dataset.langOpt;
          localStorage.setItem("pts_admin_lang", LANG);
          applyLang();
          renderList(); // re-render dynamic strings (statuses, headers, confirm labels)
        });
      });
    });
    document.addEventListener("click", () => {
      document.querySelectorAll("[data-lang-switch].is-open").forEach((sw) => {
        sw.classList.remove("is-open");
        sw.querySelector(".lang__btn").setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------------- elements ---------------- */
  const gate = document.getElementById("gate");
  const room = document.getElementById("room");
  const plist = document.getElementById("plist");
  const savebar = document.getElementById("savebar");
  const toast = document.getElementById("toast");
  const tpl = document.getElementById("itemTpl");

  const TECH_PRESETS = ["AI", "Web App", "Desktop", "Android", "Automation", "Enterprise", "Integration", "API"];

  /** @type {Array<object>} working copy */
  let projects = [];
  /** last published snapshot (for dirty check / discard) */
  let published = [];
  let radioSeq = 0;
  let loadFailed = false;

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
    applyLang();
    wireLangSwitchers();
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
      loadFailed = false;
    } catch (e) {
      // Never leave the room dead: render an empty (but fully interactive)
      // list with a retry action, so adding/editing still works.
      loadFailed = true;
      say(`${t("msg.loadFail")}: ${e.message}`, true);
    }
    renderList();
  }

  /* ---------------- rendering ---------------- */
  function renderList() {
    plist.innerHTML = "";
    if (!projects.length) {
      const empty = document.createElement("div");
      empty.className = "plist__empty";
      empty.textContent = t("list.empty");
      if (loadFailed) {
        const retry = document.createElement("button");
        retry.className = "btn-ghost plist__retry";
        retry.textContent = t("list.retry");
        retry.addEventListener("click", () => enterRoom());
        empty.appendChild(document.createElement("br"));
        empty.appendChild(retry);
      }
      plist.appendChild(empty);
    } else {
      projects.forEach((p, i) => plist.appendChild(renderItem(p, i)));
    }
    refreshDirty();
  }

  function renderItem(p, index) {
    const node = tpl.content.firstElementChild.cloneNode(true);
    const $ = (sel) => node.querySelector(sel);

    /* template ships with data-i18n defaults in Arabic — localize the clone */
    node.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.dataset.i18n); });
    node.querySelectorAll("[data-i18n-ph]").forEach((el) => { el.placeholder = t(el.dataset.i18nPh); });
    node.querySelectorAll("[data-i18n-title]").forEach((el) => { el.title = t(el.dataset.i18nTitle); });

    /* header bindings */
    const syncHeader = () => {
      $('[data-bind="name"]').textContent = p.name || t("item.untitled");
      const st = $('[data-bind="statusLabel"]');
      st.textContent = t(`st.${p.status || "planned"}`);
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
      if (!confirm(t("msg.confirmDelete").replace("{name}", p.name || t("item.untitled")))) return;
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
      for (const tc of all) {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip-opt" + (p.tech.includes(tc) ? " is-on" : "");
        b.textContent = tc;
        b.addEventListener("click", () => {
          if (p.tech.includes(tc)) p.tech = p.tech.filter((x) => x !== tc);
          else if (p.tech.length < 4) p.tech = [...p.tech, tc];
          else return say(t("msg.max4"), true);
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
      if (p.tech.length >= 4) return say(t("msg.max4"), true);
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
        mediaBox.innerHTML = "";
        const span = document.createElement("span");
        span.className = "mediabox__empty";
        span.textContent = t("media.empty");
        mediaBox.appendChild(span);
        clearBtn.hidden = true;
      }
    };
    drawMedia();

    clearBtn.addEventListener("click", () => { delete p.media; drawMedia(); refreshDirty(); });

    fileInput.addEventListener("change", async () => {
      const file = fileInput.files[0];
      if (!file) return;
      if (file.size > 4 * 1024 * 1024) return say(t("msg.tooBig"), true);
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
        if (!res.ok) throw new Error(data.error || t("msg.uploadFail"));
        p.media = { type: data.type, src: data.url };
        drawMedia();
        refreshDirty();
        say(t("msg.uploaded"));
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
    if (!confirm(t("msg.confirmDiscard"))) return;
    projects = clone(published);
    renderList();
  });

  document.getElementById("saveBtn").addEventListener("click", async () => {
    const btn = document.getElementById("saveBtn");
    const invalid = projects.find((p) => !p.name || !p.name.trim());
    if (invalid) return say(t("msg.needName"), true);
    btn.disabled = true;
    btn.textContent = t("save.publishing");
    try {
      const saved = await api("/api/projects", { method: "PUT", body: JSON.stringify({ projects }) });
      published = clone(saved.projects);
      projects = clone(published);
      renderList();
      say(t("msg.published"));
    } catch (e) {
      say(`${t("msg.publishFail")}: ${e.message}`, true);
    } finally {
      btn.disabled = false;
      btn.textContent = t("save.publish");
    }
  });

  window.addEventListener("beforeunload", (e) => {
    if (isDirty()) { e.preventDefault(); e.returnValue = ""; }
  });

  boot();
})();
