(() => {
  "use strict";

  const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const DAYS_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
  const MONTHS = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
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
  const KEY = "aula.smr.v4";
  const SCHEMA_VERSION = 5;
  const BASE_TITLE = "Aula SMR";
  const APP_VERSION = "v67.19.0";
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
    { id: "snivy", src: "assets/avatars/snivy.jpg" },
    { id: "cyndaquil", src: "assets/avatars/cyndaquil.jpg" },
    { id: "froakie", src: "assets/avatars/froakie.jpg" },
    { id: "oshawott", src: "assets/avatars/oshawott.jpg" },
  ];


  // ================================================================
  // UTILIDADES Y CONSTANTES
  // ================================================================
  const uid = () => (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now());
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const localISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const todayISO = () => localISO(new Date());
  const minutesOf = (hhmm) => { const [h, m] = (hhmm || "00:00").split(":").map(Number); return h * 60 + (m || 0); };
  const fmtDate = (iso) => { if (!iso) return ""; const d = new Date(iso + "T00:00:00"); return `${d.getDate()} de ${MONTHS[d.getMonth()]}`; };
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
  const fmtHours = (mins) => {
    mins = Math.round(mins || 0);
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60), m = mins % 60;
    return m ? `${h}h ${m}m` : `${h}h`;
  };
  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
  /* Imagen que viene de datos que no controlamos (una copia importada, una foto antigua).
     Solo se aceptan data URLs de imagen y blobs: nada de comillas ni de código. */
  const safeImgSrc = (s) => {
    const v = String(s ?? "").trim();
    if (!/^(data:image\/[a-z0-9.+-]+;base64,|data:image\/[a-z0-9.+-]+,|blob:)/i.test(v)) return "";
    return esc(v);
  };
  function attStats() {
    const rows = state.attendance || [];
    const t = rows.length;
    const p = rows.filter((a) => a.status === "presente").length;
    const r = rows.filter((a) => a.status === "retraso").length;
    const f = rows.filter((a) => a.status === "falta").length;
    return { t, p, r, f, pct: t ? Math.round((p / t) * 100) : null };
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
  function isNonTeaching(iso) { return dayInfo(iso).kind !== "lectivo"; }

  /* Excepciones de un día concreto. El horario es semanal, pero la vida real no:
     un martes no hay clase, una clase se mueve al jueves, aparece una extra…
     state.exceptions = [{ id, kind: "cancel"|"move"|"extra"|"holiday", date, eventId, start, end, room, note }] */
  function excepciones() { return Array.isArray(state.exceptions) ? state.exceptions : []; }
  function exceptionsFor(iso) { return excepciones().filter((x) => x.date === iso); }
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
  /* ——— Vibración (v67.7) ———
     Dentro del APK la hace el motor háptico de Android (`@capacitor/haptics`), que es el que
     usan las apps de verdad: un golpe seco y corto. Fuera del APK —en el navegador— cae a
     `navigator.vibrate`, que es lo que había hasta ahora. Y si no hay ninguno de los dos, no
     pasa nada: la vibración es un adorno y nunca puede romper la acción que la provoca.

     Tres intensidades, para que cada gesto se note distinto sin mirar la pantalla:
       ligero → cambiar de pestaña en la barra de abajo (un roce: se siente el clic)
       medio  → marcar una entrega como entregada (confirmación de que se ha guardado)
       fuerte → terminar un bloque de estudio (aviso: levanta la vista del móvil) */
  const HAPTIC = { ligero: "LIGHT", medio: "MEDIUM", fuerte: "HEAVY" };
  const PATRON_VIBRA = { ligero: 12, medio: [0, 30], fuerte: [40, 40, 80] };
  function vibrar(tipo) {
    // El interruptor de Ajustes manda: con la vibración apagada no vibra nada, nunca.
    if (state.settings.vibrate === false) return false;
    const estilo = HAPTIC[tipo] || HAPTIC.ligero;
    try {
      const h = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics;
      if (h && typeof h.impact === "function") {
        const r = h.impact({ style: estilo });
        // El plugin devuelve una promesa: si el móvil no tiene motor háptico, que no salte
        if (r && typeof r.catch === "function") r.catch(() => {});
        return true;
      }
    } catch { /* sin plugin nativo: se intenta el camino del navegador */ }
    try {
      if (navigator.vibrate) { navigator.vibrate(PATRON_VIBRA[tipo] || PATRON_VIBRA.ligero); return true; }
    } catch { /* ni eso: se acabó, sin ruido */ }
    return false;
  }
  // El final del bloque de estudio ya llamaba a `buzz()`: ahora es la vibración fuerte.
  function buzz() { return vibrar("fuerte"); }
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
  // Dentro del APK, Android sabe despertarse solo: js/avisos.js programa los avisos de
  // verdad (clase, exámenes, resumen) y suenan con la app cerrada. En el navegador no es
  // posible, así que ahí se sigue avisando solo mientras la app está abierta.
  /* ---- Modo foco / Concentración -------------------------------------------------
     El foco esconde la barra de abajo (es lo suyo: «sin distracciones»), pero tiene que poder
     salirse. Aquí está el único sitio que toca esas clases, para que no se quede pegado. */
  function bloqueoActivo() {
    const hasta = Number((state.progress && state.progress.flags && state.progress.flags.examLockUntil) || 0);
    return hasta > Date.now();
  }
  function ponFoco(on, conBloqueo) {
    document.body.classList.toggle("focus-mode", !!on);
    document.body.classList.toggle("exam-lock", !!(on && (conBloqueo || bloqueoActivo())));
    if (!on && state.progress && state.progress.flags) state.progress.flags.examLockUntil = 0;
  }

  function avisosNativos() { return !!(window.AulaAvisos && window.AulaAvisos.disponible()); }
  function avisosProgramados() { return avisosNativos() && state.settings.notifyNative === true; }
  function activarAvisosNativos() {
    if (!avisosNativos()) return false;
    window.AulaAvisos.activar().then((r) => {
      state.settings.notifyNative = !!r.permiso;
      state.settings.notify = !!r.permiso;
      permisoAvisos = r.permiso ? "concedido" : "denegado";
      save();
      toast(r.permiso ? "Avisos del móvil activados: " + r.programados : "Sin permiso de avisos: míralo en Ajustes del móvil");
      if (view === "settings" || view === "dashboard") render();
    }).catch(() => toast("No se pudieron programar los avisos"));
    return true;
  }
  function apagarAvisosNativos() {
    pushUndo();
    state.settings.notifyNative = false;
    state.settings.notify = false;
    save();
    if (window.AulaAvisos) window.AulaAvisos.apagar().catch(() => {});
    toast("Avisos del móvil desactivados");
    render();
  }
  // Al tocar una notificación, la app se abre en la pantalla de ese aviso
  let toquesAvisosListos = false;
  function escucharToquesAvisos() {
    if (toquesAvisosListos || !avisosNativos()) return;
    toquesAvisosListos = window.AulaAvisos.escucharToques((vista) => {
      if (!esVista(vista)) return;
      closeMore();
      persistNoteNow();
      view = vista;
      try { history.replaceState({ v: view }, "", "#" + view); } catch {}
      render();
      window.scrollTo(0, 0);
    });
  }
  // Estado del permiso de Android (para explicarlo en Ajustes)
  let permisoAvisos = "preguntar";
  function mirarPermisoAvisos() {
    if (!avisosNativos() || typeof window.AulaAvisos.permiso !== "function") return;
    window.AulaAvisos.permiso().then((v) => {
      if (v === permisoAvisos) return;
      permisoAvisos = v;
      if (view === "settings" || view === "dashboard") render();
    }).catch(() => {});
  }
  // Dos permisos más que en los móviles modernos mandan sobre si los avisos suenan:
  // alarmas exactas (Android 12+: bloqueadas por defecto) y la optimización de batería.
  // null = no se puede saber (fuera del APK o móvil donde no existe el interruptor).
  let exactasAvisos = null;
  let bateriaAvisos = null;
  function mirarExactasAvisos() {
    if (!avisosNativos() || typeof window.AulaAvisos.alarmasExactas !== "function") return;
    window.AulaAvisos.alarmasExactas().then((v) => {
      if (v === null || v === exactasAvisos) return;
      const antes = exactasAvisos;
      exactasAvisos = v;
      if (v === true && antes === false && avisosProgramados()) {
        // Acaban de conceder las alarmas exactas: lo ya programado quedó como alarma
        // imprecisa, así que se repasa el plan para que suene a la hora exacta.
        reprogramarAvisos();
        toast("Alarmas exactas activadas: los avisos sonarán a la hora exacta");
      }
      if (view === "settings" || view === "dashboard") render();
    }).catch(() => {});
  }
  function mirarBateriaAvisos() {
    if (!avisosNativos() || typeof window.AulaAvisos.bateria !== "function") return;
    window.AulaAvisos.bateria().then((v) => {
      if (v === null || v === bateriaAvisos) return;
      const antes = bateriaAvisos;
      bateriaAvisos = v;
      if (v === "exenta" && antes === "vigilada") toast("La app ya no la vigila la optimización de batería");
      if (view === "settings" || view === "dashboard") render();
    }).catch(() => {});
  }
  function probarAviso() {
    if (!avisosNativos()) { requestNotify(); return; }
    window.AulaAvisos.probar().then((r) => {
      if (!r.ok && r.permiso === false) { toast("Sin permiso de avisos en el móvil"); permisoAvisos = "denegado"; render(); return; }
      toast(r.ok ? "Aviso de prueba en 5 segundos" : "No se pudo programar la prueba");
    }).catch(() => toast("No se pudo programar la prueba"));
  }
  let avisosTimer = null;
  function reprogramarAvisos(pedirPermiso) {
    if (!avisosNativos()) return;
    if (!avisosProgramados() && !pedirPermiso) return;
    clearTimeout(avisosTimer);
    avisosTimer = setTimeout(() => {
      avisosTimer = null;
      window.AulaAvisos.sincronizar({ pedirPermiso: !!pedirPermiso }).then((r) => {
        if (r && r.permiso === false && state.settings.notifyNative) { state.settings.notifyNative = false; save(); }
      }).catch(() => {});
    }, 1500);
  }

  function requestNotify() {
    if (activarAvisosNativos()) return;
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
    const hoydia = dayInfo(today);
    if (state.settings.notifyClass !== false && hoydia.kind !== "lectivo") {
      noteOnce("sinclase-" + today, hoydia.short || "Sin clase", hoydia.label || "Hoy no hay clase");
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
      const info = dayInfo(today);
      const clases = info.kind === "lectivo" ? eventsOnDate(today) : [];
      noteOnce("manana-" + today, "Buenos días",
        info.kind !== "lectivo" ? (info.label || "Hoy no hay clase")
          : clases.length ? clases.length + (clases.length === 1 ? " clase hoy · primera a las " + clases[0].start : " clases hoy · primera a las " + clases[0].start)
          : "Hoy no hay clases");
    }
  }


  function defaultState() {
    return {
      settings: {
        name: "", courseName: "SMR 2º 2026/27", startDate: COURSE.start,
        skin: "hub", uiTheme: "dark", pomodoroWork: 25, pomodoroBreak: 5, pomodoroLong: 15,
        cyclesUntilLong: 4, dailyGoal: 90, includeSaturday: false, demo: true, sound: true, notify: false, remindHour: 8, onboarded: false,
        center: "", group: "2SMR", endDate: COURSE.end, startView: "dashboard",
        uiSize: "md", compact: false, reduceMotion: false, showXp: true, showMedals: true, showWeekStrip: true,
        vibrate: true, confetti: true, autoNext: false, keepAwake: true, showTimerBar: true,
        notifyCards: true, notifyClass: true,
        confirmDelete: true, showAttendance: true,
        gradeMax: 10, startHour: 15, endHour: 23, weekGoalDays: 5, timetableId: "",
        ollamaUrl: "", ollamaModel: "llama3.2", pin: "", autoTheme: false, guest: false,
        nightRemind: true, morningSummary: true, inactivityDays: 5, avatarOn: true, avatarIcon: "letter",
        timetableAuto: true, timetableKind: "",
        appIcon: "dragon", customAvatars: [],
      },
      subjects: [], notes: [], events: [], sessions: [], cards: [], inbox: [], attendance: [],
      progress: { bonusXp: 0, unlocked: {}, daily: "", log: [], flags: {}, freeze: 1, lastFreezeWeek: "" },
      habits: [], glossary: [], exams: [],
    };
  }

  /* Horario real de 2.º SMR, curso 2026-2027 (documento del centro, versión definitiva).
     Son DOS plantillas: el "temporal" (septiembre y junio, de 16:00 a 21:45, clases de 45 min)
     y la del curso (15:10 a 22:15, clases de 55 min). Los módulos de cada día son los mismos. */
  const OFFICIAL_MODS = [
    { key: "seg", name: "Seguridad informática", teacher: "Raúl Sanchis Camarasa", color: "#ef4444", room: "AULA 1NF3", aliases: ["seguridad"] },
    { key: "ipe", name: "Itinerario personal para la empleabilidad II", teacher: "Natalia Poquet Giner", color: "#f472b6", room: "AULA 1NF3", aliases: ["ipe", "itinerario", "empleabilidad"] },
    { key: "sor", name: "Sistemas operativos en red", teacher: "Damián Antonio Santos Baldo / Ernesto Montero Sandiego", color: "#3b82f6", room: "AULA 1NF3", aliases: ["sistemas operativos"] },
    { key: "ser", name: "Servicios en red", teacher: "Ernesto Montero Sandiego / José María Guerrero Romero", color: "#db2777", room: "AULA 3", aliases: ["servicios en red"] },
    { key: "web", name: "Aplicaciones web", teacher: "Miguel Valiente Sánchez", color: "#eab308", room: "AULA 2", aliases: ["aplicaciones web"] },
    { key: "pro", name: "Proyecto intermodular Sistemas microinformáticos y redes", teacher: "Ernesto Montero Sandiego", color: "#22c55e", room: "AULA 1NF3", aliases: ["proyecto intermodular", "proyecto"] },
    { key: "dig", name: "Digitalización aplicada al sistema productivo GM", teacher: "Amador Gramage Borrás", color: "#fb7185", room: "AULA 1NF3", aliases: ["digitalización", "digitalizacion"] },
    { key: "sos", name: "Sostenibilidad aplicada al sistema productivo", teacher: "Javier Ibáñez Micó", color: "#f9a8d4", room: "AULA 3", aliases: ["sostenibilidad"] },
    { key: "opt", name: "Programación", teacher: "Damián Antonio Santos Baldo", color: "#84cc16", room: "AULA 3", aliases: ["optativo", "optativa", "programacion", "programación"] },
    { key: "tut", name: "Tutoría Segundo", teacher: "Ernesto Montero Sandiego", color: "#86efac", room: "AULA 1NF3", aliases: ["tutoría", "tutoria"] },
  ];
  // Tramos horarios: el del curso y el temporal (septiembre y junio, 45 min por clase)
  const OFFICIAL_SLOTS = {
    curso: [
      ["15:10", "16:05"], ["16:05", "17:00"], ["17:00", "17:55"],
      ["18:15", "19:10"], ["19:10", "20:05"], ["20:05", "21:00"], ["21:20", "22:15"],
    ],
    temporal: [
      ["16:00", "16:45"], ["16:45", "17:30"], ["17:30", "18:15"],
      ["18:45", "19:30"], ["19:30", "20:15"], ["20:15", "21:00"], ["21:00", "21:45"],
    ],
  };
  // Qué toca cada día, tramo a tramo (null = libre). Lunes a viernes.
  const OFFICIAL_PLAN = [
    ["seg", "seg", "ipe", "sor", "sor", "ser", "ser"],        // Lunes
    ["ipe", "dig", "seg", "seg", "opt", "web", null],         // Martes
    ["pro", "pro", "opt", "opt", "ser", "sos", null],         // Miércoles
    ["sor", "sor", "web", "web", "ser", "ser", null],         // Jueves (en el documento del centro son 2 h de SOR y a las 17:00 Aplicaciones web; v67.12.1)
    ["tut", "ipe", "ser", "ser", "sor", "sor", null],         // Viernes
  ];
  // Calendario escolar 2026-2027 (Generalitat / Ayuntamiento de Villena)
  const COURSE = {
    start: "2026-09-14",
    end: "2027-06-18",
    local: ["2026-09-09", "2026-12-07", "2027-02-08"],   // festivos locales a efectos escolares
  };
  // El calendario escolar de COURSE es el oficial, pero SUS clases pueden acabar antes
  // (después vienen las prácticas/FCT): el rango efectivo es el que él tenga configurado.
  const cursoIni = () => ((state.settings && state.settings.startDate) || COURSE.start);
  const cursoFin = () => ((state.settings && state.settings.endDate) || COURSE.end);
  const TIMETABLE_ID = "2smr-2026-2027";
  // El centro publicó el horario definitivo (clases de 15:10 a 22:15) con algún cambio de
  // módulo respecto al primer documento. Este sello avisa de que hay que actualizarlo.
  const PLAN_VERSION = 4;   // v67.12.1: el jueves del documento eran 2 h de SOR (no 3) y Servicios en red también a las 20:05
  // Horas del primer documento: sirven para reconocer un horario antiguo del centro y no
  // confundirlo con clases puestas a mano.
  const OFFICIAL_SLOTS_V1 = {
    curso: [
      ["15:15", "16:05"], ["16:05", "17:00"], ["17:00", "17:55"],
      ["18:15", "19:10"], ["19:10", "20:05"], ["20:05", "21:00"], ["21:00", "21:45"],
    ],
    temporal: [
      ["16:00", "16:45"], ["16:45", "17:30"], ["17:30", "18:15"],
      ["18:45", "19:30"], ["19:30", "20:15"], ["20:15", "21:00"], ["21:00", "21:45"],
    ],
  };
  // ¿Esta hora de inicio es del horario del centro (de ahora o del anterior)?
  function esHoraDelCentro(hhmm) {
    return [OFFICIAL_SLOTS, OFFICIAL_SLOTS_V1].some((juego) =>
      Object.values(juego).some((tramos) => tramos.some((t) => t[0] === hhmm)));
  }
  const HOLIDAYS = {
    "2026-09-09": "Festivo local (Villena)",
    "2026-10-09": "Día de la Comunitat Valenciana",
    "2026-10-12": "Fiesta Nacional de España",
    "2026-11-01": "Todos los Santos",
    "2026-12-06": "Día de la Constitución",
    "2026-12-07": "Festivo local (Villena)",
    "2026-12-08": "Inmaculada Concepción",
    "2026-12-25": "Navidad",
    "2027-01-01": "Año Nuevo",
    "2027-01-06": "Reyes",
    "2027-02-08": "Festivo local (Villena)",
    "2027-03-19": "San José",
    "2027-03-26": "Viernes Santo",
    "2027-03-29": "Lunes de Pascua",
    "2027-05-01": "Fiesta del Trabajo",
    "2027-06-24": "San Juan",
  };
  const VACATIONS = [
    { from: "2026-12-22", to: "2027-01-06", name: "Vacaciones de Navidad" },
    { from: "2027-03-25", to: "2027-04-05", name: "Vacaciones de Pascua" },
  ];
  const MESES_TEMPORAL = [8, 5];   // septiembre y junio: el centro entra a las 16:00

  function vacacionEn(iso) {
    for (const v of VACATIONS) if (iso >= v.from && iso <= v.to) return v;
    return null;
  }
  /* Qué es cada día del calendario escolar. Devuelve el tipo y el texto que se enseña.
     lectivo · festivo · vacaciones · finde · fuera (antes de empezar o curso acabado) */
  function dayInfo(iso) {
    iso = iso || todayISO();
    const dow = weekdayMon0(new Date(iso + "T12:00:00"));
    const exc = excepciones().find((x) => x.date === iso && x.kind === "holiday");
    if (exc) return { kind: "festivo", label: exc.note || "Festivo", short: exc.note || "Festivo", dow };
    const vac = vacacionEn(iso);
    if (vac) return { kind: "vacaciones", label: vac.name, short: "Vacaciones", dow };
    if (HOLIDAYS[iso]) return { kind: "festivo", label: HOLIDAYS[iso], short: HOLIDAYS[iso], dow };
    if (dow > 4) return { kind: "finde", label: "Fin de semana", short: "Fin de semana", dow };
    if (iso < cursoIni()) return { kind: "fuera", label: "Sin clase: el curso empieza el " + fmtDate(cursoIni()), short: "Sin curso", dow };
    if (iso > cursoFin()) return { kind: "fuera", label: "Sin clase: las clases acabaron el " + fmtDate(cursoFin()), short: "Sin curso", dow };
    return { kind: "lectivo", label: "", short: "", dow };
  }
  function isLectivo(iso) { return dayInfo(iso).kind === "lectivo"; }
  // Septiembre y junio: plantilla temporal (entrada a las 16:00). El resto, la del curso.
  function plantillaDeMes(fechaISO) {
    const d = fechaISO ? new Date(fechaISO + "T12:00:00") : new Date();
    return MESES_TEMPORAL.includes(d.getMonth()) ? "temporal" : "curso";
  }
  function officialSubjectId(st, spec) {
    const hit = (st.subjects || []).find((s) => {
      const n = String(s.name || "").toLowerCase();
      return spec.aliases.some((a) => n.includes(a));
    });
    if (hit) {
      hit.name = spec.name;
      hit.teacher = spec.teacher || "";
      hit.room = spec.room || hit.room || "";
      if (spec.color) hit.color = spec.color;
      return hit.id;
    }
    const id = uid();
    st.subjects = st.subjects || [];
    st.subjects.push({ id, name: spec.name, color: spec.color, teacher: spec.teacher || "", room: spec.room || "", credits: 0 });
    return id;
  }
  // Construye la semana a partir del plan del centro y de la plantilla de horas elegida
  function officialEvents(ids, kind = "curso") {
    const tramos = OFFICIAL_SLOTS[kind] || OFFICIAL_SLOTS.curso;
    const ev = [];
    OFFICIAL_PLAN.forEach((dia, d) => {
      dia.forEach((key, i) => {
        if (!key || !tramos[i]) return;
        const mod = OFFICIAL_MODS.find((m) => m.key === key);
        ev.push({
          id: uid(), subjectId: ids[key], day: d,
          start: tramos[i][0], end: tramos[i][1],
          room: (mod && mod.room) || "", type: "clase",
        });
      });
    });
    return ev;
  }
  /* Quien ya tuviera el horario del centro cargado (el del primer documento) se actualiza solo
     al abrir la app, sin perder nada: se conserva el id de las clases que siguen existiendo
     (mismo día y mismo módulo), así que la asistencia y las excepciones que apuntaban a ellas
     siguen valiendo. Si hay alguna clase puesta a mano, no se toca nada. */
  function actualizarHorarioOficial(st, kind) {
    if (!st || !st.settings || !st.settings.timetableId) return false;
    if ((Number(st.settings.planVersion) || 1) >= PLAN_VERSION) return false;
    const todos = asArray(st.events);
    const clases = todos.filter((e) => !e.type || e.type === "clase");
    if (clases.some((e) => !esHoraDelCentro(e.start))) return false;   // hay clases suyas: mejor no tocar
    const viejas = {};
    clases.forEach((e) => {
      const k = e.day + "|" + e.subjectId;
      (viejas[k] = viejas[k] || []).push(e.id);
    });
    const ids = {};
    OFFICIAL_MODS.forEach((m) => { ids[m.key] = officialSubjectId(st, m); });
    const nuevas = officialEvents(ids, kind || st.settings.timetableKind || "curso").map((e) => {
      const cola = viejas[e.day + "|" + e.subjectId];
      return cola && cola.length ? Object.assign({}, e, { id: cola.shift() }) : e;
    });
    // Los bloques de estudio y todo lo que no sea una clase del centro se quedan como estaban.
    const otras = todos.filter((e) => e.type && e.type !== "clase");
    st.events = nuevas.concat(otras);
    st.settings.planVersion = PLAN_VERSION;
    return true;
  }
  function applyOfficialTimetable(st, kind = "curso") {
    const ids = {};
    OFFICIAL_MODS.forEach((m) => { ids[m.key] = officialSubjectId(st, m); });
    st.events = officialEvents(ids, kind);
    st.settings = st.settings || {};
    st.settings.timetableId = TIMETABLE_ID;
    st.settings.planVersion = PLAN_VERSION;
    st.settings.timetableKind = kind;
    st.settings.group = st.settings.group || "2SMR";
    if (!st.settings.center || /luis murillo/i.test(String(st.settings.center))) st.settings.center = "";
    st.settings.startHour = 15;
    st.settings.endHour = 23;
    st.settings.remindHour = st.settings.remindHour === 8 ? 14 : (st.settings.remindHour || 14);
    return ids;
  }
  /* Cambia las horas de las clases del centro sin tocar ids, excepciones ni asistencia.
     Si el horario tiene clases tuyas (horas raras) no se toca nada y devuelve false. */
  function retimarHorario(st, kind) {
    const tramos = OFFICIAL_SLOTS[kind] || OFFICIAL_SLOTS.curso;
    const horas = new Set();
    Object.values(OFFICIAL_SLOTS).forEach((t) => t.forEach((s) => horas.add(s[0])));
    const porDia = {};
    (st.events || []).forEach((e) => { (porDia[e.day] = porDia[e.day] || []).push(e); });
    const dias = Object.values(porDia);
    if (!dias.length) return false;
    if (dias.some((l) => l.some((e) => !horas.has(e.start) || (e.type && e.type !== "clase" && e.type !== "estudio")))) return false;
    dias.forEach((l) => {
      const clases = l.filter((e) => !e.type || e.type === "clase");
      clases.sort((a, b) => String(a.start).localeCompare(String(b.start)));
      clases.forEach((e, i) => { if (tramos[i]) { e.start = tramos[i][0]; e.end = tramos[i][1]; } });
    });
    return true;
  }
  // Se llama al abrir la app y cada poco: si toca la plantilla temporal, la pone sola.
  function syncPlantilla(st, fechaISO) {
    if (!st || !st.settings) return "";
    if (st.settings.timetableAuto === false) return "";
    if (!st.settings.timetableId) return "";                 // no hay horario del centro cargado
    const quiero = plantillaDeMes(fechaISO);
    if ((st.settings.timetableKind || "") === quiero) return "";
    if (!retimarHorario(st, quiero)) return "";
    st.settings.timetableKind = quiero;
    st.settings.plantillaDia = fechaISO || todayISO();
    return quiero;
  }
  function avisoPlantilla(kind) {
    return kind === "temporal"
      ? "Septiembre y junio: el centro entra a las 16:00 (horario temporal)"
      : "Horario del curso: entrada a las 15:10";
  }

  function seedDemo() {
    const s = defaultState();
    const ids = applyOfficialTimetable(s);
    s.settings.demo = true;
    s.notes = [
      { id: uid(), subjectId: ids.ser, title: "Puertos que hay que saber", content: "# Servicios y puertos\n\n- SSH :: 22\n- DNS :: 53\n- DHCP :: 67/68\n- HTTP :: 80\n- HTTPS :: 443\n- FTP :: 20/21\n- SMTP :: 25 / 587\n- IMAP :: 143 / 993\n- RDP :: 3389\n\n**Truco:** en clase siempre preguntan el puerto Y si es TCP o UDP.", pinned: true, createdAt: Date.now() - 86400000 * 3, updatedAt: Date.now() - 3600000 },
      { id: uid(), subjectId: ids.seg, title: "Amenazas y copias", content: "## Malware\nVirus, gusanos, troyanos, ransomware, spyware.\n\n## Copias 3-2-1\n3 copias, 2 soportes, 1 fuera del sitio.\n\n- Firewall :: filtra tráfico de red\n- ACL :: lista de control de acceso\n- Phishing :: engaño para robar credenciales\n- 2FA :: segundo factor de autenticación", pinned: false, createdAt: Date.now() - 86400000 * 2, updatedAt: Date.now() - 86400000 },
      { id: uid(), subjectId: ids.sor, title: "Active Directory en 1 hoja", content: "# Dominio Windows\n\n- **AD DS**: servicio de directorio.\n- **OU**: unidad organizativa (agrupa usuarios/equipos).\n- **GPO**: políticas que se aplican a OU.\n- **SID**: identificador de seguridad del objeto.\n\n- net user :: gestionar usuarios locales\n- gpupdate /force :: aplicar GPO ya", pinned: false, createdAt: Date.now() - 86400000, updatedAt: Date.now() - 7200000 },
      { id: uid(), subjectId: ids.web, title: "HTML mínimo para el módulo", content: "# Esqueleto\n\n`<!DOCTYPE html>` + charset UTF-8.\n\n- `<form method=\"post\">` envía al servidor.\n- CSS en archivo aparte (mantenible).\n- Nunca guardes contraseñas en claro.\n- GET :: pide un recurso\n- POST :: envía datos (login, formularios)", pinned: false, createdAt: Date.now() - 40000000, updatedAt: Date.now() - 40000000 },
    ];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      if (d.getDay() === 0) continue;
      s.sessions.push({ id: uid(), subjectId: s.subjects[i % s.subjects.length].id, date: localISO(d), minutes: 35 + ((i * 17) % 70), type: "pomodoro" });
    }
    // Notas de los módulos (lo que se ve en Calificaciones)
    const notasDemo = [7.5, 8.2, 6.5, 9, 7, 8.5, 6, 7.5, 8, 7];
    s.subjects.forEach((sub, i) => { sub.grade = notasDemo[i % notasDemo.length]; });
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
  let papeleraRecuperada = 0;   // notas que volvieron de la papelera al abrir (papelera retirada en la v54)

  const isObj = (v) => !!v && typeof v === "object" && !Array.isArray(v);
  const asArray = (v) => (Array.isArray(v) ? v : []);
  const asText = (v, fb) => (typeof v === "string" && v.trim() ? v : (fb || ""));
  const asISO = (v) => (typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "");
  const asHHMM = (v, fb) => (/^\d{1,2}:\d{2}$/.test(String(v)) ? String(v) : fb);
  const asColor = (v, fb) => (/^#[0-9a-fA-F]{3,8}$/.test(String(v)) ? String(v) : fb);

  // Convierte lo que venga (copia importada, versión vieja) en un estado usable.
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
    // Aula ya no se sincroniza con ningún servidor: se limpian ajustes de versiones anteriores
    delete settings.syncUrl;
    delete settings.syncPin;
    delete out._guide;   // el borrador de la guía docente se retiró
    delete out.trash;    // la papelera se retiró (lo que hubiera dentro ya está en out.notes)
    delete out.tasks;    // y los deberes también: la app es horario + estudio, sin pendientes
    if (!Number.isFinite(Number(settings.dailyGoal)) || Number(settings.dailyGoal) <= 0) settings.dailyGoal = 90;
    settings.pomodoroWork = clamp(Number(settings.pomodoroWork) || 25, 1, 180);
    settings.pomodoroBreak = clamp(Number(settings.pomodoroBreak) || 5, 1, 60);
    settings.pomodoroLong = clamp(Number(settings.pomodoroLong) || 15, 1, 120);
    settings.gradeMax = clamp(Number(settings.gradeMax) || 10, 5, 100);
    settings.startHour = Number.isFinite(Number(settings.startHour)) ? clamp(Number(settings.startHour), 0, 23) : base.settings.startHour;
    settings.endHour = Number.isFinite(Number(settings.endHour)) ? clamp(Number(settings.endHour), 1, 24) : base.settings.endHour;
    out.settings = settings;

    const subjects = asArray(src.subjects).filter(isObj).map((s) => ({
      id: asText(s.id) || uid(),
      name: asText(s.name, "Módulo sin nombre"),
      teacher: asText(s.teacher),
      room: asText(s.room),
      credits: Number(s.credits) || 0,
      color: asColor(s.color, "#64748b"),
      // Nota del módulo (0..nota máxima). "" = todavía sin nota.
      // Si el módulo tiene esquema de evaluación (v67.5), esta nota es la de los que no lo usan:
      // con esquema, la nota final la calcula estadoModulo() a partir de los componentes.
      grade: (s.grade === "" || s.grade == null || !Number.isFinite(Number(s.grade))) ? "" : clamp(Number(s.grade), 0, Number(settings.gradeMax) || 10),
      eval: saneEval(s.eval, Number(settings.gradeMax) || 10),
    }));
    out.subjects = subjects;
    const hasSub = (id) => subjects.some((s) => s.id === id);
    const subOf = (id) => (hasSub(id) ? id : (subjects[0] ? subjects[0].id : ""));

    out.events = asArray(src.events).filter(isObj).map((e) => ({
      id: asText(e.id) || uid(), subjectId: subOf(e.subjectId),
      day: clamp(Number(e.day) || 0, 0, 6),
      start: asHHMM(e.start, "09:00"), end: asHHMM(e.end, "10:00"),
      room: asText(e.room), type: asText(e.type, "clase"),
    }));

    // La papelera se retiró (v54): si quedaba algo dentro, vuelve a Apuntes en vez de desaparecer
    const dePapelera = asArray(src.trash).filter(isObj).filter((n) => n.title);
    papeleraRecuperada = dePapelera.length;
    out.notes = asArray(src.notes).concat(dePapelera).filter(isObj).map((n) => ({
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

    // Pruebas y exámenes (vuelven en la v61, con su pestaña en la barra de abajo)
    const maxNota = Number(settings.gradeMax) || 10;
    out.exams = asArray(src.exams).filter(isObj).filter((e) => asText(e.title) || asText(e.subjectId)).map((e) => ({
      id: asText(e.id) || uid(), subjectId: subOf(e.subjectId),
      title: asText(e.title, "Prueba"), kind: asText(e.kind, "Examen"),
      date: asISO(e.date) || todayISO(), time: /^\d{1,2}:\d{2}$/.test(String(e.time)) ? String(e.time) : "",
      room: asText(e.room), topics: asText(e.topics),
      grade: (e.grade === "" || e.grade == null || !Number.isFinite(Number(e.grade))) ? "" : clamp(Number(e.grade), 0, maxNota),
      // Agenda (v67.5): los trabajos pueden puntuar y apuntar a un componente del esquema
      puntua: e.puntua !== false,
      componenteId: asText(e.componenteId),
      // Agenda (v67.6): un examen puede durar de una hora a otra, y una entrega tiene plazo
      endTime: asHHMM(e.endTime, ""),
      openDate: asISO(e.openDate),
      openTime: asHHMM(e.openTime, ""),
      estado: asText(e.estado),
      createdAt: Number(e.createdAt) || Date.now(),
    }));
    /* El plazo de una entrega va de apertura a cierre. Si la apertura llega después del cierre (o
       no hay cierre), no se enseña un plazo imposible: se descarta la apertura. */
    out.exams.forEach((e) => {
      if (e.openDate && e.openDate > e.date) { e.openDate = ""; e.openTime = ""; }
      if (String(e.kind || "").toLowerCase() !== "trabajo") {
        e.openDate = ""; e.openTime = ""; e.estado = "";
      } else if (!["pendiente", "entregado", "corregido"].includes(e.estado)) {
        e.estado = "pendiente";   // una entrega siempre está en uno de los tres estados
      }
      if (e.endTime && e.time && minutesOf(e.endTime) <= minutesOf(e.time)) e.endTime = "";
    });
    // Un componente que ya no existe (se borró o se cambió el esquema) deja de apuntar a nada
    out.exams.forEach((e) => {
      if (!e.componenteId) return;
      const ev = saneEval((subjects.find((s) => s.id === e.subjectId) || {}).eval, maxNota);
      if (!ev || !ev.componentes.some((c) => c.id === e.componenteId)) e.componenteId = "";
    });

    const prog = isObj(src.progress) ? src.progress : {};
    out.progress = {
      bonusXp: Number(prog.bonusXp) || 0, unlocked: isObj(prog.unlocked) ? prog.unlocked : {},
      daily: asISO(prog.daily), log: asArray(prog.log).filter(isObj).slice(0, 40),
      flags: isObj(prog.flags) ? prog.flags : {}, freeze: clamp(Number(prog.freeze ?? 1), 0, 9),
      lastFreezeWeek: asText(prog.lastFreezeWeek),
    };
    out.schemaVersion = SCHEMA_VERSION;   // migraciones futuras: v4 -> v5 se hacen aquí
    out.exceptions = asArray(src.exceptions).filter(isObj).filter((x) => ["cancel", "move", "extra", "holiday"].includes(x.kind) && asISO(x.date)).map((x) => ({
      id: asText(x.id) || uid(), kind: x.kind, date: asISO(x.date), eventId: asText(x.eventId),
      subjectId: hasSub(x.subjectId) ? x.subjectId : "", start: asHHMM(x.start, ""), end: asHHMM(x.end, ""),
      room: asText(x.room), note: asText(x.note), toDate: asISO(x.toDate), fromDate: asISO(x.fromDate),
    }));

    // Compatibilidad de versiones anteriores
    if (((out.settings || {}).skin || "") === "pokemon") out.settings.skin = "hub";
    out.subjects.forEach((s) => {
      if (/^IPE/i.test(s.name) && (!s.color || s.color === "#64748b")) s.color = "#14b8a6";
      // v67.12: su optativa de 2.º SMR es Programación; los datos guardados traían el
      // nombre genérico de la plantilla oficial. Idempotente: si ya se llama Programación, no toca nada.
      if (/optativ|módulo optativo/i.test(s.name) && !/programaci/i.test(s.name)) s.name = "Programación";
    });
    return out;
  }

  /* Esquemas de evaluación que ya me ha pasado el usuario (v67.5). Se aplican solos la primera
     vez que la app arranca con ese módulo, y solo si no tiene ya un esquema montado a mano.
     Los RA van sin lista: los nombres los pone él (no me los invento). */
  const ESQUEMAS_CONOCIDOS = [
    {
      sello: "eval-servicios-red-v1",
      coincide: ["servicios en red"],
      componente: [["Examen de teoría", 40], ["Examen práctico", 40], ["Prácticas", 20]],
      raTodos: true,
      nota: "Servicios en red ya tiene su esquema: 40 % teoría · 40 % práctico · 20 % prácticas (y hay que aprobar todos los RA).",
    },
    // v67.12: en Programación (su optativa) y en SOR la final es la MEDIA DE LOS TEMAS y hay que
    // aprobarlos todos. El 60 % trabajos / 40 % exámenes lo aplica él al notar cada tema fuera de
    // la app; aquí cada tema es un componente de igual peso y la regla «todos» exige la mitad.
    // Se siembra un «Tema 1» como marcador de posición para que el esquema exista y él añada el resto.
    {
      sello: "eval-programacion-v1",
      coincide: ["programación", "programacion", "módulo optativo", "optativa"],
      componente: [["Tema 1", 100]],
      todos: true,
      nota: "Programación: nota final = media de los temas y hay que aprobarlos todos. Añade tus temas en el esquema.",
    },
    {
      sello: "eval-sor-v1",
      coincide: ["sistemas operativos en red", "sistemas operativos"],
      componente: [["Tema 1", 100]],
      todos: true,
      nota: "Sistemas operativos en red: nota final = media de los temas y hay que aprobarlos todos.",
    },
  ];

  function aplicarEsquemasConocidos(st) {
    if (!asArray(st.subjects).length) return "";
    st.progress = isObj(st.progress) ? st.progress : { flags: {} };
    st.progress.flags = isObj(st.progress.flags) ? st.progress.flags : {};
    const hechos = st.progress.flags;
    const max = Number(st.settings && st.settings.gradeMax) || 10;
    let aviso = "";
    ESQUEMAS_CONOCIDOS.forEach((k) => {
      if (hechos[k.sello]) return;
      const sub = st.subjects.find((x) => x && x.name && k.coincide.some((m) => String(x.name).toLowerCase().includes(m)));
      if (!sub || evalDe(sub)) { hechos[k.sello] = 1; return; }   // ya hay uno puesto: no se toca
      sub.eval = saneEval({
        componentes: k.componente.map(([nombre, peso]) => ({ id: uid(), nombre, peso, sobre: max, nota: "" })),
        reglas: { ra: { activo: !!k.raTodos, lista: [] }, min: { activo: false }, todos: { activo: !!k.todos } },
      }, max);
      hechos[k.sello] = 1;
      aviso = k.nota;
    });
    return aviso;
  }

  // ================================================================
  // ESTADO: CARGAR / GUARDAR / MIGRAR
  // ================================================================

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
      loadProblem = "Los datos guardados estaban dañados y no se han podido leer. He conservado una copia del original.";
      return seedDemo();
    }
    const out = sanitize(parsed);
    // La plantilla oficial ya no machaca el horario del usuario: solo se aplica
    // cuando no hay ni horario ni marca previa, o si el usuario lo pide.
    const sinHorario = !asArray(out.events).length;
    if (sinHorario && !asText(out.settings.timetableId)) applyOfficialTimetable(out);
    // El horario del centro cambió (v67.2): se pone al día solo, conservando asistencia y avisos.
    actualizarHorarioOficial(out, out.settings.timetableKind);
    // Los esquemas de evaluación que ya me ha pasado el usuario (v67.5)
    const avisoEsquema = aplicarEsquemasConocidos(out);
    if (avisoEsquema) setTimeout(() => toast(avisoEsquema), 1200);
    aplicarCursoPersonal(out);
    return out;
  }

  /* Ajustes de SU curso (v67.12), aplicados una sola vez (sello en progress.flags):
     1. Sus clases acaban el 27 de febrero de 2027; después vienen las prácticas (FCT) y
        el horario de esas lo dirá él. El calendario oficial sigue siendo el de la
        Generalitat, pero el rango «con clase» que mira dayInfo es el suyo.
     2. En todos los módulos hay que aprobar todos los temas: los esquemas que ya
        tuviera montados a mano reciben la regla «todos» activa. */
  function aplicarCursoPersonal(st) {
    st.progress = isObj(st.progress) ? st.progress : { flags: {} };
    st.progress.flags = isObj(st.progress.flags) ? st.progress.flags : {};
    const hechos = st.progress.flags;
    if (isObj(st.settings) && !hechos["fin-clases-feb-v1"]) {
      st.settings.endDate = "2027-02-27";
      hechos["fin-clases-feb-v1"] = 1;
    }
    if (!hechos["regla-todos-v1"]) {
      asArray(st.subjects).forEach((s) => {
        if (s && isObj(s.eval) && isObj(s.eval.reglas)) {
          s.eval.reglas.todos = { activo: true };
        }
      });
      hechos["regla-todos-v1"] = 1;
    }
  }

  let saveTimer = null;

  // JSON del último guardado correcto. Navegar (render) programa un save() aunque no haya
  // cambiado nada; comparar contra esto evita reescribir localStorage y re-empujar los widgets
  // en cada vistazo a una pantalla de solo lectura.
  let lastSavedJson = null;
  function save() {
    if (state.settings && state.settings.guest) return;
    let json;
    try { json = JSON.stringify(state); } catch { saveProblem = "Los datos no se pueden preparar para guardar."; return; }
    if (json === lastSavedJson) return;   // nada cambió desde el último guardado
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
      lastSavedJson = json;
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
    reprogramarAvisos();
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
  let view = ["dashboard","schedule","timer","review","achievements"].includes(state.settings.startView) ? state.settings.startView : "dashboard";
  let calendarCursor = new Date(); calendarCursor.setDate(1);
  let noteId = null, notePreview = false, noteFilter = "all", noteQuery = "";
  let noteQueryTimer = null;   // retardo del buscador de apuntes
  let cardFilter = "all", cardFlip = false, cardQueue = [];
  let subjectFocus = null, cmdOpen = false, cmdIndex = 0, cmdItems = [];
  let deferredInstall = null, wakeLock = null;
  let schView = "week";
  let examFilter = "proximos";          // proximos · todos · pasados
  let examTipo = "";                    // "" · examenes · trabajos (la Agenda mezcla ambos)
  let schWeek = 0;                       // 0 = semana actual; -1 y +1 las de al lado
  const plantillaAuto = syncPlantilla(state);
  let exDate = "";
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

  // La cabecera se separa del contenido en cuanto se hace scroll
  function marcarScroll() {
    const v = $("#view");
    document.body.classList.toggle("scrolled", !!v && v.scrollTop > 4);
  }

  function applyTheme() {
    const id = state.settings.skin || "hub";
    document.documentElement.setAttribute("data-skin", id);
    let theme = state.settings.uiTheme;
    if (theme !== "light" && theme !== "dark") theme = LIGHT.has(id) ? "light" : "dark";
    // Tema automático: primero mira la preferencia del sistema (prefers-color-scheme),
    // y si no hay, cae a la hora del día (oscuro de 21:00 a 08:00).
    if (state.settings.autoTheme) {
      const sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
      const h = new Date().getHours();
      if ((sysDark || h < 8 || h >= 21) && LIGHT.has(id)) theme = "dark";
    }
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
    if (st.guest) document.body.classList.add("guest-mode");
    else document.body.classList.remove("guest-mode");
    const chip = $("#guest-chip");
    if (chip) chip.hidden = !st.guest;
    temaHoraAplicado = new Date().getHours();
  }
  // El tema automático cambia de día a noche sin recargar la app (se mira cada pocos segundos).
  let temaHoraAplicado = -1;
  function revisarTemaPorHora() {
    if (!state.settings.autoTheme) return false;
    const h = new Date().getHours();
    if (h === temaHoraAplicado) return false;
    applyTheme();
    return true;
  }

  // Aviso con botón: se queda en pantalla hasta que se toca (o pasan 20 s)
  function toastAccion(msg, textoBoton, alTocar) {
    const el = document.createElement("div");
    el.className = "toast toast-accion";
    const t = document.createElement("span");
    t.textContent = msg;
    const b = document.createElement("button");
    b.type = "button";
    b.className = "btn btn-sm btn-primary";
    b.textContent = textoBoton;
    b.addEventListener("click", () => { el.remove(); alTocar(); });
    el.appendChild(t);
    el.appendChild(b);
    $("#toast-root").appendChild(el);
    setTimeout(() => el.remove(), 20000);
    return el;
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
    // La hoja del modal va dentro de .modal-card: sin ella los campos se amontonaban
    // en la fila del flex (título a la izquierda, formulario a la derecha y recortado).
    $("#modal-root").innerHTML = `
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal-card">
          <h2>${esc(title)}</h2>
          <form id="modal-form">${bodyHTML}
            <div class="modal-actions">
              <button type="button" class="btn" data-action="close-modal">Cancelar</button>
              <button type="submit" class="btn ${danger ? "btn-danger" : "btn-primary"}">${esc(confirm)}</button>
            </div>
          </form>
        </div>
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
  // Nota media del ciclo: la nota de cada modulo (se pone a mano en Modulos o en Notas)
  /* —————————————— Esquema de evaluación por módulo (v67.5) ——————————————
     Cada módulo puede tener su propio reparto de notas: componentes con nombre y peso, notas
     que no siempre son sobre 10, y reglas especiales (aprobar todos los RA, nota mínima en un
     componente...) que pueden suspender aunque la media pondere bien.

     Todo lo que decide la nota final y el aprobado vive aquí, para que el boletín, el radar, la
     ficha del módulo y la media del ciclo solo tengan que preguntar. Un módulo SIN esquema se
     comporta exactamente como antes: su `grade` a mano. */

  function evalDe(sub) {
    return sub && isObj(sub.eval) && Array.isArray(sub.eval.componentes) && sub.eval.componentes.length ? sub.eval : null;
  }

  // Los trabajos de la Agenda que puntúan y apuntan a este componente
  function trabajosDeComponente(sub, c) {
    if (!sub || !c) return [];
    return asArray(state.exams).filter((e) => e && e.componenteId === c.id && e.puntua !== false
      && e.grade !== "" && e.grade != null && Number.isFinite(Number(e.grade)));
  }

  /* Nota que cuenta para un componente: si tiene trabajos de la Agenda que puntúan, la media de
     esos trabajos (así no hay que meterla dos veces); si no, la que hayas escrito a mano.
     `modo: "manual"` fuerza tu nota aunque haya trabajos. */
  function notaDeComponente(sub, c) {
    const sobre = Number(c && c.sobre) > 0 ? Number(c.sobre) : (Number(state.settings.gradeMax) || 10);
    const trabajos = trabajosDeComponente(sub, c);
    const bruta = c.nota === "" || c.nota == null || !Number.isFinite(Number(c.nota)) ? null : clamp(Number(c.nota), 0, sobre);
    if ((c.modo || "auto") === "manual" || !trabajos.length) {
      return { nota: bruta, sobre, origen: bruta == null ? "" : "mano", trabajos };
    }
    const media = trabajos.reduce((a, e) => a + clamp(Number(e.grade), 0, sobre), 0) / trabajos.length;
    return { nota: Math.round(media * 100) / 100, sobre, origen: "agenda", trabajos };
  }

  function pesoTotal(ev) {
    return (ev ? ev.componentes : []).reduce((a, c) => a + (Number(c.peso) || 0), 0);
  }

  // Media ponderada en escala 0-10. Un componente sin nota NO cuenta (no es un 0): así ves
  // «lo que llevas» mientras el curso avanza, igual que la media del ciclo con los módulos.
  function mediaEsquema(sub) {
    const ev = evalDe(sub);
    if (!ev) return null;
    let suma = 0, peso = 0;
    ev.componentes.forEach((c) => {
      const n = notaDeComponente(sub, c);
      if (n.nota == null) return;
      const p = clamp(Number(c.peso) || 0, 0, 100);
      if (p <= 0) return;
      suma += (n.nota / n.sobre) * 10 * p;
      peso += p;
    });
    return peso ? suma / peso : null;
  }

  /* Estado del módulo: nota final (en la escala de la app), aprobado/suspendido y el porqué.
     Con esquema, la nota sale de la media ponderada; sin esquema, de la nota a mano. */
  function estadoModulo(sub) {
    const max = Number(state.settings.gradeMax) || 10;
    const ev = evalDe(sub);
    if (!ev) {
      const n = sub.grade === "" || sub.grade == null || !Number.isFinite(Number(sub.grade)) ? null : clamp(Number(sub.grade), 0, max);
      return { nota: n, aprobado: n == null ? null : n >= max / 2, motivo: "", tieneEsquema: false, conNota: 0, total: 0 };
    }
    const m10 = mediaEsquema(sub);
    const nota = m10 == null ? null : Math.round((m10 * max / 10) * 100) / 100;
    const conNota = ev.componentes.filter((c) => notaDeComponente(sub, c).nota != null).length;
    let motivo = "";
    if (nota != null && nota < max / 2) motivo = "La media no llega al " + (max / 2).toFixed(1).replace(".0", "");
    // Reglas especiales: pueden suspender aunque la media dé aprobado
    const ra = ev.reglas && ev.reglas.ra;
    if (nota != null && ra && ra.activo && Array.isArray(ra.lista)) {
      const fallan = ra.lista.filter((x) => !x.ok);
      if (fallan.length) {
        motivo = fallan.length === 1
          ? "Sin aprobar: " + (fallan[0].nombre || "un RA")
          : fallan.length + " RA sin aprobar";
      }
    }
    if (nota != null && !motivo && ev.reglas && ev.reglas.min && ev.reglas.min.activo) {
      const malo = ev.componentes.find((c) => {
        const n = notaDeComponente(sub, c);
        return n.nota != null && Number(c.min) > 0 && n.nota < Number(c.min);
      });
      if (malo) motivo = "«" + malo.nombre + "» por debajo del mínimo (" + Number(malo.min).toFixed(1) + ")";
    }
    // v67.12: «hay que aprobar todos los temas»: un componente (tema) por debajo de la mitad
    // suspende el módulo aunque la media dé aprobado.
    if (nota != null && !motivo && ev.reglas.todos && ev.reglas.todos.activo) {
      const suspensos = ev.componentes.filter((c) => {
        const n = notaDeComponente(sub, c);
        return n.nota != null && n.nota < n.sobre / 2;
      });
      if (suspensos.length === 1) motivo = "Tema «" + suspensos[0].nombre + "» sin aprobar";
      else if (suspensos.length > 1) motivo = suspensos.length + " temas sin aprobar";
    }
    return { nota, aprobado: nota == null ? null : (nota >= max / 2 && !motivo), motivo, tieneEsquema: true, conNota, total: ev.componentes.length };
  }

  function notaModulo(sub) { return estadoModulo(sub).nota; }

  /* ————— Simulador: «¿qué nota necesito?» (v67.7) —————
     La pregunta de siempre la víspera de un examen: con lo que llevo, ¿cuánto tengo que sacar
     en lo que queda para llegar al 5, al 7 o al 9?

     La cuenta usa TODOS los componentes con peso, también los que aún no tienen nota — que es
     justo lo que la media de «lo que llevas» no hace, porque esa responde a otra pregunta. Es
     la cuenta que harías en un papel:

         necesaria = (objetivo · Σpesos − Σ(peso · nota)) / Σpesos de lo pendiente

     Todo en la escala del módulo (0–10 por defecto): un componente que va «sobre 4» se pasa a
     la escala del módulo antes de entrar, igual que hace la media ponderada de arriba.

     También devuelve `maxFinal`, lo máximo que puede acabar. Es la mitad útil de la respuesta:
     cuando ni sacando un 10 en todo lo que queda llega, no sirve de nada decir «necesitas un
     12,40» — lo que hay que decir es «ya no llegas, y lo máximo que puedes sacar es 6,80». */
  function notaNecesaria(sub, objetivo) {
    const max = Number(state.settings.gradeMax) || 10;
    const ev = evalDe(sub);
    const meta = clamp(Number(objetivo) || 0, 0, max);
    const base = {
      id: (sub && sub.id) || "", modulo: (sub && sub.name) || "", objetivo: meta, max,
      actual: null, necesaria: null, posible: false, yaEsta: false, maxFinal: null,
      pendientes: [], minimoPendiente: null, minSuspenso: [], raSinAprobar: [],
      sinEsquema: !ev, sinPeso: !ev, evaluados: 0, componentes: 0,
    };
    if (!ev) return base;

    let pesoTodo = 0, sumaNota = 0, pesoPendiente = 0;
    const pendientes = [], minSuspenso = [];
    const minActivo = !!(ev.reglas && ev.reglas.min && ev.reglas.min.activo);
    const todosActivo = !!(ev.reglas && ev.reglas.todos && ev.reglas.todos.activo);
    ev.componentes.forEach((c) => {
      const p = clamp(Number(c.peso) || 0, 0, 100);
      if (p <= 0) return;                     // un componente sin peso no decide nada
      pesoTodo += p;
      const n = notaDeComponente(sub, c);
      // Con «aprobar todos los temas» cada componente exige al menos la mitad, aunque
      // no tenga mínimo propio: el simulador lo trata como suelo igual que el min.
      const suelo = minActivo && Number(c.min) > 0 ? Number(c.min) : (todosActivo ? n.sobre / 2 : 0);
      if (n.nota == null) {
        pesoPendiente += p;
        pendientes.push({ id: c.id, nombre: c.nombre, peso: p, sobre: n.sobre, min: suelo });
        return;
      }
      sumaNota += (n.nota / n.sobre) * max * p;   // a la escala del módulo
      if (suelo > 0 && n.nota < suelo) minSuspenso.push({ nombre: c.nombre, min: suelo, sobre: n.sobre, nota: n.nota });
    });
    if (!pesoTodo) return Object.assign(base, { sinPeso: true, componentes: ev.componentes.length });

    const pesoEvaluado = pesoTodo - pesoPendiente;
    const actual = pesoEvaluado > 0 ? Math.round((sumaNota / pesoEvaluado) * 100) / 100 : null;
    // Lo máximo que puede acabar: lo que queda, todo al máximo
    const maxFinal = Math.round(((sumaNota + pesoPendiente * max) / pesoTodo) * 100) / 100;

    let necesaria = null, posible, yaEsta;
    if (pesoPendiente > 0) {
      necesaria = Math.round(((meta * pesoTodo - sumaNota) / pesoPendiente) * 100) / 100;
      yaEsta = necesaria <= 0;                       // llega aunque saque un 0 en lo que queda
      posible = necesaria <= max + 0.001;            // y no le piden más de lo que se puede sacar
    } else {
      // Ya está todo evaluado: no hay nada que calcular, solo comparar
      yaEsta = actual != null && actual >= meta - 0.001;
      posible = yaEsta;
    }
    // El componente pendiente que más exige: el que tiene el suelo más alto en proporción
    const minimoPendiente = pendientes.filter((c) => c.min > 0)
      .sort((a, b) => (b.min / b.sobre) - (a.min / a.sobre))[0] || null;
    const ra = ev.reglas && ev.reglas.ra;
    const raSinAprobar = ra && ra.activo && Array.isArray(ra.lista)
      ? ra.lista.filter((x) => !x.ok).map((x) => x.nombre || "un RA") : [];

    return Object.assign(base, {
      sinEsquema: false, sinPeso: false,
      actual, necesaria, posible, yaEsta, maxFinal,
      pendientes, minimoPendiente, minSuspenso, raSinAprobar,
      evaluados: ev.componentes.length - pendientes.length, componentes: ev.componentes.length,
      pesoPendiente, pesoTodo,
    });
  }

  // «5,50» en vez de «5.50»: en español la coma es el separador decimal
  const notaEs = (n) => (Number(n).toFixed(2).replace(".", ","));

  // Componente al que apunta una entrada de la Agenda (para enseñarlo en la tarjeta)
  function componenteDe(e) {
    const sub = subjectById(e && e.subjectId);
    const ev = evalDe(sub);
    if (!ev || !e || !e.componenteId) return null;
    const c = ev.componentes.find((x) => x.id === e.componenteId);
    return c ? { componente: c, sub } : null;
  }

  // Reparto del esquema listo para el usuario ("" si no hay nada que avisar)
  function avisoPesos(ev) {
    if (!ev) return "";
    const t = Math.round(pesoTotal(ev) * 100) / 100;
    if (!ev.componentes.length) return "Añade al menos un componente.";
    if (Math.abs(t - 100) > 0.01) return "Los pesos suman " + t.toFixed(t % 1 ? 1 : 0) + " % (lo normal es 100 %).";
    return "";
  }

  // Valida lo que llega (del editor o de una copia antigua) y devuelve un esquema limpio
  /* Números tal como los escribe una persona: con coma (9,5) y con espacios. Declarado como
     función para que esté disponible ya al cargar el estado (saneEval corre al arrancar). */
  function numEs(v) {
    if (typeof v === "string") v = v.trim().replace(",", ".");
    if (v === "" || v == null || (typeof v === "boolean")) return NaN;
    return Number(v);
  }

  function saneEval(raw, maxNota) {
    if (!isObj(raw) || !Array.isArray(raw.componentes)) return undefined;
    const max = Number(maxNota) || 10;
    const componentes = raw.componentes.filter(isObj).slice(0, 24).map((c) => {
      const sobre = clamp(numEs(c.sobre) || max, 1, 100);
      const bruta = c.nota === "" || c.nota == null || !Number.isFinite(numEs(c.nota)) ? "" : clamp(numEs(c.nota), 0, sobre);
      return {
        id: asText(c.id) || uid(),
        nombre: asText(c.nombre, "Componente").trim().slice(0, 60),
        peso: clamp(numEs(c.peso) || 0, 0, 100),
        sobre,
        nota: bruta,
        min: Number.isFinite(numEs(c.min)) && numEs(c.min) > 0 ? clamp(numEs(c.min), 0, sobre) : 0,
        modo: c.modo === "manual" ? "manual" : "auto",
      };
    });
    if (!componentes.length) return undefined;
    const reglas = isObj(raw.reglas) ? raw.reglas : {};
    const raRaw = isObj(reglas.ra) ? reglas.ra : {};
    const lista = asArray(raRaw.lista).filter(isObj).slice(0, 40).map((x) => ({
      id: asText(x.id) || uid(), nombre: asText(x.nombre).slice(0, 80), ok: !!x.ok,
    })).filter((x) => x.nombre);
    return {
      v: 1,
      componentes,
      reglas: {
        ra: { activo: !!raRaw.activo, lista },
        min: { activo: !!(isObj(reglas.min) && reglas.min.activo) },
        // v67.12: «aprobar todos los temas» — cada componente por debajo de la mitad suspende
        // el módulo aunque la media pondere bien.
        todos: { activo: !!(isObj(reglas.todos) && reglas.todos.activo) },
      },
    };
  }

  function weightedGPA() {
    // Solo cuentan los módulos CON nota: un módulo sin nota no es un 0.
    // (Antes, Number("") === 0 colaba los seis módulos y la media salía por los suelos.)
    const max = Number(state.settings.gradeMax) || 10;
    const notas = state.subjects
      .map((s) => notaModulo(s))
      .filter((n) => n != null && Number.isFinite(Number(n)))
      .map((n) => clamp(Number(n), 0, max));
    if (!notas.length) return null;
    return notas.reduce((a, b) => a + b, 0) / notas.length;
  }
  // Proximos dias sin clase (festivos y vacaciones que quedan por delante)
  function diasSinClase(n = 4) {
    const out = [];
    const d = new Date(todayISO() + "T12:00:00");
    for (let i = 0; i < 400 && out.length < n; i++) {
      const iso = localISO(d);
      const info = dayInfo(iso);
      if (iso > todayISO() && (info.kind === "festivo" || info.kind === "vacaciones")) out.push({ iso, info });
      d.setDate(d.getDate() + 1);
    }
    return out;
  }
  function nextClass() {
    if (isNonTeaching(todayISO())) return null;
    const now = new Date(), mins = now.getHours() * 60 + now.getMinutes();
    return eventsOnDate(todayISO()).find((e) => minutesOf(e.end) > mins) || null;
  }
  const WIDGET_CATALOG = [
    { id: "clase", name: "Próxima clase", size: "2×2", hint: "En curso o la siguiente" },
    { id: "hoy", name: "Hoy", size: "4×2", hint: "Clase y día sin clase" },
    { id: "horario", name: "Horario de hoy", size: "4×2", hint: "Tres bloques del día" },
    { id: "festivos", name: "Días sin clase", size: "4×2", hint: "Festivos y vacaciones" },
    { id: "media", name: "Nota media", size: "2×2", hint: "Media de tus módulos" },
    { id: "racha", name: "Racha", size: "2×2", hint: "Días seguidos" },
    { id: "estudio", name: "Estudio hoy", size: "2×2", hint: "Minutos de hoy" },
    { id: "semana", name: "Estudio semana", size: "2×2", hint: "Minutos de la semana" },
    { id: "xp", name: "Nivel / XP", size: "2×2", hint: "Nivel y experiencia" },
    { id: "fichas", name: "Fichas", size: "2×2", hint: "Repaso de hoy" },
    { id: "asistencia", name: "Asistencia", size: "2×2", hint: "Presente / retraso / falta" },
    { id: "curso", name: "Días de curso", size: "2×2", hint: "Hasta el inicio o el fin" },
    { id: "bandeja", name: "Bandeja", size: "2×2", hint: "Capturas rápidas" },
    { id: "foco", name: "Módulo a estudiar", size: "2×2", hint: "En qué concentrarte" },
    { id: "festivo", name: "Hoy / festivo", size: "2×2", hint: "Si hay clase o no" },
    { id: "hint", name: "Qué estudiar", size: "2×2", hint: "Consejo del día" },
    { id: "mini_clase", name: "Mini clase", size: "2×1", hint: "Tira compacta" },
    { id: "mini_racha", name: "Mini racha", size: "2×1", hint: "Tira compacta" },
    { id: "duo", name: "Clase | Festivo", size: "4×1", hint: "Dos columnas" },
  ];
  function widgetPayload() {
    const lb = liveBlock();
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
    const gpa = weightedGPA();
    const today = todayISO();
    const dow = weekdayMon0(new Date());
    const dia = dayInfo(today);
    const todayClasses = dia.kind === "lectivo" ? eventsOnDate(today) : [];
    const horarioRows = todayClasses.slice(0, 3).map((e) => ({
      t: e.start + "  " + subjectName(e.subjectId),
      s: e.end + (e.room ? " · " + e.room : ""),
    }));
    if (!horarioRows.length) horarioRows.push({ t: dia.kind === "lectivo" ? "Sin clases" : dia.short, s: dia.kind === "lectivo" ? "" : "Día sin clase" });
    const festivoRows = diasSinClase(3).map((x) => ({ t: x.info.label, s: fmtDate(x.iso) }));
    if (!festivoRows.length) festivoRows.push({ t: "Sin festivos por delante", s: "" });
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
    if (lb.active) foco = { kicker: "EN CURSO", title: subjectName(lb.active.ev.subjectId), sub: "Clase ahora" };
    else if (lb.next) foco = { kicker: "SIGUE", title: subjectName(lb.next.ev.subjectId), sub: "Próxima clase" };
    let festivo;
    if (dia.kind !== "lectivo") festivo = { kicker: dia.kind === "vacaciones" ? "VACACIONES" : dia.kind === "festivo" ? "SIN CLASE" : "HOY", title: dia.short, sub: "No hay clase" };
    else if (dow > 4) festivo = { kicker: "HOY", title: "Fin de semana", sub: "Sin clases" };
    else festivo = { kicker: "HOY", title: DAYS[dow] || "Hoy", sub: todayClasses.length ? (todayClasses.length + (todayClasses.length === 1 ? " clase" : " clases")) : "Sin clases" };
    const hintRaw = (window.AulaStudio && window.AulaStudio.todayStudyHint && window.AulaStudio.todayStudyHint())
      || "15 minutos de fichas del módulo que llevas más flojo";
    const hint = { kicker: "CONSEJO", title: String(hintRaw).slice(0, 90), sub: "Qué estudiar" };
    const gpaNum = gpa == null ? null : Number(gpa.toFixed(2));
    return {
      clase, gpa: gpaNum,
      hoy: { kicker: "HOY", title: clase.title, sub: dia.kind === "lectivo" ? (horarioRows[0] ? horarioRows[0].t : "Sin clases") : dia.label },
      horario: { kicker: "HORARIO HOY", rows: horarioRows },
      festivos: { kicker: "DÍAS SIN CLASE", rows: festivoRows },
      media: { kicker: "MEDIA", num: gpa == null ? "—" : gpa.toFixed(1), sub: "de tus módulos" },
      racha: { kicker: "RACHA", num: String(streak()), sub: streak() === 1 ? "día" : "días" },
      estudio: { kicker: "HOY", num: fmtHours(todayMins), sub: "estudio" },
      semana: { kicker: "SEMANA", num: fmtHours(weekMins), sub: "estudio" },
      xp: { kicker: "NIVEL " + lv.level, num: String(lv.xp), sub: lv.title },
      fichas: { kicker: "FICHAS", num: String(dueN), sub: "para hoy" },
      asistencia: { kicker: "ASISTENCIA", num: att.pct == null ? "—" : att.pct + "%", sub: att.t ? (att.p + "P · " + att.r + "R · " + att.f + "F") : "sin pases" },
      curso: { kicker: "CURSO", num: cursoNum, sub: cursoSub },
      bandeja: { kicker: "BANDEJA", num: String(inboxN), sub: inboxN ? "capturas" : "vacía" },
      foco, festivo, hint,
      mini_clase: { kicker: clase.kicker, num: clase.title },
      mini_racha: { kicker: "RACHA", num: String(streak()) },
      duo: { lk: "CLASE", lt: clase.title, rk: "SIN CLASE", rt: festivoRows[0].t },
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
    cards: ["Fichas", "IP, OSI, Linux…"],
    timer: ["Estudio", "Bloques pomodoro"],
    stats: ["Gráficos", "Tiempo y notas"],
    subjects: ["Módulos", "Los módulos de SMR"],
    subject: ["Módulo", ""],
    settings: ["Ajustes", "Perfil, estudio, avisos y datos"],
    inbox: ["Bandeja", "Capturas rápidas"],
    review: ["Repaso", "Cómo va la semana"],
    achievements: ["Logros", "XP, niveles y medallas"],
    agenda: ["Agenda", "Día, semana y mes"],
    chatbot: ["Asistente", "Tus apuntes y tu calendario"],
    habits: ["Hábitos", "Repaso diario"],
    glossary: ["Glosario", "Términos del ciclo"],
    examode: ["Concentración", "Sin distracciones"],
    quickreview: ["Repaso rápido", "Un módulo a fondo"],
    admin: ["Datos locales", "Copias y estado"],
    rendimiento: ["Calificaciones", "Boletín de cada módulo"],
    exams: ["Agenda", "Exámenes, trabajos y entregas"],
    notes: ["Apuntes", "Texto del ciclo"],
    tools: ["Herramientas", "Hub técnico, estudio y sistema"],
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
      out.push(`<div class="save-warn is-guest">
        <span><b>Modo invitado.</b> Nada de lo que hagas se guarda al cerrar.</span>
        <button class="btn btn-sm btn-primary" data-action="guest-off">Guardar y salir</button></div>`);
    }
    return out.join("");
  }


  // ================================================================
  // RENDERIZADO Y NAVEGACIÓN
  // ================================================================

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
    const setCount = (id, n) => { const el = $(id); if (!el) return; el.textContent = n || ""; el.dataset.empty = n ? "0" : "1"; };
    setCount("#card-count", dueCards().length);
    setCount("#inbox-count", (state.inbox || []).length);
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
      dashboard: renderDashboard, schedule: renderSchedule, notes: renderNotes,
      cards: renderCards, timer: renderTimer, stats: renderStats,
      subjects: renderSubjects, subject: renderSubject, settings: renderSettings, inbox: renderInbox, review: renderReview, achievements: renderAchievements,
      agenda: () => S("agenda"), chatbot: () => S("chatbot"),
      habits: () => S("habits"), glossary: () => S("glossary"),
      examode: () => S("examode"), quickreview: () => S("quickreview"), admin: () => S("admin"),
      rendimiento: renderRendimiento, exams: renderExams,
      tools: () => (window.AulaTools && typeof window.AulaTools.view === "function")
        ? window.AulaTools.view()
        : (cargarTools(), `<div class="empty"><b>Herramientas SMR</b><p>Cargando el hub técnico…</p></div>`),
    };
    // Una vista que falle no debe dejar la app en blanco: se enseña el aviso y se sigue.
    let cuerpo = "";
    try {
      cuerpo = (map[view] || renderDashboard)();
    } catch (err) {
      console.error("Vista " + view, err);
      cuerpo = errorViewHTML(view, err);
    }
    $("#view").innerHTML = bannersHTML() + cuerpo;
    // El chat se queda mirando al mensaje más nuevo: antes, la respuesta aparecía por debajo
    // del scroll y parecía que no había contestado.
    if (view === "chatbot" && window.AulaStudio && typeof window.AulaStudio.montarChat === "function") {
      try { window.AulaStudio.montarChat(); } catch {}
    }
    marcarScroll();
    if (view === "stats") drawStats();
    if (view === "timer") updateTimerUI();
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

  // Panel de emergencia: si una vista revienta, se puede seguir usando la app.
  function errorViewHTML(v, err) {
    const detalle = esc(String((err && err.message) || err || "error").slice(0, 200));
    return `<div class="card">
      <h3>Esta pantalla ha fallado</h3>
      <p class="hint" style="margin-top:0">Lo demás sigue funcionando. Tus datos están guardados.</p>
      <p class="hint" style="font-size:12px;opacity:.8">${esc(v)} · ${detalle}</p>
      <div class="hero-actions">
        <button class="btn btn-primary" data-action="go" data-to="dashboard">Volver a Inicio</button>
        <button class="btn" data-action="export">Exportar copia</button>
        <button class="btn" data-action="reload">Recargar la app</button>
      </div>
    </div>`;
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

  // ================================================================
  // LOGROS, XP Y NIVELES
  // ================================================================

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
    const cardsRep = state.cards.filter((c) => (c.reps || 0) > 0).length;
    const cardsMany = state.cards.reduce((a, c) => a + (c.reps || 0), 0);
    const notesN = state.notes.length;
    const attP = (state.attendance || []).filter((a) => a.status === "presente").length;
    const subjectsStudied = new Set(state.sessions.map((s) => s.subjectId)).size;
    const weekend = state.sessions.some((s) => {
      const d = new Date(s.date + "T12:00:00");
      return d.getDay() === 0 || d.getDay() === 6;
    });
    const wr = weekRange();
    const weekDays = new Set(state.sessions.filter((s) => s.date >= wr.from && s.date <= wr.to && s.minutes > 0).map((s) => s.date));
    const goalDays = Number(state.settings.weekGoalDays) || 5;
    const notable = state.subjects.some((s) => Number(s.grade) >= 7);
    const excel = state.subjects.some((s) => Number(s.grade) >= 9);
    const conNota = state.subjects.filter((s) => Number.isFinite(Number(s.grade)) && s.grade !== "").length;
    const inbox0 = (state.inbox || []).length === 0 && notesN > 0;
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
      { id: "subjects5", cat: "organizacion", ico: "5", name: "Ciclo completo", desc: "Cinco módulos dados de alta.", xp: 20, on: state.subjects.length >= 5 },
      { id: "note1", cat: "organizacion", ico: "✎", name: "Primer apunte", desc: "Crea una nota.", xp: 10, on: notesN >= 1 },
      { id: "note10", cat: "organizacion", ico: "📓", name: "Cuaderno lleno", desc: "10 notas guardadas.", xp: 30, on: notesN >= 10 },
      { id: "inbox0", cat: "organizacion", ico: "∅", name: "Bandeja a cero", desc: "Vacía la bandeja habiendo usado la app.", xp: 15, on: inbox0 },
      { id: "att10", cat: "organizacion", ico: "P", name: "Asistencia seria", desc: "10 pases de lista en presente.", xp: 20, on: attP >= 10 },
      { id: "card1", cat: "evaluacion", ico: "🃏", name: "Primera ficha", desc: "Repasa al menos una ficha.", xp: 10, on: cardsRep >= 1 },
      { id: "card20", cat: "evaluacion", ico: "20", name: "Mazo caliente", desc: "20 fichas distintas repasadas.", xp: 35, on: cardsRep >= 20 },
      { id: "reps50", cat: "evaluacion", ico: "50", name: "Memoria muscular", desc: "50 repasadas en total.", xp: 45, on: cardsMany >= 50 },
      { id: "grade1", cat: "evaluacion", ico: "★", name: "Primera nota", desc: "Pon la nota de un módulo.", xp: 15, on: conNota >= 1 },
      { id: "grade5", cat: "evaluacion", ico: "5", name: "Boletín al día", desc: "Nota puesta en 5 módulos.", xp: 40, on: conNota >= 5 },
      { id: "notable", cat: "evaluacion", ico: "7", name: "Notable", desc: "Un módulo con 7 o más.", xp: 30, on: notable },
      { id: "excelente", cat: "evaluacion", ico: "9", name: "Sobresaliente", desc: "Un módulo con 9 o más.", xp: 60, on: excel },
      { id: "skin", cat: "exploracion", ico: "◐", name: "Cambio de look", desc: "Prueba un tema distinto al inicial.", xp: 10, on: (state.settings.skin || "hub") !== "hub" },
      { id: "export", cat: "exploracion", ico: "⤓", name: "Copia de seguridad", desc: "Exporta el JSON o el calendario.", xp: 15, on: !!state.progress.flags?.exported },
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
        <p style="margin:0;color:var(--muted);font-size:13.5px;line-height:1.55">1 minuto de estudio = 1 XP. Además: ficha bien +8 / fácil +12, bloque de estudio +5, presente +3, check-in diario +8. Cada logro suma su bonus una sola vez.</p>
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
      <p>Tu ciclo de <b>2.º SMR</b> en el móvil: horario, calendario escolar, apuntes, fichas y taller. Todo se queda aquí, sin cuenta ni nube.</p>
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
        <div class="field"><label>Inicio</label><input id="on-start" type="date" value="${esc(st.startDate || COURSE.start)}"></div>
        <div class="field"><label>Fin</label><input id="on-end" type="date" value="${esc(st.endDate || COURSE.end)}"></div>
      </div>
      <label class="switch"><span class="switch-t">Incluir sábado en el horario</span><input id="on-sat" type="checkbox" role="switch" ${st.includeSaturday ? "checked" : ""}/></label>
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
          <b>Empezar de cero</b><small>Sin clases ni notas. Tú creas los módulos.</small>
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
      <p>Locales, en este móvil: aviso de clase y fichas de repaso. En Android hay que dar permiso.</p>
      <button class="btn btn-block mb-12 ${st.notify ? "btn-primary" : ""}" type="button" data-action="enable-notify">
        ${st.notify && typeof Notification !== "undefined" && Notification.permission === "granted" ? "Avisos activos" : "Activar avisos"}
      </button>
      ${chk("set-nclass", st.notifyClass !== false, "Clase (10 min antes)")}
      ${chk("set-nca", st.notifyCards !== false, "Fichas de repaso")}
      ${foot(true, "Listo")}
    </div>`;
    return `<div class="onboard-full">
      ${onDots(6)}
      <h2>Todo listo</h2>
      <p>Ya puedes usar Aula SMR. En Ajustes se cambia lo que quieras, y hay <b>Configurar de nuevo</b> si hace falta.</p>
      <button class="btn btn-primary btn-block" data-action="on-finish">Entrar a Inicio</button>
    </div>`;
  }

  // ================================================================
  // VISTA: INICIO (DASHBOARD)
  // ================================================================

  function renderDashboard() {
    const today = todayISO();
    const todayMins = state.sessions.filter((x) => x.date === today).reduce((a, b) => a + b.minutes, 0);
    const gpa = weightedGPA();
    const dueN = dueCards().length;
    const wr = weekRange();
    const mon = new Date(wr.from + "T00:00:00");
    const lb = liveBlock();
    const dia = dayInfo(today);
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
    } else if (dia.kind !== "lectivo") {
      liveHtml = `<div class="idle-note">${esc(dia.label || dia.short)} · sin clases</div>`;
    } else {
      liveHtml = `<div class="idle-note">No hay más clases por hoy</div>`;
    }
    const startD = state.settings.startDate ? daysUntil(state.settings.startDate) : null;
    const endD = state.settings.endDate ? daysUntil(state.settings.endDate) : null;
    let courseHtml = "";
    if (startD != null && startD > 0) {
      courseHtml = `<div class="course-soon">
        <div><div class="v">${startD}</div><span class="k">${startD === 1 ? "día para empezar" : "días para empezar"}</span></div>
        <div><div class="v">${fmtDate(state.settings.startDate)}</div><span class="k">primer día de clase</span></div>
      </div>`;
    } else if (endD != null && endD > 0) {
      courseHtml = `<div class="course-soon">
        <div><div class="v">${endD}</div><span class="k">${endD === 1 ? "día de curso" : "días de curso"}</span></div>
        <div><div class="v">${fmtDate(state.settings.endDate)}</div><span class="k">último día de clase</span></div>
      </div>`;
    }
    const todayClasses = dia.kind === "lectivo" ? eventsOnDate(today) : [];
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
    // Cambio de la v57: en vez de exámenes, los días que no hay clase (lo que importa en el calendario del centro)
    const sinClase = diasSinClase(3);
    const sinClaseHtml = `<div>
        <div class="sec-head"><h3>Días sin clase</h3><button data-action="sch-view" data-mode="month" class="linkish">Calendario</button></div>
        ${sinClase.length
          ? `<div class="soon-list">${sinClase.map((x) => `<div class="soon-row">
              <span class="d">${daysUntil(x.iso)} d</span>
              <span class="n">${esc(x.info.label)}</span>
              <span class="r">${esc(fmtDate(x.iso))}</span>
            </div>`).join("")}</div>`
          : `<p class="hint">No quedan festivos ni vacaciones por delante.</p>`}
      </div>`;
    // Próxima prueba: una tira fina, solo si hay algo apuntado por delante
    const proxExam = asArray(state.exams).filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
    const dExam = proxExam ? daysUntil(proxExam.date) : null;
    const proxEsTrabajo = proxExam ? esTrabajo(proxExam) : false;
    const proxExamenHtml = proxExam
      ? `<button class="exam-strip" data-action="go" data-to="exams">
          <span class="k">${proxEsTrabajo
            ? (dExam === 0 ? "La entrega es hoy" : dExam === 1 ? "Entrega mañana" : "Entrega en " + dExam + " días")
            : (dExam === 0 ? "Prueba hoy" : dExam === 1 ? "Prueba mañana" : "En " + dExam + " días")}</span>
          <b>${esc(proxExam.title)}</b>
          <small>${esc(subjectName(proxExam.subjectId))} · ${proxEsTrabajo
            ? "hasta el " + esc(fmtDate(proxExam.date)) + (proxExam.time ? " a las " + esc(proxExam.time) : "")
            : esc(fmtDate(proxExam.date)) + (proxExam.time ? " · " + esc(proxExam.time) + (proxExam.endTime ? " – " + esc(proxExam.endTime) : "") : "")}</small>
          <span class="exam-strip-x" aria-hidden="true">›</span>
        </button>`
      : "";
    const pills = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(mon); d.setDate(mon.getDate() + i);
      const iso = localISO(d);
      // El número en rojo era para todo lo que no es lectivo: un festivo, un día de vacaciones,
      // un finde y también los días de antes de empezar el curso. En septiembre eso pintaba la
      // semana entera en rojo (que en un colegio se lee como «suspenso»). Ahora el rojo es solo
      // para los festivos de verdad; vacaciones en ámbar y lo de fuera del curso en gris.
      const info = dayInfo(iso);
      const fuera = iso < cursoIni() || iso > cursoFin();
      const tipo = fuera ? "fuera" : info.kind === "festivo" ? "fest" : info.kind === "vacaciones" ? "vac" : info.kind === "finde" ? "finde" : "";
      pills.push({ iso, n: d.getDate(), lbl: DAYS_SHORT[i], today: iso === today, tipo });
    }
    return `
      ${state.settings.demo && state.settings.onboarded ? `<div class="card demo-banner">
        <div><strong>Datos de ejemplo</strong><div class="hint">Horario de muestra del centro. Quédatelo o bórralo.</div></div>
        <div class="hero-actions">
          <button class="btn btn-primary" data-action="keep-demo">Quedármelo</button>
          <button class="btn" data-action="clear-demo">Empezar de cero</button>
        </div>
      </div>` : ""}
      ${courseHtml}
      ${(startD != null && startD > 0) ? "" : liveHtml}
      ${proxExamenHtml}
      ${tocaAvisarCopia() ? `<div class="card copia-card">
        <div class="sec-head"><h2>Copia de seguridad</h2></div>
        <p class="hint" style="margin-top:0">${nuncaCopiada() ? "Nunca has guardado una copia" : "Hace " + diasDesdeCopia() + " días de tu última copia"}. Tus apuntes viven solo en este móvil: si se pierde o se rompe, se van con él.</p>
        <button class="btn btn-sm btn-primary" data-action="export">Guardar copia ahora</button>
      </div>` : ""}
      ${todayList}
      ${state.settings.onboarded && typeof Notification !== "undefined" && Notification.permission !== "granted" ? `<div class="idle-note note-action">
        <span>Activa avisos: clase y fichas de repaso.</span>
        <button class="btn btn-sm" data-action="enable-notify">Activar avisos</button>
      </div>` : ""}
      <div class="bento">
        <button class="bento-card" data-action="go" data-to="rendimiento">
          <div class="bento-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 3v9l6 3"/></svg></div>
          <div><div class="num">${gpa == null ? "—" : gpa.toFixed(1)}<span>/10</span></div><div class="lbl">Nota media</div></div>
        </button>
        <button class="bento-card" data-action="go" data-to="timer">
          <div class="bento-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 1.5M9 3h6"/></svg></div>
          <div><div class="num">${todayMins}<span>m</span></div><div class="lbl">Estudio hoy</div></div>
        </button>
        <button class="bento-card" data-action="go" data-to="cards">
          <div class="bento-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="5" width="12" height="16" rx="2"/><path d="M16 7h4v14H8"/></svg>
            ${dueN ? '<span class="dot-alert"></span>' : ""}</div>
          <div><div class="num">${dueN}</div><div class="lbl">Fichas hoy</div></div>
        </button>
        <button class="bento-card" data-action="go" data-to="achievements">
          <div class="bento-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><circle cx="12" cy="12" r="4"/></svg></div>
          <div><div class="num">${streak()}<span>d</span></div><div class="lbl">Racha</div></div>
        </button>
      </div>
      <div>
        <div class="sec-head"><h3>Tu semana</h3><button data-action="go" data-to="schedule" class="linkish">Ver todo</button></div>
        <div class="week-pills">${pills.map((d) => `<button class="week-pill ${d.today ? "is-today" : ""}" data-action="jump-day" data-date="${d.iso}" data-tipo="${d.tipo}">${d.lbl}<b>${d.n}</b></button>`).join("")}</div>
      </div>
      ${sinClaseHtml}
      <div class="study-rec">
        <div class="k">Qué estudiar hoy</div>
        <p>${esc((window.AulaStudio && window.AulaStudio.todayStudyHint && window.AulaStudio.todayStudyHint()) || "Abre fichas 15 minutos o avanza el módulo que llevas más flojo.")}</p>
        <div class="hero-actions">
          <button class="btn btn-sm btn-primary" data-action="go" data-to="quickreview">Repaso rápido</button>
          <button class="btn btn-sm" data-action="go" data-to="cards">Fichas</button>
          <button class="btn btn-sm" data-action="freeze-use">Comodín (${(state.progress && state.progress.freeze) ?? 1})</button>
          ${streak() >= 1 ? `<button class="btn btn-sm" data-action="rollover-week">Semana nueva</button>` : ""}
        </div>
      </div>
    `;
  }

  /* Huecos de verdad entre clases: si un día te queda una hora suelta (por ejemplo, una clase
     suspendida) se ofrece para estudiar. El margen son TUS clases de ese día, no la jornada del
     ajuste: antes se contaba desde las 8:00 hasta las 21:00 y salían «huecos libres» de madrugada
     y a las tantas de la noche, justo los que sobraban. */
  function studyGapsHTML(iso, list, esHoy) {
    if (!list.length) return "";
    const day = weekdayMon0(new Date(iso + "T12:00:00"));
    const sorted = [...list].sort((a, b) => minutesOf(a.start) - minutesOf(b.start));
    const ajusteIni = (Number.isFinite(Number(state.settings.startHour)) ? Number(state.settings.startHour) : 8) * 60;
    const ajusteFin = (Number.isFinite(Number(state.settings.endHour)) ? Number(state.settings.endHour) : 21) * 60;
    const ini = Math.max(ajusteIni, minutesOf(sorted[0].start));
    const fin = Math.min(ajusteFin, Math.max(...sorted.map((e) => minutesOf(e.end))));
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
        <div class="class-body"><b>Hueco libre · ${mins} min</b><small>${esHoy ? "Estudia ahora" : "Rato libre"}</small></div>
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
  function classRowHTML(e, esHoy, iso) {
    const nowM = nowMinutes();
    const liveNow = !!esHoy && minutesOf(e.start) <= nowM && nowM < minutesOf(e.end);
    const att = attStatus(e.id, iso || todayISO());
    const showAtt = state.settings.showAttendance !== false && !!esHoy;
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
  function lunesDe(offset) {
    const d = new Date(todayISO() + "T12:00:00");
    d.setDate(d.getDate() - weekdayMon0(d) + (Number(offset) || 0) * 7);
    return localISO(d);
  }
  function semanaDe(iso) {
    const a = new Date(lunesDe(0) + "T12:00:00");
    const b = new Date(iso + "T12:00:00");
    return Math.round((b - a) / (7 * 86400000));
  }

  // ================================================================
  // VISTA: HORARIO Y CALENDARIO
  // ================================================================

  function renderSchedule() {
    const daysN = state.settings.includeSaturday ? 6 : 5;
    const hoy = todayISO();
    const lunes = lunesDe(schWeek);
    const dias = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(lunes + "T12:00:00");
      d.setDate(d.getDate() + i);
      return localISO(d);
    }).slice(0, daysN);
    const plantilla = state.settings.timetableKind === "temporal" ? "temporal" : "curso";
    const tramos = OFFICIAL_SLOTS[plantilla] || OFFICIAL_SLOTS.curso;
    const rango = new Date(dias[0] + "T12:00:00").getDate() + " – " + fmtDate(dias[daysN - 1]);
    const auto = state.settings.timetableAuto !== false;
    const avisoAuto = `<span class="chip is-quiet" title="El horario cambia solo en septiembre y junio">
      ${plantilla === "temporal" ? "Horario temporal" : "Horario del curso"} · ${tramos[0][0]}–${tramos[tramos.length - 1][1]}${auto ? " · automático" : ""}</span>`;
    const semanaActiva = dias.filter((iso) => dayInfo(iso).kind === "lectivo").length;
    const weekHtml = `
      <div class="sec-head"><h3>Semana del <span class="sem-rango">${rango}</span></h3>
        <span class="sec-tools">
          <button class="btn btn-sm" data-action="sch-week" data-delta="-1" aria-label="Semana anterior">‹</button>
          <button class="btn btn-sm" data-action="sch-week" data-delta="0" ${schWeek === 0 ? "disabled" : ""}>Hoy</button>
          <button class="btn btn-sm" data-action="sch-week" data-delta="1" aria-label="Semana siguiente">›</button>
          <button class="hub-round" data-action="add-event" aria-label="Añadir clase">+</button>
        </span></div>
      <div class="chips-row">
        ${avisoAuto}
        <span class="chip is-quiet">${semanaActiva === 1 ? "1 día de clase" : semanaActiva + " días de clase"}</span>
        ${state.settings.showAttendance !== false ? `<span class="att-key" aria-hidden="true">
          <span><i class="k att-p"></i>Presente</span>
          <span><i class="k att-r"></i>Retraso</span>
          <span><i class="k att-f"></i>Falta</span>
        </span>` : ""}
      </div>
      <div class="week-board">
        ${dias.map((iso, i) => {
          const info = dayInfo(iso);
          const list = info.kind === "lectivo" ? eventsOnDate(iso) : [];
          const esHoy = iso === hoy;
          return `<section class="sch-day ${esHoy ? "is-today" : ""} ${info.kind === "lectivo" ? "" : "is-off"}" id="sch-day-${i}">
            <div class="sch-day-h">
              <strong>${DAYS[i]} ${Number(iso.slice(8))}</strong>
              ${esHoy ? `<span class="badge hot">hoy</span>` : ""}
              <span class="sch-n">${info.kind === "lectivo" ? (list.length ? list.length + (list.length === 1 ? " clase" : " clases") : "libre") : esc(info.short)}</span>
            </div>
            <div class="sch-day-list">
              ${list.length
                ? list.map((e) => classRowHTML(e, esHoy, iso)).join("") + studyGapsHTML(iso, list, esHoy)
                : `<div class="sch-empty">${esc(info.kind === "lectivo" ? "Sin clases" : info.label)}</div>`}
            </div>
          </section>`;
        }).join("")}
      </div>
      <div class="filters" style="margin-top:10px">
        <button class="btn btn-sm" data-action="csv-import">Importar CSV</button>
        <button class="btn btn-sm" data-action="share-timetable">Compartir</button>
        <button class="btn btn-sm" data-action="sch-view" data-mode="month">Ver el calendario escolar</button>
      </div>
      <input type="file" id="csv-file" accept=".csv,.txt" hidden aria-label="Archivo CSV del horario" />`;

    const monthHtml = renderCalendar();
    return `
      <div class="hub-seg">
        <button data-action="sch-view" data-mode="week" class="${schView === "week" ? "is-on" : ""}">Semana</button>
        <button data-action="sch-view" data-mode="month" class="${schView === "month" ? "is-on" : ""}">Calendario</button>
      </div>
      ${schView === "month" ? monthHtml : weekHtml + renderExceptionsBlock()}
    `;
  }

  /* Calendario escolar del centro (pestaña «Calendario» del Horario).
     Mes a mes del curso 2026-27: días de clase, festivos, vacaciones y fin de semana.
     Se puede tocar cualquier día para ver qué hay y saltar a su semana. */
  function renderCalendar() {
    const primero = new Date(COURSE.start + "T12:00:00");
    const ultimo = new Date(COURSE.end + "T12:00:00");
    const minMes = new Date(primero.getFullYear(), primero.getMonth(), 1);
    const maxMes = new Date(ultimo.getFullYear(), ultimo.getMonth(), 1);
    let cur = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth(), 1);
    const seSale = cur < minMes || cur > maxMes;
    if (cur < minMes) cur = minMes;
    if (cur > maxMes) cur = maxMes;
    if (seSale) calendarCursor = new Date(cur);   // el cursor se queda dentro del curso
    const enElPrimero = cur.getTime() === minMes.getTime();
    const enElUltimo = cur.getTime() === maxMes.getTime();
    const hoyISO = todayISO();
    const y = cur.getFullYear(), m = cur.getMonth();
    const startPad = weekdayMon0(new Date(y, m, 1));
    const daysIn = new Date(y, m + 1, 0).getDate();
    const cells = [];
    const sinClase = [];
    let lectivos = 0, festivosMes = 0, vacasMes = 0;
    for (let i = 0; i < startPad; i++) cells.push({ out: true });
    for (let d = 1; d <= daysIn; d++) {
      const iso = `${y}-${pad(m + 1)}-${pad(d)}`;
      const info = dayInfo(iso);
      if (info.kind === "lectivo") lectivos++;
      if (info.kind === "festivo") { festivosMes++; sinClase.push({ iso, info }); }
      if (info.kind === "vacaciones") { vacasMes++; sinClase.push({ iso, info }); }
      cells.push({ out: false, n: d, iso, info, hoy: iso === hoyISO });
    }
    while (cells.length % 7) cells.push({ out: true });
    const claseDia = (k) => k === "festivo" ? "is-hol" : k === "vacaciones" ? "is-vac" : k === "lectivo" ? "is-lectivo" : k === "finde" ? "is-finde" : "is-fuera";
    const celdas = cells.map((c) => c.out
      ? `<div class="cal-day out is-pad" aria-hidden="true"></div>`
      : `<button type="button" class="cal-day ${claseDia(c.info.kind)}${c.hoy ? " is-hoy" : ""}" data-action="cal-day" data-date="${c.iso}"${c.hoy ? ' aria-current="date"' : ""}
          aria-label="${esc(fmtDateLong(c.iso) + " · " + (c.info.kind === "lectivo" ? "día de clase" : c.info.label || "sin clase"))}"><span class="n">${c.n}</span></button>`).join("");
    // Si el mes toca unas vacaciones, se avisa con una píldora (nombre y fechas)
    const mesIni = new Date(y, m, 1);
    const mesFin = new Date(y, m + 1, 0, 23, 59);
    const vacaMes = VACATIONS.find((v) => {
      const desde = new Date(v.from + "T12:00:00"), hasta = new Date(v.to + "T12:00:00");
      return desde <= mesFin && hasta >= mesIni;
    });
    const enCurso = hoyISO >= COURSE.start && hoyISO <= COURSE.end;
    const mesDeHoy = enCurso && hoyISO.slice(0, 7) === `${y}-${pad(m + 1)}`;
    const proximo = diasSinClase(1)[0];
    const tipo = (k) => k === "vacaciones" ? "Vacaciones" : k === "festivo" ? "Festivo" : k === "finde" ? "Fin de semana" : k === "lectivo" ? "Clase" : "Sin curso";
    return `<div class="card cal-escuela">
      <div class="cal-head">
        <button class="cal-arrow" data-action="cal-prev" aria-label="Mes anterior" ${enElPrimero ? "disabled" : ""}>‹</button>
        <div class="cal-title">
          <b>${MONTHS[m]}</b>
          <small>${y} · curso hasta el ${fmtDate(COURSE.end)}</small>
        </div>
        <button class="cal-arrow" data-action="cal-next" aria-label="Mes siguiente" ${enElUltimo ? "disabled" : ""}>›</button>
      </div>
      <div class="cal-sum">
        <div><b>${lectivos}</b><small>${lectivos === 1 ? "día de clase" : "días de clase"}</small></div>
        <div><b>${festivosMes}</b><small>${festivosMes === 1 ? "festivo" : "festivos"}</small></div>
        <div><b>${vacasMes}</b><small>${vacasMes === 1 ? "día de vacaciones" : "días de vacaciones"}</small></div>
      </div>
      <div class="cal-actions">
        ${!mesDeHoy && enCurso ? `<button class="chip cal-hoy" data-action="cal-today">Ver hoy</button>` : ""}
        ${vacaMes ? `<span class="chip is-vac">${esc(vacaMes.name)} · ${esc(fmtDate(vacaMes.from))} → ${esc(fmtDate(vacaMes.to))}</span>` : ""}
        ${proximo ? `<span class="chip">En ${daysUntil(proximo.iso)} d · ${esc(proximo.info.label)}</span>` : ""}
      </div>
      <div class="cal-weekdays">${DAYS_SHORT.map((d) => `<span class="dow">${d}</span>`).join("")}</div>
      <div class="cal">${celdas}</div>
      <p class="cal-key">
        <span class="k k-lectivo"></span> Clase
        <span class="k k-hol"></span> Festivo
        <span class="k k-vac"></span> Vacaciones
        <span class="k k-fuera"></span> Sin curso
      </p>
    </div>
    <div class="card">
      <div class="sec-head"><h3>${sinClase.length ? "Festivos y vacaciones del mes" : "Este mes no hay clase"}</h3>${sinClase.length ? `<span class="badge">${sinClase.length} ${sinClase.length === 1 ? "día" : "días"}</span>` : ""}</div>
      ${sinClase.length
        ? `<div class="cal-list">${sinClase.map((x) => `<button type="button" class="cal-item ${x.info.kind === "vacaciones" ? "is-vac" : "is-hol"}" data-action="cal-day" data-date="${x.iso}">
            <span class="cal-item-d"><b>${new Date(x.iso + "T12:00:00").getDate()}</b><small>${DAYS_SHORT[weekdayMon0(new Date(x.iso + "T12:00:00"))]}</small></span>
            <span class="cal-item-t"><b>${esc(x.info.label)}</b><small>${new Date(x.iso + "T12:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })} · ${tipo(x.info.kind)}</small></span>
            <span class="cal-item-x" aria-hidden="true">›</span>
          </button>`).join("")}</div>`
        : `<p class="hint">Todo el mes son días de clase. Los días sueltos que caigan en fin de semana van marcados en gris.</p>`}
    </div>
    <div class="card">
      <div class="sec-head"><h3>Curso 2026-27</h3>${proximo ? `<span class="hint">lo próximo: ${esc(fmtDate(proximo.iso))}</span>` : ""}</div>
      <div class="info-list">
        <div class="info-row"><b>Empieza</b><span>${esc(fmtDateLong(COURSE.start))}</span></div>
        <div class="info-row"><b>Acaba</b><span>${esc(fmtDateLong(COURSE.end))}</span></div>
        ${VACATIONS.map((v) => `<div class="info-row"><b>${esc(v.name)}</b><span>${esc(fmtDate(v.from))} → ${esc(fmtDate(v.to))}</span></div>`).join("")}
        ${COURSE.local.map((d) => `<div class="info-row"><b>${esc(fmtDateLong(d))}</b><span>${esc(HOLIDAYS[d] || "Festivo local (Villena)")}</span></div>`).join("")}
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
        if (imgs[id]) return `<img class="note-img" src="${safeImgSrc(imgs[id]) || PUNTO_TRANSPARENTE}" alt="${esc(nombre)}" loading="lazy" decoding="async">`;   // foto antigua, dentro del texto
        if (mediaOk()) {
          const ya = Media().urlFor(id);   // en memoria se pinta ya; si no, se carga sola y se rellena
          return `<img class="note-img ${ya ? "" : "is-loading"}" data-media="${esc(id)}" src="${ya || PUNTO_TRANSPARENTE}" alt="${esc(nombre)}" loading="lazy" decoding="async">`;
        }
        return `<span class="hint">[imagen no disponible]</span>`;
      });
      // Compatibilidad con fotos antiguas guardadas como data URL dentro del texto
      t = t.replace(/!\[([^\]]*)\]\((data:image\/[^)\s]+)\)/g, (m, alt, src) =>
        `<img class="note-img" src="${safeImgSrc(src) || PUNTO_TRANSPARENTE}" alt="${esc(alt || "foto")}" loading="lazy" decoding="async">`);
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
  // Notas que pasan el filtro de módulo y el buscador (las protegidas no se destapan)
  function notasFiltradas() {
    let notes = [...state.notes].sort((a, b) => (b.pinned - a.pinned) || (b.updatedAt - a.updatedAt));
    if (noteFilter !== "all") notes = notes.filter((n) => n.subjectId === noteFilter);
    const q = noteQuery.trim().toLowerCase();
    if (q) {
      notes = notes.filter((n) => {
        if (n.locked && !unlockedNotes.has(n.id)) return (n.title || "").toLowerCase().includes(q);
        return (n.title || "").toLowerCase().includes(q) || notePlain(n).toLowerCase().includes(q);
      });
    }
    return notes;
  }

  // Solo la lista: así el buscador repinta esto y no la vista entera (ni el cursor del campo).
  function notasListaHTML() {
    const notes = notasFiltradas();
    if (!notes.length) {
      return noteQuery.trim()
        ? `<div class="empty">Ninguna nota coincide con «${esc(noteQuery.trim())}».</div>`
        : `<div class="empty"><b>Sin notas</b><p>Aquí viven tus apuntes, con fotos y fichas.</p><button class="btn btn-primary" data-action="add-note">Nueva nota</button></div>`;
    }
    return notes.map((n) => {
      const bloqueada = n.locked && !unlockedNotes.has(n.id);
      return `<button class="note-item ${n.id === noteId ? "is-active" : ""}" data-action="open-note" data-id="${n.id}">
        <h4>${n.pinned ? "📌 " : ""}${bloqueada ? "🔒 " : ""}${esc(n.title || "Sin título")}</h4>
        <p>${bloqueada ? "Nota protegida con PIN" : esc(notePlain(n).replace(/\s+/g, " ").slice(0, 80))}</p>
      </button>`;
    }).join("");
  }


  // ================================================================
  // VISTA: APUNTES
  // ================================================================

  function renderNotes() {
    const notes = notasFiltradas();
    if (!noteId && notes[0]) noteId = notes[0].id;
    const current = state.notes.find((n) => n.id === noteId);
    const lockedNow = current && current.locked && !unlockedNotes.has(current.id);
    const imgs = {};
    if (current && current.attachments) current.attachments.forEach((a) => { if (a.data) imgs[a.id] = a.data; });
    setTimeout(() => Media() && Media().hydrate($("#view")), 0);
    return `<div class="notes-layout">
      <div>
        <button class="btn btn-primary btn-block mb-10" data-action="add-note">Nueva nota</button>
        <input class="note-search" id="note-query" placeholder="Buscar…" aria-label="Buscar en las notas" value="${esc(noteQuery)}" />
        <div class="filters">
          <button class="chip ${noteFilter === "all" ? "is-on" : ""}" data-action="note-filter" data-id="all">Todas</button>
          ${state.subjects.map((s) => `<button class="chip ${noteFilter === s.id ? "is-on" : ""}" data-action="note-filter" data-id="${s.id}">${esc(s.name)}</button>`).join("")}
        </div>
        <div class="notes-list" id="notes-list">
          ${notasListaHTML()}
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
            <button class="btn btn-sm" data-action="note-share">Compartir</button>
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
              <img class="note-img ${src ? "" : "is-loading"}" src="${safeImgSrc(src) || PUNTO_TRANSPARENTE}" data-media="${esc(a.id)}" alt="${esc(a.name || "foto")}" loading="lazy" decoding="async">
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
      <div class="grid grid-2 stack-phone">
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
            <button class="btn btn-sm" data-action="edit-card" data-id="${c.id}" aria-label="Editar la ficha" title="Editar">✎</button>
            <button class="btn btn-sm" data-action="delete-card" data-id="${c.id}">×</button>
          </div>`;
          }).join("") || `<div class="empty"><b>Mazo vacío</b><p>Las fichas se crean a mano o desde una nota con «A fichas».</p><button class="btn btn-primary" data-action="add-card">Nueva ficha</button></div>`}
        </div>
      </div>
    `;
  }

  function renderTimer() {
    const today = todayISO();
    const todaySessions = state.sessions.filter((x) => x.date === today);
    const todayMins = todaySessions.reduce((a, b) => a + b.minutes, 0);
    return `
      <h2 style="margin:0;font-size:24px;font-weight:900;letter-spacing:-.04em">Enfoque</h2>
      <div class="card timer-card">
        <div class="seg seg-timer">
          <button data-action="timer-mode" data-mode="work" class="${timer.mode === "work" ? "is-on" : ""}">${state.settings.pomodoroWork}m</button>
          <button data-action="timer-mode" data-mode="break" class="${timer.mode === "break" ? "is-on" : ""}">${state.settings.pomodoroBreak}m</button>
          <button data-action="timer-mode" data-mode="long" class="${timer.mode === "long" ? "is-on" : ""}">${state.settings.pomodoroLong}m</button>
        </div>
        <div class="ring-wrap ${timer.mode === "work" ? "" : "break"}">
          <svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="52"></circle>
          <circle class="ring-fg" id="ring-fg" cx="60" cy="60" r="52"></circle></svg>
          <div class="ring-center"><div><div class="time" id="timer-display">25:00</div><div class="mode" id="timer-mode-lbl">Listo</div></div></div>
        </div>
        <div class="field"><label>Módulo</label>
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
    const graded = state.subjects.filter((s) => s.grade !== "" && Number.isFinite(Number(s.grade)));
    return `
      <div class="grid grid-4">
        <div class="stat"><div class="k">Total</div><div class="v">${fmtHours(total)}</div></div>
        <div class="stat"><div class="k">Semana</div><div class="v">${fmtHours(mins)}</div></div>
        <div class="stat"><div class="k">Nota media</div><div class="v">${weightedGPA() == null ? "—" : weightedGPA().toFixed(1)}</div></div>
        <div class="stat"><div class="k">Asistencia</div><div class="v">${attStats().pct == null ? "—" : attStats().pct + "%"}</div></div>
      </div>
      <div class="grid grid-2 stack-phone" style="margin-top:16px">
        <div class="card"><h3>Últimos 28 días</h3>
          <div class="heat">${heatDays().map((d) => `<i class="h${d.v}" title="${d.iso}${d.v ? "" : " · sin estudio"}"></i>`).join("")}</div>
          <p class="hint" style="margin:8px 0 0">Cada cuadro es un día, de más flojo a más estudiado.</p>
        </div>
        <div class="card"><h3>Horas por módulo (semana)</h3><div class="chart-box"><canvas id="chart-bar"></canvas></div></div>
        <div class="card"><h3>Boletín</h3>
          ${state.subjects.map((s) => {
            const g = graded.filter((e) => e.id === s.id);   // `graded` son módulos: la clave es `id`, no `subjectId`
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

  function renderSubjects() {
    const total = state.subjects.length;
    const horas = state.subjects.reduce((a, s) => a + studiedFor(s.id), 0);
    const notas = state.subjects.map((s) => (s.grade === "" || s.grade == null ? null : Number(s.grade))).filter((n) => n != null && isFinite(n));
    const media = notas.length ? notas.reduce((a, b) => a + b, 0) / notas.length : null;
    return `
    <div class="mini-stats">
      <div><b>${total}</b><small>${total === 1 ? "módulo" : "módulos"}</small></div>
      <div><b>${fmtHours(horas)}</b><small>estudiado</small></div>
      <div><b>${media == null ? "—" : media.toFixed(1)}</b><small>nota media</small></div>
    </div>
    <div class="subject-grid">
      ${state.subjects.map((s) => {
        const nota = s.grade === "" || s.grade == null ? null : Number(s.grade);
        return `<button class="subject-card" style="--c:${safeColor(s.color)}" data-action="open-subject" data-id="${s.id}">
          <span class="subj-code">${esc(String(s.key || s.name || "?").slice(0, 4))}</span>
          <b class="subj-name">${esc(s.name)}</b>
          ${nota == null ? "" : `<span class="subj-nota${nota >= 5 ? " is-ok" : " is-bad"}">${nota.toFixed(1)}</span>`}
          <span class="subj-meta">${esc(s.teacher || "Sin profesor")}${s.room ? " · " + esc(s.room) : ""}</span>
          <span class="subj-foot">${fmtHours(studiedFor(s.id))}${nota == null ? " · sin nota" : ""}</span>
        </button>`;
      }).join("")}
      <button class="subject-card is-new" data-action="add-subject">
        <span class="subj-code">+</span>
        <b class="subj-name">Nuevo módulo</b>
        <span class="subj-meta">Añade uno que no esté en la lista</span>
        <span class="subj-foot">Nombre, profesor, aula y color</span>
      </button>
    </div>`;
  }


  function renderSubject() {
    const s = subjectById(subjectFocus);
    if (!s) return `<div class="empty">No encontrado. <button class="btn" data-action="go" data-to="subjects">Volver</button></div>`;
    const notes = state.notes.filter((n) => n.subjectId === s.id);
    const sesiones = state.sessions.filter((x) => x.subjectId === s.id).length;
    const max = Number(state.settings.gradeMax) || 10;
    const est = estadoModulo(s);
    const ev = evalDe(s);
    const notaFicha = est.nota == null ? "—" : est.nota.toFixed(2);
    /* Con esquema, la nota del módulo ya no se escribe a mano: sale de los componentes. Sin
       esquema, todo queda como siempre. */
    const bloqueNota = ev ? `
      <div class="card" style="margin-top:16px">
        <div class="card-head"><div><b>Evaluación por componentes</b>
          <div class="hint" style="margin:4px 0 0">${est.conNota} de ${est.total} componentes con nota${est.motivo ? " · " + esc(est.motivo) : ""}</div></div></div>
        <div class="eval-lista">${ev.componentes.map((c) => {
          const nc = notaDeComponente(s, c);
          const col = nc.nota == null ? "var(--muted-2)" : nc.nota >= nc.sobre / 2 ? "var(--green)" : "var(--red)";
          return `<div class="eval-fila"><i style="background:${col}"></i>
            <span class="eval-n">${esc(c.nombre)}${nc.origen === "agenda" ? `<small> · Agenda (${nc.trabajos.length})</small>` : ""}</span>
            <span class="eval-p">${Number(c.peso).toFixed(Number(c.peso) % 1 ? 1 : 0)} %</span>
            <b class="eval-v">${nc.nota == null ? "—" : nc.nota.toFixed(2) + "<span>/" + nc.sobre + "</span>"}</b></div>`;
        }).join("")}</div>
        ${est.nota == null ? "" : `<p class="eval-pie ${est.aprobado ? "is-ok" : "is-bad"}">Nota final: <b>${est.nota.toFixed(2)}</b> / ${max} · ${est.aprobado ? "Aprobado" : "Suspenso"}</p>`}
        <div class="eval-acciones">
          <button class="btn btn-sm btn-primary" data-action="eval-notas" data-id="${s.id}">Meter notas</button>
          <button class="btn btn-sm" data-action="eval-simular" data-id="${s.id}">¿Qué nota necesito?</button>
          <button class="btn btn-sm" data-action="eval-editar" data-id="${s.id}">Editar esquema</button>
        </div>
        <p class="hint" style="margin:10px 0 0">Reparto: <b>${esc(ev.componentes.map((c) => c.nombre + " " + Number(c.peso).toFixed(Number(c.peso) % 1 ? 1 : 0) + "%").join(" · "))}</b>${avisoPesos(ev) ? " · " + esc(avisoPesos(ev)) : ""}</p>
      </div>` : `
      <div class="card" style="margin-top:16px">
        <div class="card-head"><div><b>Nota del módulo</b><div class="hint" style="margin:4px 0 0">${sesiones} ${sesiones === 1 ? "sesión de estudio" : "sesiones de estudio"} · profesor ${esc(s.teacher || "—")}</div></div>
          <button class="btn btn-sm btn-primary" data-action="edit-grade" data-id="${s.id}">${s.grade === "" || s.grade == null ? "Poner nota" : "Cambiar"}</button></div>
        <p class="hint" style="margin:10px 0 0">La nota es la del módulo, la que te sale al final. Con todas puestas, en <b>Calificaciones</b> ves la media del ciclo.</p>
        <div class="eval-acciones">
          <button class="btn btn-sm btn-ghost" data-action="eval-nuevo" data-id="${s.id}">Esquema de evaluación</button>
        </div>
        <p class="hint" style="margin:6px 0 0">Si este módulo se evalúa por partes (exámenes, prácticas…), monta su esquema y la nota se calcula sola.</p>
      </div>`;
    return `
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">
        <button class="btn" data-action="go" data-to="subjects">← Módulos</button>
        <button class="btn" data-action="edit-subject" data-id="${s.id}">Editar</button>
        <button class="btn btn-primary" data-action="timer-subject-go" data-id="${s.id}">Estudiar</button>
      </div>
      <div class="grid grid-4">
        <div class="stat"><div class="k">Estudio</div><div class="v">${fmtHours(studiedFor(s.id))}</div></div>
        <div class="stat"><div class="k">Nota</div><div class="v">${notaFicha}</div></div>
        <div class="stat"><div class="k">Apuntes</div><div class="v">${notes.length}</div></div>
        <div class="stat"><div class="k">Fichas</div><div class="v">${state.cards.filter((c) => c.subjectId === s.id).length}</div></div>
      </div>
      ${bloqueNota}
      ${notes.length ? `<div class="card" style="margin-top:16px"><h3>Apuntes de ${esc(s.name)}</h3>
        ${notes.slice(0, 6).map((n) => `<button class="row is-tap" data-action="open-note" data-id="${n.id}">
          <span class="dot" style="background:${safeColor(s.color)}"></span><div>${esc(n.title)}</div><div class="meta">${esc(fmtDate(localISO(new Date(n.updatedAt || Date.now()))))}</div>
        </button>`).join("")}</div>` : ""}
    `;
  }

  // ————————————————— Pruebas y exámenes (pestaña de la barra desde la v61)
  const EXAM_KINDS = ["Examen", "Prueba", "Práctico", "Recuperación", "Trabajo"];

  // Opciones del desplegable de componentes del esquema de un módulo
  function componenteOptions(sub, sel) {
    const ev = evalDe(sub);
    if (!ev) return "";
    return `<option value="">— sin componente —</option>` + ev.componentes.map((c) =>
      `<option value="${c.id}"${c.id === sel ? " selected" : ""}>${esc(c.nombre)} · ${Number(c.peso).toFixed(Number(c.peso) % 1 ? 1 : 0)} %</option>`).join("");
  }

  /* ————— Agenda con apartados (v67.6) —————
     Lo que se apunta aquí: exámenes y pruebas (con su hora de principio a fin) y trabajos o
     entregas (con su plazo: cuándo se abre y cuándo se cierra). Todo se organiza por módulo,
     como los temas y las actividades de Aules. */
  const esTrabajo = (e) => String((e && e.kind) || "").toLowerCase() === "trabajo";
  const ESTADOS = { pendiente: "Pendiente de hacer", entregado: "Entregado", corregido: "Corregido" };
  const estadoDe = (e) => (!esTrabajo(e) ? "" : (ESTADOS[e.estado] ? e.estado : "pendiente"));
  const etiquetaDe = (e) => (esTrabajo(e) ? (e.title || "Entrega") : (e.title || "Examen"));

  // ¿Se puede entregar ya? El plazo va de la apertura al cierre (las dos son opcionales).
  function plazoDe(e) {
    const hoy = todayISO();
    const desde = e.openDate || "";
    const abierta = (!desde || desde <= hoy) && e.date >= hoy;
    const cerrada = e.date < hoy;
    const pendiente = estadoDe(e) === "pendiente";
    return { desde, abierta, cerrada, pendiente };
  }

  // «lunes, 14 de septiembre de 2026, 20:30» — como lo escribe Aules
  function cuandoTexto(iso, hhmm) {
    if (!iso) return "";
    return fmtDateLong(iso) + (hhmm ? ", " + hhmm : "");
  }

  // El icono de cada tipo de prueba (documento, práctica, trabajo, recuperación…)
  function iconoExam(e) {
    const k = String((e && e.kind) || "").toLowerCase();
    if (k === "trabajo") return `<path d="M4 5h11l5 5v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/><path d="M15 5v5h5"/><path d="M8 14h6"/>`;
    if (k === "práctico" || k === "practico") return `<path d="M9 3v6.5L4.5 17a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L15 9.5V3"/><path d="M8 3h8M7 15h10"/>`;
    if (k === "recuperación" || k === "recuperacion") return `<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/>`;
    if (k === "prueba") return `<path d="M5 4h14v16H5z"/><path d="M9 9h6M9 13h6M9 17h3"/>`;
    return `<rect x="5" y="4" width="14" height="17" rx="2.5"/><path d="M9 4V3h6v1M8.5 10.5h6M8.5 14.5h4"/>`;
  }

  /* El desplegable del componente (o el aviso de que ese módulo aún no tiene esquema).
     Es una función porque el formulario la repinta al cambiar de módulo. */
  function campoComponente(sub, sel) {
    const ev = evalDe(sub);
    if (ev) {
      return `<label for="ex-comp">Componente del esquema de ese módulo</label>
        <select id="ex-comp" name="componenteId">${componenteOptions(sub, sel)}</select>
        <p class="hint" id="ex-comp-hint">Al poner la nota del trabajo, entra sola en ese componente.</p>`;
    }
    return `<p class="hint" id="ex-comp-hint"><b>${esc(sub ? sub.name : "Este módulo")}</b> todavía no tiene esquema de evaluación.
      <button type="button" class="btn btn-sm btn-ghost" data-action="eval-nuevo" data-id="${esc((sub || {}).id || "")}">Crear su esquema</button></p>`;
  }

  function examForm(e = {}) {
    const max = Number(state.settings.gradeMax) || 10;
    const tipo = String(e.kind || "Examen");
    const trabajo = tipo.toLowerCase() === "trabajo";
    const puntua = e.puntua !== false;
    const sub = subjectById(e.subjectId || subjectFocus || (state.subjects[0] || {}).id);
    const estado = ["pendiente", "entregado", "corregido"].includes(e.estado) ? e.estado : "pendiente";
    // El trabajo puede llenar un componente del esquema (así la nota no se mete dos veces)
    const bloqueTrabajo = `
      <div class="form-row">
        <div class="field"><label>Se abre</label><input name="openDate" type="date" value="${esc(e.openDate || "")}" /></div>
        <div class="field"><label>A las</label><input name="openTime" type="time" value="${esc(e.openTime || "")}" /></div>
      </div>
      <p class="hint" style="margin:-4px 0 10px">El plazo va de la apertura al cierre. Déjalo vacío si el profe no ha dicho cuándo se abre.</p>
      <div class="field"><label>Estado</label><select name="estado">
        ${Object.entries(ESTADOS).map(([k, t]) => `<option value="${k}"${estado === k ? " selected" : ""}>${t}</option>`).join("")}
      </select></div>
      <label class="switch" id="ex-puntua-wrap"><span class="switch-t">¿Puntúa para la nota?</span>
        <input id="ex-puntua" name="puntua" type="checkbox" role="switch" ${puntua ? "checked" : ""}/></label>
      <div class="field" id="ex-comp-campo"${puntua ? "" : " hidden"}>${campoComponente(sub, e.componenteId)}</div>`;
    /* Las mismas casillas sirven para los dos: en un examen la fecha es el día y la hora va de
       principio a fin; en una entrega, la fecha es el cierre del plazo. Al cambiar el tipo se
       ajustan las etiquetas y se esconden las casillas que no tocan (sin perder lo escrito). */
    return `
      <div class="field"><label>Módulo</label><select name="subjectId" id="ex-subject">${subjectOptions(e.subjectId || subjectFocus || (state.subjects[0] || {}).id)}</select></div>
      <div class="field"><label>Título</label><input name="title" required value="${esc(e.title || "")}" placeholder="${trabajo ? "A1 · Red NAT" : "Tema 3 · Subnetting"}" /></div>
      <div class="field"><label>Tipo</label><select name="kind" id="ex-kind">${EXAM_KINDS.map((k) => `<option${k.toLowerCase() === tipo.toLowerCase() ? " selected" : ""}>${k}</option>`).join("")}</select></div>
      <div class="form-row">
        <div class="field"><label id="ex-lbl-fecha">${trabajo ? "Se entrega" : "Fecha"}</label><input name="date" type="date" required value="${esc(e.date || todayISO())}" /></div>
        <div class="field ex-solo-examen"${trabajo ? " hidden" : ""}><label>Aula</label><input name="room" value="${esc(e.room || "")}" /></div>
      </div>
      <div class="form-row">
        <div class="field"><label id="ex-lbl-hora">${trabajo ? "Hasta las" : "Empieza"}</label><input name="time" type="time" value="${esc(e.time || "")}" /></div>
        <div class="field ex-solo-examen"${trabajo ? " hidden" : ""}><label>Acaba</label><input name="endTime" type="time" value="${esc(e.endTime || "")}" /></div>
      </div>
      <div id="ex-trabajo"${trabajo ? "" : " hidden"}>${bloqueTrabajo}</div>
      <div class="field"><label>${trabajo ? "Qué hay que entregar" : "Temas que entran"}</label><textarea name="topics" rows="2" placeholder="${trabajo ? "Memoria en PDF con las capturas…" : "Tema 1 y 2, práctica de VLSM…"}">${esc(e.topics || "")}</textarea></div>
      <div class="field"><label>Nota (si ya la sabes)</label><input name="grade" type="number" min="0" max="${max}" step="0.1" value="${e.grade === "" || e.grade == null ? "" : esc(String(e.grade))}" /></div>
    `;
  }

  // Cambia el formulario entre «examen» y «entrega» sin repintarlo (así no se pierde nada)
  function ajustarFormTipo(trabajo) {
    const caja = $("#ex-trabajo");
    if (caja) caja.hidden = !trabajo;
    const lf = $("#ex-lbl-fecha"), lh = $("#ex-lbl-hora");
    if (lf) lf.textContent = trabajo ? "Se entrega" : "Fecha";
    if (lh) lh.textContent = trabajo ? "Hasta las" : "Empieza";
    $$("#modal-form .ex-solo-examen").forEach((el) => { el.hidden = trabajo; });
  }

  function addExam(e, preset = {}) {
    if (!needSubjects()) return;
    const borrar = e ? `<p><button type="button" class="btn btn-danger btn-sm" data-action="delete-exam" data-id="${e.id}">Eliminar</button></p>` : "";
    openModal(e ? "Editar prueba" : "Nueva prueba", examForm({ ...preset, ...e }) + borrar, {
      confirm: e ? "Guardar" : "Apuntar",
      onSubmit(data) {
        const titulo = String(data.title || "").trim();
        if (!titulo) { toast("Ponle un título a la prueba"); return; }
        const max = Number(state.settings.gradeMax) || 10;
        const bruto = String(data.grade || "").trim();
        const trabajo = String(data.kind || "").toLowerCase() === "trabajo";
        const puntua = !trabajo || data.puntua !== false;
        const row = {
          id: (e && e.id) || uid(),
          subjectId: data.subjectId || "",
          title: titulo,
          kind: data.kind || "Examen",
          date: asISO(data.date) || todayISO(),
          time: /^\d{1,2}:\d{2}$/.test(String(data.time || "")) ? String(data.time) : "",
          room: String(data.room || "").trim(),
          topics: String(data.topics || "").trim(),
          grade: bruto === "" || !Number.isFinite(Number(bruto)) ? "" : clamp(Number(bruto), 0, max),
          // Solo los trabajos pueden puntuar y apuntar a un componente del esquema
          puntua,
          componenteId: trabajo && puntua ? String(data.componenteId || "") : "",
          // El plazo de la entrega (solo trabajos) y el final del examen
          openDate: trabajo ? asISO(data.openDate) : "",
          openTime: trabajo && asISO(data.openDate) && /^\d{1,2}:\d{2}$/.test(String(data.openTime || "")) ? String(data.openTime) : "",
          endTime: !trabajo && /^\d{1,2}:\d{2}$/.test(String(data.endTime || "")) ? String(data.endTime) : "",
          estado: trabajo && ESTADOS[String(data.estado || "")] ? String(data.estado) : (trabajo ? "pendiente" : ""),
          createdAt: (e && e.createdAt) || Date.now(),
        };
        // Un plazo imposible (se abre después de cerrarse) no se guarda
        if (row.openDate && row.openDate > row.date) { row.openDate = ""; row.openTime = ""; }
        if (row.endTime && row.time && minutesOf(row.endTime) <= minutesOf(row.time)) row.endTime = "";
        if (e) state.exams = state.exams.map((x) => (x.id === e.id ? row : x));
        else {
          state.exams = Array.isArray(state.exams) ? state.exams.concat(row) : [row];
          grantXP(4, "Prueba apuntada"); checkAchievements();
        }
        closeModal(); render();
        toast(e ? "Guardado: " + row.title
          : (trabajo
            ? (row.puntua ? (row.componenteId ? "Trabajo apuntado · cuenta en la nota" : "Trabajo apuntado") : "Entrega apuntada (no puntúa)")
            : "Apuntada: " + row.title));
      },
    });
  }


  // ================================================================
  // VISTA: AGENDA (EXÁMENES Y ENTREGAS)
  // ================================================================

  function renderExams() {
    /* La Agenda, organizada como la del instituto: lo siguiente que toca arriba, y luego cada
       módulo con sus cosas (exámenes y entregas) en orden de fecha. Los exámenes van de una hora
       a otra y las entregas tienen plazo (se abre → se cierra) y su estado. */
    const hoy = todayISO();
    const todos = asArray(state.exams).slice().sort((a, b) => String(a.date + (a.time || "")).localeCompare(String(b.date + (b.time || ""))));
    const nota = (e) => (e.grade === "" || e.grade == null ? null : Number(e.grade));
    const conNota = todos.filter((e) => nota(e) != null);   // exámenes y trabajos, juntos
    const media = conNota.length ? conNota.reduce((a, e) => a + nota(e), 0) / conNota.length : null;
    const proximos = todos.filter((e) => e.date >= hoy);
    const pasados = todos.filter((e) => e.date < hoy);
    const porTipo = examTipo === "examenes" ? todos.filter((e) => !esTrabajo(e))
      : examTipo === "trabajos" ? todos.filter(esTrabajo) : todos;
    const lista = examFilter === "todos" ? porTipo
      : examFilter === "pasados" ? porTipo.filter((e) => e.date < hoy).reverse()
      : porTipo.filter((e) => e.date >= hoy);
    const cuando = (e) => {
      const d = daysUntil(e.date);
      if (d === 0) return "Hoy";
      if (d === 1) return "Mañana";
      if (d > 1) return "En " + d + " días";
      return d === -1 ? "Ayer" : "Hace " + Math.abs(d) + " días";
    };

    // El estado se cambia desde la propia fila (como el desplegable de Aules)
    const chip = (e) => {
      const est = estadoDe(e);
      return `<button type="button" class="estado-chip is-${est}" data-action="exam-estado" data-id="${e.id}" title="Cambiar el estado" aria-label="Estado: ${ESTADOS[est]}">
        <span>${ESTADOS[est]}</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M6 9.5l6 6 6-6"/></svg>
      </button>`;
    };

    const fila = (e) => {
      const n = nota(e);
      const d = daysUntil(e.date);
      const trab = esTrabajo(e);
      const pl = plazoDe(e);
      // «Apertura: … · Cierre: …», con las palabras clave en negrita, como en Aules
      const meta = trab
        ? `<span class="exam-meta">${e.openDate ? `<b>Apertura:</b> ${esc(cuandoTexto(e.openDate, e.openTime))} · ` : ""}<b>${e.openDate ? "Cierre" : "Se entrega"}:</b> ${esc(cuandoTexto(e.date, e.time))}</span>`
        : `<span class="exam-meta">${esc(fmtDateLong(e.date))}${e.time ? " · " + esc(e.time) + (e.endTime ? " – " + esc(e.endTime) : "") : ""}${e.room ? " · " + esc(e.room) : ""}</span>`;
      const cuenta = trab && e.puntua !== false
        ? `<span class="exam-meta cola-nota">${componenteDe(e) ? "Cuenta en «" + esc(componenteDe(e).componente.nombre) + "»" : "Cuenta para la nota"}</span>`
        : trab ? `<span class="exam-meta cola-nota">No puntúa para la nota</span>` : "";
      // v67.7: la fila va dentro de un cajón (`.swipe`) que es lo que se desliza; debajo quedan
      // las dos franjas que dicen lo que va a pasar. El cajón es el que separa una fila de otra
      // (antes lo hacía `.exam-fila + .exam-fila`, y con el cajón en medio ya no son hermanas).
      const deslizable = trab && estadoDe(e) === "pendiente";
      return `<div class="swipe" data-swipe="${e.id}"${deslizable ? ` data-der="1"` : ""}>
        ${deslizable ? `<span class="swipe-fondo is-der" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M5 13l4 4L19 7"/></svg>Entregado</span>` : ""}
        <span class="swipe-fondo is-izq" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M4 20h4l10-10a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5 4 20Z"/><path d="M14 7l3 3"/></svg>Editar</span>
        <div class="exam-fila${d === 0 ? " is-hoy" : ""}${pl.cerrada && pl.pendiente ? " is-fuera" : ""}" data-action="edit-exam" data-id="${e.id}">
          <span class="exam-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">${iconoExam(e)}</svg></span>
          <span class="exam-fila-body">
            <b>${esc(e.title)}</b>
            ${meta}
            ${e.topics ? `<span class="exam-meta is-topics">${esc(e.topics)}</span>` : ""}
            ${cuenta}
            ${trab ? chip(e) : ""}
          </span>
          <span class="exam-fila-right">
            <span class="badge ${d < 0 ? "" : "soon"}">${esc(cuando(e))}</span>
            ${n == null ? "" : `<b class="exam-nota ${n >= 5 ? "is-ok" : "is-bad"}">${n.toFixed(1)}</b>`}
          </span>
        </div>
      </div>`;
    };

    // Lo siguiente que toca
    const prox = lista[0];
    const dProx = prox ? daysUntil(prox.date) : null;
    const proxTrab = prox ? esTrabajo(prox) : false;
    const hero = prox
      ? `<div class="exam-hero${dProx === 0 ? " is-hoy" : ""}">
          <span class="k">${dProx < 0 ? "La última" : dProx === 0 ? (proxTrab ? "La entrega es hoy" : "Es hoy") : dProx === 1 ? (proxTrab ? "La entrega es mañana" : "Es mañana") : (proxTrab ? "Próxima entrega" : "Próxima prueba")}</span>
          <b>${esc(prox.title)}</b>
          <small>${esc(subjectName(prox.subjectId))} · ${esc(cuandoTexto(prox.date, prox.time))}${prox.room ? " · " + esc(prox.room) : ""}</small>
          ${dProx < 0 ? "" : `<div class="exam-count"><b>${dProx}</b><span>${dProx === 1 ? "día" : "días"}</span></div>`}
          ${proxTrab && prox.openDate ? `<p class="hint exam-topics-hero">Se abre el ${esc(cuandoTexto(prox.openDate, prox.openTime))} y se entrega el ${esc(cuandoTexto(prox.date, prox.time))}.</p>`
            : (!proxTrab && prox.endTime && prox.time ? `<p class="hint exam-topics-hero">De ${esc(prox.time)} a ${esc(prox.endTime)}.</p>` : "")}
          ${prox.topics ? `<p class="hint exam-topics-hero">Entra: ${esc(prox.topics)}</p>` : ""}
        </div>`
      : `<div class="exam-hero vacio">
          <span class="k">${examFilter === "pasados" ? "Sin pruebas pasadas" : "Nada a la vista"}</span>
          <b>${examFilter === "pasados" ? "Todavía no ha pasado ninguna" : "Nada apuntado aquí"}</b>
          <small>${examFilter === "pasados" ? "Cuando pase la fecha, baja a este montón." : "Cambia de filtro o apunta una prueba nueva."}</small>
        </div>`;
    const filtros = [["proximos", "Próximas", proximos.length], ["pasados", "Pasadas", pasados.length], ["todos", "Todas", todos.length]];

    // Sin nada apuntado, un solo estado con su botón
    if (!todos.length) {
      return `
        <div class="empty empty-hero">
          <div class="empty-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg></div>
          <b>Aún no hay nada apuntado</b>
          <p>Apunta aquí cada examen, práctica o entrega: la app te lleva la cuenta (días que quedan, aviso la tarde antes y una hora antes). Los exámenes van de una hora a otra y las entregas, con su plazo: desde cuándo se abren hasta cuándo se pueden entregar.</p>
          <button class="btn btn-primary" data-action="add-exam">Añadir el primero</button>
        </div>`;
    }

    // Cada módulo, con sus cosas (el orden de los módulos, por su orden en la lista de módulos)
    const subOrden = new Map(state.subjects.map((s, i) => [s.id, i]));
    const grupos = [];
    lista.forEach((e) => {
      let g = grupos.find((x) => x.id === e.subjectId);
      if (!g) { g = { id: e.subjectId, items: [] }; grupos.push(g); }
      g.items.push(e);
    });
    grupos.sort((a, b) => (subOrden.get(a.id) ?? 999) - (subOrden.get(b.id) ?? 999));

    // El consejo del deslizamiento se enseña una sola vez: en cuanto lo usas, se apunta en el
    // estado y ya no vuelve a salir (nadie quiere un cartel fijo encima de su lista).
    const hayDeslizable = lista.some((e) => esTrabajo(e) && estadoDe(e) === "pendiente");
    const consejo = hayDeslizable && !flags().swipeUsado
      ? `<p class="swipe-consejo"><span class="swipe-consejo-ico" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><path d="M7 8 3 12l4 4M17 8l4 4-4 4M3 12h18"/></svg></span>
         <span>Desliza una entrega a la <b>derecha</b> para marcarla como entregada, o a la <b>izquierda</b> para abrirla y editarla.</span></p>`
      : "";

    return `
      ${hero}
      <div class="mini-stats">
        <div><b>${proximos.length}</b><small>por delante</small></div>
        <div><b>${todos.filter((e) => estadoDe(e) === "pendiente" && e.date >= hoy).length}</b><small>pendientes</small></div>
        <div><b>${media == null ? "—" : media.toFixed(1)}</b><small>nota media</small></div>
      </div>
      <div class="filters">
        ${filtros.map(([id, txt, n]) => `<button class="chip ${examFilter === id ? "is-on" : ""}" data-action="exam-filter" data-f="${id}">${txt} · ${n}</button>`).join("")}
      </div>
      <div class="filters filters-tipo">
        ${[["", "Todo", todos.length], ["examenes", "Exámenes", todos.filter((e) => !esTrabajo(e)).length], ["trabajos", "Trabajos", todos.filter(esTrabajo).length]]
          .map(([id, txt, n]) => `<button class="chip ${examTipo === id ? "is-on" : ""}" data-action="exam-tipo" data-f="${id}">${txt} · ${n}</button>`).join("")}
      </div>
      ${consejo}
      ${lista.length
        ? grupos.map((g) => `<section class="exam-sec">
            <div class="exam-sec-head"><i style="background:${safeColor(subjectColor(g.id))}"></i><b>${esc(subjectName(g.id))}</b><span>${g.items.length}</span></div>
            <div class="exam-grupo">${g.items.map(fila).join("")}</div>
          </section>`).join("")
        : `<div class="empty"><b>${examFilter === "pasados" ? "Todavía no hay pruebas pasadas" : "Nada apuntado aquí"}</b>
            <p>${examFilter === "pasados" ? "Cuando pase la fecha, la prueba baja a este montón." : "Cambia de filtro o apunta algo nuevo con el botón de abajo."}</p></div>`}
      <button class="btn btn-primary btn-block" data-action="add-exam">+ Añadir prueba o entrega</button>
    `;
  }

  /* ————— Deslizar las filas de la Agenda (v67.7) —————
     Como en el correo del móvil: arrastras la fila hacia un lado y debajo aparece, ya escrita,
     lo que va a pasar si la sueltas ahí.
       → a la DERECHA: la entrega pasa a «Entregado» (franja verde con su ✓)
       ← a la IZQUIERDA: se abre la prueba para editarla (franja azul con su ✎)

     Tres detalles que son los que hacen que se sienta bien y no un estorbo:
     1. Solo cuentan los gestos claramente horizontales (|dx| ≥ 10 y |dx| ≥ 1,4·|dy|). Si el
        dedo va hacia abajo, es que estás haciendo scroll y se deja correr la página.
     2. Después de deslizar, el clic que el navegador suelta al levantar el dedo NO cuenta:
        si no, la ficha se abría justo cuando lo que querías era marcarla como entregada.
     3. La franja se va viendo según lo que llevas arrastrado, y al pasar el umbral se queda
        fija: se ve cuándo el gesto ya vale. */
  const SWIPE_UMBRAL = 72;    // a partir de aquí, al soltar, el gesto cuenta
  const SWIPE_TOPE = 108;     // y a partir de aquí la fila no se mueve más (aunque sigas)
  const SWIPE_TAPA_CLIC = 800;  // ms durante los que se traga el clic posterior
  let swipeTapado = 0;        // instante del último deslizamiento que llegó a contar
  let sw = null;              // el deslizamiento en curso (null si el dedo no está arrastrando)

  function puntoTactil(e) {
    const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
    return t ? { x: Number(t.clientX) || 0, y: Number(t.clientY) || 0 } : null;
  }

  function iniciarSwipe(e) {
    const caja = e.target && e.target.closest ? e.target.closest(".swipe") : null;
    if (!caja || !caja.dataset.swipe) return;
    // Si el dedo empieza encima de un control (el desplegable del estado, un enlace…), se deja
    // en paz: ese dedo quiere pulsar, no arrastrar.
    if (e.target.closest("button, a, input, select, textarea, label")) return;
    const p = puntoTactil(e);
    if (!p) return;
    sw = { caja, x0: p.x, y0: p.y, dir: "", dx: 0 };
  }

  function pintarSwipe() {
    const { caja, dx } = sw;
    const fila = caja.querySelector(".exam-fila");
    if (fila) fila.style.transform = dx ? "translateX(" + dx + "px)" : "";
    caja.classList.toggle("is-der", dx > 0);
    caja.classList.toggle("is-izq", dx < 0);
    // Cuánto se ve la franja: proporcional al arrastre, hasta el umbral
    caja.style.setProperty("--swipe-p", String(Math.round(Math.min(1, Math.abs(dx) / SWIPE_UMBRAL) * 100) / 100));
    caja.classList.toggle("is-listo", Math.abs(dx) >= SWIPE_UMBRAL);
  }

  function moverSwipe(e) {
    if (!sw) return;
    const p = puntoTactil(e);
    if (!p) return;
    const dx = p.x - sw.x0, dy = p.y - sw.y0;
    if (!sw.dir) {
      // Todavía no se sabe qué quiere el dedo: se decide con el primer tramo claro
      if (Math.abs(dx) >= 10 && Math.abs(dx) >= 1.4 * Math.abs(dy)) {
        // Hacia la derecha solo tiene sentido en una entrega pendiente (un examen no se entrega)
        if (dx > 0 && sw.caja.dataset.der !== "1") { sw = null; return; }
        sw.dir = dx > 0 ? "der" : "izq";
        sw.caja.classList.add("is-swipe");
      } else if (Math.abs(dy) >= 10) {
        sw = null;   // es scroll: se suelta la fila y que la página siga
        return;
      } else return;   // aún no hay nada claro
    }
    // A partir de aquí el gesto es nuestro: que la página no se mueva a la vez
    if (typeof e.preventDefault === "function" && e.cancelable !== false) e.preventDefault();
    sw.dx = sw.dir === "der" ? clamp(dx, 0, SWIPE_TOPE) : clamp(dx, -SWIPE_TOPE, 0);
    pintarSwipe();
  }

  function soltarSwipe() {
    if (!sw) return;
    const { caja, dx } = sw;
    sw = null;
    caja.classList.remove("is-swipe", "is-der", "is-izq", "is-listo");
    caja.style.removeProperty("--swipe-p");
    const fila = caja.querySelector(".exam-fila");
    if (fila) fila.style.transform = "";   // vuelve a su sitio (o se repinta al actuar)
    if (Math.abs(dx) < SWIPE_UMBRAL) return;   // no llegó al umbral: se queda como estaba
    swipeTapado = Date.now();                  // el clic que viene detrás no cuenta
    const ex = asArray(state.exams).find((x) => x.id === caja.dataset.swipe);
    if (!ex) return;
    if (dx > 0) marcarEntregado(ex); else addExam(ex);
  }

  /* Marcar una entrega como entregada. Lo usan el desplegable de estado y el deslizamiento a la
     derecha, para que los dos caminos hagan exactamente lo mismo (y vibren igual). */
  function marcarEntregado(ex) {
    if (!ex) return;
    ex.estado = "entregado";
    vibrar("medio");
    // El consejo del deslizamiento ya cumplió su misión: no vuelve a salir
    ensureProgress();
    state.progress.flags = { ...(state.progress.flags || {}), swipeUsado: true };
    save(); render();
    toast("Entregado: " + etiquetaDe(ex));
  }

  document.addEventListener("touchstart", iniciarSwipe, { passive: true });
  document.addEventListener("touchmove", moverSwipe, { passive: false });
  document.addEventListener("touchend", soltarSwipe, { passive: true });
  document.addEventListener("touchcancel", soltarSwipe, { passive: true });
  // Al levantar el dedo después de deslizar, el navegador suelta un clic sobre la fila. Se traga
  // en la fase de captura para que no llegue al manejador que abre la ficha.

  // ================================================================
  // DELEGACIÓN DE EVENTOS
  // ================================================================

  document.addEventListener("click", (e) => {
    if (!swipeTapado) return;
    if (Date.now() - swipeTapado > SWIPE_TAPA_CLIC) { swipeTapado = 0; return; }
    if (e.target && e.target.closest && e.target.closest(".swipe")) {
      swipeTapado = 0;
      e.stopPropagation();
      e.preventDefault();
    }
  }, true);

  function renderInbox() {
    const items = [...(state.inbox || [])].sort((a, b) => b.createdAt - a.createdAt);
    return `<div class="card">
      <div class="card-head"><p style="margin:0;color:var(--muted)"><span class="kbd">C</span> captura rápida. Todo se queda en el móvil.</p>
        <button class="btn btn-sm btn-primary" data-action="open-capture">Capturar</button></div>
      ${items.map((it) => `<div class="inbox-item">
        <div style="flex:1"><div>${esc(it.text)}</div><div style="font-size:12px;color:var(--muted);margin-top:4px">${new Date(it.createdAt).toLocaleString("es-ES")}</div></div>
        <button class="btn btn-sm" data-action="inbox-note" data-id="${it.id}">A apuntes</button>
        <button class="btn btn-sm" data-action="inbox-del" data-id="${it.id}">×</button>
      </div>`).join("") || `<div class="empty">Bandeja vacía.</div>`}
    </div>`;
  }

  function renderReview() {
    const wr = weekRange();
    const weekS = state.sessions.filter((s) => s.date >= wr.from && s.date <= wr.to);
    const mins = weekS.reduce((a, b) => a + b.minutes, 0);
    const goal = (state.settings.dailyGoal || 90) * 5;
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
        <div class="review-item"><div class="n">${gpa == null ? "—" : gpa.toFixed(1)}</div><div class="l">nota media</div></div>
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
        ${best ? `<p class="hint best-day">Mejor día: <strong>${fmtDate(best[0])}</strong> (${fmtHours(best[1])}).</p>` : ""}
      </div>
      <div class="grid grid-2 stack-phone" style="margin-top:16px">
        <div class="card">
          <h3>Días sin clase</h3>
          ${diasSinClase(3).map((x) => `<div class="row"><span class="dot ${x.info.kind === "vacaciones" ? "is-vac" : "is-hol"}"></span>
            <div style="flex:1">${esc(x.info.label)}</div><div class="meta">${fmtDate(x.iso)}</div></div>`).join("") || `<div class="empty">Sin festivos a la vista.</div>`}
        </div>
        <div class="card">
          <h3>Módulos que llevas más flojos</h3>
          ${[...state.subjects].sort((a, b) => studiedFor(a.id) - studiedFor(b.id)).slice(0, 3)
            .map((s) => `<div class="row"><span class="dot" style="background:${safeColor(s.color)}"></span>
              <div style="flex:1">${esc(s.name)}</div><div class="meta">${fmtHours(studiedFor(s.id))}</div></div>`).join("") || `<div class="empty">Añade módulos y estudia.</div>`}
        </div>
      </div>
    `;
  }

  // (se usa en la vista de Ajustes para no repetir el HTML de cada casilla)
  /* Interruptor, no casilla de escritorio: en el móvil se toca con el pulgar y el estado se ve
     de un vistazo. El texto va primero y el mando a la derecha, como en los ajustes del sistema. */
  function chk(id, on, label) {
    return `<label class="switch"><span class="switch-t">${label}</span><input id="${id}" type="checkbox" role="switch" ${on ? "checked" : ""}/></label>`;
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
  /* Lo que se puede pintar en el avatar: las criaturas son de una lista fija de la app
     (assets/…) y tus fotos son data URLs. Antes TODO pasaba por safeImgSrc (que solo acepta
     data: y blob:), así que al elegir una criatura la cabecera se quedaba con la letra. */
  function avatarSrcPintable(ic) {
    ic = ic || state.settings.avatarIcon || "letter";
    if (ic === "dragon") return "assets/icon-192.png";
    if (String(ic).startsWith("c:")) return safeImgSrc(avatarSrc(ic));
    const pack = AVATAR_PACK.find((x) => x.id === ic);
    return pack ? pack.src : "";
  }
  function avatarInner() {
    const ic = state.settings.avatarIcon || "letter";
    const safe = avatarSrcPintable(ic);
    if (safe) return `<img src="${esc(safe)}" alt="" loading="lazy" decoding="async">`;
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
        <button type="button" data-action="${setA}" data-id="dragon" class="ava-ph ${ic === "dragon" ? "is-on" : ""}" aria-label="Icono dragón" title="Dragón"><img src="assets/icon-192.png" alt="" loading="lazy" decoding="async"></button>
        ${AVATAR_PACK.map((a) =>
          `<button type="button" data-action="${setA}" data-id="${a.id}" class="ava-ph ${ic === a.id ? "is-on" : ""}" aria-label="${esc(a.name || a.id)}" title="${esc(a.name || a.id)}"><img src="${a.src}" alt="" loading="lazy" decoding="async"></button>`
        ).join("")}
        ${customs.map((c) =>
          `<button type="button" data-action="${setA}" data-id="c:${c.id}" class="ava-ph ${ic === "c:" + c.id ? "is-on" : ""}" aria-label="Tu foto" title="Tu foto"><img src="${safeImgSrc(c.data) || PUNTO_TRANSPARENTE}" alt="" loading="lazy" decoding="async"><span class="ava-x" data-action="del-avatar" data-id="${c.id}" role="presentation">×</span></button>`
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
    if (!el) return;
    // Si el icono anterior era un blob: (de aplicar un avatar propio), libéralo: cada cambio de
    // icono crea object URLs nuevos y, si no se revocan, la memoria se acumula en sesiones largas.
    const prev = el.href;
    el.href = href;
    if (prev && prev.startsWith("blob:")) { try { URL.revokeObjectURL(prev); } catch {} }
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

  // ================================================================
  // VISTA: AJUSTES
  // ================================================================

  function renderSettings() {
    const st = state.settings;
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
            ${["dashboard", "schedule", "notes", "cards", "timer", "review", "achievements"].map((v) =>
              `<option value="${v}" ${st.startView === v ? "selected" : ""}>${esc((titles[v] || [v])[0])}</option>`).join("")}
          </select></div>
        <div class="field"><label>Tema</label>
          <div class="seg" role="group" aria-label="Tema de la app">
            <button type="button" class="${st.uiTheme === "light" && !st.autoTheme ? "is-on" : ""}" data-action="toggle-theme" data-id="light">Claro</button>
            <button type="button" class="${st.uiTheme !== "light" && !st.autoTheme ? "is-on" : ""}" data-action="toggle-theme" data-id="dark">Oscuro</button>
            <button type="button" class="${st.autoTheme ? "is-on" : ""}" data-action="toggle-theme" data-id="auto">Auto</button>
          </div>
          <p class="hint">Auto: claro de día, oscuro a partir de las 21:00. La luna de la cabecera hace lo mismo de un toque.</p>
        </div>
        ${chk("set-compact", st.compact, "Modo compacto")}
        ${chk("set-motion", st.reduceMotion, "Reducir animaciones")}
        ${chk("set-showxp", st.showXp !== false, "Mostrar XP")}
        ${chk("set-showmedals", st.showMedals !== false, "Mostrar medallas")}
        ${chk("set-showweek", st.showWeekStrip !== false, "Tira de la semana en Inicio")}
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
        <div class="field"><label for="set-grademax">Nota máxima (la de tus módulos)</label><input id="set-grademax" type="number" min="5" max="100" value="${st.gradeMax || 10}"></div>
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
      </div>

      <p class="tools-kicker">Horario del centro · 2.º SMR 2026-27</p>
      <div class="card">
        <p class="hint" style="margin-top:0">Curso del <b>14 de septiembre de 2026</b> al <b>18 de junio de 2027</b>. Festivos locales a efectos escolares: <b>9 de septiembre</b>, <b>7 de diciembre</b> y <b>8 de febrero</b>.</p>
        <div class="hero-actions">
          <button class="btn ${(st.timetableKind || "curso") === "curso" ? "btn-primary" : ""}" type="button" data-action="restore-timetable" data-kind="curso">Curso · 15:10–22:15</button>
          <button class="btn ${st.timetableKind === "temporal" ? "btn-primary" : ""}" type="button" data-action="restore-timetable" data-kind="temporal">Septiembre y junio · 16:00–21:45</button>
        </div>
        <p class="hint" style="margin:6px 0 0">Las horas cambian <b>solas</b> en septiembre y junio (entrada a las 16:00); el resto del curso, a las 15:10. El Horario avisa de qué plantilla está puesta y solo enseña clase los días lectivos.</p>
        <label class="switch"><span class="switch-t">Cambiar el horario solo en septiembre y junio</span><input type="checkbox" role="switch" data-action="toggle-auto-plantilla" ${st.timetableAuto !== false ? "checked" : ""}/></label>
        <p class="hint">Cargar una plantilla a mano <b>sustituye</b> tus clases actuales (pide confirmación antes) y desactiva el cambio automático. Las aulas (AULA 1NF3, AULA 2, AULA 3) vienen con cada clase.</p>
      </div>

      <p class="tools-kicker">Avisos</p>
      <div class="card">
        <p class="hint" style="margin-top:0">${avisosNativos()
          ? "En el APK los avisos los programa Android: suenan <b>aunque la app esté cerrada</b> y el móvil bloqueado."
          : "Son avisos del navegador: suenan con la app abierta o recién usada. En el APK se programan en Android y suenan con la app cerrada."}</p>
        <button class="btn btn-block ${avisosProgramados() || (st.notify && typeof Notification !== "undefined" && Notification.permission === "granted") ? "btn-primary" : ""}" type="button" data-action="enable-notify">
          ${avisosProgramados() ? "Avisos del móvil activos"
            : avisosNativos() ? "Programar avisos en el móvil"
            : (st.notify && typeof Notification !== "undefined" && Notification.permission === "granted" ? "Avisos activos" : "Activar avisos")}
        </button>
        ${avisosProgramados() && window.AulaAvisos ? `<p class="hint">${esc(window.AulaAvisos.resumen(window.AulaAvisos.datos()))}</p>` : ""}
        ${avisosNativos() && permisoAvisos === "denegado" ? `<p class="hint warn-text">Android tiene los avisos bloqueados para esta app. Actívalos en Ajustes del móvil → Aplicaciones → Aula SMR → Notificaciones.</p>` : ""}
        ${avisosNativos() && exactasAvisos === false ? `<p class="hint warn-text">Este móvil tiene bloqueadas las <b>alarmas a la hora exacta</b> (Android 12+, «Alarmas y recordatorios»). Sin ellas, el teléfono puede retrasar los avisos o no dispararlos cuando está bloqueado.</p>
          <button class="btn btn-sm" type="button" data-action="enable-exact-alarms">Activar alarmas exactas</button>` : ""}
        ${avisosNativos() && bateriaAvisos === "vigilada" ? `<p class="hint warn-text">La <b>optimización de batería</b> de este móvil puede cortar los avisos cuando la app no está en pantalla. Lo mejor es eximirla.</p>
          <button class="btn btn-sm" type="button" data-action="enable-bateria">Eximir de la optimización de batería</button>` : ""}
        ${avisosNativos() && exactasAvisos === true && bateriaAvisos !== "vigilada" ? `<p class="hint">Los avisos están listos en este móvil${bateriaAvisos === "exenta" ? " (alarmas exactas y exentos de la batería)" : " (con alarmas a la hora exacta)"}. Si alguno no sonara, revisa el volumen y el no molestar del teléfono.</p>` : ""}
        ${avisosNativos() ? `<div class="form-row" style="margin-top:10px">
          <button class="btn btn-sm" type="button" data-action="test-notify">Probar aviso</button>
        </div>` : ""}
        ${chk("set-nclass", st.notifyClass !== false, "Clase (10 min antes)")}
        ${chk("set-nca", st.notifyCards !== false, "Fichas de repaso")}
        ${chk("set-nexamev", st.notifyExamEve !== false, "Examen o entrega: la tarde anterior (18:00)")}
        ${chk("set-nexamh", st.notifyExamHour !== false, "Examen o entrega: una hora antes del cierre")}
        ${chk("set-nopen", st.notifyDeliveryOpen !== false, "Entrega: el día que se abre")}
        ${chk("set-nclose", st.notifyDeliveryClose !== false, "Entrega: el último día para entregar (a la hora del resumen)")}
        ${chk("set-night", st.nightRemind !== false, "Aviso nocturno para no romper la racha")}
        ${chk("set-morn", st.morningSummary !== false, "Resumen por la mañana")}
        <div class="form-row" style="margin-top:10px">
          <div class="field"><label for="set-remindh">Hora del resumen</label><input id="set-remindh" type="number" min="5" max="12" value="${st.remindHour || 8}"></div>
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
          <div class="app-ico-tile"><img src="${esc(avatarSrc(st.appIcon || "dragon") || "assets/icon-192.png")}" alt="Icono actual" loading="lazy" decoding="async"></div>
          <div>
            <b>Pantalla de inicio</b>
            <small>Es el dibujo del escritorio, no el de la esquina. En el APK cambia al tocarlo.</small>
          </div>
        </div>
        <div class="field"><label>Elige icono</label>${avatarPicksHTML("app")}</div>
        <button class="btn btn-primary btn-block" type="button" data-action="apply-desktop-icon">Aplicar en el escritorio</button>
        <button class="btn btn-block mt-8" type="button" data-action="app-icon-from-profile">Usar el del perfil</button>
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

      <p class="tools-kicker">Datos (este dispositivo)</p>
      <p class="hint">${(() => { const d = diasDesdeCopia(); return nuncaCopiada() ? "Todavía no has guardado ninguna copia." : d === 0 ? "Última copia: hoy mismo." : d === 1 ? "Última copia: ayer." : "Última copia: hace " + d + " días."; })()}</p>
      <div class="card" style="display:flex;flex-direction:column;gap:8px">
        ${avisoEspacio}
        <p class="hint" style="margin:0">Apuntes, módulos y estudio: <b>${kb} KB</b> ${mediaOk() ? `· fotos en el almacén de archivos: <b>${fotosKb} KB</b> (${mediaInfo.n})` : "· las fotos se guardan dentro del estado (este navegador no tiene almacén de archivos)"}.</p>
        <button class="btn btn-primary" data-action="export">Exportar copia JSON (con fotos)</button>
        <button class="btn" data-action="import">Importar JSON</button>
        <button class="btn" data-action="export-ics">Calendario .ics (horario y festivos)</button>
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
        <button class="btn btn-block mt-10" data-action="undo">Deshacer el último borrado</button>
      </div>

      <div class="set-actions">
        <button class="btn btn-primary btn-block" data-action="save-settings">Guardar ajustes</button>
        <button class="btn btn-block" data-action="redo-onboard">Volver a configurar desde el principio</button>
      </div>
      <p class="footer-note">Aula SMR · datos solo en este dispositivo · ${APP_VERSION}</p>
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
    const color = s.color || "#5b9bff";
    return `
      <div class="field"><label>Nombre</label><input name="name" required value="${esc(s.name || "")}" /></div>
      <div class="form-row">
        <div class="field"><label>Profesor/a</label><input name="teacher" value="${esc(s.teacher || "")}" /></div>
        <div class="field"><label>Aula</label><input name="room" value="${esc(s.room || "")}" /></div>
      </div>
      <div class="field"><label>Color</label>
        <input type="hidden" name="color" id="color-val" value="${esc(color)}" />
        <div class="color-picks">${["#5b9bff","#34d07f","#ffb020","#b08cff","#ff5c5c","#34d3c8","#ff7a9c","#9aa0aa"].map((c) =>
          `<button type="button" data-action="pick-color" data-color="${c}" style="background:${c}" class="${c === color ? "is-on" : ""}"></button>`).join("")}</div>
      </div>
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

  // El final del bloque tiene que sonar aunque el móvil esté en el bolsillo: dentro del APK se
  // programa el aviso (y el de «enfocado hasta las…»), y se quita al pausar, parar o cambiar.
  let bloqueNativoTimer = null;
  function avisarBloqueNativo() {
    if (!avisosProgramados() || !window.AulaAvisos) return;
    clearTimeout(bloqueNativoTimer);
    bloqueNativoTimer = setTimeout(() => {
      bloqueNativoTimer = null;
      if (!timer.running || !timer.endsAt) return;
      const sub = state.subjects.find((x) => x.id === timer.subjectId);
      window.AulaAvisos.programarBloque({
        fin: new Date(timer.endsAt),
        minutos: Math.max(1, Math.round(timer.total / 60)),
        etiqueta: timer.mode === "work" ? (sub ? sub.name : "") : "descanso",
      }).catch(() => {});
    }, 800);
  }
  function quitarAvisoBloque() {
    clearTimeout(bloqueNativoTimer);
    bloqueNativoTimer = null;
    if (avisosProgramados() && window.AulaAvisos) window.AulaAvisos.cancelarBloque().catch(() => {});
  }

  function modeMinutes(mode) {
    if (mode === "break") return state.settings.pomodoroBreak;
    if (mode === "long") return state.settings.pomodoroLong;
    return state.settings.pomodoroWork;
  }
  function setMode(mode, reset = true) {
    timer.mode = mode;
    if (reset) {
      quitarAvisoBloque();
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
  // Devuelve true si había un bloque guardado (para no pisarlo con uno nuevo).
  function timerRestore() {
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem(TIMER_KEY) || "null"); } catch {}
    if (!saved || typeof saved !== "object") return false;
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
        completeTimer(true);
        return true;
      }
      startTimerLoop();
      const sub = state.subjects.find((s) => s.id === timer.subjectId);
      toast("Bloque en curso: " + fmtRemain(Math.round(left / 60)) + (sub ? " · " + sub.name : ""));
      // El aviso del final se vuelve a programar por si el móvil se reinició (los de Android
      // se pierden al apagar) o por si la app se cerró a mitad.
      avisarBloqueNativo();
    } else {
      timer.remaining = clamp(Number(saved.remaining) || modeMinutes(timer.mode) * 60, 0, 24 * 3600);
      if (timer.remaining < timer.total) updateTimerChrome();
    }
    updateTimerUI();
    return true;
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
    avisarBloqueNativo();
  }
  function completeTimer(desdeFuera) {
    quitarAvisoBloque();
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
      quitarAvisoBloque();
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
  // ---------------------------------------------------------------- archivos
  // En el navegador un archivo se descarga con <a download>. Dentro del APK no: el WebView de
  // Android no tiene gestor de descargas, así que ese botón no hacía NADA (ni la copia de
  // seguridad). Ahí se escribe el archivo y se abre la hoja de compartir del móvil, para
  // guardarlo en Archivos, Drive, mandarlo por WhatsApp…
  function nativoFicheros() {
    const C = window.Capacitor;
    return !!(C && typeof C.isNativePlatform === "function" && C.isNativePlatform()
      && C.Plugins && C.Plugins.Filesystem && C.Plugins.Share);
  }
  function descargarBlob(nombre, texto, mime) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([texto], { type: mime }));
    a.download = nombre;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    return { nativo: false, ok: true };
  }
  async function guardarArchivo(nombre, texto, mime) {
    if (!nativoFicheros()) return descargarBlob(nombre, texto, mime);
    const C = window.Capacitor;
    try {
      await C.Plugins.Filesystem.writeFile({ path: nombre, data: texto, directory: "CACHE", encoding: "utf8", recursive: true });
      const { uri } = await C.Plugins.Filesystem.getUri({ path: nombre, directory: "CACHE" });
      await C.Plugins.Share.share({ title: nombre, url: uri, dialogTitle: "Guardar o compartir " + nombre });
      return { nativo: true, ok: true, uri };
    } catch {
      toast("No se pudo guardar " + nombre);
      return { nativo: true, ok: false };
    }
  }

  function icsEscape(s) {
    return String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
  }
  function utf8Len(ch) {
    const c = ch.codePointAt(0);
    return c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
  }
  function icsFold(line) {
    // RFC 5545: las líneas de más de 75 octetos se pliegan con CRLF + un espacio.
    // Se cuentan octetos (no letras) porque «Módulo» ocupa más que «Modulo».
    const out = [];
    let actual = "", bytes = 0;
    for (const ch of String(line)) {
      const n = utf8Len(ch);
      if (bytes + n > 75) { out.push(actual); actual = " "; bytes = 1; }
      actual += ch; bytes += n;
    }
    out.push(actual);
    return out.join("\r\n");
  }
  function icsStamp(d) {
    return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
  }
  // El .ics se construye aparte (función que solo devuelve texto) para poder probarlo
  // ---------------------------------------------------------------- compartir
  // Un apunte, tal cual, a quien quieras: por la hoja de compartir del móvil (con sus fotos
  // adjuntas) o por la del navegador. Si el navegador no sabe compartir, al portapapeles.
  function textoDeNota(n) {
    const sub = n && subjectById(n.subjectId);
    const cabecera = [n && n.title ? n.title : "Apunte", sub ? sub.name : ""].filter(Boolean);
    const cuerpo = ((n && n.content) || "").trim();
    return { titulo: (n && n.title) || "Apunte", texto: cabecera.join(" · ") + (cuerpo ? "\n\n" + cuerpo : "") };
  }
  /** Comparte un texto (y hasta 6 fotos en base64) por donde se pueda. */
  async function compartirTexto(datos) {
    const o = datos || {};
    const titulo = o.titulo || "Aula SMR";
    const texto = o.texto || "";
    const fotos = (o.fotos || []).slice(0, 6);
    const C = window.Capacitor;
    const nativo = !!(C && typeof C.isNativePlatform === "function" && C.isNativePlatform() && C.Plugins && C.Plugins.Share);
    if (nativo) {
      const files = [];
      if (C.Plugins.Filesystem) {
        for (const f of fotos) {
          try {
            const m = /^data:([^;,]+)?;base64,([\s\S]*)$/.exec(String(f.base64 || ""));
            if (!m) continue;
            const ext = /png/i.test(m[1] || "") ? "png" : "jpg";
            const path = "compartir-" + (files.length + 1) + "." + ext;
            await C.Plugins.Filesystem.writeFile({ path, data: m[2], directory: "CACHE" });
            const { uri } = await C.Plugins.Filesystem.getUri({ path, directory: "CACHE" });
            files.push(uri);
          } catch { /* un archivo que no se puede leer no impide compartir el texto */ }
        }
      }
      try {
        const carga = { title: titulo, text: texto, dialogTitle: "Compartir" };
        if (files.length) carga.files = files;
        await C.Plugins.Share.share(carga);
        return { ok: true, nativo: true, archivos: files.length };
      } catch {
        return { ok: false, nativo: true };
      }
    }
    try {
      if (navigator.share) { await navigator.share({ title: titulo, text: texto }); return { ok: true, nativo: false, via: "share" }; }
      if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(texto); return { ok: true, nativo: false, via: "portapapeles" }; }
    } catch { /* el usuario puede haber cancelado: no es un fallo que haya que gritar */ }
    return { ok: false, nativo: false, via: "ninguna" };
  }

  async function compartirNota(datos) {
    const o = datos || {};
    const n = state.notes.find((x) => x.id === (o.id || noteId));
    if (!n) { toast("Abre un apunte para compartirlo"); return { ok: false }; }
    persistNoteNow();
    const { titulo, texto } = textoDeNota(n);
    // Las fotos del apunte se adjuntan si el WebView las conoce (en base64)
    const fotos = [];
    if (mediaOk() && (n.attachments || []).length) {
      for (const att of n.attachments.slice(0, 6)) {
        try {
          const data = att.data || (await Media().dataURL(att.id));
          if (data) fotos.push({ base64: data });
        } catch { /* sin esa foto, se comparte el resto */ }
      }
    }
    const r = await compartirTexto({ titulo, texto, fotos });
    if (r.ok) {
      toast(r.nativo
        ? "Apunte compartido" + (r.archivos ? " con " + r.archivos + (r.archivos === 1 ? " foto" : " fotos") : "")
        : (r.via === "portapapeles" ? "Apunte copiado al portapapeles" : "Apunte compartido"));
    } else if (r.via === "ninguna") {
      toast("Este navegador no sabe compartir; usa Exportar Markdown");
    } else if (r.nativo) {
      toast("No se pudo compartir el apunte");
    }
    return r;
  }

  /** El horario en texto, para pasárselo a un compañero: días, horas y aulas. */
  function horarioTexto() {
    const clases = state.events.filter((e) => !e.type || e.type === "clase");
    if (!clases.length) return "";
    const plantilla = state.settings.timetableKind === "temporal" ? " (septiembre y junio: de 16:00 a 21:45)" : "";
    const lineas = ["Horario · " + (state.settings.courseName || "2.º SMR") + plantilla, ""];
    DAYS.forEach((dia, i) => {
      const delDia = clases.filter((e) => Number(e.day) === i).sort((a, b) => String(a.start).localeCompare(String(b.start)));
      if (!delDia.length) return;
      lineas.push(dia + ":");
      delDia.forEach((e) => {
        const sub = subjectById(e.subjectId);
        const aula = e.room ? " (" + e.room + ")" : "";
        lineas.push("  " + e.start + "–" + e.end + "  " + (sub ? sub.name : "Clase") + aula);
      });
      lineas.push("");
    });
    lineas.push("IES La Canal · Aula SMR");
    return lineas.join("\n");
  }
  async function compartirHorario() {
    const texto = horarioTexto();
    if (!texto) { toast("Todavía no hay clases en el horario"); return { ok: false }; }
    const r = await compartirTexto({ titulo: "Horario · " + (state.settings.courseName || "2.º SMR"), texto });
    if (r.ok) toast(r.nativo || r.via === "share" ? "Horario compartido" : "Horario copiado al portapapeles");
    else if (r.via === "ninguna") toast("Este navegador no sabe compartir");
    return r;
  }

  // Apuntes a Markdown y fichas a CSV (Anki): texto puro, para exportarlo desde donde haga falta
  function markdownApuntes() {
    const notas = [...(state.notes || [])].sort((a, b) => String(a.subjectId).localeCompare(String(b.subjectId)) || String(a.title).localeCompare(String(b.title)));
    if (!notas.length) return "";
    const partes = notas.map((n) => {
      const sub = subjectById(n.subjectId);
      const cuerpo = (n.content || "").trim() || "(sin contenido)";
      const fotos = (n.attachments || []).length ? `\n\n_(${n.attachments.length} foto${n.attachments.length === 1 ? "" : "s"})_` : "";
      return `# ${n.title}\n\n**${sub ? sub.name : "Sin módulo"}**${n.updatedAt ? " · " + fmtDate(localISO(new Date(n.updatedAt))) : ""}\n\n${cuerpo}${fotos}`;
    });
    return `# Apuntes · Aula SMR\n\n_${notas.length} apuntes exportados el ${fmtDate(todayISO())}_\n\n---\n\n` + partes.join("\n\n---\n\n") + "\n";
  }
  function ankiCSV() {
    const fichas = [...(state.cards || [])].filter((c) => c.front);
    // Cabeceras que entiende Anki al importar (separador y HTML desactivado)
    const cabeceras = ["#separator:Comma", "#html:false", "#columns:front,back,modulo"].join("\n");
    const filas = fichas.map((c) => {
      const sub = subjectById(c.subjectId);
      const cita = (t) => `"${String(t == null ? "" : t).replace(/"/g, '""').replace(/\r?\n/g, "<br>")}"`;
      return [cita(c.front), cita(c.back), cita(sub ? sub.name : "")].join(",");
    });
    return [cabeceras, ...filas].join("\n") + "\n";
  }
  async function exportMarkdown() {
    const texto = markdownApuntes();
    if (!texto) { toast("No hay apuntes que exportar"); return; }
    const r = await guardarArchivo("aula-apuntes.md", texto, "text/markdown;charset=utf-8");
    const n = (state.notes || []).length;
    if (r.ok) toast(r.nativo ? `${n} apuntes listos: elige dónde guardarlos` : `${n} apuntes exportados`);
  }
  async function exportAnki() {
    const texto = ankiCSV();
    const n = (state.cards || []).filter((c) => c.front).length;
    if (!n) { toast("No hay fichas que exportar"); return; }
    const r = await guardarArchivo("aula-fichas.csv", texto, "text/csv;charset=utf-8");
    if (r.ok) toast(r.nativo ? `${n} fichas listas: elige dónde guardarlas` : `${n} fichas en CSV (Anki: básico)`);
  }

  function icsTexto() {
    const stamp = icsStamp(new Date());
    const lineas = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Aula SMR//Horario//ES",
      "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Aula SMR 2.º SMR 2026-27",
    ];
    const evDe = (iso, hora) => iso.replace(/-/g, "") + "T" + String(hora).replace(":", "") + "00";
    // Clases del centro: se repiten cada semana hasta el fin de curso
    const dow = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    state.events.filter((e) => !e.type || e.type === "clase").forEach((e) => {
      const sub = subjectById(e.subjectId);
      lineas.push(
        "BEGIN:VEVENT",
        "UID:aula-" + e.id + "@aula-smr",
        "DTSTAMP:" + stamp,
        "SUMMARY:" + icsEscape((sub ? sub.name : "Clase") + (e.room ? " · " + e.room : "")),
        "RRULE:FREQ=WEEKLY;BYDAY=" + dow[Number(e.day) % 7] + ";UNTIL=" + evDe(state.settings.endDate || COURSE.end, "235900") + "Z",
        "DTSTART;TZID=Europe/Madrid:" + evDe(COURSE.start, e.start),
        "DTEND;TZID=Europe/Madrid:" + evDe(COURSE.start, e.end),
        "END:VEVENT",
      );
    });
    // Festivos y vacaciones (día completo, como en el calendario del centro)
    const dias = [];
    VACATIONS.forEach((v) => {
      const d = new Date(v.from + "T12:00:00");
      const fin = new Date(v.to + "T12:00:00");
      while (d <= fin && dias.length < 120) { dias.push({ iso: localISO(d), name: v.name }); d.setDate(d.getDate() + 1); }
    });
    Object.keys(HOLIDAYS).forEach((iso) => { if (!vacacionEn(iso)) dias.push({ iso, name: HOLIDAYS[iso] }); });
    dias.sort((a, b) => a.iso.localeCompare(b.iso)).forEach((x, i) => {
      const sig = new Date(x.iso + "T12:00:00"); sig.setDate(sig.getDate() + 1);
      lineas.push(
        "BEGIN:VEVENT",
        "UID:aula-fest-" + x.iso + "-" + i + "@aula-smr",
        "DTSTAMP:" + stamp,
        "SUMMARY:" + icsEscape(x.name + " (sin clase)"),
        "DTSTART;VALUE=DATE:" + x.iso.replace(/-/g, ""),
        "DTEND;VALUE=DATE:" + localISO(sig).replace(/-/g, ""),
        "END:VEVENT",
      );
    });
    // Pruebas y exámenes que ha apuntado el alumno
    const pruebas = asArray(state.exams).filter((e) => asISO(e.date));
    pruebas.forEach((e) => {
      const sub = subjectById(e.subjectId);
      const hora = /^\d{1,2}:\d{2}$/.test(String(e.time || "")) ? e.time : "";
      const evento = [
        "BEGIN:VEVENT",
        "UID:aula-exam-" + e.id + "@aula-smr",
        "DTSTAMP:" + stamp,
        "SUMMARY:" + icsEscape((e.kind || "Examen") + ": " + e.title + (sub ? " · " + sub.name : "")),
      ];
      if (hora) {
        // Si el examen tiene hora de fin se respeta; si no, se le dan los 90 minutos de siempre
        const fin = e.endTime && minutesOf(e.endTime) > minutesOf(hora) ? e.endTime : null;
        const finM = minutesOf(fin || hora) + (fin ? 0 : 90);
        evento.push("DTSTART;TZID=Europe/Madrid:" + evDe(e.date, hora));
        evento.push("DTEND;TZID=Europe/Madrid:" + evDe(e.date, fin || pad(Math.floor(finM / 60) % 24) + ":" + pad(finM % 60)));
      } else {
        const sig = new Date(e.date + "T12:00:00"); sig.setDate(sig.getDate() + 1);
        evento.push("DTSTART;VALUE=DATE:" + e.date.replace(/-/g, ""));
        evento.push("DTEND;VALUE=DATE:" + localISO(sig).replace(/-/g, ""));
      }
      const plazo = e.openDate ? "Se abre el " + fmtDateLong(e.openDate) + (e.openTime ? " a las " + e.openTime : "")
        + " · Se entrega antes del " + fmtDateLong(e.date) + (e.time ? " a las " + e.time : "") : "";
      if (plazo || e.topics) evento.push("DESCRIPTION:" + icsEscape([plazo, e.topics ? "Entra: " + e.topics : ""].filter(Boolean).join(" — ")));
      if (e.room) evento.push("LOCATION:" + icsEscape(e.room));
      // Avisos dentro del propio calendario del móvil: la víspera y una hora antes
      ["-P1D", "-PT1H"].forEach((cuando) => {
        evento.push(
          "BEGIN:VALARM",
          "TRIGGER:" + cuando,
          "ACTION:DISPLAY",
          "DESCRIPTION:" + icsEscape((e.kind || "Examen") + ": " + e.title),
          "END:VALARM",
        );
      });
      evento.push("END:VEVENT");
      lineas.push(...evento);
    });
    lineas.push("END:VCALENDAR");
    // Cada línea se pliega si pasa de 75 octetos (los nombres largos de módulo lo hacían)
    return lineas.map(icsFold).join("\r\n") + "\r\n";
  }

  async function exportICS() {
    const texto = icsTexto();
    const nClases = state.events.filter((e) => !e.type || e.type === "clase").length;
    const nSinClase = (texto.match(/SUMMARY:.*\(sin clase\)/g) || []).length;
    const nPruebas = (texto.match(/BEGIN:VEVENT[\s\S]*?aula-exam-/g) || []).length;
    const r = await guardarArchivo("aula-smr-horario.ics", texto, "text/calendar;charset=utf-8");
    if (!r.ok) return;
    state.progress = state.progress || {}; state.progress.flags = state.progress.flags || {};
    state.progress.flags.exported = true;
    state.progress.flags.lastExportAt = Date.now();
    save();
    const resumen = nClases + " clases + " + nSinClase + " días sin clase" + (nPruebas ? " + " + nPruebas + " pruebas" : "");
    toast(r.nativo ? "Calendario listo (" + resumen + "): elige dónde guardarlo" : "Calendario exportado (" + resumen + ")");
  }

  // ---------------------------------------------------------------- copia de seguridad
  // Los datos viven solo en este móvil: si se pierde, se pierden. A partir de la v67 la app
  // lleva la cuenta de cuándo se guardó la última copia y lo recuerda cuando toca.
  const DIAS_AVISO_COPIA = 14;
  function flags() { return (state.progress && state.progress.flags) || {}; }
  function nuncaCopiada() { return !(Number(flags().lastExportAt) > 0); }
  // Días desde la última copia. Si todavía no hay ninguna, se cuenta desde que se instaló la
  // app: así quien acaba de instalarla no recibe la bronca el primer día, y quien lleva dos
  // semanas estudiando sin guardar nada sí se entera.
  function diasDesdeCopia() {
    const t = Number(flags().lastExportAt) || Number(flags().firstRunAt) || 0;
    if (!t) return null;
    return Math.floor((Date.now() - t) / 86400000);
  }
  function hayDatosQueSalvar() {
    const n = (state.notes || []).length;
    const s = (state.sessions || []).length;
    const c = (state.cards || []).length;
    return n >= 3 || s >= 5 || c >= 10;
  }
  function tocaAvisarCopia() {
    if (!hayDatosQueSalvar()) return false;
    const d = diasDesdeCopia();
    return d !== null && d >= DIAS_AVISO_COPIA;
  }
  function initCopia() {
    ensureProgress();
    state.progress.flags = state.progress.flags || {};
    const f = state.progress.flags;
    if (!f.firstRunAt) f.firstRunAt = Date.now();
    // Compatibilidad: quien ya había exportado antes de la v67 no tiene fecha apuntada; se
    // cuenta desde hoy para no meterle prisa por un aviso que la app nunca le dio.
    if (!f.lastExportAt && f.exported) f.lastExportAt = Date.now();
    save();
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
    const info = dayInfo(iso);
    const classes = info.kind === "lectivo" ? eventsOnDate(iso) : [];
    openModal("Día del calendario", `
      <p style="color:var(--muted)">${fmtDateLong(iso)}</p>
      ${info.kind !== "lectivo" ? `<p class="idle-note">${esc(info.label)} · sin clase</p>` : ""}
      <h3>Clases</h3>${classes.length
        ? classes.map((e) => `<div class="row"><span class="dot" style="background:${subjectColor(e.subjectId)}"></span>
            <div style="flex:1">${esc(subjectName(e.subjectId))}${e.room ? `<small class="hint">${esc(e.room)}</small>` : ""}</div>
            <div class="meta">${e.start}–${e.end}</div></div>`).join("")
        : `<p>${info.kind === "lectivo" ? "Ninguna." : "Día sin clase."}</p>`}
      <p class="hint" style="margin-top:10px">Para cambiar algo de ese día: Horario → «Cambios de un día suelto».</p>`,
      { confirm: "Ver esa semana", onSubmit() { closeModal(); exDate = iso; schWeek = semanaDe(iso); schView = "week"; go("schedule"); } });
  }

  function collectCmd(q) {
    q = (q || "").trim().toLowerCase();
    const hit = (s) => !q || String(s || "").toLowerCase().includes(q);
    const out = [];
    const acc = (title, run) => { if (hit(title)) out.push({ kind: "Ir", title, run }); };
    acc("Captura rápida", openCapture);
    acc("Nueva nota", addNote);
    acc("Nueva ficha", () => addCard());
    acc("Nueva clase en el horario", () => addEvent());
    acc("Registrar estudio a mano", logSession);
    acc("Temporizador", () => go("timer"));
    acc("Calendario y horario", () => go("schedule"));
    acc("Calificaciones", () => go("rendimiento"));
    acc("Agenda", () => go("exams"));
    acc("Apuntar un examen", () => addExam());
    acc("Apuntes", () => go("notes"));
    acc("Chat con Ollama", () => go("chatbot"));
    acc("Estadísticas", () => go("stats"));
    acc("Logros", () => go("achievements"));
    acc("Repaso rápido", () => go("quickreview"));
    acc("Concentración", () => go("examode"));
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
      state.subjects.forEach((s) => { if (hit(s.name)) out.push({ kind: "Módulo", title: s.name, run: () => { subjectFocus = s.id; go("subjects"); } }); });
      state.cards.forEach((c) => { if (hit(c.front)) out.push({ kind: "Ficha", title: c.front, run: () => { cardFilter = c.subjectId || "all"; cardQueue = [c]; go("cards"); } }); });
      state.glossary.forEach((g) => { if (hit(g.term)) out.push({ kind: "Glosario", title: g.term, run: () => go("glossary") }); });
      if (window.AulaStudio && typeof window.AulaStudio.toolCatalog === "function") {
        try { window.AulaStudio.toolCatalog().forEach((x) => { if (hit(x.title)) out.push({ kind: "Herramienta", title: x.title, run: x.run }); }); } catch {}
      }
    }
    const prio = { Ir: 0, Módulo: 1, Nota: 2, Ficha: 3, Glosario: 3, Herramienta: 2 };
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
    // Vistas retiradas (o un marcador viejo acabado en #timeline): a Inicio, nunca en blanco
    if (!(titles[v] || EXTRA_VIEWS[v])) v = "dashboard";
    persistNoteNow();
    const anterior = view;
    view = v;
    $("#overlay").hidden = true;
    closeCmd(); closeMore();
    const scroller = $("#view");
    if (scroller && anterior !== v) scroller.scrollTop = 0;
    // Con pushState, el gesto/botón "atrás" del móvil vuelve a la vista anterior
    try {
      const actual = (location.hash || "").replace("#", "");
      if (anterior && anterior !== v && actual !== v) history.pushState({ v }, "", "#" + v);
      else history.replaceState({ v }, "", "#" + v);
    } catch {}
    render();
    window.scrollTo(0, 0);
    // Anunciar cambio de vista para lectores de pantalla
    const ann = document.getElementById("a11y-announce");
    if (ann && anterior !== v) {
      const t = titles[v] || titles.dashboard;
      ann.textContent = "";  // force re-announce
      requestAnimationFrame(() => { ann.textContent = t ? t[0] : v; });
    }
  }
  function quickAdd() {
    const map = { dashboard: openCapture, schedule: () => addEvent(), notes: addNote, cards: () => addCard(), timer: logSession, inbox: openCapture, subjects: () => addSubject(), subject: addNote };
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
    const r = await guardarArchivo("aula-smr.json", json, "application/json");
    if (!r.ok) return;
    ensureProgress(); state.progress.flags = { ...(state.progress.flags || {}), exported: true, lastExportAt: Date.now() }; checkAchievements(); save();
    // Al guardar, la tarjeta de «haz copia» desaparece en el sitio (si no, parece que no ha pasado nada)
    if (view === "dashboard") render();
    const mb = json.length / (1024 * 1024);
    const cola = mb > 20 ? ` de ${mb.toFixed(1)} MB (incluye ${fotos} fotos)` : (fotos ? ` con ${fotos} fotos` : "");
    toast(r.nativo ? "Copia lista" + cola + ": elige dónde guardarla" : "Copia descargada" + cola);
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
        const resumen = `Trae ${(parsed.subjects || []).length} módulos y ${(parsed.notes || []).length} notas.`;
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
    if ($("#set-grademax")) st.gradeMax = num("#set-grademax", 10);
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
    const ncl = on("#set-nclass"); if (ncl !== undefined) st.notifyClass = ncl;
    const nc = on("#set-nca"); if (nc !== undefined) st.notifyCards = nc;
    const ne1 = on("#set-nexamev"); if (ne1 !== undefined) st.notifyExamEve = ne1;
    const ne2 = on("#set-nexamh"); if (ne2 !== undefined) st.notifyExamHour = ne2;
    const ne3 = on("#set-nopen"); if (ne3 !== undefined) st.notifyDeliveryOpen = ne3;
    const ne4 = on("#set-nclose"); if (ne4 !== undefined) st.notifyDeliveryClose = ne4;
    if ($("#set-starth")) st.startHour = num("#set-starth", 8);
    if ($("#set-endh")) st.endHour = num("#set-endh", 21);
    const cd = on("#set-confirm"); if (cd !== undefined) st.confirmDelete = cd;
    // El tema ya no es una casilla + botón: es un segmentado con data-action (ver «set-theme»).
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
    if (nav && nav.dataset.view && (nav.closest("#bottom-nav") || nav.closest("#more-sheet"))) {
      closeMore(); vibrar("ligero"); go(nav.dataset.view); return;
    }
    const btn = e.target.closest("[data-action]");
    if (!btn) {
      if (cmdOpen && !e.target.closest(".cmdk-box")) closeCmd();
      return;
    }
    const action = btn.dataset.action, id = btn.dataset.id;
    if (action === "close-modal") closeModal();
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
      const dia = Number(btn.dataset.day) || 0;
      const hora = /^\d{1,2}:\d{2}$/.test(String(btn.dataset.start || "")) ? btn.dataset.start : "15:00";
      const hoy = dia === weekdayMon0(new Date());
      openModal("Hueco libre · " + mins + " min", `
        <div class="field"><label>Módulo</label><select id="sb-subject">${subjectOptions("")}</select></div>
        <div class="field"><label>Minutos</label><input id="sb-min" type="number" min="10" max="180" value="${mins}"></div>
        <p class="hint">${hoy ? "Puedes ponerte el temporizador ahora o dejar el bloque apuntado en el horario." : "Se apunta en el horario de ese día como bloque de estudio."}</p>`,
        {
          confirm: hoy ? "Empezar a estudiar" : "Apuntar bloque",
          onSubmit(data) {
            const m = clamp(Number(data["sb-min"] || $("#sb-min")?.value) || mins, 10, 180);
            const sid = data["sb-subject"] || $("#sb-subject")?.value || "";
            if (hoy) {
              timer.subjectId = sid;
              timer.mode = "work"; timer.total = m * 60; timer.remaining = m * 60; timer.running = false; timer.endsAt = 0;
              closeModal(); go("timer"); toggleTimer();
              toast("Bloque de " + m + " min");
            } else {
              const fin = minutesOf(hora) + m;
              state.events.push({ id: uid(), subjectId: sid, day: dia, start: hora, end: pad(Math.floor(fin / 60) % 24) + ":" + pad(fin % 60), room: "Estudio", type: "estudio" });
              closeModal(); save(); render(); toast("Bloque de estudio apuntado en el horario");
            }
          },
        });
    }
    if (action === "restore-backup") restoreBackup();
    if (action === "dismiss-load-problem") { loadProblem = ""; render(); }
    if (action === "note-unlock") {
      const v = ($("#note-pin-input") || {}).value || "";
      if (checkPin(v)) { unlockedNotes.add(noteId); toast("Nota desbloqueada"); }
      else toast("PIN incorrecto");
      render();
    }
    if (action === "reload") { location.reload(); }
    if (action === "quick-add") quickAdd();
    if (action === "open-cmd") openCmd();
    if (action === "cmd-run") { const it = cmdItems[Number(btn.dataset.i)]; closeCmd(); it?.run(); }
    if (action === "go") go(btn.dataset.to);
    if (action === "toggle-theme") {
      const id = btn.dataset.id;
      if (id === "auto") state.settings.autoTheme = true;          // de día claro, de noche oscuro
      else if (id === "light" || id === "dark") { state.settings.autoTheme = false; state.settings.uiTheme = id; }
      else state.settings.uiTheme = (state.settings.uiTheme === "light") ? "dark" : "light";   // la luna de la cabecera
      applyTheme(); save();
      if (id) { render(); toast(id === "auto" ? "Tema automático" : id === "light" ? "Tema claro" : "Tema oscuro"); }
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
    if (action === "open-mod") { subjectFocus = id; go("subject"); }
    if (action === "edit-grade") addGrade(subjectById(id));
    if (action === "cal-prev") { calendarCursor.setMonth(calendarCursor.getMonth() - 1); render(); }
    if (action === "cal-next") { calendarCursor.setMonth(calendarCursor.getMonth() + 1); render(); }
    if (action === "sch-week") { const d = Number(btn.dataset.delta) || 0; schWeek = d === 0 ? 0 : clamp(schWeek + d, -52, 52); render(); }
    if (action === "cal-today") {
      const d = new Date(todayISO() + "T12:00:00");
      calendarCursor = new Date(d.getFullYear(), d.getMonth(), 1);
      render();
      toast("Hoy es " + fmtDateLong(todayISO()));
    }
    if (action === "cal-day") {
      const dia = btn.dataset.date;
      exDate = dia;
      schWeek = semanaDe(dia);
      schView = "week";
      render();
      toast("Semana del " + fmtDate(dia) + " · cambios de ese día abajo");
    }
    if (action === "add-exam") addExam();
    if (action === "edit-exam") addExam(state.exams.find((x) => x.id === id));
    if (action === "exam-filter") { examFilter = btn.dataset.f || "proximos"; render(); }
    if (action === "exam-tipo") { examTipo = btn.dataset.f || ""; render(); }
    if (action === "exam-estado") {
      const ex = asArray(state.exams).find((x) => x.id === id);
      if (ex) {
        const est = estadoDe(ex);
        openModal("Estado de la entrega", `
          <p class="hint" style="margin-top:0">«${esc(etiquetaDe(ex))}» · ${esc(subjectName(ex.subjectId))}</p>
          <div class="estado-lista">
            ${Object.entries(ESTADOS).map(([k, t]) => `<button type="button" class="estado-opcion is-${k}${est === k ? " is-on" : ""}" data-action="exam-set-estado" data-id="${ex.id}" data-e="${k}">
              <span class="estado-punto"></span><b>${t}</b>${est === k ? `<span class="estado-ahora">Ahora</span>` : ""}</button>`).join("")}
          </div>`, { confirm: "Cerrar", onSubmit() { closeModal(); } });
      }
    }
    if (action === "exam-set-estado") {
      const ex = asArray(state.exams).find((x) => x.id === id);
      const nuevo = ESTADOS[btn.dataset.e] ? btn.dataset.e : "";
      if (ex && nuevo) {
        ex.estado = nuevo;
        // Al marcar «Corregido» se pregunta la nota: es el momento en el que la sabes
        if (nuevo === "entregado") vibrar("medio");   // v67.7: se nota en la mano que ha quedado apuntado
        save(); closeModal(); render();
        toast(ESTADOS[nuevo] + ": " + etiquetaDe(ex));
        if (nuevo === "corregido" && (ex.grade === "" || ex.grade == null)) {
          setTimeout(() => addExam(ex), 260);
        }
      }
    }
    if (action === "eval-nuevo" || action === "eval-editar") abrirEsquema(subjectById(id));
    if (action === "eval-notas") abrirNotas(subjectById(id));
    if (action === "eval-simular") abrirSimulador(subjectById(id));
    if (action === "eval-modo-notas") {
      const sub = subjectById(subjectFocus);
      const c = sub && evalDe(sub) && evalDe(sub).componentes.find((x) => x.id === id);
      if (c) { c.modo = "manual"; save(); }
      closeModal();
      abrirNotas(sub);
    }
    if (action === "eval-add-comp" || action === "eval-del-comp" || action === "eval-add-ra"
      || action === "eval-del-ra" || action === "eval-modo" || action === "eval-plantilla") {
      tocarEsquema(subjectById(evalDraftSub), action, id, btn.dataset.modo);
    }
    if (action === "delete-exam") ask("Eliminar de la Agenda", "Se quita de la lista y de la cuenta atrás.", () => {
      pushUndo(); state.exams = state.exams.filter((x) => x.id !== id); closeModal(); render(); toast("Prueba eliminada");
    });
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
    if (action === "delete-note") ask("Eliminar nota", "Se borra del todo. Si te arrepientes, en Ajustes está «Deshacer el último borrado».", () => {
      pushUndo();
      const gone = state.notes.find((x) => x.id === noteId);
      if (gone) soltarFotos(gone);   // sus fotos salen del almacén
      state.notes = state.notes.filter((x) => x.id !== noteId);
      noteId = state.notes[0]?.id || null;
      render();
      toast("Nota eliminada");
    });
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
    if (action === "save-settings") saveSettings();
    if (action === "export") exportJSON();
    if (action === "import") importJSON();
    if (action === "load-demo") { state = seedDemo(); toast("Ejemplo SMR"); render(); }
    if (action === "wipe") {
      const kb = (storageBytes() / 1024).toFixed(0);
      openModal("Borrar todos los datos", `
        <p>Se borran de este dispositivo <b>todo</b>: módulos, horario, apuntes, fichas, sesiones, logros y las copias automáticas. Ocupan <b>${kb} KB</b>.</p>
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
            ["aula.snaps", "aula.lastBackup", "aula.sync.prev", KEY + ".bak", BAK_AT_KEY].forEach((k) => localStorage.removeItem(k));
          } catch {}
          closeModal(); toast("Copias borradas");
        },
      });
    }
    if (action === "clear-demo") { state = defaultState(); state.settings.demo = false; noteId = null; view = "subjects"; toast("Empieza por Módulos"); render(); }
    if (action === "keep-demo") { state.settings.demo = false; toast("Tus datos"); render(); }
    if (action === "enable-notify") {
      if (state.settings.notifyNative === true && avisosNativos()) apagarAvisosNativos();
      else { mirarPermisoAvisos(); requestNotify(); }
    }
    if (action === "test-notify") probarAviso();
    if (action === "enable-exact-alarms") {
      if (!avisosNativos() || typeof window.AulaAvisos.pedirAlarmasExactas !== "function") return;
      window.AulaAvisos.pedirAlarmasExactas().then((r) => {
        mirarExactasAvisos();
        if (r && r.ok && r.exact_alarm === "granted") {
          reprogramarAvisos();
          toast("Alarmas exactas activadas: los avisos sonarán a la hora exacta");
        } else if (r && r.ok) {
          toast("No se han activado: repítelo y deja el interruptor de «Alarmas y recordatorios» activado");
        }
      }).catch(() => toast("No se pudo abrir la pantalla de alarmas exactas"));
      return;
    }
    if (action === "enable-bateria") {
      if (!avisosNativos() || typeof window.AulaAvisos.pedirBateria !== "function") return;
      window.AulaAvisos.pedirBateria().then((r) => {
        mirarBateriaAvisos();
        if (r && r.ok === false && r.motivo === "no-disponible") toast("Este móvil no ofrece el diálogo de batería: búscalo en Ajustes → Batería");
      }).catch(() => toast("No se pudo pedir la exención de batería"));
      return;
    }
    if (action === "skip-onboard" || action === "on-finish") {
      collectOnboard();
      const ncl = on("#set-nclass"); if (ncl !== undefined) state.settings.notifyClass = ncl;
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
    if (action === "capture-note") {
      const t = captureText(); if (!t || !needSubjects()) return; closeCapture();
      const n = { id: uid(), subjectId: state.subjects[0].id, title: t.slice(0, 48), content: t, pinned: false, createdAt: Date.now(), updatedAt: Date.now() };
      state.notes.unshift(n); noteId = n.id; go("notes");
    }
    if (action === "inbox-del") { pushUndo(); state.inbox = state.inbox.filter((x) => x.id !== id); render(); }
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
    if (action === "restore-backup") restoreBackup();
    if (action === "dismiss-load-problem") { loadProblem = ""; render(); }
    if (action === "restore-timetable") {
      const kind = btn.dataset.kind === "temporal" ? "temporal" : "curso";
      const cuando = kind === "temporal"
        ? "el <b>horario temporal</b> de septiembre y junio (16:00 a 21:45)"
        : "el <b>horario del curso</b> (15:10 a 22:15)";
      openModal("Cargar el horario del centro", `<p>Se <b>sustituyen</b> tus clases actuales por ${cuando}, con los ${OFFICIAL_MODS.length} módulos y sus aulas.</p>
        <p class="hint">Con esto el cambio automático de septiembre y junio se queda en pausa; puedes volver a activarlo en Ajustes.</p>
        <p class="hint">Tus apuntes, fichas y sesiones de estudio no se tocan. Puedes deshacerlo justo después.</p>`,
        { confirm: "Cargar horario", onSubmit() {
            pushUndo();
            state.events = [];
            state.settings.timetableAuto = false;
            applyOfficialTimetable(state, kind);
            checkAchievements(); save(); closeModal(); render();
            toast(kind === "temporal" ? "Horario temporal cargado" : "Horario del curso cargado");
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
    if (action === "note-share") compartirNota({ id });
    if (action === "share-timetable") compartirHorario();
    if (action === "toggle-focus") {
      const on = !document.body.classList.contains("focus-mode");
      ponFoco(on);
      toast(on ? "Modo foco: sin barra ni distracciones" : "Modo foco desactivado");
      if (!on) render();
    }
    if (action === "jump-day") jumpDay(btn.dataset.date);
    if (action === "undo") undo();
    if (window.AulaStudio && typeof window.AulaStudio.click === "function") window.AulaStudio.click(action, btn, e);
    if (window.AulaTools && typeof window.AulaTools.click === "function") window.AulaTools.click(action, btn, e);
  });

  document.addEventListener("change", (e) => {
    if (e.target.dataset.action === "toggle-auto-plantilla") {
      state.settings.timetableAuto = !!e.target.checked;
      if (state.settings.timetableAuto) syncPlantilla(state);
      save(); render();
      toast(e.target.checked ? "La app cambia el horario sola en septiembre y junio" : "Cambio automático desactivado");
      return;
    }
    if (e.target.id === "ex-date") { exDate = e.target.value; render(); return; }
    // Agenda: el bloque «¿puntúa?» solo sale en los trabajos, y el componente depende del módulo
    if (e.target.id === "ex-kind") ajustarFormTipo(e.target.value.toLowerCase() === "trabajo");
    if (e.target.id === "ex-puntua") {
      const campo = $("#ex-comp-campo");
      if (campo) campo.hidden = !e.target.checked;
    }
    if (e.target.id === "ex-subject") {
      const campo = $("#ex-comp-campo");
      if (campo) campo.innerHTML = campoComponente(subjectById(e.target.value), "");
    }
    if (e.target.id === "timer-subject") timer.subjectId = e.target.value;
    if (e.target.dataset.action === "note-subject" && noteId) {
      const n = state.notes.find((x) => x.id === noteId);
      if (n) { n.subjectId = e.target.value; save(); }
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "cmdk-input") { cmdItems = collectCmd(e.target.value); cmdIndex = 0; renderCmd(); }
    if (e.target.id === "note-title" || e.target.id === "note-body") persistNote();
    if (e.target.id === "note-query") {
      // Con retardo: se filtra cuando dejas de teclear, no en cada letra (repintar Apuntes
      // entero por pulsación se nota en un móvil modesto). Y solo se repinta la lista: el
      // campo no se toca, así el cursor se queda donde estaba.
      noteQuery = e.target.value;
      clearTimeout(noteQueryTimer);
      noteQueryTimer = setTimeout(() => {
        const lista = $("#notes-list");
        if (!lista) { render(); return; }
        lista.innerHTML = notasListaHTML();
      }, 180);
    }
  });

  $("#overlay").addEventListener("click", () => { closeModal(); closeMore(); });
  $("#more-sheet")?.addEventListener("click", (e) => { if (e.target.id === "more-sheet") closeMore(); });
  $("#view")?.addEventListener("scroll", marcarScroll, { passive: true });
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
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") { e.preventDefault(); flushSave(); toast("Guardado"); return; }
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
    if (e.key.toLowerCase() === "f") { e.preventDefault(); ponFoco(!document.body.classList.contains("focus-mode")); }
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
    ["opt", ["optativo", "optativa", "programacion", "programación", "bucles", "funciones", "variables", "algoritmo"]],
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
    const when = parseWhen(lower);
    return {
      kind: "note",
      title: raw.charAt(0).toUpperCase() + raw.slice(1),
      date: when.date,
      guessed: when.guessed,
      subjectId: matchSubject(lower) || "",
    };
  }
  // Antes de guardar nada se ve lo que se ha entendido y se puede corregir.
  function processNLP(text) {
    const raw = (text || "").trim();
    if (!raw) { toast("Nada que interpretar"); return; }
    if (!needSubjects()) return;
    const d = nlpParse(raw);
    openModal("¿Es esto?", `
      <p class="hint" style="margin-top:0">Lo he entendido como un apunte. Corrige lo que haga falta y guárdalo.</p>
      <div class="field"><label>Título</label><input name="title" required value="${esc(d.title)}" /></div>
      <div class="field"><label>Módulo ${d.subjectId ? "" : "(elige)"}</label><select name="subjectId">${subjectOptions(d.subjectId)}</select></div>
      <p class="hint">${esc(fmtDateLong(d.date))}${d.guessed ? " (fecha estimada)" : ""}</p>
    `, {
      confirm: "Guardar apunte",
      onSubmit(data) {
        const n = { id: uid(), subjectId: data.subjectId, title: String(data.title || d.title).trim().slice(0, 60), content: raw,
          pinned: false, createdAt: Date.now(), updatedAt: Date.now() };
        state.notes.unshift(n); noteId = n.id;
        checkAchievements(); closeModal(); go("notes");
        toast("Apunte guardado");
      },
    });
  }
  let voiceRec = null, voiceOn = false;
  function voiceSupported() { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); }
  function updateVoiceUI() {
    const b = $("#capture-voice");
    if (b) { b.classList.toggle("on", voiceOn); b.textContent = voiceOn ? "🎙 Escuchando…" : "🎤 Dictar"; }
  }
  function toggleVoice() {
    const Speech = window.SpeechRecognition || window.webkitSpeechRecognition;
    const stop = () => {
      voiceOn = false;
      try { voiceRec && voiceRec.stop(); } catch {}
      updateVoiceUI();
    };
    if (voiceOn) { stop(); return; }
    voiceOn = true;
    updateVoiceUI();
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
    /* Sin tope: entran todos los módulos que haya (antes se cortaba en 12 y, más atrás, en 8, así
       que los últimos desaparecían del radar sin avisar). El polígono ya se calcula con el número
       real de módulos. */
    const mods = state.subjects.slice();
    const nota = (x) => notaModulo(x);
    const has = mods.some((x) => nota(x) != null);
    if (!has) {
      // Misma forma que el resto de estados vacíos (icono, título, texto y un botón).
      return `<div class="empty-hero">
        <div class="empty-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3v18M5 8l7-5 7 5M5 16l7 5 7-5M12 8v8"/></svg></div>
        <b>Aún no hay notas</b>
        <p>Cuando pongas la nota de un módulo, aquí verás el radar del ciclo.</p>
        ${mods.length ? `<button class="btn btn-primary" data-action="edit-grade" data-id="${mods[0].id}">Poner una nota</button>`
          : `<button class="btn btn-primary" data-action="go" data-to="subjects">Añadir un módulo</button>`}
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
    const maxNota = Number(state.settings.gradeMax) || 10;
    const data = mods.map((sub, i) => pt(i, R * (Number(nota(sub)) || 0) / maxNota));
    while (data.length < 3) data.push(pt(data.length, 0));
    const poly = data.map((x) => x.join(",")).join(" ");
    const apretado = mods.length > 8;
    const labels = mods.map((sub, i) => {
      const [x, y] = pt(i, R + (apretado ? 18 : 16));
      // Sin artículos/preposiciones/romanos: «Sistemas de gestión» antes daba «SISDE…» y la
      // palabra vacía se comía el recorte antes de llegar a las sílabas que sí identifican.
      const utiles = sub.name.split(/\s+/).filter((w) => w && !/^(de|del|la|el|los|las|un|una|unos|unas|y|o|u|e|en|a|al|para|por|con|sin|sobre|entre|hacia|vs|y?i{1,3}|iv|v[i]{0,3}|\d+\.?)$/i.test(w));
      const base = utiles.length ? utiles : sub.name.split(/\s+/);
      const short = (base.map((w) => w.slice(0, 3)).join("").slice(0, apretado ? 5 : 6) || sub.name.slice(0, 3)).toUpperCase();
      return `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="${apretado ? 8.5 : 9.5}" font-weight="700" fill="currentColor" opacity=".6">${esc(short)}</text>`;
    }).join("");
    // Cada punto lleva su nombre completo y su nota: en pantalla pequeña los rótulos del radar
    // no caben, así que al tocar (o pasar por encima) el punto sale el dato.
    const puntos = mods.map((sub, i) => {
      const [x, y] = data[i];
      const n = nota(sub);
      const col = n == null ? "#94a3b8" : n >= maxNota * 0.9 ? "#10b981" : n >= maxNota / 2 ? "#38bdf8" : "#ef4444";
      return `<circle cx="${x}" cy="${y}" r="7" fill="${col}" stroke="var(--paper, #fff)" stroke-width="1.5"><title>${esc(sub.name)}: ${n == null ? "sin nota" : n.toFixed(2)} / ${maxNota}</title></circle>`;
    }).join("");
    return `<svg viewBox="0 0 280 280" class="radar-box" role="img" aria-label="Perfil de notas por módulo">${rings}<polygon points="${poly}" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="2"/>${puntos}${labels}</svg>
      <p class="hint radar-hint">Toca un punto del radar y sale el módulo con su nota.</p>`;
  }
  function gradeForm(s) {
    const max = Number(state.settings.gradeMax) || 10;
    return `
      <div class="field"><label for="grade-in">Nota de ${esc(s.name)}</label>
        <input id="grade-in" name="grade" type="number" step="0.1" min="0" max="${max}" value="${s.grade === "" || s.grade == null ? "" : Number(s.grade)}" placeholder="Sin nota" /></div>
      <p class="hint">Déjalo vacío para quitar la nota. La media del ciclo sale de las notas de tus módulos.</p>`;
  }
  function addGrade(s) {
    if (!s) return;
    openModal("Nota del módulo", gradeForm(s), {
      confirm: "Guardar nota",
      onSubmit(data) {
        const v = String(data.grade ?? "").trim();
        s.grade = v === "" ? "" : clamp(Number(v.replace(",", ".")) || 0, 0, Number(state.settings.gradeMax) || 10);
        checkAchievements(); save(); closeModal(); render();
        toast(s.grade === "" ? "Nota quitada" : "Nota guardada: " + Number(s.grade).toFixed(1));
      },
    });
  }
  // ————————————————————— Esquema de evaluación: editor y notas (v67.5)
  /* El editor trabaja sobre una copia (`evalDraft`): así se puede añadir o quitar filas sin
     tocar el módulo hasta que se guarda. Los botones del modal releen antes los campos para no
     perder lo que hayas escrito. */
  let evalDraft = null, evalDraftSub = "";

  function esquemaVacio(sub) {
    const max = Number(state.settings.gradeMax) || 10;
    const ev = evalDe(sub);
    if (ev) {
      return {
        v: 1,
        componentes: ev.componentes.map((c) => ({ ...c })),
        reglas: {
          ra: { activo: !!(ev.reglas && ev.reglas.ra && ev.reglas.ra.activo), lista: ((ev.reglas && ev.reglas.ra && ev.reglas.ra.lista) || []).map((x) => ({ ...x })) },
          min: { activo: !!(ev.reglas && ev.reglas.min && ev.reglas.min.activo) },
          todos: { activo: !!(ev.reglas && ev.reglas.todos && ev.reglas.todos.activo) },
        },
      };
    }
    // Regla de su curso (v67.12): en todos los módulos hay que aprobar todos los temas,
    // así un esquema nuevo nace con la regla puesta (se puede apagar en el editor).
    return {
      v: 1,
      componentes: [{ id: uid(), nombre: "Nota del módulo", peso: 100, sobre: max, nota: "", min: 0, modo: "auto" }],
      reglas: { ra: { activo: false, lista: [] }, min: { activo: false }, todos: { activo: true } },
    };
  }

  // Lo que llevas con el reparto que se ve ahora mismo en el editor
  function borradorComoModulo(sub) {
    return { id: sub.id, name: sub.name, teacher: sub.teacher, grade: sub.grade, eval: evalDraft };
  }

  function evalFormHTML(sub) {
    const max = Number(state.settings.gradeMax) || 10;
    const ev = evalDraft;
    const filas = ev.componentes.map((c) => {
      const n = notaDeComponente(sub, c);
      const agenda = n.origen === "agenda" && n.trabajos.length;
      const aManoConAgenda = (c.modo || "auto") === "manual" && n.trabajos.length;
      const cola = agenda
        ? `<p class="hint eval-origen">Lo llena la Agenda: ${n.trabajos.length} ${n.trabajos.length === 1 ? "entrega" : "entregas"} · media <b>${n.nota.toFixed(2)}</b>
             <button type="button" class="link-btn" data-action="eval-modo" data-id="${c.id}" data-modo="manual">escribirla a mano</button></p>`
        : aManoConAgenda
          ? `<p class="hint eval-origen">A mano (en la Agenda hay ${n.trabajos.length} ${n.trabajos.length === 1 ? "entrega" : "entregas"} para este componente)
               <button type="button" class="link-btn" data-action="eval-modo" data-id="${c.id}" data-modo="auto">volver a usar la Agenda</button></p>`
          : "";
      return `
      <div class="eval-row">
        <div class="eval-row-top">
          <input name="c:${c.id}:nombre" value="${esc(c.nombre)}" placeholder="Examen de teoría" aria-label="Nombre del componente" />
          <button type="button" class="icon-btn eval-x" data-action="eval-del-comp" data-id="${c.id}" title="Quitar este componente" aria-label="Quitar ${esc(c.nombre)}">✕</button>
        </div>
        <div class="eval-nums">
          <label>Peso <input name="c:${c.id}:peso" type="number" inputmode="decimal" min="0" max="100" step="1" value="${Number(c.peso) || 0}" /> %</label>
          <label>Nota <input name="c:${c.id}:nota" type="number" inputmode="decimal" min="0" max="${c.sobre}" step="0.01" value="${c.nota === "" || c.nota == null ? "" : Number(c.nota)}" placeholder="—" /></label>
          <label>Sobre <input name="c:${c.id}:sobre" type="number" inputmode="decimal" min="1" max="100" step="1" value="${Number(c.sobre) || max}" /></label>
          ${ev.reglas.min.activo ? `<label>Mín. <input name="c:${c.id}:min" type="number" inputmode="decimal" min="0" max="${c.sobre}" step="0.01" value="${Number(c.min) > 0 ? Number(c.min) : ""}" placeholder="—" /></label>` : ""}
        </div>
        ${cola}
      </div>`;
    }).join("");

    const total = Math.round(pesoTotal(ev) * 100) / 100;
    const aviso = avisoPesos(ev);
    const est = estadoModulo(borradorComoModulo(sub));
    const resumen = est.nota == null
      ? "Todavía sin notas: en cuanto pongas la primera, aquí sale la nota que llevas."
      : `Con lo que llevas: <b>${est.nota.toFixed(2)}</b> / ${max} · ` +
        (est.aprobado ? `<b class="is-ok">Aprobado</b>` : `<b class="is-bad">Suspenso</b>${est.motivo ? " · " + esc(est.motivo) : ""}`);
    const ras = ev.reglas.ra.lista.map((r) => `
      <div class="eval-ra">
        <input name="ra:${r.id}:nombre" value="${esc(r.nombre)}" placeholder="RA1 · Pone en servicio DHCP" aria-label="Nombre del RA" />
        <label class="switch switch-mini"><span class="switch-t">Aprobado</span><input type="checkbox" name="ra:${r.id}:ok" role="switch" ${r.ok ? "checked" : ""}/></label>
        <button type="button" class="icon-btn eval-x" data-action="eval-del-ra" data-id="${r.id}" title="Quitar este RA" aria-label="Quitar ${esc(r.nombre)}">✕</button>
      </div>`).join("");

    return `
      <p class="hint" style="margin-top:0">Reparte el peso de cada parte y ve metiendo sus notas. La nota final del módulo se calcula sola; los módulos sin esquema siguen con su nota a mano.</p>
      <div class="eval-total${aviso ? " is-warn" : ""}">
        <span>Peso total</span><b>${total.toFixed(total % 1 ? 1 : 0)} %</b>
        ${aviso ? `<small>${esc(aviso)}</small>` : `<small>Cuadra.</small>`}
      </div>
      <div class="eval-rows">${filas}</div>
      <div class="hero-actions" style="margin:10px 0 4px">
        <button type="button" class="btn btn-sm" data-action="eval-add-comp">+ Añadir componente</button>
        <button type="button" class="btn btn-sm btn-ghost" data-action="eval-plantilla">40 / 40 / 20 (teoría, práctico, prácticas)</button>
      </div>
      <div class="eval-reglas">
        <label class="switch"><span class="switch-t">Hay que aprobar todos los RA</span><input type="checkbox" name="regla-ra" role="switch" ${ev.reglas.ra.activo ? "checked" : ""}/></label>
        <div class="eval-ra-lista">
          ${ev.reglas.ra.lista.length ? ras : `<p class="hint">Sin RA en la lista: añádelos y marca los aprobados. Mientras la lista esté vacía, esta regla no suspende nada.</p>`}
          <button type="button" class="btn btn-sm btn-ghost" data-action="eval-add-ra">+ Añadir RA</button>
        </div>
        <label class="switch"><span class="switch-t">Exigir la nota mínima de cada componente</span><input type="checkbox" name="regla-min" role="switch" ${ev.reglas.min.activo ? "checked" : ""}/></label>
        <label class="switch"><span class="switch-t">Hay que aprobar todos los temas</span><input type="checkbox" name="regla-todos" role="switch" ${ev.reglas.todos.activo ? "checked" : ""}/></label>
        <p class="hint">Con la regla activa, un tema (componente) por debajo de la mitad suspende el módulo aunque la media dé aprobado.</p>
      </div>
      <div class="eval-pie ${est.nota == null ? "" : est.aprobado ? "is-ok" : "is-bad"}">${resumen}</div>`;
  }

  // Lee lo que hay puesto en el modal (para no perderlo al añadir/quitar filas)
  function leerEsquema(form) {
    if (!form || !evalDraft) return;
    const fd = new FormData(form);
    const val = (k) => { const v = fd.get(k); return v == null ? "" : String(v).trim(); };
    const num = (k) => { const v = val(k).replace(",", "."); return v === "" ? null : Number(v); };
    evalDraft.componentes.forEach((c) => {
      const nombre = val("c:" + c.id + ":nombre");
      if (nombre) c.nombre = nombre.slice(0, 60);
      const p = num("c:" + c.id + ":peso");
      c.peso = clamp(p == null ? 0 : p, 0, 100);
      const s = num("c:" + c.id + ":sobre");
      c.sobre = clamp(s == null ? (Number(state.settings.gradeMax) || 10) : s, 1, 100);
      const n = num("c:" + c.id + ":nota");
      c.nota = n == null ? "" : clamp(n, 0, c.sobre);
      const m = num("c:" + c.id + ":min");
      c.min = m == null ? 0 : clamp(m, 0, c.sobre);
    });
    evalDraft.reglas.ra.lista.forEach((r) => {
      const nombre = val("ra:" + r.id + ":nombre");
      if (nombre) r.nombre = nombre.slice(0, 80);
    });
    $$("#modal-form input[type=checkbox]").forEach((c) => {
      const m = /^ra:(.+):ok$/.exec(c.name || "");
      if (m) { const r = evalDraft.reglas.ra.lista.find((x) => x.id === m[1]); if (r) r.ok = c.checked; }
      if (c.name === "regla-ra") evalDraft.reglas.ra.activo = c.checked;
      if (c.name === "regla-min") evalDraft.reglas.min.activo = c.checked;
      if (c.name === "regla-todos") evalDraft.reglas.todos.activo = c.checked;
    });
  }

  function pintarEsquema(sub) {
    openModal("Esquema de evaluación · " + sub.name, evalFormHTML(sub), {
      confirm: "Guardar esquema",
      onSubmit() {
        leerEsquema($("#modal-form"));
        const max = Number(state.settings.gradeMax) || 10;
        const limpio = saneEval(evalDraft, max);
        if (!limpio) { toast("Añade al menos un componente"); return; }
        sub.eval = limpio;
        const aviso = avisoPesos(limpio);
        save(); closeModal(); render();
        toast(aviso ? "Esquema guardado · " + aviso : "Esquema de " + sub.name + " guardado");
      },
    });
  }

  function abrirEsquema(sub) {
    if (!sub) return;
    // La copia de trabajo parte SIEMPRE de lo guardado (antes se borraba el esquema antes de
    // copiarlo y el editor abría en blanco: al guardar, se perdía lo que había).
    evalDraft = esquemaVacio(sub);
    evalDraftSub = sub.id;
    pintarEsquema(sub);
  }

  // Sin salir del editor: añadir/quitar filas y RA, o pasar una nota a mano
  function tocarEsquema(sub, accion, id, extra) {
    leerEsquema($("#modal-form"));
    if (accion === "eval-add-comp") {
      const sobre = Number(state.settings.gradeMax) || 10;
      // Hereda el peso del primero: con temas de igual peso la ponderada es la media
      // (antes nacían con peso 0 y no contaban para nada hasta tocarlos a mano).
      const pesoBase = Number(evalDraft.componentes[0] && evalDraft.componentes[0].peso) || 10;
      evalDraft.componentes.push({ id: uid(), nombre: "Tema " + (evalDraft.componentes.length + 1), peso: pesoBase, sobre, nota: "", min: 0, modo: "auto" });
    }
    if (accion === "eval-del-comp") {
      if (evalDraft.componentes.length <= 1) { toast("Deja al menos un componente"); return; }
      evalDraft.componentes = evalDraft.componentes.filter((c) => c.id !== id);
      if (evalDraft.reglas.ra.lista.length && !evalDraft.componentes.length) evalDraft.reglas.ra.activo = false;
    }
    if (accion === "eval-add-ra") evalDraft.reglas.ra.lista.push({ id: uid(), nombre: "RA" + (evalDraft.reglas.ra.lista.length + 1), ok: false });
    if (accion === "eval-del-ra") evalDraft.reglas.ra.lista = evalDraft.reglas.ra.lista.filter((r) => r.id !== id);
    if (accion === "eval-modo") {
      const c = evalDraft.componentes.find((x) => x.id === id);
      if (c) c.modo = extra === "manual" ? "manual" : "auto";
    }
    if (accion === "eval-plantilla") {
      const sobre = Number(state.settings.gradeMax) || 10;
      if (evalDraft.componentes.length > 1 || evalDraft.componentes[0].nota !== "") {
        ask("Cambiar el reparto", "Esto sustituye los componentes que hay ahora en el editor (nada se guarda hasta que pulses Guardar esquema).", () => {
          evalDraft.componentes = plantilla40(sobre);
          evalDraft.reglas.ra.activo = true;
          pintarEsquema(sub);
        });
        return;
      }
      evalDraft.componentes = plantilla40(sobre);
      evalDraft.reglas.ra.activo = true;
    }
    pintarEsquema(sub);
  }

  function plantilla40(sobre) {
    return [
      { id: uid(), nombre: "Examen de teoría", peso: 40, sobre, nota: "", min: 0, modo: "auto" },
      { id: uid(), nombre: "Examen práctico", peso: 40, sobre, nota: "", min: 0, modo: "auto" },
      { id: uid(), nombre: "Prácticas", peso: 20, sobre, nota: "", min: 0, modo: "auto" },
    ];
  }

  /* Meter la nota de los componentes sin abrir el esquema entero: es lo que harás cada vez que
     el profe devuelva un examen. Lo que venga de la Agenda se enseña, pero no se toca aquí. */
  function abrirNotas(sub) {
    const ev = evalDe(sub);
    if (!ev) { abrirEsquema(sub); return; }
    const max = Number(state.settings.gradeMax) || 10;
    const filas = ev.componentes.map((c) => {
      const n = notaDeComponente(sub, c);
      const deAgenda = n.origen === "agenda" && n.trabajos.length;
      return `<div class="field eval-nota-fila">
        <label for="n:${c.id}">${esc(c.nombre)} <span class="eval-peso">${Number(c.peso).toFixed(Number(c.peso) % 1 ? 1 : 0)} %</span></label>
        <div class="eval-nota-in">
          <input id="n:${c.id}" name="n:${c.id}" type="number" inputmode="decimal" step="0.01" min="0" max="${n.sobre}" value="${n.nota == null ? "" : n.nota}" placeholder="—" ${deAgenda ? `disabled` : ""} />
          <span class="eval-sobre">/ ${n.sobre}</span>
        </div>
        ${deAgenda ? `<p class="hint eval-origen">Lo llena la Agenda: ${n.trabajos.length} ${n.trabajos.length === 1 ? "entrega" : "entregas"} · media <b>${n.nota.toFixed(2)}</b>.
          <button type="button" class="link-btn" data-action="eval-modo-notas" data-id="${c.id}">escribirla a mano</button></p>` : ""}
      </div>`;
    }).join("");
    const est = estadoModulo(sub);
    openModal("Notas de " + sub.name, `
      <p class="hint" style="margin-top:0">Escribe la nota de cada componente sobre su máximo. La nota final del módulo se recalcula sola.</p>
      ${filas}
      <div class="eval-pie ${est.nota == null ? "" : est.aprobado ? "is-ok" : "is-bad"}">
        ${est.nota == null ? "Todavía sin notas." : `Nota final: <b>${est.nota.toFixed(2)}</b> / ${max} · ` + (est.aprobado ? `<b class="is-ok">Aprobado</b>` : `<b class="is-bad">Suspenso</b>${est.motivo ? " · " + esc(est.motivo) : ""}`)}
      </div>
      ${avisoPesos(ev) ? `<p class="hint">${esc(avisoPesos(ev))} Puedes cuadrarlo en «Esquema».</p>` : ""}`, {
      confirm: "Guardar notas",
      onSubmit(data) {
        let cambiadas = 0;
        (evalDe(sub) || { componentes: [] }).componentes.forEach((c) => {
          const bruto = data["n:" + c.id];
          if (bruto == null) return;
          const txt = String(bruto).trim().replace(",", ".");
          const antes = notaDeComponente(sub, c);
          if (txt === "") {
            c.nota = "";
            if (antes.origen !== "agenda") cambiadas++;
            return;
          }
          const v = clamp(Number(txt) || 0, 0, Number(c.sobre) || max);
          const igual = antes.nota != null && Math.abs(v - antes.nota) < 0.001;
          c.nota = v;
          // Si lo que había venía de la Agenda y ahora escribes otra cosa, manda tu nota
          c.modo = antes.origen === "agenda" && !igual ? "manual" : (c.modo || "auto");
          if (!igual) cambiadas++;
        });
        save(); closeModal(); render();
        toast(cambiadas ? "Notas guardadas" : "Sin cambios");
      },
    });
  }

  /* La hoja del simulador (v67.7): tres bloques —Aprobado, Notable y Sobresaliente— que dicen,
     cada uno, lo que hay que sacar en lo que queda. O que ya lo tienes. O que ya no llegas, que
     también es una respuesta útil (y duele menos si te lo dice la app que el boletín). */
  function abrirSimulador(sub) {
    if (!sub) return;
    const ev = evalDe(sub);
    if (!ev) { abrirEsquema(sub); return; }
    const max = Number(state.settings.gradeMax) || 10;
    const dos = (n) => Math.round(n * 100) / 100;
    const metas = [[dos(max / 2), "Aprobado"], [dos(max * 0.7), "Notable"], [dos(max * 0.9), "Sobresaliente"]];
    const ref = notaNecesaria(sub, metas[0][0]);

    // Dónde hay que sacar la nota: si queda un solo componente, se dice por su nombre
    const donde = (lista) => {
      if (!lista.length) return "";
      if (lista.length === 1) return ` en «${esc(lista[0].nombre)}»`;
      if (lista.length === 2) return ` en «${esc(lista[0].nombre)}» y «${esc(lista[1].nombre)}»`;
      return ` repartida en lo que queda (${lista.map((x) => esc(x.nombre)).join(", ")})`;
    };

    const bloque = ([meta, etiqueta]) => {
      const r = notaNecesaria(sub, meta);
      let cuerpo, clase = "";
      if (r.sinPeso) {
        cuerpo = "Ningún componente tiene peso: repártelo en «Esquema» y aquí sale la cuenta.";
        clase = "is-warn";
      } else if (r.yaEsta) {
        cuerpo = r.pendientes.length
          ? `<b class="is-ok">Ya lo tienes</b> (aunque saques un 0 en lo que queda)`
          : `<b class="is-ok">Ya lo tienes</b>: llevas <b>${notaEs(r.actual)}</b> y ya no queda nada por evaluar.`;
        clase = "is-ok";
      } else if (!r.posible) {
        cuerpo = `<b class="is-bad">Ni con un ${notaEs(max)}</b> — lo máximo que puedes acabar es <b>${notaEs(r.maxFinal)}</b>.`;
        clase = "is-bad";
      } else {
        cuerpo = `Te hacen falta <b>${notaEs(r.necesaria)}</b>${donde(r.pendientes)}.`;
      }
      return `<div class="sim-bloque ${clase}">
        <div class="sim-meta"><span>${esc(etiqueta)}</span><b>${notaEs(meta)}</b></div>
        <p class="sim-dice">${cuerpo}</p>
      </div>`;
    };

    // Los avisos que pueden suspender aunque la media dé: la cuenta de arriba no los ve
    const avisos = [];
    if (ref.sinPeso) avisos.push("Sin pesos repartidos no se puede calcular nada.");
    ref.minSuspenso.forEach((m) => avisos.push(
      `«${esc(m.nombre)}» lleva ${notaEs(m.nota)} y pide un mínimo de ${notaEs(m.min)}: aunque la media llegue, eso suspende.`));
    if (ref.minimoPendiente) avisos.push(
      `«${esc(ref.minimoPendiente.nombre)}» pide un mínimo de ${notaEs(ref.minimoPendiente.min)} sobre ${ref.minimoPendiente.sobre}: por debajo suspende por muy bien que vaya la media.`);
    if (ref.raSinAprobar.length) avisos.push(
      ref.raSinAprobar.length === 1
        ? `Queda un RA sin aprobar (${esc(ref.raSinAprobar[0])}) y hay que aprobarlos todos.`
        : `Quedan ${ref.raSinAprobar.length} RA sin aprobar (${ref.raSinAprobar.map(esc).join(", ")}) y hay que aprobarlos todos.`);

    const resumen = ref.actual == null
      ? "Todavía no hay ninguna nota: esto es lo que tendrías que sacar en cada parte."
      : `Llevas <b>${ref.evaluados} de ${ref.componentes}</b> componentes evaluados · media de lo evaluado: <b>${notaEs(ref.actual)}</b>.`;

    openModal("¿Qué nota necesito? · " + sub.name, `
      <p class="hint" style="margin-top:0">${resumen}</p>
      <div class="sim-lista">${metas.map(bloque).join("")}</div>
      ${ref.pendientes.length ? `<p class="hint">Queda por evaluar: <b>${ref.pendientes.map((c) => esc(c.nombre) + " (" + Number(c.peso).toFixed(Number(c.peso) % 1 ? 1 : 0) + " %)").join(" · ")}</b>.</p>` : ""}
      ${avisos.length ? `<div class="eval-pie is-bad">${avisos.map((a) => `<p class="sim-aviso">${a}</p>`).join("")}</div>` : ""}
      <p class="hint">La cuenta es la media ponderada de tu esquema: cada parte cuenta lo que pesa, y las notas «sobre X» se pasan a la escala de ${notaEs(max)} antes de entrar.</p>`, {
      confirm: "Cerrar",
      onSubmit() { closeModal(); },
    });
  }

  function renderRendimiento() {
    const gpa = weightedGPA();
    const max = Number(state.settings.gradeMax) || 10;
    const clsOf = (avg) => avg == null ? "g-na" : avg >= max * 0.9 ? "g-top" : avg >= max / 2 ? "g-ok" : "g-bad";
    const boletin = state.subjects.map((sub) => {
      const est = estadoModulo(sub);
      const n = est.nota;
      const gcls = clsOf(n);
      const mins = studiedFor(sub.id);
      // El punto de color era el del módulo (y alguno es rojo), así que un 7,50 salía con un
      // punto rojo al lado: parecía suspenso. Ahora el punto habla de la nota.
      const puntoNota = n == null ? "var(--muted-2)" : est.aprobado ? "var(--green)" : "var(--red)";
      const queDice = n == null ? "Sin nota" : est.aprobado ? "Aprobado" : (est.motivo || "Suspenso");
      // Con esquema, los componentes con su nota (la que manda) y su peso
      const lista = est.tieneEsquema ? `<div class="eval-lista">${evalDe(sub).componentes.map((c) => {
        const nc = notaDeComponente(sub, c);
        const col = nc.nota == null ? "var(--muted-2)" : nc.nota >= nc.sobre / 2 ? "var(--green)" : "var(--red)";
        return `<div class="eval-fila">
          <i style="background:${col}"></i>
          <span class="eval-n">${esc(c.nombre)}${nc.origen === "agenda" ? `<small> · Agenda (${nc.trabajos.length})</small>` : ""}</span>
          <span class="eval-p">${Number(c.peso).toFixed(Number(c.peso) % 1 ? 1 : 0)} %</span>
          <b class="eval-v">${nc.nota == null ? "—" : nc.nota.toFixed(2) + "<span>/" + nc.sobre + "</span>"}</b>
        </div>`;
      }).join("")}</div>` : "";
      return `<section class="boletin-mod">
        <div class="boletin-head">
          <i style="background:${puntoNota}" title="${esc(queDice)}"></i>
          <div>
            <b>${esc(sub.name)}</b>
            <small>${fmtHours(mins)} de estudio · ${esc(sub.teacher || "sin profesor")}</small>
          </div>
          <div class="g ${gcls}">${n == null ? "—" : n.toFixed(2)}<span class="g-max">/${max}</span></div>
        </div>
        ${est.tieneEsquema && est.motivo && est.aprobado === false ? `<p class="eval-motivo">${esc(est.motivo)}</p>` : ""}
        ${lista}
        <div class="eval-acciones">
          ${est.tieneEsquema
            ? `<button type="button" class="btn btn-sm btn-primary" data-action="eval-notas" data-id="${sub.id}">Meter notas</button>
               <button type="button" class="btn btn-sm btn-ghost" data-action="eval-simular" data-id="${sub.id}">¿Qué nota necesito?</button>
               <button type="button" class="btn btn-sm" data-action="eval-editar" data-id="${sub.id}">Esquema</button>`
            : `<button type="button" class="btn btn-sm btn-primary" data-action="edit-grade" data-id="${sub.id}">${n == null ? "Poner la nota" : "Cambiar la nota"}</button>
               <button type="button" class="btn btn-sm btn-ghost" data-action="eval-nuevo" data-id="${sub.id}">Esquema de evaluación</button>`}
        </div>
      </section>`;
    }).join("") || `<div class="empty"><b>Sin módulos</b>Añade tus módulos para ir apuntando notas.</div>`;
    const conNota = state.subjects.filter((s) => estadoModulo(s).nota != null).length;
    return `
      <div class="boletin-hero">
        <span class="k">Media del ciclo</span>
        <div class="g ${clsOf(gpa)}">${gpa == null ? "—" : gpa.toFixed(2)}</div>
        <small>${conNota ? conNota + " de " + state.subjects.length + " módulos con nota." : "Pon la nota de cada módulo y aquí sale la media."}</small>
      </div>
      <div class="sec-head"><h3>Por módulo</h3>
        <button class="hub-round" data-action="go" data-to="subjects" title="Ver módulos" aria-label="Ver módulos">+</button></div>
      <div class="chart-wrap">
        <div class="chart-head"><span class="k">Perfil de notas</span><small>cada eje, un módulo</small></div>
        ${radarSVG()}
      </div>
      ${boletin}
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
    pad, clamp, localISO, weekRange, streak, studiedFor, nextClass, $, $$,
    openModal, closeModal, ask, weightedGPA, grantXP, checkAchievements, needSubjects,
    // Esquema de evaluación por módulo (v67.5): lo usan las pruebas y la Agenda
    estadoModulo, notaModulo, evalDe, notaDeComponente, mediaEsquema, pesoTotal, avisoPesos, saneEval,
    abrirEsquema, abrirNotas, aplicarEsquemasConocidos, EXAM_KINDS,
    // v67.7: el simulador de nota, la vibración y el deslizamiento de la Agenda
    notaNecesaria, abrirSimulador, vibrar, marcarEntregado,
    pushUndo, undo, sanitize, flushSave, APP_VERSION, subjectSynonyms, matchSubject, nlpParse,
    isNativeShell, soloLocal: true,
    safeColor, sm2, cardState, nextLabel, migrateMedia, eventsOnDate, setException, exceptionsFor,
    COURSE, holidayName, OFFICIAL_MODS, OFFICIAL_SLOTS, OFFICIAL_PLAN, applyOfficialTimetable,
    dayInfo, isLectivo, plantillaDeMes, syncPlantilla, retimarHorario, semanaDe, HOLIDAYS, VACATIONS,
    PLAN_VERSION, actualizarHorarioOficial, avatarSrcPintable, OFFICIAL_SLOTS_V1, esHoraDelCentro,
    ponFoco, bloqueoActivo,
    unlockNote(id) { unlockedNotes.delete(id); },
    lockNote(id) { unlockedNotes.add(id); },
    get loadProblem() { return loadProblem; },
    get saveProblem() { return saveProblem; },
    subjectOptions, md, dueCards, attStats, addNote, addCard, addGrade, gradeCard, diasSinClase,
    guardarArchivo, nativoFicheros, icsTexto, markdownApuntes, ankiCSV, exportMarkdown, exportAnki,
    compartirNota, textoDeNota, compartirTexto, horarioTexto, compartirHorario,
    diasDesdeCopia, tocaAvisarCopia, initCopia, nuncaCopiada, DIAS_AVISO_COPIA,
    persistNote, buzz, confetti, levelInfo,
    get noteId() { return noteId; }, set noteId(v) { noteId = v; },
    get cardQueue() { return cardQueue; },
  };
  // Herramientas SMR pesa más que todo el resto de vistas juntas y se usa de vez en cuando:
  // el script se pide la primera vez que se entra en la vista (y queda cacheado por el
  // service worker, así que después funciona sin conexión igual que el resto).
  let toolsPidiendo = false;
  function cargarTools() {
    if (toolsPidiendo || (window.AulaTools && typeof window.AulaTools.view === "function")) return;
    toolsPidiendo = true;
    const etiqueta = document.createElement("script");
    etiqueta.src = "js/tools.js";
    etiqueta.async = true;
    etiqueta.onload = () => { toolsPidiendo = false; if (view === "tools") { try { render(); } catch {} } };
    etiqueta.onerror = () => { toolsPidiendo = false; toast("No se pudieron cargar las herramientas"); };
    document.head.appendChild(etiqueta);
  }

  const EXTRA_VIEWS = { agenda: 1, chatbot: 1, habits: 1, glossary: 1, examode: 1, quickreview: 1, admin: 1, achievements: 1, rendimiento: 1, tools: 1, exams: 1 };
  const esVista = (v) => !!(v && (titles[v] || EXTRA_VIEWS[v]));
  const hash = (location.hash || "").replace("#", "");
  if (esVista(hash)) view = hash;
  applyTheme();
  /* Concentración que sobrevive a recargas.
     OJO: el modo foco esconde la barra de abajo. Antes, cuando caducaba el bloqueo (o se salía a
     mano desde la vista de Concentración) solo se quitaba «exam-lock» y el foco se quedaba pegado
     para siempre: al abrir la app no se veía la barra de abajo ni forma evidente de recuperarla. */
  const _lockUntil = Number((state.progress && state.progress.flags && state.progress.flags.examLockUntil) || 0);
  if (_lockUntil > Date.now()) {
    ponFoco(true, true);
    setTimeout(() => {
      if (!bloqueoActivo()) ponFoco(false, true);
    }, _lockUntil - Date.now());
  } else if (_lockUntil) {
    state.progress.flags.examLockUntil = 0;
  }
  // Modo de entrada (ratón/teclado o táctil) para ajustar tamaños
  const marcarEntrada = () => document.documentElement.classList.toggle("is-touch", window.matchMedia("(pointer: coarse)").matches);
  marcarEntrada();
  window.addEventListener("pointerdown", marcarEntrada, { once: true });
  // Si había un bloque en curso (la app se cerró o el móvil la durmió), se sigue con él:
  // solo se estrena uno nuevo cuando no hay nada guardado. Antes se borraba al abrir.
  if (!timerRestore()) setMode("work", true);
  if (Media()) Media().ready().then((ok) => {
    if (ok) migrateMedia();
    else if (state.notes.some((n) => (n.attachments || []).some((a) => !a.data))) {
      toast("Este navegador no guarda archivos: las fotos se verán cuando haya datos");
    }
  });
  // Se retiró la papelera: lo que hubiera dentro ya está de vuelta en Apuntes
  if (papeleraRecuperada) {
    setTimeout(() => toast(papeleraRecuperada === 1 ? "Recuperé 1 nota que estaba en la papelera" : "Recuperé " + papeleraRecuperada + " notas que estaban en la papelera"), 900);
  }
  escucharToquesAvisos();
  mirarPermisoAvisos();
  mirarExactasAvisos();
  mirarBateriaAvisos();
  initCopia();
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
  // Dentro del APK (Capacitor) todo está empaquetado: el Service Worker no hace falta
  // y solo añadiría una caché que puede servir una versión vieja.
  if ("serviceWorker" in navigator && !isNativeShell()) {
    // updateViaCache: "none" → la comprobación de versión del sw.js no se queda pegada en la
    // caché HTTP del navegador, así las versiones nuevas entran en la siguiente apertura.
    const reg = navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" });
    reg.then(() => applyAppIcon()).catch(() => {});
    // Si al volver a la app hay una versión esperando, se activa sola.
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState !== "visible") return;
      navigator.serviceWorker.getRegistration().then((r) => r && r.update()).catch(() => {});
    });
    // Con el cache-first, tras publicar una versión el service worker nuevo toma el control
    // pero la pestaña sigue con el código viejo en memoria: aquí se avisa y se recarga al tocar.
    let teniaControl = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      applyAppIcon();
      if (!teniaControl) { teniaControl = true; return; }   // la primera vez solo se estrena
      if (document.getElementById("toast-version")) return;
      const el = toastAccion("Nueva versión lista", "Actualizar", () => location.reload());
      el.id = "toast-version";
    });
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

  // ================================================================
  // SWIPE ENTRE VISTAS PRINCIPALES
  // ================================================================
  /* Deslizar el dedo horizontalmente en la zona de contenido cambia de pestaña.
     Solo funciona entre las vistas de la barra inferior (no en las de «Más»).
     No interfiere con el swipe de la agenda (que va en .swipe, dentro de #view). */
  const NAV_VIEWS = ["dashboard", "schedule", "exams", "rendimiento"];
  const VIEW_SWIPE_UMBRAL = 60;
  let viewSwipe = null;

  function navSwipeStart(e) {
    // No interceptar si el toque es en la barra de abajo, en un modal, en un swipe de agenda, etc.
    const t = e.target;
    if (!t || !t.closest) return;
    if (t.closest("#bottom-nav") || t.closest(".modal") || t.closest(".sheet") || t.closest(".swipe") || t.closest(".cmdk")) return;
    if (!NAV_VIEWS.includes(view)) return;
    const touch = e.touches ? e.touches[0] : e;
    viewSwipe = { x0: touch.clientX, y0: touch.clientY, dir: "" };
  }
  function navSwipeMove(e) {
    if (!viewSwipe) return;
    const touch = e.touches ? e.touches[0] : e;
    const dx = touch.clientX - viewSwipe.x0;
    const dy = touch.clientY - viewSwipe.y0;
    if (!viewSwipe.dir) {
      if (Math.abs(dx) >= 12 && Math.abs(dx) >= 1.3 * Math.abs(dy)) {
        viewSwipe.dir = dx > 0 ? "left" : "right";  // invertido: swipe derecha = vista anterior
      } else if (Math.abs(dy) >= 12) {
        viewSwipe = null; return;  // es scroll vertical
      } else return;
    }
    if (typeof e.preventDefault === "function" && e.cancelable !== false) e.preventDefault();
    // Feedback visual: desplazar ligeramente el contenido
    const scroller = document.getElementById("view");
    const clamped = clamp(dx, -120, 120);
    if (scroller) scroller.style.transform = "translateX(" + clamped + "px)";
    scroller.style.transition = "none";
  }
  function navSwipeEnd(e) {
    if (!viewSwipe) return;
    const touch = e.changedTouches ? e.changedTouches[0] : e;
    const dx = touch.clientX - viewSwipe.x0;
    viewSwipe = null;
    const scroller = document.getElementById("view");
    if (scroller) { scroller.style.transform = ""; scroller.style.transition = ""; }
    if (Math.abs(dx) < VIEW_SWIPE_UMBRAL) return;
    const idx = NAV_VIEWS.indexOf(view);
    if (idx < 0) return;
    const next = dx > 0 ? NAV_VIEWS[idx - 1] : NAV_VIEWS[idx + 1];
    if (next) { vibrar("suave"); go(next); }
  }
  document.addEventListener("touchstart", navSwipeStart, { passive: true });
  document.addEventListener("touchmove", navSwipeMove, { passive: false });
  document.addEventListener("touchend", navSwipeEnd, { passive: true });
  document.addEventListener("touchcancel", () => {
    viewSwipe = null;
    const scroller = document.getElementById("view");
    if (scroller) { scroller.style.transform = ""; scroller.style.transition = ""; }
  }, { passive: true });

  // ================================================================
  // BUCLE PRINCIPAL (15 s) Y VISIBILIDAD
  // ================================================================

  setInterval(() => {
    // Si el móvil ha dormido la pestaña, el cronómetro se pone al día aquí
    if (timer.running && timer.endsAt) {
      timer.remaining = Math.max(0, Math.round((timer.endsAt - Date.now()) / 1000));
      if (timer.remaining <= 0) completeTimer();
    }
    updateTimerChrome();
    revisarTemaPorHora();
    tickNotify();
    mirarPermisoAvisos();
    mirarExactasAvisos();
    mirarBateriaAvisos();
    const cambioPlantilla = syncPlantilla(state);
    if (cambioPlantilla) { save(); toast(avisoPlantilla(cambioPlantilla)); render(); }
    tickLiveUI();
    pushWidgets();
  }, 15000);
  setTimeout(() => tickNotify(), 2500);
  if (plantillaAuto) setTimeout(() => { toast(avisoPlantilla(plantillaAuto)); save(); }, 1400);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { flushSave(); return; }
    // Acaba de volver (por ejemplo, de la pantalla de «Alarmas y recordatorios» o del
    // diálogo de batería): se comprueba si ha cambiado algo y se pinta si estaba en Ajustes.
    mirarPermisoAvisos();
    mirarExactasAvisos();
    mirarBateriaAvisos();
    const cambioPlantilla = syncPlantilla(state);
    if (cambioPlantilla) { save(); toast(avisoPlantilla(cambioPlantilla)); render(); }
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
  // Escuchar cambios de tema del sistema (por ejemplo, el usuario activa modo oscuro en Android)
  if (window.matchMedia) {
    try {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
        if (state.settings.autoTheme) { applyTheme(); render(); }
      });
    } catch {}
  }
  setTimeout(() => pushWidgets(), 800);
})();

