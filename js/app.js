(() => {
  "use strict";

  const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const DAYS_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  const EXAM_TYPES = [
    { id: "parcial", label: "Parcial" },
    { id: "final", label: "Final" },
    { id: "practica", label: "Práctica" },
    { id: "oral", label: "Oral" },
    { id: "entrega", label: "Entrega" },
  ];
  const SKIN_CATS = [
    { id: "all", name: "Todas" },
    { id: "smr", name: "SMR / técnica" },
    { id: "hacker", name: "Ciberseguridad" },
    { id: "mundo", name: "Universos" },
    { id: "juego", name: "Juegos" },
    { id: "sencilla", name: "Sencillas" },
    { id: "mood", name: "Ambiente" },
  ];
  const SKINS = [
    { id: "hub", name: "SMR Hub", tag: "Trade Republic", cat: "sencilla", colors: ["#000000", "#ffffff", "#10B981"] },
    { id: "redes", name: "Rack SMR", tag: "Switch y VLAN", cat: "smr", colors: ["#0b1220", "#3b82f6", "#f59e0b"] },
    { id: "lab", name: "Laboratorio", tag: "Taller / hardware", cat: "smr", colors: ["#18181b", "#fbbf24", "#09090b"] },
    { id: "fibra", name: "Fibra", tag: "Óptica y color", cat: "smr", colors: ["#12081c", "#c084fc", "#db2777"] },
    { id: "ciberseg", name: "Matrix / SOC", tag: "Verde terminal", cat: "hacker", colors: ["#06110b", "#4ade80", "#052e16"] },
    { id: "terminal", name: "Root shell", tag: "Consola pura", cat: "hacker", colors: ["#0a0a0a", "#33ff66", "#000"] },
    { id: "redteam", name: "Red Team", tag: "Ofensiva / pentest", cat: "hacker", colors: ["#120808", "#ef4444", "#7f1d1d"] },
    { id: "soc", name: "Blue Team", tag: "Panel SOC", cat: "hacker", colors: ["#061018", "#22d3ee", "#0369a1"] },
    { id: "cyberpunk", name: "Cyberpunk", tag: "Neón y noche", cat: "hacker", colors: ["#090014", "#ff2bd6", "#00f0ff"] },
    { id: "reliquia", name: "Reliquia", tag: "Aventura / oro", cat: "mundo", colors: ["#0f1a12", "#d4af37", "#6b8f3a"] },
    { id: "holocron", name: "Holocrón", tag: "Ópera espacial", cat: "mundo", colors: ["#07080e", "#60a5fa", "#fde68a"] },
    { id: "shonen", name: "Shonen", tag: "Manga / ki", cat: "mundo", colors: ["#140c08", "#ff6a00", "#ffcc00"] },
    { id: "azulgrana", name: "Azulgrana", tag: "Camp Nou", cat: "mundo", colors: ["#0a1628", "#a50044", "#fde68a"] },
    { id: "arcade", name: "Arcade", tag: "Gaming retro", cat: "juego", colors: ["#12121c", "#a3e635", "#22d3ee"] },
    { id: "gameboy", name: "Game Boy", tag: "LCD verde", cat: "juego", colors: ["#8bac0f", "#0f380f", "#9bbc0f"] },
    { id: "bloques", name: "Bloques", tag: "Mundo cúbico", cat: "juego", colors: ["#2b2118", "#6b8f3a", "#8b5a2b"] },
    { id: "pixel", name: "16-bit", tag: "Pixel art", cat: "juego", colors: ["#1b1028", "#f472b6", "#38bdf8"] },
    { id: "isla", name: "Isla", tag: "Pueblo pastel", cat: "juego", colors: ["#e8f6e8", "#5bb38a", "#f3c96b"] },
    { id: "minimal", name: "Minimalista", tag: "Limpio", cat: "sencilla", colors: ["#f6f6f4", "#111", "#76766f"] },
    { id: "azul", name: "Sencilla azul", tag: "Clara", cat: "sencilla", colors: ["#eef4fb", "#2563eb", "#1e3a8a"] },
    { id: "lima", name: "Sencilla lima", tag: "Clara", cat: "sencilla", colors: ["#f3faf3", "#16a34a", "#14532d"] },
    { id: "coral", name: "Sencilla coral", tag: "Clara", cat: "sencilla", colors: ["#fff5f2", "#ea580c", "#9a3412"] },
    { id: "oled", name: "OLED", tag: "Negro puro", cat: "sencilla", colors: ["#000", "#38bdf8", "#111"] },
    { id: "nord", name: "Nórdico", tag: "Frío y limpio", cat: "sencilla", colors: ["#2e3440", "#88c0d0", "#5e81ac"] },
    { id: "dracula", name: "Drácula", tag: "Editor clásico", cat: "sencilla", colors: ["#282a36", "#bd93f9", "#ff79c6"] },
    { id: "tokyo", name: "Tokio", tag: "Noche urbana", cat: "sencilla", colors: ["#1a1b26", "#7aa2f7", "#bb9af7"] },
    { id: "pergamino", name: "Pergamino", tag: "Academia", cat: "mood", colors: ["#efe8dc", "#c45c26", "#1a2332"] },
    { id: "kawaii", name: "Kawaii", tag: "Rosa pastel", cat: "mood", colors: ["#fff0f5", "#ff6b9d", "#cbb2fe"] },
    { id: "lofi", name: "Lo-fi", tag: "Lluvia y study", cat: "mood", colors: ["#1b1428", "#fb7185", "#7c3aed"] },
    { id: "cafe", name: "Cafetería", tag: "Apuntes y café", cat: "mood", colors: ["#f3e7d3", "#8b4513", "#3b2414"] },
    { id: "pizarra", name: "Pizarra", tag: "Tiza y aula", cat: "mood", colors: ["#1c3a28", "#f4e28a", "#163022"] },
    { id: "win95", name: "Windows 95", tag: "Retro PC", cat: "mood", colors: ["#008080", "#000080", "#c0c0c0"] },
    { id: "vapor", name: "Vaporwave", tag: "80s / sunset", cat: "mood", colors: ["#1b1030", "#22d3ee", "#db2777"] },
  ];
  const LIGHT = new Set(["minimal", "azul", "lima", "coral", "pergamino", "gameboy", "isla", "kawaii", "cafe", "win95", "azulgrana"]);
  const START_HOUR = 8, END_HOUR = 21, SLOT_H = 48;
  const KEY = "aula.smr.v4";
  const SCHEMA_VERSION = 5;
  const BASE_TITLE = "Aula SMR";
  const APP_VERSION = "v50";
  const AVATAR_PACK = [
    { id: "arcanine", src: "assets/avatars/arcanine.jpg" },
    { id: "arceus", src: "assets/avatars/arceus.jpg" },
    { id: "blastoise", src: "assets/avatars/blastoise.jpg" },
    { id: "charizard", src: "assets/avatars/charizard.jpg" },
    { id: "gyarados", src: "assets/avatars/gyarados.jpg" },
    { id: "garchomp", src: "assets/avatars/garchomp.jpg" },
    { id: "deoxys", src: "assets/avatars/deoxys.jpg" },
    { id: "espeon", src: "assets/avatars/espeon.jpg" },
    { id: "gengar", src: "assets/avatars/gengar.jpg" },
    { id: "giratina", src: "assets/avatars/giratina.jpg" },
    { id: "groudon", src: "assets/avatars/groudon.jpg" },
    { id: "kyogre", src: "assets/avatars/kyogre.jpg" },
    { id: "lucario", src: "assets/avatars/lucario.jpg" },
    { id: "lugia", src: "assets/avatars/lugia.jpg" },
    { id: "metagross", src: "assets/avatars/metagross.jpg" },
    { id: "mewtwo", src: "assets/avatars/mewtwo.jpg" },
    { id: "rayquaza", src: "assets/avatars/rayquaza.jpg" },
    { id: "salamence", src: "assets/avatars/salamence.jpg" },
    { id: "tyranitar", src: "assets/avatars/tyranitar.jpg" },
    { id: "umbreon", src: "assets/avatars/umbreon.jpg" },
    { id: "venusaur", src: "assets/avatars/venusaur.jpg" },
    { id: "zekrom", src: "assets/avatars/zekrom.jpg" },
  ];

  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now());
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const localISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayISO = () => localISO(new Date());
  const minutesOf = (hhmm) => { const [h, m] = (hhmm || "00:00").split(":").map(Number); return h * 60 + (m || 0); };
  const fmtDate = (iso) => { if (!iso) return ""; const d = new Date(iso + "T00:00:00"); return `${d.getDate()} de ${MONTHS[d.getMonth()]}`; };
  function fmtDue(iso) {
    if (!iso) return "sin fecha";
    const d = daysUntil(iso);
    if (d === 0) return "hoy";
    if (d === 1) return "mañana";
    if (d === -1) return "ayer";
    if (d < 0) return "hace " + Math.abs(d) + " d";
    if (d <= 21) return "en " + d + " días";
    const dt = new Date(iso + "T00:00:00");
    return dt.getDate() + " " + MONTHS[dt.getMonth()].slice(0, 3);
  }
  const fmtDateLong = (iso) => {
    const d = new Date(iso + "T00:00:00");
    const wd = ["domingo","lunes","martes","miércoles","jueves","viernes","sábado"][d.getDay()];
    return `${wd}, ${d.getDate()} de ${MONTHS[d.getMonth()]} de ${d.getFullYear()}`;
  };
  const daysUntil = (iso) => {
    const a = new Date(); a.setHours(0, 0, 0, 0);
    return Math.round((new Date(iso + "T00:00:00") - a) / 86400000);
  };
  const weekdayMon0 = (date) => (date.getDay() + 6) % 7;
  const subjectById = (id) => state.subjects.find((s) => s.id === id);
  const safeColor = (c, fb) => (/^#[0-9a-fA-F]{3,8}$/.test(String(c)) ? String(c) : (fb || "#64748b"));
  const subjectColor = (id) => safeColor((subjectById(id) || {}).color);
  const subjectName = (id) => (subjectById(id) || {}).name || "Sin módulo";
  const typeLabel = (id) => (EXAM_TYPES.find((t) => t.id === id) || {}).label || id || "";
  const fmtHours = (mins) => {
    mins = Math.round(mins || 0);
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60), m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  };
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  function weightedGPA() {
    const g = state.exams.filter((e) => e.grade !== "" && !Number.isNaN(Number(e.grade)));
    if (!g.length) return null;
    const w = g.reduce((a, e) => a + (Number(e.weight) || 1), 0);
    return g.reduce((a, e) => a + Number(e.grade) * (Number(e.weight) || 1), 0) / w;
  }
  function attStats() {
    const rows = state.attendance || [];
    const t = rows.length;
    const p = rows.filter((a) => a.status === "presente").length;
    const r = rows.filter((a) => a.status === "retraso").length;
    const f = rows.filter((a) => a.status === "falta").length;
    return { t, p, r, f, pct: t ? Math.round((p / t) * 100) : null };
  }
  function overdueTasks() {
    const today = todayISO();
    return state.tasks.filter((x) => !x.done && x.due && x.due < today);
  }
  function fmtRemain(mins) {
    if (mins == null) return "—";
    if (mins < 0) return "ahora";
    const h = Math.floor(mins / 60), m = mins % 60;
    if (h <= 0) return m + " min";
    return h + " h " + pad(m);
  }
  function nowMinutes() {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  }
  function nextClassInfo() {
    const ev = nextClass();
    if (!ev) return null;
    const now = nowMinutes();
    const start = minutesOf(ev.start);
    const live = start <= now && now < minutesOf(ev.end);
    return { ev, live, remain: start - now };
  }
  function holidayName(iso) {
    iso = iso || todayISO();
    if (HOLIDAYS[iso]) return HOLIDAYS[iso];
    for (const v of VACATIONS) {
      if (iso >= v.from && iso <= v.to) return v.name;
    }
    return "";
  }
  function isNonTeaching(iso) { return !!holidayName(iso) || exceptionKind(iso, "holiday") !== null; }

  /* Excepciones de un día concreto. El horario es semanal, pero la vida real no:
     un martes no hay clase, una clase se mueve al jueves, aparece una extra…
     state.exceptions = [{ id, kind: "cancel"|"move"|"extra"|"holiday", date, eventId, start, end, room, note }] */
  function excepciones() { return Array.isArray(state.exceptions) ? state.exceptions : []; }
  function exceptionsFor(iso) { return excepciones().filter((x) => x.date === iso); }
  function exceptionKind(iso, kind) {
    const hit = exceptionsFor(iso).find((x) => x.kind === kind);
    return hit || null;
  }
  function cancelFor(iso, eventId) {
    return exceptionsFor(iso).find((x) => x.kind === "cancel" && x.eventId === eventId) || null;
  }
  // Clases reales de un día: semana fija + cambios + extras - canceladas
  function eventsOnDate(iso) {
    if (!iso) iso = todayISO();
    if (isNonTeaching(iso)) return [];
    const dow = weekdayMon0(new Date(iso + "T12:00:00"));
    const base = state.events.filter((e) => Number(e.day) === dow);
    const out = [];
    base.forEach((e) => {
      const cancel = cancelFor(iso, e.id);
      if (cancel) return;
      const mover = exceptionsFor(iso).find((x) => x.kind === "move" && x.eventId === e.id);
      if (mover) out.push({ ...e, start: mover.start || e.start, end: mover.end || e.end, room: mover.room || e.room, moved: true, baseId: e.id, id: e.id });
      else out.push({ ...e, id: e.id });
    });
    // Clases movidas desde otro día hacia este
    excepciones().forEach((x) => {
      if (x.kind !== "move" || x.date !== iso || !x.toDate) return;
      const origen = state.events.find((e) => e.id === x.eventId);
      if (origen) out.push({ ...origen, start: x.start || origen.start, end: x.end || origen.end, room: x.room || origen.room, moved: true, fromDate: x.fromDate, id: origen.id });
    });
    exceptionsFor(iso).filter((x) => x.kind === "extra").forEach((x) => {
      out.push({ id: x.id, subjectId: x.subjectId, title: x.note || "Clase extra", start: x.start || "15:00", end: x.end || "16:00", room: x.room || "", type: "extra", extra: true });
    });
    return out.sort((a, b) => String(a.start).localeCompare(String(b.start)));
  }
  function setException(parcial) {
    // Para una misma clase y día, la última decisión manda: si dices "sin clase"
    // y luego "movida", no se quedan las dos. Otras clases del día no se tocan.
    state.exceptions = excepciones().filter((x) => {
      if (x.date !== parcial.date) return true;
      if (x.eventId && parcial.eventId && x.eventId === parcial.eventId) return false;
      return x.kind !== parcial.kind;
    });
    if (parcial.quitar) { save(); return; }
    state.exceptions.push(Object.assign({ id: uid() }, parcial));
    save();
  }
  function liveBlock() {
    const iso = todayISO();
    const hol = holidayName(iso);
    if (hol) return { active: null, next: null, weekend: true, holiday: hol };
    const now = nowMinutes();
    const list = eventsOnDate(iso);
    let active = null, next = null;
    for (const c of list) {
      const stt = minutesOf(c.start), en = minutesOf(c.end);
      if (now >= stt && now < en) { active = { ev: c, startMins: stt, endMins: en }; break; }
      if (now < stt && !next) next = { ev: c, startMins: stt, endMins: en };
    }
    return { active, next, weekend: weekdayMon0(new Date()) > 4, holiday: "" };
  }
  function subjectGPA(sid) {
    const g = state.exams.filter((e) => e.subjectId === sid && e.grade !== "" && !Number.isNaN(Number(e.grade)));
    if (!g.length) return null;
    const w = g.reduce((a, e) => a + (Number(e.weight) || 1), 0);
    return g.reduce((a, e) => a + Number(e.grade) * (Number(e.weight) || 1), 0) / w;
  }
  function buzz() {
    if (state.settings.vibrate === false) return;
    try { if (navigator.vibrate) navigator.vibrate([40, 40, 80]); } catch {}
  }
  function confetti() {
    if (state.settings.confetti === false) return;
    const box = document.createElement("div");
    box.className = "confetti";
    const colors = ["#ee1515", "#ffcb05", "#3b4cca", "#22c55e", "#f97316", "#a855f7"];
    for (let i = 0; i < 28; i++) {
      const d = document.createElement("i");
      d.style.left = Math.random() * 100 + "%";
      d.style.background = colors[i % colors.length];
      d.style.animationDelay = (Math.random() * 0.2) + "s";
      d.style.transform = "rotate(" + (Math.random() * 90) + "deg)";
      box.appendChild(d);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 1300);
  }
  function noteOnce(tag, title, body) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    if (state.settings.notify === false) return;
    try {
      const k = "aula.nt." + tag;
      if (localStorage.getItem(k)) return;
      localStorage.setItem(k, String(Date.now()));
    } catch { return; }
    const opts = {
      body, icon: "assets/icon-192.png", badge: "assets/icon-192.png",
      tag, vibrate: [80, 40, 80], renotify: false,
      data: { url: "./" },
    };
    const send = () => {
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then((reg) => reg.showNotification(title, opts)).catch(() => {
          try { new Notification(title, opts); } catch {}
        });
      } else {
        try { new Notification(title, opts); } catch {}
      }
    };
    send();
  }
  function requestNotify() {
    if (!("Notification" in window)) { toast("Este navegador no avisa"); return; }
    Notification.requestPermission().then((p) => {
      state.settings.notify = p === "granted";
      save();
      toast(p === "granted" ? "Avisos activados" : "Sin permiso de avisos");
      if (p === "granted") tickNotify(true);
      if (view === "settings" || view === "dashboard") render();
    });
  }
  function tickNotify(force) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    if (state.settings.notify === false && !force) return;
    const hour = new Date().getHours();
    const today = todayISO();
    const info = nextClassInfo();
    if (state.settings.notifyClass !== false && info && !info.live && info.remain > 0 && info.remain <= 10) {
      noteOnce("clase-" + info.ev.id + "-" + today,
        "Clase en " + info.remain + " min",
        subjectName(info.ev.subjectId) + (info.ev.room ? " · " + info.ev.room : "") + " · " + info.ev.start);
    }
    if (state.settings.notifyClass !== false && info && info.live) {
      noteOnce("ahora-" + info.ev.id + "-" + today,
        "Estás en clase",
        subjectName(info.ev.subjectId) + " hasta las " + info.ev.end);
    }
    const lead = Number(state.settings.examLeadDays) || 1;
    if (state.settings.notifyExams !== false) {
      const todayEx = state.exams.filter((e) => e.status !== "hecho" && daysUntil(e.date) === 0);
      todayEx.forEach((e) => noteOnce("exam-hoy-" + e.id, "Examen hoy", e.title + (e.time ? " · " + e.time : "")));
      const soon = state.exams.filter((e) => e.status !== "hecho" && daysUntil(e.date) === lead);
      soon.forEach((e) => noteOnce("exam-lead-" + e.id, lead === 1 ? "Examen mañana" : "Examen en " + lead + " días", e.title));
    }
    if (state.settings.notifyTasks !== false) {
      const due = state.tasks.filter((x) => !x.done && x.due === today);
      if (due.length) noteOnce("tareas-" + today, "Tareas de hoy", due.length === 1 ? due[0].title : due.length + " pendientes");
      const late = overdueTasks();
      if (late.length) noteOnce("atrasadas-" + today, "Tareas atrasadas", late.length + " sin entregar");
    }
    if (state.settings.notifyCards !== false) {
      const n = dueCards().length;
      if (n) noteOnce("fichas-" + today, "Fichas pendientes", n + " para repasar hoy");
    }
    if (hour >= 20 && (state.settings.dailyGoal || 90)) {
      const mins = state.sessions.filter((s) => s.date === today).reduce((a, b) => a + (b.minutes || 0), 0);
      if (mins < (state.settings.dailyGoal || 90)) {
        noteOnce("meta-" + today, "Meta de estudio", "Llevas " + fmtHours(mins) + " de " + (state.settings.dailyGoal || 90) + " min. Un bloque ahora.");
      }
    }
    if (state.settings.nightRemind !== false && hour >= 21 && !streak()) {
      noteOnce("racha-" + today, "Racha en peligro", "10 minutos ahora y no la rompes.");
    }
    if (state.settings.morningSummary !== false && hour >= (state.settings.remindHour || 8) && hour < 12) {
      const nx = nextExam();
      const dueN = state.tasks.filter((x) => !x.done && x.due === today).length;
      noteOnce("manana-" + today, "Buenos días",
        (dueN ? dueN + " tareas hoy" : "Sin tareas hoy") + (nx ? " · próximo examen: " + nx.title : ""));
    }
  }


  function defaultState() {
    return {
      settings: {
        name: "", courseName: "SMR 2º 2026/27", startDate: "2026-09-08",
        skin: "hub", uiTheme: "dark", pomodoroWork: 25, pomodoroBreak: 5, pomodoroLong: 15,
        cyclesUntilLong: 4, dailyGoal: 90, includeSaturday: false, demo: true, sound: true, notify: false, remindHour: 8, onboarded: false,
        center: "", group: "", endDate: "2027-06-19", startView: "dashboard",
        uiSize: "md", compact: false, reduceMotion: false, showXp: true, showMedals: true, showWeekStrip: true,
        vibrate: true, confetti: true, autoNext: false, keepAwake: true, showTimerBar: true,
        notifyExams: true, notifyTasks: true, notifyCards: true, notifyClass: true, examLeadDays: 1,
        confirmDelete: true, showAttendance: true, defaultHours: 8, defaultPrio: "media",
        gradeMax: 10, startHour: 15, endHour: 23, weekGoalDays: 5, hideCompleted: false, timetableId: "",
        ollamaUrl: "", ollamaModel: "llama3.2", pin: "", autoTheme: false, guest: false,
        nightRemind: true, morningSummary: true, inactivityDays: 5, avatarOn: true, avatarIcon: "letter",
        appIcon: "dragon", customAvatars: [],
      },
      subjects: [], exams: [], notes: [], events: [], tasks: [], sessions: [], cards: [], inbox: [], attendance: [],
      progress: { bonusXp: 0, unlocked: {}, daily: "", log: [], flags: {}, freeze: 1, lastFreezeWeek: "" },
      topics: [], habits: [], glossary: [], trash: [], backupsMeta: [],
      widgets: ["live","exams","tasks","xp"],
    };
  }

  const OFFICIAL_MODS = [
    { key: "seg", name: "Seguridad informática", teacher: "Raúl Sanchis Camarasa", color: "#ef4444", aliases: ["seguridad"] },
    { key: "ipe", name: "Itinerario personal para la empleabilidad II", teacher: "Natalia Poquet Giner", color: "#14b8a6", aliases: ["ipe", "itinerario", "empleabilidad"] },
    { key: "sor", name: "Sistemas operativos en red", teacher: "Damián Antonio Santos Baldo / Ernesto Montero Sandiego", color: "#f59e0b", aliases: ["sistemas operativos"] },
    { key: "ser", name: "Servicios en red", teacher: "Ernesto Montero Sandiego / José María Guerrero Romero", color: "#22c55e", aliases: ["servicios en red"] },
    { key: "web", name: "Aplicaciones web", teacher: "Miguel Valiente Sánchez", color: "#8b5cf6", aliases: ["aplicaciones web"] },
    { key: "pro", name: "Proyecto intermodular Sistemas microinformáticos y redes", teacher: "Ernesto Montero Sandiego", color: "#ec4899", aliases: ["proyecto intermodular", "proyecto"] },
    { key: "dig", name: "Digitalización aplicada al sistema productivo GM", teacher: "Amador Gramage Borrás", color: "#06b6d4", aliases: ["digitalización", "digitalizacion"] },
    { key: "sos", name: "Sostenibilidad aplicada al sistema productivo", teacher: "Javier Ibáñez Micó", color: "#84cc16", aliases: ["sostenibilidad"] },
    { key: "opt", name: "Módulo optativo", teacher: "Damián Antonio Santos Baldo", color: "#64748b", aliases: ["optativo"] },
    { key: "tut", name: "Tutoría Segundo", teacher: "Ernesto Montero Sandiego", color: "#a78bfa", aliases: ["tutoría", "tutoria"] },
  ];
  const TIMETABLE_ID = "2cfm-vesp-2026b";
  const HOLIDAYS = {
    "2026-09-08": "Ntra. Sra. de las Virtudes",
    "2026-09-10": "Fiesta local Villena",
    "2026-10-09": "Día de la Comunitat Valenciana",
    "2026-10-12": "Fiesta Nacional de España",
    "2026-11-01": "Todos los Santos",
    "2026-12-06": "Día de la Constitución",
    "2026-12-08": "Inmaculada Concepción",
    "2026-12-25": "Navidad",
    "2027-01-01": "Año Nuevo",
    "2027-01-06": "Reyes",
    "2027-03-19": "San José",
    "2027-03-26": "Viernes Santo",
    "2027-03-29": "Lunes de Pascua",
    "2027-04-13": "Fiesta local Villena",
    "2027-05-01": "Fiesta del Trabajo",
    "2027-06-24": "San Juan",
  };
  const VACATIONS = [
    { from: "2026-12-22", to: "2027-01-06", name: "Vacaciones de Navidad" },
    { from: "2027-03-25", to: "2027-04-05", name: "Vacaciones de Pascua" },
  ];
  function officialSubjectId(st, spec) {
    const hit = (st.subjects || []).find((s) => {
      const n = String(s.name || "").toLowerCase();
      return spec.aliases.some((a) => n.includes(a));
    });
    if (hit) {
      hit.name = spec.name;
      hit.teacher = spec.teacher || "";
      hit.room = hit.room || "2CFM";
      if (spec.color) hit.color = spec.color;
      return hit.id;
    }
    const id = uid();
    st.subjects = st.subjects || [];
    st.subjects.push({ id, name: spec.name, color: spec.color, teacher: spec.teacher || "", room: "2CFM", credits: 0 });
    return id;
  }
  function officialEvents(ids) {
    const ev = (sid, day, start, end) => ({ id: uid(), subjectId: sid, day, start, end, room: "2CFM", type: "clase" });
    return [
      ev(ids.seg, 0, "15:10", "17:00"),
      ev(ids.ipe, 0, "17:00", "17:55"),
      ev(ids.sor, 0, "18:15", "20:05"),
      ev(ids.ser, 0, "20:05", "21:00"),
      ev(ids.ser, 0, "21:20", "22:15"),
      ev(ids.ipe, 1, "15:10", "16:05"),
      ev(ids.dig, 1, "16:05", "17:00"),
      ev(ids.seg, 1, "17:00", "17:55"),
      ev(ids.seg, 1, "18:15", "19:10"),
      ev(ids.opt, 1, "19:10", "20:05"),
      ev(ids.web, 1, "20:05", "21:00"),
      ev(ids.pro, 2, "15:10", "17:00"),
      ev(ids.opt, 2, "17:00", "17:55"),
      ev(ids.opt, 2, "18:15", "19:10"),
      ev(ids.ser, 2, "19:10", "20:05"),
      ev(ids.sos, 2, "20:05", "21:00"),
      ev(ids.sor, 3, "15:10", "17:00"),
      ev(ids.web, 3, "17:00", "17:55"),
      ev(ids.web, 3, "18:15", "19:10"),
      ev(ids.ser, 3, "19:10", "21:00"),
      ev(ids.tut, 4, "15:10", "16:05"),
      ev(ids.ipe, 4, "16:05", "17:00"),
      ev(ids.ser, 4, "17:00", "17:55"),
      ev(ids.ser, 4, "18:15", "19:10"),
      ev(ids.sor, 4, "19:10", "21:00"),
    ];
  }
  function applyOfficialTimetable(st) {
    const ids = {};
    OFFICIAL_MODS.forEach((m) => { ids[m.key] = officialSubjectId(st, m); });
    st.events = officialEvents(ids);
    st.settings = st.settings || {};
    st.settings.timetableId = TIMETABLE_ID;
    st.settings.group = st.settings.group || "2CFM";
    if (!st.settings.center || /luis murillo/i.test(String(st.settings.center))) st.settings.center = "";
    st.settings.startHour = 15;
    st.settings.endHour = 23;
    st.settings.remindHour = st.settings.remindHour === 8 ? 14 : (st.settings.remindHour || 14);
    return ids;
  }
  function seedDemo() {
    const s = defaultState();
    const ids = applyOfficialTimetable(s);
    s.settings.demo = true;
    s.exams = [
      { id: uid(), subjectId: ids.sor, title: "Parcial: dominio y usuarios (AD)", date: "2026-10-16", time: "09:00", type: "parcial", location: "Aula 2", notes: "Active Directory, perfiles, permisos NTFS, GPOs básicas.", grade: "", weight: 30, difficulty: 4, hoursNeeded: 10, status: "pendiente", checklist: [{ id: uid(), text: "Crear OU y usuarios", done: true }, { id: uid(), text: "Permisos NTFS vs compartir", done: false }] },
      { id: uid(), subjectId: ids.ser, title: "Práctica: DHCP + DNS + Apache", date: "2026-10-23", time: "10:40", type: "practica", location: "Aula redes", notes: "Ámbitos DHCP, zonas DNS, virtual hosts y HTTPS básico.", grade: "", weight: 30, difficulty: 4, hoursNeeded: 12, status: "pendiente", checklist: [{ id: uid(), text: "Reservas DHCP", done: false }, { id: uid(), text: "Registro A y CNAME", done: false }] },
      { id: uid(), subjectId: ids.seg, title: "Parcial: amenazas, copias y cortafuegos", date: "2026-11-06", time: "08:30", type: "parcial", location: "Lab 2", notes: "Malware, 3-2-1, ACL, NAT, autenticación.", grade: "", weight: 35, difficulty: 4, hoursNeeded: 12, status: "pendiente", checklist: [] },
      { id: uid(), subjectId: ids.web, title: "Entrega: sitio HTML/CSS + formulario", date: "2026-11-13", time: "11:00", type: "entrega", location: "Aula 3", notes: "Semántica, CSS, validación y PHP o JS mínimo.", grade: "", weight: 25, difficulty: 3, hoursNeeded: 8, status: "pendiente", checklist: [] },
      { id: uid(), subjectId: ids.ser, title: "Parcial: FTP, correo y acceso remoto", date: "2026-12-04", time: "09:00", type: "parcial", location: "Aula redes", notes: "FTP activo/pasivo, SMTP/IMAP, SSH y escritorio remoto.", grade: "", weight: 30, difficulty: 4, hoursNeeded: 10, status: "pendiente", checklist: [] },
      { id: uid(), subjectId: ids.ipe, title: "IPE: contrato, nómina y CV", date: "2026-12-11", time: "12:30", type: "parcial", location: "B-04", notes: "Tipos de contrato, nómina, prevención, entrevista.", grade: "", weight: 40, difficulty: 2, hoursNeeded: 5, status: "pendiente", checklist: [] },
      { id: uid(), subjectId: ids.pro, title: "Entrega proyecto intermodular", date: "2027-03-12", time: "10:00", type: "entrega", location: "Taller", notes: "Memoria + demo: red, servicios y seguridad del caso.", grade: "", weight: 100, difficulty: 5, hoursNeeded: 30, status: "pendiente", checklist: [] },
    ];
    s.notes = [
      { id: uid(), subjectId: ids.ser, title: "Puertos que hay que saber", content: "# Servicios y puertos\n\n- SSH :: 22\n- DNS :: 53\n- DHCP :: 67/68\n- HTTP :: 80\n- HTTPS :: 443\n- FTP :: 20/21\n- SMTP :: 25 / 587\n- IMAP :: 143 / 993\n- RDP :: 3389\n\n**Truco:** el examen suele pedir el puerto Y si es TCP o UDP.", pinned: true, createdAt: Date.now() - 86400000 * 3, updatedAt: Date.now() - 3600000 },
      { id: uid(), subjectId: ids.seg, title: "Amenazas y copias", content: "## Malware\nVirus, gusanos, troyanos, ransomware, spyware.\n\n## Copias 3-2-1\n3 copias, 2 soportes, 1 fuera del sitio.\n\n- Firewall :: filtra tráfico de red\n- ACL :: lista de control de acceso\n- Phishing :: engaño para robar credenciales\n- 2FA :: segundo factor de autenticación", pinned: false, createdAt: Date.now() - 86400000 * 2, updatedAt: Date.now() - 86400000 },
      { id: uid(), subjectId: ids.sor, title: "Active Directory en 1 hoja", content: "# Dominio Windows\n\n- **AD DS**: servicio de directorio.\n- **OU**: unidad organizativa (agrupa usuarios/equipos).\n- **GPO**: políticas que se aplican a OU.\n- **SID**: identificador de seguridad del objeto.\n\n- net user :: gestionar usuarios locales\n- gpupdate /force :: aplicar GPO ya", pinned: false, createdAt: Date.now() - 86400000, updatedAt: Date.now() - 7200000 },
      { id: uid(), subjectId: ids.web, title: "HTML mínimo para el módulo", content: "# Esqueleto\n\n`<!DOCTYPE html>` + charset UTF-8.\n\n- `<form method=\"post\">` envía al servidor.\n- CSS en archivo aparte (mantenible).\n- Nunca guardes contraseñas en claro.\n- GET :: pide un recurso\n- POST :: envía datos (login, formularios)", pinned: false, createdAt: Date.now() - 40000000, updatedAt: Date.now() - 40000000 },
    ];
    s.tasks = [
      { id: uid(), subjectId: ids.ser, title: "Levantar DHCP + DNS en la VM del aula", due: "2026-09-18", done: false, priority: "alta" },
      { id: uid(), subjectId: ids.seg, title: "Practicar reglas iptables / firewalld", due: "2026-09-16", done: false, priority: "alta" },
      { id: uid(), subjectId: ids.sor, title: "Crear dominio de prueba y 5 usuarios", due: "2026-09-10", done: false, priority: "media" },
      { id: uid(), subjectId: ids.web, title: "Bosquejo del sitio del proyecto", due: "2026-09-05", done: false, priority: "media" },
      { id: uid(), subjectId: ids.pro, title: "Definir el caso del proyecto intermodular", due: "2026-09-18", done: false, priority: "alta" },
      { id: uid(), subjectId: ids.ipe, title: "Actualizar el CV con prácticas SMR", due: "2026-09-12", done: false, priority: "baja" },
    ];
    s.cards = [
      { id: uid(), subjectId: ids.ser, front: "Puerto de DNS", back: "53 (UDP consultas, TCP transferencias de zona)", due: todayISO(), interval: 0, reps: 0 },
      { id: uid(), subjectId: ids.ser, front: "¿Qué reparte el DHCP?", back: "IP, máscara, puerta de enlace y DNS, durante un tiempo (lease)", due: todayISO(), interval: 0, reps: 0 },
      { id: uid(), subjectId: ids.sor, front: "¿Qué es una GPO?", back: "Directiva de grupo: configura usuarios y equipos del dominio", due: todayISO(), interval: 0, reps: 0 },
      { id: uid(), subjectId: ids.seg, front: "Copia 3-2-1", back: "3 copias, 2 soportes distintos, 1 fuera del sitio", due: todayISO(), interval: 0, reps: 0 },
      { id: uid(), subjectId: ids.seg, front: "Diferencia NAT y firewall", back: "NAT traduce direcciones; el firewall decide si deja pasar el tráfico", due: todayISO(), interval: 0, reps: 0 },
      { id: uid(), subjectId: ids.web, front: "¿GET o POST para un login?", back: "POST: no va en la URL y no se cachea igual", due: todayISO(), interval: 0, reps: 0 },
      { id: uid(), subjectId: ids.ipe, front: "Empleabilidad", back: "Itinerario personal para la empleabilidad II: contrato, CV y entrevista", due: todayISO(), interval: 0, reps: 0 },
    ];
    s.inbox = [
      { id: uid(), text: "Preguntar si el proyecto puede ser un servidor LAMP + copias", createdAt: Date.now() - 3600000 },
      { id: uid(), text: "Apuntar la IP del servidor de prácticas del aula", createdAt: Date.now() - 7200000 },
    ];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      if (d.getDay() === 0) continue;
      s.sessions.push({ id: uid(), subjectId: s.subjects[i % s.subjects.length].id, date: localISO(d), minutes: 35 + ((i * 17) % 70), type: "pomodoro" });
    }
    s.settings.name = "";
    return s;
  }

  /* ---------------------------------------------------------------
     Integridad de datos: nada de lo que guarda el usuario se pierde
     ni se sobrescribe sin avisar. Todas estas funciones son seguras:
     ninguna lanza.
     --------------------------------------------------------------- */

  const Media = () => window.AulaMedia || null;   // almacén de fotos (IndexedDB)
  const mediaOk = () => !!(Media() && Media().available());
  const BACKUP_KEY = KEY + ".bak";
  const BAK_AT_KEY = "aula.bakAt";
  let loadProblem = "";
  let saveProblem = "";
  let backupsRaw = "";

  const isObj = (v) => !!v && typeof v === "object" && !Array.isArray(v);
  const asArray = (v) => (Array.isArray(v) ? v : []);
  const asText = (v, fb) => (typeof v === "string" && v.trim() ? v : (fb || ""));
  const asISO = (v) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "");
  const asHHMM = (v, fb) => (/^\d{1,2}:\d{2}$/.test(String(v)) ? String(v) : fb);
  const asColor = (v, fb) => (/^#[0-9a-fA-F]{3,8}$/.test(String(v)) ? String(v) : fb);

  // Convierte lo que venga (import, sync, versión vieja) en un estado usable.
  function sanitize(p) {
    const base = defaultState();
    const src = isObj(p) ? p : {};
    const out = Object.assign({}, base, src);
    const settings = Object.assign({}, base.settings, isObj(src.settings) ? src.settings : {});
    if (!Array.isArray(settings.customAvatars)) settings.customAvatars = [];
    if (settings.skin === "pokemon") settings.skin = "hub";
    if (!SKINS.some((s) => s.id === settings.skin)) settings.skin = "hub";
    if (/^p\d+$/.test(settings.avatarIcon || "")) settings.avatarIcon = "letter";
    if (/^p\d+$/.test(settings.appIcon || "")) settings.appIcon = "dragon";
    if (!settings.uiTheme) settings.uiTheme = LIGHT.has(settings.skin) ? "light" : "dark";
    if (!Number.isFinite(Number(settings.dailyGoal)) || Number(settings.dailyGoal) <= 0) settings.dailyGoal = 90;
    settings.pomodoroWork = clamp(Number(settings.pomodoroWork) || 25, 1, 180);
    settings.pomodoroBreak = clamp(Number(settings.pomodoroBreak) || 5, 1, 60);
    settings.pomodoroLong = clamp(Number(settings.pomodoroLong) || 15, 1, 120);
    settings.gradeMax = clamp(Number(settings.gradeMax) || 10, 5, 100);
    settings.examLeadDays = clamp(Number(settings.examLeadDays) || 1, 0, 30);
    settings.startHour = clamp(Number(settings.startHour) || 8, 0, 23);
    settings.endHour = clamp(Number(settings.endHour) || 21, 1, 24);
    out.settings = settings;

    const subjects = asArray(src.subjects).filter(isObj).map((s) => ({
      id: asText(s.id) || uid(),
      name: asText(s.name, "Módulo sin nombre"),
      teacher: asText(s.teacher),
      room: asText(s.room),
      credits: Number(s.credits) || 0,
      color: asColor(s.color, "#64748b"),
    }));
    out.subjects = subjects;
    const hasSub = (id) => subjects.some((s) => s.id === id);
    const subOf = (id) => (hasSub(id) ? id : (subjects[0] ? subjects[0].id : ""));
    const subName = (id) => asText((subjects.find((s) => s.id === id) || {}).name);

    const fixCheck = (c) => ({ id: asText(c.id) || uid(), text: asText(c.text, "Ítem"), done: !!c.done });

    out.events = asArray(src.events).filter(isObj).map((e) => ({
      id: asText(e.id) || uid(), subjectId: subOf(e.subjectId),
      day: clamp(Number(e.day) || 0, 0, 6),
      start: asHHMM(e.start, "09:00"), end: asHHMM(e.end, "10:00"),
      room: asText(e.room), type: asText(e.type, "clase"),
    }));

    out.exams = asArray(src.exams).filter(isObj).filter((e) => e.title || e.date).map((e) => ({
      id: asText(e.id) || uid(), subjectId: subOf(e.subjectId),
      title: asText(e.title, "Examen sin título"),
      date: asISO(e.date) || todayISO(), time: asHHMM(e.time, "09:00"),
      type: asText(e.type, "parcial"), location: asText(e.location), notes: asText(e.notes),
      grade: (e.grade === "" || e.grade == null || !Number.isFinite(Number(e.grade))) ? "" : String(e.grade),
      weight: clamp(Number(e.weight) || 25, 0, 100),
      difficulty: clamp(Number(e.difficulty) || 3, 1, 5),
      hoursNeeded: clamp(Number(e.hoursNeeded) || Number(settings.defaultHours) || 8, 1, 500),
      status: e.status === "hecho" ? "hecho" : "pendiente",
      checklist: asArray(e.checklist).filter(isObj).map(fixCheck),
    }));

    out.tasks = asArray(src.tasks).filter(isObj).filter((x) => x.title).map((x) => ({
      id: asText(x.id) || uid(), subjectId: hasSub(x.subjectId) ? x.subjectId : (x.subjectId || ""),
      title: asText(x.title, "Tarea"), due: asISO(x.due),
      priority: ["alta", "media", "baja"].includes(x.priority) ? x.priority : "media",
      done: !!x.done, kanban: ["todo", "doing", "done"].includes(x.kanban) ? x.kanban : undefined,
    }));

    out.notes = asArray(src.notes).filter(isObj).map((n) => ({
      id: asText(n.id) || uid(), subjectId: hasSub(n.subjectId) ? n.subjectId : (n.subjectId || ""),
      title: asText(n.title, "Sin título"), content: typeof n.content === "string" ? n.content : "",
      pinned: !!n.pinned, locked: !!n.locked,
      attachments: asArray(n.attachments).filter(isObj).map((a) => ({
        id: asText(a.id) || uid(),
        name: asText(a.name, "foto"),
        kind: asText(a.kind, "img"),
        // «data» solo se usa si el navegador no tiene IndexedDB (o mientras se migra)
        data: typeof a.data === "string" ? a.data : "",
        size: Number(a.size) || undefined,
      })),
      versions: asArray(n.versions).filter(isObj).slice(0, 12).map((v) => ({ t: Number(v.t) || Date.now(), title: asText(v.title), content: typeof v.content === "string" ? v.content : "" })),
      createdAt: Number(n.createdAt) || Date.now(), updatedAt: Number(n.updatedAt) || Date.now(),
      deletedAt: n.deletedAt ? Number(n.deletedAt) : undefined,
    }));

    out.cards = asArray(src.cards).filter(isObj).filter((c) => c.front).map((c) => ({
      id: asText(c.id) || uid(), subjectId: subOf(c.subjectId),
      front: asText(c.front, "?"), back: asText(c.back, ""),
      due: asISO(c.due) || todayISO(),
      interval: clamp(Number(c.interval) || 0, 0, 3650), reps: clamp(Number(c.reps) || 0, 0, 100000),
      ease: clamp(Number(c.ease) || 2.5, 1.3, 3.2), lapses: clamp(Number(c.lapses) || 0, 0, 100000),
      last: asISO(c.last), history: asArray(c.history).filter(isObj).slice(0, 20).map((h) => ({ t: Number(h.t) || 0, q: clamp(Number(h.q) || 0, 0, 5) })),
    }));

    out.sessions = asArray(src.sessions).filter(isObj).map((s) => ({
      id: asText(s.id) || uid(), subjectId: subOf(s.subjectId),
      date: asISO(s.date) || todayISO(),
      minutes: clamp(Number(s.minutes) || 0, 0, 1440),
      type: asText(s.type, "pomodoro"),
      hour: Number.isFinite(Number(s.hour)) ? clamp(Number(s.hour), 0, 23) : undefined,
      createdAt: Number(s.createdAt) || undefined,
    }));

    out.attendance = asArray(src.attendance).filter(isObj)
      .filter((a) => ["presente", "retraso", "falta"].includes(a.status))
      .map((a) => ({ id: asText(a.id) || uid(), eventId: asText(a.eventId), date: asISO(a.date) || todayISO(), status: a.status }));

    out.inbox = asArray(src.inbox).filter(isObj).filter((i) => i.text).map((i) => ({ id: asText(i.id) || uid(), text: asText(i.text), createdAt: Number(i.createdAt) || Date.now() }));

    out.habits = asArray(src.habits).filter(isObj).filter((h) => h.title).map((h) => ({
      id: asText(h.id) || uid(), title: asText(h.title, "Hábito"),
      minutes: clamp(Number(h.minutes) || 20, 1, 600), time: asHHMM(h.time, "21:30"),
      doneOn: asArray(h.doneOn).map((d) => asISO(d)).filter(Boolean),
    }));

    out.glossary = asArray(src.glossary).filter(isObj).filter((g) => g.term).map((g) => ({ id: asText(g.id) || uid(), term: asText(g.term), def: asText(g.def), subjectId: hasSub(g.subjectId) ? g.subjectId : "" }));

    out.trash = asArray(src.trash).filter(isObj).filter((n) => n.title).map((n) => ({
      id: asText(n.id) || uid(), subjectId: hasSub(n.subjectId) ? n.subjectId : "", title: asText(n.title),
      content: typeof n.content === "string" ? n.content : "", pinned: !!n.pinned,
      attachments: asArray(n.attachments).filter(isObj), createdAt: Number(n.createdAt) || Date.now(),
      updatedAt: Number(n.updatedAt) || Date.now(), deletedAt: Number(n.deletedAt) || Date.now(),
    }));

    const prog = isObj(src.progress) ? src.progress : {};
    out.progress = {
      bonusXp: Number(prog.bonusXp) || 0, unlocked: isObj(prog.unlocked) ? prog.unlocked : {},
      daily: asISO(prog.daily), log: asArray(prog.log).filter(isObj).slice(0, 40),
      flags: isObj(prog.flags) ? prog.flags : {}, freeze: clamp(Number(prog.freeze ?? 1), 0, 9),
      lastFreezeWeek: asText(prog.lastFreezeWeek),
    };
    out.widgets = asArray(src.widgets).length ? asArray(src.widgets) : base.widgets;
    out.schemaVersion = SCHEMA_VERSION;   // migraciones futuras: v4 -> v5 se hacen aquí
    out.topics = asArray(src.topics);
    out.exceptions = asArray(src.exceptions).filter(isObj).filter((x) => ["cancel", "move", "extra", "holiday"].includes(x.kind) && asISO(x.date)).map((x) => ({
      id: asText(x.id) || uid(), kind: x.kind, date: asISO(x.date), eventId: asText(x.eventId),
      subjectId: hasSub(x.subjectId) ? x.subjectId : "", start: asHHMM(x.start, ""), end: asHHMM(x.end, ""),
      room: asText(x.room), note: asText(x.note), toDate: asISO(x.toDate), fromDate: asISO(x.fromDate),
    }));

    // Compatibilidad de versiones anteriores
    if (((out.settings || {}).skin || "") === "pokemon") out.settings.skin = "hub";
    out.subjects.forEach((s) => {
      if (/^IPE/i.test(s.name) && (!s.color || s.color === "#64748b")) s.color = "#14b8a6";
    });
    return out;
  }

  function load() {
    let raw = null;
    try { raw = localStorage.getItem(KEY); } catch { return seedDemo(); }
    if (!raw) return seedDemo();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      // No se pisa el original: se guarda una copia cruda y se avisa.
      try { localStorage.setItem(BACKUP_KEY, raw); localStorage.setItem(BAK_AT_KEY, String(Date.now())); } catch {}
      backupsRaw = raw;
      loadProblem = "Los datos guardados estaban dañados y no se han podido leer. He conservado una copia del original.";
      return seedDemo();
    }
    const out = sanitize(parsed);
    // La plantilla oficial ya no machaca el horario del usuario: solo se aplica
    // cuando no hay ni horario ni marca previa, o si el usuario lo pide.
    const sinHorario = !asArray(out.events).length;
    if (sinHorario && !asText(out.settings.timetableId)) applyOfficialTimetable(out);
    return out;
  }

  let saveTimer = null;
  let lastSaveSize = 0;

  function save() {
    if (state.settings && state.settings.guest) return;
    let json;
    try { json = JSON.stringify(state); } catch { saveProblem = "Los datos no se pueden preparar para guardar."; return; }
    lastSaveSize = json.length;
    // Copia de seguridad rotativa (una, cada 6 h) sin dispararse de tamaño.
    try {
      if (json.length < 1_500_000) {
        const last = Number(localStorage.getItem(BAK_AT_KEY) || 0);
        if (Date.now() - last > 6 * 3600 * 1000) {
          const prev = localStorage.getItem(KEY);
          if (prev && prev.length < 2_500_000) {
            localStorage.setItem(BACKUP_KEY, prev);
            localStorage.setItem(BAK_AT_KEY, String(Date.now()));
          }
        }
      }
    } catch {}
    try {
      localStorage.setItem(KEY, json);
      if (saveProblem) { saveProblem = ""; toast("Ya se vuelve a guardar bien"); }
    } catch (e) {
      const quota = /quota|exceed/i.test(String((e && e.name) + (e && e.message)));
      const antes = saveProblem;
      saveProblem = quota
        ? "No hay espacio en este dispositivo. Exporta una copia y borra fotos, apuntes viejos o sesiones."
        : "No se han podido guardar los datos en este dispositivo.";
      if (antes !== saveProblem) toast(quota ? "¡Sin espacio para guardar!" : "Error al guardar");
      return;
    }
    pushWidgets();
  }

  // Guardado diferido: pintar no debe escribir en disco en cada pulsación.
  function scheduleSave(delay) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { saveTimer = null; save(); }, delay == null ? 400 : delay);
  }
  function flushSave() {
    if (saveTimer) { clearTimeout(saveTimer); saveTimer = null; }
    save();
  }
  function storageBytes() {
    try { return (localStorage.getItem(KEY) || "").length; } catch { return 0; }
  }
  // Las fotos antiguas viven dentro del estado. Al abrir, se pasan a IndexedDB y
  // se quitan del JSON: es lo que evita que la app se quede sin espacio al guardar.
  async function migrateMedia() {
    if (!mediaOk()) return 0;
    const pendientes = [];
    state.notes.forEach((n) => (n.attachments || []).forEach((a) => {
      if (a.data && String(a.data).startsWith("data:")) pendientes.push({ att: a, data: a.data });
    }));
    if (!pendientes.length) return 0;
    let movidas = 0;
    for (const { att, data } of pendientes) {
      try {
        await Media().put(att.id, data);
        att.size = att.size || Math.round(data.length * 0.75);
        delete att.data;
        movidas++;
      } catch {}
    }
    if (movidas) { flushSave(); toast(`${movidas} foto(s) movidas al almacén de archivos`); }
    return movidas;
  }

  function restoreBackup() {
    let raw = null;
    try { raw = localStorage.getItem(BACKUP_KEY); } catch {}
    if (!raw) { toast("No hay copia de seguridad"); return; }
    try {
      state = sanitize(JSON.parse(raw));
      loadProblem = "";
      toast("Copia restaurada");
      render();
    } catch { toast("La copia tampoco se puede leer"); }
  }

  let state = load();
  let view = ["dashboard","schedule","exams","tasks","timer","review","achievements"].includes(state.settings.startView) ? state.settings.startView : "dashboard";
  let calendarCursor = new Date(); calendarCursor.setDate(1);
  let noteId = null, notePreview = false, noteFilter = "all", noteQuery = "";
  let examTab = "lista", examFilter = "all", taskFilter = "pendientes";
  let cardFilter = "all", cardFlip = false, cardQueue = [];
  let subjectFocus = null, cmdOpen = false, cmdIndex = 0, cmdItems = [];
  let deferredInstall = null, wakeLock = null;
  let skinCat = "all";
  let schView = "week";
  let exDate = "";
  let schDay = weekdayMon0(new Date());
  let agendaFilter = "all";
  let onStep = 0;
  const undoStack = [];
  const unlockedNotes = new Set();
  // PIN local: sirve para que nadie cotillee la nota en el móvil, no es cifrado fuerte.
  function pinHash(s) {
    let h = 5381;
    const str = "aula-smr:" + String(s || "");
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
    return h.toString(36);
  }
  function checkPin(given) {
    const saved = state.settings.pin || "";
    if (!saved) return true;
    return saved === given || pinHash(saved) === pinHash(given);
  }

  const timer = {
    mode: "work", running: false,
    remaining: (state.settings.pomodoroWork || 25) * 60,
    total: (state.settings.pomodoroWork || 25) * 60,
    subjectId: "", cycles: 0, tick: null,
  };

  function applyTheme() {
    const id = state.settings.skin || "hub";
    document.documentElement.setAttribute("data-skin", id);
    let theme = state.settings.uiTheme;
    if (theme !== "light" && theme !== "dark") theme = LIGHT.has(id) ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#000000" : "#f9fafb";
    const ico = $("#theme-icon");
    if (ico) {
      ico.innerHTML = theme === "dark"
        ? '<path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5Z"/>'
        : '<circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/>';
    }
    const st = state.settings;
    document.documentElement.dataset.uiSize = st.uiSize || "md";
    document.documentElement.dataset.compact = st.compact ? "1" : "0";
    document.documentElement.dataset.reduceMotion = st.reduceMotion ? "1" : "0";
    document.body.classList.toggle("hide-att", st.showAttendance === false);
    if (st.autoTheme) {
      const h = new Date().getHours();
      const dark = h < 8 || h >= 21;
      if (dark && LIGHT.has(id)) {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    }
    if (st.guest) document.body.classList.add("guest-mode");
    else document.body.classList.remove("guest-mode");
  }

  function toast(msg) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    $("#toast-root").appendChild(el);
    setTimeout(() => el.remove(), 2600);
  }

  let focoPrevio = null;
  function closeModal() {
    $("#modal-root").innerHTML = "";
    $("#overlay").hidden = true;
    // El foco vuelve a donde estaba: sin esto, el teclado se queda perdido
    if (focoPrevio && document.contains(focoPrevio)) { try { focoPrevio.focus(); } catch {} }
    focoPrevio = null;
  }
  function openModal(title, bodyHTML, { confirm = "Guardar", onSubmit, danger = false } = {}) {
    if (!focoPrevio) focoPrevio = document.activeElement;
    $("#overlay").hidden = false;
    $("#modal-root").innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <h2>${esc(title)}</h2>
        <form id="modal-form">${bodyHTML}
          <div class="modal-actions">
            <button type="button" class="btn" data-action="close-modal">Cancelar</button>
            <button type="submit" class="btn ${danger ? "btn-danger" : "btn-primary"}">${esc(confirm)}</button>
          </div>
        </form>
      </div>`;
    const form = $("#modal-form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      $$("input[type=checkbox]", form).forEach((c) => { data[c.name] = c.checked; });
      if (onSubmit) onSubmit(data);
    });
    setTimeout(() => form.querySelector("input,select,textarea,button")?.focus(), 20);
  }
  function ask(title, msg, onYes) {
    openModal(title, `<p>${esc(msg)}</p>`, { confirm: "Sí", danger: true, onSubmit() { closeModal(); onYes(); } });
  }
  function subjectOptions(selected) {
    return `<option value="">—</option>` + state.subjects.map((s) =>
      `<option value="${s.id}" ${s.id === selected ? "selected" : ""}>${esc(s.name)}</option>`).join("");
  }

  function weekRange() {
    const now = new Date();
    const mon = new Date(now);
    mon.setDate(now.getDate() - weekdayMon0(now)); mon.setHours(0, 0, 0, 0);
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6);
    return { from: localISO(mon), to: localISO(sun) };
  }
  function streak() {
    const set = new Set(state.sessions.filter((s) => s.minutes > 0).map((s) => s.date));
    let n = 0; const d = new Date(); d.setHours(0, 0, 0, 0);
    if (!set.has(localISO(d))) d.setDate(d.getDate() - 1);
    while (set.has(localISO(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }
  function studiedFor(sid, until) {
    return state.sessions.filter((s) => s.subjectId === sid && (!until || s.date <= until)).reduce((a, b) => a + b.minutes, 0);
  }
  function dueCards() { const t = todayISO(); return state.cards.filter((c) => !c.due || c.due <= t); }
  function nextExam() {
    return [...state.exams].filter((e) => e.status !== "hecho" && daysUntil(e.date) >= 0)
      .sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")))[0];
  }
  function nextClass() {
    if (isNonTeaching(todayISO())) return null;
    const now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
    return eventsOnDate(todayISO()).find((e) => minutesOf(e.end) > mins) || null;
  }
  const WIDGET_CATALOG = [
    { id: "clase", name: "Próxima clase", size: "2×2", hint: "En curso o la siguiente" },
    { id: "examen", name: "Próximo examen", size: "2×2", hint: "La fecha más cercana" },
    { id: "hoy", name: "Hoy", size: "4×2", hint: "Clase y examen juntos" },
    { id: "horario", name: "Horario de hoy", size: "4×2", hint: "Tres bloques del día" },
    { id: "examenes", name: "Exámenes", size: "4×2", hint: "Los tres más próximos" },
    { id: "tareas", name: "Tareas", size: "4×2", hint: "Pendientes de entrega" },
    { id: "media", name: "Nota media", size: "2×2", hint: "Media ponderada" },
    { id: "racha", name: "Racha", size: "2×2", hint: "Días seguidos" },
    { id: "estudio", name: "Estudio hoy", size: "2×2", hint: "Minutos de hoy" },
    { id: "semana", name: "Estudio semana", size: "2×2", hint: "Minutos de la semana" },
    { id: "xp", name: "Nivel / XP", size: "2×2", hint: "Nivel y experiencia" },
    { id: "fichas", name: "Fichas", size: "2×2", hint: "Repaso de hoy" },
    { id: "pendientes", name: "Pendientes", size: "2×2", hint: "Tareas sin hacer" },
    { id: "atrasadas", name: "Atrasadas", size: "2×2", hint: "Fuera de plazo" },
    { id: "asistencia", name: "Asistencia", size: "2×2", hint: "Presente / retraso / falta" },
    { id: "curso", name: "Días de curso", size: "2×2", hint: "Hasta el inicio o el fin" },
    { id: "bandeja", name: "Bandeja", size: "2×2", hint: "Capturas rápidas" },
    { id: "foco", name: "Módulo a estudiar", size: "2×2", hint: "En qué concentrarte" },
    { id: "festivo", name: "Hoy / festivo", size: "2×2", hint: "Si hay clase o no" },
    { id: "hint", name: "Qué estudiar", size: "2×2", hint: "Consejo del día" },
    { id: "mini_clase", name: "Mini clase", size: "2×1", hint: "Tira compacta" },
    { id: "mini_examen", name: "Mini examen", size: "2×1", hint: "Tira compacta" },
    { id: "mini_racha", name: "Mini racha", size: "2×1", hint: "Tira compacta" },
    { id: "duo", name: "Clase | Examen", size: "4×1", hint: "Dos columnas" },
  ];
  function widgetPayload() {
    const lb = liveBlock();
    const nx = nextExam();
    let clase = { kicker: "HORARIO", title: "Sin más clases hoy", sub: "" };
    if (lb.active) {
      const e = lb.active.ev;
      clase = { kicker: "EN CURSO", title: subjectName(e.subjectId), sub: e.start + " – " + e.end + (e.room ? " · " + e.room : "") };
    } else if (lb.next) {
      const e = lb.next.ev;
      clase = { kicker: "PRÓXIMA CLASE", title: subjectName(e.subjectId), sub: e.start + " – " + e.end + (e.room ? " · " + e.room : "") };
    } else if (lb.holiday) {
      clase = { kicker: "FESTIVO", title: lb.holiday, sub: "Sin clases" };
    } else if (lb.weekend) {
      clase = { kicker: "HORARIO", title: "Fin de semana", sub: "Sin clases" };
    }
    let exam = { kicker: "EXAMEN", title: "Sin exámenes cerca", sub: "" };
    if (nx) {
      const d = daysUntil(nx.date);
      const when = d === 0 ? "hoy" : d === 1 ? "mañana" : "en " + d + " días";
      exam = { kicker: "PRÓXIMO EXAMEN", title: nx.title, sub: when + (nx.time ? " · " + nx.time : "") };
    }
    const gpa = weightedGPA();
    const pending = state.tasks.filter((t) => !t.done).length;
    const overdue = overdueTasks();
    const today = todayISO();
    const dow = weekdayMon0(new Date());
    const hol = holidayName(today);
    const todayClasses = hol ? [] : eventsOnDate(today);
    const horarioRows = todayClasses.slice(0, 3).map((e) => ({
      t: e.start + "  " + subjectName(e.subjectId),
      s: e.end + (e.room ? " · " + e.room : ""),
    }));
    if (!horarioRows.length) horarioRows.push({ t: hol || (dow > 4 ? "Fin de semana" : "Sin clases"), s: "" });
    const examRows = [...state.exams].filter((e) => e.status !== "hecho" && daysUntil(e.date) >= 0)
      .sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")))
      .slice(0, 3)
      .map((e) => {
        const d = daysUntil(e.date);
        const when = d === 0 ? "hoy" : d === 1 ? "mañana" : "en " + d + " días";
        return { t: e.title, s: when + (e.time ? " · " + e.time : "") };
      });
    if (!examRows.length) examRows.push({ t: "Sin exámenes cerca", s: "" });
    const taskRows = state.tasks.filter((t) => !t.done)
      .sort((a, b) => (a.due || "9999").localeCompare(b.due || "9999"))
      .slice(0, 3)
      .map((t) => ({ t: t.title, s: fmtDue(t.due) }));
    if (!taskRows.length) taskRows.push({ t: "Todo al día", s: "" });
    const todayMins = state.sessions.filter((s) => s.date === today).reduce((a, b) => a + (b.minutes || 0), 0);
    const wr = weekRange();
    const weekMins = state.sessions.filter((s) => s.date >= wr.from && s.date <= wr.to).reduce((a, b) => a + (b.minutes || 0), 0);
    const lv = levelInfo();
    const dueN = dueCards().length;
    const att = attStats();
    const startD = state.settings.startDate ? daysUntil(state.settings.startDate) : null;
    const endD = state.settings.endDate ? daysUntil(state.settings.endDate) : null;
    let cursoNum = "—", cursoSub = "curso";
    if (startD != null && startD > 0) { cursoNum = String(startD); cursoSub = startD === 1 ? "día para empezar" : "días para empezar"; }
    else if (endD != null && endD > 0) { cursoNum = String(endD); cursoSub = endD === 1 ? "día hasta el fin" : "días hasta el fin"; }
    else if (endD != null && endD <= 0) { cursoNum = "0"; cursoSub = "curso cerrado"; }
    const inboxN = (state.inbox || []).length;
    let foco = { kicker: "FOCO", title: "Abre Aula SMR", sub: "Elige un módulo" };
    if (nx) foco = { kicker: "ESTUDIAR", title: subjectName(nx.subjectId), sub: nx.title };
    else if (lb.active) foco = { kicker: "EN CURSO", title: subjectName(lb.active.ev.subjectId), sub: "Clase ahora" };
    else if (lb.next) foco = { kicker: "SIGUE", title: subjectName(lb.next.ev.subjectId), sub: "Próxima clase" };
    let festivo;
    if (hol) festivo = { kicker: "FESTIVO", title: hol, sub: "Sin clases" };
    else if (dow > 4) festivo = { kicker: "HOY", title: "Fin de semana", sub: "Sin clases" };
    else festivo = { kicker: "HOY", title: DAYS[dow] || "Hoy", sub: todayClasses.length ? (todayClasses.length + (todayClasses.length === 1 ? " clase" : " clases")) : "Sin clases" };
    const hintRaw = (window.AulaStudio && window.AulaStudio.todayStudyHint && window.AulaStudio.todayStudyHint())
      || "15 min de fichas o el módulo del próximo examen";
    const hint = { kicker: "CONSEJO", title: String(hintRaw).slice(0, 90), sub: "Qué estudiar" };
    const gpaNum = gpa == null ? null : Number(gpa.toFixed(2));
    return {
      clase, exam, pending, gpa: gpaNum,
      horario: { kicker: "HORARIO HOY", rows: horarioRows },
      examenes: { kicker: "EXÁMENES", rows: examRows },
      tareas: { kicker: "TAREAS", rows: taskRows },
      media: { kicker: "MEDIA", num: gpa == null ? "—" : gpa.toFixed(1), sub: "ponderada" },
      racha: { kicker: "RACHA", num: String(streak()), sub: streak() === 1 ? "día" : "días" },
      estudio: { kicker: "HOY", num: fmtHours(todayMins), sub: "estudio" },
      semana: { kicker: "SEMANA", num: fmtHours(weekMins), sub: "estudio" },
      xp: { kicker: "NIVEL " + lv.level, num: String(lv.xp), sub: lv.title },
      fichas: { kicker: "FICHAS", num: String(dueN), sub: dueN === 1 ? "para hoy" : "para hoy" },
      pendientes: { kicker: "PENDIENTES", num: String(pending), sub: pending === 1 ? "tarea" : "tareas" },
      atrasadas: { kicker: "ATRASADAS", num: String(overdue.length), sub: "sin entregar" },
      asistencia: { kicker: "ASISTENCIA", num: att.pct == null ? "—" : att.pct + "%", sub: att.t ? (att.p + "P · " + att.r + "R · " + att.f + "F") : "sin pases" },
      curso: { kicker: "CURSO", num: cursoNum, sub: cursoSub },
      bandeja: { kicker: "BANDEJA", num: String(inboxN), sub: inboxN ? "capturas" : "vacía" },
      foco, festivo, hint,
      mini_clase: { kicker: clase.kicker, num: clase.title },
      mini_examen: { kicker: "EXAMEN", num: exam.title },
      mini_racha: { kicker: "RACHA", num: String(streak()) },
      duo: { lk: "CLASE", lt: clase.title, rk: "EXAMEN", rt: exam.title },
    };
  }
  function pushWidgets() {
    try {
      const C = window.Capacitor;
      const p = C && C.Plugins && C.Plugins.AulaWidget;
      if (!p || typeof p.update !== "function") return;
      p.update(widgetPayload());
    } catch {}
  }
  function pinWidget(id) {
    const C = window.Capacitor;
    const p = C && C.Plugins && C.Plugins.AulaWidget;
    if (!p || typeof p.pin !== "function") {
      toast("Mantén pulsado el escritorio → Widgets → Aula SMR");
      return;
    }
    pushWidgets();
    p.pin({ id: id || "hoy" }).then(() => toast("Elige el sitio en el escritorio")).catch(() => {
      toast("Mantén pulsado el escritorio → Widgets → Aula SMR");
    });
  }
  function attStatus(eventId, date) {
    const row = (state.attendance || []).find((a) => a.eventId === eventId && a.date === date);
    return row ? row.status : "";
  }
  function setAttendance(eventId, date, status) {
    state.attendance = state.attendance || [];
    const i = state.attendance.findIndex((a) => a.eventId === eventId && a.date === date);
    if (i >= 0 && state.attendance[i].status === status) {
      // Volver a tocar el mismo estado equivale a "quitar la marca": se pregunta
      const nombre = status === "presente" ? "presente" : status === "retraso" ? "con retraso" : "con falta";
      openModal("Quitar la marca", `<p>Vas a quitar la marca de <b>${esc(nombre)}</b> de esta clase. No pasa nada, se puede volver a poner.</p>`, {
        confirm: "Quitar marca", danger: true,
        onSubmit() {
          state.attendance.splice(i, 1);
          closeModal(); save(); render(); toast("Marca quitada");
        },
      });
      return;
    }
    if (i >= 0) state.attendance[i].status = status;
    else state.attendance.push({ id: uid(), eventId, date, status });
    if (status === "presente") grantXP(3, "Asistencia");
    checkAchievements(); render();
  }

  const titles = {
    dashboard: ["Inicio", "Tu ciclo SMR, a mano"],
    schedule: ["Horario", "Taller, redes y aulas"],
    exams: ["Exámenes", "Parciales, prácticas y entregas"],
    cards: ["Fichas", "IP, OSI, Linux…"],
    tasks: ["Tareas", "Prácticas y deberes"],
    timer: ["Estudio", "Bloques pomodoro"],
    stats: ["Gráficos", "Tiempo y notas"],
    plan: ["Plan de estudio", "Hasta cada fecha"],
    subjects: ["Módulos", "Los módulos de SMR"],
    subject: ["Módulo", ""],
    settings: ["Ajustes", "Perfil, estudio, avisos y datos"],
    inbox: ["Bandeja", "Capturas rápidas"],
    review: ["Repaso", "Cómo va la semana"],
    achievements: ["Logros", "XP, niveles y medallas"],
    agenda: ["Agenda", "Día, semana y mes"],
    timeline: ["Cuatrimestre", "Fechas clave tipo Gantt"],
    kanban: ["Tablero", "Pendiente / en curso / hecho"],
    chatbot: ["Asistente", "Tus apuntes y tu calendario"],
    simulator: ["Simulador", "Qué necesitas en el final"],
    habits: ["Hábitos", "Repaso diario"],
    glossary: ["Glosario", "Términos del ciclo"],
    trash: ["Papelera", "Recuperar apuntes"],
    examode: ["Modo examen", "Sin distracciones"],
    quickreview: ["Repaso rápido", "Antes del examen"],
    admin: ["Servidor", "Backups y estado"],
    guide: ["Guía docente", "Importar fechas y pesos"],
    rendimiento: ["Calificaciones", "Boletín de cada módulo"],
    notes: ["Apuntes", "Texto del ciclo"],
    tools: ["Herramientas SMR", "Hub técnico, estudio y sistema"],
  };

  function bannersHTML() {
    const out = [];
    if (loadProblem) {
      out.push(`<div class="save-warn"><span><b>Ojo:</b> ${esc(loadProblem)}</span>
        <button class="btn btn-sm" data-action="restore-backup">Recuperar copia</button>
        <button class="btn btn-sm btn-primary" data-action="dismiss-load-problem">Entendido</button></div>`);
    }
    if (saveProblem) {
      out.push(`<div class="save-warn"><span><b>No se puede guardar.</b> ${esc(saveProblem)}</span>
        <button class="btn btn-sm btn-primary" data-action="export">Exportar copia</button></div>`);
    }
    if (state.settings && state.settings.guest) {
      out.push(`<div class="save-warn" style="background:color-mix(in srgb, #f59e0b 18%, var(--surface));border-color:color-mix(in srgb, #f59e0b 45%, var(--line))">
        <span><b>Modo invitado.</b> Nada de lo que hagas se guarda al cerrar.</span>
        <button class="btn btn-sm btn-primary" data-action="guest-off">Guardar y salir</button></div>`);
    }
    return out.join("");
  }

  function render() {
    applyTheme();
    const bc = $("#brand-course"); if (bc) bc.textContent = state.settings.courseName || "SMR";
    const t = titles[view] || titles.dashboard;
    const dateOpts = { weekday: "long", day: "numeric", month: "long" };
    const dateStr = new Date().toLocaleDateString("es-ES", dateOpts).replace(/^\w/, (c) => c.toUpperCase());
    if (view === "dashboard") {
      const hola = greeting();
      $("#view-title").textContent = state.settings.name ? (hola + ", " + state.settings.name) : hola;
      $("#view-sub").textContent = dateStr;
    } else if (view === "subject") {
      $("#view-title").textContent = subjectById(subjectFocus)?.name || "Módulo";
      $("#view-sub").textContent = subjectById(subjectFocus)?.teacher || "";
    } else {
      $("#view-title").textContent = t[0];
      $("#view-sub").textContent = t[1];
    }
    const av = $("#header-avatar");
    if (av) av.innerHTML = avatarInner();
    $$(".nav-item").forEach((b) => b.classList.toggle("is-active", b.dataset.view === view));
    $$("#bottom-nav button").forEach((b) => {
      const on = b.dataset.view === view;
      b.classList.toggle("is-active", on);
      if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    const sheet = $("#more-sheet");
    if (sheet) $$("[data-view]", sheet).forEach((b) => {
      const on = b.dataset.view === view;
      if (on) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    const pending = state.tasks.filter((x) => !x.done).length;
    const dueN = dueCards().length;
    const badge = $("#nav-task-badge");
    if (badge) {
      const soon = state.exams.filter((e) => daysUntil(e.date) >= 0 && e.status !== "hecho").length;
      badge.hidden = soon <= 0;
      badge.textContent = "";
    }
    const setCount = (id, n) => { const el = $(id); if (!el) return; el.textContent = n || ""; el.dataset.empty = n ? "0" : "1"; };
    setCount("#exam-count", state.exams.filter((e) => daysUntil(e.date) >= 0 && e.status !== "hecho").length);
    setCount("#task-count", state.tasks.filter((x) => !x.done).length);
    setCount("#card-count", dueCards().length);
    setCount("#inbox-count", (state.inbox || []).length);
    const bn = $("#bn-exam");
    if (bn) {
      const n = state.exams.filter((e) => daysUntil(e.date) >= 0 && daysUntil(e.date) <= 3 && e.status !== "hecho").length;
      bn.textContent = n || "";
      bn.classList.toggle("on", !!n);
    }
    const labels = { dashboard: "Captura", schedule: "Clase", exams: "Examen", notes: "Nota", cards: "Ficha", tasks: "Tarea", timer: "Sesión", stats: "Nuevo", plan: "Plan", subjects: "Módulo", subject: "Nuevo", settings: "Nuevo", inbox: "Captura", review: "Repaso", achievements: "Logro" };
    $("#fab-label").textContent = labels[view] || "Nuevo";
    if (!state.settings.onboarded) {
      document.body.classList.add("onboarding");
      $("#view-title").textContent = "Configurar";
      $("#view-sub").textContent = "Paso " + (onStep + 1) + " de 7";
      $("#view").innerHTML = renderOnboard();
      updateTimerChrome();
      scheduleSave();
      return;
    }
    document.body.classList.remove("onboarding");
    const S = (name) => (window.AulaStudio && window.AulaStudio[name]) ? window.AulaStudio[name]() : `<div class="empty">Módulo no cargado.</div>`;
    const map = {
      dashboard: renderDashboard, schedule: renderSchedule, exams: renderExams, notes: renderNotes,
      cards: renderCards, tasks: renderTasks, timer: renderTimer, stats: renderStats, plan: renderPlan,
      subjects: renderSubjects, subject: renderSubject, settings: renderSettings, inbox: renderInbox, review: renderReview, achievements: renderAchievements,
      agenda: () => S("agenda"), timeline: () => S("timeline"), kanban: () => S("kanban"), chatbot: () => S("chatbot"),
      simulator: () => S("simulator"), habits: () => S("habits"), glossary: () => S("glossary"), trash: () => S("trash"),
      examode: () => S("examode"), quickreview: () => S("quickreview"), admin: () => S("admin"), guide: () => S("guide"),
      rendimiento: renderRendimiento,
      tools: () => (window.AulaTools && typeof window.AulaTools.view === "function")
        ? window.AulaTools.view()
        : `<div class="empty"><b>Herramientas</b>Recarga la página.</div>`,
    };
    $("#view").innerHTML = bannersHTML() + (map[view] || renderDashboard)();
    if (view === "stats") drawStats();
    if (view === "timer") updateTimerUI();
    if (view === "rendimiento") {
      const t = $("#sim-target"); if (t) t.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (view === "schedule" && schView === "week") {
      const el = $("#sch-day-" + weekdayMon0(new Date()));
      if (el) setTimeout(() => { try { el.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch {} }, 50);
    }
    updateTimerChrome();
    scheduleSave();
    if (view === "settings" && mediaOk()) {
      Media().usage().then((u) => {
        if (u && (u.n !== mediaInfo.n || u.bytes !== mediaInfo.bytes)) { mediaInfo = u; render(); }
      }).catch(() => {});
    }
  }

  function greeting() {
    const h = new Date().getHours();
    const skin = state.settings.skin || "hub";
    if (skin === "ciberseg" || skin === "terminal" || skin === "soc") return "Sesión iniciada";
    if (skin === "redteam") return "Acceso autorizado";
    if (skin === "shonen") return "Hora de entrenar";
    if (h < 12) return "Buenos días";
    if (h < 20) return "Buenas tardes";
    return "Buenas noches";
  }
  function ensureProgress() {
    if (!state.progress) state.progress = { bonusXp: 0, unlocked: {}, daily: "", log: [] };
    state.progress.unlocked = state.progress.unlocked || {};
    state.progress.log = state.progress.log || [];
    state.progress.bonusXp = Number(state.progress.bonusXp) || 0;
  }
  function studyMinutes() {
    return state.sessions.reduce((a, s) => a + (Number(s.minutes) || 0), 0);
  }
  function totalXP() {
    ensureProgress();
    return studyMinutes() + state.progress.bonusXp;
  }
  function rankTitle(lv) {
    if (lv >= 15) return "Leyenda del ciclo";
    if (lv >= 12) return "Referente";
    if (lv >= 9) return "Maestro";
    if (lv >= 7) return "Experto";
    if (lv >= 5) return "Especialista";
    if (lv >= 4) return "Oficial";
    if (lv >= 3) return "Técnico";
    if (lv >= 2) return "Técnico junior";
    return "Aprendiz";
  }
  function levelInfo() {
    let xp = totalXP(), lv = 1, need = 80, spent = 0;
    while (xp >= spent + need && lv < 40) {
      spent += need;
      lv += 1;
      need = Math.round(70 + lv * 32 + lv * lv * 3);
    }
    return { xp, level: lv, into: xp - spent, need, title: rankTitle(lv) };
  }
  // Nivel para un XP concreto; sin argumento, el nivel actual.
  function levelOf(xp) {
    if (xp == null || xp === "" || Number.isNaN(Number(xp))) return levelInfo().level;
    let restante = Math.max(0, Number(xp)), lv = 1, need = 80, gastado = 0;
    while (restante >= gastado + need && lv < 40) { gastado += need; lv += 1; need = Math.round(70 + lv * 32 + lv * lv * 3); }
    return lv;
  }
  const ACH_CATS = [
    { id: "estudio", name: "Estudio" },
    { id: "constancia", name: "Constancia" },
    { id: "organizacion", name: "Organización" },
    { id: "evaluacion", name: "Evaluación" },
    { id: "exploracion", name: "Exploración" },
  ];
  function pomodoros() { return state.sessions.filter((s) => s.type === "pomodoro").length; }
  function ACHIEVEMENTS() {
    const mins = studyMinutes();
    const st = streak();
    const tasksDone = state.tasks.filter((x) => x.done).length;
    const cardsRep = state.cards.filter((c) => (c.reps || 0) > 0).length;
    const cardsMany = state.cards.reduce((a, c) => a + (c.reps || 0), 0);
    const examsMade = state.exams.length;
    const examsDone = state.exams.filter((e) => e.status === "hecho" || e.grade !== "").length;
    const notesN = state.notes.length;
    const attP = (state.attendance || []).filter((a) => a.status === "presente").length;
    const subjectsStudied = new Set(state.sessions.map((s) => s.subjectId)).size;
    // Hora de creación de cada sesión: permite saber si estudias de madrugada
    const early = state.sessions.some((s) => {
      const h = Number(s.hour);
      if (Number.isFinite(h)) return h >= 6 && h < 8;
      const c = Number(s.createdAt);
      return Number.isFinite(c) && new Date(c).getHours() >= 6 && new Date(c).getHours() < 8;
    });
    const weekend = state.sessions.some((s) => {
      const d = new Date(s.date + "T12:00:00");
      return d.getDay() === 0 || d.getDay() === 6;
    });
    const wr = weekRange();
    const weekDays = new Set(state.sessions.filter((s) => s.date >= wr.from && s.date <= wr.to && s.minutes > 0).map((s) => s.date));
    const goalDays = Number(state.settings.weekGoalDays) || 5;
    const notable = state.exams.some((e) => Number(e.grade) >= 7);
    const excel = state.exams.some((e) => Number(e.grade) >= 9);
    const inbox0 = (state.inbox || []).length === 0 && notesN + tasksDone > 0;
    return [
      { id: "first_session", cat: "estudio", ico: "▶", name: "Primera sesión", desc: "Arranca el temporizador o registra minutos.", xp: 15, on: mins > 0 },
      { id: "h1", cat: "estudio", ico: "1h", name: "Calentamiento", desc: "Acumula 1 hora de estudio.", xp: 20, on: mins >= 60 },
      { id: "h5", cat: "estudio", ico: "5h", name: "En racha técnica", desc: "5 horas estudiadas en total.", xp: 35, on: mins >= 300 },
      { id: "h10", cat: "estudio", ico: "10h", name: "Diez horas netas", desc: "10 horas de estudio real.", xp: 50, on: mins >= 600 },
      { id: "h25", cat: "estudio", ico: "25h", name: "Cuarto de maratón", desc: "25 horas. Eso ya es oficio.", xp: 80, on: mins >= 1500 },
      { id: "h50", cat: "estudio", ico: "50h", name: "Medio centenar", desc: "50 horas de estudio.", xp: 120, on: mins >= 3000 },
      { id: "pomo10", cat: "estudio", ico: "⏱", name: "Diez bloques", desc: "Completa 10 pomodoros.", xp: 25, on: pomodoros() >= 10 },
      { id: "pomo40", cat: "estudio", ico: "🔥", name: "Máquina de bloques", desc: "40 pomodoros terminados.", xp: 60, on: pomodoros() >= 40 },
      { id: "all_mod", cat: "estudio", ico: "▣", name: "Todos los módulos", desc: "Estudia al menos un minuto de cada módulo.", xp: 40, on: state.subjects.length >= 3 && subjectsStudied >= state.subjects.length },
      { id: "weekend", cat: "estudio", ico: "☀", name: "Fin de semana útil", desc: "Estudia un sábado o domingo.", xp: 20, on: weekend },
      { id: "streak3", cat: "constancia", ico: "3", name: "Tres días seguidos", desc: "Racha de 3 días con estudio.", xp: 20, on: st >= 3 },
      { id: "streak7", cat: "constancia", ico: "7", name: "Semana cerrada", desc: "Racha de 7 días.", xp: 45, on: st >= 7 },
      { id: "streak14", cat: "constancia", ico: "14", name: "Quincena de hierro", desc: "Racha de 14 días.", xp: 80, on: st >= 14 },
      { id: "streak30", cat: "constancia", ico: "30", name: "Mes en el taller", desc: "Racha de 30 días.", xp: 150, on: st >= 30 },
      { id: "week_goal", cat: "constancia", ico: "✓", name: "Semana objetivo", desc: "Estudia todos los días de tu meta semanal.", xp: 40, on: weekDays.size >= goalDays },
      { id: "task1", cat: "organizacion", ico: "☐", name: "Primera tarea", desc: "Marca una tarea como hecha.", xp: 10, on: tasksDone >= 1 },
      { id: "task10", cat: "organizacion", ico: "10", name: "Lista viva", desc: "Completa 10 tareas.", xp: 30, on: tasksDone >= 10 },
      { id: "task25", cat: "organizacion", ico: "25", name: "Cero pendientes", desc: "25 tareas hechas.", xp: 55, on: tasksDone >= 25 },
      { id: "note1", cat: "organizacion", ico: "✎", name: "Primer apunte", desc: "Crea una nota.", xp: 10, on: notesN >= 1 },
      { id: "note10", cat: "organizacion", ico: "📓", name: "Cuaderno lleno", desc: "10 notas guardadas.", xp: 30, on: notesN >= 10 },
      { id: "inbox0", cat: "organizacion", ico: "∅", name: "Bandeja a cero", desc: "Vacía la bandeja habiendo usado la app.", xp: 15, on: inbox0 },
      { id: "att10", cat: "organizacion", ico: "P", name: "Asistencia seria", desc: "10 pases de lista en presente.", xp: 20, on: attP >= 10 },
      { id: "card1", cat: "evaluacion", ico: "🃏", name: "Primera ficha", desc: "Repasa al menos una ficha.", xp: 10, on: cardsRep >= 1 },
      { id: "card20", cat: "evaluacion", ico: "20", name: "Mazo caliente", desc: "20 fichas distintas repasadas.", xp: 35, on: cardsRep >= 20 },
      { id: "reps50", cat: "evaluacion", ico: "50", name: "Memoria muscular", desc: "50 repasadas en total.", xp: 45, on: cardsMany >= 50 },
      { id: "exam3", cat: "evaluacion", ico: "📅", name: "Calendario listo", desc: "Añade 3 exámenes.", xp: 15, on: examsMade >= 3 },
      { id: "exam_done", cat: "evaluacion", ico: "★", name: "Primer combate", desc: "Marca un examen como hecho o pon nota.", xp: 25, on: examsDone >= 1 },
      { id: "exam5", cat: "evaluacion", ico: "5", name: "Convocatorias", desc: "5 exámenes cerrados.", xp: 50, on: examsDone >= 5 },
      { id: "notable", cat: "evaluacion", ico: "7", name: "Notable", desc: "Saca un 7 o más.", xp: 30, on: notable },
      { id: "excelente", cat: "evaluacion", ico: "9", name: "Sobresaliente", desc: "Un 9 o más en el boletín.", xp: 60, on: excel },
      { id: "skin", cat: "exploracion", ico: "◐", name: "Cambio de look", desc: "Prueba un tema distinto al inicial.", xp: 10, on: (state.settings.skin || "hub") !== "hub" },
      { id: "export", cat: "exploracion", ico: "⤓", name: "Copia de seguridad", desc: "Exporta el JSON o el calendario.", xp: 15, on: !!state.progress.flags?.exported },
      { id: "plan", cat: "exploracion", ico: "🗺", name: "Plan pasado a tareas", desc: "Usa «pasar 7 días a tareas».", xp: 15, on: !!state.progress.flags?.planned },
      { id: "capture", cat: "exploracion", ico: "↓", name: "Captura rápida", desc: "Mete algo en la bandeja.", xp: 10, on: (state.inbox || []).length > 0 || !!state.progress.flags?.captured },
      { id: "lvl5", cat: "exploracion", ico: "Lv5", name: "Especialista", desc: "Alcanza el nivel 5.", xp: 40, on: levelOf() >= 5 },
      { id: "lvl10", cat: "exploracion", ico: "Lv10", name: "Referente", desc: "Nivel 10. Ya mandas en el ciclo.", xp: 90, on: levelOf() >= 10 },
    ];
  }
  function grantXP(n, reason) {
    ensureProgress();
    n = Math.round(Number(n) || 0);
    if (n <= 0) return;
    state.progress.bonusXp += n;
    state.progress.log.unshift({ t: Date.now(), n, reason: reason || "XP" });
    if (state.progress.log.length > 40) state.progress.log.length = 40;
  }
  function checkAchievements() {
    ensureProgress();
    const newly = [];
    for (let pass = 0; pass < 3; pass++) {
      ACHIEVEMENTS().forEach((a) => {
        if (state.progress.unlocked[a.id] || !a.on) return;
        state.progress.unlocked[a.id] = Date.now();
        state.progress.bonusXp += a.xp;
        state.progress.log.unshift({ t: Date.now(), n: a.xp, reason: "Logro · " + a.name });
        newly.push(a);
      });
    }
    if (!newly.length) return;
    if (newly.length === 1) toast("Logro: " + newly[0].name + "  +" + newly[0].xp + " XP");
    else toast(newly.length + " logros nuevos  +" + newly.reduce((s, a) => s + a.xp, 0) + " XP");
    if (newly.some((a) => a.xp >= 40)) confetti();
    save();
  }
  function dailyCheckIn() {
    ensureProgress();
    const d = todayISO();
    if (state.progress.daily === d) return;
    state.progress.daily = d;
    grantXP(8, "Check-in del día");
    const wk = weekRange().from;
    if (state.progress.lastFreezeWeek !== wk && (state.progress.freeze || 0) < 1) state.progress.freeze = 1;
    save();
  }
  function renderAchievements() {
    ensureProgress();
    const info = levelInfo();
    const all = ACHIEVEMENTS();
    const got = all.filter((a) => state.progress.unlocked[a.id] || a.on).length;
    const list = all.map((a) => ({ ...a, unlocked: !!(state.progress.unlocked[a.id] || a.on) }));
    const log = (state.progress.log || []).slice(0, 8);
    return `
      <div class="card ach-hero" style="margin-bottom:16px">
        <div>
          <div class="k" style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);font-weight:800">${esc(info.title)}</div>
          <div style="font-size:28px;font-weight:800;font-family:var(--display,var(--serif));margin:4px 0">Nivel ${info.level}</div>
          <div style="color:var(--muted);font-size:13.5px">${info.xp} XP totales · ${got}/${all.length} logros</div>
          <div class="xp-bar" style="margin-top:10px"><i style="width:${clamp((info.into / Math.max(info.need, 1)) * 100, 0, 100)}%"></i></div>
          <div style="font-size:12px;color:var(--muted);margin-top:6px">${info.into} / ${info.need} XP para el siguiente nivel</div>
        </div>
        <div class="ach-lvl">${info.level}</div>
      </div>
      <div class="card" style="margin-bottom:16px">
        <h3>Cómo se gana XP</h3>
        <p style="margin:0;color:var(--muted);font-size:13.5px;line-height:1.55">1 minuto de estudio = 1 XP. Además: tarea +15, ficha bien +8 / fácil +12, examen cerrado +40, nota +5, presente +3, check-in diario +8. Cada logro suma su bonus una sola vez.</p>
      </div>
      ${ACH_CATS.map((c) => {
        const items = list.filter((a) => a.cat === c.id);
        return `<h3 class="skin-section">${esc(c.name)}</h3>
          <div class="ach-grid">${items.map((a) => `<div class="ach-card ${a.unlocked ? "" : "lock"}">
            <div class="ach-ico">${a.ico}</div>
            <div style="flex:1;min-width:0"><b>${esc(a.name)}</b><small>${esc(a.desc)}</small></div>
            <div class="ach-xp">+${a.xp}</div>
          </div>`).join("")}</div>`;
      }).join("")}
      <div class="card" style="margin-top:16px">
        <h3>Últimos movimientos</h3>
        <div class="xp-log">${log.map((l) => `<div><span>${esc(l.reason)}</span><b>+${l.n}</b></div>`).join("") || `<div class="empty">Aún no hay bonus. Estudia o completa algo.</div>`}</div>
      </div>
    `;
  }
  function heatDays() {
    const out = [];
    const d = new Date(); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - 27);
    for (let i = 0; i < 28; i++) {
      const iso = localISO(d);
      const m = state.sessions.filter((s) => s.date === iso).reduce((a, b) => a + b.minutes, 0);
      const v = m === 0 ? 0 : m < 30 ? 1 : m < 60 ? 2 : m < 100 ? 3 : 4;
      out.push({ iso, v });
      d.setDate(d.getDate() + 1);
    }
    return out;
  }
  function skinCards(list) {
    return `<div class="skin-grid">${list.map((s) => `<button type="button" class="skin-card ${s.id === (state.settings.skin || "hub") ? "is-on" : ""}" data-action="set-skin" data-id="${s.id}">
      <div class="skin-swatch">${s.colors.map((c) => `<i style="background:${c}"></i>`).join("")}</div>
      <b>${esc(s.name)}</b><small>${esc(s.tag)}</small>
    </button>`).join("")}</div>`;
  }

  function collectOnboard() {
    const st = state.settings;
    if ($("#on-name")) st.name = $("#on-name").value.trim();
    if ($("#on-course")) st.courseName = $("#on-course").value.trim() || st.courseName;
    if ($("#on-center")) st.center = $("#on-center").value.trim();
    if ($("#on-group")) st.group = $("#on-group").value.trim();
    if ($("#on-start")) st.startDate = $("#on-start").value || st.startDate;
    if ($("#on-end")) st.endDate = $("#on-end").value || st.endDate;
    if ($("#on-goal")) st.dailyGoal = num("#on-goal", st.dailyGoal || 90);
    if ($("#on-work")) st.pomodoroWork = num("#on-work", 25);
    if ($("#on-break")) st.pomodoroBreak = num("#on-break", 5);
    const sat = on("#on-sat"); if (sat !== undefined) st.includeSaturday = sat;
  }
  function onDots(n) {
    return `<div class="on-dots">${Array.from({ length: 7 }, (_, i) => `<i class="${i === n ? "is-on" : ""}"></i>`).join("")}</div>`;
  }
  function renderOnboard() {
    const st = state.settings;
    // El asistente se puede terminar en cualquier momento: nadie debería pelear con 7 pantallas
    const foot = (back, nextLbl) => `<div class="on-nav">
      ${back ? `<button class="btn" data-action="on-back">Atrás</button>` : `<span></span>`}
      <span style="display:flex;gap:6px">
        ${onStep > 0 && onStep < 6 ? `<button class="btn" data-action="skip-onboard">Saltar</button>` : ""}
        <button class="btn btn-primary" data-action="on-next">${nextLbl || "Siguiente"}</button>
      </span>
    </div>`;
    if (onStep === 0) return `<div class="onboard-full">
      ${onDots(0)}
      <div class="on-hero">${avatarInner()}</div>
      <h2>Aula SMR</h2>
      <p>Tu ciclo de <b>2.º SMR</b> en el móvil: horario, exámenes, fichas y taller. Todo se queda aquí, sin cuenta ni nube.</p>
      ${foot(false, "Empezar")}
    </div>`;
    if (onStep === 1) return `<div class="onboard-full">
      ${onDots(1)}
      <h2>¿Cómo te llamas?</h2>
      <p>Así te saludamos en Inicio y sale en el avatar.</p>
      <div class="field"><label>Nombre</label><input id="on-name" placeholder="Tu nombre" value="${esc(st.name)}" /></div>
      <div class="field"><label>Icono de perfil</label>${avatarPicksHTML()}</div>
      ${foot(true)}
    </div>`;
    if (onStep === 2) return `<div class="onboard-full">
      ${onDots(2)}
      <h2>Tu ciclo</h2>
      <p>Centro, grupo y fechas del curso 2026/27.</p>
      <div class="field"><label>Ciclo</label><input id="on-course" value="${esc(st.courseName || "SMR 2º 2026/27")}"></div>
      <div class="form-row">
        <div class="field"><label>Centro</label><input id="on-center" value="${esc(st.center || "")}" placeholder="IES…"></div>
        <div class="field"><label>Grupo</label><input id="on-group" value="${esc(st.group || "")}" placeholder="A / B"></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Inicio</label><input id="on-start" type="date" value="${esc(st.startDate || "2026-09-08")}"></div>
        <div class="field"><label>Fin</label><input id="on-end" type="date" value="${esc(st.endDate || "2027-06-19")}"></div>
      </div>
      <label class="check"><input id="on-sat" type="checkbox" ${st.includeSaturday ? "checked" : ""}/> Incluir sábado en el horario</label>
      ${foot(true)}
    </div>`;
    if (onStep === 3) return `<div class="onboard-full">
      ${onDots(3)}
      <h2>Aspecto</h2>
      <p>Puedes cambiarlo luego con la luna / el sol.</p>
      <div class="on-choices">
        <button class="on-choice ${st.uiTheme !== "light" ? "is-on" : ""}" data-action="on-theme" data-id="dark">
          <b>Oscuro</b><small>Mejor de noche y en el taller</small>
        </button>
        <button class="on-choice ${st.uiTheme === "light" ? "is-on" : ""}" data-action="on-theme" data-id="light">
          <b>Claro</b><small>Más luz, tipo papel</small>
        </button>
      </div>
      ${foot(true)}
    </div>`;
    if (onStep === 4) return `<div class="onboard-full">
      ${onDots(4)}
      <h2>Tus datos</h2>
      <p>Elige cómo arrancar. Siempre puedes importar un JSON después.</p>
      <div class="on-choices">
        <button class="on-choice ${st.demo !== false && (state.subjects || []).length ? "is-on" : ""}" data-action="on-data" data-id="demo">
          <b>Ejemplo 2.º SMR</b><small>Horario, parciales, fichas y apuntes de muestra. Los editas.</small>
        </button>
        <button class="on-choice ${st.demo === false ? "is-on" : ""}" data-action="on-data" data-id="empty">
          <b>Empezar de cero</b><small>Sin clases ni exámenes. Tú creas los módulos.</small>
        </button>
        <button class="on-choice" data-action="on-import">
          <b>Traer una copia JSON</b><small>Si exportaste Aula SMR en otro móvil.</small>
        </button>
      </div>
      ${foot(true)}
    </div>`;
    if (onStep === 5) return `<div class="onboard-full">
      ${onDots(5)}
      <h2>Estudio</h2>
      <p>Meta diaria y bloques pomodoro. Se cambian en Ajustes.</p>
      <div class="field"><label>Meta diaria (minutos)</label><input id="on-goal" type="number" min="10" max="600" value="${st.dailyGoal || 90}"></div>
      <div class="on-chips">
        <button type="button" class="chip ${Number(st.dailyGoal) === 45 ? "is-on" : ""}" data-action="on-goal" data-id="45">45</button>
        <button type="button" class="chip ${Number(st.dailyGoal) === 90 ? "is-on" : ""}" data-action="on-goal" data-id="90">90</button>
        <button type="button" class="chip ${Number(st.dailyGoal) === 120 ? "is-on" : ""}" data-action="on-goal" data-id="120">120</button>
      </div>
      <div class="form-row">
        <div class="field"><label>Pomodoro</label><input id="on-work" type="number" min="1" max="180" value="${st.pomodoroWork || 25}"></div>
        <div class="field"><label>Descanso</label><input id="on-break" type="number" min="1" max="60" value="${st.pomodoroBreak || 5}"></div>
      </div>
      ${foot(true)}
    </div>`;
    if (onStep === 6) return `<div class="onboard-full">
      ${onDots(6)}
      <h2>Avisos</h2>
      <p>Locales, en este móvil: clase, examen, tareas y fichas. En Android hay que dar permiso.</p>
      <button class="btn ${st.notify ? "btn-primary" : ""}" type="button" data-action="enable-notify" style="width:100%;margin-bottom:12px">
        ${st.notify && typeof Notification !== "undefined" && Notification.permission === "granted" ? "Avisos activos" : "Activar avisos"}
      </button>
      ${chk("set-nclass", st.notifyClass !== false, "Clase (10 min antes)")}
      ${chk("set-nex", st.notifyExams !== false, "Exámenes")}
      ${chk("set-nta", st.notifyTasks !== false, "Tareas")}
      ${chk("set-nca", st.notifyCards !== false, "Fichas de repaso")}
      ${foot(true, "Listo")}
    </div>`;
    return `<div class="onboard-full">
      ${onDots(6)}
      <h2>Todo listo</h2>
      <p>Ya puedes usar Aula SMR. En Ajustes se cambia lo que quieras, y hay <b>Configurar de nuevo</b> si hace falta.</p>
      <button class="btn btn-primary" data-action="on-finish" style="width:100%">Entrar a Inicio</button>
    </div>`;
  }
  function renderDashboard() {
    const nx = nextExam();
    const today = todayISO();
    const todayMins = state.sessions.filter((x) => x.date === today).reduce((a, b) => a + b.minutes, 0);
    const pending = state.tasks.filter((t) => !t.done).length;
    const gpa = weightedGPA();
    const wr = weekRange();
    const mon = new Date(wr.from + "T00:00:00");
    const lb = liveBlock();
    const now = nowMinutes();
    let liveHtml = "";
    if (lb.active) {
      const a = lb.active;
      const pct = clamp(((now - a.startMins) / Math.max(a.endMins - a.startMins, 1)) * 100, 0, 100);
      liveHtml = `<div class="live-card">
        <div class="live-stack">
        <div class="live-top"><span class="live-badge"><span class="live-dot"></span>En curso</span>
          <span class="live-time">${a.ev.start} – ${a.ev.end}</span></div>
        <h2 class="live-title">${esc(subjectName(a.ev.subjectId) || a.ev.title || "Clase")}</h2>
        <p class="sub">${esc(a.ev.room || "Aula")} · Clase actual</p>
        <div class="live-bar"><i style="width:${pct}%"></i></div>
        <div class="live-foot"><span>Inició ${a.ev.start}</span><b id="live-remain">${a.endMins - now} min restantes</b></div>
        </div>
      </div>`;
    } else if (lb.next) {
      const n = lb.next;
      const mins = n.startMins - now;
      const wait = mins > 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins} min`;
      liveHtml = `<div class="live-card is-soon">
        <div class="live-stack">
        <div class="live-top"><span class="live-badge soon">Próxima</span>
          <span class="live-time">${n.ev.start} – ${n.ev.end}</span></div>
        <h2 class="live-title">${esc(subjectName(n.ev.subjectId) || n.ev.title || "Clase")}</h2>
        <p class="sub">${esc(n.ev.room || "Aula")} · Próxima clase</p>
        <div class="live-bar"><i style="width:0%"></i></div>
        <div class="live-foot"><span>Empieza a las ${n.ev.start}</span><b id="live-remain">En ${wait}</b></div>
        </div>
      </div>`;
    } else if (lb.holiday) {
      liveHtml = `<div class="idle-note">${esc(lb.holiday)} · sin clases</div>`;
    } else {
      liveHtml = `<div class="idle-note">${lb.weekend ? "Fin de semana · sin clases" : "No hay más clases por hoy"}</div>`;
    }
    const startD = state.settings.startDate ? daysUntil(state.settings.startDate) : null;
    const endD = state.settings.endDate ? daysUntil(state.settings.endDate) : null;
    let courseHtml = "";
    if (startD != null && startD > 0) {
      courseHtml = `<div class="course-soon">
        <span class="k">Empieza el curso</span>
        <b>${startD}</b>
        <span>día${startD === 1 ? "" : "s"} · ${fmtDate(state.settings.startDate)}</span>
      </div>`;
    } else if (endD != null && endD > 0) {
      courseHtml = `<div class="course-soon">
        <span class="k">Quedan de curso</span>
        <b>${endD}</b>
        <span>día${endD === 1 ? "" : "s"} · hasta ${fmtDate(state.settings.endDate)}</span>
      </div>`;
    }
    const todayClasses = lb.holiday ? [] : eventsOnDate(todayISO());
    const todayList = todayClasses.length ? `<div>
        <div class="sec-head"><h3>Hoy</h3><button data-action="go" data-to="schedule" class="linkish">Horario</button></div>
        <div class="today-list">${todayClasses.map((e) => {
          const stt = minutesOf(e.start), en = minutesOf(e.end);
          const done = now >= en, live = now >= stt && now < en;
          return `<button class="today-row ${live ? "is-live" : ""} ${done ? "is-done" : ""}" data-action="edit-event" data-id="${e.id}">
            <i style="background:${subjectColor(e.subjectId)}"></i>
            <span class="t">${e.start}</span>
            <span class="n">${esc(subjectName(e.subjectId))}</span>
            <span class="r">${esc(e.room || "")}</span>
          </button>`;
        }).join("")}</div>
      </div>` : "";
    const soonEx = [...state.exams].filter((e) => e.status !== "hecho" && daysUntil(e.date) >= 0)
      .sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || ""))).slice(0, 3);
    const soonHtml = soonEx.length ? `<div>
        <div class="sec-head"><h3>Próximos exámenes</h3><button data-action="go" data-to="exams" class="linkish">Ver</button></div>
        <div class="soon-list">${soonEx.map((e) => {
          const d = daysUntil(e.date);
          const when = d === 0 ? "hoy" : d === 1 ? "mañana" : d + " d";
          return `<button class="soon-row" data-action="edit-exam" data-id="${e.id}">
            <span class="d">${when}</span>
            <span class="n">${esc(e.title)}</span>
          </button>`;
        }).join("")}</div>
      </div>` : "";
    const examDays = nx ? daysUntil(nx.date) : null;
    const pills = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon); d.setDate(mon.getDate() + i);
      const iso = localISO(d);
      pills.push({ iso, n: d.getDate(), lbl: DAYS_SHORT[i], today: iso === today, exam: state.exams.some((e) => e.date === iso), hol: isNonTeaching(iso) });
    }
    return `
      ${state.settings.demo && state.settings.onboarded ? `<div class="card demo-banner">
        <div><strong>Datos de ejemplo</strong><div class="hint" style="margin:4px 0 0">Horario y exámenes de muestra. Quédatelo o bórralo.</div></div>
        <div class="hero-actions">
          <button class="btn btn-primary" data-action="keep-demo">Quedármelo</button>
          <button class="btn" data-action="clear-demo">Empezar de cero</button>
        </div>
      </div>` : ""}
      ${courseHtml}
      ${(startD != null && startD > 0) ? "" : liveHtml}
      ${todayList}
      ${state.settings.onboarded && typeof Notification !== "undefined" && Notification.permission !== "granted" ? `<div class="idle-note" style="display:flex;justify-content:space-between;align-items:center;gap:8px;text-align:left">
        <span>Activa avisos: clase, examen y tareas.</span>
        <button class="btn btn-sm btn-primary" data-action="enable-notify">Activar</button>
      </div>` : ""}
      ${state.settings.onboarded && !isStandalone() ? `<div class="idle-note" style="display:flex;justify-content:space-between;align-items:center;gap:8px;text-align:left">
        <span>Ponla en la pantalla de inicio como app.</span>
        <button class="btn btn-sm btn-primary" data-action="install-pwa">${deferredInstall ? "Instalar" : "Cómo"}</button>
      </div>` : ""}
      <div class="bento">
        <button class="bento-card" data-action="go" data-to="rendimiento">
          <div class="bento-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 3"/></svg></div>
          <div><div class="num">${gpa == null ? "—" : gpa.toFixed(1)}</div><div class="lbl">Nota media</div></div>
        </button>
        <button class="bento-card" data-action="go" data-to="timer">
          <div class="bento-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 3h6"/></svg></div>
          <div><div class="num">${todayMins}<span>m</span></div><div class="lbl">Estudio hoy</div></div>
        </button>
        <button class="bento-card" data-action="go" data-to="tasks">
          <div class="bento-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/></svg>
            ${pending ? '<span class="dot-alert"></span>' : ""}</div>
          <div><div class="num">${pending}</div><div class="lbl">Pendientes</div></div>
        </button>
        <button class="bento-card" data-action="go" data-to="exams">
          <div class="bento-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19V5M4 19h16"/><path d="M8 16v-5M12 16V8M16 16v-3"/></svg></div>
          <div><div class="num">${examDays == null ? "--" : examDays}<span>${examDays == null ? "" : "d"}</span></div><div class="lbl">Próx. examen</div></div>
        </button>
      </div>
      <div>
        <div class="sec-head"><h3>Tu semana</h3><button data-action="go" data-to="schedule" class="linkish">Ver todo</button></div>
        <div class="week-pills">${pills.map((d) => `<button class="week-pill ${d.today ? "is-today" : ""} ${d.exam ? "has-exam" : ""} ${d.hol ? "has-hol" : ""}" data-action="jump-day" data-date="${d.iso}">${d.lbl}<b>${d.n}</b></button>`).join("")}</div>
      </div>
      ${soonHtml}
      <div class="study-rec">
        <div class="k">Qué estudiar hoy</div>
        <p>${esc((window.AulaStudio && window.AulaStudio.todayStudyHint && window.AulaStudio.todayStudyHint()) || "Abre fichas 15 minutos o avanza el módulo con el examen más cerca.")}</p>
        <div class="hero-actions">
          <button class="btn btn-sm btn-primary" data-action="go" data-to="quickreview">Repaso rápido</button>
          <button class="btn btn-sm" data-action="go" data-to="cards">Fichas</button>
          <button class="btn btn-sm" data-action="freeze-use">Comodín (${(state.progress && state.progress.freeze) ?? 1})</button>
          ${streak() >= 1 ? `<button class="btn btn-sm" data-action="rollover-week">Semana nueva</button>` : ""}
        </div>
      </div>
    `;
  }

  // Huecos entre clases: se ofrece el rato libre para estudiar en vez de dejarlo vacío.
  function studyGapsHTML(day, list, todayIdx) {
    if (!list.length) return "";
    const sorted = [...list].sort((a, b) => minutesOf(a.start) - minutesOf(b.start));
    const ini = Number(state.settings.startHour || 8) * 60;
    const fin = Number(state.settings.endHour || 21) * 60;
    const gaps = [];
    let cursor = ini;
    sorted.forEach((e) => {
      const s = minutesOf(e.start), en = minutesOf(e.end);
      if (s - cursor >= 45) gaps.push([cursor, s]);
      cursor = Math.max(cursor, en);
    });
    if (fin - cursor >= 45) gaps.push([cursor, fin]);
    if (!gaps.length) return "";
    const hhmm = (m) => pad(Math.floor(m / 60)) + ":" + pad(m % 60);
    return gaps.slice(0, 3).map(([a, b]) => {
      const mins = b - a;
      return `<button type="button" class="class-row is-study" data-action="study-block" data-day="${day}" data-min="${mins}" data-start="${hhmm(a)}">
        <span class="class-stripe" style="--c:var(--accent)"></span>
        <div class="class-time">${hhmm(a)}<br>${hhmm(b)}</div>
        <div class="class-body"><b>Hueco libre · ${mins} min</b><small>${todayIdx === day ? "Estudia ahora" : "Rato libre"}</small></div>
      </button>`;
    }).join("");
  }
  function exLabel(x) {
    const ev = state.events.find((e) => e.id === x.eventId);
    const nombre = ev ? subjectName(ev.subjectId) : (x.note || "Clase");
    if (x.kind === "cancel") return `Sin ${nombre}${ev ? " (" + ev.start + ")" : ""}`;
    if (x.kind === "move") return `Movida: ${nombre} → ${x.start || (ev ? ev.start : "")}-${x.end || (ev ? ev.end : "")}`;
    if (x.kind === "extra") return `Extra: ${nombre} ${x.start || ""}-${x.end || ""}`;
    if (x.kind === "holiday") return `Festivo${x.note ? ": " + x.note : ""}`;
    return x.kind;
  }
  function renderExceptionsBlock() {
    const hoy = todayISO();
    const fecha = exDate || hoy;
    const dow = weekdayMon0(new Date(fecha + "T12:00:00"));
    const delDia = state.events.filter((e) => Number(e.day) === dow).sort((a, b) => a.start.localeCompare(b.start));
    const futuras = excepciones().filter((x) => x.date >= hoy).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8);
    const esFinde = dow > 4;
    return `
      <p class="tools-kicker">Cambios de un día suelto</p>
      <div class="card">
        <p class="hint" style="margin-top:0">El horario de arriba es el de la semana normal. Aquí se cambia un día concreto: no hay clase, se mueve, aparece una extra o es fiesta local.</p>
        <div class="form-row">
          <div class="field"><label for="ex-date">Día</label><input id="ex-date" type="date" value="${fecha}" /></div>
          <div class="field"><label for="ex-event">Clase de ese día</label>
            <select id="ex-event" ${delDia.length ? "" : "disabled"}>
              ${delDia.length ? delDia.map((e) => `<option value="${e.id}">${e.start} · ${esc(subjectName(e.subjectId))}</option>`).join("") : `<option value="">(ninguna ese día)</option>`}
            </select></div>
        </div>
        <div class="filters">
          <button class="btn btn-sm" data-action="ex-cancel" ${delDia.length ? "" : "disabled"}>Sin clase</button>
          <button class="btn btn-sm" data-action="ex-move" ${delDia.length ? "" : "disabled"}>Mover hora</button>
          <button class="btn btn-sm" data-action="ex-extra">Clase extra</button>
          <button class="btn btn-sm" data-action="ex-holiday">Es fiesta</button>
        </div>
        ${esFinde ? `<p class="hint">${fmtDateLong(fecha)} cae en fin de semana.</p>` : ""}
        ${futuras.length ? `<div style="margin-top:6px">
          ${futuras.map((x) => `<div class="row">
            <span class="dot" style="background:${x.kind === "holiday" ? "var(--muted)" : subjectColor((state.events.find((e) => e.id === x.eventId) || {}).subjectId)}"></span>
            <div style="flex:1"><b>${esc(fmtDate(x.date))}</b><small class="hint">${esc(exLabel(x))}</small></div>
            <button class="btn btn-sm" data-action="ex-del" data-id="${x.id}" aria-label="Quitar el cambio del ${esc(fmtDate(x.date))}">×</button>
          </div>`).join("")}
        </div>` : `<p class="hint" style="margin:8px 0 0">No hay cambios apuntados.</p>`}
      </div>`;
  }
  function classRowHTML(e, todayIdx) {
    const nowM = nowMinutes();
    const liveNow = todayIdx === e.day && minutesOf(e.start) <= nowM && nowM < minutesOf(e.end);
    const att = attStatus(e.id, todayISO());
    const showAtt = state.settings.showAttendance !== false && todayIdx === e.day;
    return `<div class="class-row ${liveNow ? "is-live" : ""}" data-action="edit-event" data-id="${e.id}">
      <span class="class-stripe" style="--c:${subjectColor(e.subjectId)}"></span>
      <div class="class-time">${e.start}<br>${e.end}</div>
      <div class="class-body"><b>${esc(subjectName(e.subjectId))}</b>
        <small>${esc(e.room || "")}${e.type ? " · " + esc(e.type) : ""}${liveNow ? " · ahora" : ""}</small>
        ${showAtt ? `<div class="att" role="group" aria-label="Asistencia">
          <button type="button" data-action="attend" data-id="${e.id}" data-st="presente" class="att-p ${att === "presente" ? "on" : ""}" title="Presente">Presente</button>
          <button type="button" data-action="attend" data-id="${e.id}" data-st="retraso" class="att-r ${att === "retraso" ? "on" : ""}" title="Retraso">Retraso</button>
          <button type="button" data-action="attend" data-id="${e.id}" data-st="falta" class="att-f ${att === "falta" ? "on" : ""}" title="Falta">Falta</button>
        </div>` : ""}
      </div>
    </div>`;
  }
  function renderSchedule() {
    const daysN = state.settings.includeSaturday ? 6 : 5;
    const todayIdx = weekdayMon0(new Date());
    if (schDay == null || schDay >= daysN) schDay = Math.min(Math.max(todayIdx, 0), daysN - 1);
    const weekHtml = `
      <div class="sec-head"><h3>Horario regular</h3>
        <span style="display:flex;gap:6px">
          <button class="btn btn-sm" data-action="csv-import">Importar CSV</button>
          <button class="hub-round" data-action="add-event" aria-label="Añadir clase">+</button>
        </span></div>
      <input type="file" id="csv-file" accept=".csv,.txt" hidden aria-label="Archivo CSV del horario" />
      <p class="hint sch-hint">Semana fija L–${daysN === 6 ? "S" : "V"}. Toca una clase para editarla.</p>
      ${state.settings.showAttendance !== false ? `<p class="att-legend">Hoy: <b>P</b> presente · <b>R</b> retraso · <b>F</b> falta</p>` : ""}
      <div class="week-board">
        ${DAYS.slice(0, daysN).map((d, i) => {
          const list = state.events.filter((e) => Number(e.day) === i).sort((a, b) => a.start.localeCompare(b.start));
          return `<section class="sch-day ${i === todayIdx ? "is-today" : ""}" id="sch-day-${i}">
            <div class="sch-day-h">
              <strong>${esc(d)}</strong>
              ${i === todayIdx ? `<span class="badge hot">hoy</span>` : ""}
              <span class="sch-n">${list.length ? list.length + (list.length === 1 ? " clase" : " clases") : "libre"}</span>
            </div>
            <div class="sch-day-list">
              ${list.length ? list.map((e) => classRowHTML(e, todayIdx)).join("") + studyGapsHTML(i, list, todayIdx) : `<div class="sch-empty">Sin clases</div>`}
            </div>
          </section>`;
        }).join("")}
      </div>`;
    const monthHtml = renderCalendar();
    return `
      <div class="hub-seg">
        <button data-action="sch-view" data-mode="week" class="${schView === "week" ? "is-on" : ""}">Semana</button>
        <button data-action="sch-view" data-mode="month" class="${schView === "month" ? "is-on" : ""}">Calendario</button>
      </div>
      ${schView === "month" ? monthHtml : weekHtml + renderExceptionsBlock()}
    `;
  }

  function renderExams() {
    const items = [...state.exams].sort((a, b) => a.date.localeCompare(b.date)).filter((e) => {
      if (examFilter === "all") return true;
      if (examFilter === "proximos") return daysUntil(e.date) >= 0 && e.status !== "hecho";
      if (examFilter === "hechos") return e.status === "hecho" || e.grade !== "";
      return e.subjectId === examFilter;
    });
    const lista = items.map((e) => {
      const d = daysUntil(e.date);
      const need = (Number(e.hoursNeeded) || 8) * 60;
      const got = studiedFor(e.subjectId, e.date);
      const urgent = d >= 0 && d <= 3 && e.status !== "hecho";
      const cl = e.checklist || [];
      return `<div class="card exam-card ${urgent ? "urgent" : ""}" style="padding:14px 16px">
        <div style="display:flex;gap:12px;align-items:flex-t">
          <span class="dot" style="background:${subjectColor(e.subjectId)};margin-top:6px"></span>
          <div style="flex:1">
            <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
              <b>${esc(e.title)}</b>
              <span class="badge ${esc(e.type)}">${esc(typeLabel(e.type))}</span>
              ${e.grade !== "" ? `<span class="badge done">${e.grade}</span>` : ""}
            </div>
            <div style="color:var(--muted);font-size:13px;margin-top:4px">${esc(subjectName(e.subjectId))} · ${fmtDateLong(e.date)} ${e.time || ""} · ${esc(e.location || "")}</div>
            ${e.notes ? `<div style="margin-top:8px;font-size:13.5px">${esc(e.notes)}</div>` : ""}
            <div style="margin-top:10px;font-size:12px;color:var(--muted)">${fmtHours(got)} / ${fmtHours(need)}</div>
            <div class="bar"><i style="width:${clamp((got / need) * 100, 0, 100)}%"></i></div>
            ${cl.length ? cl.map((c) => `<label class="check-item"><input type="checkbox" data-action="toggle-check" data-eid="${e.id}" data-id="${c.id}" ${c.done ? "checked" : ""}/> ${esc(c.text)}</label>`).join("") : ""}
            <button class="btn btn-sm" style="margin-top:8px" data-action="add-check" data-id="${e.id}">+ Temario</button>
          </div>
          <div style="text-align:right">
            <div style="font-family:var(--display);font-size:22px">${d < 0 ? "—" : d}</div>
            <div style="font-size:11px;color:var(--muted)">${d < 0 ? "pasado" : "días"}</div>
            <div style="margin-top:8px;display:flex;gap:4px">
              <button class="btn btn-sm" data-action="edit-exam" data-id="${e.id}">Editar</button>
              <button class="btn btn-sm" data-action="delete-exam" data-id="${e.id}">×</button>
            </div>
          </div>
        </div>
      </div>`;
    }).join("") || `<div class="empty">No hay exámenes en este filtro.</div>`;
    return `
      <div class="agenda-toolbar">
        <div class="hub-seg agenda-seg">
          <button data-action="exam-filter" data-id="all" class="${examFilter === "all" ? "is-on" : ""}">Todos</button>
          <button data-action="exam-filter" data-id="proximos" class="${examFilter === "proximos" ? "is-on" : ""}">Próximos</button>
          <button data-action="exam-filter" data-id="hechos" class="${examFilter === "hechos" ? "is-on" : ""}">Hechos</button>
        </div>
        <button class="hub-round" data-action="export-ics" title="Exportar calendario">ICS</button>
        <button class="hub-round hub-avatar" data-action="add-exam" aria-label="Nuevo examen">+</button>
      </div>
      <div class="exam-mods">${state.subjects.map((s) => `<button class="mod-chip ${examFilter === s.id ? "is-on" : ""}" data-action="exam-filter" data-id="${s.id}">${esc(s.name)}</button>`).join("")}</div>
      <div class="grid" style="gap:10px">${lista}</div>
    `;
  }

  function renderCalendar() {
    const y = calendarCursor.getFullYear(), m = calendarCursor.getMonth();
    const first = new Date(y, m, 1);
    const startPad = weekdayMon0(first);
    const daysIn = new Date(y, m + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startPad; i++) cells.push({ out: true, n: "" });
    for (let d = 1; d <= daysIn; d++) {
      const iso = `${y}-${pad(m + 1)}-${pad(d)}`;
      cells.push({ out: false, n: d, iso, evs: state.exams.filter((e) => e.date === iso), today: iso === todayISO(), hol: holidayName(iso) });
    }
    while (cells.length % 7) cells.push({ out: true, n: "" });
    return `<div class="card">
      <div class="cal-nav">
        <button class="icon-btn" data-action="cal-prev">‹</button>
        <h2>${MONTHS[m]} ${y}</h2>
        <button class="icon-btn" data-action="cal-next">›</button>
      </div>
      <div class="cal">
        ${DAYS_SHORT.map((d) => `<div class="dow">${d}</div>`).join("")}
        ${cells.map((c) => `<div class="cal-day ${c.out ? "out" : ""} ${c.today ? "today" : ""} ${(c.evs || []).length ? "has-ev" : ""} ${c.hol ? "has-hol" : ""}" ${c.iso ? `data-action="cal-day" data-date="${c.iso}"` : ""}>
          <div class="n">${c.n}</div>
          ${c.hol ? `<div class="cal-hol">${esc(c.hol)}</div>` : ""}
          ${(c.evs || []).map((e) => `<div class="cal-ev" data-action="edit-exam" data-id="${e.id}" style="background:${subjectColor(e.subjectId)}">${esc(e.title)}</div>`).join("")}
        </div>`).join("")}
      </div>
    </div>`;
  }

  // 1x1 transparente: el hueco de una foto que todavía se está leyendo del almacén
  const PUNTO_TRANSPARENTE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

  function md(text, imgs) {
    let t = esc(text || "");
    if (imgs) {
      t = t.replace(/!\[([^\]]*)\]\(aula-img:([^)\s]+)\)/g, (m, alt, id) => {
        const nombre = alt || "foto";
        if (imgs[id]) return `<img class="note-img" src="${imgs[id]}" alt="${esc(nombre)}">`;   // foto antigua, dentro del texto
        if (mediaOk()) {
          const ya = Media().urlFor(id);   // en memoria se pinta ya; si no, se carga sola y se rellena
          return `<img class="note-img ${ya ? "" : "is-loading"}" data-media="${esc(id)}" src="${ya || PUNTO_TRANSPARENTE}" alt="${esc(nombre)}">`;
        }
        return `<span class="hint">[imagen no disponible]</span>`;
      });
      // Compatibilidad con fotos antiguas guardadas como data URL dentro del texto
      t = t.replace(/!\[([^\]]*)\]\((data:image\/[^)\s]+)\)/g, (m, alt, src) =>
        `<img class="note-img" src="${src}" alt="${alt || "foto"}">`);
    }
    t = t.replace(/^### (.*)$/gm, "<h4>$1</h4>").replace(/^## (.*)$/gm, "<h3>$1</h3>").replace(/^# (.*)$/gm, "<h2>$1</h2>");
    t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/`([^`]+)`/g, "<code>$1</code>");
    t = t.replace(/^\- (.*)$/gm, "<li>$1</li>").replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`);
    return t.replace(/\n/g, "<br>");
  }

  function notePlain(n) {
    // Texto de la nota sin las marcas de imagen (para la lista, el buscador y el recuento)
    return String(n.content || "").replace(/!\[[^\]]*\]\((?:aula-img|data:image)[^)]*\)/g, "").trim();
  }
  function renderNotes() {
    let notes = [...state.notes].sort((a, b) => (b.pinned - a.pinned) || (b.updatedAt - a.updatedAt));
    if (noteFilter !== "all") notes = notes.filter((n) => n.subjectId === noteFilter);
    if (!noteId && notes[0]) noteId = notes[0].id;
    const current = state.notes.find((n) => n.id === noteId);
    const lockedNow = current && current.locked && !unlockedNotes.has(current.id);
    const imgs = {};
    if (current && current.attachments) current.attachments.forEach((a) => { if (a.data) imgs[a.id] = a.data; });
    setTimeout(() => Media() && Media().hydrate($("#view")), 0);
    return `<div class="notes-layout">
      <div>
        <button class="btn btn-primary" data-action="add-note" style="width:100%;margin-bottom:10px">Nueva nota</button>
        <input class="note-search" id="note-query" placeholder="Buscar…" aria-label="Buscar en las notas" value="${esc(noteQuery)}" />
        <div class="filters">
          <button class="chip ${noteFilter === "all" ? "is-on" : ""}" data-action="note-filter" data-id="all">Todas</button>
          ${state.subjects.map((s) => `<button class="chip ${noteFilter === s.id ? "is-on" : ""}" data-action="note-filter" data-id="${s.id}">${esc(s.name)}</button>`).join("")}
        </div>
        <div class="notes-list">
          ${notes.map((n) => {
            const bloqueada = n.locked && !unlockedNotes.has(n.id);
            return `<button class="note-item ${n.id === noteId ? "is-active" : ""}" data-action="open-note" data-id="${n.id}">
            <h4>${n.pinned ? "📌 " : ""}${bloqueada ? "🔒 " : ""}${esc(n.title || "Sin título")}</h4>
            <p>${bloqueada ? "Nota protegida con PIN" : esc(notePlain(n).replace(/\s+/g, " ").slice(0, 80))}</p>
          </button>`;
          }).join("") || `<div class="empty">Sin notas.</div>`}
        </div>
      </div>
      <div class="editor">
        ${lockedNow ? `<div class="lock-screen">
          <b>🔒 Nota protegida</b>
          <p class="hint" style="margin:0">Escribe el PIN de Ajustes para verla.</p>
          <div class="field"><input id="note-pin-input" type="password" inputmode="numeric" autocomplete="off" placeholder="PIN" /></div>
          <button class="btn btn-primary" data-action="note-unlock">Desbloquear</button>
        </div>` : current ? `
          <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
            <select data-action="note-subject" aria-label="Módulo de la nota">${subjectOptions(current.subjectId)}</select>
            <button class="btn btn-sm" data-action="toggle-pin">${current.pinned ? "Quitar pin" : "Fijar"}</button>
            <button class="btn btn-sm" data-action="toggle-preview">${notePreview ? "Editar" : "Vista"}</button>
            <button class="btn btn-sm" data-action="note-to-cards">A fichas</button>
            <button class="btn btn-sm" data-action="note-tpl">Plantilla</button>
            <button class="btn btn-sm" data-action="note-photo">Foto</button>
            <button class="btn btn-sm" data-action="note-lock">PIN</button>
            <button class="btn btn-sm" data-action="note-hist">Versiones</button>
            <button class="btn btn-sm" data-action="toggle-focus">Foco</button>
            <button class="btn btn-sm" data-action="delete-note" style="margin-left:auto">Eliminar</button>
          </div>
          <input class="editor-title" id="note-title" placeholder="Título" aria-label="Título de la nota" value="${esc(current.title)}" />
          ${notePreview ? `<div class="preview">${md(current.content, imgs)}</div>` : `<textarea class="editor-body" id="note-body" aria-label="Contenido de la nota" placeholder="# título, **negrita**, - pregunta :: respuesta">${esc(current.content)}</textarea>`}
          ${(current.attachments || []).length ? `<div class="note-photos">${current.attachments.map((a) => {
            const src = a.data || (mediaOk() ? Media().urlFor(a.id) : "") || "";
            return `<figure class="note-photo">
              <img class="note-img ${src ? "" : "is-loading"}" src="${src || PUNTO_TRANSPARENTE}" data-media="${esc(a.id)}" alt="${esc(a.name || "foto")}" loading="lazy">
              <figcaption>${esc(a.name || "foto")}<button class="btn btn-sm btn-danger" data-action="note-photo-del" data-id="${esc(a.id)}" aria-label="Quitar ${esc(a.name || "foto")}">×</button></figcaption>
            </figure>`;
          }).join("")}</div>` : ""}
          <div class="note-meta"><span>${notePlain(current) ? (notePlain(current).split(/\s+/).length + " palabras") : "Vacía"}${(current.attachments || []).length ? " · " + current.attachments.length + " foto(s)" : ""}</span><span>editada ${new Date(current.updatedAt).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span></div>
        ` : `<div class="empty">Crea una nota.</div>`}
      </div>
    </div>`;
  }

  function renderCards() {
    const list = cardFilter === "all" ? state.cards : state.cards.filter((c) => c.subjectId === cardFilter);
    const due = list.filter((c) => !c.due || c.due <= todayISO());
    if (!cardQueue.length) cardQueue = [...due];
    const cur = cardQueue[0];
    const cuenta = { nueva: 0, aprendiendo: 0, joven: 0, madura: 0 };
    list.forEach((c) => { cuenta[cardState(c)]++; });
    const maduras = cuenta.madura + cuenta.joven;
    const hechasHoy = list.filter((c) => c.last === todayISO()).length;
    return `
      <div class="filters">
        <button class="chip ${cardFilter === "all" ? "is-on" : ""}" data-action="card-filter" data-id="all">Todas</button>
        ${state.subjects.map((s) => `<button class="chip ${cardFilter === s.id ? "is-on" : ""}" data-action="card-filter" data-id="${s.id}">${esc(s.name)}</button>`).join("")}
        <span style="margin-left:auto;display:flex;gap:6px">
          <button class="btn btn-sm ${state._cardMode !== "type" ? "btn-primary" : ""}" data-action="card-mode" data-mode="flip">Voltear</button>
          <button class="btn btn-sm ${state._cardMode === "type" ? "btn-primary" : ""}" data-action="card-mode" data-mode="type">Escribir</button>
          <button class="btn btn-sm" data-action="add-card">Nueva</button>
        </span>
      </div>
      <div class="grid grid-2">
        <div class="card" style="min-height:340px">
          <h3>Repaso · ${due.length} hoy</h3>
          <p class="hint" style="margin:0 0 8px">Nuevas ${cuenta.nueva} · aprendiendo ${cuenta.aprendiendo} · maduras ${maduras} · hechas hoy ${hechasHoy}</p>
          ${cur ? `
            <div class="flip ${cardFlip ? "is-back" : ""}" data-action="flip-card">
              <div class="flip-inner">
                <div class="flip-face">${esc(cur.front)}</div>
                <div class="flip-face back">${esc(cur.back)}</div>
              </div>
            </div>
            ${state._cardMode === "type" ? `<div class="field"><label>Escribe la respuesta</label><input id="card-typed" /><button class="btn btn-primary" data-action="card-typed">Comprobar</button></div>` : ""}
            <p style="text-align:center;color:var(--muted);font-size:13px">Clic para voltear</p>
            <div class="grade-row-btns">
              <button class="btn btn-sm" data-action="grade-card" data-q="0">Otra vez<small>${nextLabel(cur, 0)}</small></button>
              <button class="btn btn-sm" data-action="grade-card" data-q="3">Difícil<small>${nextLabel(cur, 3)}</small></button>
              <button class="btn btn-sm btn-primary" data-action="grade-card" data-q="4">Bien<small>${nextLabel(cur, 4)}</small></button>
              <button class="btn btn-sm" data-action="grade-card" data-q="5">Fácil<small>${nextLabel(cur, 5)}</small></button>
            </div>
            <p class="hint" style="text-align:center;margin:8px 0 0">${cardState(cur) === "nueva" ? "Ficha nueva" : `Repaso nº ${cur.reps || 0}${cur.lapses ? " · " + cur.lapses + " fallo(s)" : ""} · facilidad ${(Number(cur.ease) || 2.5).toFixed(2)}`}</p>`
            : `<div class="empty"><b>Nada pendiente hoy</b>
                <p>${list.length ? "Vuelve cuando toque. Mientras: repasa apuntes o haz un test." : "Crea tu primera ficha desde una nota con «A fichas»."}</p>
                <div class="hero-actions">
                  ${list.length ? "" : `<button class="btn btn-primary" data-action="add-card">Nueva ficha</button>`}
                  <button class="btn" data-action="go" data-to="notes">Ir a apuntes</button>
                </div></div>`}
        </div>
        <div class="card">
          <h3>Mazo (${list.length})</h3>
          ${list.map((c) => {
            const est = cardState(c);
            const cuando = !c.due || c.due <= todayISO() ? "hoy" : "en " + Math.max(0, daysUntil(c.due)) + " d";
            return `<div class="row">
            <span class="dot" style="background:${subjectColor(c.subjectId)}"></span>
            <div style="flex:1"><b>${esc(c.front)}</b><small class="hint">${est} · vuelve ${cuando}</small></div>
            <button class="btn btn-sm" data-action="edit-card" data-id="${c.id}">Editar</button>
            <button class="btn btn-sm" data-action="delete-card" data-id="${c.id}">×</button>
          </div>`;
          }).join("") || `<div class="empty"><b>Mazo vacío</b><p>Las fichas se crean a mano o desde una nota con «A fichas».</p><button class="btn btn-primary" data-action="add-card">Nueva ficha</button></div>`}
        </div>
      </div>
    `;
  }

  function renderTasks() {
    const today = todayISO();
    const f = agendaFilter || "all";
    const tasks = state.tasks.slice().sort((a, b) => Number(a.done) - Number(b.done) || (a.due || "9999").localeCompare(b.due || "9999"));
    const exams = [...state.exams].filter((e) => e.status !== "hecho").sort((a, b) => a.date.localeCompare(b.date));
    let html = "";
    if (f !== "examen") {
      html += tasks.filter((t) => f === "hechas" ? t.done : f === "tarea" || f === "all" ? !t.done || f === "all" : true).map((t) => {
        const late = t.due && t.due < today && !t.done;
        return `<div class="task ${t.done ? "done" : ""}">
          <i class="task-stripe" style="background:${subjectColor(t.subjectId)}"></i>
          <input type="checkbox" data-action="toggle-task" data-id="${t.id}" aria-label="Marcar como hecha: ${esc(t.title)}" ${t.done ? "checked" : ""} />
          <div style="flex:1;min-width:0" data-action="edit-task" data-id="${t.id}">
            <div class="tt">${esc(t.title)}</div>
            <div class="task-meta">${esc(subjectName(t.subjectId) || "Sin módulo")}</div>
            <div style="margin-top:6px"><span class="badge">tarea</span>
              <span class="${late ? "prio-alta" : "prio-media"}">${fmtDue(t.due)}</span></div>
          </div>
          <button class="icon-del" type="button" data-action="delete-task" data-id="${t.id}" aria-label="Eliminar tarea">×</button>
        </div>`;
      }).join("");
    }
    if (f === "all" || f === "examen") {
      html += exams.map((e) => {
        const d = daysUntil(e.date);
        return `<div class="task">
          <div style="width:20px;height:20px;border-radius:999px;background:color-mix(in srgb, ${subjectColor(e.subjectId)} 70%, transparent);margin-top:2px"></div>
          <div style="flex:1" data-action="edit-exam" data-id="${e.id}">
            <div class="tt">${esc(e.title)}</div>
            <div style="font-size:11px;color:var(--muted);margin-top:2px">${esc(subjectName(e.subjectId))}</div>
            <div style="margin-top:6px"><span class="badge examen">examen</span>
              <span class="${d <= 2 ? "prio-alta" : "prio-media"}">${d < 0 ? "pasado" : d === 0 ? "hoy" : "en " + d + " d"}</span></div>
          </div>
        </div>`;
      }).join("");
    }
    return `
      <div class="agenda-toolbar">
        <div class="hub-seg agenda-seg">
          <button data-action="agenda-filter" data-id="all" class="${f === "all" ? "is-on" : ""}">Todo</button>
          <button data-action="agenda-filter" data-id="tarea" class="${f === "tarea" ? "is-on" : ""}">Tareas</button>
          <button data-action="agenda-filter" data-id="examen" class="${f === "examen" ? "is-on" : ""}">Exámenes</button>
        </div>
        <button class="hub-round hub-avatar" data-action="add-task" aria-label="Nueva tarea">+</button>
      </div>
      ${html || `<div class="empty"><b>Todo al día</b>No hay pendientes.</div>`}
    `;
  }

  function renderTimer() {
    const today = todayISO();
    const wr = weekRange();
    const todaySessions = state.sessions.filter((x) => x.date === today);
    const todayMins = todaySessions.reduce((a, b) => a + b.minutes, 0);
    return `
      <h2 style="margin:0;font-size:24px;font-weight:900;letter-spacing:-.04em">Enfoque</h2>
      <div class="card timer-card">
        <div class="seg" style="width:100%;max-width:260px;margin-bottom:8px">
          <button data-action="timer-mode" data-mode="work" class="${timer.mode === "work" ? "is-on" : ""}">${state.settings.pomodoroWork}m</button>
          <button data-action="timer-mode" data-mode="break" class="${timer.mode === "break" ? "is-on" : ""}">${state.settings.pomodoroBreak}m</button>
          <button data-action="timer-mode" data-mode="long" class="${timer.mode === "long" ? "is-on" : ""}">${state.settings.pomodoroLong}m</button>
        </div>
        <div class="ring-wrap ${timer.mode === "work" ? "" : "break"}">
          <svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="52"></circle>
          <circle class="ring-fg" id="ring-fg" cx="60" cy="60" r="52"></circle></svg>
          <div class="ring-center"><div><div class="time" id="timer-display">25:00</div><div class="mode" id="timer-mode-lbl">Listo</div></div></div>
        </div>
        <div class="field" style="width:100%"><label>Módulo</label>
          <select id="timer-subject" aria-label="Módulo del bloque de estudio">${subjectOptions(timer.subjectId)}</select></div>
        <div class="timer-actions">
          <button class="btn btn-primary" data-action="timer-toggle" id="timer-toggle">INICIAR</button>
          <button class="btn" data-action="timer-reset" style="width:56px;height:56px;border-radius:16px" title="Reiniciar" aria-label="Reiniciar bloque">↺</button>
          <button class="btn" data-action="timer-skip" title="Dar el bloque por terminado" aria-label="Terminar el bloque ahora">Terminar</button>
        </div>
      </div>
      <div class="card">
        <div class="sec-head"><div><h3>Historial semanal</h3><p class="hint" style="margin:0">Minutos concentrados · hoy ${fmtHours(todayMins)}</p></div></div>
        ${weekBarsHTML()}
      </div>
      <div class="card">
        <h3>Sesiones de hoy</h3>
        ${todaySessions.map((x) => `<div class="row"><span class="dot" style="background:${subjectColor(x.subjectId)}"></span><div>${esc(subjectName(x.subjectId))}</div><div class="meta">${x.minutes} min</div></div>`).join("") || `<div class="empty">Aún nada hoy.</div>`}
        <button class="btn btn-sm" style="margin-top:10px" data-action="log-session">Registrar a mano</button>
      </div>
    `;
  }

  function renderStats() {
    const wr = weekRange();
    const mins = state.sessions.filter((s) => s.date >= wr.from && s.date <= wr.to).reduce((a, b) => a + b.minutes, 0);
    const total = state.sessions.reduce((a, b) => a + b.minutes, 0);
    const graded = state.exams.filter((e) => e.grade !== "" && !Number.isNaN(Number(e.grade)));
    const avg = graded.length ? graded.reduce((a, b) => a + Number(b.grade), 0) / graded.length : null;
    return `
      <div class="grid grid-4">
        <div class="stat"><div class="k">Total</div><div class="v">${fmtHours(total)}</div></div>
        <div class="stat"><div class="k">Semana</div><div class="v">${fmtHours(mins)}</div></div>
        <div class="stat"><div class="k">Media pond.</div><div class="v">${weightedGPA() == null ? "—" : weightedGPA().toFixed(1)}</div></div>
        <div class="stat"><div class="k">Asistencia</div><div class="v">${attStats().pct == null ? "—" : attStats().pct + "%"}</div></div>
      </div>
      <div class="grid grid-2" style="margin-top:16px">
        <div class="card"><h3>Últimos 28 días</h3>
          <div class="heat">${heatDays().map((d) => `<i class="h${d.v}" title="${d.iso}${d.v ? "" : " · sin estudio"}"></i>`).join("")}</div>
          <p class="hint" style="margin:8px 0 0">Cada cuadro es un día, de más flojo a más estudiado.</p>
        </div>
        <div class="card"><h3>Horas por módulo (semana)</h3><div class="chart-box"><canvas id="chart-bar"></canvas></div></div>
        <div class="card"><h3>Boletín</h3>
          ${state.subjects.map((s) => {
            const g = graded.filter((e) => e.subjectId === s.id);
            const ga = g.length ? g.reduce((a, b) => a + Number(b.grade), 0) / g.length : null;
            return `<div class="row"><span class="dot" style="background:${safeColor(s.color)}"></span><div style="flex:1"><b>${esc(s.name)}</b></div><div class="meta">${ga == null ? "—" : ga.toFixed(1)}</div></div>`;
          }).join("")}
        </div>
      </div>
    `;
  }

  function drawStats() {
    const canvas = $("#chart-bar");
    if (!canvas) return;
    const wr = weekRange();
    const items = state.subjects.map((s) => ({
      label: s.name, color: s.color,
      value: state.sessions.filter((x) => x.subjectId === s.id && x.date >= wr.from && x.date <= wr.to).reduce((a, b) => a + b.minutes, 0) / 60,
    })).filter((i) => i.value > 0);
    const ctx = canvas.getContext("2d");
    const w = canvas.width = canvas.clientWidth * 2;
    const h = canvas.height = canvas.clientHeight * 2;
    ctx.clearRect(0, 0, w, h);
    const max = Math.max(1, ...items.map((i) => i.value));
    const bw = (w - 40) / Math.max(items.length, 1);
    items.forEach((it, i) => {
      const bh = ((h - 80) * it.value) / max;
      ctx.fillStyle = it.color;
      ctx.fillRect(20 + i * bw + bw * 0.2, h - 50 - bh, bw * 0.6, bh);
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--muted") || "#888";
      ctx.font = "20px sans-serif";
      ctx.fillText(it.label.slice(0, 10), 20 + i * bw + 8, h - 16);
    });
  }

  function renderPlan() {
    const exams = [...state.exams].filter((e) => daysUntil(e.date) >= 0 && e.status !== "hecho").sort((a, b) => a.date.localeCompare(b.date));
    if (!exams.length) return `<div class="empty">Añade exámenes y el plan se construye solo.</div>`;
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const days = [];
    for (let i = 0; i < 21; i++) {
      const d = new Date(start); d.setDate(start.getDate() + i);
      const iso = localISO(d);
      const blocks = [];
      exams.forEach((ex) => {
        if (iso === ex.date) { blocks.push({ kind: "exam", ex }); return; }
        const left = daysUntil(ex.date) - i;
        if (left < 0) return;
        const minutes = Math.min(80, Math.max(25, Math.round(((Number(ex.hoursNeeded) || 8) * 60) / Math.max(1, daysUntil(ex.date)))));
        blocks.push({ kind: "study", ex, minutes });
      });
      days.push({ iso, blocks: blocks.slice(0, 3), weekend: weekdayMon0(d) >= 5 });
    }
    return `
      <div class="card" style="margin-bottom:16px">
        <div class="card-head"><p style="margin:0">Minutos sugeridos hasta cada fecha.</p>
          <button class="btn btn-sm btn-primary" data-action="plan-to-tasks">Pasar 7 días a tareas</button></div>
      </div>
      ${days.map((day) => `<div class="plan-day ${day.iso === todayISO() ? "today" : ""}" style="--c:${day.blocks[0] ? subjectColor(day.blocks[0].ex.subjectId) : "var(--line)"}">
        <strong>${fmtDateLong(day.iso)}</strong>
        ${day.blocks.map((b) => b.kind === "exam"
          ? `<div style="margin-top:6px"><span class="badge final">EXAMEN</span> ${esc(b.ex.title)}</div>`
          : `<div style="margin-top:6px">${b.minutes} min · ${esc(subjectName(b.ex.subjectId))}</div>`).join("") || `<div style="color:var(--muted);margin-top:6px">Día ligero.</div>`}
      </div>`).join("")}
    `;
  }

  function renderSubjects() {
    return `<div class="subject-grid">
      ${state.subjects.map((s) => `<button class="subject-card" style="--c:${safeColor(s.color)}" data-action="open-subject" data-id="${s.id}">
        <h4 style="margin:6px 0 0;font-size:18px">${esc(s.name)}</h4>
        <p style="margin:8px 0 0;color:var(--muted);font-size:13px">${esc(s.teacher || "—")} · ${esc(s.room || "")}</p>
        <p style="margin:8px 0 0;font-size:12.5px;color:var(--muted)">${fmtHours(studiedFor(s.id))} · ${state.exams.filter((e) => e.subjectId === s.id).length} exámenes</p>
      </button>`).join("")}
      <button class="subject-card" data-action="add-subject" style="border-style:dashed;min-height:110px;display:grid;place-items:center;color:var(--muted)">+ Nuevo módulo</button>
    </div>`;
  }

  function renderSubject() {
    const s = subjectById(subjectFocus);
    if (!s) return `<div class="empty">No encontrado. <button class="btn" data-action="go" data-to="subjects">Volver</button></div>`;
    const exams = state.exams.filter((e) => e.subjectId === s.id);
    const notes = state.notes.filter((n) => n.subjectId === s.id);
    return `
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
        <button class="btn" data-action="go" data-to="subjects">← Módulos</button>
        <button class="btn" data-action="edit-subject" data-id="${s.id}">Editar</button>
        <button class="btn btn-primary" data-action="timer-subject-go" data-id="${s.id}">Estudiar</button>
      </div>
      <div class="grid grid-4">
        <div class="stat"><div class="k">Estudio</div><div class="v">${fmtHours(studiedFor(s.id))}</div></div>
        <div class="stat"><div class="k">Exámenes</div><div class="v">${exams.length}</div></div>
        <div class="stat"><div class="k">Notas</div><div class="v">${notes.length}</div></div>
        <div class="stat"><div class="k">Fichas</div><div class="v">${state.cards.filter((c) => c.subjectId === s.id).length}</div></div>
      </div>
      <div class="card" style="margin-top:16px">
        <h3>Exámenes</h3>
        ${exams.map((e) => `<button class="row" data-action="edit-exam" data-id="${e.id}" style="width:100%;text-align:left">
          <span class="dot" style="background:${safeColor(s.color)}"></span><div>${esc(e.title)}</div><div class="meta">${fmtDate(e.date)}</div>
        </button>`).join("") || `<div class="empty">Sin exámenes.</div>`}
      </div>
    `;
  }

  function renderInbox() {
    const items = [...(state.inbox || [])].sort((a, b) => b.createdAt - a.createdAt);
    return `<div class="card">
      <div class="card-head"><p style="margin:0;color:var(--muted)"><span class="kbd">C</span> captura rápida. Todo se queda en el móvil.</p>
        <button class="btn btn-sm btn-primary" data-action="open-capture">Capturar</button></div>
      ${items.map((it) => `<div class="inbox-item">
        <div style="flex:1"><div>${esc(it.text)}</div><div style="font-size:12px;color:var(--muted);margin-top:4px">${new Date(it.createdAt).toLocaleString("es-ES")}</div></div>
        <button class="btn btn-sm" data-action="inbox-task" data-id="${it.id}">Tarea</button>
        <button class="btn btn-sm" data-action="inbox-note" data-id="${it.id}">Nota</button>
        <button class="btn btn-sm" data-action="inbox-del" data-id="${it.id}">×</button>
      </div>`).join("") || `<div class="empty">Bandeja vacía.</div>`}
    </div>`;
  }

  function renderReview() {
    const wr = weekRange();
    const weekS = state.sessions.filter((s) => s.date >= wr.from && s.date <= wr.to);
    const mins = weekS.reduce((a, b) => a + b.minutes, 0);
    const goal = (state.settings.dailyGoal || 90) * 5;
    const late = overdueTasks();
    const soon = state.exams.filter((e) => e.status !== "hecho" && daysUntil(e.date) >= 0 && daysUntil(e.date) <= 14);
    const att = attStats();
    const gpa = weightedGPA();
    const bySub = state.subjects.map((s) => ({
      s, m: weekS.filter((x) => x.subjectId === s.id).reduce((a, b) => a + b.minutes, 0)
    })).sort((a, b) => b.m - a.m);
    const days = {};
    weekS.forEach((s) => { days[s.date] = (days[s.date] || 0) + s.minutes; });
    const best = Object.entries(days).sort((a, b) => b[1] - a[1])[0];
    return `
      <div class="review-grid">
        <div class="review-item"><div class="n">${fmtHours(mins)}</div><div class="l">estudiadas (meta ${fmtHours(goal)})</div>
          <div class="bar"><i style="width:${clamp((mins / Math.max(goal, 1)) * 100, 0, 100)}%"></i></div></div>
        <div class="review-item"><div class="n">${gpa == null ? "—" : gpa.toFixed(1)}</div><div class="l">media ponderada</div></div>
        <div class="review-item"><div class="n">${streak()}</div><div class="l">días de racha</div></div>
        <div class="review-item"><div class="n">${att.pct == null ? "—" : att.pct + "%"}</div><div class="l">asistencia (${att.p}P ${att.r}R ${att.f}F)</div>
          ${att.t ? `<div class="att-bar"><span class="p" style="width:${att.p / att.t * 100}%"></span><span class="r" style="width:${att.r / att.t * 100}%"></span><span class="f" style="width:${att.f / att.t * 100}%"></span></div>` : ""}</div>
      </div>
      <div class="card" style="margin-top:16px">
        <h3>Dónde has invertido la semana</h3>
        ${bySub.filter((x) => x.m).map((x) => `<div class="row">
          <span class="dot" style="background:${safeColor(x.s.color)}"></span>
          <div style="flex:1"><b>${esc(x.s.name)}</b><div class="bar"><i style="width:${clamp((x.m / Math.max(mins, 1)) * 100, 0, 100)}%"></i></div></div>
          <div class="meta">${fmtHours(x.m)}</div>
        </div>`).join("") || `<div class="empty">Aún no hay sesiones esta semana. Dale al temporizador.</div>`}
        ${best ? `<p style="color:var(--muted);font-size:13px;margin:12px 0 0">Mejor día: <strong>${fmtDate(best[0])}</strong> (${fmtHours(best[1])}).</p>` : ""}
      </div>
      <div class="grid grid-2" style="margin-top:16px">
        <div class="card">
          <h3>Exámenes en 14 días</h3>
          ${soon.map((e) => `<div class="row"><span class="dot" style="background:${subjectColor(e.subjectId)}"></span>
            <div style="flex:1">${esc(e.title)}</div><div class="meta">${daysUntil(e.date)} d</div></div>`).join("") || `<div class="empty">Nada cerca. Respira.</div>`}
        </div>
        <div class="card">
          <h3>Atrasadas</h3>
          ${late.map((t) => `<div class="task"><input type="checkbox" data-action="toggle-task" data-id="${t.id}" aria-label="Marcar como hecha: ${esc(t.title)}" />
            <div class="tt">${esc(t.title)}</div></div>`).join("") || `<div class="empty">Al día. Bien.</div>`}
          <button class="btn btn-sm btn-primary" style="margin-top:10px" data-action="plan-to-tasks">Pasar plan a tareas</button>
        </div>
      </div>
    `;
  }

  // (se usa en la vista de Ajustes para no repetir el HTML de cada casilla)
  function chk(id, on, label) {
    return `<label class="check"><input id="${id}" type="checkbox" ${on ? "checked" : ""}/> ${label}</label>`;
  }
  function avatarSrc(ic) {
    ic = ic || state.settings.avatarIcon || "letter";
    if (ic === "dragon") return "assets/icon-192.png";
    if (String(ic).startsWith("c:")) {
      const row = (state.settings.customAvatars || []).find((x) => x.id === ic.slice(2));
      return row && row.data ? row.data : "";
    }
    const pack = AVATAR_PACK.find((x) => x.id === ic);
    return pack ? pack.src : "";
  }
  function avatarInner() {
    const ic = state.settings.avatarIcon || "letter";
    const src = avatarSrc(ic);
    if (src) return `<img src="${src}" alt="">`;
    const map = { book: "📘", pc: "💻", wrench: "🔧", shield: "🛡️", net: "🌐", bolt: "⚡", lab: "🧪" };
    if (map[ic]) return map[ic];
    return esc(((state.settings.name || "A").trim().charAt(0) || "A").toUpperCase());
  }
  function avatarPicksHTML(kind) {
    kind = kind || "avatar";
    const isApp = kind === "app";
    const ic = isApp ? (state.settings.appIcon || "dragon") : (state.settings.avatarIcon || "letter");
    const setA = isApp ? "set-app-icon" : "set-avatar";
    const addA = isApp ? "add-app-icon" : "add-avatar";
    const letter = ((state.settings.name || "A").trim().charAt(0) || "A").toUpperCase();
    const simple = [
      ["letter", letter], ["book", "📘"], ["pc", "💻"], ["wrench", "🔧"],
      ["shield", "🛡️"], ["net", "🌐"], ["bolt", "⚡"], ["lab", "🧪"],
    ];
    const customs = state.settings.customAvatars || [];
    const simpleHtml = isApp ? "" : `<div class="ico-picks ico-simple">${simple.map(([id, lab]) =>
        `<button type="button" data-action="${setA}" data-id="${id}" class="${ic === id ? "is-on" : ""}" aria-label="Icono ${esc(id)}" title="${esc(id)}">${esc(lab)}</button>`
      ).join("")}</div>`;
    return `
      ${simpleHtml}
      <div class="ava-grid">
        <button type="button" data-action="${setA}" data-id="dragon" class="ava-ph ${ic === "dragon" ? "is-on" : ""}" aria-label="Icono dragón" title="Dragón"><img src="assets/icon-192.png" alt=""></button>
        ${AVATAR_PACK.map((a) =>
          `<button type="button" data-action="${setA}" data-id="${a.id}" class="ava-ph ${ic === a.id ? "is-on" : ""}" aria-label="${esc(a.name || a.id)}" title="${esc(a.name || a.id)}"><img src="${a.src}" alt=""></button>`
        ).join("")}
        ${customs.map((c) =>
          `<button type="button" data-action="${setA}" data-id="c:${c.id}" class="ava-ph ${ic === "c:" + c.id ? "is-on" : ""}" aria-label="Tu foto" title="Tu foto"><img src="${c.data}" alt=""><span class="ava-x" data-action="del-avatar" data-id="${c.id}" role="presentation">×</span></button>`
        ).join("")}
        <button type="button" class="ava-ph ava-add" data-action="${addA}" title="Añadir foto" aria-label="Añadir foto">+</button>
      </div>
      <p class="hint" style="margin:6px 0 0">${isApp
        ? (isNativeShell()
          ? "Toca uno y el del escritorio cambia. Si el móvil no lo refresca, espera un poco."
          : "Toca uno y pulsa «Aplicar en el escritorio». Luego vuelve a instalar la PWA para verlo.")
        : "Galería de criaturas, o añade tus fotos. Se quedan en este móvil."}</p>`;
  }
  function loadImg(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("img"));
      img.src = src;
    });
  }
  function dataURLToBlob(data) {
    try {
      const m = String(data).match(/^data:([^;]+);base64,(.+)$/);
      if (!m) return null;
      const bin = atob(m[2]);
      const arr = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
      return new Blob([arr], { type: m[1] });
    } catch { return null; }
  }
  function canvasBlob(c, type, q) {
    type = type || "image/png";
    return new Promise((resolve) => {
      const fallback = () => resolve(dataURLToBlob(c.toDataURL(type, q)));
      try {
        if (!c.toBlob) return fallback();
        c.toBlob((b) => { if (b) resolve(b); else fallback(); }, type, q);
      } catch { fallback(); }
    });
  }
  function isNativeShell() {
    try {
      if (window.Capacitor && typeof window.Capacitor.isNativePlatform === "function") {
        return !!window.Capacitor.isNativePlatform();
      }
    } catch {}
    return location.protocol === "capacitor:" || location.protocol === "file:";
  }
  function paintAppIcon(img, size) {
    const c = document.createElement("canvas");
    c.width = size; c.height = size;
    const ctx = c.getContext("2d");
    const s0 = Math.min(img.width, img.height) || 1;
    const cut = Math.max(1, Math.round(s0 / 1.12));
    const sx = (img.width - cut) / 2, sy = (img.height - cut) / 2;
    ctx.drawImage(img, sx, sy, cut, cut, 0, 0, size, size);
    return c;
  }
  function setLinkIcon(sel, href) {
    const el = $(sel);
    if (el) el.href = href;
  }
  async function putIconCache(b192, b512, manObj) {
    if (!("caches" in window)) return;
    const cache = await caches.open("aula-app-icon");
    const png = { "Content-Type": "image/png", "Cache-Control": "no-store" };
    const json = { "Content-Type": "application/manifest+json", "Cache-Control": "no-store" };
    const putAll = async (req, blob, headers) => {
      await cache.put(req, new Response(blob, { headers }));
    };
    await putAll("icon-192.png", b192, png);
    await putAll("icon-512.png", b512, png);
    await putAll("./assets/icon-192.png", b192, png);
    await putAll("./assets/icon-512.png", b512, png);
    await putAll("./assets/apple-touch-icon.png", b192, png);
    await putAll("./app-icon/192.png", b192, png);
    await putAll("./app-icon/512.png", b512, png);
    await putAll("./app-icon/180.png", b192, png);
    const manBlob = new Blob([JSON.stringify(manObj)], { type: "application/manifest+json" });
    await putAll("manifest.webmanifest", manBlob, json);
    await putAll("./manifest.webmanifest", manBlob, json);
  }
  async function applyAppIcon() {
    const ic = state.settings.appIcon || "dragon";
    const src = avatarSrc(ic) || "assets/icon-192.png";
    try {
      const img = await loadImg(src);
      const b192 = await canvasBlob(paintAppIcon(img, 192));
      const b512 = await canvasBlob(paintAppIcon(img, 512));
      if (!b192 || !b512) return;
      const u192 = URL.createObjectURL(b192);
      const u512 = URL.createObjectURL(b512);
      setLinkIcon("#app-apple-icon", u192);
      setLinkIcon("#app-favicon-192", u192);
      setLinkIcon("#app-favicon-512", u512);
      const stamp = encodeURIComponent(String(ic)) + "-" + Date.now();
      const man = {
        id: "./",
        name: "Aula SMR",
        short_name: "Aula SMR",
        description: "Organiza el ciclo de SMR. Todo en el móvil, sin nube.",
        start_url: "./",
        scope: "./",
        display: "standalone",
        orientation: "portrait",
        background_color: "#111111",
        theme_color: "#000000",
        lang: "es",
        icons: [
          { src: "./app-icon/192.png?v=" + stamp, sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "./app-icon/512.png?v=" + stamp, sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "./app-icon/512.png?v=" + stamp, sizes: "512x512", type: "image/png", purpose: "maskable" },
          { src: "./app-icon/180.png?v=" + stamp, sizes: "180x180", type: "image/png", purpose: "any" },
        ],
      };
      await putIconCache(b192, b512, man);
      const mh = $("#app-manifest");
      if (mh) {
        mh.removeAttribute("href");
        mh.setAttribute("href", "manifest.webmanifest?v=" + stamp);
      }
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        const d192 = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(b192); });
        const d512 = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(b512); });
        navigator.serviceWorker.controller.postMessage({ type: "app-icon", stamp, icon192: d192, icon512: d512, manifest: man });
      }
    } catch (err) {
      console.warn("applyAppIcon", err);
    }
  }
  function nativeSetIcon(id) {
    try {
      const C = window.Capacitor;
      const p = C && C.Plugins && C.Plugins.AulaWidget;
      if (!p || typeof p.setIcon !== "function") return Promise.resolve(false);
      const nid = String(id || "dragon").startsWith("c:") ? "dragon" : (id || "dragon");
      return p.setIcon({ id: nid }).then(() => true).catch(() => false);
    } catch { return Promise.resolve(false); }
  }
  function applyDesktopIcon() {
    applyAppIcon().then(() => {
      if (isNativeShell()) {
        const ic = state.settings.appIcon || "dragon";
        if (String(ic).startsWith("c:")) {
          toast("La foto propia es el perfil. Para el escritorio elige una criatura de la galería.");
          return;
        }
        nativeSetIcon(ic).then((ok) => {
          toast(ok ? "Icono del escritorio cambiado" : "No se pudo cambiar el icono");
        });
        return;
      }
      if (!isStandalone()) {
        toast("Al instalarla, usará este icono");
        installPwa();
        return;
      }
      openModal("Aplicar en el escritorio", `
        <p>Android guarda el icono al instalar. Para ver el nuevo:</p>
        <ol class="ico-steps">
          <li>Mantén pulsado <b>Aula SMR</b> en el escritorio.</li>
          <li>Elige <b>Desinstalar</b> o Quitar.</li>
          <li>Vuelve a Chrome, abre Aula SMR y <b>Instalar aplicación</b>.</li>
        </ol>
        <p class="hint">Los datos no se pierden: están en este navegador.</p>
      `, { confirm: "Cómo instalar", onSubmit() { closeModal(); installPwa(); } });
    }).catch(() => toast("No se pudo generar el icono"));
  }
  function addAvatarPhoto(mode) {
    const inp = document.createElement("input");
    inp.type = "file";
    inp.accept = "image/*";
    inp.multiple = true;
    inp.onchange = () => {
      const files = [...(inp.files || [])].filter((f) => f && f.type && f.type.startsWith("image/"));
      if (!files.length) return;
      const room = 12 - ((state.settings.customAvatars || []).length);
      if (room <= 0) { toast("Máximo 12 fotos propias"); return; }
      const take = files.slice(0, room);
      let left = take.length;
      take.forEach((f) => {
        const img = new Image();
        const url = URL.createObjectURL(f);
        img.onload = () => {
          try {
            const c = document.createElement("canvas");
            c.width = 192; c.height = 192;
            const ctx = c.getContext("2d");
            const s = Math.min(img.width, img.height) || 1;
            const sx = (img.width - s) / 2, sy = (img.height - s) / 2;
            ctx.drawImage(img, sx, sy, s, s, 0, 0, 192, 192);
            const data = c.toDataURL("image/jpeg", 0.82);
            state.settings.customAvatars = state.settings.customAvatars || [];
            const id = uid().slice(0, 8);
            state.settings.customAvatars.push({ id, data });
            if (mode === "app") state.settings.appIcon = "c:" + id;
            else state.settings.avatarIcon = "c:" + id;
          } catch { toast("No se pudo leer la foto"); }
          URL.revokeObjectURL(url);
          left -= 1;
          if (left <= 0) {
            save();
            if (mode === "app") applyAppIcon();
            render();
            toast(mode === "app" ? "Icono de la app listo" : "Foto de perfil lista");
          }
        };
        img.onerror = () => { URL.revokeObjectURL(url); left -= 1; if (left <= 0) { save(); render(); } };
        img.src = url;
      });
    };
    inp.click();
  }
  let mediaInfo = { n: 0, bytes: 0 };
  function renderSettings() {
    const st = state.settings;
    const skins = skinCat === "all" ? SKINS : SKINS.filter((s) => s.cat === skinCat);
    const kb = (storageBytes() / 1024).toFixed(0);
    const fotosKb = (mediaInfo.bytes / 1024).toFixed(0);
    const lleno = storageBytes() / (4.5 * 1024 * 1024);   // los navegadores dan ~5 MB
    const avisoEspacio = lleno > 0.8 ? `<p class="save-warn" style="margin:0"><b>Casi sin espacio.</b> El estado ocupa el ${Math.round(lleno * 100)} % de lo que permite el navegador. Exporta una copia y borra fotos o sesiones antiguas.</p>` : "";
    return `
      <div class="profile-card">
        <div class="profile-ava">${avatarInner()}</div>
        <div style="flex:1;text-align:left">
          <p style="margin:0;font-size:18px;font-weight:900">${esc(st.name || "Estudiante")}</p>
          <p style="margin:2px 0 0;color:var(--muted);font-size:13px">${esc(st.courseName || "SMR 2º")}</p>
        </div>
      </div>

      <p class="tools-kicker">Perfil</p>
      <div class="card">
        <div class="field"><label for="set-name">Nombre</label><input id="set-name" value="${esc(st.name)}" placeholder="Cómo te llamas"></div>
        <div class="field"><label for="set-course">Ciclo</label><input id="set-course" value="${esc(st.courseName)}"></div>
        <div class="form-row">
          <div class="field"><label for="set-center">Centro</label><input id="set-center" value="${esc(st.center || "")}" placeholder="IES…"></div>
          <div class="field"><label for="set-group">Grupo</label><input id="set-group" value="${esc(st.group || "")}" placeholder="A / B"></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="set-start">Inicio del curso</label><input id="set-start" type="date" value="${esc(st.startDate || "")}"></div>
          <div class="field"><label for="set-end">Fin del curso</label><input id="set-end" type="date" value="${esc(st.endDate || "")}"></div>
        </div>
        <div class="field"><label>Icono de perfil</label>${avatarPicksHTML("avatar")}</div>
      </div>

      <p class="tools-kicker">Aspecto</p>
      <div class="card">
        <div class="field"><label for="set-uisize">Tamaño del texto</label>
          <select id="set-uisize">
            <option value="sm" ${st.uiSize === "sm" ? "selected" : ""}>Pequeño</option>
            <option value="md" ${!st.uiSize || st.uiSize === "md" ? "selected" : ""}>Normal</option>
            <option value="lg" ${st.uiSize === "lg" ? "selected" : ""}>Grande</option>
          </select></div>
        <div class="field"><label for="set-startview">Vista al abrir</label>
          <select id="set-startview">
            ${["dashboard", "schedule", "exams", "tasks", "timer", "review", "achievements"].map((v) =>
              `<option value="${v}" ${st.startView === v ? "selected" : ""}>${esc((titles[v] || [v])[0])}</option>`).join("")}
          </select></div>
        ${chk("set-compact", st.compact, "Modo compacto")}
        ${chk("set-motion", st.reduceMotion, "Reducir animaciones")}
        ${chk("set-autoth", st.autoTheme, "Tema automático (claro de día)")}
        ${chk("set-showxp", st.showXp !== false, "Mostrar XP")}
        ${chk("set-showmedals", st.showMedals !== false, "Mostrar medallas")}
        ${chk("set-showweek", st.showWeekStrip !== false, "Tira de la semana en Inicio")}
        <button class="btn ${st.uiTheme === "dark" ? "" : "btn-primary"}" type="button" data-action="toggle-theme" style="width:100%;margin-top:10px">
          Cambiar a tema ${st.uiTheme === "dark" ? "claro" : "oscuro"}
        </button>
      </div>

      <p class="tools-kicker" id="set-skin-zone">Tema visual · ${SKINS.length} estilos</p>
      <div class="card">
        <div class="skin-cats">
          ${SKIN_CATS.map((c) => `<button class="chip ${skinCat === c.id ? "is-on" : ""}" data-action="skin-cat" data-id="${c.id}">${esc(c.name)}</button>`).join("")}
        </div>
        ${skinCards(skins)}
        <p class="hint" style="margin:10px 0 0">El tema se aplica al momento. Puedes combinarlo con claro/oscuro arriba.</p>
      </div>

      <p class="tools-kicker">Estudio</p>
      <div class="card">
        <div class="form-row">
          <div class="field"><label for="set-goal">Meta diaria (min)</label><input id="set-goal" type="number" min="10" max="600" value="${st.dailyGoal}"></div>
          <div class="field"><label for="set-weekdays">Días objetivo por semana</label><input id="set-weekdays" type="number" min="1" max="7" value="${st.weekGoalDays || 5}"></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="set-work">Pomodoro (min)</label><input id="set-work" type="number" min="1" max="180" value="${st.pomodoroWork}"></div>
          <div class="field"><label for="set-break">Descanso (min)</label><input id="set-break" type="number" min="1" max="60" value="${st.pomodoroBreak}"></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="set-long">Descanso largo (min)</label><input id="set-long" type="number" min="1" max="120" value="${st.pomodoroLong || 15}"></div>
          <div class="field"><label for="set-cycles">Bloques hasta el largo</label><input id="set-cycles" type="number" min="2" max="10" value="${st.cyclesUntilLong || 4}"></div>
        </div>
        <div class="form-row">
          <div class="field"><label for="set-defhours">Horas por examen</label><input id="set-defhours" type="number" min="1" max="100" value="${st.defaultHours || 8}"></div>
          <div class="field"><label for="set-grademax">Nota máxima</label><input id="set-grademax" type="number" min="5" max="100" value="${st.gradeMax || 10}"></div>
        </div>
        <div class="field"><label for="set-prio">Prioridad por defecto</label>
          <select id="set-prio">
            <option value="alta" ${st.defaultPrio === "alta" ? "selected" : ""}>Alta</option>
            <option value="media" ${!st.defaultPrio || st.defaultPrio === "media" ? "selected" : ""}>Media</option>
            <option value="baja" ${st.defaultPrio === "baja" ? "selected" : ""}>Baja</option>
          </select></div>
        ${chk("set-sound", st.sound !== false, "Sonido al terminar el bloque")}
        ${chk("set-vibrate", st.vibrate !== false, "Vibración")}
        ${chk("set-confetti", st.confetti !== false, "Confeti en logros")}
        ${chk("set-autonext", st.autoNext, "Encadenar bloques automáticamente")}
        ${chk("set-awake", st.keepAwake !== false, "Mantener la pantalla encendida")}
        ${chk("set-tbar", st.showTimerBar !== false, "Barra del temporizador siempre visible")}
      </div>

      <p class="tools-kicker">Agenda y horario</p>
      <div class="card">
        <div class="form-row">
          <div class="field"><label for="set-starth">Jornada: inicio</label><input id="set-starth" type="number" min="0" max="23" value="${st.startHour || 8}"></div>
          <div class="field"><label for="set-endh">Jornada: fin</label><input id="set-endh" type="number" min="1" max="24" value="${st.endHour || 21}"></div>
        </div>
        ${chk("set-sat", st.includeSaturday, "Incluir sábado en el horario")}
        ${chk("set-att", st.showAttendance !== false, "Pasar lista (presente / retraso / falta)")}
        ${chk("set-hideok", st.hideCompleted, "Ocultar tareas hechas")}
        <button class="btn" type="button" data-action="restore-timetable" style="width:100%;margin-top:10px">Restaurar el horario oficial 2.º SMR</button>
        <p class="hint" style="margin:6px 0 0">Esto <b>sustituye</b> tus clases actuales por la plantilla del ciclo. Te pedirá confirmación.</p>
      </div>

      <p class="tools-kicker">Avisos</p>
      <div class="card">
        <p class="hint" style="margin-top:0">Son avisos del navegador: suenan con la app abierta o recién usada. iOS no permite programarlos con la app cerrada.</p>
        <button class="btn ${st.notify ? "btn-primary" : ""}" type="button" data-action="enable-notify" style="width:100%">
          ${st.notify && typeof Notification !== "undefined" && Notification.permission === "granted" ? "Avisos activos" : "Activar avisos"}
        </button>
        ${chk("set-nclass", st.notifyClass !== false, "Clase (10 min antes)")}
        ${chk("set-nex", st.notifyExams !== false, "Exámenes")}
        ${chk("set-nta", st.notifyTasks !== false, "Tareas")}
        ${chk("set-nca", st.notifyCards !== false, "Fichas de repaso")}
        ${chk("set-night", st.nightRemind !== false, "Aviso nocturno para no romper la racha")}
        ${chk("set-morn", st.morningSummary !== false, "Resumen por la mañana")}
        <div class="form-row" style="margin-top:10px">
          <div class="field"><label for="set-remindh">Hora del resumen</label><input id="set-remindh" type="number" min="5" max="12" value="${st.remindHour || 8}"></div>
          <div class="field"><label for="set-lead">Días de antelación (examen)</label><input id="set-lead" type="number" min="0" max="30" value="${st.examLeadDays || 1}"></div>
        </div>
        <div class="field" style="margin-top:12px">
          <label for="set-inact">Avisar si paso días sin abrirla</label>
          <input id="set-inact" type="number" min="1" max="30" value="${st.inactivityDays || 5}" />
        </div>
        <div class="field">
          <label for="set-pin">PIN de notas (opcional)</label>
          <input id="set-pin" type="password" inputmode="numeric" autocomplete="off" value="${esc(st.pin || "")}" placeholder="Solo en este móvil">
        </div>
        <p class="hint" style="margin:6px 0 0">Con PIN puesto, las notas marcadas como protegidas piden el número. Evita miradas, no cifra el archivo.</p>
      </div>

      <p class="tools-kicker">Icono de la app</p>
      <div class="card">
        <div class="app-ico-preview">
          <div class="app-ico-tile"><img src="${esc(avatarSrc(st.appIcon || "dragon") || "assets/icon-192.png")}" alt="Icono actual"></div>
          <div>
            <b>Pantalla de inicio</b>
            <small>Es el dibujo del escritorio, no el de la esquina. En el APK cambia al tocarlo.</small>
          </div>
        </div>
        <div class="field"><label>Elige icono</label>${avatarPicksHTML("app")}</div>
        <button class="btn btn-primary" type="button" data-action="apply-desktop-icon" style="width:100%">Aplicar en el escritorio</button>
        <button class="btn" type="button" data-action="app-icon-from-profile" style="width:100%;margin-top:8px">Usar el del perfil</button>
      </div>

      <p class="tools-kicker">Widgets del escritorio</p>
      <div class="card">
        ${isNativeShell() ? `<p class="hint" style="margin-top:0">Elige el que quieras y Android te pide el sitio en el escritorio. Se actualizan al abrir la app.</p>
        <div class="wid-grid">${WIDGET_CATALOG.map((w) =>
          `<button type="button" class="wid-pin" data-action="pin-widget" data-id="${w.id}"><b>${esc(w.name)}</b><small>${esc(w.size)} · ${esc(w.hint)}</small></button>`
        ).join("")}</div>
        <p class="hint">Si no sale el diálogo: mantén pulsado el escritorio → Widgets → Aula SMR.</p>`
        : `<p class="hint" style="margin:0">Los widgets van con el <b>APK de Android</b>. En Chrome no se pueden poner en el escritorio.</p>`}
      </div>

      <p class="tools-kicker">Instalar como app</p>
      <div class="card">
        ${isStandalone() ? `<p class="hint" style="margin:0">Ya está instalada. Ábrela desde el icono <b>Aula SMR</b> de la pantalla de inicio. Funciona sin internet.</p>` : `<p class="hint" style="margin-top:0">${esc(installHint().detail)}</p>
        <button class="btn btn-primary" data-action="install-pwa" style="width:100%">${deferredInstall ? "Instalar Aula SMR" : "Cómo instalar"}</button>`}
      </div>

      <p class="tools-kicker">Datos (este dispositivo)</p>
      <div class="card" style="display:flex;flex-direction:column;gap:8px">
        ${avisoEspacio}
        <p class="hint" style="margin:0">Notas, exámenes y demás: <b>${kb} KB</b> ${mediaOk() ? `· fotos en el almacén de archivos: <b>${fotosKb} KB</b> (${mediaInfo.n})` : "· las fotos se guardan dentro del estado (este navegador no tiene almacén de archivos)"}.</p>
        <button class="btn btn-primary" data-action="export">Exportar copia JSON (con fotos)</button>
        <button class="btn" data-action="import">Importar JSON</button>
        <button class="btn" data-action="export-ics">Calendario .ics (exámenes y entregas)</button>
        <button class="btn" data-action="export-md">Apuntes a Markdown</button>
        <button class="btn" data-action="export-anki">Fichas a CSV (Anki)</button>
        <button class="btn" data-action="load-demo">Cargar ejemplo 2.º SMR</button>
        <button class="btn" data-action="restore-backup">Recuperar la copia automática</button>
        <button class="btn" data-action="wipe-backup-only">Borrar solo las copias automáticas</button>
        <button class="btn btn-danger" data-action="wipe">Borrar todo (incluidas las copias)</button>
      </div>

      <p class="tools-kicker">Avanzado</p>
      <div class="card">
        ${chk("set-confirm", st.confirmDelete !== false, "Preguntar antes de borrar")}
        ${chk("set-avatar", st.avatarOn !== false, "Foto de perfil en la cabecera")}
        <button class="btn" data-action="undo" style="width:100%;margin-top:10px">Deshacer el último borrado</button>
      </div>

      <button class="btn btn-primary" data-action="save-settings" style="width:100%;margin-top:16px">Guardar ajustes</button>
      <button class="btn" data-action="redo-onboard" style="width:100%;margin-top:8px">Volver a configurar desde el principio</button>
      <p class="footer-note">Aula SMR · datos solo en este dispositivo · ${APP_VERSION}</p>
    `;
  }

  function examForm(ex = {}) {
    return `
      <div class="field"><label>Título</label><input name="title" required value="${esc(ex.title || "")}" /></div>
      <div class="form-row">
        <div class="field"><label>Módulo</label><select name="subjectId">${subjectOptions(ex.subjectId || subjectFocus)}</select></div>
        <div class="field"><label>Tipo</label><select name="type">${EXAM_TYPES.map((t) => `<option value="${t.id}" ${ex.type === t.id ? "selected" : ""}>${t.label}</option>`).join("")}</select></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Fecha</label><input name="date" type="date" required value="${esc(ex.date || "")}" /></div>
        <div class="field"><label>Hora</label><input name="time" type="time" value="${esc(ex.time || "09:00")}" /></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Lugar</label><input name="location" value="${esc(ex.location || "")}" /></div>
        <div class="field"><label>Nota</label><input name="grade" type="number" step="0.1" min="0" max="${state.settings.gradeMax || 10}" value="${esc(ex.grade ?? "")}" /></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Peso (%)</label><input name="weight" type="number" min="0" max="100" value="${esc(ex.weight ?? 25)}" /></div>
        <div class="field"><label>Horas de estudio</label><input name="hoursNeeded" type="number" min="1" value="${esc(ex.hoursNeeded || 8)}" /></div>
      </div>
      <div class="field"><label>Temario</label><textarea name="notes">${esc(ex.notes || "")}</textarea></div>
      <label class="check"><input type="checkbox" name="done" ${ex.status === "hecho" ? "checked" : ""}/> Ya lo he hecho</label>
    `;
  }
  function eventForm(ev = {}) {
    return `
      <div class="field"><label>Módulo</label><select name="subjectId" required>${subjectOptions(ev.subjectId)}</select></div>
      <div class="form-row">
        <div class="field"><label>Día</label><select name="day">${DAYS.map((d, i) => `<option value="${i}" ${Number(ev.day) === i ? "selected" : ""}>${d}</option>`).join("")}</select></div>
        <div class="field"><label>Tipo</label><input name="type" value="${esc(ev.type || "clase")}" /></div>
      </div>
      <div class="form-row">
        <div class="field"><label>Inicio</label><input name="start" type="time" required value="${esc(ev.start || "09:00")}" /></div>
        <div class="field"><label>Fin</label><input name="end" type="time" required value="${esc(ev.end || "10:00")}" /></div>
      </div>
      <div class="field"><label>Aula</label><input name="room" value="${esc(ev.room || "")}" /></div>
    `;
  }
  function subjectForm(s = {}) {
    const color = s.color || "#3b82f6";
    return `
      <div class="field"><label>Nombre</label><input name="name" required value="${esc(s.name || "")}" /></div>
      <div class="form-row">
        <div class="field"><label>Profesor/a</label><input name="teacher" value="${esc(s.teacher || "")}" /></div>
        <div class="field"><label>Aula</label><input name="room" value="${esc(s.room || "")}" /></div>
      </div>
      <div class="field"><label>Color</label>
        <input type="hidden" name="color" id="color-val" value="${esc(color)}" />
        <div class="color-picks">${["#3b82f6","#22c55e","#f59e0b","#8b5cf6","#ef4444","#14b8a6","#ec4899","#64748b"].map((c) =>
          `<button type="button" data-action="pick-color" data-color="${c}" style="background:${c}" class="${c === color ? "is-on" : ""}"></button>`).join("")}</div>
      </div>
    `;
  }
  function taskForm(t = {}) {
    return `
      <div class="field"><label>Tarea</label><input name="title" required value="${esc(t.title || "")}" /></div>
      <div class="form-row">
        <div class="field"><label>Módulo</label><select name="subjectId">${subjectOptions(t.subjectId || subjectFocus)}</select></div>
        <div class="field"><label>Prioridad</label>
          <select name="priority">
            <option value="alta" ${t.priority === "alta" ? "selected" : ""}>Alta</option>
            <option value="media" ${t.priority !== "baja" && t.priority !== "alta" ? "selected" : ""}>Media</option>
            <option value="baja" ${t.priority === "baja" ? "selected" : ""}>Baja</option>
          </select>
        </div>
      </div>
      <div class="field"><label>Fecha</label><input name="due" type="date" value="${esc(t.due || "")}" /></div>
    `;
  }
  function cardForm(c = {}) {
    return `
      <div class="field"><label>Módulo</label><select name="subjectId">${subjectOptions(c.subjectId || subjectFocus)}</select></div>
      <div class="field"><label>Pregunta</label><textarea name="front" required>${esc(c.front || "")}</textarea></div>
      <div class="field"><label>Respuesta</label><textarea name="back" required>${esc(c.back || "")}</textarea></div>
    `;
  }

  function needSubjects() {
    if (state.subjects.length) return true;
    toast("Primero crea un módulo");
    view = "subjects"; render();
    return false;
  }
  function addExam(ex, preset = {}) {
    if (!needSubjects()) return;
    openModal(ex ? "Editar examen" : "Nuevo examen", examForm({ ...preset, ...ex }), {
      onSubmit(data) {
        const row = {
          id: ex?.id || uid(), subjectId: data.subjectId, title: data.title.trim(), date: data.date, time: data.time,
          type: data.type, location: data.location, notes: data.notes, grade: data.grade, weight: Number(data.weight) || 25,
          difficulty: 3, hoursNeeded: Number(data.hoursNeeded) || state.settings.defaultHours || 8, status: data.done ? "hecho" : "pendiente",
          checklist: ex?.checklist || [],
        };
        const wasDone = ex && (ex.status === "hecho" || ex.grade !== "");
        const nowDone = row.status === "hecho" || row.grade !== "";
        if (ex) state.exams = state.exams.map((e) => e.id === ex.id ? row : e);
        else state.exams.push(row);
        if (nowDone && !wasDone) grantXP(40, "Examen cerrado");
        checkAchievements(); closeModal(); render();
      },
    });
  }
  function addEvent(ev, preset = {}) {
    if (!needSubjects()) return;
    openModal(ev ? "Editar clase" : "Nueva clase", eventForm({ ...preset, ...ev }) + (ev ? `<p><button type="button" class="btn btn-danger btn-sm" data-action="delete-event" data-id="${ev.id}">Eliminar</button></p>` : ""), {
      onSubmit(data) {
        if (data.end <= data.start) { toast("La hora de fin debe ser posterior"); return; }
        const clash = state.events.some((x) => x.id !== ev?.id && Number(x.day) === Number(data.day) && x.start < data.end && data.start < x.end);
        if (clash) toast("Ojo: se solapa con otra clase");
        const row = { id: ev?.id || uid(), subjectId: data.subjectId, day: Number(data.day), start: data.start, end: data.end, room: data.room, type: data.type };
        if (ev) state.events = state.events.map((e) => e.id === ev.id ? row : e);
        else state.events.push(row);
        closeModal(); render();
      },
    });
  }
  function addSubject(s) {
    openModal(s ? "Editar módulo" : "Nuevo módulo", subjectForm(s) + (s ? `<p><button type="button" class="btn btn-danger btn-sm" data-action="delete-subject" data-id="${s.id}">Eliminar</button></p>` : ""), {
      onSubmit(data) {
        const row = { id: s?.id || uid(), name: data.name.trim(), teacher: data.teacher, room: data.room, credits: 0, color: data.color };
        if (s) state.subjects = state.subjects.map((x) => x.id === s.id ? row : x);
        else state.subjects.push(row);
        closeModal(); render();
      },
    });
  }
  function addTask(t) {
    openModal(t && t.id ? "Editar tarea" : "Nueva tarea", taskForm(t), {
      onSubmit(data) {
        const row = { id: t?.id || uid(), title: data.title.trim(), subjectId: data.subjectId, due: data.due, priority: data.priority || state.settings.defaultPrio || "media", done: t?.done || false };
        if (t && t.id) state.tasks = state.tasks.map((x) => x.id === t.id ? row : x);
        else state.tasks.push(row);
        closeModal(); render();
      },
    });
  }
  function addCard(c) {
    if (!needSubjects()) return;
    openModal(c ? "Editar ficha" : "Nueva ficha", cardForm(c), {
      onSubmit(data) {
        const row = { id: c?.id || uid(), subjectId: data.subjectId, front: data.front.trim(), back: data.back.trim(), due: c?.due || todayISO(), interval: c?.interval || 0, reps: c?.reps || 0 };
        if (c) state.cards = state.cards.map((x) => x.id === c.id ? row : x);
        else state.cards.push(row);
        cardQueue = [];
        closeModal(); render();
      },
    });
  }
  function addNote() {
    if (!needSubjects()) return;
    const sid = subjectFocus || (noteFilter !== "all" ? noteFilter : state.subjects[0].id);
    const n = { id: uid(), subjectId: sid, title: "Nueva nota", content: "", pinned: false, createdAt: Date.now(), updatedAt: Date.now() };
    state.notes.unshift(n); noteId = n.id; notePreview = false; view = "notes"; grantXP(5, "Nueva nota"); checkAchievements(); render();
  }
  let noteTimer = null;
  function persistNote() {
    const n = state.notes.find((x) => x.id === noteId);
    if (!n) return;
    if ($("#note-title")) n.title = $("#note-title").value;
    if ($("#note-body")) n.content = $("#note-body").value;
    n.versions = n.versions || [];
    const last = n.versions[0];
    const cambio = !last || last.content !== n.content || last.title !== n.title;
    // Una versión cada 2 minutos como mucho: antes se guardaba una por tecla.
    if (cambio && (!last || Date.now() - (last.t || 0) > 120000)) {
      n.versions.unshift({ t: Date.now(), title: n.title, content: n.content });
      if (n.versions.length > 12) n.versions.length = 12;
    }
    n.updatedAt = Date.now();
    clearTimeout(noteTimer);
    noteTimer = setTimeout(save, 600);
  }
  function persistNoteNow() {
    clearTimeout(noteTimer);
    noteTimer = null;
    persistNote();
    save();
  }

  function modeMinutes(mode) {
    if (mode === "break") return state.settings.pomodoroBreak;
    if (mode === "long") return state.settings.pomodoroLong;
    return state.settings.pomodoroWork;
  }
  function setMode(mode, reset = true) {
    timer.mode = mode;
    if (reset) {
      timer.running = false; clearInterval(timer.tick);
      timer.endsAt = 0;
      timer.remaining = modeMinutes(mode) * 60; timer.total = timer.remaining;
      timerClear();
    }
    updateTimerUI(); updateTimerChrome();
  }
  function beep() {
    if (!state.settings.sound) return;
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator(); const g = ac.createGain();
      o.connect(g); g.connect(ac.destination); o.frequency.value = 880;
      g.gain.setValueAtTime(0.0001, ac.currentTime);
      g.gain.exponentialRampToValueAtTime(0.2, ac.currentTime + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.5);
      o.start(); o.stop(ac.currentTime + 0.52);
    } catch {}
  }
  const TIMER_KEY = "aula.timer";

  function timerPersist() {
    try {
      localStorage.setItem(TIMER_KEY, JSON.stringify({
        mode: timer.mode, running: timer.running, remaining: Math.round(timer.remaining),
        total: timer.total, subjectId: timer.subjectId, cycles: timer.cycles,
        endsAt: timer.running ? timer.endsAt : 0,
      }));
    } catch {}
  }
  function timerClear() { try { localStorage.removeItem(TIMER_KEY); } catch {} }

  // Al abrir la app se recupera el bloque en curso; si el tiempo ya pasó, se cierra solo.
  function timerRestore() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(TIMER_KEY) || "null"); } catch {}
    if (!saved || typeof saved !== "object") return;
    timer.mode = ["work", "break", "long"].includes(saved.mode) ? saved.mode : "work";
    timer.total = Number(saved.total) || modeMinutes(timer.mode) * 60;
    timer.cycles = Number(saved.cycles) || 0;
    if (saved.subjectId) timer.subjectId = saved.subjectId;
    if (saved.running && saved.endsAt) {
      const left = Math.round((saved.endsAt - Date.now()) / 1000);
      timer.endsAt = saved.endsAt;
      timer.remaining = Math.max(0, left);
      if (left <= 0) {
        timer.remaining = 0;
        toast("Tu bloque terminó mientras no estabas");
        completeTimer();
        return;
      }
      startTimerLoop();
      const sub = state.subjects.find((s) => s.id === timer.subjectId);
      toast("Bloque en curso: " + fmtRemain(Math.round(left / 60)) + (sub ? " · " + sub.name : ""));
    } else {
      timer.remaining = clamp(Number(saved.remaining) || modeMinutes(timer.mode) * 60, 0, 24 * 3600);
      if (timer.remaining < timer.total) updateTimerChrome();
    }
    updateTimerUI();
  }
  function startTimerLoop() {
    timer.running = true;
    timer.endsAt = Date.now() + timer.remaining * 1000;
    clearInterval(timer.tick);
    timer.tick = setInterval(() => {
      // Se calcula con la hora del sistema: da igual que el móvil estrangule el intervalo.
      timer.remaining = Math.max(0, Math.round((timer.endsAt - Date.now()) / 1000));
      if (timer.remaining <= 0) { timer.remaining = 0; completeTimer(); }
      else { updateTimerUI(); updateTimerChrome(); }
    }, 1000);
    if (state.settings.keepAwake !== false && navigator.wakeLock) {
      try { navigator.wakeLock.request("screen").then((s) => { wakeLock = s; }).catch(() => {}); } catch {}
    }
    timerPersist();
  }
  function completeTimer(desdeFuera) {
    timer.running = false; clearInterval(timer.tick); beep();
    try { wakeLock?.release(); } catch {} wakeLock = null;
    if (timer.mode === "work") {
      const elapsed = Math.max(1, Math.round(timer.total / 60));
      state.sessions.push({ id: uid(), subjectId: $("#timer-subject")?.value || timer.subjectId, date: todayISO(), minutes: elapsed, type: "pomodoro", hour: new Date().getHours(), createdAt: Date.now() });
      timer.cycles += 1; checkAchievements(); save(); buzz(); if (state.settings.confetti) confetti(); toast(`+${elapsed} min · +${elapsed} XP`);
      if (document.hidden) noteOnce("pomo-" + Date.now(), "Bloque terminado", "+" + elapsed + " min. Toca para el descanso.");
      setMode(timer.cycles % state.settings.cyclesUntilLong === 0 ? "long" : "break", true);
    } else { toast("Descanso terminado"); setMode("work", true); }
    timerPersist();
    if (view === "timer") render(); else updateTimerChrome();
    if (state.settings.autoNext && !desdeFuera) setTimeout(() => { if (!timer.running) toggleTimer(); }, 800);
  }
  function toggleTimer() {
    if (timer.running) {
      timer.running = false; clearInterval(timer.tick);
      try { wakeLock?.release(); } catch {} wakeLock = null;
      timer.remaining = Math.max(0, Math.round(((timer.endsAt || Date.now()) - Date.now()) / 1000));
      timerPersist();
      updateTimerUI(); updateTimerChrome(); return;
    }
    timer.subjectId = $("#timer-subject")?.value || timer.subjectId;
    if (timer.remaining <= 0) timer.remaining = modeMinutes(timer.mode) * 60;
    timer.total = timer.total || timer.remaining;
    startTimerLoop();
    updateTimerUI(); updateTimerChrome();
  }

  function updateTimerUI() {
    const disp = $("#timer-display"); if (!disp) return;
    const m = Math.floor(Math.max(0, timer.remaining) / 60);
    const s = Math.max(0, timer.remaining) % 60;
    disp.textContent = `${pad(m)}:${pad(s)}`;
    const lbl = { work: "Estudio", break: "Descanso", long: "Descanso largo" };
    const ml = $("#timer-mode-lbl");
    if (ml) ml.textContent = timer.running ? lbl[timer.mode] + " · en curso" : lbl[timer.mode];
    const ring = $("#ring-fg");
    if (ring) {
      const c = 2 * Math.PI * 52;
      ring.style.strokeDasharray = c;
      ring.style.strokeDashoffset = String(c * (1 - (timer.total ? timer.remaining / timer.total : 1)));
    }
    const btn = $("#timer-toggle"); if (btn) btn.textContent = timer.running ? "PAUSAR" : "INICIAR";
  }
  function updateTimerChrome() {
    const bar = $("#timer-bar");
    const show = state.settings.showTimerBar !== false && (timer.running || (timer.remaining < timer.total && timer.remaining > 0));
    document.body.classList.toggle("timer-on", !!show);
    if (!show) { if (bar) bar.hidden = true; if (!timer.running) document.title = BASE_TITLE; return; }
    if (!bar) return;
    bar.hidden = false;
    bar.classList.toggle("break", timer.mode !== "work");
    const m = Math.floor(Math.max(0, timer.remaining) / 60);
    const s = Math.max(0, timer.remaining) % 60;
    const clock = `${pad(m)}:${pad(s)}`;
    $("#timer-bar-time").textContent = clock;
    $("#timer-bar-lbl").textContent = timer.mode === "work" ? "Estudio" : "Descanso";
    $("#timer-bar-btn").textContent = timer.running ? "Pausa" : "Seguir";
    document.title = timer.running ? `${clock} · ${BASE_TITLE}` : BASE_TITLE;
  }

  function pushUndo() {
    try { undoStack.push(JSON.stringify(state)); if (undoStack.length > 20) undoStack.shift(); } catch {}
  }
  function undo() {
    const prev = undoStack.pop();
    if (!prev) { toast("Nada que deshacer"); return; }
    state = JSON.parse(prev); render(); toast("Deshecho");
  }
  function openCapture() { $("#capture").hidden = false; setTimeout(() => $("#capture-text")?.focus(), 30); }
  function closeCapture() { $("#capture").hidden = true; if ($("#capture-text")) $("#capture-text").value = ""; }
  function captureText() { return ($("#capture-text")?.value || "").trim(); }
  function captureToInbox() {
    const t = captureText(); if (!t) return;
    state.inbox = state.inbox || [];
    state.inbox.unshift({ id: uid(), text: t, createdAt: Date.now() });
    ensureProgress(); state.progress.flags = { ...(state.progress.flags || {}), captured: true };
    grantXP(4, "Captura"); checkAchievements();
    closeCapture(); toast("En bandeja"); render();
  }
  function closeMore() {
    const s = $("#more-sheet");
    if (s) s.hidden = true;
    $("#app")?.classList.remove("more-open");
  }
  function icsEscape(s) {
    return String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  }
  function icsFold(line) {
    // RFC 5545: líneas de más de 75 octetos se pliegan con CRLF + espacio
    const out = [];
    let rest = String(line);
    while (rest.length > 73) { out.push(rest.slice(0, 73)); rest = " " + rest.slice(73); }
    out.push(rest);
    return out.join("\r\n");
  }
  function icsStamp(d) {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  }
  // Formato local (sin Z) y coherente con un DTSTART en hora local.
  function icsLocalStamp(d) {
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
  }
  function exportICS() {
    const now = new Date();
    const lines = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
      "PRODID:-//Aula SMR//ES", `X-WR-CALNAME:${icsEscape(state.settings.courseName || "Aula SMR")}`,
    ];
    const addEvent = (uidVal, dateISO, startHHMM, mins, summary, desc, subj) => {
      const start = `${dateISO.replace(/-/g, "")}T${(startHHMM || "09:00").replace(":", "")}00`;
      const end = new Date(new Date(`${dateISO}T${startHHMM || "09:00"}:00`).getTime() + mins * 60000);
      lines.push("BEGIN:VEVENT",
        `UID:${uidVal}@aula-smr`,
        `DTSTAMP:${icsStamp(now)}`,
        `DTSTART:${start}`,
        `DTEND:${icsLocalStamp(end)}`,
        `SUMMARY:${icsEscape(summary)}`);
      if (desc) lines.push(`DESCRIPTION:${icsEscape(desc)}`);
      if (subj) lines.push(`CATEGORIES:${icsEscape(subj)}`);
      lines.push("BEGIN:VALARM", "TRIGGER:-PT30M", "ACTION:DISPLAY", `DESCRIPTION:${icsEscape(summary)}`, "END:VALARM", "END:VEVENT");
    };
    state.exams.forEach((e) => {
      if (!e.date) return;
      addEvent(e.id, e.date, e.time || "09:00", 60, e.title, e.notes || e.location || "", subjectName(e.subjectId));
    });
    state.tasks.filter((x) => !x.done && x.due).forEach((x) => {
      // Un evento de día completo necesita DTEND: el día siguiente.
      const diaSig = new Date(x.due + "T12:00:00");
      diaSig.setDate(diaSig.getDate() + 1);
      lines.push("BEGIN:VEVENT", `UID:${x.id}@aula-smr`, `DTSTAMP:${icsStamp(now)}`,
        `DTSTART;VALUE=DATE:${x.due.replace(/-/g, "")}`,
        `DTEND;VALUE=DATE:${localISO(diaSig).replace(/-/g, "")}`,
        `SUMMARY:${icsEscape("Entrega: " + x.title)}`,
        `CATEGORIES:${icsEscape(subjectName(x.subjectId))}`,
        "END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    const body = lines.map(icsFold).join("\r\n") + "\r\n";
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([body], { type: "text/calendar;charset=utf-8" }));
    a.download = "aula-smr.ics"; a.click();
    toast("Calendario exportado (" + (state.exams.length + state.tasks.filter((x) => !x.done && x.due).length) + " eventos)");
    ensureProgress(); state.progress.flags = { ...(state.progress.flags || {}), exported: true }; checkAchievements(); save();
  }
  function noteToCards() {
    persistNoteNow();
    const n = state.notes.find((x) => x.id === noteId);
    if (!n) return;
    let added = 0;
    (n.content || "").split("\n").forEach((line) => {
      const m = line.replace(/^[-*]\s+/, "").trim();
      if (!m || !m.includes("::")) return;
      const p = m.split("::");
      state.cards.push({ id: uid(), subjectId: n.subjectId, front: p[0].trim(), back: p.slice(1).join("::").trim(), due: todayISO(), interval: 0, reps: 0 });
      added++;
    });
    toast(added ? `${added} fichas` : "Usa líneas «- pregunta :: respuesta»");
    if (added) { cardQueue = []; go("cards"); }
  }
  function jumpDay(iso) {
    const exams = state.exams.filter((e) => e.date === iso);
    const tasks = state.tasks.filter((t) => t.due === iso && !t.done);
    const classes = eventsOnDate(iso);
    const hol = holidayName(iso);
    openModal("Agenda", `
      <p style="color:var(--muted)">${fmtDateLong(iso)}</p>
      ${hol ? `<p class="idle-note">${esc(hol)} · no lectivo</p>` : ""}
      <h3>Clases</h3>${hol ? "<p>Sin clase (festivo).</p>" : (classes.map((e) => `<div>${esc(subjectName(e.subjectId))} ${e.start}</div>`).join("") || "<p>Ninguna.</p>")}
      <h3>Exámenes</h3>${exams.map((e) => `<div>${esc(e.title)}</div>`).join("") || "<p>Ninguno.</p>"}
      <h3>Tareas</h3>${tasks.map((t) => `<div>${esc(t.title)}</div>`).join("") || "<p>Ninguna.</p>"}
    `, { confirm: "Cerrar", onSubmit: closeModal });
  }

  function collectCmd(q) {
    q = (q || "").trim().toLowerCase();
    const hit = (s) => !q || String(s || "").toLowerCase().includes(q);
    const out = [];
    const acc = (title, run) => { if (hit(title)) out.push({ kind: "Ir", title, run }); };
    acc("Captura rápida", openCapture);
    acc("Nuevo examen", () => addExam());
    acc("Nueva nota", addNote);
    acc("Nueva tarea", () => addTask());
    acc("Nueva ficha", () => addCard());
    acc("Nueva clase en el horario", () => addEvent());
    acc("Registrar estudio a mano", logSession);
    acc("Temporizador", () => go("timer"));
    acc("Tablero kanban", () => go("kanban"));
    acc("Calendario y horario", () => go("schedule"));
    acc("Calificaciones", () => go("rendimiento"));
    acc("Estadísticas", () => go("stats"));
    acc("Logros", () => go("achievements"));
    acc("Repaso rápido", () => go("quickreview"));
    acc("Modo examen", () => go("examode"));
    acc("Herramientas SMR", () => go("tools"));
    acc("Ajustes", () => go("settings"));
    acc("Deshacer el último cambio", undo);
    acc("Cambiar a tema claro/oscuro", () => { state.settings.uiTheme = state.settings.uiTheme === "light" ? "dark" : "light"; applyTheme(); save(); toast(state.settings.uiTheme === "light" ? "Tema claro" : "Tema oscuro"); });
    acc("Iniciar bloque de estudio", () => { go("timer"); toggleTimer(); });
    acc("Siguiente tema visual", cycleSkin);

    if (q) {
      state.notes.forEach((n) => {
        const visible = !(n.locked && !unlockedNotes.has(n.id));
        if (hit(n.title) || (visible && hit(notePlain(n)))) out.push({ kind: "Nota", title: n.title || "Sin título", run: () => { noteId = n.id; go("notes"); } });
      });
      state.exams.forEach((e) => { if (hit(e.title)) out.push({ kind: "Examen", title: e.title, run: () => { examFilter = e.subjectId || "all"; go("exams"); } }); });
      state.tasks.forEach((x) => { if (hit(x.title)) out.push({ kind: "Tarea", title: x.title, run: () => go("tasks") }); });
      state.subjects.forEach((s) => { if (hit(s.name)) out.push({ kind: "Módulo", title: s.name, run: () => { subjectFocus = s.id; go("subjects"); } }); });
      state.cards.forEach((c) => { if (hit(c.front)) out.push({ kind: "Ficha", title: c.front, run: () => { cardFilter = c.subjectId || "all"; cardQueue = [c]; go("cards"); } }); });
      state.glossary.forEach((g) => { if (hit(g.term)) out.push({ kind: "Glosario", title: g.term, run: () => go("glossary") }); });
      if (window.AulaStudio && typeof window.AulaStudio.toolCatalog === "function") {
        try { window.AulaStudio.toolCatalog().forEach((x) => { if (hit(x.title)) out.push({ kind: "Herramienta", title: x.title, run: x.run }); }); } catch {}
      }
    }
    const prio = { Ir: 0, Módulo: 1, Examen: 1, Tarea: 2, Nota: 2, Ficha: 3, Glosario: 3, Herramienta: 2 };
    return out.slice(0, 14).sort((a, b) => (prio[a.kind] || 9) - (prio[b.kind] || 9));
  }
  function renderCmd() {
    $("#cmdk-list").innerHTML = cmdItems.map((it, i) =>
      `<button class="cmdk-item ${i === cmdIndex ? "is-on" : ""}" data-action="cmd-run" data-i="${i}"><span class="badge">${esc(it.kind)}</span><span>${esc(it.title)}</span></button>`
    ).join("") || `<div class="empty">Sin resultados</div>`;
  }
  function openCmd() { cmdOpen = true; cmdItems = collectCmd(""); cmdIndex = 0; $("#cmdk").hidden = false; $("#cmdk-input").value = ""; renderCmd(); setTimeout(() => $("#cmdk-input").focus(), 20); }
  function closeCmd() { cmdOpen = false; $("#cmdk").hidden = true; }

  function go(v) {
    persistNoteNow();
    const anterior = view;
    view = v;
    $("#sidebar")?.classList.remove("open");
    $("#overlay").classList.remove("menu-on");
    $("#overlay").hidden = true;
    closeCmd(); closeMore();
    // Con pushState, el gesto/botón "atrás" del móvil vuelve a la vista anterior
    try {
      const actual = (location.hash || "").replace("#", "");
      if (anterior && anterior !== v && actual !== v) history.pushState({ v }, "", "#" + v);
      else history.replaceState({ v }, "", "#" + v);
    } catch {}
    render();
    window.scrollTo(0, 0);
  }
  function quickAdd() {
    const map = { dashboard: openCapture, schedule: () => addEvent(), exams: () => addExam(), notes: addNote, cards: () => addCard(), tasks: () => addTask(), timer: logSession, inbox: openCapture, subjects: () => addSubject(), subject: addNote };
    (map[view] || openCapture)();
  }
  function logSession() {
    if (!needSubjects()) return;
    openModal("Registrar estudio", `
      <div class="field"><label>Módulo</label><select name="subjectId">${subjectOptions(timer.subjectId)}</select></div>
      <div class="form-row">
        <div class="field"><label>Minutos</label><input name="minutes" type="number" min="1" value="30" /></div>
        <div class="field"><label>Fecha</label><input name="date" type="date" value="${todayISO()}" /></div>
      </div>
    `, {
      onSubmit(data) {
        const mins = clamp(Math.round(Number(data.minutes) || 0), 1, 600);
        const hoy = todayISO();
        const fecha = asISO(data.date) || hoy;
        if (fecha > hoy) { toast("No puedes registrar estudio en el futuro"); return; }
        state.sessions.push({ id: uid(), subjectId: data.subjectId, date: fecha, minutes: mins, type: "manual", hour: new Date().getHours(), createdAt: Date.now() });
        checkAchievements(); closeModal(); render();
      },
    });
  }
  function cycleSkin() {
    const i = SKINS.findIndex((s) => s.id === (state.settings.skin || "hub"));
    state.settings.skin = SKINS[(i + 1) % SKINS.length].id;
    applyTheme(); save();
    toast(SKINS.find((s) => s.id === state.settings.skin).name);
    if (view === "settings") render();
  }
  function isStandalone() {
    try {
      return window.matchMedia("(display-mode: standalone)").matches
        || window.matchMedia("(display-mode: fullscreen)").matches
        || window.navigator.standalone === true;
    } catch { return false; }
  }
  function installHint() {
    const ua = navigator.userAgent || "";
    const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const android = /Android/i.test(ua);
    if (ios) return { os: "ios", short: "Safari → Compartir → Añadir a pantalla de inicio", detail: "En el iPhone abre esta página en Safari (no Chrome). Toca Compartir y elige «Añadir a pantalla de inicio». Saldrá el icono de Aula SMR." };
    if (android) return { os: "android", short: "Chrome → menú ⋮ → Instalar app", detail: "En Android ábrela en Chrome. Menú ⋮ → Instalar aplicación (o Añadir a pantalla de inicio). Si no sale, sirve la carpeta por HTTP en la red local, no como archivo." };
    return { os: "desktop", short: "Chrome o Edge → icono Instalar en la barra", detail: "En el ordenador, Chrome o Edge muestran un icono de instalar en la barra de direcciones. También: menú → Instalar Aula SMR." };
  }
  function installPwa() {
    if (isStandalone()) { toast("Ya está instalada"); return; }
    if (deferredInstall) {
      deferredInstall.prompt();
      try {
        deferredInstall.userChoice.then((c) => { if (c && c.outcome === "accepted") deferredInstall = null; }).catch(() => {});
      } catch {}
      return;
    }
    toast(installHint().short);
    if (view !== "settings") go("settings");
  }
  function doWipe() {
    pushUndo();
    // Todo lo que ha escrito la app en este dispositivo, no solo la clave principal.
    try {
      const kill = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && (k.startsWith("aula.") || k === KEY || k === BACKUP_KEY)) kill.push(k);
      }
      kill.forEach((k) => localStorage.removeItem(k));
    } catch {}
    if (mediaOk()) Media().clear();
    if ("caches" in window) {
      try { caches.keys().then((keys) => keys.filter((k) => !k.startsWith("aula-app-icon")).forEach((k) => caches.delete(k))); } catch {}
    }
    state = defaultState();
    state.settings.demo = false;
    noteId = null;
    view = "dashboard";
    render();
    toast("Todo borrado, también las copias");
  }
  // La copia tiene que ser completa: si las fotos viven en IndexedDB, se traen
  // y se meten dentro del JSON antes de descargarlo.
  async function exportJSON() {
    toast("Preparando la copia…");
    const copia = JSON.parse(JSON.stringify(state));
    let fotos = 0;
    if (mediaOk()) {
      for (const n of copia.notes) {
        for (const a of (n.attachments || [])) {
          if (a.data) continue;
          try {
            const data = await Media().dataURL(a.id);
            if (data) { a.data = data; fotos++; }
          } catch {}
        }
      }
    }
    const json = JSON.stringify(copia, null, 2);
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
    a.download = "aula-smr.json"; a.click();
    ensureProgress(); state.progress.flags = { ...(state.progress.flags || {}), exported: true }; checkAchievements(); save();
    const mb = json.length / (1024 * 1024);
    toast(mb > 20 ? `Copia de ${mb.toFixed(1)} MB (incluye ${fotos} fotos)` : "Copia descargada" + (fotos ? ` con ${fotos} fotos` : ""));
  }
  function importJSON() {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "application/json,.json";
    inp.onchange = () => {
      const f = inp.files[0]; if (!f) return;
      if (f.size > 12_000_000) { toast("Ese archivo es demasiado grande"); return; }
      const r = new FileReader();
      r.onload = () => {
        let parsed = null;
        try { parsed = JSON.parse(r.result); } catch { toast("El archivo no es un JSON válido"); return; }
        if (!parsed || typeof parsed !== "object") { toast("El archivo no tiene datos de Aula SMR"); return; }
        const resumen = `Trae ${(parsed.subjects || []).length} módulos, ${(parsed.exams || []).length} exámenes, ${(parsed.notes || []).length} notas y ${(parsed.tasks || []).length} tareas.`;
        ask("Importar copia", `${resumen} Se sustituyen los datos actuales. Si te arrepientes, usa Deshacer.`, () => {
          pushUndo();
          const nuevo = sanitize(parsed);
          // Los datos del archivo manda, pero el tema y los avisos del móvil se respetan
          nuevo.settings.uiTheme = state.settings.uiTheme || nuevo.settings.uiTheme;
          state = nuevo;
          noteId = state.notes[0] ? state.notes[0].id : null;
          loadProblem = "";
          save();
          migrateMedia().then(() => render());
          toast("Copia importada"); render();
        });
      };
      r.readAsText(f);
    };
    inp.click();
  }
  /* Repetición espaciada SM-2 (la de Anki/SuperMemo), con la escala resumida:
     0 otra vez · 3 difícil · 4 bien · 5 fácil.
     Antes se multiplicaba el intervalo por 2 o 3.5 sin más: las fichas se iban
     a meses sin haberlas aprendido de verdad. */
  function sm2(card, q) {
    let ease = clamp(Number(card.ease) || 2.5, 1.3, 3.2);
    let reps = Math.max(0, Number(card.reps) || 0);
    let interval = Math.max(0, Number(card.interval) || 0);
    let lapses = Math.max(0, Number(card.lapses) || 0);
    if (q < 3) {
      reps = 0;
      interval = 0;
      lapses += 1;
      ease = clamp(ease - 0.2, 1.3, 3.2);
    } else {
      ease = clamp(ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)), 1.3, 3.2);
      reps += 1;
      if (reps === 1) interval = q === 3 ? 1 : q === 4 ? 1 : 4;
      else if (reps === 2) interval = q >= 4 ? 6 : 3;
      else interval = Math.round(Math.max(1, interval) * ease * (q === 3 ? 0.8 : 1));
      if (q === 5) interval = Math.round(interval * 1.15);
      interval = clamp(interval, 1, 3650);
    }
    return { ease: Number(ease.toFixed(2)), reps, interval, lapses };
  }
  function cardDue(card, interval) {
    if (!interval) return todayISO();
    const d = new Date(); d.setDate(d.getDate() + interval);
    return localISO(d);
  }
  function cardState(card) {
    const r = Number(card.reps) || 0;
    if (r === 0) return "nueva";
    if ((Number(card.interval) || 0) < 7) return "aprendiendo";
    if ((Number(card.interval) || 0) < 21) return "joven";
    return "madura";
  }
  // Cuánto tardará en volver, para poder enseñarlo en cada botón
  function nextLabel(card, q) {
    const r = sm2(card, q);
    if (!r.interval) return "hoy";
    return r.interval === 1 ? "mañana" : r.interval + " días";
  }
  function gradeCard(q) {
    const cur = cardQueue[0]; if (!cur) return;
    const card = state.cards.find((c) => c.id === cur.id); if (!card) return;
    const antes = { ...card };
    const r = sm2(card, q);
    card.ease = r.ease; card.reps = r.reps; card.interval = r.interval; card.lapses = r.lapses;
    card.due = cardDue(card, r.interval);
    card.last = todayISO();
    card.history = [{ t: Date.now(), q }].concat(card.history || []).slice(0, 20);
    cardQueue.shift();
    // Si ha fallado, vuelve al final de la ronda de hoy
    if (q < 3) cardQueue.push({ ...card, ...{ interval: 0, due: todayISO() } });
    cardFlip = false;
    if (q >= 3) grantXP(q === 5 ? 12 : q === 4 ? 8 : 5, q === 5 ? "Ficha fácil" : q === 4 ? "Ficha bien" : "Ficha difícil");
    if (q < 3) noteOnce("fallo-" + card.id + "-" + todayISO(), "Ficha fallada", `«${card.front.slice(0, 40)}» vuelve hoy. Con calma.`);
    checkAchievements(); save();
    toast(q < 3 ? "Vuelve hoy · " + (card.lapses || 1) + " fallo(s)" : "Hecho · vuelve en " + (r.interval === 1 ? "1 día" : r.interval + " días"));
    render();
    void antes;
  }
  function planToTasks() {
    const exams = [...state.exams].filter((e) => daysUntil(e.date) >= 0);
    let n = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const iso = localISO(d);
      exams.forEach((ex) => {
        if (iso === ex.date) return;
        const title = `Estudiar — ${ex.title}`;
        if (!state.tasks.some((t) => t.title === title && t.due === iso)) {
          state.tasks.push({ id: uid(), subjectId: ex.subjectId, title, due: iso, done: false, priority: "media" });
          n++;
        }
      });
    }
    ensureProgress(); state.progress.flags = { ...(state.progress.flags || {}), planned: true };
    if (n) grantXP(10, "Plan a tareas");
    checkAchievements();
    toast(n ? `${n} tareas` : "Ya estaban");
    go("tasks");
  }
  function num(id, fb) { const el = $(id); if (!el) return fb; const n = Number(el.value); return Number.isFinite(n) ? n : fb; }
  function on(id) { const el = $(id); return el ? !!el.checked : undefined; }
  function saveSettings() {
    const st = state.settings;
    if ($("#set-name")) st.name = $("#set-name").value.trim();
    if ($("#set-course")) st.courseName = $("#set-course").value.trim();
    if ($("#set-center")) st.center = $("#set-center").value.trim();
    if ($("#set-group")) st.group = $("#set-group").value.trim();
    if ($("#set-start")) st.startDate = $("#set-start").value;
    if ($("#set-end")) st.endDate = $("#set-end").value;
    if (st.startDate && st.endDate && st.endDate < st.startDate) {
      toast("La fecha de fin no puede ser anterior al inicio");
      return;
    }
    if ($("#set-startview")) st.startView = $("#set-startview").value;
    if ($("#set-uisize")) st.uiSize = $("#set-uisize").value;
    const cmp = on("#set-compact"); if (cmp !== undefined) st.compact = cmp;
    const m = on("#set-motion"); if (m !== undefined) st.reduceMotion = m;
    const x = on("#set-showxp"); if (x !== undefined) st.showXp = x;
    const md = on("#set-showmedals"); if (md !== undefined) st.showMedals = md;
    const w = on("#set-showweek"); if (w !== undefined) st.showWeekStrip = w;
    if ($("#set-goal")) st.dailyGoal = num("#set-goal", 90);
    if ($("#set-weekdays")) st.weekGoalDays = num("#set-weekdays", 5);
    if ($("#set-defhours")) st.defaultHours = num("#set-defhours", 8);
    if ($("#set-grademax")) st.gradeMax = num("#set-grademax", 10);
    if ($("#set-prio")) st.defaultPrio = $("#set-prio").value;
    const sat = on("#set-sat"); if (sat !== undefined) st.includeSaturday = sat;
    const att = on("#set-att"); if (att !== undefined) st.showAttendance = att;
    const hc = on("#set-hideok"); if (hc !== undefined) st.hideCompleted = hc;
    if ($("#set-work")) st.pomodoroWork = num("#set-work", 25);
    if ($("#set-break")) st.pomodoroBreak = num("#set-break", 5);
    if ($("#set-long")) st.pomodoroLong = num("#set-long", 15);
    if ($("#set-cycles")) st.cyclesUntilLong = num("#set-cycles", 4);
    const snd = on("#set-sound"); if (snd !== undefined) st.sound = snd;
    const vb = on("#set-vibrate"); if (vb !== undefined) st.vibrate = vb;
    const cf = on("#set-confetti"); if (cf !== undefined) st.confetti = cf;
    const an = on("#set-autonext"); if (an !== undefined) st.autoNext = an;
    const aw = on("#set-awake"); if (aw !== undefined) st.keepAwake = aw;
    const tb = on("#set-tbar"); if (tb !== undefined) st.showTimerBar = tb;
    if ($("#set-remindh")) st.remindHour = num("#set-remindh", 8);
    if ($("#set-lead")) st.examLeadDays = num("#set-lead", 1);
    const ncl = on("#set-nclass"); if (ncl !== undefined) st.notifyClass = ncl;
    const ne = on("#set-nex"); if (ne !== undefined) st.notifyExams = ne;
    const nt = on("#set-nta"); if (nt !== undefined) st.notifyTasks = nt;
    const nc = on("#set-nca"); if (nc !== undefined) st.notifyCards = nc;
    if ($("#set-starth")) st.startHour = num("#set-starth", 8);
    if ($("#set-endh")) st.endHour = num("#set-endh", 21);
    const cd = on("#set-confirm"); if (cd !== undefined) st.confirmDelete = cd;
    const at = on("#set-autoth"); if (at !== undefined) st.autoTheme = at;
    const nr = on("#set-night"); if (nr !== undefined) st.nightRemind = nr;
    const ms = on("#set-morn"); if (ms !== undefined) st.morningSummary = ms;
    const av = on("#set-avatar"); if (av !== undefined) st.avatarOn = av;
    if ($("#set-pin")) st.pin = $("#set-pin").value;
    if ($("#set-inact")) st.inactivityDays = num("#set-inact", 5);
    if (!timer.running) setMode(timer.mode, true);
    applyTheme();
    toast("Ajustes guardados");
    render();
  }

  // Quita una foto de la nota abierta: del texto, del estado y del almacén de archivos.
  // (Antes esto estaba duplicado en el manejador de clics y se ejecutaba dos veces.)
  function quitarFotoDeNota(id) {
    const n = state.notes.find((x) => x.id === noteId);
    if (!n) return;
    n.attachments = (n.attachments || []).filter((a) => a.id !== id);
    const limpio = String(id || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    n.content = String(n.content || "").replace(new RegExp("!\\[[^\\]]*\\]\\(aula-img:" + limpio + "\\)\\n?", "g"), "");
    if (mediaOk()) Media().del(id);
    save(); render(); toast("Foto quitada");
  }

  // Fotos de una nota que viven en el almacén de archivos (para soltarlas al borrar del todo)
  function fotosDeNota(n) {
    return ((n && n.attachments) || []).map((a) => a.id).filter(Boolean);
  }
  function soltarFotos(n) {
    if (!mediaOk() || !n) return;
    fotosDeNota(n).forEach((id) => Media().del(id));
  }

  document.addEventListener("click", (e) => {
    if (e.target.closest(".search-wrap")) { openCmd(); return; }
    const nav = e.target.closest("[data-view]");
    if (nav && nav.dataset.view && (nav.classList.contains("nav-item") || nav.closest("#bottom-nav") || nav.closest("#more-sheet"))) {
      closeMore(); go(nav.dataset.view); return;
    }
    const btn = e.target.closest("[data-action]");
    if (!btn) {
      if (cmdOpen && !e.target.closest(".cmdk-box")) closeCmd();
      return;
    }
    const action = btn.dataset.action, id = btn.dataset.id;
    if (action === "close-modal") closeModal();
    if (action === "skin-cat") { skinCat = id; render(); }
    if (action === "ex-cancel") {
      const fecha = $("#ex-date")?.value || todayISO();
      const ev = $("#ex-event")?.value;
      if (!ev) { toast("Ese día no hay clase que quitar"); return; }
      setException({ kind: "cancel", date: fecha, eventId: ev });
      toast("Apuntado: sin clase ese día"); render();
    }
    if (action === "ex-move") {
      const fecha = $("#ex-date")?.value || todayISO();
      const ev = state.events.find((x) => x.id === ($("#ex-event")?.value || ""));
      if (!ev) { toast("Elige una clase"); return; }
      openModal("Mover la clase", `<p>${esc(subjectName(ev.subjectId))} del ${esc(fmtDateLong(fecha))} pasa a otro horario (solo ese día).</p>
        <div class="form-row">
          <div class="field"><label>Empieza</label><input name="start" type="time" value="${ev.start}" required></div>
          <div class="field"><label>Termina</label><input name="end" type="time" value="${ev.end}" required></div>
        </div>
        <div class="field"><label>Aula</label><input name="room" value="${esc(ev.room || "")}" placeholder="La de siempre" /></div>`, {
        confirm: "Mover ese día",
        onSubmit(data) {
          if (data.start >= data.end) { toast("La hora de fin debe ser posterior"); return; }
          setException({ kind: "move", date: fecha, eventId: ev.id, start: data.start, end: data.end, room: data.room || ev.room || "" });
          closeModal(); toast("Clase movida solo ese día"); render();
        },
      });
    }
    if (action === "ex-extra") {
      const fecha = $("#ex-date")?.value || todayISO();
      openModal("Clase extra", `<p>Una clase que no está en el horario fijo y solo pasa el ${esc(fmtDateLong(fecha))}.</p>
        <div class="field"><label>Módulo</label><select name="subjectId">${subjectOptions("")}</select></div>
        <div class="form-row">
          <div class="field"><label>Empieza</label><input name="start" type="time" value="15:00" required></div>
          <div class="field"><label>Termina</label><input name="end" type="time" value="16:00" required></div>
        </div>
        <div class="field"><label>Nota</label><input name="note" placeholder="Recuperación, charla…" /></div>`, {
        confirm: "Añadir a ese día",
        onSubmit(data) {
          if (data.start >= data.end) { toast("La hora de fin debe ser posterior"); return; }
          setException({ kind: "extra", date: fecha, subjectId: data.subjectId, start: data.start, end: data.end, note: data.note || "Clase extra" });
          closeModal(); toast("Clase extra apuntada"); render();
        },
      });
    }
    if (action === "ex-holiday") {
      const fecha = $("#ex-date")?.value || todayISO();
      openModal("Marcar como no lectivo", `<p>Ese día desaparecen las clases (${esc(fmtDateLong(fecha))}). Útil para fiestas locales que no vienen en el calendario.</p>
        <div class="field"><label>Motivo</label><input name="note" placeholder="Fiesta local, excursión…" /></div>`, {
        confirm: "Marcar festivo",
        onSubmit(data) { setException({ kind: "holiday", date: fecha, note: data.note || "No lectivo" }); closeModal(); toast("Día marcado"); render(); },
      });
    }
    if (action === "ex-del") {
      state.exceptions = excepciones().filter((x) => x.id !== id);
      save(); render(); toast("Cambio quitado");
    }
    if (action === "study-block") {
      const mins = clamp(Number(btn.dataset.min) || 45, 10, 180);
      const hoy = Number(btn.dataset.day) === weekdayMon0(new Date());
      openModal("Hueco libre · " + mins + " min", `
        <div class="field"><label>Módulo</label><select id="sb-subject">${subjectOptions("")}</select></div>
        <div class="field"><label>Minutos</label><input id="sb-min" type="number" min="10" max="180" value="${mins}"></div>
        <p class="hint">${hoy ? "Puedes poner el temporizador ahora mismo o apuntarlo como tarea." : "Este día no es hoy: se apunta como tarea."}</p>`,
        {
          confirm: hoy ? "Empezar a estudiar" : "Apuntar tarea",
          onSubmit(data) {
            const m = clamp(Number(data["sb-min"] || $("#sb-min")?.value) || mins, 10, 180);
            const sid = data["sb-subject"] || $("#sb-subject")?.value || "";
            if (hoy) {
              timer.subjectId = sid;
              timer.mode = "work"; timer.total = m * 60; timer.remaining = m * 60; timer.running = false; timer.endsAt = 0;
              closeModal(); go("timer"); toggleTimer();
              toast("Bloque de " + m + " min");
            } else {
              state.tasks.push({ id: uid(), subjectId: sid, title: `Estudiar ${m} min`, due: todayISO(), priority: "media", done: false });
              closeModal(); save(); render(); toast("Tarea apuntada");
            }
          },
        });
    }
    if (action === "restore-backup") restoreBackup();
    if (action === "dismiss-load-problem") { loadProblem = ""; render(); }
    if (action === "restore-timetable") {
      ask("Restaurar horario oficial", "Se sustituyen tus clases actuales por la plantilla de 2.º SMR. Tus exámenes, notas y tareas no se tocan.", () => {
        pushUndo();
        applyOfficialTimetable(state);
        save(); toast("Horario oficial restaurado"); render();
      });
      return;
    }
    if (action === "note-unlock") {
      const v = ($("#note-pin-input") || {}).value || "";
      if (checkPin(v)) { unlockedNotes.add(noteId); toast("Nota desbloqueada"); }
      else toast("PIN incorrecto");
      render();
    }
    if (action === "quick-add") quickAdd();
    if (action === "open-cmd") openCmd();
    if (action === "cmd-run") { const it = cmdItems[Number(btn.dataset.i)]; closeCmd(); it?.run(); }
    if (action === "go") go(btn.dataset.to);
    if (action === "toggle-theme") {
      state.settings.uiTheme = (state.settings.uiTheme === "light") ? "dark" : "light";
      applyTheme(); save();
    }
    if (action === "set-avatar") {
      collectOnboard();
      state.settings.avatarIcon = id;
      save(); render();
    }
    if (action === "add-avatar") {
      collectOnboard();
      addAvatarPhoto("avatar");
    }
    if (action === "set-app-icon") {
      state.settings.appIcon = id;
      save();
      applyAppIcon();
      render();
      if (isNativeShell() && !String(id).startsWith("c:")) {
        nativeSetIcon(id).then((ok) => toast(ok ? "Icono del escritorio cambiado" : "No se pudo cambiar el icono"));
      } else if (isNativeShell()) {
        toast("La foto queda en la app. Para el escritorio elige una criatura.");
      } else {
        toast("Icono elegido. Pulsa «Aplicar en el escritorio».");
      }
    }
    if (action === "apply-desktop-icon") applyDesktopIcon();
    if (action === "add-app-icon") addAvatarPhoto("app");
    if (action === "app-icon-from-profile") {
      const src = avatarSrc(state.settings.avatarIcon);
      if (!src) { toast("Elige primero una foto de perfil"); return; }
      state.settings.appIcon = state.settings.avatarIcon;
      save(); applyAppIcon(); render();
      if (isNativeShell() && !String(state.settings.appIcon).startsWith("c:")) {
        nativeSetIcon(state.settings.appIcon).then((ok) => toast(ok ? "Icono del escritorio cambiado" : "No se pudo cambiar el icono"));
      } else if (isNativeShell()) {
        toast("La foto queda en la app. Para el escritorio elige una criatura.");
      } else {
        toast("La app usará tu foto de perfil. Pulsa «Aplicar en el escritorio».");
      }
    }
    if (action === "del-avatar") {
      e.preventDefault();
      e.stopPropagation();
      const list = state.settings.customAvatars || [];
      state.settings.customAvatars = list.filter((x) => x.id !== id);
      if (state.settings.avatarIcon === "c:" + id) state.settings.avatarIcon = "letter";
      if (state.settings.appIcon === "c:" + id) { state.settings.appIcon = "dragon"; applyAppIcon(); }
      save(); render();
    }
    if (action === "voice-fab") toggleVoice();
    if (action === "nlp-text") { const t = captureText(); if (t) { closeCapture(); processNLP(t); } }
    if (action === "sch-view") { schView = btn.dataset.mode; render(); }
    if (action === "sch-day") { schDay = Number(id); render(); }
    if (action === "agenda-filter") { agendaFilter = id; render(); }
    if (action === "open-mod") { subjectFocus = id; go("subject"); }
    if (action === "sim-run") { /* live via input */ }
    if (action === "set-skin") { state.settings.skin = id; applyTheme(); checkAchievements(); save(); render(); }
    if (action === "add-exam") addExam();
    if (action === "edit-exam") addExam(state.exams.find((x) => x.id === id));
    if (action === "delete-exam") { const goDel = () => { pushUndo(); state.exams = state.exams.filter((x) => x.id !== id); render(); }; state.settings.confirmDelete === false ? goDel() : ask("Eliminar examen", "Se quita de la lista.", goDel); }
    if (action === "exam-tab") { examTab = btn.dataset.tab; render(); }
    if (action === "exam-filter") { examFilter = id; render(); }
    if (action === "cal-prev") { calendarCursor.setMonth(calendarCursor.getMonth() - 1); render(); }
    if (action === "cal-next") { calendarCursor.setMonth(calendarCursor.getMonth() + 1); render(); }
    if (action === "cal-day") { if (!e.target.closest("[data-action='edit-exam']")) addExam(null, { date: btn.dataset.date }); }
    if (action === "add-event") addEvent();
    if (action === "edit-event") addEvent(state.events.find((x) => x.id === id));
    if (action === "slot-add") { const h = Number(btn.dataset.hour); addEvent(null, { day: Number(btn.dataset.day), start: `${pad(h)}:00`, end: `${pad(h + 1)}:00` }); }
    if (action === "delete-event") { state.events = state.events.filter((x) => x.id !== id); closeModal(); render(); }
    if (action === "add-subject") addSubject();
    if (action === "edit-subject") addSubject(state.subjects.find((x) => x.id === id));
    if (action === "open-subject") { subjectFocus = id; go("subject"); }
    if (action === "delete-subject") ask("Eliminar módulo", "Los datos quedan sueltos.", () => { pushUndo(); state.subjects = state.subjects.filter((x) => x.id !== id); closeModal(); render(); });
    if (action === "pick-color") { const val = $("#color-val"); if (val) val.value = btn.dataset.color; $$(".color-picks button").forEach((b) => b.classList.toggle("is-on", b === btn)); }
    if (action === "add-note") addNote();
    if (action === "open-note") { persistNoteNow(); noteId = id; notePreview = false; view = "notes"; render(); closeCmd(); }
    if (action === "note-filter") { persistNoteNow(); noteFilter = id; render(); }
    if (action === "toggle-pin") { const n = state.notes.find((x) => x.id === noteId); if (n) { n.pinned = !n.pinned; render(); } }
    if (action === "toggle-preview") { persistNoteNow(); notePreview = !notePreview; render(); }
    if (action === "delete-note") ask("Eliminar nota", "Va a la papelera.", () => {
      pushUndo();
      const gone = state.notes.find((x) => x.id === noteId);
      if (gone) { gone.deletedAt = Date.now(); state.trash = state.trash || []; state.trash.unshift(gone); }
      state.notes = state.notes.filter((x) => x.id !== noteId);
      noteId = state.notes[0]?.id || null;
      render();
      toast("A la papelera: puedes recuperarla");
    });
    if (action === "add-task") addTask();
    if (action === "edit-task") addTask(state.tasks.find((x) => x.id === id));
    if (action === "delete-task") { pushUndo(); state.tasks = state.tasks.filter((x) => x.id !== id); render(); }
    if (action === "toggle-task") { const tsk = state.tasks.find((x) => x.id === id); if (tsk) { tsk.done = !tsk.done; if (tsk.done) { grantXP(15, "Tarea hecha"); checkAchievements(); confetti(); buzz(); } render(); } }
    if (action === "task-filter") { taskFilter = id; render(); }
    if (action === "add-card") addCard();
    if (action === "edit-card") addCard(state.cards.find((x) => x.id === id));
    if (action === "delete-card") { state.cards = state.cards.filter((x) => x.id !== id); cardQueue = cardQueue.filter((x) => x.id !== id); render(); }
    if (action === "card-filter") { cardFilter = id; cardQueue = []; cardFlip = false; render(); }
    if (action === "flip-card") { cardFlip = !cardFlip; document.querySelector(".flip")?.classList.toggle("is-back", cardFlip); }
    if (action === "grade-card") gradeCard(Number(btn.dataset.q));
    if (action === "timer-toggle") toggleTimer();
    if (action === "timer-reset") { setMode(timer.mode, true); if (view === "timer") render(); }
    if (action === "timer-mode") { setMode(btn.dataset.mode, true); if (view === "timer") render(); }
    if (action === "timer-skip") completeTimer();
    if (action === "timer-subject-go") { timer.subjectId = id; go("timer"); }
    if (action === "log-session") logSession();
    if (action === "plan-to-tasks") planToTasks();
    if (action === "save-settings") saveSettings();
    if (action === "export") exportJSON();
    if (action === "import") importJSON();
    if (action === "load-demo") { state = seedDemo(); toast("Ejemplo SMR"); render(); }
    if (action === "wipe") {
      const kb = (storageBytes() / 1024).toFixed(0);
      openModal("Borrar todos los datos", `
        <p>Se borran de este dispositivo <b>todo</b>: módulos, horario, exámenes, notas, fichas, sesiones y las copias automáticas. Ocupan <b>${kb} KB</b>.</p>
        <p class="hint">Esto no se puede deshacer desde aquí. Si quieres una copia, descárgala antes.</p>`,
        {
          confirm: "Borrar todo",
          danger: true,
          onSubmit() { closeModal(); doWipe(); },
        });
    }
    if (action === "wipe-backup-only") {
      openModal("Borrar solo las copias", `<p>Se borran las copias automáticas y las instantáneas. Tus datos actuales se quedan como están.</p>`, {
        confirm: "Borrar copias", danger: true,
        onSubmit() {
          try {
            ["aula.snaps", "aula.lastBackup", KEY + ".bak", BAK_AT_KEY].forEach((k) => localStorage.removeItem(k));
          } catch {}
          closeModal(); toast("Copias borradas");
        },
      });
    }
    if (action === "clear-demo") { state = defaultState(); state.settings.demo = false; noteId = null; view = "subjects"; toast("Empieza por Módulos"); render(); }
    if (action === "keep-demo") { state.settings.demo = false; toast("Tus datos"); render(); }
    if (action === "enable-notify") requestNotify();
    if (action === "skip-onboard" || action === "on-finish") {
      collectOnboard();
      const ncl = on("#set-nclass"); if (ncl !== undefined) state.settings.notifyClass = ncl;
      const ne = on("#set-nex"); if (ne !== undefined) state.settings.notifyExams = ne;
      const nt = on("#set-nta"); if (nt !== undefined) state.settings.notifyTasks = nt;
      const nc = on("#set-nca"); if (nc !== undefined) state.settings.notifyCards = nc;
      state.settings.onboarded = true;
      state.settings.demo = false;
      onStep = 0;
      toast(state.settings.name ? ("Hola, " + state.settings.name) : "Listo");
      view = "dashboard";
      render();
    }
    if (action === "on-next") {
      collectOnboard();
      const ncl = on("#set-nclass"); if (ncl !== undefined) state.settings.notifyClass = ncl;
      const ne = on("#set-nex"); if (ne !== undefined) state.settings.notifyExams = ne;
      const nt = on("#set-nta"); if (nt !== undefined) state.settings.notifyTasks = nt;
      const nc = on("#set-nca"); if (nc !== undefined) state.settings.notifyCards = nc;
      if (onStep >= 6) {
        state.settings.onboarded = true;
        state.settings.demo = false;
        onStep = 0;
        toast(state.settings.name ? ("Hola, " + state.settings.name) : "Aula SMR lista");
        view = "dashboard";
      } else onStep += 1;
      save(); render();
    }
    if (action === "on-back") {
      collectOnboard();
      onStep = Math.max(0, onStep - 1);
      render();
    }
    if (action === "on-theme") {
      collectOnboard();
      state.settings.uiTheme = id;
      applyTheme(); save(); render();
    }
    if (action === "on-goal") {
      collectOnboard();
      state.settings.dailyGoal = Number(id) || 90;
      if ($("#on-goal")) $("#on-goal").value = String(state.settings.dailyGoal);
      save(); render();
    }
    if (action === "on-data") {
      collectOnboard();
      const keep = { ...state.settings };
      if (id === "demo") {
        const s = seedDemo();
        s.settings = { ...s.settings, ...keep, demo: true, onboarded: false };
        state = s;
      } else {
        const s = defaultState();
        s.settings = { ...s.settings, ...keep, demo: false, onboarded: false };
        state = s;
      }
      save(); render();
    }
    if (action === "on-import") {
      collectOnboard();
      importJSON();
    }
    if (action === "redo-onboard") {
      onStep = 0;
      state.settings.onboarded = false;
      render();
    }
    if (action === "pin-widget") pinWidget(id);
    if (action === "install-pwa") installPwa();
    if (action === "open-more") {
      const s = $("#more-sheet");
      if (!s) return;
      s.hidden = !s.hidden;
      $("#app")?.classList.toggle("more-open", !s.hidden);
    }
    if (action === "open-capture") { closeMore(); openCapture(); }
    if (action === "close-capture") closeCapture();
    if (action === "capture-inbox") captureToInbox();
    if (action === "capture-task") { const t = captureText(); if (!t) return; closeCapture(); addTask({ title: t, due: todayISO(), priority: "media" }); }
    if (action === "capture-note") {
      const t = captureText(); if (!t || !needSubjects()) return; closeCapture();
      const n = { id: uid(), subjectId: state.subjects[0].id, title: t.slice(0, 48), content: t, pinned: false, createdAt: Date.now(), updatedAt: Date.now() };
      state.notes.unshift(n); noteId = n.id; go("notes");
    }
    if (action === "inbox-del") { pushUndo(); state.inbox = state.inbox.filter((x) => x.id !== id); render(); }
    if (action === "inbox-task") { const it = state.inbox.find((x) => x.id === id); if (it) addTask({ title: it.text, due: todayISO(), priority: "media" }); }
    if (action === "inbox-note") {
      const it = state.inbox.find((x) => x.id === id);
      if (!it || !needSubjects()) return;
      const n = { id: uid(), subjectId: state.subjects[0].id, title: it.text.slice(0, 48), content: it.text, pinned: false, createdAt: Date.now(), updatedAt: Date.now() };
      state.notes.unshift(n); noteId = n.id; state.inbox = state.inbox.filter((x) => x.id !== id); go("notes");
    }
    if (action === "attend") {
      e.preventDefault();
      e.stopPropagation();
      setAttendance(id, todayISO(), btn.dataset.st);
    }
    if (action === "add-check") {
      openModal("Ítem de temario", `<div class="field"><label>Texto</label><input name="text" required /></div>`, {
        confirm: "Añadir",
        onSubmit(data) {
          const ex = state.exams.find((x) => x.id === id);
          if (ex) { ex.checklist = ex.checklist || []; ex.checklist.push({ id: uid(), text: data.text.trim(), done: false }); }
          closeModal(); render();
        },
      });
    }
    if (action === "toggle-check") {
      const ex = state.exams.find((x) => x.id === btn.dataset.eid);
      const item = ex?.checklist?.find((c) => c.id === id);
      if (item) { item.done = !item.done; save(); render(); }
    }
    if (action === "skin-cat") { skinCat = id; render(); }
    if (action === "restore-backup") restoreBackup();
    if (action === "dismiss-load-problem") { loadProblem = ""; render(); }
    if (action === "restore-timetable") {
      openModal("Restaurar el horario oficial", `<p>Se <b>sustituyen</b> tus clases actuales por la plantilla de 2.º SMR (${OFFICIAL_MODS.length} módulos).</p>
        <p class="hint">Exámenes, notas, tareas y sesiones no se tocan. Puedes deshacerlo justo después.</p>`,
        { confirm: "Restaurar horario", onSubmit() {
            pushUndo();
            state.events = [];
            applyOfficialTimetable(state);
            checkAchievements(); save(); closeModal(); render();
            toast("Horario oficial restaurado");
          } });
    }
    if (action === "note-unlock") {
      const v = ($("#note-pin-input") || {}).value || "";
      if (checkPin(v)) { unlockedNotes.add(noteId); toast("Nota desbloqueada"); }
      else toast("PIN incorrecto");
      render();
    }
    if (action === "note-photo-del") quitarFotoDeNota(id);
    if (action === "export-ics") exportICS();
    if (action === "note-to-cards") noteToCards();
    if (action === "toggle-focus") document.body.classList.toggle("focus-mode");
    if (action === "jump-day") jumpDay(btn.dataset.date);
    if (action === "undo") undo();
    if (window.AulaStudio && typeof window.AulaStudio.click === "function") window.AulaStudio.click(action, btn, e);
    if (window.AulaTools && typeof window.AulaTools.click === "function") window.AulaTools.click(action, btn, e);
  });

  document.addEventListener("change", (e) => {
    if (e.target.id === "ex-date") { exDate = e.target.value; render(); return; }
    if (e.target.id === "timer-subject") timer.subjectId = e.target.value;
    if (e.target.dataset.action === "note-subject" && noteId) {
      const n = state.notes.find((x) => x.id === noteId);
      if (n) { n.subjectId = e.target.value; save(); }
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "cmdk-input") { cmdItems = collectCmd(e.target.value); cmdIndex = 0; renderCmd(); }
    if (e.target.id === "note-title" || e.target.id === "note-body") persistNote();
    if (e.target.id === "sim-current" || e.target.id === "sim-weight" || e.target.id === "sim-target") {
      const current = parseFloat($("#sim-current")?.value) || 0;
      const weight = parseInt($("#sim-weight")?.value, 10) || 0;
      const target = parseFloat($("#sim-target")?.value) || 5;
      const disp = $("#sim-target-display"); if (disp) disp.textContent = target.toFixed(1);
      const res = $("#sim-result"); if (!res) return;
      const contrib = current * ((100 - weight) / 100);
      let needed = weight ? (target - contrib) / (weight / 100) : 0;
      if (needed <= 0) { res.textContent = "¡Ya estás!"; res.style.color = "#3b82f6"; }
      else if (needed > 10) { res.textContent = "Imposible"; res.style.color = "#ef4444"; }
      else { res.textContent = needed.toFixed(2); res.style.color = "#10b981"; }
    }
    if (e.target.id === "note-query") {
      noteQuery = e.target.value;
      const keep = e.target.selectionStart;
      render();
      const q = $("#note-query");
      if (q) { q.focus(); try { q.setSelectionRange(keep, keep); } catch {} }
    }
  });

  $("#menu-btn")?.addEventListener("click", () => {
    const open = $("#sidebar").classList.toggle("open");
    $("#overlay").hidden = !open;
    $("#overlay").classList.toggle("menu-on", open);
  });
  $("#overlay").addEventListener("click", () => {
    if ($("#sidebar").classList.contains("open")) {
      $("#sidebar")?.classList.remove("open");
      $("#overlay").classList.remove("menu-on");
      $("#overlay").hidden = true;
      return;
    }
    closeModal();
  });
  $("#more-sheet")?.addEventListener("click", (e) => { if (e.target.id === "more-sheet") closeMore(); });
  $("#capture")?.addEventListener("click", (e) => { if (e.target.id === "capture") closeCapture(); });
  $("#capture-text")?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); captureToInbox(); }
  });

  // Tab dentro de un modal no debe irse a la página de detrás
  document.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      const caja = document.querySelector("#modal-root .modal");
      if (caja) {
        const focos = [...caja.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])")]
          .filter((el) => !el.disabled && el.offsetParent !== null);
        if (focos.length) {
          const primero = focos[0], ultimo = focos[focos.length - 1];
          if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus(); }
          else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus(); }
        }
      }
    }
    if (e.key === "Escape") { closeModal(); closeCmd(); closeCapture(); closeMore(); document.body.classList.remove("focus-mode"); return; }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
      const tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea") return;
      e.preventDefault(); undo(); return;
    }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); cmdOpen ? closeCmd() : openCmd(); return; }
    if (cmdOpen) {
      if (e.key === "ArrowDown") { e.preventDefault(); cmdIndex = Math.min(cmdItems.length - 1, cmdIndex + 1); renderCmd(); }
      if (e.key === "ArrowUp") { e.preventDefault(); cmdIndex = Math.max(0, cmdIndex - 1); renderCmd(); }
      if (e.key === "Enter") { e.preventDefault(); const it = cmdItems[cmdIndex]; closeCmd(); it?.run(); }
      return;
    }
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || tag === "select") return;
    if (e.key.toLowerCase() === "n") { e.preventDefault(); quickAdd(); }
    if (e.key.toLowerCase() === "c") { e.preventDefault(); openCapture(); }
    if (e.key.toLowerCase() === "f") { e.preventDefault(); document.body.classList.toggle("focus-mode"); }
    if (e.code === "Space" && view === "timer") { e.preventDefault(); toggleTimer(); }
  });


  // Sinónimos por módulo: el intérprete de frases deja de adivinar por palabras sueltas.
  const SUBJECT_HINTS = [
    ["seg", ["seguridad", "amenazas", "malware", "ransomware", "cortafuegos", "firewall", "antivirus", "phishing", "hardening", "copias de seguridad", "cifrado"]],
    ["ipe", ["empleabilidad", "itinerario", "curriculum", "contrato", "nomina", "entrevista", "prevencion", "laboral"]],
    ["sor", ["sistemas operativos", "sistema operativo", "active directory", "directorio activo", "gpo", "usuarios", "grupos", "ntfs", "windows server", "ubuntu", "debian", "systemd", "dominio", "virtualizacion", "maquina virtual"]],
    ["ser", ["servicios en red", "dhcp", "dns", "apache", "nginx", "ftp", "correo", "smtp", "imap", "pop3", "ssh", "certificado", "servidor web", "redes", "subnetting", "vlan", "enrutamiento", "cableado"]],
    ["web", ["aplicaciones web", "html", "css", "javascript", "php", "formulario", "formularios", "maquetar", "frontend", "wordpress", "pagina web"]],
    ["pro", ["proyecto", "intermodular", "memoria", "defensa"]],
    ["dig", ["digitalizacion", "transformacion digital"]],
    ["sos", ["sostenibilidad", "medio ambiente", "economia circular", "ods"]],
    ["opt", ["optativo", "optativa"]],
    ["tut", ["tutoria", "tutoría"]],
  ];
  function subjectKeyOf(name) {
    const n = String(name || "").toLowerCase();
    // Solo alias distintivos: evita que "ad" o "cv" casen con cualquier palabra.
    const hit = OFFICIAL_MODS.find((m) => [m.key, ...(m.aliases || [])].some((a) => a.length > 3 && n.includes(a)));
    return hit ? hit.key : "";
  }
  // Pistas fuertes (sinónimos del módulo) + palabras del propio nombre (peso menor).
  function subjectSynonyms() {
    return state.subjects.map((s) => {
      const n = s.name.toLowerCase();
      const key = subjectKeyOf(n);
      const hints = ((SUBJECT_HINTS.find(([k]) => k === key) || [null, []])[1] || []);
      return { id: s.id, hints, words: n.split(/\s+/).filter((w) => w.length > 3) };
    });
  }
  // Devuelve el módulo que mejor encaja o null (nunca inventa uno al azar).
  function matchSubject(lower) {
    let best = null;
    subjectSynonyms().forEach((s) => {
      let score = 0;
      s.hints.forEach((w) => { if (w.length > 2 && lower.includes(w)) score += w.includes(" ") ? 5 : 3; });
      s.words.forEach((w) => { if (lower.includes(w)) score += 1; });
      if (score > 0 && (!best || score > best.score)) best = { id: s.id, score };
    });
    return best ? best.id : null;
  }
  function parseWhen(lower) {
    const d = new Date();
    const dayMap = { lunes: 1, martes: 2, miércoles: 3, miercoles: 3, jueves: 4, viernes: 5, sábado: 6, sabado: 6, domingo: 0 };
    let guess = false;
    if (lower.includes("pasado mañana")) d.setDate(d.getDate() + 2);
    else if (lower.includes("mañana")) d.setDate(d.getDate() + 1);
    else if (/hoy/.test(lower)) { /* hoy */ }
    else if (/\b(\d{1,2})\s*(?:\/|-)\s*(\d{1,2})\b/.test(lower)) {
      const m = lower.match(/\b(\d{1,2})\s*(?:\/|-)\s*(\d{1,2})\b/);
      const y = new Date().getFullYear();
      const cand = new Date(y, Number(m[2]) - 1, Number(m[1]));
      if (cand.getTime() < Date.now() - 86400000) cand.setFullYear(y + 1);
      d.setFullYear(cand.getFullYear(), cand.getMonth(), cand.getDate());
    } else {
      let hit = null;
      Object.keys(dayMap).forEach((k) => { if (lower.includes(k)) hit = dayMap[k]; });
      if (hit != null) d.setDate(d.getDate() + ((hit + 7 - d.getDay()) % 7 || 7));
      else { guess = true; d.setDate(d.getDate() + 3); }   // se avisa en la vista previa
    }
    return { date: localISO(d), guessed: guess };
  }
  function nlpParse(raw) {
    const lower = raw.toLowerCase();
    const isExam = /examen|prueba|control|parcial|entrega|trabajo/.test(lower);
    const isNote = /^apunte|^nota|resumen/.test(lower);
    const when = parseWhen(lower);
    const time = (lower.match(/\b(\d{1,2})[:.](\d{2})\b/) || []);
    return {
      kind: isNote ? "note" : isExam ? "exam" : "task",
      title: raw.charAt(0).toUpperCase() + raw.slice(1),
      date: when.date,
      guessed: when.guessed,
      time: time.length ? pad(Number(time[1])) + ":" + time[2] : "09:00",
      subjectId: matchSubject(lower) || "",
      type: /entrega|trabajo/.test(lower) ? "entrega" : "parcial",
    };
  }
  // Antes de guardar nada se ve lo que se ha entendido y se puede corregir.
  function processNLP(text) {
    const raw = (text || "").trim();
    if (!raw) { toast("Nada que interpretar"); return; }
    if (!needSubjects()) return;
    const d = nlpParse(raw);
    const kindLbl = d.kind === "exam" ? "Examen" : d.kind === "note" ? "Nota" : "Tarea";
    openModal("¿Es esto?", `
      <p class="hint" style="margin-top:0">He interpretado tu frase. Cambia lo que haga falta antes de guardar.</p>
      <div class="field"><label>Tipo</label>
        <select name="kind">
          <option value="task" ${d.kind === "task" ? "selected" : ""}>Tarea</option>
          <option value="exam" ${d.kind === "exam" ? "selected" : ""}>Examen / entrega</option>
          <option value="note" ${d.kind === "note" ? "selected" : ""}>Nota</option>
        </select></div>
      <div class="field"><label>Título</label><input name="title" required value="${esc(d.title)}" /></div>
      <div class="form-row">
        <div class="field"><label>Módulo ${d.subjectId ? "" : "(elige)"}</label><select name="subjectId">${subjectOptions(d.subjectId)}</select></div>
        <div class="field"><label>Fecha ${d.guessed ? "(¡la he supuesto!)" : ""}</label><input name="date" type="date" value="${d.date}" /></div>
      </div>
      <div class="field"><label>Hora</label><input name="time" type="time" value="${d.time}" /></div>
    `, {
      confirm: "Guardar " + kindLbl.toLowerCase(),
      onSubmit(data) {
        const row = { subjectId: data.subjectId, title: String(data.title || d.title).trim(), date: asISO(data.date) || todayISO() };
        if (data.kind === "exam") {
          state.exams.push({ id: uid(), subjectId: row.subjectId, title: row.title, date: row.date, time: asHHMM(data.time, "09:00"),
            type: d.type, location: "", notes: "Captura rápida", grade: "", weight: 25, difficulty: 3,
            hoursNeeded: Number(state.settings.defaultHours) || 8, status: "pendiente", checklist: [] });
          toast("Examen guardado");
        } else if (data.kind === "note") {
          const n = { id: uid(), subjectId: row.subjectId, title: row.title.slice(0, 60), content: raw, pinned: false, createdAt: Date.now(), updatedAt: Date.now() };
          state.notes.unshift(n); noteId = n.id;
          toast("Nota guardada");
        } else {
          state.tasks.push({ id: uid(), subjectId: row.subjectId, title: row.title, due: row.date, priority: state.settings.defaultPrio || "media", done: false });
          toast("Tarea guardada");
        }
        checkAchievements(); closeModal();
        if (data.kind === "note") go("notes"); else { view = data.kind === "exam" ? "exams" : "tasks"; render(); }
      },
    });
  }
  let voiceRec = null, voiceOn = false;
  function voiceSupported() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); }
  function updateVoiceUI() {
    const b = $("#capture-voice");
    if (b) { b.classList.toggle("on", voiceOn); b.textContent = voiceOn ? "🎙 Escuchando…" : "🎤 Dictar"; }
    const fab = $("#fab");
    if (fab) fab.classList.toggle("listening", voiceOn);
  }
  function toggleVoice() {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    const pill = $("#ai-status-pill");
    const fab = $("#fab");
    const stop = () => {
      voiceOn = false;
      try { voiceRec && voiceRec.stop(); } catch {}
      updateVoiceUI();
      pill?.classList.remove("on");
    };
    if (voiceOn) { stop(); return; }
    voiceOn = true;
    updateVoiceUI();
    pill?.classList.add("on");
    const stt = $("#ai-status-text");
    if (stt) stt.textContent = "Di: «Examen de redes el viernes»";
    if (!Speech) {
      openCapture();
      stop();
      toast(voiceSupported() ? "Permite el micrófono" : "Aquí no hay dictado: escribe la frase");
      return;
    }
    if (!voiceRec) {
      voiceRec = new Speech();
      voiceRec.lang = "es-ES";
      voiceRec.continuous = false;
      voiceRec.onresult = (ev) => { processNLP(ev.results[0][0].transcript); stop(); };
      voiceRec.onerror = () => { toast("No se pudo capturar audio"); stop(); };
      voiceRec.onend = () => { if (voiceOn) stop(); };
    }
    try { voiceRec.start(); } catch { stop(); openCapture(); }
    if (voiceOn) toast("Habla: se parará solo al terminar la frase");
  }
  function weekBarsHTML() {
    const wr = weekRange();
    const mon = new Date(wr.from + "T00:00:00");
    const vals = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon); d.setDate(mon.getDate() + i);
      vals.push(state.sessions.filter((x) => x.date === localISO(d)).reduce((a, b) => a + b.minutes, 0));
    }
    const max = Math.max(60, ...vals);
    return `<div class="bars">${vals.map((v) => `<i style="height:${Math.max(4, (v / max) * 100)}%"></i>`).join("")}</div>
      <div class="bars-lbl">${DAYS_SHORT.map((d) => `<span>${d[0]}</span>`).join("")}</div>`;
  }
  function radarSVG() {
    const mods = state.subjects.slice(0, 8);
    const has = mods.some((s) => subjectGPA(s.id) != null);
    if (!has) {
      return `<div class="radar-empty">
        <b>Aún no hay notas</b>
        <p>Cuando pongas una calificación en un examen, aquí verás el radar por módulo.</p>
        <button class="btn btn-primary" data-action="add-exam">Registrar una nota</button>
      </div>`;
    }
    const n = Math.max(mods.length, 3);
    const cx = 140, cy = 140, R = 100;
    const pt = (i, r) => {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    };
    let rings = "";
    [0.25, 0.5, 0.75, 1].forEach((k) => {
      rings += `<polygon points="${Array.from({ length: n }, (_, i) => pt(i, R * k).join(",")).join(" ")}" fill="none" stroke="currentColor" opacity=".18"/>`;
    });
    const data = mods.map((sub, i) => pt(i, R * ((subjectGPA(sub.id) || 0) / 10)));
    while (data.length < 3) data.push(pt(data.length, 0));
    const poly = data.map((x) => x.join(",")).join(" ");
    const labels = mods.map((sub, i) => {
      const [x, y] = pt(i, R + 18);
      const short = sub.name.split(" ").map((w) => w.slice(0, 3)).join("").slice(0, 6).toUpperCase();
      return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="10" font-weight="700" fill="currentColor" opacity=".55">${esc(short)}</text>`;
    }).join("");
    return `<svg viewBox="0 0 280 280" class="radar-box">${rings}<polygon points="${poly}" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="2"/>${data.map((x) => `<circle cx="${x[0]}" cy="${x[1]}" r="4" fill="#10b981"/>`).join("")}${labels}</svg>`;
  }
  function renderRendimiento() {
    const gpa = weightedGPA();
    const max = Number(state.settings.gradeMax) || 10;
    const clsOf = (avg) => avg == null ? "g-na" : avg >= 9 ? "g-top" : avg >= 5 ? "g-ok" : "g-bad";
    const boletin = state.subjects.map((sub) => {
      const list = state.exams.filter((e) => e.subjectId === sub.id)
        .sort((a, b) => (a.date || "").localeCompare(b.date || ""));
      const avg = subjectGPA(sub.id);
      const graded = list.filter((e) => e.grade !== "" && !Number.isNaN(Number(e.grade)));
      const rows = list.length ? list.map((e) => {
        const has = e.grade !== "" && !Number.isNaN(Number(e.grade));
        const n = has ? Number(e.grade) : null;
        const gcls = n == null ? "g-na" : n >= 9 ? "g-top" : n >= 5 ? "g-ok" : "g-bad";
        return `<button type="button" class="grade-row" data-action="edit-exam" data-id="${e.id}">
          <span class="grade-row-t">
            <b>${esc(e.title)}</b>
            <small>${esc(typeLabel(e.type))}${e.date ? " · " + fmtDate(e.date) : ""} · ${Number(e.weight) || 0}%</small>
          </span>
          <span class="g ${gcls}">${has ? Number(e.grade).toFixed(1) : "—"}</span>
        </button>`;
      }).join("") : `<p class="sch-empty">Sin exámenes en este módulo.</p>`;
      return `<section class="boletin-mod">
        <div class="boletin-head">
          <i style="background:${safeColor(sub.color)}"></i>
          <div>
            <b>${esc(sub.name)}</b>
            <small>${graded.length ? graded.length + (graded.length === 1 ? " nota" : " notas") : "sin calificar"}</small>
          </div>
          <div class="g ${clsOf(avg)}">${avg == null ? "—" : avg.toFixed(2)}</div>
        </div>
        ${rows}
      </section>`;
    }).join("") || `<div class="empty"><b>Sin módulos</b>Añade asignaturas para ir apuntando notas.</div>`;
    return `
      <div class="boletin-hero">
        <span class="k">Media del ciclo</span>
        <div class="g ${clsOf(gpa)}">${gpa == null ? "—" : gpa.toFixed(2)}</div>
        <small>${gpa == null ? "Cuando pongas notas en los exámenes, sale aquí el total." : "Ponderada con el peso de cada evaluación."}</small>
      </div>
      <div class="sec-head"><h3>Por asignatura</h3>
        <button class="hub-round" data-action="add-exam" title="Registrar nota" aria-label="Registrar nota">+</button></div>
      ${radarSVG()}
      ${boletin}
      <div class="sim-box">
        <h3 style="margin:0 0 8px;font-size:14px;font-weight:800">Simulador del final</h3>
        <p class="hint" style="margin:0 0 12px">Qué nota te pide el examen final según lo que llevas.</p>
        <div class="form-row">
          <div class="field"><label for="sim-current">Nota actual</label><input type="number" step="0.1" id="sim-current" value="${gpa == null ? "6.5" : gpa.toFixed(1)}" data-action="sim-live"></div>
          <div class="field"><label for="sim-weight">Peso final (%)</label><input type="number" id="sim-weight" value="40" data-action="sim-live"></div>
        </div>
        <div class="field"><label for="sim-target">Quiero sacar un…</label>
          <input type="range" id="sim-target" min="5" max="${max}" step="0.1" value="8" data-action="sim-live" aria-describedby="sim-target-display">
          <div style="text-align:center;font-family:var(--mono);font-weight:800" id="sim-target-display">8.0</div>
        </div>
        <div class="sim-out"><span>Necesitas un:</span><b id="sim-result">—</b></div>
      </div>
    `;
  }

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredInstall = e;
      if (view === "dashboard" || view === "settings") render();
    });
    window.addEventListener("appinstalled", () => {
      deferredInstall = null;
      toast("Aula SMR instalada");
      if (view === "dashboard" || view === "settings") render();
    });

  window.Aula = { soltarFotos, fotosDeNota,
    get state() { return state; },
    save, render, go, toast, esc, uid, todayISO, daysUntil, fmtDate, fmtDateLong, fmtHours,
    subjectName, subjectColor, subjectById, minutesOf, weekdayMon0, DAYS, DAYS_SHORT, MONTHS,
    pad, clamp, localISO, weekRange, streak, studiedFor, nextExam, nextClass, $, $$,
    openModal, closeModal, ask, weightedGPA, grantXP, checkAchievements, needSubjects,
    pushUndo, undo, sanitize, save, flushSave, APP_VERSION, subjectSynonyms, matchSubject, nlpParse,
    safeColor, sm2, cardState, nextLabel, migrateMedia, eventsOnDate, setException, exceptionsFor,
    unlockNote(id) { unlockedNotes.delete(id); },
    lockNote(id) { unlockedNotes.add(id); },
    get loadProblem() { return loadProblem; },
    get saveProblem() { return saveProblem; },
    subjectOptions, md, dueCards, attStats, typeLabel, EXAM_TYPES, addExam, addTask, addNote, addCard,
    persistNote, buzz, confetti, levelInfo,
    get noteId() { return noteId; }, set noteId(v) { noteId = v; },
    get cardQueue() { return cardQueue; },
  };
  const EXTRA_VIEWS = { agenda: 1, chatbot: 1, kanban: 1, timeline: 1, simulator: 1, habits: 1, glossary: 1, trash: 1, examode: 1, quickreview: 1, admin: 1, guide: 1, achievements: 1, rendimiento: 1, tools: 1 };
  const esVista = (v) => !!(v && (titles[v] || EXTRA_VIEWS[v]));
  const hash = (location.hash || "").replace("#", "");
  if (esVista(hash)) view = hash;
  applyTheme();
  setMode("work", true);
  // Modo examen que sobrevive a recargas
  const _lockUntil = Number((state.progress && state.progress.flags && state.progress.flags.examLockUntil) || 0);
  if (_lockUntil > Date.now()) {
    document.body.classList.add("focus-mode", "exam-lock");
    setTimeout(() => document.body.classList.remove("exam-lock"), _lockUntil - Date.now());
  } else if (_lockUntil) {
    state.progress.flags.examLockUntil = 0;
  }
  // Modo de entrada (ratón/teclado o táctil) para ajustar tamaños
  const marcarEntrada = () => document.documentElement.classList.toggle("is-touch", window.matchMedia("(pointer: coarse)").matches);
  marcarEntrada();
  window.addEventListener("pointerdown", marcarEntrada, { once: true });
  timerRestore();
  if (Media()) Media().ready().then((ok) => {
    if (ok) migrateMedia();
    else if (state.notes.some((n) => (n.attachments || []).some((a) => !a.data))) {
      toast("Este navegador no guarda archivos: las fotos se verán cuando haya datos");
    }
  });
  dailyCheckIn();
  checkAchievements();
  render();
  applyAppIcon();
  // Guardado y estado: nada se pierde si la app pasa a segundo plano o se cierra.
  window.addEventListener("pagehide", flushSave);
  window.addEventListener("beforeunload", flushSave);
  window.addEventListener("hashchange", () => {
    const v = (location.hash || "").replace("#", "");
    if (esVista(v) && v !== view) { persistNoteNow(); closeMore(); view = v; render(); }
  });
  window.addEventListener("popstate", () => {
    // Si no queda historial propio, se vuelve a Inicio en lugar de cerrar la app
    const v = (location.hash || "").replace("#", "");
    const destino = esVista(v) ? v : "dashboard";
    if (destino !== view) { persistNoteNow(); closeMore(); view = destino; render(); window.scrollTo(0, 0); }
  });
  try { history.replaceState({ v: view }, "", "#" + view); } catch {}
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").then(() => applyAppIcon()).catch(() => {});
    navigator.serviceWorker.addEventListener("controllerchange", () => applyAppIcon());
  }
  function tickLiveUI() {
    if (view !== "dashboard") return;
    const remain = $("#live-remain");
    const bar = document.querySelector(".live-card .live-bar > i");
    const lb = liveBlock();
    const now = nowMinutes();
    if (lb.active && remain) {
      remain.textContent = (lb.active.endMins - now) + " min restantes";
      if (bar) {
        const a = lb.active;
        const pct = clamp(((now - a.startMins) / Math.max(a.endMins - a.startMins, 1)) * 100, 0, 100);
        bar.style.width = pct + "%";
      }
    } else if (lb.next && remain) {
      const mins = lb.next.startMins - now;
      remain.textContent = "En " + (mins > 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins} min`);
    }
  }
  setInterval(() => {
    const clock = $("#live-clock");
    if (clock) {
      const info = nextClassInfo();
      if (!info) clock.textContent = "—";
      else clock.textContent = info.live ? "AHORA" : fmtRemain(info.remain);
    }
    // Si el móvil ha dormido la pestaña, el cronómetro se pone al día aquí
    if (timer.running && timer.endsAt) {
      timer.remaining = Math.max(0, Math.round((timer.endsAt - Date.now()) / 1000));
      if (timer.remaining <= 0) completeTimer();
    }
    updateTimerChrome();
    tickNotify();
    tickLiveUI();
    pushWidgets();
  }, 15000);
  setTimeout(() => tickNotify(), 2500);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { flushSave(); return; }
    tickNotify();
    pushWidgets();
    // Al volver del segundo plano: recalcular el temporizador y recuperar el wake lock.
    if (timer.running && timer.endsAt) {
      timer.remaining = Math.max(0, Math.round((timer.endsAt - Date.now()) / 1000));
      if (timer.remaining <= 0) completeTimer(); else { updateTimerUI(); updateTimerChrome(); }
    }
    if (timer.running && state.settings.keepAwake !== false && navigator.wakeLock && !wakeLock) {
      try { navigator.wakeLock.request("screen").then((s) => { wakeLock = s; }).catch(() => {}); } catch {}
    }
  });
  setTimeout(() => pushWidgets(), 800);
})();

