(() => {
  "use strict";
  const A = () => window.Aula;
  const st = () => A().state;
  function api() { return A(); }
  const F = (k) => A()[k];
  const esc = (s) => F("esc")(s);
  const uid = () => F("uid")();
  const todayISO = () => F("todayISO")();
  const daysUntil = (d) => F("daysUntil")(d);
  const fmtDate = (d) => F("fmtDate")(d);
  const fmtDateLong = (d) => F("fmtDateLong")(d);
  const fmtHours = (m) => F("fmtHours")(m);
  const subjectName = (id) => F("subjectName")(id);
  const subjectColor = (id) => F("subjectColor")(id);
  const minutesOf = (t) => F("minutesOf")(t);
  const weekdayMon0 = (d) => F("weekdayMon0")(d);
  const DAYS = () => F("DAYS");
  const DAYS_SHORT = () => F("DAYS_SHORT");
  const pad = (n) => F("pad")(n);
  const clamp = (n,a,b) => F("clamp")(n,a,b);
  const localISO = (d) => F("localISO")(d);
  const weekRange = () => F("weekRange")();
  const $ = (s) => F("$")(s);
  const openModal = (a,b,c) => F("openModal")(a,b,c);
  const closeModal = () => F("closeModal")();
  const toast = (m) => F("toast")(m);
  const save = () => F("save")();
  const render = () => F("render")();
  const go = (v) => F("go")(v);
  const md = (s) => F("md")(s);
  const grantXP = (n,r) => F("grantXP")(n,r);
  const checkAchievements = () => F("checkAchievements")();
  const subjectOptions = (s) => F("subjectOptions")(s);
  const nextExam = () => F("nextExam")();

  function busyWeeks() {
    const map = {};
    st().exams.forEach((e) => {
      if (!e.date) return;
      const d = new Date(e.date + "T00:00:00");
      const mon = new Date(d); mon.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      const key = localISO(mon);
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }

  function freeSlots(day) {
    const startH = Number(st().settings.startHour) || 8;
    const endH = Number(st().settings.endHour) || 21;
    const evs = st().events.filter((e) => e.day === day).sort((a, b) => a.start.localeCompare(b.start));
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
    const nx = nextExam();
    if (!nx) return "Sin examen cerca: ficha 15 min o avanza un tema.";
    const d = daysUntil(nx.date);
    return `Hoy: ${d <= 2 ? "urgencia" : "avance"} de ${subjectName(nx.subjectId)} (${nx.title}, ${d} d).`;
  }

  function parseGuideText(text) {
    const dates = [];
    const re = /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/g;
    let m;
    while ((m = re.exec(text))) {
      const y = m[3].length === 2 ? "20" + m[3] : m[3];
      const iso = `${y}-${pad(m[2])}-${pad(m[1])}`;
      const around = text.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, " ");
      dates.push({ iso, around, keep: true });
    }
    const weights = [];
    const wr = /(\d{1,3})\s?%\s*([A-Za-zÁÉÍÓÚáéíóúñÑ ]{3,40})/g;
    while ((m = wr.exec(text))) weights.push({ pct: Number(m[1]), label: m[2].trim(), keep: true });
    const att = /(\d{1,2})\s?%\s*(faltas|asistencia)/i.exec(text);
    const min = /nota m[ií]nima[^\d]{0,12}(\d(?:[.,]\d)?)/i.exec(text);
    return {
      dates: dates.slice(0, 20),
      weights: weights.slice(0, 12),
      attendanceMax: att ? Number(att[1]) : "",
      minGrade: min ? min[1].replace(",", ".") : "",
    };
  }

  function extractPdfStrings(buf) {
    const u8 = new Uint8Array(buf);
    let s = "";
    for (let i = 0; i < u8.length; i++) {
      const c = u8[i];
      s += (c >= 32 && c < 127) ? String.fromCharCode(c) : " ";
    }
    return s.replace(/[ \t]{2,}/g, " ");
  }

  function agenda() {
    const tab = st()._agendaTab || "dia";
    const cursor = st()._agendaDay || todayISO();
    const d = new Date(cursor + "T00:00:00");
    const busy = busyWeeks();
    const tabs = [["dia", "Día"], ["semana", "Semana"], ["mes", "Mes"]];
    let body = "";
    if (tab === "dia") {
      const wd = weekdayMon0(d);
      const classes = st().events.filter((e) => e.day === wd).sort((a, b) => a.start.localeCompare(b.start));
      const exams = st().exams.filter((e) => e.date === cursor);
      const tasks = st().tasks.filter((t) => t.due === cursor);
      const gaps = freeSlots(wd);
      body = `<p class="hint">${esc(todayStudyHint())}</p>
        <h3>Clases</h3>${classes.map((e) => `<div class="row"><span class="dot" style="background:${subjectColor(e.subjectId)}"></span><div>${esc(subjectName(e.subjectId))}</div><div class="meta">${e.start}–${e.end}</div></div>`).join("") || "<div class='empty'>Sin clases.</div>"}
        <h3>Exámenes / entregas</h3>${exams.map((e) => `<div class="row"><b>${esc(e.title)}</b><div class="meta">${e.time || ""}</div></div>`).join("") || "<p class='muted'>Ninguno.</p>"}
        <h3>Tareas</h3>${tasks.map((t) => `<div class="task"><div class="tt">${esc(t.title)}</div></div>`).join("") || "<p class='muted'>Ninguna.</p>"}
        <h3>Huecos para estudiar</h3>${gaps.map((g) => `<div class="row"><div>${g.start}–${g.end}</div><button class="btn btn-sm" data-action="slot-study" data-day="${wd}" data-start="${g.start}" data-end="${g.end}">Bloquear estudio</button></div>`).join("") || "<p class='muted'>Día lleno.</p>"}`;
    } else if (tab === "semana") {
      const mon = new Date(d); mon.setDate(d.getDate() - weekdayMon0(d));
      const days = Array.from({ length: 7 }, (_, i) => {
        const x = new Date(mon); x.setDate(mon.getDate() + i);
        return localISO(x);
      });
      body = `<div class="week-agenda">${days.map((iso, i) => {
        const exams = st().exams.filter((e) => e.date === iso);
        const n = exams.length;
        return `<div class="wa-day ${iso === todayISO() ? "today" : ""} ${n >= 2 ? "hot" : ""}">
          <b>${DAYS()[i] || DAYS_SHORT()[i]} ${iso.slice(8)}</b>
          ${st().events.filter((e) => e.day === i).map((e) => `<div class="wa-ev" style="border-left:3px solid ${subjectColor(e.subjectId)}">${e.start} ${esc(subjectName(e.subjectId))}</div>`).join("")}
          ${exams.map((e) => `<div class="wa-ex">EX ${esc(e.title)}</div>`).join("")}
        </div>`;
      }).join("")}</div>
      <p class="hint">Las semanas en rojo tienen 2+ exámenes (carga alta).</p>`;
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
          const evs = st().exams.filter((e) => e.date === iso);
          return `<div class="cal-day ${iso === todayISO() ? "today" : ""}" data-action="agenda-day" data-date="${iso}"><div class="n">${Number(iso.slice(8))}</div>${evs.map((e) => `<div class="cal-ev" style="background:${subjectColor(e.subjectId)}">${esc(e.title)}</div>`).join("")}</div>`;
        }).join("")}</div>`;
    }
    return `<div class="tabs">
      ${tabs.map(([id, l]) => `<button data-action="agenda-tab" data-tab="${id}" class="${tab === id ? "is-on" : ""}">${l}</button>`).join("")}
      <button class="btn btn-sm" data-action="agenda-prev">‹</button>
      <button class="btn btn-sm" data-action="agenda-next">›</button>
    </div>
    <p><strong>${fmtDateLong(cursor)}</strong></p>
    ${body}`;
  }

  function timeline() {
    const start = st().settings.startDate || todayISO();
    const end = st().settings.endDate || "2027-06-19";
    const a = new Date(start + "T00:00:00").getTime();
    const b = new Date(end + "T00:00:00").getTime();
    const span = Math.max(b - a, 86400000);
    const items = st().exams.slice().sort((x, y) => x.date.localeCompare(y.date));
    return `<div class="card"><p class="hint">Línea del curso ${fmtDate(start)} → ${fmtDate(end)}. Cada barra es un módulo.</p></div>
      ${st().subjects.map((s) => {
        const evs = items.filter((e) => e.subjectId === s.id);
        return `<div class="gantt-row">
          <div class="gantt-lab">${esc(s.name)}</div>
          <div class="gantt-track">
            ${evs.map((e) => {
              const t = new Date(e.date + "T00:00:00").getTime();
              const left = clamp(((t - a) / span) * 100, 0, 96);
              return `<button class="gantt-dot" style="left:${left}%;background:${Aula.safeColor(s.color)}" title="${esc(e.title)}" data-action="edit-exam" data-id="${e.id}">${esc(e.title).slice(0, 18)}</button>`;
            }).join("")}
          </div>
        </div>`;
      }).join("") || `<div class="empty">Añade módulos y fechas.</div>`}
      <p class="hint">FCT / proyecto: crea un examen de tipo Entrega con título «FCT» o «Proyecto».</p>`;
  }

  function kanban() {
    const cols = [
      { id: "todo", name: "Pendiente" },
      { id: "doing", name: "En curso" },
      { id: "done", name: "Entregado" },
    ];
    const tasks = st().tasks.map((t) => {
      const left = t.due ? daysUntil(t.due) : null;          // días que quedan (no la fecha)
      const auto = t.done ? "done" : left != null && left < 0 ? "todo" : left != null && left <= 2 ? "doing" : "todo";
      return { ...t, left, col: t.done ? "done" : (t.kanban || auto) };
    });
    const yesterday = (() => { const d = new Date(); d.setDate(d.getDate() - 1); return localISO(d); })();
    const lateY = st().tasks.filter((t) => !t.done && t.due && t.due <= yesterday);
    return `${lateY.length ? `<div class="card urg-0" style="margin-bottom:12px"><strong>Pendientes de ayer</strong>${lateY.map((t) => `<div class="task"><div class="tt">${esc(t.title)}</div><span>${fmtDate(t.due)}</span></div>`).join("")}</div>` : ""}
      <div class="kanban">
        ${cols.map((c) => `<div class="kan-col"><h3>${c.name}</h3>
          ${tasks.filter((t) => t.col === c.id).sort((a, b) => (a.left == null ? 99 : a.left) - (b.left == null ? 99 : b.left)).map((t) => `<div class="kan-card">
            <b>${esc(t.title)}</b>
            <small>${esc(subjectName(t.subjectId))} · ${t.due ? fmtDate(t.due) : "sin fecha"}${t.left != null && t.left < 0 ? " · atrasada" : t.left === 0 ? " · hoy" : ""}</small>
            <div class="kan-move">
              ${cols.map((x) => `<button class="btn btn-sm ${x.id === t.col ? "btn-primary" : ""}" data-action="kan-move" data-id="${t.id}" data-col="${x.id}">${x.name}</button>`).join("")}
            </div>
            <input type="date" value="${t.due || ""}" data-action="kan-date" data-id="${t.id}" aria-label="Fecha de entrega de ${esc(t.title)}" title="Fecha de entrega" />
          </div>`).join("") || `<div class="empty">Vacío</div>`}
        </div>`).join("")}
      </div>`;
  }

  function localBrain(q) {
    q = (q || "").trim();
    const low = q.toLowerCase();
    if (!q) return "Pregunta por tu semana, un examen o un concepto de tus notas.";
    if (/qu[eé] tengo|esta semana|agenda/.test(low)) {
      const wr = weekRange();
      const ex = st().exams.filter((e) => e.date >= wr.from && e.date <= wr.to);
      const tk = st().tasks.filter((t) => t.due >= wr.from && t.due <= wr.to && !t.done);
      return `Esta semana (${fmtDate(wr.from)}–${fmtDate(wr.to)}):\n- Exámenes: ${ex.map((e) => e.title + " (" + e.date + ")").join("; ") || "ninguno"}\n- Tareas: ${tk.map((t) => t.title).join("; ") || "ninguna"}\n- Consejo: ${todayStudyHint()}`;
    }
    if (/pr[oó]ximo examen|cuando es|cu[aá]ndo/.test(low)) {
      const n = nextExam();
      return n ? `Próximo: ${n.title} el ${fmtDateLong(n.date)} (${daysUntil(n.date)} días).` : "No hay exámenes pendientes.";
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
    return "No encuentro eso en tus apuntes. Prueba palabras del título del tema o configura Ollama en Ajustes (servidor propio).";
  }

  async function askOllama(q) {
    const url = (st().settings.ollamaUrl || "").replace(/\/$/, "");
    if (!url) return localBrain(q);
    const ctx = st().notes.slice(0, 8).map((n) => `# ${n.title}\n${(n.content || "").slice(0, 800)}`).join("\n\n");
    const prompt = `Eres un asistente de estudio de SMR. Responde SOLO con los apuntes y el calendario del alumno. Si no está, dilo.\n\nAPUNTES:\n${ctx}\n\nPREGUNTA: ${q}`;
    // Sin límite de tiempo, un servidor apagado dejaba el chat pensando para siempre
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
    return `<div class="card">
      <p class="hint">Responde con <strong>tus apuntes y tu calendario</strong> (RAG local). Si pones la URL de Ollama en Ajustes, usa tu servidor 24/7. Nunca se llama a APIs de pago.</p>
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

  function simulator() {
    const max = Number(st().settings.gradeMax) || 10;
    const rows = st().subjects.map((s) => {
      const exams = st().exams.filter((e) => e.subjectId === s.id);
      const known = exams.filter((e) => e.grade !== "" && !Number.isNaN(Number(e.grade)));
      const rest = exams.filter((e) => e.grade === "");
      const wKnown = known.reduce((a, e) => a + (Number(e.weight) || 0), 0);
      const pts = known.reduce((a, e) => a + Number(e.grade) * (Number(e.weight) || 0), 0);
      const wLeft = rest.reduce((a, e) => a + (Number(e.weight) || 0), 0) || Math.max(0, 100 - wKnown);
      const need = (target) => {
        if (wLeft <= 0) return null;
        return (target * (wKnown + wLeft) - pts) / wLeft;
      };
      const n5 = need(5), n9 = need(9);
      const warn = n5 != null && n5 > max * 0.85;
      return { s, n5, n9, warn, known, rest, wKnown };
    });
    return `<div class="card"><p class="hint">«¿Qué necesito en lo que falta para aprobar o sacar un 9?». Usa el peso de cada examen.</p></div>
      ${rows.map((r) => `<div class="card ${r.warn ? "urg-0" : ""}">
        <h3>${esc(r.s.name)}</h3>
        <p>Peso ya evaluado: ${r.wKnown}%. ${r.warn ? "<strong>Va justa: el final pide mucho.</strong>" : ""}</p>
        <p>Para aprobar (5): <b>${r.n5 == null ? "—" : r.n5.toFixed(2)}</b> · para un 9: <b>${r.n9 == null ? "—" : r.n9.toFixed(2)}</b></p>
      </div>`).join("")}`;
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

  function trash() {
    const list = st().trash || [];
    return `<div class="card">
      <h3>Papelera de apuntes</h3>
      ${list.map((n) => `<div class="row"><div style="flex:1"><b>${esc(n.title)}</b><small> ${new Date(n.deletedAt).toLocaleString("es-ES")}</small></div>
        <button class="btn btn-sm" data-action="trash-restore" data-id="${n.id}">Restaurar</button>
        <button class="btn btn-sm btn-danger" data-action="trash-kill" data-id="${n.id}">Borrar</button></div>`).join("") || "<div class='empty'>Vacía.</div>"}
    </div>`;
  }

  function examode() {
    const notes = st().notes.slice(0, 8);
    return `<div class="card">
      <h3>Modo examen</h3>
      <p>Solo lectura, temporizador y sin captura. Ideal en el aula.</p>
      <div class="hero-actions">
        <button class="btn btn-primary" data-action="examode-on">Activar 90 min</button>
        <button class="btn" data-action="examode-off">Desactivar</button>
      </div>
      <div class="preview" style="margin-top:12px">${notes.map((n) => `<h3>${esc(n.title)}</h3>${md(n.content || "")}`).join("") || "No hay apuntes."}</div>
    </div>`;
  }

  function quickreview() {
    const nx = nextExam();
    const sid = nx?.subjectId || (st().subjects[0] || {}).id;
    const notes = st().notes.filter((n) => n.subjectId === sid).slice(0, 3);
    const cards = st().cards.filter((c) => c.subjectId === sid).slice(0, 6);
    return `<div class="card">
      <h3>Repaso rápido ${nx ? "· " + esc(nx.title) : ""}</h3>
      <p class="hint">${esc(todayStudyHint())}</p>
      <button class="btn btn-primary" data-action="go" data-to="cards">Fichas</button>
      <button class="btn" data-action="go" data-to="chatbot">Preguntar al asistente</button>
      <button class="btn" data-action="sheet-print">Chuleta imprimible</button>
    </div>
    <div class="card"><h3>Resumen</h3>${notes.map((n) => `<h4>${esc(n.title)}</h4><div class="preview">${md((n.content || "").split("\n").slice(0, 12).join("\n"))}</div>`).join("") || "Sin notas de este módulo."}</div>
    <div class="card"><h3>Fichas</h3>${cards.map((c) => `<div class="row"><b>${esc(c.front)}</b> — ${esc(c.back)}</div>`).join("") || "Sin fichas."}</div>`;
  }

  function admin() {
    const last = localStorage.getItem("aula.lastBackup") || "nunca";
    const snaps = JSON.parse(localStorage.getItem("aula.snaps") || "[]");
    return `<div class="card">
      <h3>Servidor propio (opcional)</h3>
      <p class="hint">La app ya funciona 100 % en el móvil. Si montas <code>python3 server.py</code> en casa (o un VPS/Tailscale), web y móvil pueden sincronizar. Sin nubes de terceros.</p>
      <div class="field"><label>URL del servidor</label><input id="sync-url" placeholder="http://192.168.1.10:8080 o https://aula.casa" value="${esc(st().settings.syncUrl || "")}" /></div>
      <div class="field"><label>PIN</label><input id="sync-pin" placeholder="opcional" value="${esc(st().settings.syncPin || "")}" /></div>
      <div class="hero-actions">
        <button class="btn btn-primary" data-action="sync-save">Guardar URL</button>
        <button class="btn" data-action="sync-pull">Bajar estado</button>
        <button class="btn" data-action="sync-push">Subir estado</button>
        <button class="btn" data-action="sync-ping">Probar /api/health</button>
      </div>
      <p>Último backup local: <b>${esc(last)}</b></p>
      <div class="hero-actions">
        <button class="btn" data-action="snap-now">Punto de restauración</button>
      </div>
      ${snaps.map((s) => `<div class="row"><div>${new Date(s.t).toLocaleString("es-ES")} · ${s.n} ítems</div>
        <button class="btn btn-sm" data-action="snap-load" data-id="${s.id}">Restaurar</button></div>`).join("")}
    </div>
    <div class="card">
      <h3>Ollama (local, 24/7)</h3>
      <p class="hint">Modelo ligero en el servidor, no en la GPU del PC de estudio. Vacío = solo asistente local sin red.</p>
      <div class="field"><label for="set-ollama">URL Ollama</label><input id="set-ollama" value="${esc(st().settings.ollamaUrl || "")}" placeholder="http://192.168.1.10:11434" /></div>
      <div class="field"><label for="set-omodel">Modelo</label><input id="set-omodel" value="${esc(st().settings.ollamaModel || "llama3.2")}" /></div>
      <button class="btn" data-action="ollama-save">Guardar Ollama</button>
    </div>
    <div class="card">
      <h3>Modo invitado</h3>
      <p>Consulta sin guardar (no deja rastro en este navegador).</p>
      <button class="btn" data-action="guest-on">Entrar como invitado</button>
      <button class="btn" data-action="guest-off">Salir</button>
    </div>`;
  }

  function guide() {
    const draft = st()._guide || null;
    return `<div class="card">
      <h3>Importar guía docente</h3>
      <p class="hint">Sube el TXT o MD de la guía (o pega el texto): se buscan fechas, pesos de evaluación y normas con reglas locales, sin enviar nada a internet. Con PDF funciona solo si el texto se puede copiar: el análisis se hace sobre el texto pegado, no sobre el archivo.</p>
      <label for="guide-file" class="sr-only">Archivo de la guía docente</label><input type="file" id="guide-file" accept=".pdf,.txt,.md" aria-label="Archivo de la guía docente" />
      <button class="btn btn-primary" data-action="guide-parse">Analizar</button>
      ${draft ? `<div style="margin-top:14px">
        <h3>Fechas detectadas</h3>
        ${draft.dates.map((d, i) => `<label class="check"><input type="checkbox" data-action="guide-tog" data-k="dates" data-i="${i}" ${d.keep ? "checked" : ""}/> ${d.iso} — ${esc(d.around)}</label>`).join("") || "<p>Ninguna.</p>"}
        <h3>Pesos</h3>
        ${draft.weights.map((w, i) => `<label class="check"><input type="checkbox" data-action="guide-tog" data-k="weights" data-i="${i}" ${w.keep ? "checked" : ""}/> ${w.pct}% ${esc(w.label)}</label>`).join("") || "<p>Ninguno.</p>"}
        <p>Faltas máx.: ${draft.attendanceMax || "—"}% · nota mínima: ${draft.minGrade || "—"}</p>
        <div class="field"><label>Módulo destino</label><select id="guide-sub">${subjectOptions()}</select></div>
        <button class="btn btn-primary" data-action="guide-apply">Aprobar y guardar</button>
      </div>` : ""}
    </div>`;
  }

  function click(action, btn) {
    const Aula = api();
    if (!Aula) return;
    const id = btn.dataset.id;
    if (action === "agenda-tab") { st()._agendaTab = btn.dataset.tab; render(); }
    if (action === "agenda-day") { st()._agendaDay = btn.dataset.date; st()._agendaTab = "dia"; render(); }
    if (action === "agenda-prev" || action === "agenda-next") {
      const cur = new Date((st()._agendaDay || todayISO()) + "T00:00:00");
      cur.setDate(cur.getDate() + (action === "agenda-next" ? 1 : -1) * (st()._agendaTab === "mes" ? 30 : st()._agendaTab === "semana" ? 7 : 1));
      st()._agendaDay = localISO(cur); render();
    }
    if (action === "slot-study") {
      const nx = nextExam();
      st().events.push({ id: uid(), subjectId: nx?.subjectId || (st().subjects[0] || {}).id, day: Number(btn.dataset.day), start: btn.dataset.start, end: btn.dataset.end, room: "Estudio", type: "estudio" });
      grantXP(5, "Bloque de estudio"); checkAchievements(); save(); render(); toast("Hueco reservado");
    }
    if (action === "kan-move") {
      const t = st().tasks.find((x) => x.id === id);
      if (t) { t.kanban = btn.dataset.col; t.done = btn.dataset.col === "done"; if (t.done) grantXP(15, "Entrega"); checkAchievements(); save(); render(); }
    }
    if (action === "kan-date") {
      /* change handler below */
    }
    if (action === "chat-send") {
      const q = ($("#chat-q") || {}).value || "";
      if (!q.trim()) return;
      st()._chat = st()._chat || [];
      st()._chat.push({ role: "user", text: q });
      const finish = (text) => { st()._chat.push({ role: "bot", text }); render(); };
      askOllama(q).then(finish).catch(() => finish(localBrain(q) + "\n\n(Ollama no respondió; usé el motor local.)"));
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
    if (action === "trash-restore") {
      const n = (st().trash || []).find((x) => x.id === id);
      if (n) { delete n.deletedAt; st().notes.unshift(n); st().trash = st().trash.filter((x) => x.id !== id); save(); render(); }
    }
    if (action === "trash-kill") { st().trash = (st().trash || []).filter((x) => x.id !== id); save(); render(); }
    if (action === "examode-on") {
      const hasta = Date.now() + 90 * 60 * 1000;
      st().progress.flags = Object.assign({}, st().progress.flags, { examLockUntil: hasta });
      document.body.classList.add("focus-mode", "exam-lock");
      save();
      toast("Modo examen 90 min (sobrevive al recargar)");
    }
    if (action === "examode-off") {
      st().progress.flags = Object.assign({}, st().progress.flags, { examLockUntil: 0 });
      document.body.classList.remove("exam-lock");
      save(); render();
      toast("Modo examen desactivado");
    }
    if (action === "sheet-print") window.print();
    if (action === "guide-parse") {
      const inp = document.getElementById("guide-file");
      const f = inp && inp.files && inp.files[0];
      if (!f) { toast("Elige un archivo"); return; }
      const reader = new FileReader();
      reader.onload = () => {
        let text = "";
        if (typeof reader.result === "string") text = reader.result;
        else text = extractPdfStrings(reader.result);
        st()._guide = parseGuideText(text);
        render();
      };
      if (/\.pdf$/i.test(f.name)) reader.readAsArrayBuffer(f);
      else reader.readAsText(f);
    }
    if (action === "guide-tog") {
      const draft = st()._guide;
      if (!draft) return;
      const item = draft[btn.dataset.k][Number(btn.dataset.i)];
      if (item) item.keep = !item.keep;
    }
    if (action === "guide-apply") {
      const draft = st()._guide;
      const sid = (document.getElementById("guide-sub") || {}).value;
      if (!draft || !sid) { toast("Elige módulo"); return; }
      const existing = new Set(st().exams.map((e) => e.date + e.title));
      let n = 0;
      draft.dates.filter((d) => d.keep).forEach((d) => {
        const title = (d.around || "Evento guía").slice(0, 60);
        if (existing.has(d.iso + title)) return;
        st().exams.push({ id: uid(), subjectId: sid, title, date: d.iso, time: "09:00", type: "parcial", location: "", notes: "Importado de guía", grade: "", weight: 25, hoursNeeded: 8, status: "pendiente", checklist: [] });
        n++;
      });
      const wsum = draft.weights.filter((w) => w.keep);
      if (wsum.length) {
        st().exams.filter((e) => e.subjectId === sid && e.notes === "Importado de guía").forEach((e, i) => {
          if (wsum[i]) e.weight = wsum[i].pct;
        });
      }
      if (draft.attendanceMax) st().settings.attendanceMax = draft.attendanceMax;
      if (draft.minGrade) st().settings.minPartGrade = draft.minGrade;
      st()._guide = null;
      toast(n + " fechas añadidas");
      save(); render();
    }
    if (action === "sync-save") {
      st().settings.syncUrl = (document.getElementById("sync-url") || {}).value || "";
      st().settings.syncPin = (document.getElementById("sync-pin") || {}).value || "";
      save(); toast("Servidor guardado");
    }
    if (action === "ollama-save") {
      st().settings.ollamaUrl = (document.getElementById("set-ollama") || {}).value || "";
      st().settings.ollamaModel = (document.getElementById("set-omodel") || {}).value || "llama3.2";
      save(); toast("Ollama guardado");
    }
    if (action === "sync-ping" || action === "sync-pull" || action === "sync-push") {
      const base = (st().settings.syncUrl || "").replace(/\/$/, "");
      if (!base) { toast("Pon la URL del servidor"); return; }
      const pin = st().settings.syncPin || "";
      const headers = { "Content-Type": "application/json" };
      if (pin) headers["X-Aula-Pin"] = pin;
      if (action === "sync-ping") {
        fetch(base + "/api/health").then((r) => r.json()).then((j) => toast(j.ok ? "Servidor OK" : "Sin OK")).catch(() => toast("No alcanza el servidor"));
      }
      if (action === "sync-pull") {
        fetch(base + "/api/state", { headers }).then((r) => r.json()).then((j) => {
          if (!j.state || !Object.keys(j.state).length) { toast("El servidor está vacío"); return; }
          const remoto = j.state;
          const resumen = `Servidor: ${(remoto.subjects || []).length} módulos, ${(remoto.exams || []).length} exámenes, ${(remoto.notes || []).length} notas.
Local: ${st().subjects.length} módulos, ${st().exams.length} exámenes, ${st().notes.length} notas.`;
          openModal("Bajar estado del servidor", `<p>${esc(resumen)}</p><p class="hint">Se sustituyen los datos de este móvil. Al cerrar este aviso se guarda una copia local por si acaso.</p>`, {
            confirm: "Bajar y sustituir",
            onSubmit() {
              if (Aula.pushUndo) Aula.pushUndo();
              try {
                const copia = "aula.sync.prev";
                localStorage.setItem(copia, JSON.stringify(st()));
              } catch {}
              // Lo que baja del servidor también puede venir de otra versión: se sanea
              const saneado = Aula.sanitize ? Aula.sanitize(remoto) : remoto;
              Object.assign(st(), saneado);
              closeModal(); save(); render(); toast("Estado bajado (puedes deshacer)");
            },
          });
        }).catch(() => toast("No se puede conectar con el servidor"));
      }
      if (action === "sync-push") {
        fetch(base + "/api/state", { method: "PUT", headers, body: JSON.stringify(st()) })
          .then((r) => r.json()).then((j) => toast(j.ok ? "Subido" : "Error")).catch(() => toast("Error al subir"));
      }
    }
    if (action === "snap-now") {
      let snaps = [];
      try { snaps = JSON.parse(localStorage.getItem("aula.snaps") || "[]"); } catch { snaps = []; }
      const dump = JSON.stringify(st());
      if (dump.length > 900_000) { toast("Los datos ocupan demasiado para una instantánea"); return; }
      const id = uid();
      snaps.unshift({ id, t: Date.now(), n: st().notes.length + st().exams.length + st().tasks.length, data: dump });
      // Antes se guardaban 5 copias completas: con fotos eso llenaba el almacén.
      if (snaps.length > 3) snaps.length = 3;
      try {
        localStorage.setItem("aula.snaps", JSON.stringify(snaps));
        localStorage.setItem("aula.lastBackup", new Date().toLocaleString("es-ES"));
        toast("Punto guardado");
      } catch { toast("No hay espacio para más copias"); }
      render();
    }
    if (action === "snap-load") {
      const snaps = JSON.parse(localStorage.getItem("aula.snaps") || "[]");
      const s = snaps.find((x) => x.id === id);
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
    if (action === "note-tpl") {
      /* noteId exposed on Aula */
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
      const note = st().notes[0];
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
        if (data.length > 1_400_000) { toast("La foto sigue siendo muy grande"); return; }
        n.attachments = n.attachments || [];
        const att = { id: uid(), name: f.name || "foto.jpg", kind: "img", data };
        n.attachments.push(att);
        n.content = (n.content || "").replace(/\s*$/, "") + `\n\n![${att.name}](aula-img:${att.id})\n`;
        save(); render(); toast("Foto añadida a la nota");
      };
      inp.click();
    }
    if (action === "rollover-week") {
      const s = st();
      s.progress = s.progress || {};
      openModal("Empezar semana nueva", `<p>Se cierra la semana actual, el contador vuelve a cero y recibes un comodín si te queda alguno.</p>
        <p class="hint">Tus sesiones, exámenes, fichas y notas no se tocan.</p>`, {
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
      st()._cardMode = btn.dataset.mode;
      toast(btn.dataset.mode === "type" ? "Escribe la respuesta" : btn.dataset.mode === "quiz" ? "Test rápido" : "Empareja");
      render();
    }
    if (action === "card-typed") {
      const inp = document.getElementById("card-typed");
      const ans = ((inp && inp.value) || "").trim().toLowerCase();
      const cur = (Aula.cardQueue && Aula.cardQueue[0]) || st().cards.filter((c) => !c.due || c.due <= todayISO())[0];
      if (!cur) return;
      const ok = ans && cur.back.toLowerCase().includes(ans);
      toast(ok ? "Correcto" : "Era: " + cur.back);
      if (ok) grantXP(8, "Ficha escrita");
      checkAchievements();
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
    if (e.target.dataset.action === "kan-date") {
      const t = st().tasks.find((x) => x.id === e.target.dataset.id);
      if (t) { t.due = e.target.value; save(); toast("Fecha cambiada"); }
    }
  });

  window.AulaStudio = {
    agenda, timeline, kanban, chatbot, simulator, habits, glossary, trash,
    examode, quickreview, admin, guide, click, todayStudyHint, busyWeeks,
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
