/* ============================================================
   PT Soft — Landing page i18n (EN / FR / AR)
   Applies translations to [data-i18n] nodes before main.js runs
   (both scripts are deferred, so order in the HTML matters).
   Language choice persists in localStorage("pts_lang").
   ============================================================ */
const PTS_I18N = {
  en: {
    "meta.title": "PT Soft — AI-First Software Engineering",
    "meta.desc": "PT Soft (PTS) is an AI-first software company building intelligent web, desktop, and Android applications, business automation, and enterprise systems. Built around your work.",

    "nav.about": "About",
    "nav.services": "Services",
    "nav.portfolio": "Portfolio",
    "nav.why": "Why PTS",
    "nav.process": "Process",
    "nav.cta": "Start a project",

    "hero.eyebrow": "AI-first software engineering",
    "hero.t1": "Intelligent systems,",
    "hero.t2": "built around your work.",
    "hero.sub": "PT Soft designs and engineers software that transforms traditional businesses into organized, automated, data-driven organizations — from AI solutions to enterprise platforms.",
    "hero.start": "Start a project",
    "hero.explore": "Explore our work",

    "about.eyebrow": "About PT Soft",
    "about.t1": "We don't just write code.",
    "about.t2": "We engineer intelligence.",
    "about.lead": "PT Soft — Pulse Tailor Soft — is an AI-first software engineering company. We design and develop scalable digital solutions that turn manual, fragmented operations into precise, automated, measurable systems.",
    "about.p2": "Every product we ship is tailored to how a business actually works: clean architecture underneath, modern experience on top, and intelligence woven through the entire workflow — not bolted on as an afterthought.",
    "about.f1t": "AI-first",
    "about.f1d": "by design, not by add-on",
    "about.f2t": "Full-stack",
    "about.f2d": "web · desktop · Android",
    "about.f3t": "Enterprise",
    "about.f3d": "secure & scalable",

    "sv.eyebrow": "What we build",
    "sv.t1": "Services engineered for",
    "sv.t2": "serious businesses.",
    "sv.hint": "swipe →",
    "sv.s1t": "AI Solutions",
    "sv.s1d": "Machine intelligence applied to real operations: prediction, document understanding, decision support, and AI assistants embedded in your workflow.",
    "sv.s2t": "Web Applications",
    "sv.s2d": "Fast, secure, scalable web platforms — from client portals to full SaaS products — with clean architecture and modern UX.",
    "sv.s3t": "Desktop Applications",
    "sv.s3d": "Powerful native desktop tools for production floors, back offices, and points of sale — built for speed and offline reliability.",
    "sv.s4t": "Android Applications",
    "sv.s4d": "Mobile apps that put your business in your team's pocket — field operations, sales, and management from anywhere.",
    "sv.s5t": "Business Automation",
    "sv.s5d": "We remove repetitive manual work: automated documents, notifications, stock, billing, and reporting that run themselves.",
    "sv.s6t": "Enterprise Software",
    "sv.s6d": "Custom ERP-class systems shaped around your exact processes — inventory, production, HR, finance — under one roof.",
    "sv.s7t": "System Integration",
    "sv.s7d": "We connect what you already use — payments, hardware, legacy databases, third-party APIs — into one coherent ecosystem.",

    "pf.eyebrow": "Portfolio",
    "pf.t1": "Products with a",
    "pf.t2": "pulse.",
    "pf.lead": "A growing catalogue of systems we design, build, and operate.",
    "pf.hint": "swipe →",
    "pf.view": "View project",
    "lb.open": "View gallery",
    "lb.close": "Close gallery",
    "st.live": "Live",
    "st.development": "In development",
    "st.planned": "Planned",

    "why.eyebrow": "Why choose PT Soft",
    "why.t1": "Engineering standards,",
    "why.t2": "not shortcuts.",
    "why.i1t": "AI-first development",
    "why.i1d": "Intelligence is part of the architecture from day one — not a plugin added later.",
    "why.i2t": "Modern architecture",
    "why.i2d": "Modular, documented, testable systems that welcome change instead of resisting it.",
    "why.i3t": "High performance",
    "why.i3d": "Every screen, query, and workflow is engineered to feel instant — even under load.",
    "why.i4t": "Secure systems",
    "why.i4d": "Access control, encryption, and auditability treated as core features, not options.",
    "why.i5t": "Clean code",
    "why.i5d": "Readable, consistent, reviewed code — the foundation of software that lasts.",
    "why.i6t": "Maintainability",
    "why.i6d": "We build products you can still evolve confidently five years from now.",
    "why.i7t": "Professional management",
    "why.i7d": "Clear milestones, honest timelines, and transparent communication from kickoff to support.",

    "pr.eyebrow": "How we work",
    "pr.t1": "A workflow with a",
    "pr.t2": "heartbeat.",
    "pr.hint": "Tap any step to expand it.",
    "pr.s1t": "Discovery",
    "pr.s1d": "We study your business, workflows, and pain points before writing a single line of code.",
    "pr.s2t": "Planning",
    "pr.s2d": "Scope, milestones, and priorities are defined together — no surprises later.",
    "pr.s3t": "Architecture",
    "pr.s3d": "We design the data model, integrations, and system structure for scale and security.",
    "pr.s4t": "Development",
    "pr.s4d": "Iterative builds with regular demos, so you see real progress — not promises.",
    "pr.s5t": "Testing",
    "pr.s5d": "Functional, performance, and security testing on real scenarios from your operation.",
    "pr.s6t": "Deployment",
    "pr.s6d": "Smooth rollout, data migration, and hands-on training for your team.",
    "pr.s7t": "Support",
    "pr.s7d": "Monitoring, updates, and continuous improvement long after launch day.",

    "ct.eyebrow": "Contact",
    "ct.t1": "Let's build something",
    "ct.t2": "intelligent together.",
    "ct.lead": "Tell us about your project — we answer fast.",
    "ct.wa": "WhatsApp",
    "ct.waHint": "Chat with us directly →",
    "ct.copy": "copy",
    "ct.fb": "Facebook",
    "ct.fbVal": "Pulse Tailor",
    "ct.fbHint": "Follow our page →",
    "ct.mail": "Email",
    "ct.mailHint": "Send us a brief →",

    "ft.rights": "All rights reserved.",
    "ft.privacy": "Privacy Policy",
    "legal.title": "PT Soft — Privacy Policy",
    "legal.back": "← Back to site",

    "gate.title": "Owner access",
    "gate.desc": "This door is for PT Soft only.",
    "gate.btn": "Enter control room",
    "gate.checking": "Checking…",
    "gate.welcome": "Welcome ✓",
    "gate.wrong": "Wrong password — try again.",
    "gate.server": "Server error — try again in a moment.",
    "gate.conn": "Connection failed — check your internet and try again.",
    "toast.copied": "Copied ✓",
  },

  fr: {
    "meta.title": "PT Soft — Ingénierie logicielle IA-first",
    "meta.desc": "PT Soft (PTS) est une société logicielle IA-first qui construit des applications web, desktop et Android intelligentes, de l'automatisation métier et des systèmes d'entreprise. Conçu autour de votre travail.",

    "nav.about": "À propos",
    "nav.services": "Services",
    "nav.portfolio": "Réalisations",
    "nav.why": "Pourquoi PTS",
    "nav.process": "Méthode",
    "nav.cta": "Démarrer un projet",

    "hero.eyebrow": "Ingénierie logicielle IA-first",
    "hero.t1": "Des systèmes intelligents,",
    "hero.t2": "conçus autour de votre travail.",
    "hero.sub": "PT Soft conçoit et développe des logiciels qui transforment les entreprises traditionnelles en organisations structurées, automatisées et pilotées par la donnée — des solutions IA aux plateformes d'entreprise.",
    "hero.start": "Démarrer un projet",
    "hero.explore": "Découvrir nos réalisations",

    "about.eyebrow": "À propos de PT Soft",
    "about.t1": "Nous n'écrivons pas seulement du code.",
    "about.t2": "Nous concevons l'intelligence.",
    "about.lead": "PT Soft — Pulse Tailor Soft — est une société d'ingénierie logicielle IA-first. Nous concevons et développons des solutions numériques évolutives qui transforment des opérations manuelles et fragmentées en systèmes précis, automatisés et mesurables.",
    "about.p2": "Chaque produit que nous livrons est taillé sur la façon réelle de travailler de l'entreprise : une architecture propre en profondeur, une expérience moderne en surface, et une intelligence tissée dans tout le flux de travail — jamais ajoutée après coup.",
    "about.f1t": "IA-first",
    "about.f1d": "par conception, pas en option",
    "about.f2t": "Full-stack",
    "about.f2d": "web · desktop · Android",
    "about.f3t": "Entreprise",
    "about.f3d": "sécurisé & évolutif",

    "sv.eyebrow": "Ce que nous construisons",
    "sv.t1": "Des services conçus pour",
    "sv.t2": "les entreprises exigeantes.",
    "sv.hint": "glissez →",
    "sv.s1t": "Solutions IA",
    "sv.s1d": "L'intelligence artificielle appliquée aux opérations réelles : prédiction, compréhension de documents, aide à la décision et assistants IA intégrés à votre flux de travail.",
    "sv.s2t": "Applications web",
    "sv.s2d": "Des plateformes web rapides, sûres et évolutives — du portail client au produit SaaS complet — avec une architecture propre et une UX moderne.",
    "sv.s3t": "Applications desktop",
    "sv.s3d": "Des outils de bureau natifs et puissants pour les ateliers, les back-offices et les points de vente — conçus pour la vitesse et la fiabilité hors ligne.",
    "sv.s4t": "Applications Android",
    "sv.s4d": "Des applications mobiles qui mettent votre entreprise dans la poche de vos équipes — terrain, ventes et gestion, où que vous soyez.",
    "sv.s5t": "Automatisation métier",
    "sv.s5d": "Nous éliminons le travail manuel répétitif : documents automatisés, notifications, stocks, facturation et rapports qui s'exécutent tout seuls.",
    "sv.s6t": "Logiciels d'entreprise",
    "sv.s6d": "Des systèmes sur mesure de classe ERP, façonnés sur vos processus exacts — stocks, production, RH, finance — sous un même toit.",
    "sv.s7t": "Intégration de systèmes",
    "sv.s7d": "Nous connectons ce que vous utilisez déjà — paiements, matériel, bases de données existantes, API tierces — en un écosystème cohérent.",

    "pf.eyebrow": "Réalisations",
    "pf.t1": "Des produits qui ont",
    "pf.t2": "un pouls.",
    "pf.lead": "Un catalogue croissant de systèmes que nous concevons, construisons et exploitons.",
    "pf.hint": "glissez →",
    "pf.view": "Voir le projet",
    "lb.open": "Voir la galerie",
    "lb.close": "Fermer la galerie",
    "st.live": "En ligne",
    "st.development": "En développement",
    "st.planned": "Planifié",

    "why.eyebrow": "Pourquoi choisir PT Soft",
    "why.t1": "Des standards d'ingénierie,",
    "why.t2": "pas de raccourcis.",
    "why.i1t": "Développement IA-first",
    "why.i1d": "L'intelligence fait partie de l'architecture dès le premier jour — pas un plugin ajouté plus tard.",
    "why.i2t": "Architecture moderne",
    "why.i2d": "Des systèmes modulaires, documentés et testables qui accueillent le changement au lieu d'y résister.",
    "why.i3t": "Haute performance",
    "why.i3d": "Chaque écran, requête et flux est conçu pour paraître instantané — même sous charge.",
    "why.i4t": "Systèmes sécurisés",
    "why.i4d": "Contrôle d'accès, chiffrement et auditabilité traités comme des fonctionnalités centrales, pas des options.",
    "why.i5t": "Code propre",
    "why.i5d": "Un code lisible, cohérent et relu — la fondation d'un logiciel qui dure.",
    "why.i6t": "Maintenabilité",
    "why.i6d": "Nous construisons des produits que vous pourrez encore faire évoluer sereinement dans cinq ans.",
    "why.i7t": "Gestion professionnelle",
    "why.i7d": "Des jalons clairs, des délais honnêtes et une communication transparente du lancement au support.",

    "pr.eyebrow": "Notre méthode",
    "pr.t1": "Un flux de travail avec un",
    "pr.t2": "battement de cœur.",
    "pr.hint": "Touchez une étape pour la déplier.",
    "pr.s1t": "Découverte",
    "pr.s1d": "Nous étudions votre entreprise, vos flux et vos points de douleur avant d'écrire la moindre ligne de code.",
    "pr.s2t": "Planification",
    "pr.s2d": "Périmètre, jalons et priorités sont définis ensemble — aucune surprise plus tard.",
    "pr.s3t": "Architecture",
    "pr.s3d": "Nous concevons le modèle de données, les intégrations et la structure du système pour l'échelle et la sécurité.",
    "pr.s4t": "Développement",
    "pr.s4d": "Des itérations avec des démonstrations régulières : vous voyez de vrais progrès, pas des promesses.",
    "pr.s5t": "Tests",
    "pr.s5d": "Tests fonctionnels, de performance et de sécurité sur des scénarios réels de votre activité.",
    "pr.s6t": "Déploiement",
    "pr.s6d": "Mise en production en douceur, migration des données et formation de vos équipes.",
    "pr.s7t": "Support",
    "pr.s7d": "Surveillance, mises à jour et amélioration continue bien après le jour du lancement.",

    "ct.eyebrow": "Contact",
    "ct.t1": "Construisons ensemble",
    "ct.t2": "quelque chose d'intelligent.",
    "ct.lead": "Parlez-nous de votre projet — nous répondons vite.",
    "ct.wa": "WhatsApp",
    "ct.waHint": "Discutez avec nous →",
    "ct.copy": "copier",
    "ct.fb": "Facebook",
    "ct.fbVal": "Pulse Tailor",
    "ct.fbHint": "Suivez notre page →",
    "ct.mail": "E-mail",
    "ct.mailHint": "Envoyez-nous un brief →",

    "ft.rights": "Tous droits réservés.",
    "ft.privacy": "Politique de confidentialité",
    "legal.title": "PT Soft — Politique de confidentialité",
    "legal.back": "← Retour au site",

    "gate.title": "Accès propriétaire",
    "gate.desc": "Cette porte est réservée à PT Soft.",
    "gate.btn": "Entrer dans la salle de contrôle",
    "gate.checking": "Vérification…",
    "gate.welcome": "Bienvenue ✓",
    "gate.wrong": "Mot de passe incorrect — réessayez.",
    "gate.server": "Erreur serveur — réessayez dans un instant.",
    "gate.conn": "Connexion échouée — vérifiez votre internet et réessayez.",
    "toast.copied": "Copié ✓",
  },

  ar: {
    "meta.title": "PT Soft — هندسة برمجيات قائمة على الذكاء الاصطناعي",
    "meta.desc": "PT Soft ‏(PTS) شركة برمجيات قائمة على الذكاء الاصطناعي تبني تطبيقات ويب وسطح مكتب وأندرويد ذكية، وأتمتة أعمال، وأنظمة مؤسسية. مُفصَّلة على مقاس عملك.",

    "nav.about": "من نحن",
    "nav.services": "خدماتنا",
    "nav.portfolio": "أعمالنا",
    "nav.why": "لماذا PTS",
    "nav.process": "منهجيتنا",
    "nav.cta": "ابدأ مشروعك",

    "hero.eyebrow": "هندسة برمجيات قائمة على الذكاء الاصطناعي",
    "hero.t1": "أنظمة ذكية،",
    "hero.t2": "مُفصَّلة على مقاس عملك.",
    "hero.sub": "تصمم PT Soft وتهندس برمجيات تحوّل الأعمال التقليدية إلى مؤسسات منظّمة ومؤتمتة تقودها البيانات — من حلول الذكاء الاصطناعي إلى المنصات المؤسسية.",
    "hero.start": "ابدأ مشروعك",
    "hero.explore": "استكشف أعمالنا",

    "about.eyebrow": "عن PT Soft",
    "about.t1": "نحن لا نكتب الشيفرة فحسب.",
    "about.t2": "نحن نهندس الذكاء.",
    "about.lead": "PT Soft — بولس تايلور سوفت — شركة هندسة برمجيات قائمة على الذكاء الاصطناعي. نصمّم ونطوّر حلولاً رقمية قابلة للتوسّع تحوّل العمليات اليدوية المتفرقة إلى أنظمة دقيقة ومؤتمتة وقابلة للقياس.",
    "about.p2": "كل منتج نسلّمه مفصّل على الطريقة الفعلية لعمل المؤسسة: بنية نظيفة في العمق، وتجربة عصرية في الواجهة، وذكاء منسوج في كامل سير العمل — لا مجرد إضافة لاحقة.",
    "about.f1t": "الذكاء أولاً",
    "about.f1d": "تصميماً أصيلاً، لا إضافةً",
    "about.f2t": "متكاملة",
    "about.f2d": "ويب · سطح مكتب · أندرويد",
    "about.f3t": "مؤسسية",
    "about.f3d": "آمنة وقابلة للتوسّع",

    "sv.eyebrow": "ماذا نبني",
    "sv.t1": "خدمات مهندَسة",
    "sv.t2": "للأعمال الجادة.",
    "sv.hint": "اسحب ←",
    "sv.s1t": "حلول الذكاء الاصطناعي",
    "sv.s1d": "ذكاء آلي مطبَّق على العمليات الحقيقية: تنبؤ، وفهم للمستندات، ودعم للقرار، ومساعدون أذكياء مدمجون في سير عملك.",
    "sv.s2t": "تطبيقات الويب",
    "sv.s2d": "منصات ويب سريعة وآمنة وقابلة للتوسّع — من بوابات العملاء إلى منتجات SaaS كاملة — ببنية نظيفة وتجربة استخدام عصرية.",
    "sv.s3t": "تطبيقات سطح المكتب",
    "sv.s3d": "أدوات مكتبية أصيلة وقوية لأرضيات الإنتاج والمكاتب الخلفية ونقاط البيع — مبنية للسرعة والاعتمادية دون اتصال.",
    "sv.s4t": "تطبيقات أندرويد",
    "sv.s4d": "تطبيقات جوّال تضع عملك في جيب فريقك — عمليات ميدانية ومبيعات وإدارة من أي مكان.",
    "sv.s5t": "أتمتة الأعمال",
    "sv.s5d": "نزيل العمل اليدوي المتكرر: مستندات آلية، وإشعارات، ومخزون، وفوترة، وتقارير تعمل من تلقاء نفسها.",
    "sv.s6t": "البرمجيات المؤسسية",
    "sv.s6d": "أنظمة مخصّصة من طراز ERP مُشكَّلة على عملياتك بالضبط — مخزون وإنتاج وموارد بشرية ومالية — تحت سقف واحد.",
    "sv.s7t": "تكامل الأنظمة",
    "sv.s7d": "نربط ما تستخدمه بالفعل — مدفوعات وأجهزة وقواعد بيانات قديمة وواجهات برمجية خارجية — في منظومة واحدة متناسقة.",

    "pf.eyebrow": "أعمالنا",
    "pf.t1": "منتجات لها",
    "pf.t2": "نبض.",
    "pf.lead": "كتالوج متنامٍ من الأنظمة التي نصمّمها ونبنيها ونشغّلها.",
    "pf.hint": "اسحب ←",
    "pf.view": "عرض المشروع",
    "lb.open": "عرض المعرض",
    "lb.close": "إغلاق المعرض",
    "st.live": "مباشر",
    "st.development": "قيد التطوير",
    "st.planned": "مخطَّط له",

    "why.eyebrow": "لماذا تختار PT Soft",
    "why.t1": "معايير هندسية،",
    "why.t2": "لا طرق مختصرة.",
    "why.i1t": "تطوير قائم على الذكاء",
    "why.i1d": "الذكاء جزء من البنية منذ اليوم الأول — لا إضافة تُركَّب لاحقاً.",
    "why.i2t": "بنية عصرية",
    "why.i2d": "أنظمة معيارية موثَّقة وقابلة للاختبار ترحّب بالتغيير بدل أن تقاومه.",
    "why.i3t": "أداء عالٍ",
    "why.i3d": "كل شاشة واستعلام وسير عمل مهندَس ليبدو فورياً — حتى تحت الضغط.",
    "why.i4t": "أنظمة آمنة",
    "why.i4d": "التحكم في الوصول والتشفير وقابلية التدقيق ميزات أساسية، لا خيارات.",
    "why.i5t": "شيفرة نظيفة",
    "why.i5d": "شيفرة مقروءة ومتّسقة ومُراجَعة — أساس البرمجيات التي تدوم.",
    "why.i6t": "قابلية الصيانة",
    "why.i6d": "نبني منتجات يمكنك تطويرها بثقة حتى بعد خمس سنوات من الآن.",
    "why.i7t": "إدارة احترافية",
    "why.i7d": "مراحل واضحة، وجداول زمنية صادقة، وتواصل شفاف من الانطلاق إلى الدعم.",

    "pr.eyebrow": "كيف نعمل",
    "pr.t1": "سير عمل له",
    "pr.t2": "نبض قلب.",
    "pr.hint": "اضغط على أي خطوة لتوسيعها.",
    "pr.s1t": "الاستكشاف",
    "pr.s1d": "ندرس عملك وسير عملياتك ونقاط الألم قبل كتابة سطر برمجي واحد.",
    "pr.s2t": "التخطيط",
    "pr.s2d": "النطاق والمراحل والأولويات تُحدَّد معاً — لا مفاجآت لاحقاً.",
    "pr.s3t": "البنية",
    "pr.s3d": "نصمّم نموذج البيانات والتكاملات وهيكل النظام من أجل التوسّع والأمان.",
    "pr.s4t": "التطوير",
    "pr.s4d": "بناء تكراري مع عروض دورية، لترى تقدماً حقيقياً — لا وعوداً.",
    "pr.s5t": "الاختبار",
    "pr.s5d": "اختبارات وظيفية وأدائية وأمنية على سيناريوهات حقيقية من نشاطك.",
    "pr.s6t": "الإطلاق",
    "pr.s6d": "انتقال سلس، وترحيل للبيانات، وتدريب عملي لفريقك.",
    "pr.s7t": "الدعم",
    "pr.s7d": "مراقبة وتحديثات وتحسين مستمر بعد يوم الإطلاق بزمن طويل.",

    "ct.eyebrow": "تواصل معنا",
    "ct.t1": "لنبنِ معاً",
    "ct.t2": "شيئاً ذكياً.",
    "ct.lead": "حدّثنا عن مشروعك — نجيب بسرعة.",
    "ct.wa": "واتساب",
    "ct.waHint": "تحدّث معنا مباشرة ←",
    "ct.copy": "نسخ",
    "ct.fb": "فيسبوك",
    "ct.fbVal": "Pulse Tailor",
    "ct.fbHint": "تابع صفحتنا ←",
    "ct.mail": "البريد الإلكتروني",
    "ct.mailHint": "أرسل لنا نبذة ←",

    "ft.rights": "جميع الحقوق محفوظة.",
    "ft.privacy": "سياسة الخصوصية",
    "legal.title": "PT Soft — سياسة الخصوصية",
    "legal.back": "→ العودة إلى الموقع",

    "gate.title": "دخول المالك",
    "gate.desc": "هذا الباب مخصص لـ PT Soft فقط.",
    "gate.btn": "دخول غرفة التحكم",
    "gate.checking": "جارٍ التحقق…",
    "gate.welcome": "أهلاً بك ✓",
    "gate.wrong": "كلمة المرور غير صحيحة — حاول مجدداً.",
    "gate.server": "خطأ في الخادم — أعد المحاولة بعد لحظات.",
    "gate.conn": "فشل الاتصال — تحقق من الإنترنت وأعد المحاولة.",
    "toast.copied": "تم النسخ ✓",
  },
};

