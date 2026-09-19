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

  let _chatAbort = null;  // AbortController para cancelar peticiones largas

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
    if (!evs.length) return [];
    // Solo lo que quede entre la primera y la última clase: ni antes de entrar ni después de salir
    const ini = Math.max(startH * 60, minutesOf(evs[0].start));
    const finDia = Math.min(endH * 60, Math.max.apply(null, evs.map((e) => minutesOf(e.end))));
    const gaps = [];
    let cursor = ini;
    evs.forEach((e) => {
      const s = minutesOf(e.start);
      if (s - cursor >= 40) gaps.push({ start: pad(Math.floor(cursor / 60)) + ":" + pad(cursor % 60), end: e.start });
      cursor = Math.max(cursor, minutesOf(e.end));
    });
    if (finDia - cursor >= 40) gaps.push({ start: pad(Math.floor(cursor / 60)) + ":" + pad(cursor % 60), end: pad(Math.floor(finDia / 60)) + ":" + pad(finDia % 60) });
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
      body = `
        <div class="mini-stats">
          <div><b>${bloques.length}</b><small>${bloques.length === 1 ? "bloque" : "bloques"}</small></div>
          ${gaps.length ? `<div><b>${gaps.length}</b><small>huecos libres</small></div>` : ""}
          <div><b>${mins}</b><small>min hoy</small></div>
        </div>
        <div class="card">
          <p class="hint">${esc(todayStudyHint())}</p>
          ${info.kind !== "lectivo" ? `<p class="idle-note">${esc(info.label)} · no hay clase</p>` : ""}
        </div>
        <div class="card">
          <div class="card-head"><h3>Bloques de estudio</h3>${bloques.length ? `<span class="badge">${bloques.length}</span>` : ""}</div>
          ${bloques.length ? bloques.map((e) => `<div class="row">
              <span class="dot" style="background:${subjectColor(e.subjectId)}"></span>
              <div style="flex:1"><b>${esc(subjectName(e.subjectId))}</b>${e.room ? `<small class="hint">${esc(e.room)}</small>` : ""}</div>
              <div class="meta">${e.start}–${e.end}</div>
            </div>`).join("") : `<div class="empty"><b>Nada reservado</b><p>Pilla un hueco libre y dale a «Reservar».</p></div>`}
        </div>
        ${gaps.length ? `<div class="card">
          <div class="card-head"><h3>Huecos libres</h3></div>
          ${gaps.map((g) => `<div class="row"><div class="meta">${g.start}–${g.end}</div>
              <div style="flex:1"></div>
              <button class="btn btn-sm" data-action="slot-study" data-day="${weekdayMon0(d)}" data-start="${g.start}" data-end="${g.end}">Reservar</button></div>`).join("")}
        </div>` : ""}`;
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
          ${inf.kind === "lectivo" ? bloques.map((e) => `<div class="wa-ev">${e.start} ${esc(subjectName(e.subjectId))}</div>`).join("") || `<div class="wa-ev is-soft">Libre</div>`
            : `<div class="wa-ev is-soft">${esc(inf.short)}</div>`}
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
      body = `<div class="cal cal-dense">${DAYS_SHORT().map((x) => `<div class="dow">${x}</div>`).join("")}
        ${cells.map((iso) => {
          if (!iso) return `<div class="cal-day out is-pad"></div>`;
          const inf = dayInfo(iso);
          const bloques = bloquesDe(iso);
          return `<div class="cal-day ${iso === hoyISO() ? "today" : ""} ${inf.kind === "lectivo" ? "" : "out"}" data-action="agenda-day" data-date="${iso}" title="${esc(inf.label || "Clase")}">
            <div class="n">${Number(iso.slice(8))}</div>
            ${bloques.length ? `<div class="cal-ev">${esc(subjectName(bloques[0].subjectId))}</div>` : ""}
            ${inf.kind === "festivo" || inf.kind === "vacaciones" ? `<small class="cal-tag">${esc(inf.short)}</small>` : ""}
          </div>`;
        }).join("")}</div>`;
    }
    return `<div class="agenda-head">
      <div class="hub-seg">
        ${tabs.map(([id, l]) => `<button data-action="agenda-tab" data-tab="${id}" class="${tab === id ? "is-on" : ""}">${l}</button>`).join("")}
      </div>
      <div class="chips-row">
        <span class="chip is-quiet">${esc(fmtDateLong(cursor))}</span>
        ${info.kind === "lectivo" ? "" : `<span class="chip">${esc(info.label)}</span>`}
      </div>
    </div>
    <div class="sec-head"><h3>Tu plan</h3>
      <span class="sec-tools">
        <button class="btn btn-sm" data-action="agenda-prev" aria-label="Anterior">‹</button>
        <button class="btn btn-sm" data-action="agenda-next" aria-label="Siguiente">›</button>
      </span></div>
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

  /* ---- Ollama: hablar con el ordenador de casa ------------------------------------------
     Antes, cualquier fallo acababa en el mismo «Ollama no respondió»: daba igual que Ollama solo
     escuchara en localhost, que el cortafuegos cortara el puerto o que Android no dejara salir
     por http://. Ahora se distingue cada caso y se dice qué hacer. Lo único que sale a la red es
     esto, y solo si tú pones la dirección. */

  function ollamaBase() { return String(st().settings.ollamaUrl || "").trim().replace(/\/+$/, ""); }
  function ollamaModelo() { return st().settings.ollamaModel || "llama3.2"; }
  function esAppAndroid() {
    try { return !!(A().isNativeShell && A().isNativeShell()); } catch { return false; }
  }
  // El puente nativo de Capacitor no pasa por las reglas del navegador (CORS y contenido mixto):
  // si el fetch normal falla en el APK, se reintenta por ahí.
  function pluginNativo() {
    try {
      const http = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp;
      return http && typeof http.request === "function" ? http : null;
    } catch { return null; }
  }

  function conTiempo(promesa, ms) {
    let reloj = null;
    const limite = new Promise((_, rej) => {
      reloj = setTimeout(() => rej(Object.assign(new Error("Se agotó el tiempo"), { tipo: "tiempo" })), ms);
    });
    return Promise.race([promesa, limite]).finally(() => clearTimeout(reloj));
  }

  function tipoDeFallo(e) {
    if (e && e.tipo) return e.tipo;
    const m = String((e && (e.name || e.message)) || e || "");
    if (/abort|tiempo|timeout|tard/i.test(m)) return "tiempo";
    if (/failed to fetch|networkerror|load failed|network|err_|cleartext|cors/i.test(m)) return "sin-llegar";
    return "otro";
  }

  async function porNativo(url, opts, ms) {
    const p = pluginNativo();
    if (!p) return null;
    try {
      const r = await conTiempo(p.request({
        url,
        method: (opts && opts.method) || "GET",
        headers: (opts && opts.headers) || {},
        data: opts && opts.body ? JSON.parse(opts.body) : undefined,
        connectTimeout: ms,
        readTimeout: ms,
      }), ms + 1500);
      const datos = r ? r.data : null;
      return {
        ok: r && r.status >= 200 && r.status < 300,
        status: r ? r.status : 0,
        nativo: true,
        json: async () => (typeof datos === "string" ? JSON.parse(datos) : datos),
        text: async () => (typeof datos === "string" ? datos : JSON.stringify(datos)),
      };
    } catch { return null; }
  }

  // Una petición a Ollama: fetch normal y, si el móvil lo corta, el puente nativo
  async function pedirOllama(ruta, opts = {}, ms = 45000) {
    const url = ollamaBase() + ruta;
    let primero = null;
    try {
      const res = await conTiempo(fetch(url, opts), ms);
      if (res && res.ok) return res;
      primero = res;
      // 4xx/5xx del propio Ollama: no se reintenta por el puente, el problema no es la red
      if (res && res.status && res.status !== 0) return res;
    } catch (e) { primero = e; }
    const nativo = await porNativo(url, opts, ms);
    if (nativo) return nativo;
    throw Object.assign(new Error("No se pudo llegar a " + url), { tipo: tipoDeFallo(primero), url });
  }

  // Texto del estado de Ollama para Ajustes (sin promesas: lo que ya sabemos)
  function textoOllama() {
    return st().settings.ollamaUrl
      ? "Conectado a " + st().settings.ollamaUrl + " (" + (st().settings.ollamaModel || "llama3.2") + "). Si no responde, el chat sigue con el motor local."
      : "Ahora mismo: motor local, sin red.";
  }

  // Pregunta a Ollama qué modelos tienes descargados (lo único que sale a la red)
  async function modelosOllama() {
    const url = ollamaBase();
    if (!url) throw new Error("sin url");
    const r = await pedirOllama("/api/tags", {}, 8000);
    if (!r.ok) throw Object.assign(new Error("Ollama respondió " + r.status), { tipo: "servidor", status: r.status });
    const j = await r.json().catch(() => ({}));
    return (j.models || []).map((m) => String(m.name || m.model || "")).filter(Boolean);
  }

  /* Diagnóstico con nombre y apellidos: qué pasa y qué hacer. Es lo que enseña «Probar conexión»
     y lo que se cuenta en el chat cuando no se puede usar tu modelo. */
  const ARRANQUE_OLLAMA = 'Arranca Ollama en el ordenador para la Wi-Fi: en Windows, abre PowerShell y escribe $env:OLLAMA_HOST="0.0.0.0" antes de "ollama serve" (en Mac o Linux: OLLAMA_HOST=0.0.0.0 ollama serve).';

  async function diagnosticoOllama() {
    const url = ollamaBase();
    if (!url) return { ok: false, titulo: "Sin servidor", texto: "El chat responde con el motor local del móvil. Pon la dirección de Ollama para usar tu modelo.", pasos: [] };
    try {
      const r = await pedirOllama("/api/tags", {}, 8000);
      if (!r.ok) {
        const pistas = r.status === 403 || r.status === 401
          ? ["Ollama está rechazando las peticiones de la app. Reinícialo aceptando cualquier origen: OLLAMA_ORIGINS=*"]
          : ["Ollama ha contestado algo raro en " + url + ". Comprueba la versión: ollama --version"];
        return { ok: false, titulo: "Ollama contestó " + r.status, texto: "La dirección es correcta (algo hay escuchando ahí), pero no da modelos.", pasos: pistas, modelos: [] };
      }
      const j = await r.json().catch(() => ({}));
      const modelos = (j.models || []).map((m) => String(m.name || m.model || "")).filter(Boolean);
      const elegido = ollamaModelo();
      const tiene = modelos.some((m) => m === elegido || m.split(":")[0] === elegido);
      if (!modelos.length) {
        return { ok: true, aviso: true, titulo: "Ollama responde, pero no hay ningún modelo", texto: "En el ordenador no hay modelos descargados.", pasos: ["En el ordenador: ollama pull " + elegido], modelos: [] };
      }
      if (!tiene) {
        return { ok: true, aviso: true, titulo: "El modelo «" + elegido + "» no está descargado", texto: "Ollama responde y tiene " + modelos.length + " modelo(s), pero no el que pide la app.", pasos: ["En el ordenador: ollama pull " + elegido, "O toca uno de los que ya tienes aquí abajo."], modelos };
      }
      return { ok: true, titulo: "Conectado con tu Ollama", texto: "Responde en " + url + " y el modelo «" + elegido + "» está listo." + (r.nativo ? " (Hablando por el puente del móvil.)" : ""), pasos: [], modelos };
    } catch (e) {
      const tipo = tipoDeFallo(e);
      if (tipo === "tiempo") {
        return { ok: false, titulo: "Ollama no contestó a tiempo", texto: "Hay algo en " + url + " pero tardó más de 8 s en decir qué modelos tienes.", pasos: ["Suele ser el ordenador ocupado o dormido. Prueba otra vez."], modelos: [] };
      }
      if (tipo === "servidor") {
        return { ok: false, titulo: "Ollama respondió con un error", texto: String(e && e.message || ""), pasos: ["Mira la ventana de Ollama en el ordenador."], modelos: [] };
      }
      // Una web abierta en https:// no puede pedir nada a un http:// (contenido mixto): eso no se
      // arregla en el ordenador de Ollama, hay que usar la app instalada o abrir la web en http://
      try {
        const navegadorHttps = !esAppAndroid() && location.protocol === "https:" && /^http:/i.test(url);
        if (navegadorHttps) {
          return {
            ok: false,
            titulo: "El navegador no deja salir desde https://",
            texto: "Esta página va por https:// y Ollama está en http:// (" + url + "): el navegador bloquea esa mezcla.",
            pasos: [
              "Lo más fácil: usa la app instalada en el móvil, que no tiene esa limitación.",
              "O abre la web en http:// (por ejemplo http://localhost:8080) en vez de https://.",
            ],
            modelos: [],
          };
        }
      } catch { /* sin location: se sigue con el diagnóstico normal */ }
      const pasos = [
        ARRANQUE_OLLAMA,
        "Comprueba que la dirección es la del ordenador en tu Wi-Fi (la ves con «ipconfig» en Windows, «ip a» en Linux).",
        "Deja pasar el puerto 11434 en el cortafuegos (Windows: permite Ollama en redes privadas).",
      ];
      if (!esAppAndroid()) pasos.push("En el navegador, Ollama tiene que aceptar el origen de la app: OLLAMA_ORIGINS=* al arrancarlo.");
      return { ok: false, titulo: "El móvil no llega a " + url, texto: "La app llamó y nadie contestó." + (esAppAndroid() ? "" : " Si estás en el navegador del ordenador y también falla, mira la Wi-Fi y el cortafuegos."), pasos, modelos: [] };
    }
  }

  // Al pintar la vista, el registro baja solo hasta el último mensaje
  function montarChat() {
    const caja = document.getElementById("chat-log");
    if (caja) caja.scrollTop = caja.scrollHeight;
  }

  // Pinta el resultado del diagnóstico dentro de la hoja de configuración
  function pintarDiagOllama(diag) {
    st()._ollamaOk = !!diag.ok && !diag.aviso;   // lo que dirá el badge del chat
    const estado = document.getElementById("ollama-estado");
    if (estado) estado.textContent = diag.titulo + (diag.texto ? " · " + diag.texto : "");
    const guia = document.getElementById("ollama-guia");
    if (guia && !diag.ok && diag.pasos && diag.pasos.length) guia.open = true;
    const caja = document.getElementById("ollama-chips");
    if (caja) {
      const modelos = diag.modelos || [];
      const elegido = ollamaModelo();
      const otros = modelos.filter((m) => m !== elegido);
      if (!otros.length) { caja.hidden = true; caja.innerHTML = ""; return; }
      caja.hidden = false;
      caja.innerHTML = `<span class="hint">En tu Ollama tienes estos; toca uno para usarlo:</span>` +
        otros.slice(0, 8).map((m) => `<button type="button" class="chip" data-action="ollama-usar" data-id="${esc(m)}">${esc(m)}</button>`).join("");
      const dl = document.getElementById("ollama-modelos");
      if (dl) dl.innerHTML = modelos.map((m) => `<option value="${esc(m)}"></option>`).join("");
    }
  }

  async function askOllama(q) {
    const url = ollamaBase();
    if (!url) return localBrain(q);
    const ctx = st().notes.slice(0, 8).map((n) => `# ${n.title}\n${(n.content || "").slice(0, 800)}`).join("\n\n");
    const prompt = `Eres un asistente de estudio de SMR. Responde SOLO con los apuntes y el calendario del alumno. Si no está, dilo.\n\nAPUNTES:\n${ctx}\n\nPREGUNTA: ${q}`;
    const r = await pedirOllama("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: ollamaModelo(), prompt, stream: false }),
    }, 45000);
    if (!r.ok) {
      if (r.status === 404) throw Object.assign(new Error("modelo no descargado"), { tipo: "modelo", status: 404 });
      throw Object.assign(new Error("Ollama respondió " + r.status), { tipo: "servidor", status: r.status });
    }
    const j = await r.json().catch(() => ({}));
    if (!j || !j.response) throw Object.assign(new Error("respuesta vacía de Ollama"), { tipo: "otro" });
    return j.response;
  }

  function enviarChat() {
    const q = ($("#chat-q") || {}).value || "";
    if (!q.trim()) { toast("Escribe una pregunta"); return; }
    st()._chat = st()._chat || [];
    st()._chat.push({ role: "user", text: q });
    recortarChat();
    render();
    // Indicador de carga: «Pensando...» mientras la IA responde
    const logEl = document.getElementById("chat-log");
    if (logEl) {
      const throb = document.createElement("div");
      throb.className = "chat-msg bot chat-thinking";
      throb.id = "chat-thinking";
      throb.innerHTML = "<b>Aula</b><pre class='hint'>Pensando… <small>(tocar para cancelar)</small></pre>";
      throb.addEventListener("click", () => { throb.remove(); /* user dismissed */ });
      logEl.appendChild(throb);
      logEl.scrollTop = logEl.scrollHeight;
    }
    const finish = (text) => {
      const th = document.getElementById("chat-thinking"); if (th) th.remove();
      st()._chat.push({ role: "bot", text }); recortarChat(); render();
    };
    askOllama(q).then((t) => { st()._ollamaOk = true; finish(t); }).catch(async (e) => {
      st()._ollamaOk = false;
      // Antes era siempre «Ollama no respondió»: ahora se dice qué ha pasado y qué mirar
      const diag = await diagnosticoOllama().catch(() => null);
      const motivo = (e && e.tipo === "modelo")
        ? "Tu Ollama no tiene descargado el modelo «" + ollamaModelo() + "». En el ordenador: ollama pull " + ollamaModelo()
        : diag ? diag.titulo + ". " + diag.texto : "No se pudo hablar con " + ollamaBase() + ".";
      const pasos = diag && diag.pasos && diag.pasos.length ? "\n\nQué mirar:\n" + diag.pasos.map((p, i) => (i + 1) + ". " + p).join("\n") : "";
      // Queda claro quién ha respondido y por qué no ha podido ser tu Ollama
      finish(localBrain(q) + "\n\n—\nRespondió el motor local del móvil.\n" + motivo + pasos);
    });
  }

  /* La config técnica (dirección y modelo) vivía dentro del chat y estorbaba a quien solo quiere
     preguntar. Ahora está detrás del engranaje de la cabecera, en un modal y en un solo sitio. */
  function ollamaCfgHTML() {
    const url = st().settings.ollamaUrl || "";
    const modelo = st().settings.ollamaModel || "llama3.2";
    return `
      <p class="hint">Pon la dirección del ordenador donde tengas Ollama, en la misma Wi-Fi. Ejemplo: <b>http://192.168.1.10:11434</b>. Se guarda solo en este móvil: no hay ninguna nube de por medio.</p>
      <div class="field"><label for="set-ollama">Dirección de Ollama</label><input id="set-ollama" type="url" inputmode="url" value="${esc(url)}" placeholder="http://192.168.1.10:11434" /></div>
      <div class="field"><label for="set-omodel">Modelo</label><input id="set-omodel" list="ollama-modelos" value="${esc(modelo)}" placeholder="llama3.2" /><datalist id="ollama-modelos"></datalist></div>
      <div class="hero-actions">
        <button type="button" class="btn" data-action="ollama-test">Probar conexión</button>
        <button type="button" class="btn" data-action="ollama-modelos">Ver modelos</button>
        ${url ? `<button type="button" class="btn btn-ghost" data-action="ollama-local">Usar solo el local</button>` : ""}
      </div>
      <p class="hint" id="ollama-estado">${esc(textoOllama())}</p>
      <div id="ollama-chips" class="chips-row" hidden></div>
      <details class="chat-cfg" id="ollama-guia">
        <summary>Si no conecta…</summary>
        <p class="hint">Ollama, por defecto, <b>solo atiende a su propio ordenador</b>. Para que el móvil lo vea hay que arrancarlo en la red y dejar pasar el puerto 11434 en el cortafuegos:</p>
        <div class="info-list">
          <div class="info-row"><b>Windows</b><span>PowerShell: <code>$env:OLLAMA_HOST="0.0.0.0"</code> y luego <code>ollama serve</code></span></div>
          <div class="info-row"><b>Mac / Linux</b><span><code>OLLAMA_HOST=0.0.0.0 ollama serve</code></span></div>
          <div class="info-row"><b>Navegador</b><span>Además, que acepte el origen de la app: <code>OLLAMA_ORIGINS=*</code></span></div>
          <div class="info-row"><b>Modelo</b><span><code>ollama pull llama3.2</code> (o el que prefieras)</span></div>
        </div>
        <p class="hint">El móvil tiene que estar en la <b>misma Wi-Fi</b>. La dirección de tu ordenador la ves con <code>ipconfig</code> (Windows) o <code>ip a</code> (Linux).</p>
      </details>`;
  }

  function abrirConfigOllama() {
    const Aula = api();
    if (!Aula || typeof Aula.openModal !== "function") return;
    Aula.openModal("Ollama (IA local)", ollamaCfgHTML(), {
      confirm: "Guardar",
      onSubmit() {
        const campo = document.getElementById("set-ollama");
        if (campo) st().settings.ollamaUrl = campo.value.trim();
        const modelo = document.getElementById("set-omodel");
        if (modelo) st().settings.ollamaModel = modelo.value.trim() || "llama3.2";
        st()._ollamaOk = undefined;   // dirección nueva: hasta probarla, no se sabe nada
        save();
        Aula.closeModal();
        render();
        toast(st().settings.ollamaUrl ? "Ollama guardado" : "Sin dirección: el chat usa el motor local");
      },
    });
  }

  function chatbot() {
    const log = st()._chat || [];
    const url = st().settings.ollamaUrl || "";
    const modelo = st().settings.ollamaModel || "llama3.2";
    const conectado = !!url;
    const atajos = ["¿Qué tengo mañana?", "Resume el tema abierto", "Hazme 5 preguntas de DHCP", "¿Cuándo es el próximo examen?"];
    return `
      <div class="card chat-ia">
        <div class="card-head">
          <div>
            <b>${conectado ? "Tu Ollama" : "Motor local"}</b>
            <div class="hint">${conectado ? esc(url) + " · " + esc(modelo) : "Tus apuntes y tu calendario, sin salir del móvil. Conecta tu Ollama con el engranaje."}</div>
          </div>
          <div class="chat-head-right">
            <span class="badge ${!conectado ? "" : st()._ollamaOk === true ? "done" : st()._ollamaOk === false ? "hot" : ""}">${!conectado ? "Motor local" : st()._ollamaOk === true ? "Conectado" : st()._ollamaOk === false ? "Sin conexión" : "Sin probar"}</span>
            <button type="button" class="icon-btn" data-action="ollama-config" aria-label="Ajustes de Ollama" title="Ajustes de Ollama">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg>
            </button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="chat-log" id="chat-log">${log.map((m) => `<div class="chat-msg ${m.role}"><b>${m.role === "user" ? "Tú" : "Aula"}</b><pre>${esc(m.text)}</pre></div>`).join("") || "<div class='empty'>Prueba con una pregunta o toca un atajo.</div>"}</div>
        <textarea id="chat-q" rows="3" placeholder="¿Qué tengo esta semana? Explica DHCP…"></textarea>
        <div class="chips-row chat-shortcuts">
          ${atajos.map((t) => `<button class="chip" data-action="chat-ask" data-q="${esc(t)}">${esc(t)}</button>`).join("")}
        </div>
        <div class="hero-actions">
          <button class="btn btn-primary" data-action="chat-send">Preguntar</button>
          <button class="btn" data-action="chat-quiz">Test del tema abierto</button>
          <button class="btn" data-action="chat-sum">Resumir nota</button>
          <button class="btn" data-action="chat-map">Esquema</button>
          <button class="btn" data-action="chat-speak">Leer último</button>
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
      ${list.map((g) => `<div class="row"><div style="flex:1"><b>${esc(g.term)}</b><div class="muted">${esc(g.def)}</div>
          ${g.subjectId ? `<small class="row-tag">${esc(subjectName(g.subjectId))}</small>` : ""}</div>
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
      <p class="hint">El chat funciona siempre con el motor local (tus apuntes y tu calendario, sin red). Si además tienes Ollama en tu ordenador, el chat tirará de tu modelo. <b>No hay ninguna nube de por medio.</b></p>
      <div class="row">
        <div><b>${st().settings.ollamaUrl ? "Servidor conectado" : "Sin servidor"}</b>
          <small class="hint">${esc(st().settings.ollamaUrl || "El chat usa el motor local del móvil")}</small></div>
        <button class="btn btn-sm" data-action="ollama-config">Configurar</button>
      </div>
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
    if (action === "chat-ask") {
      const caja = document.getElementById("chat-q");
      if (caja) caja.value = btn.dataset.q || "";
      enviarChat();
    }
    if (action === "chat-send") enviarChat();
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
      window.Aula.ponFoco(true, true);
      save();
      toast("Concentración: 90 min sin distracciones");
    }
    if (action === "examode-off") {
      st().progress.flags = Object.assign({}, st().progress.flags, { examLockUntil: 0 });
      window.Aula.ponFoco(false);      // quita también el foco: si no, la barra de abajo no volvía
      save(); render();
      toast("Modo concentración desactivado");
    }
    if (action === "sheet-print") window.print();
    if (action === "ollama-usar") {
      st().settings.ollamaModel = btn.dataset.id || st().settings.ollamaModel;
      save();
      const campo = document.getElementById("set-omodel");
      if (campo) campo.value = st().settings.ollamaModel;
      toast("Modelo: " + st().settings.ollamaModel);
      render();
      return;
    }
    if (action === "ollama-modelos") {
      const marca = document.getElementById("ollama-estado");
      if (marca) marca.textContent = "Preguntando a Ollama…";
      modelosOllama().then((ms) => {
        const dl = document.getElementById("ollama-modelos");
        if (dl) dl.innerHTML = ms.map((m) => `<option value="${esc(m)}"></option>`).join("");
        const msg = ms.length ? ms.length + " modelo(s): " + ms.slice(0, 4).join(", ") : "Ollama responde, pero no hay modelos descargados";
        if (marca) marca.textContent = msg;
        toast(msg);
      }).catch(async () => {
        const diag = await diagnosticoOllama().catch(() => null);
        const msg = diag ? diag.titulo : "No responde en " + ollamaBase();
        if (marca) marca.textContent = msg;
        if (diag) pintarDiagOllama(diag);
        toast(msg);
      });
    }
    if (action === "ollama-config") abrirConfigOllama();
    if (action === "ollama-save" || action === "ollama-test" || action === "ollama-local") {
      if (action === "ollama-local") {
        st().settings.ollamaUrl = "";
        st()._ollamaOk = undefined;
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
      diagnosticoOllama()
        .then((diag) => {
          pintarDiagOllama(diag);
          render();
          toast(diag.titulo);
        })
        .catch(() => {
          const m = "No se pudo probar " + ollamaBase();
          if (marca) marca.textContent = m;
          toast(m);
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
    // Los exportadores viven en app.js (una sola forma de guardar archivos, que dentro del
    // APK abre la hoja de compartir de Android: ahí las descargas del navegador no existen)
    if (action === "export-md" && Aula.exportMarkdown) Aula.exportMarkdown();
    if (action === "export-anki" && Aula.exportAnki) Aula.exportAnki();
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
      openModal("Versiones", n.versions.map((v, i) => `<button class="btn btn-block mb-8 mt-8" data-action="note-ver" data-i="${i}">${new Date(v.t).toLocaleString("es-ES")} · ${(v.title || "").slice(0, 40)}</button>`).join(""), { confirm: "Cerrar", onSubmit: closeModal });
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
    // Diagnóstico de Ollama (lo usan las pruebas y el propio modal)
    diagnosticoOllama, ollamaBase, ollamaModelo, ollamaCfgHTML, montarChat,
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
  /* Este script se ejecuta DESPUÉS de app.js, que ya ha pintado la vista. Si la app ha arrancado
     directamente en una de estas vistas (por el hash), el primer pintado se encontró con que el
     módulo todavía no existía y salió «Módulo no cargado»: se repinta aquí, ya con todo listo. */
  try {
    const v = (location.hash || "").replace("#", "");
    const mias = ["agenda", "chatbot", "habits", "glossary", "examode", "quickreview", "admin"];
    if (mias.includes(v) && typeof A().render === "function") A().render();
  } catch { /* si aún no está listo, el primer render bueno llegará igual */ }
})();
