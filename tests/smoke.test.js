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

  if (opts.seed !== undefined) window.localStorage.setItem("aula.smr.v4", opts.seed);
  if (opts.extra) Object.entries(opts.extra).forEach(([k, v]) => window.localStorage.setItem(k, v));

  for (const f of ["js/app.js", "js/studio.js", "js/tools.js"]) {
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

const VIEWS = ["dashboard", "schedule", "exams", "notes", "cards", "tasks", "timer", "stats", "plan", "subjects", "settings", "inbox", "review", "achievements", "agenda", "timeline", "kanban", "chatbot", "simulator", "habits", "glossary", "trash", "examode", "quickreview", "admin", "guide", "rendimiento", "tools"];

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
  check(env.errors.length === 0, "sin errores de consola al recorrer las 28 vistas (" + env.errors.slice(0, 2).join(" | ") + ")");
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
    exams: [{ id: "e1", subjectId: "s1", title: "Examen de red" }, { id: "e2", title: "Sin fecha" }],
    tasks: [{ id: "t1", title: "Tarea", due: "32/13/2026" }, { title: "" }],
    sessions: [{ id: "x", subjectId: "s1", date: "2026-09-10", minutes: -500 }],
    cards: [{ id: "c1", front: "HTTPS", back: "443", reps: "x" }],
    progress: { bonusXp: "x", unlocked: "no" },
  });
  const env = boot({ seed: roto });
  const A = env.A;
  check(A.state.settings.dailyGoal === 90, "ajustes imposibles: se corrigen (meta diaria)");
  check(Array.isArray(A.state.events), "events con basura: se convierte en lista válida");
  check(A.state.exams.length === 2 && A.state.exams.every((e) => /^\d{4}-\d{2}-\d{2}$/.test(e.date)), "exámenes sin fecha: se rellenan sin perder ninguno");
  check(A.state.tasks.length === 1, "tareas sin título: se descartan y el resto se conserva");
  check(A.state.sessions.every((s) => s.minutes >= 0 && s.minutes <= 1440), "minutos imposibles: saneados");
  check(A.state.subjects.every((s) => s.name), "módulos sin nombre: se renombran");
}

// ------------------------------------------------- 3. guardado y falta de sitio
{
  const env = boot();
  ready(env.A);
  env.A.go("tasks");
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
  const backup = JSON.stringify({ subjects: [{ id: "i1", name: "Módulo importado" }], events: "patata", exams: [{ id: "ie", subjectId: "i1", title: "Examen importado" }] });
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
  await new Promise((r) => setTimeout(r, 40));
  env.window.FileReader = RealFR;
  env.doc.createElement = realCreate;
  check(confirmModal(env), "importar: pide confirmación antes de sustituir");
  check(A.state.subjects.some((s) => s.name === "Módulo importado"), "importar: entran los datos del archivo");
  check(Array.isArray(A.state.events), "importar: se sanean los campos rotos del archivo");
  check(A.state.exams.length === 1 && /^\d{4}-\d{2}-\d{2}$/.test(A.state.exams[0].date), "importar: los exámenes sin fecha se completan");
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
  env.doc.getElementById("capture-text").value = "examen de apache y dns el viernes a las 09:00";
  act(env, "nlp-text", {});
  check(!!env.doc.getElementById("modal-form"), "frase: se muestra lo entendido antes de guardar");
  const antes = env.A.state.exams.length;
  confirmModal(env);
  check(env.A.state.exams.length === antes + 1, "frase: al confirmar se crea el examen");
  const nuevo = env.A.state.exams[env.A.state.exams.length - 1];
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
  env.A.state.exams.push({ id: "eic", subjectId: env.A.state.subjects[0].id, title: "Examen, con coma; y punto", date: "2026-10-01", time: "09:00", type: "parcial", status: "pendiente", grade: "", weight: 25, difficulty: 3, hoursNeeded: 8, checklist: [] });
  let ics = "";
  const BlobReal = env.window.Blob;
  env.window.Blob = function (parts, opts) { ics = String(parts[0]); return new BlobReal(parts, opts); };
  act(env, "export-ics", {});
  check(ics.startsWith("BEGIN:VCALENDAR\r\n"), "ics: cabecera válida con CRLF");
  check(/DTSTART:20261001T090000/.test(ics), "ics: inicio en hora local");
  check(/DTEND:20261001T100000\r\n/.test(ics), "ics: fin coherente con el inicio");
  check(/SUMMARY:Examen\\, con coma\\; y punto/.test(ics), "ics: comas y puntos y coma escapados");
  check(/DTSTART;VALUE=DATE:\d{8}\r\nDTEND;VALUE=DATE:\d{8}/.test(ics), "ics: las tareas de día completo llevan DTEND");
}

// -------------------------------------------------- 10. ajustes y accesibilidad
async function testSettings() {
  const env = boot();
  ready(env.A);
  env.A.go("settings");
  const vista = env.doc.getElementById("view");
  check(vista.querySelectorAll(".skin-card").length > 10, "Ajustes: por fin se ve el selector de temas (" + vista.querySelectorAll(".skin-card").length + " tarjetas)");
  check(!!vista.querySelector('[data-action="skin-cat"]'), "Ajustes: filtros por categoría de tema");
  const campos = [...vista.querySelectorAll("input,select,textarea")].filter((el) => el.type !== "hidden");
  const sinNombre = campos.filter((el) => !(el.getAttribute("aria-label") || el.getAttribute("placeholder") || el.getAttribute("title") || (el.id && vista.querySelector(`label[for="${el.id}"]`)) || el.closest("label")));
  check(sinNombre.length === 0, "Ajustes: todos los campos tienen etiqueta (" + sinNombre.length + " sin ella)");
  const botones = [...vista.querySelectorAll("button")].filter((b) => !(b.textContent.trim() || b.getAttribute("aria-label") || b.getAttribute("title")));
  check(botones.length === 0, "Ajustes: todos los botones tienen nombre accesible (" + botones.length + " sin él)");
  const card = vista.querySelector('[data-action="set-skin"]');
  act(env, "set-skin", { id: card.dataset.id });
  check(env.A.state.settings.skin === card.dataset.id, "elegir tema aplica el cambio");
}

// ------------------------------------------------------------- ejecución
(async () => {
  try {
    await testImport();
    await testSettings();
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
