(() => {
  "use strict";
  const A = () => window.Aula;
  const st = () => A().state;
  function api() { return A(); }
  const F = (k) => A()[k];
  const esc = (s) => F("esc")(s);
  const uid = () => F("uid")();
  const todayISO = () => F("todayISO")();
  const fmtDate = (d) => F("fmtDate")(d);
  const fmtDateLong = (d) => F("fmtDateLong")(d);
  const subjectName = (id) => F("subjectName")(id);
  const subjectColor = (id) => F("subjectColor")(id);
  const minutesOf = (t) => F("minutesOf")(t);
  const weekdayMon0 = (d) => F("weekdayMon0")(d);
  const DAYS = () => F("DAYS");
  const DAYS_SHORT = () => F("DAYS_SHORT");
  const pad = (n) => F("pad")(n);
  const localISO = (d) => F("localISO")(d);
  const weekRange = () => F("weekRange")();
  const $ = (s) => F("$")(s);
  const openModal = (a,b,c) => F("openModal")(a,b,c);
  const closeModal = () => F("closeModal")();
  const toast = (m) => F("toast")(m);
  const save = () => F("save")();
  const render = () => F("render")();
  const md = (s) => F("md")(s);
  const grantXP = (n,r) => F("grantXP")(n,r);
  const checkAchievements = () => F("checkAchievements")();
  const subjectOptions = (s) => F("subjectOptions")(s);

  // El chat se guarda dentro del estado: se queda con los últimos 40 mensajes
  function recortarChat() {
    const c = st()._chat;
    if (Array.isArray(c) && c.length > 40) c.splice(0, c.length - 40);
  }
  const dayInfo = (iso) => F("dayInfo")(iso);
  const esLectivo = (iso) => F("isLectivo")(iso);
  const hoyISO = () => F("todayISO")();
  // Bloques de estudio que te has apuntado (van en el horario, tipo "estudio")
  function bloquesDe(iso) {
    return clasesDe(iso, 0).filter((e) => e.type === "estudio");
  }
  function horasDeEstudio(iso) {
    return st().sessions.filter((s) => s.date === iso).reduce((a, b) => a + (b.minutes || 0), 0);
  }

  // Clases reales de una fecha (con las excepciones de ese día aplicadas)
  function clasesDe(iso, day) {
    if (Aula.eventsOnDate) return Aula.eventsOnDate(iso);
    return st().events.filter((e) => e.day === day).sort((a, b) => a.start.localeCompare(b.start));
  }

  function freeSlots(day, iso) {
    const startH = Number.isFinite(Number(st().settings.startHour)) ? Number(st().settings.startHour) : 8;
    const endH = Number.isFinite(Number(st().settings.endHour)) ? Number(st().settings.endHour) : 21;
    const evs = (iso ? clasesDe(iso, day) : st().events.filter((e) => e.day === day)).slice().sort((a, b) => a.start.localeCompare(b.start));
    const gaps = [];
    let cursor = startH * 60;
    evs.forEach((e) => {
      const s = minutesOf(e.start);
      if (s - cursor >= 40) gaps.push({ start: pad(Math.floor(cursor / 60)) + ":" + pad(cursor % 60), end: e.start });
      cursor = Math.max(cursor, minutesOf(e.end));
    });
    if (endH * 60 - cursor >= 40) gaps.push({ start: pad(Math.floor(cursor / 60)) + ":" + pad(cursor % 60), end: pad(endH) + ":00" });
    return gaps;
  }

  function todayStudyHint() {
    const mods = st().subjects;
    if (!mods.length) return "Añade tus módulos y empieza por el que lleves más flojo.";
    const mins = (s) => st().sessions.filter((x) => x.subjectId === s.id).reduce((a, b) => a + (b.minutes || 0), 0);
    const flojo = [...mods].sort((a, b) => mins(a) - mins(b))[0];
    const d = Math.round(mins(flojo) / 60);
    return `Hoy toca ${flojo.name}: llevas ${d} h apuntadas de este módulo. Un bloque de fichas de 20 minutos y listo.`;
  }

  /* Agenda (v57): tu estudio, sin el horario (eso está en la vista Horario).
     Día con tus bloques de estudio, los huecos libres para meter uno y lo que has estudiado. */
  function agenda() {
    const tab = st()._agendaTab || "dia";
    const cursor = st()._agendaDay || hoyISO();
    const d = new Date(cursor + "T00:00:00");
    const info = dayInfo(cursor);
    const tabs = [["dia", "Día"], ["semana", "Semana"], ["mes", "Mes"]];
    let body = "";
    if (tab === "dia") {
      const bloques = bloquesDe(cursor);
      const gaps = info.kind === "lectivo" ? freeSlots(weekdayMon0(d), cursor) : [];
      const mins = horasDeEstudio(cursor);
      body = `<p class="hint">${esc(todayStudyHint())}</p>
        ${info.kind !== "lectivo" ? `<p class="idle-note">${esc(info.label)} · no hay clase</p>` : ""}
        <h3>Bloques de estudio</h3>
        ${bloques.length ? bloques.map((e) => `<div class="row">
            <span class="dot" style="background:${subjectColor(e.subjectId)}"></span>
            <div style="flex:1"><b>${esc(subjectName(e.subjectId))}</b>${e.room ? `<small class="hint">${esc(e.room)}</small>` : ""}</div>
            <div class="meta">${e.start}–${e.end}</div>
          </div>`).join("") : `<div class="empty">Ninguno. Reserva un hueco libre y aparece aquí.</div>`}
        <h3>Huecos libres</h3>
        ${gaps.length ? gaps.map((g) => `<div class="row"><div>${g.start}–${g.end}</div>
            <button class="btn btn-sm" data-action="slot-study" data-day="${weekdayMon0(d)}" data-start="${g.start}" data-end="${g.end}">Reservar estudio</button></div>`).join("")
          : `<p class="muted">${info.kind === "lectivo" ? "Día lleno o sin huecos claros." : "Hoy no hay clases: todo el día es tuyo."}</p>`}
        <h3>Estudiado hoy</h3>
        <p><b>${mins}</b> min ${mins ? "· ¡bien!" : "· todavía nada"}</p>`;
    } else if (tab === "semana") {
      const mon = new Date(d); mon.setDate(d.getDate() - weekdayMon0(d));
      const days = Array.from({ length: 7 }, (_, i) => {
        const x = new Date(mon); x.setDate(mon.getDate() + i);
        return localISO(x);
      });
      body = `<div class="week-agenda">${days.map((iso, i) => {
        const inf = dayInfo(iso);
        const bloques = bloquesDe(iso);
        return `<div class="wa-day ${iso === hoyISO() ? "today" : ""} ${inf.kind === "lectivo" ? "" : "off"}">
          <b>${DAYS()[i] || DAYS_SHORT()[i]} ${iso.slice(8)}</b>
          ${inf.kind === "lectivo" ? bloques.map((e) => `<div class="wa-ev">${e.start} ${esc(subjectName(e.subjectId))}</div>`).join("") || `<div class="wa-ev" style="opacity:.6">Libre</div>`
            : `<div class="wa-ev" style="opacity:.7">${esc(inf.short)}</div>`}
          <small>${horasDeEstudio(iso) ? horasDeEstudio(iso) + " min" : ""}</small>
        </div>`;
      }).join("")}</div>
      <p class="hint">Aquí ves lo que te has apuntado para estudiar y los días sin clase. El horario de clases está en su pestaña.</p>`;
    } else {
      const y = d.getFullYear(), m = d.getMonth();
      const first = new Date(y, m, 1);
      const pad0 = weekdayMon0(first);
      const dim = new Date(y, m + 1, 0).getDate();
      const cells = [];
      for (let i = 0; i < pad0; i++) cells.push("");
      for (let n = 1; n <= dim; n++) cells.push(`${y}-${pad(m + 1)}-${pad(n)}`);
      body = `<div class="cal">${DAYS_SHORT().map((x) => `<div class="dow">${x}</div>`).join("")}
        ${cells.map((iso) => {
          if (!iso) return `<div class="cal-day out"></div>`;
          const inf = dayInfo(iso);
          const bloques = bloquesDe(iso);
          return `<div class="cal-day ${iso === hoyISO() ? "today" : ""} ${inf.kind === "lectivo" ? "" : "out"}" data-action="agenda-day" data-date="${iso}" title="${esc(inf.label || "Clase")}">
            <div class="n">${Number(iso.slice(8))}</div>
            ${bloques.length ? `<div class="cal-ev" style="display:block">${esc(subjectName(bloques[0].subjectId)).slice(0, 12)}</div>` : ""}
            ${inf.kind === "festivo" || inf.kind === "vacaciones" ? `<small style="font-size:9px">${esc(inf.short)}</small>` : ""}
          </div>`;
        }).join("")}</div>`;
    }
    return `<div class="tabs">
      ${tabs.map(([id, l]) => `<button data-action="agenda-tab" data-tab="${id}" class="${tab === id ? "is-on" : ""}">${l}</button>`).join("")}
      <button class="btn btn-sm" data-action="agenda-prev">‹</button>
      <button class="btn btn-sm" data-action="agenda-next">›</button>
    </div>
    <p><strong>${fmtDateLong(cursor)}</strong>${info.kind === "lectivo" ? "" : " · " + esc(info.label)}</p>
    ${body}`;
  }


  function localBrain(q) {
    q = (q || "").trim();
    const low = q.toLowerCase();
    if (!q) return "Pregunta por tu horario, por los festivos o por un concepto de tus apuntes.";
    if (/qu[eé] tengo|esta semana|horario|clase/.test(low)) {
      const wr = weekRange();
      const hoy = hoyISO();
      const inf = dayInfo(hoy);
      const list = inf.kind === "lectivo" ? Aula.eventsOnDate(hoy) : [];
      const manana = (() => { const x = new Date(hoy + "T12:00:00"); x.setDate(x.getDate() + 1); return localISO(x); })();
      const infM = dayInfo(manana);
      const listM = infM.kind === "lectivo" ? Aula.eventsOnDate(manana) : [];
      return `Hoy (${fmtDate(hoy)}): ${inf.kind === "lectivo" ? list.map((e) => e.start + " " + subjectName(e.subjectId)).join(", ") || "sin clases" : inf.label}
Mañana (${fmtDate(manana)}): ${infM.kind === "lectivo" ? listM.map((e) => e.start + " " + subjectName(e.subjectId)).join(", ") || "sin clases" : infM.label}
Semana del ${fmtDate(wr.from)} al ${fmtDate(wr.to)}. ${todayStudyHint()}`;
    }
    if (/festivo|vacacion|no hay clase|sin clase/.test(low)) {
      const prox = F("diasSinClase")(4);
      return prox.length
        ? "Lo próximo sin clase:\n" + prox.map((x) => `- ${x.info.label}: ${fmtDateLong(x.iso)}`).join("\n")
        : "No quedan festivos ni vacaciones por delante.";
    }
    if (/qu[eé] estudiar|hoy/.test(low)) return todayStudyHint();
    const words = low.split(/\s+/).filter((w) => w.length > 3);
    const hits = st().notes.map((n) => {
      const blob = (n.title + " " + n.content).toLowerCase();
      const score = words.reduce((s, w) => s + (blob.includes(w) ? 1 : 0), 0);
      return { n, score };
    }).filter((x) => x.score).sort((a, b) => b.score - a.score).slice(0, 3);
    if (hits.length) {
      return hits.map((h) => `Según «${h.n.title}»:\n${(h.n.content || "").slice(0, 420)}`).join("\n\n—\n\n");
    }
    const g = (st().glossary || []).filter((x) => low.includes(x.term.toLowerCase()));
    if (g.length) return g.map((x) => `${x.term}: ${x.def}`).join("\n");
    return "No encuentro eso en tus apuntes. Prueba con palabras del título del tema, o conecta tu Ollama en Ajustes para respuestas más largas.";
  }

  // Texto del estado de Ollama para Ajustes (sin promesas: lo que ya sabemos)
  function textoOllama() {
    return st().settings.ollamaUrl
      ? "Conectado a " + st().settings.ollamaUrl + " (" + (st().settings.ollamaModel || "llama3.2") + "). Si no responde, el chat sigue con el motor local."
      : "Ahora mismo: motor local, sin red.";
  }

  async function probarOllama() {
    const url = (st().settings.ollamaUrl || "").replace(/\/$/, "");
    if (!url) throw new Error("sin url");
    const ctrl = new AbortController();
    const reloj = setTimeout(() => ctrl.abort(), 8000);
    try {
      const r = await fetch(url + "/api/tags", { signal: ctrl.signal });
      if (!r.ok) throw new Error("respuesta " + r.status);
      const j = await r.json().catch(() => ({}));
      const modelos = (j.models || []).length;
      return modelos
        ? "Ollama responde · " + modelos + " modelo(s) disponibles"
        : "Ollama responde, pero no veo ningún modelo descargado";
    } finally { clearTimeout(reloj); }
  }

  async function askOllama(q) {
    const url = (st().settings.ollamaUrl || "").replace(/\/$/, "");
    if (!url) return localBrain(q);
    const ctx = st().notes.slice(0, 8).map((n) => `# ${n.title}\n${(n.content || "").slice(0, 800)}`).join("\n\n");
    const prompt = `Eres un asistente de estudio de SMR. Responde SOLO con los apuntes y el calendario del alumno. Si no está, dilo.\n\nAPUNTES:\n${ctx}\n\nPREGUNTA: ${q}`;
    // Sin límite de tiempo, un Ollama apagado dejaba el chat pensando para siempre
    const ctrl = new AbortController();
    const reloj = setTimeout(() => ctrl.abort(), 45000);
    try {
      const r = await fetch(url + "/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: st().settings.ollamaModel || "llama3.2", prompt, stream: false }),
        signal: ctrl.signal,
      });
      if (!r.ok) throw new Error("Ollama respondió " + r.status);
      const j = await r.json();
      return j.response || JSON.stringify(j);
    } catch (e) {
      throw new Error(/abort/i.test(String(e.name || e.message)) ? "Ollama tardó más de 45 s" : "No se pudo hablar con Ollama");
    } finally { clearTimeout(reloj); }
  }

  function chatbot() {
    const log = st()._chat || [];
    const ia = st().settings.ollamaUrl
      ? "Ollama en " + esc(st().settings.ollamaUrl) + " (si no contesta, responde el motor local)"
      : "motor local (sin red)";
    return `<div class="card">
      <p class="hint">Responde con <strong>tus apuntes y tu calendario</strong>, todo dentro del móvil. Ahora mismo: ${ia}. <button class="linkish" data-action="go" data-to="admin">Configurar Ollama en «Datos locales»</button>.</p>
      <div class="chat-log" id="chat-log">${log.map((m) => `<div class="chat-msg ${m.role}"><b>${m.role === "user" ? "Tú" : "Aula"}</b><pre>${esc(m.text)}</pre></div>`).join("") || "<div class='empty'>Prueba: «¿qué tengo esta semana?»</div>"}</div>
      <textarea id="chat-q" rows="3" placeholder="¿Qué tengo esta semana? Explica DHCP…"></textarea>
      <div class="hero-actions">
        <button class="btn btn-primary" data-action="chat-send">Preguntar</button>
        <button class="btn" data-action="chat-quiz">Generar test del tema abierto</button>
        <button class="btn" data-action="chat-sum">Resumir nota abierta</button>
        <button class="btn" data-action="chat-map">Esquema / mapa</button>
        <button class="btn" data-action="chat-speak">Leer último (audio)</button>
      </div>
    </div>`;
  }

  function habits() {
    const list = st().habits || [];
    const today = todayISO();
    return `<div class="card">
      <div class="card-head"><h3>Hábitos de estudio</h3><button class="btn btn-sm btn-primary" data-action="habit-add">Nuevo</button></div>
      <p class="hint">Ej. «repaso 20 min». Se integran en el día. Aviso nocturno si activaste recordatorios.</p>
      ${list.map((h) => {
        const done = (h.doneOn || []).includes(today);
        return `<div class="task ${done ? "done" : ""}">
          <input type="checkbox" data-action="habit-tog" data-id="${h.id}" aria-label="Hecho hoy: ${esc(h.title)}" ${done ? "checked" : ""} />
          <div class="tt">${esc(h.title)}</div>
          <span>${h.minutes || 20} min · ${h.time || "21:30"}</span>
          <button class="btn btn-sm" data-action="habit-del" data-id="${h.id}">×</button>
        </div>`;
      }).join("") || "<div class='empty'>Crea un hábito de repaso nocturno.</div>"}
    </div>`;
  }

  function glossary() {
    const list = st().glossary || [];
    return `<div class="card">
      <div class="card-head"><h3>Glosario técnico</h3><button class="btn btn-sm btn-primary" data-action="gloss-add">Añadir</button></div>
      ${list.map((g) => `<div class="row"><div style="flex:1"><b>${esc(g.term)}</b><div class="muted">${esc(g.def)}</div></div>
        <small>${esc(subjectName(g.subjectId))}</small>
        <button class="btn btn-sm" data-action="gloss-del" data-id="${g.id}">×</button></div>`).join("") || "<div class='empty'>DHCP, GPO, VLAN…</div>"}
    </div>`;
  }

  function examode() {
    const notes = st().notes.slice(0, 8);
    return `<div class="card">
      <h3>Modo concentración</h3>
      <p>Solo lectura, temporizador y sin captura. Ideal para el aula o para estudiar sin tocar nada más.</p>
      <div class="hero-actions">
        <button class="btn btn-primary" data-action="examode-on">Activar 90 min</button>
        <button class="btn" data-action="examode-off">Desactivar</button>
      </div>
      <div class="preview" style="margin-top:12px">${notes.map((n) => `<h3>${esc(n.title)}</h3>${md(n.content || "")}`).join("") || "No hay apuntes."}</div>
    </div>`;
  }

  function quickreview() {
    const mins = (s) => st().sessions.filter((x) => x.subjectId === s.id).reduce((a, b) => a + (b.minutes || 0), 0);
    const flojo = [...st().subjects].sort((a, b) => mins(a) - mins(b))[0];
    const sid = flojo ? flojo.id : "";
    const notes = st().notes.filter((n) => n.subjectId === sid).slice(0, 3);
    const cards = st().cards.filter((c) => c.subjectId === sid).slice(0, 6);
    return `<div class="card">
      <h3>Repaso rápido ${flojo ? "· " + esc(flojo.name) : ""}</h3>
      <p class="hint">${esc(todayStudyHint())}</p>
      <button class="btn btn-primary" data-action="go" data-to="cards">Fichas</button>
      <button class="btn" data-action="go" data-to="chatbot">Preguntar al asistente</button>
      <button class="btn" data-action="sheet-print">Chuleta imprimible</button>
    </div>
    <div class="card"><h3>Resumen</h3>${notes.map((n) => `<h4>${esc(n.title)}</h4><div class="preview">${md((n.content || "").split("\n").slice(0, 12).join("\n"))}</div>`).join("") || "Sin notas de este módulo."}</div>
    <div class="card"><h3>Fichas</h3>${cards.map((c) => `<div class="row"><b>${esc(c.front)}</b> — ${esc(c.back)}</div>`).join("") || "Sin fichas."}</div>`;
  }

  // Instantáneas: si el almacén tiene algo que no es una lista (o no es JSON), se ignora
  function leerSnaps() {
    try {
      const v = JSON.parse(localStorage.getItem("aula.snaps") || "[]");
      return Array.isArray(v) ? v.filter((x) => x && typeof x === "object" && x.id) : [];
    } catch { return []; }
  }
  function guardarSnaps(snaps) {
    try { localStorage.setItem("aula.snaps", JSON.stringify(snaps.slice(0, 3))); return true; } catch { return false; }
  }
  function admin() {
    const last = localStorage.getItem("aula.lastBackup") || "nunca";
    const snaps = leerSnaps();
    return `<div class="card">
      <h3>Todo en este dispositivo</h3>
      <p class="hint">Aula no habla con ningún servidor: ni nube, ni cuentas, ni sincronización. Tus datos viven en este móvil.</p>
      <p>Último backup local: <b>${esc(last)}</b></p>
      <div class="hero-actions">
        <button class="btn" data-action="snap-now">Punto de restauración</button>
      </div>
      ${snaps.map((s) => `<div class="row"><div>${new Date(s.t).toLocaleString("es-ES")} · ${s.n} ítems</div>
        <button class="btn btn-sm" data-action="snap-load" data-id="${s.id}">Restaurar</button></div>`).join("")}
    </div>
    <div class="card">
      <h3>Ollama (IA local)</h3>
      <p class="hint">El chat funciona siempre con el motor local (tus apuntes y tu calendario, sin red). Si además tienes Ollama en tu ordenador, escribe su dirección y el chat tirará de tu modelo. <b>No hay ninguna nube de por medio.</b></p>
      <div class="field"><label for="set-ollama">Dirección de Ollama</label><input id="set-ollama" type="url" inputmode="url" value="${esc(st().settings.ollamaUrl || "")}" placeholder="http://192.168.1.10:11434" /></div>
      <div class="field"><label for="set-omodel">Modelo</label><input id="set-omodel" value="${esc(st().settings.ollamaModel || "llama3.2")}" /></div>
      <div class="hero-actions">
        <button class="btn btn-primary" data-action="ollama-save">Guardar</button>
        <button class="btn" data-action="ollama-test">Probar conexión</button>
        <button class="btn" data-action="ollama-local">Quitar y usar el local</button>
      </div>
      <p class="hint" id="ollama-estado">${esc(textoOllama())}</p>
    </div>
    <div class="card">
      <h3>Modo invitado</h3>
      <p>Consulta sin guardar (no deja rastro en este navegador).</p>
      <button class="btn" data-action="guest-on">Entrar como invitado</button>
      <button class="btn" data-action="guest-off">Salir</button>
    </div>`;
  }

  /* Reduce la foto antes de guardarla: una foto de móvil son 3-5 MB y el estado
     vive en localStorage. Se queda con el lado mayor en `maxSide` px y sale en JPEG. */
  function shrinkImage(file, maxSide, quality) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      const cerrar = () => { try { URL.revokeObjectURL(url); } catch {} };
      img.onload = () => {
        try {
          const w0 = img.naturalWidth || img.width, h0 = img.naturalHeight || img.height;
          if (!w0 || !h0) throw new Error("imagen vacía");
          const k = Math.min(1, (maxSide || 1280) / Math.max(w0, h0));
          const c = document.createElement("canvas");
          c.width = Math.max(1, Math.round(w0 * k));
          c.height = Math.max(1, Math.round(h0 * k));
          const ctx = c.getContext("2d");
          ctx.drawImage(img, 0, 0, c.width, c.height);
          const data = c.toDataURL("image/jpeg", quality || 0.72);
          if (!/^data:image\//.test(data)) throw new Error("no se pudo convertir");
          cerrar();
          resolve(data);
        } catch (e) { cerrar(); reject(e); }
      };
      img.onerror = () => { cerrar(); reject(new Error("no se pudo leer la imagen")); };
      img.src = url;
    });
  }

  function click(action, btn) {
    const Aula = api();
    if (!Aula) return;
    const id = btn.dataset.id;
    if (action === "agenda-tab") { st()._agendaTab = btn.dataset.tab; render(); }
    if (action === "agenda-day") { st()._agendaDay = btn.dataset.date; st()._agendaTab = "dia"; render(); }
    if (action === "agenda-prev" || action === "agenda-next") {
      const paso = action === "agenda-next" ? 1 : -1;
      const tab = st()._agendaTab || "dia";
      const cur = new Date((st()._agendaDay || todayISO()) + "T12:00:00");
      // Un mes es un mes: antes se sumaban 30 días y el calendario se iba de fecha
      if (tab === "mes") { cur.setDate(1); cur.setMonth(cur.getMonth() + paso); }
      else cur.setDate(cur.getDate() + paso * (tab === "semana" ? 7 : 1));
      st()._agendaDay = localISO(cur); render();
    }
    if (action === "slot-study") {
      // El bloque dura lo que dura el hueco (entre 10 y 180 minutos)
      const inicio = btn.dataset.start || "16:00";
      const finHueco = minutesOf(btn.dataset.end || "") || (minutesOf(inicio) + 45);
      const mins = Math.max(10, Math.min(180, finHueco - minutesOf(inicio)));
      const finM = minutesOf(inicio) + mins;
      st().events.push({ id: uid(), subjectId: (st().subjects[0] || {}).id, day: Number(btn.dataset.day) || 0,
        start: inicio, end: pad(Math.floor(finM / 60) % 24) + ":" + pad(finM % 60), room: "Estudio", type: "estudio" });
      grantXP(5, "Bloque de estudio"); checkAchievements(); save(); render(); toast("Hueco reservado (" + mins + " min)");
    }
    if (action === "chat-send") {
      const q = ($("#chat-q") || {}).value || "";
      if (!q.trim()) return;
      st()._chat = st()._chat || [];
      st()._chat.push({ role: "user", text: q });
      recortarChat();
      const finish = (text) => { st()._chat.push({ role: "bot", text }); recortarChat(); render(); };
      askOllama(q).then(finish).catch(() => finish(localBrain(q) + "\n\n(Ollama no respondió; respondió el motor local.)"));
    }
    if (action === "chat-quiz" || action === "chat-sum" || action === "chat-map") {
      const n = st().notes[0];
      if (!n) { toast("Crea una nota"); return; }
      let text = "";
      if (action === "chat-quiz") {
        const lines = (n.content || "").split("\n").filter((l) => l.includes("::") || l.startsWith("- "));
        text = "Preguntas:\n" + (lines.slice(0, 8).map((l, i) => `${i + 1}. ${l.replace(/^[-*]\s*/, "")}`).join("\n") || "Añade líneas «- pregunta :: respuesta».");
      } else if (action === "chat-sum") {
        text = "Resumen de «" + n.title + "»:\n" + (n.content || "").split("\n").filter((l) => l.startsWith("#") || l.length > 40).slice(0, 10).join("\n");
      } else {
        text = "Esquema:\n" + (n.content || "").split("\n").filter((l) => /^#{1,3}\s/.test(l) || l.startsWith("- ")).slice(0, 20).join("\n");
      }
      st()._chat = st()._chat || [];
      st()._chat.push({ role: "bot", text });
      render();
    }
    if (action === "chat-speak") {
      const last = (st()._chat || []).filter((m) => m.role === "bot").pop();
      if (last && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(last.text.slice(0, 800));
        u.lang = "es-ES";
        speechSynthesis.speak(u);
      } else toast("Nada que leer");
    }
    if (action === "habit-add") {
      openModal("Nuevo hábito", `<div class="field"><label>Nombre</label><input name="title" required value="Repaso diario" /></div>
        <div class="form-row"><div class="field"><label>Minutos</label><input name="minutes" type="number" value="20" /></div>
        <div class="field"><label>Hora aviso</label><input name="time" type="time" value="21:30" /></div></div>`, {
        onSubmit(data) {
          st().habits = st().habits || [];
          st().habits.push({ id: uid(), title: data.title, minutes: Number(data.minutes) || 20, time: data.time, doneOn: [] });
          closeModal(); save(); render();
        },
      });
    }
    if (action === "habit-tog") {
      const h = (st().habits || []).find((x) => x.id === id);
      if (!h) return;
      const d = todayISO();
      h.doneOn = h.doneOn || [];
      if (h.doneOn.includes(d)) h.doneOn = h.doneOn.filter((x) => x !== d);
      else { h.doneOn.push(d); grantXP(6, "Hábito"); }
      checkAchievements(); save(); render();
    }
    if (action === "habit-del") { st().habits = (st().habits || []).filter((x) => x.id !== id); save(); render(); }
    if (action === "gloss-add") {
      openModal("Término", `<div class="field"><label>Término</label><input name="term" required /></div>
        <div class="field"><label>Definición</label><textarea name="def" required></textarea></div>
        <div class="field"><label>Módulo</label><select name="subjectId">${subjectOptions()}</select></div>`, {
        onSubmit(data) {
          st().glossary = st().glossary || [];
          st().glossary.push({ id: uid(), term: data.term.trim(), def: data.def.trim(), subjectId: data.subjectId });
          closeModal(); save(); render();
        },
      });
    }
    if (action === "gloss-del") { st().glossary = (st().glossary || []).filter((x) => x.id !== id); save(); render(); }
    if (action === "examode-on") {
      const hasta = Date.now() + 90 * 60 * 1000;
      st().progress.flags = Object.assign({}, st().progress.flags, { examLockUntil: hasta });
      document.body.classList.add("focus-mode", "exam-lock");
      save();
      toast("Concentración: 90 min sin distracciones");
    }
    if (action === "examode-off") {
      st().progress.flags = Object.assign({}, st().progress.flags, { examLockUntil: 0 });
      document.body.classList.remove("exam-lock");
      save(); render();
      toast("Modo concentración desactivado");
    }
    if (action === "sheet-print") window.print();
    if (action === "ollama-save" || action === "ollama-test" || action === "ollama-local") {
      if (action === "ollama-local") {
        st().settings.ollamaUrl = "";
        save(); render(); toast("Ollama desconectado: el chat usará el motor local");
        return;
      }
      const campo = document.getElementById("set-ollama");
      if (campo) st().settings.ollamaUrl = campo.value.trim();
      const modelo = document.getElementById("set-omodel");
      if (modelo) st().settings.ollamaModel = modelo.value.trim() || "llama3.2";
      if (!st().settings.ollamaUrl) {
        save(); render(); toast("Sin dirección: el chat usa el motor local");
        return;
      }
      save();
      if (action === "ollama-save") { render(); toast("Ollama guardado"); return; }
      // Probar conexión: es lo único que sale a la red, y solo lo pides tú
      const marca = document.getElementById("ollama-estado");
      if (marca) marca.textContent = "Probando…";
      probarOllama()
        .then((m) => {
          if (marca) marca.textContent = m;
          render(); toast(m);
        })
        .catch(() => {
          const m = "No responde en " + st().settings.ollamaUrl + " · el chat sigue en local (revisa que sea la misma Wi-Fi)";
          if (marca) marca.textContent = m;
          render(); toast(m);
        });
    }
    if (action === "snap-now") {
      const snaps = leerSnaps();
      const dump = JSON.stringify(st());
      if (dump.length > 900_000) { toast("Los datos ocupan demasiado para una instantánea"); return; }
      snaps.unshift({ id: uid(), t: Date.now(), n: st().notes.length, data: dump });
      // Antes se guardaban 5 copias completas: con fotos eso llenaba el almacén.
      if (guardarSnaps(snaps)) {
        try { localStorage.setItem("aula.lastBackup", new Date().toLocaleString("es-ES")); } catch {}
        toast("Punto guardado");
      } else toast("No hay espacio para más copias");
      render();
    }
    if (action === "snap-load") {
      const s = leerSnaps().find((x) => x.id === id);
      if (!s) { toast("Esa copia ya no está"); return; }
      let data = null;
      try { data = JSON.parse(s.data); } catch { toast("Copia rota"); return; }
      openModal("Restaurar copia", `<p>Se sustituyen los datos actuales por la copia del <b>${new Date(s.t).toLocaleString("es-ES")}</b> (${s.n} elementos).</p>
        <p class="hint">Tus datos de ahora se guardan como copia de seguridad antes de restaurar.</p>`, {
        confirm: "Restaurar", danger: true,
        onSubmit() {
          if (Aula.pushUndo) Aula.pushUndo();
          const nuevo = Aula.sanitize ? Aula.sanitize(data) : data;
          Object.keys(st()).forEach((k) => delete st()[k]);
          Object.assign(st(), nuevo);
          closeModal(); save(); render(); toast("Copia restaurada (puedes deshacer)");
        },
      });
    }
    if (action === "guest-on") {
      openModal("Modo invitado", `<p>Sirve para dejar el móvil a alguien sin que toque tus datos: <b>nada de lo que se haga se guarda</b> y al recargar vuelve todo como estaba.</p>
        <p class="hint">Si sales de invitado, los cambios de esa sesión se guardan.</p>`, {
        confirm: "Entrar como invitado",
        onSubmit() { st().settings.guest = true; closeModal(); toast("Invitado: no se guarda nada"); render(); },
      });
    }
    if (action === "guest-off") {
      st().settings.guest = false;
      save(); toast("Saliendo de invitado"); render();
    }
    if (action === "csv-import") document.getElementById("csv-file")?.click();
    if (action === "export-md") {
      const mdAll = st().notes.map((n) => `# ${n.title}\n\n${n.content || ""}`).join("\n\n---\n\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([mdAll], { type: "text/markdown" }));
      a.download = "aula-apuntes.md"; a.click();
    }
    if (action === "export-anki") {
      const rows = st().cards.map((c) => `"${(c.front || "").replace(/"/g, '""')}","${(c.back || "").replace(/"/g, '""')}"`).join("\n");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([rows], { type: "text/csv" }));
      a.download = "aula-fichas.csv"; a.click();
      toast("CSV para Anki (importar como básico)");
    }
    if (action === "export-pdf-notes") window.print();
    if (action === "note-tpl") {
      openModal("Plantilla de apunte", `<div class="field"><label>Plantilla</label>
        <select name="tpl">
          <option value="std">Conceptos / Dudas / Ejemplos</option>
          <option value="prac">Práctica de taller</option>
          <option value="red">Servicio de red</option>
        </select></div>`, {
        confirm: "Aplicar",
        onSubmit(data) {
          const body = {
            std: "# Título\n\n## Conceptos clave\n- \n\n## Dudas\n- \n\n## Ejemplos\n- ",
            prac: "# Práctica\n\n## Objetivo\n\n## Material\n\n## Pasos\n1. \n\n## Resultado\n\n## Problemas",
            red: "# Servicio\n\n## Puerto / protocolo\n\n## Instalación\n\n## Configuración\n\n## Prueba\n\n## Seguridad",
          }[data.tpl] || "";
          const n = st().notes.find((x) => x.id === Aula.noteId) || st().notes[0];
          if (n) { n.content = (n.content || "") + (n.content ? "\n\n" : "") + body; n.updatedAt = Date.now(); }
          closeModal(); save(); render();
        },
      });
    }
    if (action === "note-photo") {
      const inp = document.createElement("input");
      inp.type = "file"; inp.accept = "image/*";
      inp.onchange = async () => {
        const f = inp.files[0]; if (!f) return;
        const n = st().notes.find((x) => x.id === (Aula.noteId || st().notes[0]?.id));
        if (!n) { toast("Abre una nota primero"); return; }
        toast("Preparando la foto…");
        const data = await shrinkImage(f, 1280, 0.72).catch(() => null);
        if (!data) { toast("No se ha podido leer la imagen"); return; }
        n.attachments = n.attachments || [];
        // La foto va al almacén de archivos (IndexedDB): el estado solo guarda su ficha
        const att = { id: uid(), name: f.name || "foto.jpg", kind: "img", size: Math.round(data.length * 0.75) };
        const media = window.AulaMedia;
        if (media && media.available()) {
          try {
            await media.put(att.id, data);
          } catch {
            att.data = data;                     // si falla el almacén, se guarda como antes
          }
        } else {
          att.data = data;
        }
        // Solo importa si la foto acaba dentro del estado (sin almacén de archivos)
        if (att.data && att.size > 1_400_000) { toast("La foto es muy grande para guardarla dentro: prueba con otra más pequeña"); return; }
        n.attachments.push(att);
        n.content = (n.content || "").replace(/\s*$/, "") + `\n\n![${att.name}](aula-img:${att.id})\n`;
        save(); render();
        toast(att.data ? "Foto añadida (dentro del estado)" : "Foto guardada en el almacén de archivos");
      };
      inp.click();
    }
    if (action === "rollover-week") {
      const s = st();
      s.progress = s.progress || {};
      openModal("Empezar semana nueva", `<p>Se cierra la semana actual, el contador vuelve a cero y recibes un comodín si te queda alguno.</p>
        <p class="hint">Tus sesiones, apuntes, fichas y notas no se tocan.</p>`, {
        confirm: "Empezar semana",
        onSubmit() {
          s.progress.weekStart = todayISO();
          s.progress.lastWeek = s.progress.lastWeek || "";
          if ((s.progress.freeze || 0) < 1) s.progress.freeze = 1;
          closeModal(); save(); render(); toast("Semana nueva: a por ella");
        },
      });
    }
    if (action === "note-lock") {
      const pin = st().settings.pin;
      if (!pin) { toast("Antes pon un PIN en Ajustes"); return; }
      const n = st().notes.find((x) => x.id === Aula.noteId) || st().notes[0];
      if (!n) return;
      n.locked = !n.locked;
      if (!n.locked && Aula.unlockNote) Aula.unlockNote(n.id);
      toast(n.locked ? "Nota protegida con PIN" : "Nota sin protección");
      save(); render();
    }
    if (action === "note-hist") {
      const n = st().notes.find((x) => x.id === Aula.noteId) || st().notes[0];
      if (!n || !(n.versions || []).length) { toast("Sin versiones"); return; }
      openModal("Versiones", n.versions.map((v, i) => `<button class="btn" style="width:100%;margin:4px 0" data-action="note-ver" data-i="${i}">${new Date(v.t).toLocaleString("es-ES")} · ${(v.title || "").slice(0, 40)}</button>`).join(""), { confirm: "Cerrar", onSubmit: closeModal });
    }
    if (action === "note-ver") {
      const n = st().notes.find((x) => x.id === Aula.noteId) || st().notes[0];
      const v = n && n.versions && n.versions[Number(btn.dataset.i)];
      if (v) { n.title = v.title; n.content = v.content; closeModal(); save(); render(); }
    }
    if (action === "card-mode") {
      st()._cardMode = btn.dataset.mode === "type" ? "type" : "flip";
      toast(st()._cardMode === "type" ? "Escribe la respuesta y pulsa Comprobar" : "Pulsa la ficha para voltearla");
      render();
    }
    if (action === "card-typed") {
      const inp = document.getElementById("card-typed");
      const ans = ((inp && inp.value) || "").trim().toLowerCase();
      const cur = (Aula.cardQueue && Aula.cardQueue[0]) || st().cards.filter((c) => !c.due || c.due <= todayISO())[0];
      if (!cur) return;
      const ok = !!ans && cur.back.toLowerCase().includes(ans);
      toast(ok ? "¡Correcto!" : "Era: " + cur.back);
      if (ok) grantXP(8, "Ficha escrita");
      checkAchievements();
      // Y pasa a la siguiente: antes la ficha se quedaba ahí para siempre.
      if (typeof Aula.gradeCard === "function") Aula.gradeCard(ok ? 4 : 0);
      else render();
    }
    if (action === "freeze-use") {
      const p = st().progress;
      const wk = weekRange().from;
      if ((p.freeze || 0) < 1) { toast("Sin comodines"); return; }
      if (p.lastFreezeWeek === wk) { toast("Ya usaste el de esta semana"); return; }
      p.freeze -= 1; p.lastFreezeWeek = wk;
      const y = new Date(); y.setDate(y.getDate() - 1);
      st().sessions.push({ id: uid(), subjectId: (st().subjects[0] || {}).id, date: localISO(y), minutes: 1, type: "freeze" });
      toast("Comodín: racha salvada"); save(); render();
    }
  }

  document.addEventListener("change", (e) => {
    if (!window.Aula) return;
    if (e.target.id === "csv-file" && e.target.files[0]) {
      const r = new FileReader();
      r.onload = () => {
        let n = 0;
        const fallos = [];
        String(r.result).replace(/^\uFEFF/, "").split(/\r?\n/).forEach((line, i) => {
          const p = line.split(/\t|[,;]/).map((x) => x.trim().replace(/^"|"$/g, ""));
          if (!p.length || !p[0] || /^d[ií]a$/i.test(p[0])) return;   // cabecera o línea vacía
          if (p.length < 4) { fallos.push("línea " + (i + 1)); return; }
          const day = DAYS().findIndex((d) => d.toLowerCase().slice(0, 3) === p[0].toLowerCase().slice(0, 3));
          const sub = st().subjects.find((s) => s.name.toLowerCase().includes(p[1].toLowerCase()))
            || st().subjects.find((s) => p[1].toLowerCase().includes(s.name.toLowerCase().split(" ")[0]));
          const hhmm = (v) => (/^\d{1,2}:\d{2}$/.test(v) ? v : "");
          if (day < 0) { fallos.push("día raro en la línea " + (i + 1)); return; }
          if (!sub) { fallos.push("módulo desconocido '" + p[1] + "' (línea " + (i + 1) + ")"); return; }
          st().events.push({ id: uid(), subjectId: sub.id, day, start: hhmm(p[2]) || "09:00", end: hhmm(p[3]) || "10:00", room: p[4] || "", type: "clase" });
          n++;
        });
        save(); render();
        if (n) toast(n + " clases importadas");
        else {
          openModal("No se ha importado nada", `<p>Formato esperado, una línea por clase:</p><pre>Día,Módulo,Inicio,Fin,Aula</pre>
            <p class="hint">Los módulos deben coincidir con los nombres de tus módulos. Ejemplo: <b>Lunes,Servicios en red,08:00,10:00,A12</b></p>
            <div class="hint">${esc(fallos.slice(0, 5).join(" · ")) || "No he encontrado ninguna línea con datos."}</div>`, { confirm: "Entendido", onSubmit: closeModal });
        }
      };
      r.readAsText(e.target.files[0]);
    }
  });

  window.AulaStudio = {
    agenda, chatbot, habits, glossary,
    examode, quickreview, admin, click, todayStudyHint, hoyISO, dayInfo, esLectivo, bloquesDe,
    // Herramientas que también viven en la sección de utilidades (buscador global)
    toolCatalog() {
      const out = [];
      if (!window.AulaTools || typeof window.AulaTools.catalog !== "function") return out;
      try {
        window.AulaTools.catalog().forEach((x) => out.push({
          title: x.title,
          run: () => { st()._tool = x.id; Aula.go("tools"); if (window.AulaTools.click) window.AulaTools.click("tool-open", { dataset: { id: x.id } }); },
        }));
      } catch {}
      return out;
    },
  };
})();
