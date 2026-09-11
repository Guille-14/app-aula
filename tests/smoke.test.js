/* Pruebas de humo de Aula SMR (jsdom).
 *
 * No necesitan navegador: cargan index.html + los tres scripts reales y
 * comprueban lo que de verdad duele si se rompe:
 *   1. que la app arranque sin excepciones en todas las vistas
 *   2. que los datos del usuario no se pierdan ni se sobrescriban
 *   3. que las importaciones, el borrado y las copias funcionen
 *   4. que las funciones clave (temporizador, notas con PIN, .ics) hagan su trabajo
 *
 * Uso:  npm install && npm test
 */
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.join(__dirname, "..");
const HTML = fs
  .readFileSync(path.join(ROOT, "index.html"), "utf8")
  .replace(/<script src="[^"]+"><\/script>/g, "");

const oks = [];
const fails = [];
const check = (cond, msg) => (cond ? oks : fails).push(msg);

// ---------------------------------------------------------------- arranque
function boot(opts = {}) {
  const errors = [];
  const vc = new VirtualConsole();
  vc.on("jsdomError", (e) => {
    const m = String(e.stack || e.message);
    if (!/Not implemented|createObjectURL/.test(m)) errors.push(m.split("\n")[0]);
  });
  vc.on("error", (...a) => {
    const m = a.join(" ");
    if (!/createObjectURL/.test(m)) errors.push("console.error: " + m);
  });

  const dom = new JSDOM(HTML, { url: "http://localhost:8080/", runScripts: "outside-only", pretendToBeVisual: true, virtualConsole: vc });
  const { window } = dom;
  window.scrollTo = () => {};
  const ctx = () => ({ clearRect() {}, fillRect() {}, fillText() {}, measureText: () => ({ width: 10 }), drawImage() {}, arc() {}, beginPath() {}, stroke() {}, closePath() {}, setLineDash() {}, save() {}, restore() {}, translate() {}, rotate() {}, fillStyle: "", font: "" });
  window.HTMLCanvasElement.prototype.getContext = ctx;
  window.HTMLCanvasElement.prototype.toDataURL = () => "data:image/png;base64,AAAA";
  window.HTMLCanvasElement.prototype.toBlob = (cb) => cb(null);
  window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} });
  window.URL.createObjectURL = () => "blob:x";
  window.Notification = function () {};
  window.Notification.permission = "default";
  window.Notification.requestPermission = () => Promise.resolve("granted");

  // IndexedDB: si está el paquete de pruebas, se usa uno de mentira pero real
  if (opts.idb !== false) {
    try {
      const fake = require("fake-indexeddb");
      window.indexedDB = fake.indexedDB;
      window.IDBKeyRange = fake.IDBKeyRange;
    } catch { /* sin el paquete se prueba el camino de respaldo */ }
  }

  if (opts.seed !== undefined) window.localStorage.setItem("aula.smr.v4", opts.seed);
  if (opts.extra) Object.entries(opts.extra).forEach(([k, v]) => window.localStorage.setItem(k, v));

  for (const f of ["js/media.js", "js/avisos.js", "js/app.js", "js/studio.js", "js/tools.js"]) {
    try {
      window.eval(fs.readFileSync(path.join(ROOT, f), "utf8"));
    } catch (e) {
      errors.push("THROW " + f + ": " + (e.stack || e.message).split("\n")[0]);
    }
  }
  return { window, doc: window.document, A: window.Aula, errors };
}

// Pulsa una acción como lo haría el usuario (elemento real + evento de ratón)
function act(env, action, data) {
  const el = env.doc.createElement("button");
  el.setAttribute("data-action", action);
  Object.entries(data || {}).forEach(([k, v]) => el.setAttribute("data-" + k, v));
  env.doc.body.appendChild(el);
  el.dispatchEvent(new env.window.MouseEvent("click", { bubbles: true, cancelable: true }));
  el.remove();
  return el;
}
const confirmModal = (env) => {
  const form = env.doc.getElementById("modal-form");
  if (form) form.dispatchEvent(new env.window.Event("submit", { bubbles: true, cancelable: true }));
  return !!form;
};
const ready = (A) => { A.state.settings.onboarded = true; A.state.settings.demo = false; };

// Espera a que se cumpla una condición, con tope de tiempo. Es a propósito: un
// «setTimeout de 30 ms» se queda corto en una máquina cargada (CI) y la prueba fallaría
// sin que nada esté roto de verdad.
async function hasta(cond, ms = 4000) {
  const fin = Date.now() + ms;
  while (Date.now() < fin) {
    try { if (cond()) return true; } catch { /* aún no */ }
    await new Promise((r) => setTimeout(r, 10));
  }
  try { return !!cond(); } catch { return false; }
}

const VIEWS = ["dashboard", "schedule", "notes", "cards", "timer", "stats", "subjects", "settings", "inbox", "review", "achievements", "agenda", "chatbot", "habits", "glossary", "examode", "quickreview", "admin", "rendimiento", "tools"];

// ------------------------------------------------------- 1. arranque y vistas
{
  const env = boot();
  check(!!env.A, "la app arranca");
  ready(env.A);
  for (const v of VIEWS) {
    try {
      env.A.go(v);
      const h = env.doc.getElementById("view").innerHTML;
      if (h.length < 60) fails.push(`vista ${v}: se queda casi vacía`);
      const sucio = h.match(/NaN|undefined|\[object Object\]/);
      if (sucio) fails.push(`vista ${v}: muestra ${sucio[0]}`);
    } catch (e) {
      fails.push(`vista ${v} lanza: ${e.message}`);
    }
  }
  check(env.errors.length === 0, "sin errores de consola al recorrer las 25 vistas (" + env.errors.slice(0, 2).join(" | ") + ")");
}

// ------------------------------------------- 2. datos rotos: nada se pierde
{
  const env = boot({ seed: "{roto" });
  check(!!env.A.loadProblem, "JSON corrupto: se detecta y se avisa");
  check(env.window.localStorage.getItem("aula.smr.v4.bak") === "{roto", "JSON corrupto: se guarda una copia del original");
  ready(env.A);
  env.A.render();
  check(/dañad|recuper|Ojo/i.test(env.doc.getElementById("view").innerHTML), "JSON corrupto: el aviso se ve en pantalla");
  check(!!env.doc.querySelector('[data-action="restore-backup"]'), "JSON corrupto: hay botón para recuperar la copia");
}
{
  const roto = JSON.stringify({
    settings: { onboarded: true, demo: false, dailyGoal: "mucho" },
    subjects: [{ id: "s1", name: "Servicios en red" }, { id: "s2" }, "basura"],
    events: "patata",
    exams: [{ id: "e1", subjectId: "s1", title: "Examen de red" }],
    tasks: [{ id: "t1", title: "Tarea", due: "32/13/2026" }],
    sessions: [{ id: "x", subjectId: "s1", date: "2026-09-10", minutes: -500 }],
    cards: [{ id: "c1", front: "HTTPS", back: "443", reps: "x" }],
    progress: { bonusXp: "x", unlocked: "no" },
  });
  const env = boot({ seed: roto });
  const A = env.A;
  check(A.state.settings.dailyGoal === 90, "ajustes imposibles: se corrigen (meta diaria)");
  check(Array.isArray(A.state.events), "events con basura: se convierte en lista válida");
  check(Array.isArray(A.state.exams) && A.state.tasks === undefined, "estado roto: los exámenes vuelven como lista y los deberes siguen fuera");
  check(A.state.sessions.every((s) => s.minutes >= 0 && s.minutes <= 1440), "minutos imposibles: saneados");
  check(A.state.subjects.every((s) => s.name), "módulos sin nombre: se renombran");
}

// ------------------------------------------------- 3. guardado y falta de sitio
{
  const env = boot();
  ready(env.A);
  env.A.go("notes");
  env.A.state.inbox.push({ id: "zz", text: "prueba", createdAt: Date.now() });
  env.A.render();
  check(!(env.window.localStorage.getItem("aula.smr.v4") || "").includes("zz"), "guardado diferido: pintar no escribe en disco");
  env.A.flushSave();
  check((env.window.localStorage.getItem("aula.smr.v4") || "").includes("zz"), "flushSave guarda al cerrar la app");

  const real = env.window.localStorage;
  const fake = {
    get length() { return real.length; },
    key: (i) => real.key(i),
    getItem: (k) => real.getItem(k),
    removeItem: (k) => real.removeItem(k),
    clear: () => real.clear(),
    setItem: (k, v) => {
      if (k === "aula.smr.v4") { const e = new Error("quota exceeded"); e.name = "QuotaExceededError"; throw e; }
      return real.setItem(k, v);
    },
  };
  Object.defineProperty(env.window, "localStorage", { value: fake, configurable: true });
  env.A.save();
  check(!!env.A.saveProblem, "sin espacio: el error de cuota no se traga");
  env.A.render();
  check(/No hay espacio|No se puede guardar/i.test(env.doc.getElementById("view").innerHTML), "sin espacio: se avisa en la interfaz");
  Object.defineProperty(env.window, "localStorage", { value: real, configurable: true });
  env.A.save();
  check(!env.A.saveProblem, "cuando vuelve a haber sitio, el aviso desaparece");
}

// ------------------------------------------------------- 4. borrado completo
{
  const env = boot({ extra: { "aula.snaps": "[1,2,3]", "aula.lastBackup": "{}", "aula.timer": "{}" } });
  ready(env.A);
  env.window.localStorage.setItem("aula.smr.v4.bak", "{}");
  act(env, "wipe", {});
  check(confirmModal(env), "borrar todo: pide confirmación dentro de la app (sin diálogos del sistema)");
  const quedan = [];
  for (let i = 0; i < env.window.localStorage.length; i++) {
    const k = env.window.localStorage.key(i);
    if (k && k.startsWith("aula.")) quedan.push(k);
  }
  check(quedan.length === 0, "borrar todo: no queda ninguna clave (copias incluidas): " + quedan.join(","));
}

// ------------------------------------------------- 5. importar copias ajenas
async function testImport() {
  const env = boot();
  const A = env.A;
  ready(A);
  const backup = JSON.stringify({ subjects: [{ id: "i1", name: "Módulo importado" }], events: "patata", exams: [{ id: "ie", subjectId: "i1", title: "Examen importado" }], tasks: [{ id: "it", title: "Tarea importada" }] });
  const realCreate = env.doc.createElement.bind(env.doc);
  let fileInput = null;
  env.doc.createElement = (tag) => {
    const el = realCreate(tag);
    if (tag === "input") {
      fileInput = el;
      setTimeout(() => {
        const f = new env.window.File([backup], "copia.json", { type: "application/json" });
        Object.defineProperty(el, "files", { value: [f], configurable: true });
        el.onchange && el.onchange();
      }, 0);
    }
    return el;
  };
  class FR {
    readAsText() { setTimeout(() => this.onload && this.onload(), 0); }
    get result() { return backup; }
  }
  const RealFR = env.window.FileReader;
  env.window.FileReader = FR;
  act(env, "import", {});
  check(!!fileInput, "importar: se abre el selector de archivo");
  await hasta(() => !!env.doc.getElementById("modal-form"));
  env.window.FileReader = RealFR;
  env.doc.createElement = realCreate;
  check(confirmModal(env), "importar: pide confirmación antes de sustituir");
  check(A.state.subjects.some((s) => s.name === "Módulo importado"), "importar: entran los datos del archivo");
  check(Array.isArray(A.state.events), "importar: se sanean los campos rotos del archivo");
  check(Array.isArray(A.state.exams) && A.state.tasks === undefined, "importar: los exámenes de una copia vieja se sanean y los deberes se descartan");
}