(() => {
  "use strict";
  const LANGS = ["en", "fr", "ar"];
  let lang = localStorage.getItem("pts_lang");
  if (!LANGS.includes(lang)) lang = "en";

  window.PTS_LANG = lang;
  window.ptsT = (key) => PTS_I18N[lang][key] ?? PTS_I18N.en[key] ?? key;
  window.ptsSetLang = (next) => {
    if (!LANGS.includes(next) || next === lang) return;
    localStorage.setItem("pts_lang", next);
    location.reload();
  };

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  // Pages other than the landing set <body data-i18n-page="…"> to get
  // their own translated <title> (key: "<page>.title").
  const page = document.body.dataset.i18nPage;
  document.title = window.ptsT(page ? `${page}.title` : "meta.title");
  if (!page) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", window.ptsT("meta.desc"));
  }

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = window.ptsT(el.dataset.i18n);
  });

  /* ---- language switcher ---- */
  const switcher = document.getElementById("langSwitch");
  if (switcher) {
    const btn = switcher.querySelector(".lang__btn");
    const cur = switcher.querySelector(".lang__cur");
    cur.textContent = lang === "ar" ? "ع" : lang.toUpperCase();
    cur.classList.toggle("lang__cur--ar", lang === "ar");

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const open = switcher.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
    document.addEventListener("click", () => {
      switcher.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });

    switcher.querySelectorAll("[data-lang-opt]").forEach((opt) => {
      opt.classList.toggle("is-current", opt.dataset.langOpt === lang);
      opt.addEventListener("click", () => window.ptsSetLang(opt.dataset.langOpt));
    });
  }
})();
