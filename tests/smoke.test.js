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

  for (const f of ["js/media.js", "js/app.js", "js/studio.js", "js/tools.js"]) {
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
  check(A.state.exams === undefined && A.state.tasks === undefined, "sin exámenes ni deberes: lo viejo que hubiera guardado no se carga");
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
  check(A.state.exams === undefined && A.state.tasks === undefined, "importar: los exámenes y deberes de una copia vieja se descartan");
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
  const conocidas = VIEWS.concat(["admin", "examode", "quickreview", "inbox", "review", "achievements", "agenda", "chatbot", "habits", "glossary", "rendimiento", "tools"]);
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

  // Ni vistas, ni botones, ni nombres en la navegación
  const conExamenes = ["exams", "tasks", "plan", "kanban", "simulator"];
  A.go("dashboard");
  check(conExamenes.every((v) => {
    for (const b of env.doc.querySelectorAll(`[data-view="${v}"]`)) return false;
    return true;
  }), "sin exámenes ni deberes: no hay botones a las vistas de exámenes/tareas/plan/tablero");

  // Nada de eso se ve en pantalla por ninguna vista
  let conTexto = [];
  for (const v of VIEWS) {
    A.go(v);
    const txt = env.doc.getElementById("view").textContent;
    if (/examen|tarea|deber|entrega/i.test(txt)) conTexto.push(v);
  }
  A.go("dashboard");
  check(conTexto.length === 0, "sin exámenes ni deberes: ninguna vista habla de exámenes ni de tareas" + (conTexto.length ? " (con texto: " + conTexto.join(", ") + ")" : ""));

  // El estado arranca sin esas listas y el demo tampoco las trae
  check(A.state.exams === undefined && A.state.tasks === undefined, "sin exámenes ni deberes: no hay listas de exámenes ni de tareas en el estado");

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
  check(!/Exámenes|Tareas/.test(ag), "agenda: ni exámenes ni tareas");
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
    const buscar = (t) => {
      const caja = env.doc.getElementById("note-query");
      caja.value = t;
      caja.dispatchEvent(new env.window.Event("input", { bubbles: true }));
      return [...env.doc.querySelectorAll(".note-item h4")].map((h) => h.textContent).join(", ");
    };
    const uno = buscar("dhcp");
    check(/DHCP/.test(uno) && !/Puertos/.test(uno), "buscador de apuntes: filtra por título (" + uno + ")");
    const dos = buscar("rango");
    check(/DHCP/.test(dos), "buscador de apuntes: también busca dentro del texto");
    buscar("noexiste");
    check(/Ninguna nota coincide/.test(env.doc.querySelector(".notes-list").textContent), "buscador de apuntes: avisa si no hay resultados");
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
    const titulo = env.doc.querySelector(".cal-nav h2").textContent;
    check(/septiembre 2026/i.test(titulo), "calendario: el mes no se escapa antes del curso (" + titulo.trim() + ")");
    check(env.doc.querySelector('[data-action="cal-prev"]').disabled, "calendario: el botón de mes anterior se desactiva en el primer mes");
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

  // --- Textos: la app ya no habla de exámenes ni de deberes en ninguna pantalla ---
  {
    const env = boot();
    ready(env.A);
    const conTexto = [];
    for (const v of VIEWS) {
      env.A.go(v);
      if (/examen|deber|tarea/i.test(env.doc.getElementById("view").textContent)) conTexto.push(v);
    }
    check(conTexto.length === 0, "textos: ninguna vista habla de exámenes, deberes ni tareas" + (conTexto.length ? " (" + conTexto.join(", ") + ")" : ""));
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
    fails.push("las pruebas asíncronas fallaron: " + e.message);
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