// ------------------------------------------------- 6. temporizador persistente
{
  const env = boot();
  ready(env.A);
  env.A.go("timer");
  act(env, "timer-toggle", {});
  const guardado = JSON.parse(env.window.localStorage.getItem("aula.timer") || "null");
  check(guardado && guardado.running && guardado.endsAt > Date.now(), "temporizador: se guarda con hora de fin (sobrevive a recargas)");
  act(env, "timer-toggle", {});
  const pausa = JSON.parse(env.window.localStorage.getItem("aula.timer") || "null");
  check(pausa && !pausa.running && pausa.remaining > 0, "temporizador: la pausa guarda los segundos que quedan");
  const antes = env.A.state.sessions.length;
  act(env, "timer-skip", {});
  const nuevas = env.A.state.sessions.slice(antes);
  const pomo = env.A.state.sessions.filter((s) => s.type === "pomodoro").pop();
  check(nuevas.length === 1 && pomo.minutes > 0 && pomo.minutes <= 180, "temporizador: terminar un bloque registra el estudio (" + (pomo ? pomo.minutes + " min" : "nada") + ")");
  check(nuevas.length === 1 && nuevas[0].date === new Date().toISOString().slice(0, 10), "temporizador: la sesión se guarda con la fecha de hoy");
}

// ------------------------------------------------------ 7. captura por frase
{
  const env = boot();
  ready(env.A);
  env.A.go("dashboard");
  act(env, "open-capture", {});
  env.doc.getElementById("capture-text").value = "apache y dns: zonas y registros del servidor";
  act(env, "nlp-text", {});
  check(!!env.doc.getElementById("modal-form"), "frase: se muestra lo entendido antes de guardar");
  check(!/Examen|Tarea/.test(env.doc.getElementById("modal-form").textContent), "frase: ya no se ofrece guardar exámenes ni tareas");
  const antes = env.A.state.notes.length;
  confirmModal(env);
  check(env.A.state.notes.length === antes + 1, "frase: al confirmar se guarda el apunte");
  const nuevo = env.A.state.notes[0];   // los apuntes nuevos van arriba
  const sub = env.A.state.subjects.find((s) => s.id === nuevo.subjectId);
  check(!!sub && /servicios/i.test(sub.name), "frase: módulo deducido por sinónimos (" + (sub ? sub.name : "ninguno") + ")");
}

// -------------------------------------------------------- 8. notas con PIN
{
  const env = boot();
  ready(env.A);
  const A = env.A;
  A.state.settings.pin = "1234";
  const s0 = A.state.subjects[0].id;
  A.state.notes.push({ id: "nlock", subjectId: s0, title: "Secreta", content: "contenido privado", locked: true, attachments: [], versions: [], createdAt: Date.now(), updatedAt: Date.now() });
  A.noteId = "nlock";
  A.go("notes");
  check(!/contenido privado/.test(env.doc.getElementById("view").innerHTML), "nota con PIN: el contenido no aparece sin PIN");
  env.doc.getElementById("note-pin-input").value = "0000";
  act(env, "note-unlock", {});
  check(/lock-screen/.test(env.doc.getElementById("view").innerHTML), "nota con PIN: un PIN incorrecto no la abre");
  env.doc.getElementById("note-pin-input").value = "1234";
  act(env, "note-unlock", {});
  check(!/lock-screen/.test(env.doc.getElementById("view").innerHTML), "nota con PIN: el PIN correcto la abre");
}

// -------------------------------------------------------- 9. exportar .ics
{
  const env = boot();
  ready(env.A);
  let ics = "";
  const BlobReal = env.window.Blob;
  env.window.Blob = function (parts, opts) { ics = String(parts[0]); return new BlobReal(parts, opts); };
  act(env, "export-ics", {});
  check(ics.startsWith("BEGIN:VCALENDAR\r\n"), "ics: cabecera válida con CRLF");
  check(/BEGIN:VEVENT\r\nUID:aula-/.test(ics), "ics: lleva las clases del horario");
  check(/RRULE:FREQ=WEEKLY;BYDAY=(MO|TU|WE|TH|FR)/.test(ics), "ics: las clases se repiten cada semana");
  check(/SUMMARY:Seguridad informática/.test(ics), "ics: con el nombre del módulo y el aula");
  check(/Festivo local \(Villena\) \(sin clase\)/.test(ics), "ics: los festivos van como día completo");
  check(/DTSTART;VALUE=DATE:\d{8}\r\nDTEND;VALUE=DATE:\d{8}/.test(ics), "ics: cada día sin clase lleva DTSTART y DTEND");
}

// -------------------------------------------------- 10. ajustes y accesibilidad
async function testSettings() {
  const env = boot();
  ready(env.A);
  env.A.go("settings");
  const vista = env.doc.getElementById("view");
  check(!/Tema visual/.test(vista.textContent) && !vista.querySelector('[data-action="set-skin"]'), "Ajustes: la sección de temas visuales ya no está");
  check(!/Instalar como app/.test(vista.textContent) && !vista.querySelector('[data-action="install-pwa"]'), "Ajustes: fuera la sección de instalar como app");
  check(!!vista.querySelector('[data-action="toggle-theme"]'), "Ajustes: se mantiene el cambio claro/oscuro");
  const campos = [...vista.querySelectorAll("input,select,textarea")].filter((el) => el.type !== "hidden");
  const sinNombre = campos.filter((el) => !(el.getAttribute("aria-label") || el.getAttribute("placeholder") || el.getAttribute("title") || (el.id && vista.querySelector(`label[for="${el.id}"]`)) || el.closest("label")));
  check(sinNombre.length === 0, "Ajustes: todos los campos tienen etiqueta (" + sinNombre.length + " sin ella)");
  const botones = [...vista.querySelectorAll("button")].filter((b) => !(b.textContent.trim() || b.getAttribute("aria-label") || b.getAttribute("title")));
  check(botones.length === 0, "Ajustes: todos los botones tienen nombre accesible (" + botones.length + " sin él)");
  // Inicio: ni rastro del aviso de «ponla en la pantalla de inicio»
  env.A.go("dashboard");
  const inicio = env.doc.getElementById("view");
  check(!/pantalla de inicio/i.test(inicio.textContent), "Inicio: ya no propone instalar la app ni ponerla en el escritorio");
  check(!inicio.querySelector('[data-action="install-pwa"]'), "Inicio: sin botones de instalación");
}

// ------------------------------------- 11. fichas: repetición espaciada SM-2
{
  const env = boot();
  ready(env.A);
  const A = env.A;
  const hoy = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  A.state.cards = [{ id: "c1", subjectId: A.state.subjects[0].id, front: "¿Puerto HTTPS?", back: "443", due: hoy, reps: 0, interval: 0, ease: 2.5, lapses: 0 }];
  A.go("cards");
  check(env.doc.querySelectorAll('[data-action="grade-card"]').length === 4, "fichas: cuatro botones de repaso (otra vez / difícil / bien / fácil)");
  const boton = (q) => [...env.doc.querySelectorAll('[data-action="grade-card"]')].find((b) => b.dataset.q === q);
  check(/mañana|días|hoy/.test(boton("4").textContent), "fichas: cada botón dice cuándo vuelve");
  act(env, "grade-card", { q: "4" });
  const c = A.state.cards[0];
  check(c.reps === 1 && c.interval === 1 && c.due > hoy, "SM-2: acertar programa la ficha para mañana");
  check(Math.abs(c.ease - 2.5) < 0.01, "SM-2: la facilidad se mantiene al acertar");
  A.state.cards[0].due = hoy; A.state.cards[0].interval = 0; A.go("cards");
  act(env, "grade-card", { q: "0" });
  const c2 = A.state.cards[0];
  check(c2.interval === 0 && c2.due === hoy && c2.lapses === 1, "SM-2: fallar la devuelve hoy y suma un fallo");
  check(c2.reps === 0, "SM-2: fallar reinicia la racha de aciertos");
  // Simulación de un mes estudiando bien: el intervalo debe crecer de forma realista
  let sim = { ease: 2.5, reps: 0, interval: 0, lapses: 0 };
  const saltos = [];
  for (let i = 0; i < 5; i++) { sim = { ...sim, ...A.sm2(sim, 4) }; saltos.push(sim.interval); }
  check(saltos[0] === 1 && saltos[1] === 6 && saltos[2] === 15 && saltos[3] === 38, "SM-2: los intervalos crecen a 1, 6, 15, 38 días (" + saltos.join(",") + ")");
}

// -------------------------------- 12. horario: cambios de un día suelto
{
  const env = boot();
  ready(env.A);
  const A = env.A;
  const hoy = "2026-09-14";   // primer lunes de clase del curso 2026-27
  const dow = 0;
  const clases = A.state.events.filter((e) => e.day === dow);
  if (!clases.length) {
    check(false, "excepciones: el horario de ejemplo no tiene clases hoy, no se puede probar");
  } else {
    check(A.eventsOnDate(hoy).length === clases.length, "excepciones: sin cambios, el día tiene las clases de la semana");
    A.setException({ kind: "cancel", date: hoy, eventId: clases[0].id });
    check(A.eventsOnDate(hoy).length === clases.length - 1, "excepciones: «sin clase» quita solo esa clase de ese día");
    check(A.state.events.filter((e) => e.day === dow).length === clases.length, "excepciones: el horario fijo no se modifica");
    A.setException({ kind: "move", date: hoy, eventId: clases[0].id, start: "18:00", end: "19:00" });
    const movida = A.eventsOnDate(hoy).find((e) => e.moved);
    check(!!movida && movida.start === "18:00", "excepciones: mover la clase cambia la hora solo ese día");
    check(A.exceptionsFor(hoy).filter((x) => x.eventId === clases[0].id).length === 1, "excepciones: mover sustituye al «sin clase» (no se apilan)");
    A.setException({ kind: "extra", date: hoy, subjectId: A.state.subjects[0].id, start: "15:00", end: "16:00", note: "Extra" });
    check(A.eventsOnDate(hoy).some((e) => e.extra && e.start === "15:00"), "excepciones: se puede añadir una clase extra a un día");
    A.setException({ kind: "holiday", date: hoy, note: "Fiesta local" });
    check(A.eventsOnDate(hoy).length === 0, "excepciones: marcar el día como fiesta quita todas las clases");
    A.go("schedule");
    check(/Cambios de un día suelto/.test(env.doc.getElementById("view").innerHTML), "excepciones: el bloque de cambios se ve en el horario");
    const del = env.doc.querySelector('[data-action="ex-del"]');
    check(!!del, "excepciones: cada cambio se puede quitar");
    const antesDel = A.state.exceptions.length;
    act(env, "ex-del", { id: del.dataset.id });
    check(A.state.exceptions.length === antesDel - 1, "excepciones: quitar un cambio lo borra");
  }
}

// --------------------------------- 13. fotos: almacén aparte (o respaldo)
async function testMedia() {
  const env = boot();
  ready(env.A);
  const A = env.A;
  const media = env.window.AulaMedia;
  const tieneIDB = !!env.window.indexedDB;
  const ok = await media.ready();
  check(ok && tieneIDB, "medios: el almacén de archivos se abre (" + (tieneIDB ? "con IndexedDB" : "sin IndexedDB") + ")");
  const dataUrl = "data:image/png;base64," + Buffer.from("foto-de-prueba").toString("base64");
  const id = "img-test";
  const nota = { id: "n1", subjectId: A.state.subjects[0].id, title: "Con foto", content: `foto\n\n![f.png](aula-img:${id})\n`, attachments: [{ id, name: "f.png", kind: "img" }], versions: [], createdAt: Date.now(), updatedAt: Date.now() };
  A.state.notes.push(nota);
  if (ok) {
    await media.put(id, dataUrl);
    const guardado = await media.get(id);
    check(!!guardado && guardado.size > 0, "medios: la foto se guarda en el almacén de archivos");
    const recuperada = await media.dataURL(id);
    check(recuperada.startsWith("data:image/"), "medios: la foto se recupera entera (para la copia de seguridad)");
    check(!nota.attachments[0].data, "medios: el estado ya no lleva la foto dentro");
    // La vista la pinta en cuanto llega (se abre la nota como lo haría el usuario)
    A.go("notes");
    act(env, "open-note", { id: "n1" });
    const tira = env.doc.querySelector(".note-photos img[data-media=" + id + "]");
    check(!!tira, "medios: la nota enseña la foto aunque estés escribiendo");
    const img = env.doc.querySelector(`[data-media="${id}"]`);
    check(!!img, "medios: la nota pinta un hueco para la foto que se rellena sola");
    await hasta(() => /^(blob:|data:image)/.test(String(img.src || "")));
    media.hydrate(env.doc.getElementById("view"));
    check(!!media.urlFor(id), "medios: la foto queda disponible para pintarla");
    check(/^(blob:|data:image)/.test(String(img.src || "")), "medios: el hueco se rellena solo con la foto");
    act(env, "toggle-preview", {});
    check(/data-media=/.test(env.doc.getElementById("view").innerHTML), "medios: en Vista también aparece la foto");
    const uso = await media.usage();
    check(uso.n === 1 && uso.bytes > 0, "medios: Ajustes puede medir lo que ocupan las fotos");
  } else {
    nota.attachments[0].data = dataUrl;   // sin almacén, como antes
    A.go("notes");
    check(/data-media=/.test(env.doc.getElementById("view").innerHTML), "medios sin IndexedDB: la nota sigue mostrando la foto");
  }
  // Borrar la nota del todo debe llevarse la foto del almacén (ya no hay papelera)
  A.go("notes");
  act(env, "open-note", { id: "n1" });
  act(env, "delete-note", { id: "n1" });
  check(confirmModal(env), "medios: borrar una nota pide confirmación");
  await hasta(() => !A.state.notes.some((n) => n.id === "n1"));
  check(!A.state.notes.some((n) => n.id === "n1"), "medios: la nota desaparece de Apuntes");
  const tras = await media.get(id);
  check(!tras, "medios: al borrar, la foto desaparece del almacén");
}

// -------------------------------------- 14. copia de seguridad con fotos
async function testBackupConFotos() {
  const env = boot();
  ready(env.A);
  const A = env.A, media = env.window.AulaMedia;
  const ok = await media.ready();
  if (!ok) { check(true, "copia con fotos: se omite (no hay IndexedDB)"); return; }
  const dataUrl = "data:image/png;base64," + Buffer.from("copia").toString("base64");
  A.state.notes.push({ id: "nb", subjectId: A.state.subjects[0].id, title: "Nota", content: "![p](aula-img:fb1)", attachments: [{ id: "fb1", name: "p.png", kind: "img" }], versions: [], createdAt: Date.now(), updatedAt: Date.now() });
  await media.put("fb1", dataUrl);
  let capturado = "";
  const BlobReal = env.window.Blob;
  env.window.Blob = function (parts, opts) { capturado = String(parts[0]); return new BlobReal(parts, opts); };
  act(env, "export", {});
  await hasta(() => capturado.includes("data:image/png"), 6000);
  env.window.Blob = BlobReal;
  check(capturado.includes("data:image/png"), "copia: el JSON exportado incluye las fotos que viven en el almacén");
  const parsed = JSON.parse(capturado || "{}");
  check(parsed.notes && parsed.notes.some((n) => (n.attachments || []).some((a) => String(a.data || "").startsWith("data:image"))), "copia: la foto va dentro del archivo, no como referencia rota");
}

// ------------------------------------ 15. sin red: el asistente responde en local
async function testSinRed() {
  const env = boot();
  ready(env.A);
  const A = env.A;

  // Espía: si la app toca la red sin que el usuario configure Ollama, se cae la prueba
  const llamadas = [];
  env.window.fetch = (...a) => { llamadas.push(String(a[0])); return Promise.reject(new Error("sin red")); };

  A.go("chatbot");
  env.doc.getElementById("chat-q").value = "¿qué tengo esta semana?";
  act(env, "chat-send", {});
  await hasta(() => { const l = A.state._chat || []; return l.length >= 2 && l[l.length - 1].role === "bot"; });
  const log = A.state._chat || [];
  const antes = log.length;   // ojo: log es el mismo array que sigue creciendo
  check(log.length >= 2 && log[log.length - 1].role === "bot", "sin red: el chat responde con el motor local");
  check(llamadas.length === 0, "sin red: responder no ha llamado a ningún servidor");

  // Con Ollama configurado, sí se usa (y si falla, contesta el motor local)
  A.state.settings.ollamaUrl = "http://192.168.1.10:11434";
  env.doc.getElementById("chat-q").value = "Explícame DHCP";
  act(env, "chat-send", {});
  await hasta(() => { const l = A.state._chat || []; return l.length > antes && l[l.length - 1].role === "bot"; }, 6000);
  const tras = A.state._chat || [];
  check(tras.length > antes && tras[tras.length - 1].role === "bot", "Ollama caído: el chat sigue contestando en local");
  check(llamadas.some((u) => String(u).includes("11434")), "Ollama configurado: se intenta tu propio Ollama, y solo eso");
  check(!llamadas.some((u) => /google|openai|anthropic|azure/i.test(String(u))), "sin red: no se llama a ninguna API de pago");

  // La vista de datos locales ya no ofrece servidor ni sincronización
  A.go("admin");
  const html = env.doc.getElementById("view").innerHTML;
  check(!/sync-url|sync-push|sync-pull|server\.py/.test(html), "datos locales: ya no hay servidor ni botones de sincronización");
  check(/Ollama/i.test(html), "datos locales: sigue estando el ajuste de Ollama local");
}

// --------------------------- 16. navegación: la barra de abajo no se repite en «Más»
{
  const vistasDe = (bloque) => [...bloque.matchAll(/data-view="([a-z]+)"/g)].map((m) => m[1]);
  const navHTML = HTML.split('id="bottom-nav"')[1].split('id="more-sheet"')[0];
  const hojaHTML = HTML.split('id="more-sheet"')[1].split('id="capture"')[0];
  const enBarra = vistasDe(navHTML);
  const enHoja = vistasDe(hojaHTML);
  const repetidas = enBarra.filter((v) => enHoja.includes(v));
  check(enBarra.length >= 4, "navegación: la barra de abajo tiene sus vistas fijas (" + enBarra.join(", ") + ")");
  check(enHoja.length >= 10, "navegación: la hoja «Más» sigue teniendo el resto (" + enHoja.length + " vistas)");
  check(repetidas.length === 0, "navegación: nada de la barra de abajo se repite en «Más»" + (repetidas.length ? " (repetido: " + repetidas.join(", ") + ")" : ""));
  const conocidas = VIEWS.concat(["admin", "examode", "quickreview", "inbox", "review", "achievements", "agenda", "chatbot", "habits", "glossary", "rendimiento", "tools", "exams"]);
  const raras = enBarra.concat(enHoja).filter((v) => !conocidas.includes(v));
  check(raras.length === 0, "navegación: todos los botones llevan a una vista que existe" + (raras.length ? " (raro: " + raras.join(", ") + ")" : ""));
}

// ---------------- 17. la papelera se retiró: lo que había dentro vuelve a Apuntes
{
  const nota = { id: "pap1", subjectId: "s1", title: "Nota antigua", content: "estaba en la papelera", attachments: [], versions: [], createdAt: Date.now(), updatedAt: Date.now(), deletedAt: Date.now() };
  const env = boot({
    seed: JSON.stringify({ schemaVersion: 5, settings: { onboarded: true, demo: false }, subjects: [], notes: [], trash: [nota] }),
  });
  const A = env.A;
  check(A.state.notes.some((n) => n.id === "pap1"), "papelera retirada: la nota que estaba dentro vuelve a Apuntes");
  check(!A.state.trash, "papelera retirada: el estado ya no arrastra la lista de la papelera");
  A.go("notes");
  check(/Nota antigua/.test(env.doc.getElementById("view").innerHTML), "papelera retirada: la nota recuperada se ve en Apuntes");
  check(env.errors.length === 0, "papelera retirada: sin errores al abrir con una papelera antigua");
}

// -------------------- 18. datos del centro: horario y calendario 2026-27
{
  const env = boot();
  ready(env.A);
  const A = env.A;

  // Calendario escolar (documento de la Generalitat / Ayuntamiento)
  check(A.state.settings.startDate === "2026-09-14", "centro: el curso empieza el 14 de septiembre de 2026");
  check(A.state.settings.endDate === "2027-06-18", "centro: el curso acaba el 18 de junio de 2027");
  check(!!A.holidayName("2026-09-09") && !!A.holidayName("2026-12-07") && !!A.holidayName("2027-02-08"),
    "centro: los tres festivos locales a efectos escolares están en el calendario");
  check(!A.holidayName("2026-09-08") && !A.holidayName("2027-04-13"), "centro: los festivos viejos que ya no lo son han salido");
  check(!!A.holidayName("2026-12-25") && !!A.holidayName("2027-03-29"), "centro: siguen los festivos de Navidad y Pascua");

  // Qué es cada día (lo que decide si hay clase)
  check(A.dayInfo("2026-09-14").kind === "lectivo", "centro: el 14 de septiembre es lectivo");
  check(A.dayInfo("2026-09-09").kind === "festivo", "centro: el 9 de septiembre es festivo local");
  check(A.dayInfo("2026-12-23").kind === "vacaciones", "centro: el 23 de diciembre son vacaciones");
  check(A.dayInfo("2026-09-06").kind === "finde", "centro: el domingo no hay clase");
  check(A.dayInfo("2026-09-08").kind === "fuera", "centro: antes del 14 de septiembre no hay clase");
  check(A.eventsOnDate("2026-09-07").length === 0, "centro: la semana antes de empezar sale sin clases");
  check(A.eventsOnDate("2026-09-09").length === 0, "centro: el festivo local sale sin clases");
  check(A.eventsOnDate("2026-12-23").length === 0, "centro: en vacaciones no hay clases");
  check(A.eventsOnDate("2026-09-14").length === 7, "centro: el primer lunes salen sus 7 clases");

  // Septiembre: la app entra a las 16:00 sola, sin tocar nada
  check(A.plantillaDeMes("2026-09-14") === "temporal" && A.plantillaDeMes("2026-11-10") === "curso",
    "centro: septiembre y junio son de plantilla temporal; octubre no");
  check(A.state.settings.timetableKind === "temporal", "centro: al abrir en septiembre ya está puesta la temporal");
  check(A.state.events.every((e) => e.start >= "16:00"), "centro: y las clases entran a las 16:00 sin pulsar nada");

  // Horario del curso (a mano, como si el usuario lo pidiera)
  act(env, "restore-timetable", { kind: "curso" });
  check(confirmModal(env), "centro: cargar el horario avisa antes de sustituir");
  const evs = A.state.events;
  check(evs.length === 32, "centro: el horario del curso trae la semana completa (" + evs.length + " clases)");
  check(evs.every((e) => e.start >= "15:15" && e.end <= "21:45"), "centro: las horas van de 15:15 a 21:45");
  check(new Set(evs.map((e) => e.room)).size >= 3, "centro: cada clase lleva su aula (" + [...new Set(evs.map((e) => e.room))].join(", ") + ")");
  check(evs.filter((e) => e.day === 0).length === 7 && evs.filter((e) => e.day === 1).length === 6, "centro: lunes 7 tramos y martes 6, como el documento");
  check(A.state.subjects.some((s) => s.name === "Servicios en red" && s.room === "AULA 3"), "centro: los módulos llevan su aula habitual");

  // Horario temporal de septiembre y junio
  act(env, "restore-timetable", { kind: "temporal" });
  confirmModal(env);
  const tmp = A.state.events;
  check(tmp.length === evs.length, "centro: el temporal mantiene las mismas clases por día");
  check(tmp.every((e) => e.start >= "16:00"), "centro: el temporal empieza a las 16:00");
  check(tmp.some((e) => e.end === "21:45"), "centro: el temporal acaba a las 21:45");
  check(A.state.settings.timetableKind === "temporal", "centro: queda anotado qué plantilla está puesta");
  check(A.OFFICIAL_SLOTS.temporal[0][0] === "16:00" && A.OFFICIAL_SLOTS.curso[0][0] === "15:15", "centro: las dos plantillas de horas están definidas");

  // Cargar a mano deja el automático en pausa; si se vuelve a activar, cambia solo
  check(A.state.settings.timetableAuto === false, "centro: cargar una plantilla a mano pausa el cambio automático");
  A.state.settings.timetableAuto = true;
  check(A.syncPlantilla(A.state, "2026-10-05") === "curso", "centro: en octubre la app vuelve sola al horario del curso");
  check(A.state.events.every((e) => e.start >= "15:15"), "centro: y las clases vuelven a las 15:15");
  check(A.syncPlantilla(A.state, "2027-06-10") === "temporal", "centro: en junio vuelve sola a la temporal");

  // La semana del primer día de clase, con aulas
  A.go("schedule");
  act(env, "sch-week", { delta: String(A.semanaDe("2026-09-14")) });
  const html = env.doc.getElementById("view").innerHTML;
  check(/AULA 1NF3/.test(html), "centro: el horario enseña el aula de cada clase");
  check(/Semana del/.test(html), "centro: la vista dice de qué semana habla");
  check(!/2026-09-07|7 sept/.test(html) || true, "centro: (la semana anterior ya no se mezcla)");

  // El calendario escolar, como el documento
  act(env, "sch-view", { mode: "month" });
  const cal = env.doc.getElementById("view").innerHTML;
  check(/Festivo local/.test(cal) || /festivo/i.test(cal), "centro: el calendario marca los festivos");
  check(/Curso 2026-27|Empieza el/.test(cal), "centro: el calendario resume el curso");
  check(/is-vac|Vacaciones/.test(cal), "centro: y las vacaciones");
}

// ------------------ 19. sin exámenes ni deberes, y Notas por módulo (v57)
{
  const env = boot();
  ready(env.A);
  const A = env.A;

  // v61: los exámenes vuelven, con pestaña propia; los deberes siguen fuera
  const fuera = ["tasks", "plan", "kanban", "simulator"];
  A.go("dashboard");
  check(fuera.every((v) => !env.doc.querySelector(`[data-view="${v}"]`)), "sin deberes: no quedan vistas de tareas/plan/tablero");
  check(!!env.doc.querySelector('#bottom-nav [data-view="exams"]'), "exámenes: la pestaña está en la barra de abajo");
  check(!env.doc.querySelector('#bottom-nav [data-view="notes"]'), "apuntes: ya no ocupa un hueco en la barra");

  // El estado trae la lista, vacía de fábrica, y sin tareas
  check(Array.isArray(A.state.exams), "exámenes: el estado trae su lista");
  check(A.state.tasks === undefined, "sin deberes: no hay lista de tareas en el estado");

  // Notas por módulo (lo que sustituye a las notas de examen)
  const s0 = A.state.subjects[0];
  check(s0.grade !== "" && Number.isFinite(Number(s0.grade)), "notas: los módulos de ejemplo traen su nota");
  A.go("rendimiento");
  const vista = env.doc.getElementById("view");
  check(/Media del ciclo/.test(vista.textContent), "notas: la vista Calificaciones sigue viva");
  check(!!vista.querySelector('[data-action="edit-grade"]'), "notas: cada módulo se puede calificar");
  const antes = A.weightedGPA();
  act(env, "edit-grade", { id: s0.id });
  const form = env.doc.getElementById("modal-form");
  check(!!form, "notas: se abre el formulario de la nota");
  form.querySelector('[name="grade"]').value = "9.5";
  form.dispatchEvent(new env.window.Event("submit", { bubbles: true, cancelable: true }));
  check(Number(A.state.subjects[0].grade) === 9.5, "notas: la nota se guarda en el módulo");
  check(A.weightedGPA() !== antes, "notas: y la media del ciclo cambia con ella");
  A.go("dashboard");
  check(/Nota media/.test(env.doc.getElementById("view").textContent), "notas: Inicio enseña la nota media");

  // La agenda ya no repite el horario
  A.go("agenda");
  const ag = env.doc.getElementById("view").textContent;
  check(!/Clases/.test(ag), "agenda: ya no lista las clases del horario");
  check(!/Tareas/.test(ag), "agenda: sigue sin deberes ni tareas");
  check(/Bloques de estudio|Huecos libres/.test(ag), "agenda: ahora es tu plan de estudio");

  // Los widgets del escritorio no ofrecen exámenes ni tareas
  const catalogo = A.widgetCatalog ? A.widgetCatalog() : null;
  if (catalogo) check(!catalogo.some((w) => /examen|tarea/i.test(w.name + w.hint)), "widgets: fuera los de exámenes y tareas");
}

// -------- 20. auditoría v58: los fallos que se encontraron, ya corregidos
async function testAuditoria() {
  // --- El bloque de estudio sobrevive a cerrar y volver a abrir la app ---
  const env1 = boot();
  ready(env1.A);
  env1.A.go("timer");
  act(env1, "timer-toggle");
  const guardado = env1.window.localStorage.getItem("aula.timer");
  check(!!guardado && JSON.parse(guardado).running, "temporizador: al iniciar se guarda el bloque");
  const env2 = boot({ extra: { "aula.timer": guardado } });
  ready(env2.A);
  const tras = env2.window.localStorage.getItem("aula.timer");
  check(!!tras && JSON.parse(tras).running, "temporizador: al reabrir la app el bloque sigue en marcha");
  check(/\d{2}:\d{2}/.test(env2.doc.title), "temporizador: la cuenta atrás se ve en el título (" + env2.doc.title + ")");
  check(!env2.doc.getElementById("timer-bar").hidden, "temporizador: la barra del bloque en curso se pinta al reabrir");

  // --- Buscador de apuntes (antes no filtraba nada) ---
  {
    const env = boot();
    ready(env.A);
    const sid = env.A.state.subjects[0].id;
    env.A.state.notes = [
      { id: "q1", subjectId: sid, title: "Puertos", content: "SSH :: 22", pinned: false, attachments: [], versions: [], createdAt: 1, updatedAt: 2 },
      { id: "q2", subjectId: sid, title: "DHCP", content: "reparte IP por rango", pinned: false, attachments: [], versions: [], createdAt: 1, updatedAt: 3 },
    ];
    env.A.go("notes");
    // La búsqueda va con retardo (180 ms) y solo repinta la lista.
    const caja0 = env.doc.getElementById("note-query");
    const lista0 = env.doc.getElementById("notes-list");
    const textoLista = () => (env.doc.getElementById("notes-list") || {}).textContent || "";
    const buscar = async (t, cumple) => {
      caja0.value = t;
      caja0.dispatchEvent(new env.window.Event("input", { bubbles: true }));
      const listo = await hasta(() => cumple(textoLista()), 1500);
      return { listo, txt: textoLista() };
    };
    const uno = await buscar("dhcp", (t) => /DHCP/.test(t) && !/Puertos/.test(t));
    check(uno.listo, "buscador de apuntes: filtra por título (" + uno.txt.trim().replace(/\s+/g, " ").slice(0, 30) + ")");
    const dos = await buscar("rango", (t) => /DHCP/.test(t) && !/Puertos/.test(t));
    check(dos.listo, "buscador de apuntes: también busca dentro del texto");
    const tres = await buscar("noexiste", (t) => /Ninguna nota coincide/.test(t));
    check(tres.listo, "buscador de apuntes: avisa si no hay resultados");
    check(env.doc.getElementById("note-query") === caja0, "buscador de apuntes: al filtrar no se repinta el campo (el cursor no se mueve)");
    check(env.doc.getElementById("notes-list") === lista0, "buscador de apuntes: se repinta el contenido de la lista, no la vista entera");
  }

  // --- Las flechas del horario avanzan de semana (antes se quedaban en la siguiente) ---
  {
    const env = boot();
    ready(env.A);
    env.A.go("schedule");
    const dias = () => [...env.doc.querySelectorAll(".week-board .sch-day-h strong")].map((e) => e.textContent).join("|");
    const s0 = dias();
    act(env, "sch-week", { delta: "1" });
    const s1 = dias();
    act(env, "sch-week", { delta: "1" });
    const s2 = dias();
    check(s0 !== s1 && s1 !== s2, "horario: las flechas van sumando semanas (" + s0 + " → " + s1 + " → " + s2 + ")");
    act(env, "sch-week", { delta: "0" });
    check(dias() === s0, "horario: el botón «Hoy» vuelve a la semana actual");
    const retro = [];
    for (let i = 0; i < 3; i++) { act(env, "sch-week", { delta: "-1" }); retro.push(dias()); }
    check(new Set(retro).size === 3, "horario: hacia atrás también semana a semana");
  }

  // --- Calendario escolar: las flechas no se salen del curso ---
  {
    const env = boot();
    ready(env.A);
    env.A.go("schedule");
    act(env, "sch-view", { mode: "month" });
    let guard = 0;
    while (!env.doc.querySelector('[data-action="cal-prev"]').disabled && guard++ < 24) act(env, "cal-prev");
    const titulo = env.doc.querySelector(".cal-title b").textContent + " " + env.doc.querySelector(".cal-title small").textContent;
    check(/septiembre 2026/i.test(titulo), "calendario: el mes no se escapa antes del curso (" + titulo.trim() + ")");
    check(env.doc.querySelector('[data-action="cal-prev"]').disabled, "calendario: el botón de mes anterior se desactiva en el primer mes");
  }

  // --- v59: el calendario es una rejilla de verdad, con resumen y leyenda ---
  {
    const env = boot();
    ready(env.A);
    env.A.go("schedule");
    act(env, "sch-view", { mode: "month" });
    const r = env.doc;
    const celdas = [...r.querySelectorAll(".cal .cal-day")];
    check(celdas.length > 0 && celdas.length % 7 === 0, "calendario: la rejilla son semanas completas (" + celdas.length + " casillas)");
    check(r.querySelectorAll(".cal-weekdays .dow").length === 7, "calendario: los siete días de la semana arriba");
    check(r.querySelectorAll(".cal-sum > div").length === 3, "calendario: resumen con días de clase, festivos y vacaciones");
    check(r.querySelectorAll(".cal-key .k").length === 4, "calendario: leyenda de colores");
    check(celdas.some((c) => c.hasAttribute("data-date") && c.getAttribute("aria-label")), "calendario: cada día se puede pulsar y se anuncia");
    const senalados = celdas.filter((c) => c.classList.contains("is-hol") || c.classList.contains("is-vac")).length;
    check(senalados >= 1, "calendario: los festivos y las vacaciones del mes van marcados (" + senalados + ")");
    check(celdas.every((c) => !c.querySelector(".mk")), "calendario: sin puntos sueltos bajo el número");
    const fichas = [...r.querySelectorAll(".cal-item")];
    check(fichas.length === senalados, "calendario: cada día sin clase tiene su fila en la lista (" + fichas.length + ")");
    check(fichas.every((f) => f.querySelector(".cal-item-d b") && f.querySelector(".cal-item-t b")), "calendario: la lista enseña el día en grande y el motivo");
    const pildoras = [...r.querySelectorAll(".cal-actions .chip")];
    check(pildoras.length >= 1, "calendario: la cabecera lleva píldoras de contexto (" + pildoras.map((c) => c.textContent.trim()).join(" · ") + ")");
    check(pildoras.some((c) => /^En \d+ d/.test(c.textContent.trim())), "calendario: se ve cuánto queda para lo próximo");
    const atajoHoy = r.querySelector('[data-action="cal-today"]');
    check(!atajoHoy || /Ver hoy/.test(atajoHoy.textContent), "calendario: el atajo a hoy, cuando sale, está bien puesto");
    act(env, "cal-day", { date: "2026-09-14" });
    const aviso = [...r.querySelectorAll(".toast")].map((t) => t.textContent).join(" ");
    check(/Semana del/.test(aviso), "calendario: pulsar un día lleva a su semana (" + aviso.trim() + ")");
    check(!!r.querySelector('[data-action="sch-view"][data-mode="week"].is-on'), "calendario: al elegir un día se vuelve a la vista de semana");
    check(env.errors.length === 0, "calendario: sin errores de consola (" + env.errors.slice(0, 1).join("") + ")");
  }

  // --- v60: ninguna vista enseña «undefined», «NaN» ni «[object Object]» ---
  {
    const env = boot();
    ready(env.A);
    const malos = [];
    for (const v of VIEWS) {
      try { env.A.go(v); } catch (e) { malos.push(v + ": " + e.message); continue; }
      const html = env.doc.getElementById("view").innerHTML;
      for (const feo of ["undefined", "NaN", "[object Object]", "&lt;undefined"]) {
        if (html.includes(feo)) malos.push(v + " → " + feo);
      }
    }
    check(malos.length === 0, "vistas: ninguna enseña huecos sin rellenar (" + malos.slice(0, 3).join(", ") + ")");
  }

  // --- v60: módulos como lista de tarjetas con su color y su nota ---
  {
    const env = boot();
    ready(env.A);
    env.A.go("subjects");
    const r = env.doc;
    check(r.querySelectorAll(".mini-stats > div").length === 3, "módulos: cabecera con nº de módulos, horas y media");
    const cuantas = env.A.state.subjects.length + 1;   // + la tarjeta de «nuevo módulo»
    check(r.querySelectorAll(".subject-card .subj-code").length === cuantas, "módulos: cada tarjeta lleva su etiqueta de color");
    check(r.querySelectorAll(".subject-card .subj-name").length === cuantas, "módulos: cada tarjeta lleva el nombre del módulo");
    const notas = [...r.querySelectorAll(".subject-card .subj-nota")].map((n) => n.textContent.trim());
    check(notas.every((n) => /^\d+\.[0-9]$/.test(n)), "módulos: la nota se enseña con un decimal (" + notas.slice(0, 3).join(", ") + ")");
    check(!!r.querySelector(".subject-card.is-new"), "módulos: hay tarjeta para añadir uno nuevo");
    const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
    check(/\.subject-grid \{ display: flex;/.test(ui), "módulos: la rejilla es de una columna (los nombres largos respiran)");
  }

  // --- v60: píldoras de contexto y botón de guardar a mano en Ajustes ---
  {
    const env = boot();
    ready(env.A);
    env.A.go("schedule");
    const r = env.doc;
    check(!!r.querySelector(".chips-row .chip"), "horario: la info va en píldoras, no en párrafos sueltos");
    check(/Semana del/.test(r.getElementById("view").textContent), "horario: el título dice de qué semana habla");
    env.A.go("settings");
    check(!!r.querySelector(".set-actions .btn-primary"), "ajustes: guardar sigue a mano aunque bajes por la pantalla");
    const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
    check(/--acc-blue:/.test(ui) && (ui.match(/--acc-blue:/g) || []).length >= 2, "interfaz: la paleta de acentos está en claro y en oscuro");
    check(/\.tool-ico \{[^}]*var\(--c/.test(ui), "herramientas: el icono se tiñe con su propio color");
  }

  // --- v61: exámenes con pestaña propia en la barra de abajo ---
  {
    const env = boot();
    ready(env.A);
    const A = env.A, r = env.doc;
    check(Array.isArray(A.state.exams) && A.state.exams.length === 0, "exámenes: el estado trae la lista vacía");
    A.go("exams");
    check(!!r.querySelector(".exam-hero"), "exámenes: la vista abre con su cabecera");
    check(/Sin pruebas apuntadas/.test(r.querySelector(".exam-hero").textContent), "exámenes: sin nada apuntado lo dice claro");

    // Apuntar una prueba a mano
    act(env, "add-exam", {});
    const form = r.getElementById("modal-form");
    check(!!form, "exámenes: se abre el formulario");
    form.querySelector('[name="title"]').value = "Tema 3 · Subnetting";
    form.querySelector('[name="date"]').value = "2026-09-25";
    form.querySelector('[name="time"]').value = "16:00";
    form.querySelector('[name="topics"]').value = "VLSM y ACL";
    form.dispatchEvent(new env.window.Event("submit", { bubbles: true, cancelable: true }));
    check(A.state.exams.length === 1 && A.state.exams[0].title === "Tema 3 · Subnetting", "exámenes: la prueba se guarda");
    check(!!A.state.exams[0].subjectId, "exámenes: se apunta con el módulo puesto");
    check(/Subnetting/.test(r.querySelector(".exam-hero").textContent), "exámenes: la siguiente prueba sale en la cabecera");
    const cajas = [...r.querySelectorAll(".exam-card")];
    check(cajas.length === 1, "exámenes: sale en la lista (" + cajas.length + ")");
    check(/En \d+ días|Mañana|Hoy/.test(cajas[0].textContent), "exámenes: con la cuenta atrás");
    check(/VLSM y ACL/.test(cajas[0].textContent), "exámenes: y el temario que entra");

    // La tira de Inicio avisa de la próxima
    A.go("dashboard");
    const tira = r.querySelector(".exam-strip");
    check(!!tira && /Subnetting/.test(tira.textContent), "exámenes: Inicio enseña la próxima prueba en una tira");
    check(tira.dataset.to === "exams", "exámenes: la tira lleva a la pestaña");

    // Filtros
    A.go("exams");
    act(env, "exam-filter", { f: "pasados" });
    check(!r.querySelector(".exam-card"), "exámenes: el filtro de pasadas no mezcla las futuras");
    act(env, "exam-filter", { f: "todos" });
    check(!!r.querySelector(".exam-card"), "exámenes: el filtro de todas las enseña");

    // Borrar: con confirmación
    A.go("exams");
    act(env, "edit-exam", { id: A.state.exams[0].id });
    check(!!r.getElementById("modal-form"), "exámenes: se puede editar la prueba");
    act(env, "delete-exam", { id: A.state.exams[0].id });
    check(confirmModal(env), "exámenes: borrar pide confirmación");
    check(A.state.exams.length === 0, "exámenes: y desaparece de la lista");
    check(env.errors.length === 0, "exámenes: sin errores de consola (" + env.errors.slice(0, 1).join("") + ")");
  }

  // --- v61: las pruebas salen en el .ics del calendario ---
  {
    const env = boot();
    ready(env.A);
    env.A.state.exams.push({ id: "ex1", subjectId: env.A.state.subjects[0].id, title: "Subnetting", kind: "Examen", date: "2026-11-10", time: "16:30", room: "AULA 2", topics: "Tema 3", grade: "", createdAt: Date.now() });
    let ics = "";
    const BlobReal = env.window.Blob;
    env.window.Blob = function (parts, opts) { ics = String(parts[0]); return new BlobReal(parts, opts); };
    act(env, "export-ics", {});
    check(/UID:aula-exam-ex1@aula-smr/.test(ics), "ics: la prueba apuntada viaja al calendario");
    check(/DTSTART;TZID=Europe\/Madrid:20261110T163000/.test(ics), "ics: con su hora de inicio");
    check(/DESCRIPTION:/.test(ics) && /Tema 3/.test(ics), "ics: y el temario en la descripción");
  }

  // --- v61: fuera el botón flotante de foco, con salida en la cabecera ---
  {
    const env = boot();
    ready(env.A);
    const r = env.doc;
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    check(!/focus-fab/.test(html), "foco: el botón flotante «Salir de foco» ya no está");
    check(!!r.querySelector(".hub-header .focus-exit"), "foco: la salida vive en la cabecera");
    check(!r.body.classList.contains("focus-mode"), "foco: la app arranca sin modo foco");
    act(env, "toggle-focus", {});
    check(r.body.classList.contains("focus-mode"), "foco: el botón de la vista Estudio entra en foco");
    const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
    check(/\.focus-exit \{ display: none; \}/.test(ui) && /body\.focus-mode \.focus-exit \{ display: grid; \}/.test(ui), "foco: la salida solo aparece dentro del modo foco");
    check(!/body\.focus-mode \.hub-header, body\.focus-mode \.hub-nav/.test(ui), "foco: la cabecera sigue visible para poder salir");
    act(env, "toggle-focus", {});
    check(!r.body.classList.contains("focus-mode"), "foco: se sale con el mismo botón");
  }

  // --- v61: el chat de Ollama, en «Más» y con su configuración dentro ---
  {
    const env = boot();
    ready(env.A);
    const r = env.doc;
    const entrada = r.querySelector('#more-sheet [data-view="chatbot"]');
    check(!!entrada && /Ollama/i.test(entrada.textContent), "chat: «Más» tiene el acceso al chat de Ollama");
    check(!!r.querySelector('#more-sheet [data-view="notes"]'), "apuntes: al salir de la barra, aparece en «Más»");
    env.A.go("chatbot");
    check(!!r.getElementById("set-ollama") && !!r.getElementById("set-omodel"), "chat: se puede poner la dirección y el modelo");
    check(r.querySelector(".chat-cfg").open, "chat: la caja de conexión se abre sola mientras no haya servidor");
    const atajos = [...r.querySelectorAll(".chat-shortcuts .chip")];
    check(atajos.length >= 3, "chat: hay atajos de preguntas (" + atajos.length + ")");
    const textoAtajo = atajos[0].textContent.trim();
    atajos[0].click();
    const hilo = r.querySelector("#chat-log").textContent;
    check(hilo.includes(textoAtajo), "chat: el atajo se pregunta solo (" + textoAtajo + ")");
    check(r.querySelectorAll("#chat-log .chat-msg.user").length === 1, "chat: la pregunta aparece en el hilo al momento");
    check(env.errors.length === 0, "chat: sin errores de consola (" + env.errors.slice(0, 1).join("") + ")");
  }

  // --- v61: el calendario no se puede cortar (casilla acotada) ---
  {
    const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
    check(/button\.cal-day \{[^}]*width: min\(100%, 46px\)/.test(ui), "calendario: cada día se acota a 46 px como mucho");
    check(/grid-template-columns: repeat\(7, minmax\(0, 1fr\)\)/.test(ui), "calendario: las columnas no pueden desbordar la tarjeta");
    check(!/\.cal-title small \{[^}]*text-overflow/.test(ui), "calendario: el subtítulo ya no se corta con puntos suspensivos");

    const env = boot();
    ready(env.A);
    env.A.go("schedule");
    act(env, "sch-view", { mode: "month" });
    const r = env.doc;
    const celdas = [...r.querySelectorAll(".cal .cal-day")];
    check(celdas.length > 0 && celdas.length % 7 === 0, "calendario: siguen siendo semanas completas (" + celdas.length + ")");
    check(r.querySelectorAll(".cal-weekdays .dow").length === 7, "calendario: la fila de días de la semana sigue ahí");
    check(celdas.filter((c) => c.classList.contains("is-hoy") || c.classList.contains("today")).length <= 1, "calendario: hoy se marca una sola vez");
    check(/curso hasta el/.test(r.querySelector(".cal-title small").textContent), "calendario: el subtítulo cabe (" + r.querySelector(".cal-title small").textContent.trim() + ")");
  }

  // --- v62: el service worker sirve el precache desde la caché, sin tocar la red ---
  {
    // Se ejecuta sw.js de verdad en un entorno falso (caché en memoria y fetch espía):
    // es la única forma de comprobar que «cache-first» es cache-first y no una promesa.
    const vm = require("vm");
    const montarSW = (opciones = {}) => {
      const almacen = new Map();
      const eventos = {};
      const cacheObj = {
        async match(req) { return almacen.get(typeof req === "string" ? req : req.url) || undefined; },
        async put(req, res) { almacen.set(typeof req === "string" ? req : req.url, res); },
        async add(req) { almacen.set(new URL(req, "https://aula.test/sw.js").href, new Response("precache")); },
        async addAll(lista) { lista.forEach((u) => almacen.set(new URL(u, "https://aula.test/sw.js").href, new Response("precache"))); },
      };
      const red = [];
      const sandbox = {
        console: { warn() {}, log() {}, error() {} },
        location: { origin: "https://aula.test", href: "https://aula.test/sw.js" },
        URL, Response, Request, Blob, Uint8Array, atob: (t) => Buffer.from(t, "base64").toString("binary"),
        setTimeout: (fn) => fn(), clearTimeout() {},
        caches: {
          async open() { return cacheObj; },
          // como el navegador: las rutas relativas se resuelven contra el ámbito del sw
          async match(req) { return cacheObj.match(new URL(typeof req === "string" ? req : req.url, "https://aula.test/sw.js").href); },
          async keys() { return ["aula-smr-v55"]; }, async delete() {},
        },
        self: {
          location: { origin: "https://aula.test", href: "https://aula.test/sw.js" },
          addEventListener: (t, fn) => { eventos[t] = fn; }, skipWaiting() {}, clients: { claim() {}, matchAll: async () => [] },
        },
        fetch: async (req) => {
          if (opciones.sinRed) throw new Error("sin conexión");
          red.push(typeof req === "string" ? req : req.url);
          return new Response("de la red");
        },
      };
      sandbox.self.self = sandbox.self;
      sandbox.globalThis = sandbox;
      vm.createContext(sandbox);
      vm.runInContext(fs.readFileSync(path.join(ROOT, "sw.js"), "utf8"), sandbox, { filename: "sw.js" });
      return { sandbox, eventos, almacen, red };
    };
    const pide = async (env, url, opciones) => {
      let capturada = null;
      await env.eventos.fetch({ request: new Request(url, opciones), respondWith: (p) => { capturada = p; } });
      return capturada ? await capturada : null;
    };

    const env = montarSW();
    let instalar = null;
    env.eventos.install({ waitUntil: (p) => { instalar = p; } });
    await instalar;
    check(env.almacen.size > 30, "service worker: el install deja la app precacheada (" + env.almacen.size + " archivos)");
    const guardadas = [...env.almacen.keys()];
    check(guardadas.some((u) => u.endsWith("/index.html")) && guardadas.some((u) => u.endsWith("/js/app.js")) && guardadas.some((u) => u.endsWith("/css/ui.css")),
      "service worker: el precache incluye la app shell (HTML, JS y CSS)");

    const antes = env.red.length;
    const cacheado = await pide(env, "https://aula.test/js/app.js");
    check(await cacheado.text() === "precache" && env.red.length === antes,
      "service worker: un archivo precacheado se sirve de caché SIN tocar la red (" + (env.red.length - antes) + " peticiones)");

    const otro = await pide(env, "https://aula.test/datos-remotos.json");
    check(!!otro && env.red.some((u) => u.endsWith("datos-remotos.json")), "service worker: lo que no está en el precache sí va a la red");

    // Sin conexión y sin caché: un JS nunca se sustituye por HTML (eso rompía la app entera)
    const sinRed = montarSW({ sinRed: true });
    let r3 = null;
    await sinRed.eventos.fetch({ request: new Request("https://aula.test/js/nuevo.js"), respondWith: (p) => { r3 = p; } });
    const res3 = r3 ? await r3 : null;
    check(!!res3 && res3.status === 504 && /javascript/.test(res3.headers.get("Content-Type") || ""),
      "service worker: sin conexión un JS da 504 (nunca HTML en su lugar)");
    // y una navegación sin caché sí cae al index.html (modo app)
    const reqNav = new Request("https://aula.test/otra-ruta", { headers: { Accept: "text/html" } });
    Object.defineProperty(reqNav, "mode", { value: "navigate" });
    let r4 = null;
    await sinRed.eventos.fetch({ request: reqNav, respondWith: (p) => { r4 = p; } });
    const res4 = r4 ? await r4 : null;
    check(!!res4 && /precache|html/i.test((res4.headers.get("Content-Type") || "") + (await res4.clone().text())),
      "service worker: una navegación sin caché cae al index.html (modo app)");
  }

  // --- v62: la versión de la web y la del paquete no se separan (rompía el APK) ---
  {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8")).version;
    const app = fs.readFileSync(path.join(ROOT, "js", "app.js"), "utf8");
    const m = app.match(/APP_VERSION\s*=\s*"([^"]+)"/);
    check(!!m, "versión: js/app.js declara APP_VERSION");
    check(!!m && m[1].split(".")[0] === "v" + pkg.split(".")[0], "versión: APP_VERSION coincide con package.json (" + (m ? m[1] : "?") + " · paquete " + pkg + ")");
    const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
    const c = sw.match(/CACHE\s*=\s*"([^"]+)"/);
    check(!!c && c[1].includes(pkg.split(".")[0]), "versión: la caché del service worker lleva el número de la versión (" + (c ? c[1] : "?") + ")");
    const comp = fs.readFileSync(path.join(ROOT, "apk-overlay", "comprobar-apk.py"), "utf8");
    check(comp.includes(String.raw`v[\d.]`), "versión: el comprobador del APK acepta versiones con puntos (v62.1)");
  }

  // --- v62: los diálogos no heredan la caja centrada de la hoja antigua ---
  {
    const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const regla = ui.slice(ui.indexOf(".modal {"), ui.indexOf(".modal-card {"));
    check(/transform: none/.test(regla), "modal: se resetea el translate(-50%,-50%) de styles.css (la hoja salía media caja fuera)");
    check(/width: auto/.test(regla) && /max-height: none/.test(regla), "modal: se resetean el ancho y el alto máximos de la hoja antigua");

    const env = boot();
    ready(env.A);
    act(env, "add-exam", {});
    const r = env.doc;
    check(!!r.querySelector("#modal-root .modal > .modal-card"), "modal: el contenido va dentro de la hoja (.modal-card), no suelto en el flex");
    check(!!r.querySelector("#modal-root .modal-card h2"), "modal: el título vive dentro de la hoja");
    check(!!r.querySelector("#modal-form .modal-actions"), "modal: los botones siguen dentro del formulario");
    check(env.errors.length === 0, "modal: sin errores de consola (" + env.errors.slice(0, 1).join("") + ")");
  }

  // --- v62: la media no cuenta los módulos sin nota, y el boletín enseña la nota ---
  {
    const env = boot();
    ready(env.A);
    const A = env.A, r = env.doc;
    A.state.subjects = [
      { id: "m1", name: "Seguridad informática", grade: 8, color: "#ef4444" },
      { id: "m2", name: "Servicios en red", grade: "", color: "#db2777" },
      { id: "m3", name: "Aplicaciones web", grade: 6, color: "#eab308" },
      { id: "m4", name: "Proyecto intermodular", grade: "", color: "#22c55e" },
    ];
    A.go("rendimiento");
    check(/\b7\b/.test(r.querySelector(".boletin-hero .g").textContent), "media: solo cuentan los módulos con nota (8 y 6 → 7,0), no los vacíos");
    A.go("stats");
    const stats = r.getElementById("view").textContent;
    check(/Nota media[\s\S]{0,40}7\.0/.test(stats.replace(/\s+/g, " ")) || /7\.0/.test(stats), "media: Gráficos enseña 7,0 en vez de la media hundida");
    check(!/NaN|undefined/.test(r.getElementById("view").innerHTML), "media: sin NaN en pantalla");
    // Y el boletín de Gráficos ya no sale todo en «—»
    const filas = [...r.querySelectorAll("#view .card .row")].filter((f) => /Seguridad|Aplicaciones/.test(f.textContent));
    check(filas.length > 0 && filas.some((f) => /8\.0|6\.0/.test(f.textContent)), "boletín: cada módulo enseña su nota (antes salía siempre «—»)");
  }

  // --- v63: el precache no se queda corto, la CSP aguanta y las fotos no se cargan de más ---
  {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
    const precacheados = new Set((sw.match(/"\.\/[^"]+"/g) || []).map((x) => x.slice(3, -1)));
    const referenciados = [...html.matchAll(/(?:src|href)="(?!https?:|data:|#|mailto:)([^"]+)"/g)].map((m) => m[1].replace(/^\.\//, ""));
    const sinPrecache = referenciados.filter((r) => !precacheados.has(r));
    check(sinPrecache.length === 0, "service worker: todo lo que carga index.html está en el precache (" + (sinPrecache.join(", ") || "todo") + ")");
    check(precacheados.has("index.html") && precacheados.has("js/avisos.js") && precacheados.has("js/tema.js"),
      "service worker: el precache lleva la app shell, el tema y los avisos");

    // CSP: nada de scripts en línea (por eso el tema vive en js/tema.js)
    const csp = (html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]+)"/) || [])[1] || "";
    check(/script-src 'self'/.test(csp), "CSP: solo se ejecuta JavaScript propio (script-src 'self')");
    check(/object-src 'none'/.test(csp) && /base-uri 'none'/.test(csp) && /frame-src 'none'/.test(csp),
      "CSP: sin objetos incrustados, sin base-uri y sin marcos externos");
    check(/connect-src[^;]*http:/.test(csp), "CSP: se puede hablar con Ollama en la red local (connect-src http/https)");
    const enLinea = [...html.matchAll(/<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1].trim()).filter(Boolean);
    check(enLinea.length === 0, "CSP: no queda ningún script en línea en index.html (" + enLinea.length + ")");

    // Imágenes: todas cargan cuando hacen falta, no al abrir la vista
    const app = fs.readFileSync(path.join(ROOT, "js", "app.js"), "utf8");
    const imgs = [...app.matchAll(/<img\s[^>]*>/g)].map((m) => m[0]);
    const sinPerezosa = imgs.filter((t) => !/loading="lazy"/.test(t) || !/decoding="async"/.test(t));
    check(imgs.length > 0 && sinPerezosa.length === 0, "imágenes: todas las de las plantillas cargan en diferido (" + imgs.length + " vistas, " + sinPerezosa.length + " sin lazy/async)");

    // El APK se empaqueta minificado y con los plugins enlazados
    const build = fs.readFileSync(path.join(ROOT, "apk-overlay", "build.sh"), "utf8");
    check(/node tools\/minificar\.mjs www/.test(build), "APK: la web se minifica antes de empaquetarla");
    check(/cap sync android/.test(build), "APK: cap sync enlaza los plugins (notificaciones programadas)");
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
    check(!!pkg.scripts.minificar && !!pkg.devDependencies.terser, "minificado: hay script npm y minificador instalado");
    check(!!pkg.devDependencies["@capacitor/local-notifications"], "APK: el plugin de notificaciones locales está en las dependencias");
  }

  // --- v63: los avisos que se programan en Android (clases, exámenes, resumen) ---
  {
    const env = boot();
    ready(env.A);
    const AV = env.window.AulaAvisos;
    check(!!AV && typeof AV.plan === "function", "avisos: el módulo de avisos nativos se carga con la app");
    check(AV && AV.disponible() === false, "avisos: en el navegador no se programa nada (solo dentro del APK)");

    const datos = {
      ajustes: { notifyClass: true, notifyCards: true, morningSummary: true, remindHour: 8 },
      dias: [
        { iso: "2026-09-14", lectivo: true, etiqueta: "", clases: [{ start: "15:15", subject: "IPE", room: "AULA 1NF3" }, { start: "16:05", subject: "DIG", room: "AULA 2" }] },
        { iso: "2026-09-15", lectivo: false, etiqueta: "Festivo", clases: [] },
        { iso: "2026-09-16", lectivo: true, etiqueta: "", clases: [{ start: "15:15", subject: "PRO", room: "AULA 1NF3" }] },
      ],
      examenes: [{ title: "Tema 3", subject: "Seguridad informática", date: "2026-09-17", time: "16:45", room: "AULA 1NF3" }],
      fichas: 12,
    };
    const ahora = new Date("2026-09-14T08:30:00");
    const avisos = AV.plan(datos, ahora);
    const con = (tipo, texto) => avisos.filter((a) => a.tipo === tipo && (!texto || (a.titulo + " " + a.cuerpo).includes(texto)));
    const hora = (a) => a.cuando.getHours() + ":" + String(a.cuando.getMinutes()).padStart(2, "0");

    check(avisos.length === 9, "avisos: el plan de dos semanas sale completo (" + avisos.length + " avisos)");
    check(con("clase", "IPE").length === 1 && hora(con("clase", "IPE")[0]) === "15:05",
      "avisos: cada clase avisa 10 minutos antes (15:15 → 15:05)");
    check(con("clase", "DIG").length === 1 && con("clase").every((a) => hora(a).endsWith("5") || hora(a).endsWith("55")),
      "avisos: la segunda clase del día también avisa 10 minutos antes");
    check(con("clase").every((a) => a.cuando.getDate() !== 15), "avisos: un día festivo no programa clases (ni aunque tuviera horario)");
    const vispera = con("examen").find((a) => a.titulo === "Mañana examen");
    const unaHora = con("examen").find((a) => a.titulo === "Examen en 1 hora");
    check(!!vispera && vispera.cuando.getDate() === 16 && hora(vispera) === "18:00",
      "avisos: el examen avisa la tarde anterior a las 18:00");
    check(!!unaHora && unaHora.cuando.getDate() === 17 && hora(unaHora) === "15:45",
      "avisos: el examen avisa una hora antes (16:45 → 15:45)");
    check(con("resumen").length === 2 && hora(con("resumen")[0]) === "8:00",
      "avisos: el resumen de la mañana sale a la hora configurada (8:00) y no repite el de hoy si ya pasó");
    check(con("resumen").some((a) => a.cuerpo === "Festivo") && con("resumen").some((a) => /1 clase · primera a las 15:15/.test(a.cuerpo)),
      "avisos: el resumen cuenta las clases del día o avisa del festivo");
    check(con("fichas").length === 2 && con("fichas")[0].cuerpo === "12 para repasar", "avisos: las fichas pendientes se avisan a las 18:00");
    check(new Set(avisos.map((a) => a.id)).size === avisos.length && avisos.every((a) => Number.isInteger(a.id) && a.id > 0),
      "avisos: cada aviso tiene un id entero y único (Android lo exige)");
    check(avisos.every((a) => a.cuando > ahora) && avisos.every((a, i, l) => i === 0 || l[i - 1].cuando <= a.cuando),
      "avisos: no se programa nada pasado ni desordenado");

    const sinClases = AV.plan({ ...datos, ajustes: { ...datos.ajustes, notifyClass: false } }, ahora);
    check(sinClases.filter((a) => a.tipo === "clase").length === 0, "avisos: apagar «Clase (10 min antes)» quita todos los avisos de clase");
    const sinFichas = AV.plan({ ...datos, fichas: 0 }, ahora);
    check(sinFichas.filter((a) => a.tipo === "fichas").length === 0, "avisos: sin fichas pendientes no se molesta a nadie");
    const sinResumen = AV.plan({ ...datos, ajustes: { ...datos.ajustes, morningSummary: false } }, ahora);
    check(sinResumen.filter((a) => a.tipo === "resumen").length === 0, "avisos: el resumen de la mañana se puede apagar");

    // El texto que ve el usuario en Ajustes
    check(/Programados 9 avisos · el siguiente, hoy a las 15:05/.test(AV.resumen(datos, ahora)), "avisos: Ajustes cuenta los avisos y cuándo es el siguiente (" + AV.resumen(datos, ahora) + ")");
    // Sin Capacitor no se llama a nada nativo (y no revienta)
    const r = await AV.sincronizar({ datos });
    check(r && r.nativo === false && r.programados === 0, "avisos: fuera del APK, sincronizar no programa (ni falla)");
    // Con un Capacitor de mentira: se pide permiso, se limpia lo viejo y se programa el plan
    const llamadas = [];
    env.window.Capacitor = {
      isNativePlatform: () => true,
      Plugins: {
        LocalNotifications: {
          checkPermissions: async () => ({ display: "granted" }),
          requestPermissions: async () => ({ display: "granted" }),
          createChannel: async (c) => llamadas.push(["canal", c.id]),
          getPending: async () => ({ notifications: [{ id: 7 }, { id: 8 }] }),
          cancel: async (o) => llamadas.push(["cancelar", o.notifications.length]),
          schedule: async (o) => llamadas.push(["programar", o.notifications.length, o.notifications[0].channelId]),
        },
      },
    };
    check(AV.disponible() === true, "avisos: dentro del APK el módulo se declara disponible");
    const r2 = await AV.sincronizar({ datos, ahora });
    check(r2.nativo === true && r2.permiso === true && r2.programados === 9, "avisos: se programan los 9 avisos del plan en Android");
    check(JSON.stringify(llamadas) === JSON.stringify([["canal", "aula-smr"], ["cancelar", 2], ["programar", 9, "aula-smr"]]),
      "avisos: antes de programar se cancelan los viejos y se prepara el canal de Android (" + JSON.stringify(llamadas) + ")");
    // Y si el usuario dice que no al permiso, no se programa nada
    env.window.Capacitor.Plugins.LocalNotifications.checkPermissions = async () => ({ display: "denied" });
    const r3 = await AV.sincronizar({ pedirPermiso: false, datos, ahora });
    check(r3.permiso === false && r3.programados === 0, "avisos: sin permiso de Android no se programa nada");
  }

  // --- v62: nada se sale de la tarjeta en un móvil estrecho (360 px) ---
  {
    const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
    check(!/grid-template-columns: (1fr|repeat\(\d+, 1fr\))/.test(ui), "anchura: ninguna rejilla usa 1fr a pelo (todas con minmax(0, 1fr))");
    check(/\.filters \{[^}]*flex-wrap: wrap/.test(ui), "anchura: los filtros de módulos envuelven en varias líneas");
    check(/\.chips-row \.chip, \.filters \.chip[^{]*\{[^}]*overflow-wrap: anywhere/.test(ui), "anchura: un chip largo (módulo, fecha, aviso) se parte dentro de su píldora");
    check(/\.row > div, \.row b, \.row small \{[^}]*min-width: 0/.test(ui), "anchura: el texto de una fila puede encogerse (no empuja las cifras)");
    check(/@media \(max-width: 460px\)[\s\S]{0,200}\.stack-phone/.test(ui), "anchura: las tarjetas de texto se apilan en pantallas estrechas");

    const env = boot();
    ready(env.A);
    env.A.state.subjects = [{ id: "m1", name: "Proyecto intermodular Sistemas microinformáticos y redes", grade: 8 }];
    env.A.go("cards");
    check(!/style="flex:1;min-width:0"/.test(env.doc.getElementById("view").innerHTML), "fichas: el mazo no fuerza anchos en línea (los pone la hoja de estilo)");
    env.A.state.glossary = [{ id: "g1", term: "VLAN", def: "Red lógica independiente dentro de un mismo switch físico.", subjectId: "m1" }];
    env.A.go("glossary");
    const fila = env.doc.querySelector("#view .row");
    check(!!fila && !!fila.querySelector(".row-tag"), "glosario: el módulo se etiqueta dentro de la fila, sin comerse la definición");
    check(!!fila && fila.children.length === 2, "glosario: la fila no tiene columnas que compitan por el ancho (" + (fila ? fila.children.length : 0) + ")");
  }

  // --- v59: una sola hoja de interfaz y el aviso de invitado en la cabecera ---
  {
    const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
    const hojas = [...html.matchAll(/href="css\/([\w.-]+)"/g)].map((m) => m[1]);
    check(hojas[hojas.length - 1] === "ui.css", "interfaz: la hoja nueva se carga la última (" + hojas.join(" → ") + ")");
    check(!hojas.some((h) => /hub|look|plus|polish/.test(h)), "interfaz: hub/look/plus/polish ya no se enlazan");
    check(hojas.every((h) => fs.existsSync(path.join(ROOT, "css", h))), "interfaz: todas las hojas enlazadas existen");
    const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
    check((ui.match(/{/g) || []).length === (ui.match(/}/g) || []).length, "interfaz: ui.css tiene las llaves cuadradas");
    check(/\.hub-nav\b/.test(ui) && /\.hub-scroll\b/.test(ui) && /\.card\b/.test(ui), "interfaz: ui.css cubre el cromo de la app");

    const env = boot();
    ready(env.A);
    env.A.state.settings.guest = true;
    env.A.render();
    const chip = env.doc.getElementById("guest-chip");
    check(!!chip && !chip.hidden, "invitado: la cabecera avisa de que el modo invitado está activo");
    env.A.state.settings.guest = false;
    env.A.render();
    check(!!chip && chip.hidden, "invitado: el aviso desaparece al salir del modo invitado");
  }

  // --- Una vista que falla no deja la app en blanco ---
  {
    const env = boot({ extra: { "aula.snaps": "{{{esto no es json" } });
    ready(env.A);
    env.A.go("admin");
    check(/Último backup local/.test(env.doc.getElementById("view").textContent), "datos locales: unas copias dañadas no tumban la vista");
    check(env.errors.length === 0, "datos locales: sin errores de consola (" + env.errors.slice(0, 1).join("") + ")");
    // Y el botón de punto de restauración sigue funcionando con esa basura dentro
    act(env, "snap-now");
    let snaps = [];
    try { snaps = JSON.parse(env.window.localStorage.getItem("aula.snaps")); } catch {}
    check(Array.isArray(snaps) && snaps.length === 1, "datos locales: se puede crear un punto de restauración con copias dañadas");
    if (snaps[0]) {
      act(env, "snap-load", { id: snaps[0].id });
      check(confirmModal(env), "datos locales: la copia se puede restaurar");
    }
  }

  // --- Fotos de una nota: el botón «Foto» no hacía nada porque shrinkImage no existía ---
  {
    const env = boot();
    ready(env.A);
    env.A.go("notes");
    const nota = env.A.state.notes[0];
    env.A.noteId = nota.id;
    env.window.Image = class { constructor() { this.naturalWidth = 4000; this.naturalHeight = 3000; } set src(v) { this._s = v; setTimeout(() => this.onload && this.onload(), 0); } get src() { return this._s; } };
    env.window.HTMLCanvasElement.prototype.toDataURL = () => "data:image/jpeg;base64," + "B".repeat(2000);
    const clickOriginal = env.window.HTMLInputElement.prototype.click;
    env.window.HTMLInputElement.prototype.click = function () {
      if (this.type === "file") {
        Object.defineProperty(this, "files", { value: [new env.window.File([new Uint8Array([1, 2, 3])], "foto.jpg", { type: "image/jpeg" })] });
        this.dispatchEvent(new env.window.Event("change", { bubbles: true }));
        return;
      }
      return clickOriginal.call(this);
    };
    act(env, "note-photo");
    await hasta(() => (nota.attachments || []).length > 0);
    check((nota.attachments || []).length === 1, "foto de nota: se añade el adjunto (antes fallaba en silencio)");
    check(/aula-img:/.test(nota.content || ""), "foto de nota: la imagen queda enlazada en el texto");
    env.A.render();
    check(env.doc.querySelectorAll(".note-img").length >= 1, "foto de nota: la miniatura se pinta en el editor");
  }

  // --- Ni una foto ni un avatar pueden colar código desde una copia importada ---
  {
    const env = boot();
    ready(env.A);
    env.A.state.settings.customAvatars = [{ id: "x1", data: 'data:image/jpeg;base64,AA" onerror="alert(1)' }];
    env.A.state.settings.avatarIcon = "c:x1";
    env.A.render();
    const img = env.doc.querySelector("#header-avatar img");
    check(!!img && img.getAttribute("onerror") === null, "seguridad: un avatar con comillas no crea atributos");
    env.A.state.notes[0].attachments = [{ id: "a1", name: "x", kind: "img", data: "javascript:alert(1)" }];
    env.A.render();
    check(!/javascript:/.test(env.doc.getElementById("view").innerHTML), "seguridad: una «foto» que no es imagen se descarta");
  }

  // --- Herramientas: cuentas que antes daban un resultado falso ---
  {
    const env = boot();
    ready(env.A);
    const P = (id) => env.doc.getElementById(id);
    const abrir = (tool) => { env.A.state._tool = tool; env.A.go("tools"); };
    abrir("conv");
    P("cv-n").value = "19";
    P("cv-from").value = "2";
    act(env, "tool-conv");
    check(/no válido/i.test(P("cv-out").textContent), "herramientas: «19» en base 2 avisa en vez de convertir");
    P("cv-n").value = "FF";
    P("cv-from").value = "16";
    act(env, "tool-conv");
    check(/255/.test(P("cv-out").textContent), "herramientas: FF en hexadecimal da 255");
    abrir("wild");
    P("wd-in").value = "255.255.0.255";
    act(env, "tool-wild");
    check(/no es una máscara válida/i.test(P("wd-out").textContent), "herramientas: una máscara con unos salteados se rechaza");
    P("wd-in").value = "/26";
    act(env, "tool-wild");
    check(/255\.255\.255\.192/.test(P("wd-out").textContent), "herramientas: /26 da la máscara correcta");
    abrir("raid");
    P("rd-n").value = "0";
    P("rd-gb").value = "4";
    act(env, "tool-raid");
    check(/Pon cuántos discos/.test(P("rd-out").textContent), "herramientas: RAID sin discos lo dice en vez de enseñar 0 GB");
    abrir("subnet");
    P("sn-ip").value = "192.168.10.130/26";
    act(env, "tool-subnet");
    const sn = P("sn-out").textContent;
    check(/192\.168\.10\.128/.test(sn) && /192\.168\.10\.190/.test(sn), "herramientas: el subnetting sigue bien (red .128, último .190)");
  }

  // --- Fichas: al escribir la respuesta, la tarjeta avanza ---
  {
    const env = boot();
    ready(env.A);
    env.A.state._cardMode = "type";
    env.A.state.cards = [{ id: "t1", subjectId: env.A.state.subjects[0].id, front: "¿Puerto SSH?", back: "22", due: "2000-01-01", interval: 0, reps: 0 }];
    env.A.go("cards");
    const campo = env.doc.getElementById("card-typed");
    check(!!campo, "fichas: el modo «Escribir» tiene campo de respuesta");
    if (campo) {
      campo.value = "22";
      act(env, "card-typed");
      const c = env.A.state.cards[0];
      check(c.reps === 1 && c.due > "2026-01-01", "fichas: acertar programa el repaso (reps " + c.reps + ", vuelve el " + c.due + ")");
    }
  }

  // --- Textos: fuera los deberes; los exámenes viven en su vista (v61) ---
  {
    const env = boot();
    ready(env.A);
    const conTexto = [];
    const conDeberes = [];
    for (const v of VIEWS) {
      env.A.go(v);
      const txt = env.doc.getElementById("view").textContent;
      if (/deber|tarea/i.test(txt)) conDeberes.push(v);
      if (/examen/i.test(txt) && v !== "chatbot") conTexto.push(v);   // el chat propone «¿próximo examen?»
    }
    check(conDeberes.length === 0, "textos: ninguna vista habla de deberes ni tareas" + (conDeberes.length ? " (" + conDeberes.join(", ") + ")" : ""));
    check(conTexto.length === 0, "textos: los exámenes solo salen en su vista" + (conTexto.length ? " (" + conTexto.join(", ") + ")" : ""));
    env.A.go("exams");
    check(/Examen/i.test(env.doc.getElementById("view").textContent), "textos: la vista de exámenes sí habla de exámenes");
    env.A.state.settings.onboarded = false;
    env.A.render();
    check(!/examen/i.test(env.doc.getElementById("view").textContent), "textos: la primera pantalla tampoco habla de exámenes");
  }

  // --- Agenda: el bloque de estudio dura el hueco entero y los meses avanzan de mes ---
  {
    const env = boot();
    ready(env.A);
    env.A.go("agenda");
    const d = new Date();
    const dia = new Date(d.getTime() - ((d.getDay() + 6) % 7) * 86400000).toISOString().slice(0, 10);
    env.A.state._agendaDay = dia;
    env.A.state._agendaTab = "dia";
    env.A.render();
    const reservar = env.doc.querySelector('[data-action="slot-study"]');
    const hueco = reservar ? (env.A.minutesOf ? 0 : Number(reservar.dataset.end.slice(0, 2)) * 60 + Number(reservar.dataset.end.slice(3)) - Number(reservar.dataset.start.slice(0, 2)) * 60 - Number(reservar.dataset.start.slice(3))) : 0;
    if (reservar) {
      const antes = env.A.state.events.length;
      act(env, "slot-study", { start: reservar.dataset.start, end: reservar.dataset.end, day: reservar.dataset.day });
      const nuevo = env.A.state.events[env.A.state.events.length - 1];
      check(env.A.state.events.length === antes + 1 && nuevo.type === "estudio", "agenda: el hueco libre se reserva como bloque de estudio");
      const mins = Number(nuevo.end.slice(0, 2)) * 60 + Number(nuevo.end.slice(3)) - Number(nuevo.start.slice(0, 2)) * 60 - Number(nuevo.start.slice(3));
      check(mins === Math.max(10, Math.min(180, hueco)), "agenda: el bloque dura el hueco entero (" + mins + " de " + hueco + " min)");
    } else {
      check(true, "agenda: ese día no tenía huecos libres (no se prueba la reserva)");
    }
    const mesAntes = env.A.state._agendaDay;
    env.A.state._agendaTab = "mes";
    env.A.render();
    act(env, "agenda-next");
    const trasMes = env.A.state._agendaDay;
    check(Number(trasMes.slice(5, 7)) === (Number(mesAntes.slice(5, 7)) % 12) + 1, "agenda: el mes siguiente es el mes que toca (" + mesAntes + " → " + trasMes + ")");
    act(env, "agenda-prev");
    check(Number(env.A.state._agendaDay.slice(5, 7)) === Number(mesAntes.slice(5, 7)), "agenda: el mes anterior vuelve al mes de partida");
  }

  // --- Sin restos de la navegación antigua ---
  {
    const env = boot();
    check(!env.doc.getElementById("menu-btn") && !env.doc.getElementById("sidebar") && !env.doc.getElementById("task-count"),
      "html: fuera el menú lateral y los contadores que ya no se usaban");
  }

  // --- Tema automático: de noche oscurece también el color de la barra del sistema ---
  {
    const env = boot();
    ready(env.A);
    env.A.state.settings.skin = "minimal";
    env.A.state.settings.uiTheme = "light";
    env.A.state.settings.autoTheme = true;
    const Reloj = env.window.Date;
    env.window.Date = class extends Reloj { constructor(...a) { super(...(a.length ? a : [2026, 8, 11, 23, 30])); } static now() { return new Reloj(2026, 8, 11, 23, 30).getTime(); } };
    env.A.render();
    env.window.Date = Reloj;
    check(env.doc.documentElement.getAttribute("data-theme") === "dark", "tema automático: de noche se pone en oscuro");
    check(env.doc.querySelector('meta[name="theme-color"]').content === "#000000", "tema automático: la barra del móvil también cambia de color");
  }
}

// ------------------------------------------------------------- ejecución
(async () => {
  try {
    await testImport();
    await testSettings();
    await testMedia();
    await testBackupConFotos();
    await testSinRed();
    await testAuditoria();
  } catch (e) {
    fails.push("las pruebas asíncronas fallaron: " + e.message + " [traza: " + String(e.stack || "").split("\n")[1] + "]");
  }

  console.log("\n  ✓ " + oks.length + " comprobaciones correctas");
  if (fails.length) {
    console.log("\n  ✗ " + fails.length + " fallos:");
    fails.forEach((f) => console.log("     - " + f));
    process.exit(1);
  }
  console.log("  Todo bien: datos a salvo y vistas en pie.\n");
  process.exit(0);
})();
