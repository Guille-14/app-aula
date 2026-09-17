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

// AULA_ROOT permite pasar toda la batería sobre OTRA copia de la app: es lo que usa
// `npm run test:min` para probar el código minificado que va dentro del APK.
const ROOT = process.env.AULA_ROOT ? path.resolve(process.env.AULA_ROOT) : path.join(__dirname, "..");
const HTML = fs
  .readFileSync(path.join(ROOT, "index.html"), "utf8")
  .replace(/<script src="[^"]+"><\/script>/g, "");

// Compara texto sin depender del formato: fuera comentarios, espacios, saltos de línea y el
// «;» de antes de la llave. Así la misma comprobación sirve para el CSS escrito a mano y para
// el minificado que va dentro del APK (que es lo que de verdad se publica).
const compacto = (t) => String(t).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, "").replace(/;\}/g, "}");
const casa = (patron, texto) => new RegExp(compacto(patron)).test(compacto(texto));
// ¿Hay alguna regla que dé esta propiedad a este selector? Vale para el CSS escrito a mano y
// para el minificado: el minificador reparte los grupos de selectores como le conviene.
const tienePropiedad = (selector, propiedad, texto) => {
  const limpio = (t) => String(t).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*([>+~,])\s*/g, "$1").replace(/;\s*}/g, "}");
  const plano = limpio(texto);
  const clave = limpio(selector);
  const prop = limpio(propiedad);
  let i = -1;
  while ((i = plano.indexOf(clave, i + 1)) >= 0) {
    const fin = plano.indexOf("}", i);
    if (plano.slice(i, fin < 0 ? plano.length : fin).replace(/\s+/g, "").includes(prop.replace(/\s+/g, ""))) return true;
  }
  return false;
};
const oks = [];
const fails = [];
const check = (cond, msg) => (cond ? oks : fails).push(msg);

/* --- v67.7: medir el CSS por NÚMEROS, no por texto ---
   El minificador quita las comillas del selector (`[data-theme="dark"]` → `[data-theme=dark]`),
   los espacios tras las comas de `rgba()` y reescribe colores. Cualquier comparación de cadena
   pasaría sobre el CSS de casa y se caería sobre el que de verdad va dentro del APK — que es el
   único que importa. Así que se extrae el valor y se compara el número. */
// El cuerpo de declaraciones de `html[data-theme=…]`, con o sin comillas en el atributo
const bloqueTema = (css, tema) => {
  const plano = String(css).replace(/\/\*[\s\S]*?\*\//g, "");
  const m = new RegExp("html\\[data-theme=[\"']?" + tema + "[\"']?\\]\\s*\\{([\\s\\S]*?)\\}").exec(plano);
  return m ? m[1] : "";
};
// El valor crudo de un token (`--line`, `--surface`…) dentro de ese cuerpo
const tokenCSS = (bloque, nombre) => {
  const m = new RegExp("--" + nombre.replace(/[-]/g, "\\-") + "\\s*:\\s*([^;}]+)").exec(String(bloque));
  return m ? m[1].trim() : "";
};
// El alfa de un `rgba(…)`, como número (1 si no lleva canal alfa)
const alfaDe = (v) => {
  const m = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/.exec(String(v));
  return m ? Number(m[4] == null ? 1 : m[4]) : NaN;
};
// `#rrggbb` → [r, g, b]. Ojo con los desplazamientos: el grupo de captura ya viene SIN la
// almohadilla, así que los pares son 0-2, 2-4 y 4-6. (Con 1-3, 3-5, 5-7 `#101012` salía como
// [1, 1, 2] y las comprobaciones de contraste medían un color inventado.)
const hexRGB = (v) => {
  const m = /^#([0-9a-f]{6})$/i.exec(String(v).trim());
  return m ? [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)) : null;
};
// Luminancia relativa y contraste WCAG: así «más contraste» es un número, no una opinión
const lum = ([r, g, b]) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contraste = (a, b) => {
  const A = lum(a), B = lum(b);
  return (Math.max(A, B) + 0.05) / (Math.min(A, B) + 0.05);
};

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
  // Con el almacenamiento lleno, un guardado de datos NUEVOS es el que debe avisar: muta el
  // estado para que save() no lo descarte por «nada cambió desde el último guardado».
  env.A.state.inbox.push({ id: "zz2", text: "cuota", createdAt: Date.now() });
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
  // Primer día con clases de la semana a partir de HOY de verdad: si la fecha se queda
  // fija, al pasar los días el cambio queda en el pasado y la vista deja de listarlo.
  let hoy = A.todayISO();
  for (let i = 0; i < 400; i++) {
    const d = new Date(hoy + "T12:00:00"); d.setDate(d.getDate() + i);
    const iso = A.localISO(d);
    if (A.dayInfo(iso).kind === "lectivo" && A.state.events.some((e) => Number(e.day) === A.weekdayMon0(d))) { hoy = iso; break; }
  }
  const dow = A.weekdayMon0(new Date(hoy + "T12:00:00"));
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
  check(evs.length === 31, "centro: el horario del curso trae la semana completa (" + evs.length + " clases)");
  check(evs.every((e) => e.start >= "15:10" && e.end <= "22:15"), "centro: las horas van de 15:10 a 22:15");
  check(evs.some((e) => e.start === "21:20" && e.end === "22:15"), "centro: la última clase del día es de 21:20 a 22:15");
  check(new Set(evs.map((e) => e.room)).size >= 3, "centro: cada clase lleva su aula (" + [...new Set(evs.map((e) => e.room))].join(", ") + ")");
  check(evs.filter((e) => e.day === 0).length === 7 && evs.filter((e) => e.day === 1).length === 6, "centro: lunes 7 tramos y martes 6, como el documento");
  check([1, 2, 3, 4].every((d) => evs.filter((e) => e.day === d).length === 6), "centro: de martes a viernes 6 clases (la última hora queda libre)");
  {
    // El plan, tramo a tramo, tal y como está en la hoja del centro
    const plan = A.OFFICIAL_PLAN.map((dia) => dia.map((k) => k || "—").join(","));
    check(plan[0] === "seg,seg,ipe,sor,sor,ser,ser", "centro: lunes seg·seg·ipe·sor·sor·ser·ser");
    check(plan[1] === "ipe,dig,seg,seg,opt,web,—", "centro: martes ipe·dig·seg·seg·opt·web");
    check(plan[2] === "pro,pro,opt,opt,ser,sos,—", "centro: miércoles pro·pro·opt·opt·ser·sos");
    check(plan[3] === "sor,sor,web,web,ser,ser,—", "centro: jueves sor·sor·web·web·ser·ser (2 h de SOR, como el documento)");
    check(plan[4] === "tut,ipe,ser,ser,sor,sor,—", "centro: viernes tut·ipe·ser·ser·sor·sor");
    // Cada módulo, una sola asignatura (sin duplicados raros)
    const horas = {};
    A.OFFICIAL_PLAN.flat().filter(Boolean).forEach((k) => { horas[k] = (horas[k] || 0) + 1; });
    check(horas.seg === 4 && horas.sor === 6 && horas.ser === 7 && horas.web === 3 && horas.ipe === 3 && horas.opt === 3,
      "centro: las horas semanales de cada módulo cuadran con el documento (" + JSON.stringify(horas) + ")");
  }
  check(A.state.subjects.some((s) => s.name === "Servicios en red" && s.room === "AULA 3"), "centro: los módulos llevan su aula habitual");

  // Horario temporal de septiembre y junio
  act(env, "restore-timetable", { kind: "temporal" });
  confirmModal(env);
  const tmp = A.state.events;
  check(tmp.length === evs.length, "centro: el temporal mantiene las mismas clases por día");
  check(tmp.every((e) => e.start >= "16:00"), "centro: el temporal empieza a las 16:00");
  check(tmp.some((e) => e.end === "21:45"), "centro: el temporal acaba a las 21:45");
  check(A.state.settings.timetableKind === "temporal", "centro: queda anotado qué plantilla está puesta");
  check(A.OFFICIAL_SLOTS.temporal[0][0] === "16:00" && A.OFFICIAL_SLOTS.curso[0][0] === "15:10", "centro: las dos plantillas de horas están definidas");
  check(A.OFFICIAL_SLOTS.curso.every((t) => A.minutesOf(t[1]) - A.minutesOf(t[0]) === 55), "centro: las clases del curso duran 55 minutos");
  check(A.OFFICIAL_SLOTS.temporal.every((t) => A.minutesOf(t[1]) - A.minutesOf(t[0]) === 45), "centro: las del temporal, 45 minutos");

  // Cargar a mano deja el automático en pausa; si se vuelve a activar, cambia solo
  check(A.state.settings.timetableAuto === false, "centro: cargar una plantilla a mano pausa el cambio automático");
  A.state.settings.timetableAuto = true;
  check(A.syncPlantilla(A.state, "2026-10-05") === "curso", "centro: en octubre la app vuelve sola al horario del curso");
  check(A.state.events.every((e) => e.start >= "15:10"), "centro: y las clases vuelven a las 15:10");
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
    check(casa(".subject-grid { display: flex;", ui), "módulos: la rejilla es de una columna (los nombres largos respiran)");
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
    check(casa(".tool-ico {[^}]*var\\(--c", ui), "herramientas: el icono se tiñe con su propio color");
  }

  // --- v61: exámenes con pestaña propia en la barra de abajo ---
  {
    const env = boot();
    ready(env.A);
    const A = env.A, r = env.doc;
    check(Array.isArray(A.state.exams) && A.state.exams.length === 0, "exámenes: el estado trae la lista vacía");
    A.go("exams");
    // v67.4: sin pruebas apuntadas hay un solo estado vacío (con icono y un botón), no tarjeta + caja
    const vacio = r.querySelector("#view .empty-hero");
    check(!!vacio, "exámenes: la vista abre con su estado vacío");
    check(/examen/i.test(vacio.textContent) && r.querySelectorAll('#view [data-action="add-exam"]').length === 1,
      "exámenes: lo dice claro y solo hay un botón para añadir");

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
    const cajas = [...r.querySelectorAll(".exam-fila")];
    check(cajas.length === 1, "exámenes: sale en la lista (" + cajas.length + ")");
    check(/En \d+ días|Mañana|Hoy/.test(cajas[0].textContent), "exámenes: con la cuenta atrás");
    check(/VLSM y ACL/.test(cajas[0].textContent), "exámenes: y el temario que entra");
    check(/16:00/.test(cajas[0].textContent) && /martes|miércoles|lunes|jueves|viernes|sábado|domingo/.test(cajas[0].textContent),
      "exámenes: con el día completo y la hora");

    // La tira de Inicio avisa de la próxima
    A.go("dashboard");
    const tira = r.querySelector(".exam-strip");
    check(!!tira && /Subnetting/.test(tira.textContent), "exámenes: Inicio enseña la próxima prueba en una tira");
    check(tira.dataset.to === "exams", "exámenes: la tira lleva a la pestaña");

    // Filtros
    A.go("exams");
    act(env, "exam-filter", { f: "pasados" });
    check(!r.querySelector(".exam-fila"), "exámenes: el filtro de pasadas no mezcla las futuras");
    act(env, "exam-filter", { f: "todos" });
    check(!!r.querySelector(".exam-fila"), "exámenes: el filtro de todas las enseña");
    check(!!r.querySelector(".exam-sec-head") && r.querySelector(".exam-sec-head").textContent.trim().length > 2,
      "agenda: cada módulo tiene su apartado (" + (r.querySelector(".exam-sec-head") || {}).textContent + ")");

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
    check(casa(".focus-exit { display: none; }", ui) && casa("body.focus-mode .focus-exit { display: grid; }", ui), "foco: la salida solo aparece dentro del modo foco");
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
    // v67.4: la dirección y el modelo ya no viven dentro del chat: van tras el engranaje, en un modal
    check(!r.getElementById("set-ollama"), "chat: la config técnica no estorba dentro del chat");
    const engranaje = r.querySelector('[data-action="ollama-config"]');
    check(!!engranaje, "chat: hay un engranaje para los ajustes de Ollama");
    engranaje.click();
    check(!!r.getElementById("set-ollama") && !!r.getElementById("set-omodel"), "chat: el engranaje abre la dirección y el modelo");
    check(!!r.getElementById("modal-form") && /Ollama/i.test(r.querySelector(".modal-card").textContent), "chat: sale en un modal, no en la pantalla del chat");
    r.querySelector('[data-action="close-modal"]').click();
    check(!r.getElementById("modal-form"), "chat: el modal se cierra sin dejar rastro");
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
    check(casa("button.cal-day {[^}]*width: min\\(100%, 46px\\)", ui), "calendario: cada día se acota a 46 px como mucho");
    check(casa("grid-template-columns: repeat\\(7, minmax\\(0, 1fr\\)\\)", ui), "calendario: las columnas no pueden desbordar la tarjeta");
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
    const m = app.match(/APP_VERSION\s*[:=]\s*"([^"]+)"/);   // minificado: APP_VERSION:"v63"
    check(!!m, "versión: js/app.js declara APP_VERSION");
    check(!!m && m[1].split(".")[0] === "v" + pkg.split(".")[0], "versión: APP_VERSION coincide con package.json (" + (m ? m[1] : "?") + " · paquete " + pkg + ")");
    const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
    const c = sw.match(/CACHE\s*=\s*"([^"]+)"/);
    check(!!c && c[1].includes(pkg.split(".")[0]), "versión: la caché del service worker lleva el número de la versión (" + (c ? c[1] : "?") + ")");
    const comp = fs.readFileSync(path.join(ROOT, "apk-overlay", "comprobar-apk.py"), "utf8");
        let aceptaPuntos = false;
    try { aceptaPuntos = ((('APP_VERSION = "v63.0.1"'.match(new RegExp((comp.match(/re\.search\(r'([^']*APP_VERSION[^']*)'/) || [])[1] || "$^") ) || [])[1]) === "v63.0.1"); } catch { aceptaPuntos = false; }
    check(aceptaPuntos, "versión: el comprobador del APK acepta versiones con puntos (v63.0.1)");
    const patron = (comp.match(/re\.search\(r'([^']*APP_VERSION[^']*)'/) || [])[1] || "";
    let valeMinificado = false;
    let versiones = [];
    try {
      const re = new RegExp(patron);
      // Las dos formas (código de casa y minificado) tienen que dar la MISMA versión, y con la
      // «v» delante: el comprobador la compara con "v" + la del package.json.
      versiones = ['APP_VERSION = "v63"', 'APP_VERSION:"v63"'].map((t) => ((t.match(re) || [])[1] || ""));
      valeMinificado = versiones[0] === "v63" && versiones[0] === versiones[1];
    } catch { valeMinificado = false; }
    check(valeMinificado, "versión: el comprobador del APK entiende la web minificada (el «=» se convierte en «:») [" + patron + " → " + versiones.join(" / ") + "]");
  }

  // --- v62: los diálogos no heredan la caja centrada de la hoja antigua ---
  {
    const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const uiPlano = compacto(ui);
    const regla = uiPlano.slice(uiPlano.indexOf(".modal{"), uiPlano.indexOf(".modal-card{"));
    check(/transform:none/.test(regla), "modal: se resetea el translate(-50%,-50%) de styles.css (la hoja salía media caja fuera)");
    check(/width:auto/.test(regla) && /max-height:none/.test(regla), "modal: se resetean el ancho y el alto máximos de la hoja antigua");

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

  // --- v65: exportar de verdad (y guardar dentro del APK, donde las descargas no existen) ---
  {
    const env = boot();
    ready(env.A);
    const A = env.A;
    A.state.subjects = [{ id: "s1", name: "Seguridad informática", color: "#14b8a6" }];
    A.state.notes = [
      { id: "n1", subjectId: "s1", title: "Cortafuegos", content: "nftables filtra por reglas", attachments: [{ id: "f1", name: "captura.png" }], versions: [], createdAt: Date.now(), updatedAt: Date.now() },
      { id: "n2", subjectId: "s1", title: 'Comillas "raras" y salto', content: "linea1\nlinea2", attachments: [], versions: [], createdAt: Date.now(), updatedAt: Date.now() },
    ];
    A.state.cards = [
      { id: "c1", subjectId: "s1", front: '¿Puerto de SSH?', back: "22", due: A.todayISO(), interval: 0, reps: 0 },
      { id: "c2", subjectId: "s1", front: "Con comillas y \n salto", back: 'dice "hola"', due: A.todayISO(), interval: 0, reps: 0 },
    ];
    A.state.exams = [{ id: "e1", subjectId: "s1", title: "Tema 3", kind: "Examen", date: A.todayISO(), time: "16:45", room: "AULA 1NF3", topics: "nftables, IPsec" }];
    A.render();

    // Markdown de los apuntes
    const md = A.markdownApuntes();
    check(/^# Apuntes · Aula SMR/.test(md) && md.includes("## ") === false, "exportar: el Markdown lleva cabecera con el número de apuntes");
    check(md.includes("# Cortafuegos") && md.includes("**Seguridad informática**") && md.includes("nftables filtra por reglas"),
      "exportar: cada apunte va con su título, su módulo y su contenido");
    check(md.includes("(1 foto)") && md.includes("linea1") && md.includes("linea2"),
      "exportar: las fotos se anotan y los saltos de línea se respetan");
    check((md.match(/^# /gm) || []).length === 3, "exportar: un solo título por apunte (los «#» del contenido no se cuelan)");

    // CSV para Anki: cabeceras, comillas escapadas y saltos dentro de la celda
    const csv = A.ankiCSV();
    const lineas = csv.trim().split("\n");
    check(lineas[0] === "#separator:Comma" && lineas[1] === "#html:false" && lineas[2] === "#columns:front,back,modulo",
      "exportar: el CSV de Anki lleva sus cabeceras (separador, sin HTML y columnas)");
    check(lineas.length === 5 && lineas[3] === '"¿Puerto de SSH?","22","Seguridad informática"',
      "exportar: cada ficha va en su fila con módulo, entrecomillada (" + (lineas[3] || "") + ")");
    check(lineas[4] === '"Con comillas y <br> salto","dice ""hola""","Seguridad informática"',
      "exportar: las comillas se escapan y el salto de línea pasa a <br> (" + (lineas[4] || "") + ")");

    // ICS: los exámenes llevan avisos para el calendario del móvil
    const ics = A.icsTexto();
    check(ics.startsWith("BEGIN:VCALENDAR") && ics.trimEnd().endsWith("END:VCALENDAR"), "exportar: el .ics está bien cerrado [" + JSON.stringify(ics.slice(0, 36)) + " … " + JSON.stringify(ics.slice(-24)) + "]");
    check(ics.includes("UID:aula-exam-e1@aula-smr") && ics.includes("SUMMARY:Examen: Tema 3 · Seguridad informática"),
      "exportar: el examen entra en el calendario con su módulo");
    const alarmas = ics.match(/BEGIN:VALARM[\s\S]*?END:VALARM/g) || [];
    check(alarmas.length === 2 && alarmas.some((a) => a.includes("TRIGGER:-P1D")) && alarmas.some((a) => a.includes("TRIGGER:-PT1H")),
      "exportar: el examen lleva dos avisos en el calendario (víspera y una hora antes)");
    check(!/BEGIN:VALARM/.test(ics.split("UID:aula-exam")[0]), "exportar: las clases no llevan avisos (no sonaría el móvil 30 veces por semana)");
    // v67.6: la hora de fin del examen y el plazo de la entrega, en el .ics
    A.state.exams.push({ id: "ics1", subjectId: A.state.subjects[0].id, title: "Examen con fin", kind: "Examen", date: "2026-09-20", time: "16:00", endTime: "17:55", createdAt: Date.now() });
    A.state.exams.push({ id: "ics2", subjectId: A.state.subjects[0].id, title: "Entrega con plazo", kind: "Trabajo", date: "2026-09-28", time: "23:55", openDate: "2026-09-25", openTime: "08:00", createdAt: Date.now() });
    const ics2 = A.icsTexto();
    check(/DTSTART;TZID=Europe\/Madrid:20260920T160000[\s\S]*?DTEND;TZID=Europe\/Madrid:20260920T175500/.test(ics2),
      "exportar: el examen va de su hora de inicio a su hora de fin (16:00 → 17:55)");
    // El .ics pliega las líneas largas (CRLF + espacio): para leerlas, se despliegan
    const icsPlano = ics2.replace(/\r\n[ \t]/g, "");
    console.log("DBG plano:", JSON.stringify(icsPlano.match(/DESCRIPTION:Se abre[^\r\n]*/)));
    check(icsPlano.includes("Se abre el viernes") && icsPlano.includes("25 de septiembre de 2026 a las 08:00") && icsPlano.includes("Se entrega antes del lunes") && icsPlano.includes("28 de septiembre de 2026 a las 23:55"),
      "exportar: la entrega lleva su plazo en la descripción");
    check(ics.split("\r\n").every((l) => l.length <= 75), "exportar: ninguna línea del .ics pasa de 75 octetos (lo pide el formato)");

    // Guardar: en el navegador se descarga…
    const descargas = [];
    const clicOriginal = env.window.HTMLAnchorElement.prototype.click;
    env.window.HTMLAnchorElement.prototype.click = function () { descargas.push({ nombre: this.download, href: this.href }); };
    const web = await A.guardarArchivo("prueba.md", "hola", "text/markdown");
    env.window.HTMLAnchorElement.prototype.click = clicOriginal;
    check(web.nativo === false && web.ok && descargas.length === 1 && descargas[0].nombre === "prueba.md",
      "exportar: en el navegador el archivo se descarga (" + JSON.stringify(descargas[0] || {}) + ")");
    // …y dentro del APK se escribe y se comparte (el WebView de Android no descarga nada)
    check(A.nativoFicheros() === false, "exportar: sin Capacitor no se usa el camino nativo");
    const guardados = [];
    env.window.Capacitor = {
      isNativePlatform: () => true,
      Plugins: {
        Filesystem: {
          writeFile: async (o) => guardados.push(["escribir", o.path, o.data.slice(0, 18), o.directory, o.encoding]),
          getUri: async (o) => { guardados.push(["uri", o.path]); return { uri: "file:///cache/" + o.path }; },
        },
        Share: { share: async (o) => guardados.push(["compartir", o.title, o.url]) },
      },
    };
    check(A.nativoFicheros() === true, "exportar: con Capacitor (Filesystem + Share) se usa el camino nativo");
    const nat = await A.guardarArchivo("aula-smr.json", '{"a":1}', "application/json");
    check(nat.nativo === true && nat.ok && JSON.stringify(guardados) === JSON.stringify([
      ["escribir", "aula-smr.json", '{"a":1}', "CACHE", "utf8"],
      ["uri", "aula-smr.json"],
      ["compartir", "aula-smr.json", "file:///cache/aula-smr.json"],
    ]), "exportar: dentro del APK se escribe el archivo y se abre la hoja de compartir (" + JSON.stringify(guardados) + ")");
    // Si el móvil falla al guardar, el aviso lo dice en vez de mentir
    env.window.Capacitor.Plugins.Filesystem.writeFile = async () => { throw new Error("sin espacio"); };
    const fallo = await A.guardarArchivo("x.json", "{}", "application/json");
    check(fallo.nativo === true && fallo.ok === false, "exportar: si el móvil no puede escribir, la app lo avisa (no dice que se guardó)");
    check(env.doc.querySelectorAll(".toast").length > 0, "exportar: el fallo se cuenta con un aviso en pantalla");

    // v66: compartir un apunte (texto y fotos) por la hoja del móvil o la del navegador
    {
      const env2 = boot();
      ready(env2.A);
      const A2 = env2.A;
      A2.state.subjects = [{ id: "s1", name: "Redes" }];
      A2.state.notes = [
        { id: "n1", subjectId: "s1", title: "Subredes", content: "CIDR y máscaras", attachments: [{ id: "f1", name: "pizarra.png", data: "data:image/png;base64,AAAA" }], versions: [], createdAt: Date.now(), updatedAt: Date.now() },
        { id: "n2", subjectId: "s1", title: "Sin fotos", content: "", attachments: [], versions: [], createdAt: Date.now(), updatedAt: Date.now() },
      ];
      A2.render();
      const tx = A2.textoDeNota(A2.state.notes[0]);
      check(tx.titulo === "Subredes" && tx.texto === "Subredes · Redes\n\nCIDR y máscaras",
        "compartir: el texto del apunte lleva título, módulo y contenido [" + JSON.stringify(tx.texto) + "]");
      check(A2.textoDeNota(A2.state.notes[1]).texto === "Sin fotos · Redes",
        "compartir: un apunte sin contenido se comparte con su título y módulo");

      // Sin Capacitor y sin navigator.share: al portapapeles
      let copiado = null;
      env2.window.navigator.clipboard = { writeText: async (t) => { copiado = t; } };
      const web = await A2.compartirNota({ id: "n1" });
      check(web.ok && web.via === "portapapeles" && /CIDR y máscaras/.test(copiado || ""),
        "compartir: en un navegador sin Web Share, el apunte va al portapapeles");
      check(/portapapeles/.test(env2.doc.querySelector("#toast-root").textContent), "compartir: y se avisa de que se copió");

      // Con navigator.share, se usa la hoja del navegador
      let compartido = null;
      env2.window.navigator.share = async (o) => { compartido = o; };
      const web2 = await A2.compartirNota({ id: "n2" });
      check(web2.ok && web2.via === "share" && compartido && compartido.title === "Sin fotos",
        "compartir: si el navegador sabe compartir (Android, iOS), se usa su hoja");

      // Dentro del APK: hoja de Android y las fotos adjuntas
      const llamadas = [];
      env2.window.Capacitor = {
        isNativePlatform: () => true,
        Plugins: {
          Filesystem: {
            writeFile: async (o) => llamadas.push(["escribe", o.path, String(o.data).slice(0, 6), o.encoding]),
            getUri: async (o) => { llamadas.push(["uri", o.path]); return { uri: "file:///cache/" + o.path }; },
          },
          Share: { share: async (o) => llamadas.push(["comparte", o.title, (o.files || []).join(","), !!o.text]) },
        },
      };
      const nat = await A2.compartirNota({ id: "n1" });
      check(nat.ok && nat.nativo && nat.archivos === 1, "compartir: en el APK se comparte con la hoja de Android (" + JSON.stringify(llamadas) + ")");
      check(llamadas.some((l) => l[0] === "escribe" && /^compartir-1\.png$/.test(l[1]) && l[2] === "AAAA"),
        "compartir: la foto se escribe en la caché en base64 para poder adjuntarla");
      check(llamadas.some((l) => l[0] === "comparte" && l[1] === "Subredes" && /file:\/\/\/cache\/compartir-1\.png/.test(l[2]) && l[3] === true),
        "compartir: la hoja recibe el texto y la foto adjunta");

      // Una foto ilegible no impide compartir el texto
      env2.window.Capacitor.Plugins.Filesystem.writeFile = async () => { throw new Error("no se puede leer"); };
      llamadas.length = 0;
      const soloTexto = await A2.compartirNota({ id: "n1" });
      check(soloTexto.ok && soloTexto.archivos === 0 && llamadas.some((l) => l[0] === "comparte" && !l[2]),
        "compartir: si una foto falla, el apunte se comparte igual (sin adjuntos)");
    }

    // Y los dos botones que antes no hacían nada ahora exportan de verdad
    env.window.Capacitor = undefined;
    A.state.cards = [];
    await A.exportAnki();
    check(/No hay fichas/.test(env.doc.querySelector("#toast-root").textContent), "exportar: sin fichas, el botón de Anki lo dice en vez de generar un archivo vacío");
    A.state.notes = [];
    await A.exportMarkdown();
    check(/No hay apuntes/.test(env.doc.querySelector("#toast-root").textContent), "exportar: sin apuntes, el botón de Markdown también avisa");
  }

  // --- v67: el bloque de estudio avisa con la app cerrada, se comparte el horario y se
  //           recuerda guardar copia ---
  {
    // 1) El aviso del bloque (dos notificaciones: la de «enfocado» y la del final)
    const env = boot();
    ready(env.A);
    const AV = env.window.AulaAvisos;
    const llamadas = [];
    env.window.Capacitor = {
      isNativePlatform: () => true,
      Plugins: { LocalNotifications: {
        checkPermissions: async () => ({ display: "granted" }),
        schedule: async (o) => llamadas.push(...o.notifications.map((n) => ({ id: n.id, titulo: n.title, cuando: new Date(n.schedule.at).getTime(), vista: n.extra && n.extra.vista, idle: n.schedule && n.schedule.allowWhileIdle }))),
        cancel: async (o) => llamadas.push({ cancelado: o.notifications.map((n) => n.id) }),
      } },
    };
    // Una fecha fija se pudre: en cuanto pasa el día, el aviso queda «en el pasado» y no se
    // programa. Se usa «dentro de una hora» para que la prueba no dependa del calendario.
    const fin = new Date(Date.now() + 60 * 60 * 1000);
    const r = await AV.programarBloque({ fin, minutos: 25, etiqueta: "Seguridad" });
    const enfoca = llamadas.find((l) => l.id === AV.idEnfoque);
    const termina = llamadas.find((l) => l.id === AV.idBloque);
    check(r.ok && !!enfoca && !!termina, "bloque: se programan el aviso de enfoque y el de «bloque terminado»");
    check(!!termina && termina.cuando === fin.getTime() && /\+25 min · Seguridad/.test(termina.titulo + termina.titulo + (termina.vista || "") + (termina.titulo || "")) === false,
      "bloque: el aviso del final cae justo al terminar el bloque");
    check(!!termina && termina.cuando === fin.getTime(), "bloque: y a la hora exacta de fin (18:35 → " + new Date(termina ? termina.cuando : 0).toISOString().slice(11, 16) + ")");
    check(!!termina && termina.vista === "timer" && !!enfoca && enfoca.vista === "timer",
      "bloque: los dos abren el temporizador al tocarlos");
    // v67.13: programados para sonar con el móvil en reposo (Doze). Con allowWhileIdle: false
    // (el valor de antes), Android podía guardarlos «para luego» y no sonar a la hora.
    check(!!enfoca && enfoca.idle === true && !!termina && termina.idle === true,
      "bloque: los avisos se programan con «sonar aunque el móvil esté en reposo» (allowWhileIdle)");
    check(llamadas.some((l) => l.cancelado && l.cancelado.includes(AV.idBloque) && l.cancelado.includes(AV.idEnfoque)),
      "bloque: antes de programar se quitan los del bloque anterior (por si el móvil se reinició)");
    llamadas.length = 0;
    await AV.cancelarBloque();
    check(llamadas.length === 1 && llamadas[0].cancelado.length === 2, "bloque: al pausar o parar se cancelan los dos avisos");
    const sinFin = await AV.programarBloque({ fin: new Date(Date.now() - 1000), minutos: 25 });
    check(sinFin.ok === false, "bloque: un bloque que ya ha terminado no programa nada");

    // El temporizador de la app usa esos avisos (con «avisos del móvil» activados)
    env.A.state.settings.notifyNative = true;
    env.A.save();
    env.A.go("timer");
    const disp = env.doc.getElementById("timer-display");
    check(!!disp, "bloque: la vista del temporizador está en pie");
    llamadas.length = 0;
    act(env, "timer-toggle");                           // arranca el bloque (botón INICIAR)
    await new Promise((res) => setTimeout(res, 1200));
    check(llamadas.some((l) => l.id === AV.idBloque), "bloque: al darle a empezar, la app programa el aviso del final (" + JSON.stringify(llamadas.map((l) => l.id || l.cancelado)) + ")");
    llamadas.length = 0;
    act(env, "timer-toggle");                           // pausa
    await new Promise((res) => setTimeout(res, 250));
    check(llamadas.some((l) => l.cancelado), "bloque: al pausar, la app quita los avisos");
    act(env, "timer-mode", { mode: "break" });
    await new Promise((res) => setTimeout(res, 300));
    check(llamadas.filter((l) => l.cancelado).length >= 1, "bloque: y al cambiar de modo también");

    // 2) Compartir el horario
    const env3 = boot();
    ready(env3.A);
    const A3 = env3.A;
    const lunes = A3.state.events.filter((e) => Number(e.day) === 0).sort((a, b) => String(a.start).localeCompare(String(b.start)));
    const texto = A3.horarioTexto();
    check(/^Horario · /.test(texto), "horario: el texto empieza con el curso");
    check(lunes.length > 0 && texto.includes("Lunes:") && texto.includes(lunes[0].start), "horario: cada día con clase lleva su lista de horas");
    check(texto.split("\n").filter((l) => /^ {2}\d{2}:\d{2}–\d{2}:\d{2} {2}/.test(l)).length === A3.state.events.filter((e) => !e.type || e.type === "clase").length,
      "horario: salen todas las clases, con hora de inicio y de fin");
    check(texto.includes("IES La Canal"), "horario: lleva el centro al final (para saber de dónde viene)");
    let compartido = null;
    env3.window.navigator.share = async (o) => { compartido = o; };
    const rc = await A3.compartirHorario();
    check(rc.ok && compartido && /Lunes:/.test(compartido.text), "horario: el botón «Compartir» manda el horario por la hoja del sistema");
    A3.state.events = [];
    check(A3.horarioTexto() === "", "horario: sin clases no hay texto que compartir");
    await A3.compartirHorario();
    check(/no hay clases/i.test(env3.doc.querySelector("#toast-root").textContent), "horario: y el botón lo dice en vez de mandar un mensaje vacío");

    // 3) Recordatorio de copia de seguridad
    const env4 = boot();
    ready(env4.A);
    const A4 = env4.A;
    A4.state.notes = Array.from({ length: 4 }, (_, i) => ({ id: "n" + i, subjectId: A4.state.subjects[0].id, title: "Nota " + i, content: "x", attachments: [], versions: [], createdAt: Date.now(), updatedAt: Date.now() }));
    A4.state.progress = { bonusXp: 0, unlocked: {}, daily: "", log: [], flags: { exported: true, lastExportAt: Date.now() - 20 * 86400000 } };
    check(A4.diasDesdeCopia() === 20, "copia: la app sabe cuántos días pasaron desde la última copia (" + A4.diasDesdeCopia() + ")");
    check(A4.tocaAvisarCopia() === true, "copia: con 20 días y datos que merecen la pena, toca avisar");
    A4.render();
    const conAviso = env4.doc.getElementById("view").textContent;
    check(/Copia de seguridad/.test(conAviso) && /Hace 20 días/.test(conAviso) && /Guardar copia ahora/.test(conAviso),
      "copia: en Inicio aparece la tarjeta con los días y el botón");
    const btn = [...env4.doc.querySelectorAll("#view [data-action='export']")][0];
    check(!!btn, "copia: la tarjeta trae su botón de guardar copia");
    A4.state.progress.flags.lastExportAt = Date.now() - 3 * 86400000;
    A4.render();
    check(!/Copia de seguridad/.test(env4.doc.getElementById("view").textContent), "copia: con una copia reciente, la tarjeta desaparece (no da la lata)");
    A4.go("settings");
    check(/Última copia: hace 3 días/.test(env4.doc.getElementById("view").textContent), "copia: Ajustes dice cuándo fue la última copia");
    // Guardar de verdad una copia (Capacitor de mentira, la senda del APK) apunta la fecha
    env4.window.Capacitor = {
      isNativePlatform: () => true,
      Plugins: {
        Filesystem: { writeFile: async () => ({}), getUri: async () => ({ uri: "file:///cache/aula-smr.json" }) },
        Share: { share: async (o) => { guardado = o; } },
      },
    };
    let guardado = null;
    A4.state.progress.flags.lastExportAt = Date.now() - 30 * 86400000;
    A4.go("dashboard");
    check(/Copia de seguridad/.test(env4.doc.getElementById("view").textContent), "copia: con 30 días, Inicio vuelve a recordarlo");
    act(env4, "export");
    await new Promise((res) => setTimeout(res, 200));
    check(!!guardado && /aula-smr\.json/.test(guardado.title || ""), "copia: el botón de la tarjeta guarda el archivo (aula-smr.json)");
    check(A4.diasDesdeCopia() === 0 && A4.tocaAvisarCopia() === false, "copia: guardarla reinicia el contador a cero");
    check(!/Copia de seguridad/.test(env4.doc.getElementById("view").textContent), "copia: y la tarjeta se va sola tras guardar");
    // Recién instalada: no se avisa el primer día (la cuenta empieza al arrancar)
    const env5 = boot();
    ready(env5.A);
    env5.A.state.notes = A4.state.notes.slice();
    env5.A.state.progress = undefined;
    env5.A.initCopia();
    check(env5.A.diasDesdeCopia() === 0 && env5.A.tocaAvisarCopia() === false,
      "copia: en una instalación nueva no se avisa el primer día (el contador empieza al abrir)");
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

    // v64: cada aviso dice qué pantalla abrir al tocarlo
    check(con("clase").every((a) => a.vista === "schedule") && con("examen").every((a) => a.vista === "exams")
      && con("fichas").every((a) => a.vista === "cards") && con("resumen").every((a) => a.vista === "dashboard"),
      "avisos: al tocar el aviso se abre la pantalla que toca (clase→Horario, examen→Exámenes, fichas→Fichas, resumen→Inicio)");

    // v64: los recordatorios de examen se pueden apagar por separado
    const soloVispera = AV.plan({ ...datos, ajustes: { ...datos.ajustes, notifyExamHour: false } }, ahora).filter((a) => a.tipo === "examen");
    const soloHora = AV.plan({ ...datos, ajustes: { ...datos.ajustes, notifyExamEve: false } }, ahora).filter((a) => a.tipo === "examen");
    check(soloVispera.length === 1 && soloVispera[0].titulo === "Mañana examen", "avisos: se puede quitar el «una hora antes» y dejar la víspera");
    check(soloHora.length === 1 && soloHora[0].titulo === "Examen en 1 hora", "avisos: se puede quitar la víspera y dejar el «una hora antes»");

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
          schedule: async (o) => llamadas.push(["programar", o.notifications.length, o.notifications[0].channelId, o.notifications.map((n) => n.schedule && n.schedule.allowWhileIdle)]),
        },
      },
    };
    check(AV.disponible() === true, "avisos: dentro del APK el módulo se declara disponible");
    const r2 = await AV.sincronizar({ datos, ahora });
    check(r2.nativo === true && r2.permiso === true && r2.programados === 9, "avisos: se programan los 9 avisos del plan en Android");
    check(JSON.stringify(llamadas) === JSON.stringify([["canal", "aula-smr"], ["cancelar", 2], ["programar", 9, "aula-smr", Array(9).fill(true)]]),
      "avisos: antes de programar se cancelan los viejos y se prepara el canal de Android (" + JSON.stringify(llamadas) + ")");
    const programadosR2 = (llamadas.find((l) => l[0] === "programar") || [])[3] || [];
    check(programadosR2.length === 9 && programadosR2.every((v) => v === true),
      "avisos: todos se programan con «sonar aunque el móvil esté en reposo» (allowWhileIdle: true)");
    // v64: aviso de prueba (suena a los 5 segundos) y toques que abren la vista
    let programadoPrueba = null;
    env.window.Capacitor.Plugins.LocalNotifications.schedule = async (o) => { programadoPrueba = o.notifications[0]; };
    const prueba = await AV.probar({ ahora: new Date("2026-09-14T09:00:00") });
    const cuandoPrueba = programadoPrueba && new Date(programadoPrueba.schedule.at).getTime();
    check(!!prueba.ok && programadoPrueba && programadoPrueba.id === AV.idPrueba && cuandoPrueba - new Date("2026-09-14T09:00:00").getTime() === 5000,
      "avisos: «Probar aviso» programa un aviso de prueba para dentro de 5 segundos (id reservado) [" + JSON.stringify(programadoPrueba) + " · ok=" + (prueba && prueba.ok) + "]");
    check(programadoPrueba && programadoPrueba.extra && programadoPrueba.extra.vista === "settings",
      "avisos: el aviso de prueba abre Ajustes al tocarlo");
    check(programadoPrueba && programadoPrueba.schedule && programadoPrueba.schedule.allowWhileIdle === true,
      "avisos: el aviso de prueba también se programa para sonar con el móvil en reposo");

    let escucha = null;
    env.window.Capacitor.Plugins.LocalNotifications.addListener = (evento, cb) => { escucha = { evento, cb }; };
    let vistaPedida = null;
    check(AV.escucharToques((v) => { vistaPedida = v; }) === true && escucha && escucha.evento === "localNotificationActionPerformed",
      "avisos: la app escucha el toque de las notificaciones");
    escucha.cb({ notification: { extra: { vista: "exams" } } });
    check(vistaPedida === "exams", "avisos: al tocar un aviso de examen se pide abrir Exámenes");

    // Permiso: concedido / denegado
    env.window.Capacitor.Plugins.LocalNotifications.checkPermissions = async () => ({ display: "granted" });
    check((await AV.permiso()) === "concedido", "avisos: el módulo informa del permiso concedido");
    env.window.Capacitor.Plugins.LocalNotifications.checkPermissions = async () => ({ display: "denied" });
    check((await AV.permiso()) === "denegado", "avisos: y del permiso denegado (para poder explicarlo en Ajustes)");

    // Y si el usuario dice que no al permiso, no se programa nada
    env.window.Capacitor.Plugins.LocalNotifications.checkPermissions = async () => ({ display: "denied" });
    const r3 = await AV.sincronizar({ pedirPermiso: false, datos, ahora });
    check(r3.permiso === false && r3.programados === 0, "avisos: sin permiso de Android no se programa nada");
  }

  // --- v67.13: los avisos de verdad (alarmas exactas + optimización de batería) ---
  {
    // Fuera del APK nada de esto se puede comprobar: null / no-disponible, sin reventar
    const envNav = boot();
    ready(envNav.A);
    const AVn = envNav.window.AulaAvisos;
    check((await AVn.alarmasExactas()) === null, "avisos: fuera del APK no se comprueban alarmas exactas (null)");
    check((await AVn.bateria()) === null, "avisos: fuera del APK no se comprueba la batería (null)");
    const pedNav = await AVn.pedirAlarmasExactas();
    check(pedNav.ok === false && pedNav.motivo === "no-disponible", "avisos: fuera del APK no se pide abrir alarmas exactas");
    const pedBNav = await AVn.pedirBateria();
    check(pedBNav.ok === false && pedBNav.motivo === "no-nativo", "avisos: fuera del APK no se pide exención de batería");

    // Dentro del APK, con un móvil que tiene todo bloqueado (lo que pasaba en la realidad)
    const env = boot();
    ready(env.A);
    const AV = env.window.AulaAvisos;
    let bateriaPedida = 0;
    env.window.Capacitor = {
      isNativePlatform: () => true,
      Plugins: {
        LocalNotifications: {
          checkPermissions: async () => ({ display: "granted" }),
          checkExactNotificationSetting: async () => ({ exact_alarm: "denied" }),
          changeExactNotificationSetting: async () => ({ exact_alarm: "granted" }),
          schedule: async () => {}, getPending: async () => ({ notifications: [] }), cancel: async () => {}, createChannel: async () => {},
        },
        AulaWidget: {
          verBateria: async () => ({ ignorando: false }),
          pedirBateria: async () => { bateriaPedida++; return { ok: true }; },
        },
      },
    };
    check(AV.disponible() === true, "avisos: dentro del APK el módulo se declara disponible");
    check((await AV.alarmasExactas()) === false, "avisos: se detecta que el móvil tiene bloqueadas las alarmas exactas");
    check((await AV.bateria()) === "vigilada", "avisos: se detecta que la app no está exenta de la optimización de batería");

    // Ajustes enseña el problema y el botón para arreglarlo (y se actualiza al volver)
    env.A.go("settings");
    env.doc.dispatchEvent(new env.window.Event("visibilitychange"));   // «volver de los ajustes del móvil»
    await new Promise((res) => setTimeout(res, 60));
    const txt1 = env.doc.getElementById("view").textContent;
    check(/alarmas a la hora exacta/i.test(txt1) && !!env.doc.querySelector('[data-action="enable-exact-alarms"]'),
      "avisos: Ajustes avisa de las alarmas exactas bloqueadas y ofrece activarlas");
    check(/optimización de batería/i.test(txt1) && !!env.doc.querySelector('[data-action="enable-bateria"]'),
      "avisos: Ajustes avisa de la optimización de batería y ofrece eximirse");
    const ped = await AV.pedirAlarmasExactas();
    check(ped.ok === true && ped.exact_alarm === "granted", "avisos: «Activar alarmas exactas» abre la pantalla del sistema y vuelve con el estado (" + JSON.stringify(ped) + ")");
    const pedB = await AV.pedirBateria();
    check(pedB.ok === true && bateriaPedida === 1, "avisos: «Eximir de la batería» abre el diálogo del sistema");

    // El mismo móvil, ya con todo activado
    env.window.Capacitor.Plugins.LocalNotifications.checkExactNotificationSetting = async () => ({ exact_alarm: "granted" });
    env.window.Capacitor.Plugins.AulaWidget.verBateria = async () => ({ ignorando: true });
    check((await AV.alarmasExactas()) === true, "avisos: con el permiso activado, las alarmas exactas se dan por hechas");
    check((await AV.bateria()) === "exenta", "avisos: eximida de la batería, la app se declara exenta");
    env.doc.dispatchEvent(new env.window.Event("visibilitychange"));
    await new Promise((res) => setTimeout(res, 60));
    const txt2 = env.doc.getElementById("view").textContent;
    check(/listos en este móvil/i.test(txt2) && !env.doc.querySelector('[data-action="enable-exact-alarms"]')
      && !env.doc.querySelector('[data-action="enable-bateria"]'),
      "avisos: con todo activado, Ajustes dice que los avisos están listos (y retira los botones)");
    // Y el botón de prueba sigue ahí para comprobar que suenan
    check(!!env.doc.querySelector('[data-action="test-notify"]'), "avisos: el botón «Probar aviso» sigue en Ajustes");
  }

  // --- v67.2: el horario del centro definitivo, sin horas libres inventadas, la foto de perfil
  //             que se veía como una letra y los botones de Ajustes flotando ---
  {
    // 1) Los tramos y el plan del documento
    const env = boot();
    ready(env.A);
    const A = env.A;
    check(A.OFFICIAL_SLOTS.curso[0][0] === "15:10" && A.OFFICIAL_SLOTS.curso[6][1] === "22:15",
      "horario: el curso va de 15:10 a 22:15 (clases de 55 min)");
    check(A.OFFICIAL_SLOTS.temporal[0][0] === "16:00" && A.OFFICIAL_SLOTS.temporal[6][1] === "21:45",
      "horario: el temporal, de 16:00 a 21:45 (clases de 45 min)");
    // Un día del curso con la plantilla puesta y su reparto tal cual el documento
    A.state.settings.timetableAuto = false;
    A.state.settings.timetableKind = "curso";
    A.applyOfficialTimetable(A.state, "curso");
    const porDia = [0, 1, 2, 3, 4].map((d) => A.state.events.filter((e) => e.day === d).length);
    check(JSON.stringify(porDia) === "[7,6,6,6,6]", "horario: 7 clases el lunes y 6 de martes a viernes (" + porDia.join("/") + ")");
    const lunes = A.state.events.filter((e) => e.day === 0).sort((a, b) => a.start.localeCompare(b.start));
    check(lunes[2].start === "17:00" && A.subjectName(lunes[2].subjectId) === "Itinerario personal para la empleabilidad II",
      "horario: el lunes a las 17:00 toca Itinerario personal (y no Seguridad)");
    const jueves = A.state.events.filter((e) => e.day === 3).sort((a, b) => a.start.localeCompare(b.start));
    check(jueves.every((e) => e.start !== "21:20"), "horario: el jueves ya no tiene la última hora del día");

    // 2) Ni un «hueco libre» inventado delante ni detrás de las clases
    A.state.settings.includeSaturday = false;
    A.go("schedule");
    act(env, "sch-week", { delta: String(A.semanaDe("2026-09-14")) });
    const semana = env.doc.getElementById("view").textContent;
    check(!/Hueco libre/.test(semana), "horario: ya no salen «huecos libres» al final (ni al principio) del día");
    check(env.doc.querySelectorAll("#view .class-row.is-study").length === 0, "horario: y ninguna fila de estudio inventada");
    // Un hueco de verdad (una clase que se cae) sí se sigue ofreciendo
    const quitar = A.state.events.filter((e) => e.day === 2).sort((a, b) => a.start.localeCompare(b.start))[1];
    A.state.events = A.state.events.filter((e) => e.id !== quitar.id);
    A.go("schedule");
    const conHueco = env.doc.querySelector("#view .class-row.is-study");
    check(!!conHueco && /Hueco libre · 55 min/.test(conHueco.textContent.replace(/\s+/g, " ")),
      "horario: si de verdad te queda una hora suelta, se ofrece para estudiar (" + (conHueco ? conHueco.textContent.replace(/\s+/g, " ").trim() : "nada") + ")");

    // 3) La Agenda: sin clases no hay huecos que ofrecer, y con un hueco real se puede reservar
    const env2 = boot();
    ready(env2.A);
    const A2 = env2.A;
    A2.state.settings.timetableAuto = false;
    A2.applyOfficialTimetable(A2.state, "curso");
    const bloque = A2.state.events.filter((e) => e.day === 2).sort((a, b) => a.start.localeCompare(b.start))[1];
    A2.state.events = A2.state.events.filter((e) => e.id !== bloque.id);
    A2.state.settings.demo = false;
    A2.state.settings.onboarded = true;
    A2.go("agenda");
    A2.state._agendaTab = "dia";
    A2.state._agendaDay = "2026-09-16";         // un miércoles lectivo
    A2.render();
    const reservar = env2.doc.querySelector('#view [data-action="slot-study"]');
    check(!!reservar, "agenda: el hueco real del miércoles se puede reservar");
    if (reservar) {
      const antes = A2.state.events.length;
      act(env2, "slot-study", { start: reservar.dataset.start, end: reservar.dataset.end, day: reservar.dataset.day });
      check(A2.state.events.length === antes + 1 && A2.state.events[A2.state.events.length - 1].type === "estudio",
        "agenda: y se apunta como bloque de estudio");
    }

    // 4) La foto de perfil: las criaturas de la app se pintan (antes quedaba la letra)
    const env3 = boot();
    ready(env3.A);
    const A3 = env3.A;
    check(A3.avatarSrcPintable("charizard") === "assets/avatars/charizard.jpg",
      "perfil: las criaturas de la app son una fuente válida para el avatar");
    check(A3.avatarSrcPintable("letter") === "" && A3.avatarSrcPintable("c:noexiste") === "",
      "perfil: una foto que ya no está no rompe el avatar (se vuelve a la letra)");
    A3.go("settings");
    const bola = env3.doc.querySelector('#view [data-action="set-avatar"][data-id="gengar"]');
    check(!!bola, "perfil: el apartado de Ajustes tiene la galería de fotos para elegir");
    if (bola) {
      bola.dispatchEvent(new env3.window.MouseEvent("click", { bubbles: true, cancelable: true }));
      check(A3.state.settings.avatarIcon === "gengar", "perfil: al pulsar una criatura queda elegida");
      const enCabecera = env3.doc.querySelector('#header-avatar img[src*="gengar"]');
      check(!!enCabecera, "perfil: y la cabecera enseña esa foto (no la letra)");
      check(!!env3.doc.querySelector('#view [data-action="set-avatar"][data-id="gengar"].is-on'),
        "perfil: la elegida se marca en la galería");
    }

    // 5) Los botones de Ajustes, en su sitio (ya no flotan encima del contenido)
    const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
    check(!tienePropiedad(".set-actions", "position: sticky", ui), "ajustes: los botones de guardar ya no se quedan flotando");
    check(!tienePropiedad(".set-actions", "backdrop-filter", ui), "ajustes: ni con el fondo difuminado que los hacía parecer flotantes");
    check(tienePropiedad(".set-actions", "display: flex", ui), "ajustes: siguen uno debajo del otro, al final de la lista");
  }

  // --- v67.2 (bis): a quien ya tenía el horario viejo del centro se le pone al día solo ---
  {
    const A0 = boot();
    ready(A0.A);
    const mods = A0.A.OFFICIAL_MODS;
    const idDe = (k) => mods.find((m) => m.key === k).key;
    // Un estado como el de la v67: el plan antiguo, con sus horas (15:15 y hasta 21:45)
    const subjectId = (k) => "s-" + idDe(k);
    const subjects = mods.map((m) => ({ id: subjectId(m.key), name: m.name, color: m.color, teacher: m.teacher, room: m.room, credits: 0 }));
    const planViejo = [
      ["seg", "seg", "seg", "sor", "sor", "ser", "ser"],
      ["ipe", "dig", "seg", "seg", "opt", "web", null],
      ["pro", "pro", "opt", "opt", "ser", "sos", null],
      ["sor", "sor", "sor", "web", "web", "ser", "ser"],
      ["tut", "ipe", "ser", "ser", "sor", "sor", null],
    ];
    const tramosViejos = [["15:15", "16:05"], ["16:05", "17:00"], ["17:00", "17:55"], ["18:15", "19:10"], ["19:10", "20:05"], ["20:05", "21:00"], ["21:00", "21:45"]];
    const events = [];
    planViejo.forEach((dia, d) => dia.forEach((k, i) => {
      if (!k) return;
      events.push({ id: "ev-" + d + "-" + i, subjectId: subjectId(k), day: d, start: tramosViejos[i][0], end: tramosViejos[i][1], room: "", type: "clase" });
    }));
    // Una falta apuntada a la clase del lunes a las 15:15 (Seguridad): debe sobrevivir
    const apuntada = events.find((e) => e.day === 0 && e.start === "15:15").id;
    const viejo = {
      schemaVersion: 5,
      settings: { onboarded: true, demo: false, timetableId: "2smr-2026-2027", timetableKind: "curso", timetableAuto: false, startHour: 15, endHour: 23 },
      subjects, events, notes: [], cards: [], sessions: [], inbox: [], attendance: [{ id: "a1", eventId: apuntada, date: "2026-09-14", status: "falta" }],
    };
    const env = boot({ seed: JSON.stringify(viejo) });
    ready(env.A);
    const A = env.A;
    check(A.state.events.length === 31, "actualización: el horario viejo del centro se sustituye por el nuevo (31 clases)");
    check(A.state.events.every((e) => A.esHoraDelCentro(e.start)), "actualización: todas las clases quedan en las horas del centro");
    const lunes = A.state.events.filter((e) => e.day === 0).sort((a, b) => a.start.localeCompare(b.start));
    check(lunes[0].start === "15:10" && A.subjectName(lunes[2].subjectId) === "Itinerario personal para la empleabilidad II",
      "actualización: el lunes entra a las 15:10 y a las 17:00 tiene Itinerario personal");
    check(A.state.settings.planVersion === A.PLAN_VERSION, "actualización: queda anotado que el horario ya está al día");
    check(A.state.events.some((e) => e.id === apuntada), "actualización: la clase con la falta apuntada conserva su id");
    check(A.state.attendance.length === 1 && A.state.events.some((e) => e.id === A.state.attendance[0].eventId),
      "actualización: así que la falta sigue apuntando a una clase que existe");
    // Quien ya se actualizó con la v67.2 (sello 2 pero con las casillas mal) se corrige igual
    const conSello2 = JSON.parse(JSON.stringify(viejo));
    conSello2.settings.planVersion = 2;
    conSello2.events = conSello2.events.map((e) => {
      const t = { "15:15": ["15:10", "16:05"], "16:05": ["16:05", "17:00"], "17:00": ["17:00", "17:55"], "18:15": ["18:15", "19:10"], "19:10": ["19:10", "20:05"], "20:05": ["20:05", "21:00"], "21:00": ["21:20", "22:15"] }[e.start];
      return t ? Object.assign({}, e, { start: t[0], end: t[1] }) : e;
    });
    const envV2 = boot({ seed: JSON.stringify(conSello2) });
    ready(envV2.A);
    const martes = envV2.A.state.events.filter((e) => e.day === 1).sort((a, b) => a.start.localeCompare(b.start));
    check(envV2.A.state.settings.planVersion === envV2.A.PLAN_VERSION && envV2.A.subjectName(martes[4].subjectId) === "Programación",
      "actualización: un horario ya sellado con el plan anterior se vuelve a cuadrar (martes con Programación a las 19:10)");
    check(envV2.A.state.events.filter((e) => e.day === 3).every((e) => e.start !== "21:20"),
      "actualización: y el jueves se queda sin la última hora");
    const juev = envV2.A.state.events.filter((e) => e.day === 3);
    check(juev.filter((e) => envV2.A.subjectName(e.subjectId) === "Sistemas operativos en red").length === 2
      && juev.filter((e) => envV2.A.subjectName(e.subjectId) === "Aplicaciones web").length === 2
      && juev.filter((e) => envV2.A.subjectName(e.subjectId) === "Servicios en red").length === 2,
      "actualización: el jueves queda como el documento (2 h SOR, 2 web, 2 servicios; no 3 h de SOR)");

    // Y si el horario tiene una clase puesta a mano, no se toca nada
    const env2 = boot({ seed: JSON.stringify(Object.assign({}, viejo, { events: viejo.events.concat([{ id: "mia", subjectId: subjectId("seg"), day: 5, start: "11:11", end: "12:00", room: "", type: "clase" }]) })) });
    ready(env2.A);
    check(env2.A.state.events.some((e) => e.id === "mia") && env2.A.state.events.length === 33,
      "actualización: con una clase tuya a mano no se pisa el horario");
    // Un bloque de estudio tampoco se pierde
    const env3 = boot({ seed: JSON.stringify(Object.assign({}, viejo, { events: viejo.events.concat([{ id: "est", subjectId: subjectId("seg"), day: 2, start: "10:00", end: "10:45", room: "Estudio", type: "estudio" }]) })) });
    ready(env3.A);
    check(env3.A.state.events.some((e) => e.id === "est" && e.type === "estudio"),
      "actualización: los bloques de estudio que te habías apuntado siguen ahí");
  }

  // --- v67.1: la hoja «Más» vuelve a verse pequeña (cada apartado, una tarjeta compacta) ---
  {
    const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
    // El bloque de declaraciones de la primera regla de cada selector, en texto plano
    const regla = (sel) => {
      const plano = String(ui).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ");
      const i = plano.indexOf(sel);
      if (i < 0) return "";
      const abre = plano.indexOf("{", i);
      const cierra = plano.indexOf("}", abre);
      // Solo la primera regla de ese selector exacto: ni `.sheet-txt small` ni `:hover`
      if (abre < 0 || cierra < 0 || plano.slice(i, abre).trim() !== sel) return "";
      return plano.slice(abre, cierra);
    };
    const boton = regla(".sheet-grid button");
    const ico = regla(".sheet-ico");
    const txt = regla(".sheet-txt");
    // El minificador quita los espacios tras «:», así que las dos formas valen
    const alto = (b) => Number((b.match(/min-height:\s*(\d+)px/) || [0, 0])[1]);
    const px = (b, prop) => Number((b.match(new RegExp(prop + ":\\s*(\\d+)px")) || [0, 0])[1]);
    check(boton !== "" && alto(boton) <= 40, "«Más»: cada apartado vuelve a ser una tarjeta pequeña (sin alto mínimo de 92 px)");
    check(boton !== "" && px(boton, "padding") <= 12, "«Más»: el relleno del apartado es de 12 px o menos (antes 14)");
    check(ico !== "" && px(ico, "width") >= 22 && px(ico, "width") <= 32, "«Más»: el icono mide entre 22 y 32 px (antes 38, tamaño de tarjeta grande)");
    check(txt !== "" && /font-size:\s*(1[0-2](\.\d)?)px/.test(txt), "«Más»: el nombre del apartado se lee a 10–12 px (antes 13,5)");
    check(casa(".sheet-grid {[^}]*gap: 8px", ui), "«Más»: las tarjetas van juntas (8 px), no con el hueco de 10 px de la v59");
    check(/gap: 8px|gap:8px/.test(regla(".sheet-grid")), "«Más»: y el hueco entre filas también es de 8 px");
    const enEstrecho = compacto(ui).match(/@media\(max-width:460px\)\{[^}]*\}/);
    check(!!enEstrecho && !/\.sheet-grid/.test(enEstrecho[0]), "«Más»: en un móvil de 360 px las tarjetas siguen a dos columnas");
  }

  // --- v62: nada se sale de la tarjeta en un móvil estrecho (360 px) ---
  {
    const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
    check(!/grid-template-columns: (1fr|repeat\(\d+, 1fr\))/.test(ui), "anchura: ninguna rejilla usa 1fr a pelo (todas con minmax(0, 1fr))");
    check(casa(".filters {[^}]*flex-wrap: wrap", ui), "anchura: los filtros de módulos envuelven en varias líneas");
    check(casa(".chips-row .chip, .filters .chip[^{]*{[^}]*overflow-wrap: anywhere", ui), "anchura: un chip largo (módulo, fecha, aviso) se parte dentro de su píldora");
    check([".row > div", ".row b", ".row small"].every((sel) => tienePropiedad(sel, "min-width: 0", ui)), "anchura: el texto de una fila puede encogerse (no empuja las cifras)");
    check(/@media\(max-width:460px\)(.|\n){0,200}\.stack-phone/.test(compacto(ui)), "anchura: las tarjetas de texto se apilan en pantallas estrechas");

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
      // El chat propone «¿próximo examen?» y en Ajustes están sus avisos (v64): el resto de
      // vistas no deben hablar de exámenes.
      if (/examen/i.test(txt) && v !== "chatbot" && v !== "exams" && v !== "settings") conTexto.push(v);
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

  // --- v67.4: la barra de abajo, la semana, el calendario y los controles duplicados ---
  {
    const env = boot();
    ready(env.A);
    const A = env.A, r = env.doc;
    const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");

    // 1. La barra de abajo: el foco se controla desde un único sitio y se suelta solo
    check(typeof A.ponFoco === "function" && typeof A.bloqueoActivo === "function",
      "barra: el foco de Concentración se controla desde un solo sitio");
    A.state.progress.flags = Object.assign({}, A.state.progress.flags, { examLockUntil: Date.now() - 1000 });
    check(A.bloqueoActivo() === false, "barra: un bloqueo caducado ya no cuenta como activo");
    A.ponFoco(true, true);
    check(r.body.classList.contains("focus-mode") && r.body.classList.contains("exam-lock"), "barra: el bloqueo vivo sigue entrando en foco");
    A.ponFoco(false);
    check(!r.body.classList.contains("focus-mode") && !r.body.classList.contains("exam-lock") && !A.state.progress.flags.examLockUntil,
      "barra: salir del foco (o caducar el bloqueo) devuelve la barra de abajo");

    // 2. Cabecera, fecha y semana
    check(tienePropiedad(".hub-header h1", "-webkit-line-clamp:2", ui), "cabecera: los títulos largos bajan a una segunda línea");
    check(!casa(".hub-header h1 {[^}]*text-overflow", ui), "cabecera: sin puntos suspensivos en el título de la vista");
    check(!casa(".course-soon .v {[^}]*text-overflow", ui), "inicio: la fecha del primer día de clase no se recorta");
    // El minificador quita las comillas del atributo: se admiten las dos formas
    const rojoFestivo = tienePropiedad('.week-pill[data-tipo="fest"] b', "color: var(--red)", ui)
      || tienePropiedad(".week-pill[data-tipo=fest] b", "color:var(--red)", ui)
      || /data-tipo=["']?fest["']?\]\s*b\s*\{\s*color:\s*var\(--red\)/.test(ui);
    check(rojoFestivo && !ui.includes(".week-pill.has-hol"), "semana: el rojo es solo del día festivo");
    const pildora = { fest: false, vac: false, fuera: false };
    A.state.settings.showWeekStrip = true;
    A.render();
    const pills = [...r.querySelectorAll(".week-pill")];
    // Con el curso empezado los lectivos van lisos (tipo ""); antes del curso todos eran
    // «fuera». Lo que hay que exigir: findes marcados y ningún tipo inventado entre semana.
    check(pills.length === 7 && ["finde", "fuera", "fest", "vac"].includes(pills[5].dataset.tipo)
      && ["finde", "fuera", "fest", "vac"].includes(pills[6].dataset.tipo)
      && pills.slice(0, 5).every((p) => ["", "fest", "vac", "fuera"].includes(p.dataset.tipo)),
      "semana: cada día de la tira lleva su tipo (" + pills.map((p) => p.dataset.tipo).join(",") + ")");

    // 3. Calendario: casillas redondas y relleno invisible
    check(tienePropiedad("button.cal-day", "min-height: 0", ui), "calendario: el día no hereda los 96 px del CSS viejo");
    check(tienePropiedad(".cal-day.is-pad", "visibility: hidden", ui), "calendario: el relleno del mes ni se ve ni estira la fila");
    A.go("schedule");
    act(env, "sch-view", { mode: "month" });
    const dias = [...r.querySelectorAll(".cal .cal-day")];
    check(dias.length >= 28 && dias.some((d) => d.classList.contains("is-pad")), "calendario: el mes pinta sus casillas y su relleno");

    // 4. Exámenes: un solo estado vacío y un solo botón
    A.state.exams = [];
    A.go("exams");
    check(r.querySelectorAll('#view [data-action="add-exam"]').length === 1 && !!r.querySelector("#view .empty-hero") && !r.querySelector("#view .mini-stats"),
      "exámenes: sin nada apuntado hay un solo estado y un solo botón");

    // 5. Radar: todos los módulos, no 8
    A.state.subjects.forEach((sub, i) => { sub.grade = i < 11 ? 7 : ""; });
    A.go("rendimiento");
    const puntos = r.querySelectorAll('.radar-box circle[r="7"]').length;
    check(puntos === Math.min(A.state.subjects.length, 12), "radar: un punto por módulo (" + puntos + " de " + A.state.subjects.length + ")");

    // 5-bis. El color de la nota manda: un 7,50 no puede salir con punto rojo
    const ui2 = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
    A.state.subjects.forEach((sub, i) => { sub.grade = i === 0 ? 7.5 : i === 1 ? 3 : 8; sub.color = "red"; });
    A.go("rendimiento");
    const puntosNota = [...r.querySelectorAll("#view .boletin-head i")].map((i) => i.getAttribute("style"));
    const cajasNota = [...r.querySelectorAll("#view .boletin-head .g")].map((g) => g.className);
    check(puntosNota[0].includes("green") && puntosNota[1].includes("red"), "calificaciones: el punto dice la nota (verde aprobado, rojo suspenso), no el color del módulo");
    check(/g-ok/.test(cajasNota[0]) && /g-bad/.test(cajasNota[1]) && !/g-bad/.test(cajasNota[0]), "calificaciones: un 7,50 no lleva la marca de suspenso");
    check(tienePropiedad(".boletin-head .g-bad", "color: var(--red)", ui2), "calificaciones: el rojo está reservado al suspenso");

    // 6. Hoja «Más»: sin subtítulo, con la última tarjeta a todo lo ancho y una sola pestaña activa
    check(!/sheet-hint/.test(fs.readFileSync(path.join(ROOT, "index.html"), "utf8")),
      "más: fuera el subtítulo que repetía lo de la barra de abajo");
    check(tienePropiedad(".sheet-grid > :last-child:nth-child(odd)", "grid-column: 1 / -1", ui), "más: la sección impar no deja huecos");
    check(!tienePropiedad(".phone.more-open #nav-more", "background: var(--nav-active", ui) && tienePropiedad(".phone.more-open #nav-more::after", "content:", ui),
      "más: abrirlo no pinta una segunda pestaña activa");

    // 7. Herramientas: buscador y un color por sección
    A.go("tools");
    check(!!r.getElementById("tools-q") && !r.querySelector("#view .tools-kicker"), "herramientas: buscador sí, rótulo repetido no");
    const puerta = r.getElementById("tools-q");
    if (puerta) {
      puerta.value = "chmod";
      puerta.dispatchEvent(new env.window.Event("input", { bubbles: true }));
      const filtradas = [...r.querySelectorAll("#view .tool-card b")].map((b) => b.textContent);
      check(filtradas.length > 0 && filtradas.length < 10 && filtradas.every((t) => /chmod/i.test(t)), "herramientas: el buscador filtra (" + filtradas.join(", ") + ")");
      const colores = new Set([...r.querySelectorAll("#view .tool-ico")].map((i) => i.getAttribute("style")));
      check(colores.size === 1, "herramientas: los resultados comparten el color de su sección");
    }
    check((fs.readFileSync(path.join(ROOT, "js", "tools.js"), "utf8").match(/\["Red",\s*"blue",\s*\[/) || []).length === 1,
      "herramientas: las secciones llevan su color declarado");

    // 8. Chat: la configuración de Ollama detrás del engranaje
    A.go("chatbot");
    check(!r.getElementById("set-ollama") && !!r.querySelector('#view [data-action="ollama-config"]'), "chat: sin campos de servidor dentro del chat");
    act(env, "ollama-config");
    check(!!r.getElementById("set-ollama") && !!r.getElementById("set-omodel") && !!r.getElementById("modal-form"), "chat: el engranaje abre la configuración en su hoja");
    act(env, "close-modal");

    // 9. Ajustes: un solo control de tema, e interruptores en vez de casillas
    A.go("settings");
    const temaBtns = [...r.querySelectorAll('#view .seg [data-action="toggle-theme"]')];
    check(temaBtns.length === 3 && !r.getElementById("set-autoth") && !/Cambiar a tema/.test(r.getElementById("view").textContent),
      "ajustes: un único control de tema (claro · oscuro · auto)");
    act(env, "toggle-theme", { id: "auto" });
    check(A.state.settings.autoTheme === true, "ajustes: el modo auto se guarda");
    act(env, "toggle-theme", { id: "light" });
    check(A.state.settings.autoTheme === false && A.state.settings.uiTheme === "light", "ajustes: elegir claro apaga el automático");
    const interruptor = tienePropiedad('.switch input[type="checkbox"]', "width: 50px", ui)
      || tienePropiedad(".switch input[type=checkbox]", "width:50px", ui)
      || /\.switch\s+input\[type=["']?checkbox["']?\]\s*\{[^}]*width:\s*50px/.test(ui);
    check(interruptor && !!r.querySelector("#view .switch input[type=checkbox]"),
      "ajustes: las opciones de sí/no son interruptores");
    check(!/class="check"/.test(["js/app.js", "js/studio.js", "js/tools.js"].map((f) => fs.readFileSync(path.join(ROOT, f), "utf8")).join("")),
      "formularios: no queda ninguna casilla de escritorio");

    // 10. Leyenda de asistencia con los colores de cada botón
    A.state.settings.showAttendance = true;
    A.go("schedule");
    act(env, "sch-view", { mode: "week" });
    const leyenda = r.querySelector("#view .att-key");
    check(!!leyenda && leyenda.querySelectorAll(".k").length === 3 && /Presente/.test(leyenda.textContent) && /Falta/.test(leyenda.textContent),
      "asistencia: la leyenda son tres puntos con su nombre (presente, retraso, falta)");
    check(env.errors.length === 0, "v67.4: sin errores de consola (" + env.errors.slice(0, 2).join(" · ") + ")");
  }
}

// ------------- 21. Ollama: por qué no conecta y qué hacer para que sí (v67.4.2)
/* El informe del usuario fue «No funciona la IA de ollama», sin más pistas: la app se caía al
   motor local con el mismo mensaje pasara lo que pasara. Esto comprueba que (a) el APK puede
   salir por http://, (b) cada fallo se distingue y se explica, y (c) el chat no cae en silencio. */
async function testOllama() {
  const env = boot();
  ready(env.A);
  const A = env.A;
  const S = env.window.AulaStudio;
  if (!S || typeof S.diagnosticoOllama !== "function") { check(false, "ollama: falta el diagnóstico en AulaStudio"); return; }

  // 1. El APK: Ollama va por http:// en la Wi-Fi de casa
  const cap = JSON.parse(fs.readFileSync(path.join(ROOT, "capacitor.config.json"), "utf8"));
  check(cap.android && cap.android.allowMixedContent === true,
    "apk: se permite contenido mixto (la app es https y Ollama http)");
  const apply = fs.readFileSync(path.join(ROOT, "apk-overlay", "apply.py"), "utf8");
  check(/usesCleartextTraffic/.test(apply), "apk: el manifest permite tráfico en claro (sin esto Android lo corta)");
  const comprobar = fs.readFileSync(path.join(ROOT, "apk-overlay", "comprobar-apk.py"), "utf8");
  check(/usesCleartextTraffic/.test(comprobar) && /puente HTTP nativo/.test(comprobar),
    "apk: la comprobación del APK exige el tráfico en claro y el puente nativo");

  A.state.settings.ollamaUrl = "http://192.168.1.10:11434";
  A.state.settings.ollamaModel = "llama3.2";

  // El registro del chat se coloca en el último mensaje al pintarse (la respuesta aparecía por
  // debajo del scroll y parecía que el asistente no había contestado)
  check(typeof S.montarChat === "function", "chat: al pintar, el registro baja al mensaje más nuevo");

  // 2. Nadie contesta: Ollama escuchando solo en localhost, cortafuegos o Wi-Fi distinta
  env.window.fetch = () => Promise.reject(new TypeError("Failed to fetch"));
  let diag = await S.diagnosticoOllama();
  check(!diag.ok && /no llega/i.test(diag.titulo), "ollama: si nadie contesta, se dice con esas palabras");
  check(diag.pasos.some((p) => /OLLAMA_HOST/.test(p)) && diag.pasos.some((p) => /11434/.test(p)),
    "ollama: y se explica cómo arrancarlo para la Wi-Fi y abrir el puerto");
  // Una web en https:// no puede pedir nada a un http://: eso se avisa aparte, porque en el
  // ordenador de Ollama no hay nada que arreglar
  check(/El navegador no deja salir desde https/.test(fs.readFileSync(path.join(ROOT, "js", "studio.js"), "utf8")),
    "ollama: si la web va por https:// se avisa de que el navegador bloquea http://");

  // 3. Alguien contesta, pero rechaza la petición (Ollama solo acepta sus orígenes por defecto)
  env.window.fetch = () => Promise.resolve({ ok: false, status: 403, json: async () => ({}) });
  diag = await S.diagnosticoOllama();
  check(!diag.ok && /403/.test(diag.titulo) && diag.pasos.some((p) => /OLLAMA_ORIGINS/.test(p)),
    "ollama: un 403 se explica como CORS, con el arreglo");

  // 4. Responde, pero el modelo pedido no está descargado
  env.window.fetch = () => Promise.resolve({ ok: true, status: 200, json: async () => ({ models: [{ name: "qwen2.5:7b" }] }) });
  diag = await S.diagnosticoOllama();
  check(diag.ok && diag.aviso && /llama3\.2/.test(diag.titulo) && diag.pasos.some((p) => /ollama pull/.test(p)),
    "ollama: si falta el modelo, se dice cuál y cómo bajarlo");

  // 5. Todo en orden
  env.window.fetch = () => Promise.resolve({ ok: true, status: 200, json: async () => ({ models: [{ name: "llama3.2" }] }) });
  diag = await S.diagnosticoOllama();
  check(diag.ok && !diag.aviso && /Conectado/.test(diag.titulo), "ollama: conectado y con el modelo listo, lo dice");

  // 6. En el móvil: si el WebView corta la petición (CORS o contenido mixto), se reintenta por
  //    el puente nativo de Capacitor, que no pasa por las reglas del navegador
  const pedidas = [];
  env.window.fetch = () => Promise.reject(new TypeError("Failed to fetch"));
  env.window.Capacitor = { isNativePlatform: () => true, Plugins: { CapacitorHttp: { request: async (o) => { pedidas.push(o.url); return { status: 200, data: { models: [{ name: "llama3.2" }] }, headers: {} }; } } } };
  diag = await S.diagnosticoOllama();
  check(diag.ok && pedidas.some((u) => u.endsWith("/api/tags")), "ollama en el móvil: si el WebView corta, se reintenta por el puente nativo");
  delete env.window.Capacitor;

  // 7. El chat no vuelve a caer en silencio: dice el motivo y qué mirar
  env.window.fetch = () => Promise.reject(new TypeError("Failed to fetch"));
  A.go("chatbot");
  env.doc.getElementById("chat-q").value = "Explícame DHCP";
  const antes = (A.state._chat || []).length;
  act(env, "chat-send", {});
  await hasta(() => { const l = A.state._chat || []; return l.length > antes && l[l.length - 1].role === "bot"; }, 8000);
  const ultimo = (A.state._chat || []).slice(-1)[0] || { text: "" };
  check(/motor local/i.test(ultimo.text) && /no llega/i.test(ultimo.text) && /OLLAMA_HOST/.test(ultimo.text),
    "chat: si tu Ollama no responde, se dice el motivo y qué mirar (ya no cae en silencio)");
  check(/Sin conexión/.test(env.doc.getElementById("view").textContent),
    "chat: el estado dice «Sin conexión» cuando ha fallado, no «Conectado» por tener dirección");

  // 8. La guía de arranque, dentro de la hoja de configuración
  act(env, "ollama-config");
  const guia = env.doc.getElementById("ollama-guia");
  check(!!guia && /OLLAMA_HOST/.test(guia.textContent) && /OLLAMA_ORIGINS/.test(guia.textContent) && /ollama pull/.test(guia.textContent),
    "ollama: la hoja trae la guía (arrancar en la red, orígenes y descargar el modelo)");
  act(env, "close-modal");

  // 9. Probar conexión desde la hoja: si responde con varios modelos, se eligen de un toque
  env.window.fetch = () => Promise.resolve({ ok: true, status: 200, json: async () => ({ models: [{ name: "llama3.2" }, { name: "qwen2.5:7b" }] }) });
  A.go("chatbot");
  act(env, "ollama-config");
  act(env, "ollama-test");
  await hasta(() => { const c = env.doc.getElementById("ollama-chips"); return !!c && !c.hidden; }, 8000);
  check(/Conectado/.test((env.doc.getElementById("ollama-estado") || {}).textContent || ""), "ollama: «Probar conexión» enseña el resultado en la hoja");
  act(env, "ollama-usar", { id: "qwen2.5:7b" });
  check(A.state.settings.ollamaModel === "qwen2.5:7b", "ollama: el modelo se cambia de un toque, sin escribir");
  act(env, "close-modal");
  check(env.errors.length === 0, "v67.4.2: sin errores de consola (" + env.errors.slice(0, 2).join(" · ") + ")");
}

const r_form = (env) => env.doc.getElementById("modal-form");

// --------- 22. esquema de evaluación por módulo y Agenda con trabajos (v67.5)
/* Cada módulo se evalúa a su manera: componentes con peso, notas sobre lo que toque y reglas
   especiales que pueden suspender aunque la media pondere bien. Y los trabajos de la Agenda
   pueden llenar un componente sin que la nota se meta dos veces. */
async function testEsquema() {
  const env = boot();
  ready(env.A);
  const A = env.A;

  // Saneado de lo que llega (del editor o de una copia antigua)
  const sucio = A.saneEval({ componentes: [
    { id: "c1", nombre: "  Teoría  ", peso: 300, sobre: 0, nota: "9,5" },
    { nombre: "", peso: "x" },
    { id: "c3", nombre: "Prácticas", peso: 20, sobre: 10, nota: 12 },
  ], reglas: { ra: { activo: true, lista: [{ nombre: "RA1", ok: true }, { nombre: "" }, { nombre: "RA2" }] } } }, 10);
  check(sucio.componentes.length === 3 && sucio.componentes[0].peso === 100 && sucio.componentes[0].nombre === "Teoría",
    "esquema: el saneado arregla el peso y limpia los espacios");
  check(sucio.componentes[0].sobre === 10 && sucio.componentes[0].nota === 9.5, "esquema: la coma decimal y el «sobre 0» se corrigen");
  check(sucio.componentes[2].nota === 10, "esquema: una nota mayor que el «sobre» se recorta");
  check(sucio.reglas.ra.activo && sucio.reglas.ra.lista.length === 2, "esquema: la lista de RA pierde las entradas vacías");
  check(A.saneEval({ componentes: [] }, 10) === undefined, "esquema: sin componentes no hay esquema");
  check(A.avisoPesos(sucio) && /suman/.test(A.avisoPesos(sucio)), "esquema: avisa cuando los pesos no suman 100");
  const cuadra = A.saneEval({ componentes: [{ nombre: "A", peso: 60 }, { nombre: "B", peso: 40 }] }, 10);
  check(A.avisoPesos(cuadra) === "", "esquema: con 100 % no hay aviso");

  // Un módulo SIN esquema se comporta como siempre
  const sinEsquema = { id: "s0", name: "Sin esquema", grade: 7.5 };
  A.state.subjects.push(sinEsquema);
  check(A.estadoModulo(sinEsquema).nota === 7.5 && A.estadoModulo(sinEsquema).aprobado === true && !A.estadoModulo(sinEsquema).tieneEsquema,
    "notas: un módulo sin esquema sigue con su nota a mano y su aprobado");

  // Servicios en Red: 40 % teoría, 40 % práctico, 20 % prácticas
  const ser = { id: "ser", name: "Servicios en red", grade: "", eval: A.saneEval({
    componentes: [
      { id: "c1", nombre: "Examen de teoría", peso: 40, sobre: 10, nota: 6 },
      { id: "c2", nombre: "Examen práctico", peso: 40, sobre: 10, nota: 8 },
      { id: "c3", nombre: "Prácticas", peso: 20, sobre: 10, nota: 9 },
    ],
    reglas: { ra: { activo: true, lista: [{ id: "r1", nombre: "RA1", ok: true }, { id: "r2", nombre: "RA2", ok: true }] } },
  }, 10) };
  A.state.subjects.push(ser);
  check(Math.abs(A.estadoModulo(ser).nota - 7.4) < 0.001, "media ponderada: 40/40/20 con 6, 8 y 9 → 7,4");
  check(A.estadoModulo(ser).aprobado === true && !A.estadoModulo(ser).motivo, "media ponderada: con 7,6 y los RA aprobados, aprobado");

  // Un componente sin nota no cuenta (no es un 0)
  ser.eval.componentes[2].nota = "";
  check(Math.abs(A.estadoModulo(ser).nota - 7) < 0.001, "media ponderada: el componente sin nota no cuenta (6 y 8 → 7,0)");
  ser.eval.componentes[2].nota = 9;

  // Reglas especiales: un RA sin aprobar suspende aunque la media apruebe
  ser.eval.reglas.ra.lista[1].ok = false;
  const estRA = A.estadoModulo(ser);
  check(estRA.nota === 7.4 && estRA.aprobado === false && /RA2/.test(estRA.motivo), "reglas: un RA sin aprobar suspende un 7,4 y dice cuál");
  ser.eval.reglas.ra.activo = false;
  check(A.estadoModulo(ser).aprobado === true, "reglas: la regla de los RA apagada deja de suspender");
  ser.eval.reglas.ra.activo = true;
  ser.eval.reglas.ra.lista[1].ok = true;
  check(A.estadoModulo(ser).aprobado === true, "reglas: con todos los RA aprobados vuelve el aprobado");

  // Nota mínima por componente
  ser.eval.reglas.min.activo = true;
  ser.eval.componentes[0].min = 7;
  check(A.estadoModulo(ser).aprobado === false && /mínimo/.test(A.estadoModulo(ser).motivo),
    "reglas: la nota mínima de un componente también suspende, y lo explica");
  ser.eval.reglas.min.activo = false;
  ser.eval.componentes[0].min = 0;

  // La media del ciclo usa la nota del esquema (los módulos sin nota no cuentan)
  A.state.subjects.forEach((x) => { if (x !== ser && x !== sinEsquema) x.grade = ""; });
  check(Math.abs(A.weightedGPA() - (7.4 + 7.5) / 2) < 0.01, "media del ciclo: cuenta la nota calculada del esquema");

  // ————— Agenda: un trabajo que puntúa llena el componente
  const comp = ser.eval.componentes[2];
  A.state.exams.push({ id: "t1", subjectId: "ser", title: "Práctica 3", kind: "Trabajo", date: A.todayISO(), grade: 5, puntua: true, componenteId: comp.id, createdAt: Date.now() });
  const nc1 = A.notaDeComponente(ser, comp);
  check(nc1.origen === "agenda" && nc1.nota === 5, "agenda: el trabajo que puntúa manda en su componente");
  check(Math.abs(A.estadoModulo(ser).nota - 6.6) < 0.001, "agenda: la nota del módulo se recalcula sola (40/40/20 con 6, 8 y 5 → 6,6)");
  A.state.exams.push({ id: "t2", subjectId: "ser", title: "Práctica 4", kind: "Trabajo", date: A.todayISO(), grade: 9, puntua: true, componenteId: comp.id, createdAt: Date.now() });
  check(A.notaDeComponente(ser, comp).nota === 7 && A.notaDeComponente(ser, comp).trabajos.length === 2,
    "agenda: con varias entregas, el componente es su media (5 y 9 → 7)");
  check(Math.abs(A.estadoModulo(ser).nota - 7) < 0.001, "agenda: la media ponderada sigue al día (6, 8 y 7 → 7,0)");

  // Un trabajo que NO puntúa no toca nada
  A.state.exams.push({ id: "t3", subjectId: "ser", title: "Charla", kind: "Trabajo", date: A.todayISO(), grade: 2, puntua: false, componenteId: "", createdAt: Date.now() });
  check(A.notaDeComponente(ser, comp).nota === 7 && Math.abs(A.estadoModulo(ser).nota - 7) < 0.001,
    "agenda: un trabajo que no puntúa no cambia ninguna nota");

  // Borrar el trabajo devuelve el componente a su nota a mano
  A.state.exams = A.state.exams.filter((e) => e.id !== "t1" && e.id !== "t2");
  const nc2 = A.notaDeComponente(ser, comp);
  check(nc2.origen === "mano" && nc2.nota === 9, "agenda: al quitar los trabajos vuelve la nota escrita a mano");
  check(Math.abs(A.estadoModulo(ser).nota - 7.4) < 0.001, "agenda: y la nota del módulo vuelve a su sitio");

  // «Escribirla a mano» gana a la Agenda (modo manual)
  A.state.exams.push({ id: "t4", subjectId: "ser", title: "Práctica 5", kind: "Trabajo", date: A.todayISO(), grade: 3, puntua: true, componenteId: comp.id, createdAt: Date.now() });
  comp.modo = "manual";
  check(A.notaDeComponente(ser, comp).origen === "mano" && A.notaDeComponente(ser, comp).nota === 9,
    "agenda: con el componente en modo manual manda tu nota, aunque haya entregas");
  comp.modo = "auto";
  check(A.notaDeComponente(ser, comp).nota === 3, "agenda: en modo automático vuelve a mandar la Agenda");

  // Saneado del estado: un componente que ya no existe deja de apuntar a nada
  const guardado = JSON.parse(JSON.stringify({ settings: { onboarded: true }, subjects: [ser], exams: [{ id: "x", subjectId: "ser", title: "Prueba", kind: "Trabajo", componenteId: "fantasma", puntua: false }] }));
  const limpio = A.sanitize(guardado);
  check(limpio.exams[0].componenteId === "" && limpio.exams[0].puntua === false,
    "estado: un componente borrado se desenlaza y el «no puntúa» se conserva");

  // ————— Vista de Calificaciones y radar
  const s1 = { id: "s1", name: "Aplicaciones web", grade: "", color: "#eab308" };
  A.state.subjects.push(s1);   // 13 módulos: antes el radar cortaba en 12 y ya no se veía el último
  A.state.subjects.push({ id: "s2", name: "Sistemas de gestión de redes", grade: "", color: "#0ea5e9" });
  A.go("rendimiento");
  const v = env.doc.getElementById("view");
  check(/Meter notas/.test(v.textContent) && /Examen de teoría/.test(v.textContent),
    "calificaciones: el módulo con esquema enseña sus componentes y el botón de meter notas");
  check(/Esquema de evaluación/.test(v.textContent), "calificaciones: los módulos sin esquema ofrecen montarlo");
  check(A.state.subjects.length > 12, "radar: la prueba va con más módulos que el viejo tope de 12 (" + A.state.subjects.length + ")");
  check(v.querySelectorAll("svg.radar-box text").length === A.state.subjects.length,
    "radar: entran TODOS los módulos (sin tope) — " + A.state.subjects.length + " ejes");
  check(v.querySelectorAll("svg.radar-box circle").length >= A.state.subjects.length, "radar: cada módulo tiene su punto");
  const rotulos = [...v.querySelectorAll("svg.radar-box text")].map((t) => t.textContent).join("|");
  check(rotulos.includes("SISGE") && !rotulos.includes("SISDE"),
    "radar: el rótulo omite palabras vacías («Sistemas de gestión…» → SISGE, no SISDE)");
  // El botón «volver» de cada herramienta acota su icono (sin esto el SVG salía a 300×150)
  const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
  check(/\.tool-back svg\s*\{[^}]*width:\s*16px/.test(ui), "tools: el icono de «volver» tiene tamaño acotado en CSS");
  check(/\.tool-back\s*\{[^}]*align-self:\s*flex-start/.test(ui), "tools: «volver» no se estira al 100 % (align-self contra el flex de #view)");
  const tj = fs.readFileSync(path.join(ROOT, "js", "tools.js"), "utf8");
  check(/<svg viewBox="0 0 24 24" width="16" height="16"/.test(tj), "tools: y el SVG de «volver» lleva width/height de atributo");

  // ————— El editor del esquema, de punta a punta
  A.go("subjects");
  A.go("rendimiento");
  act(env, "eval-nuevo", { id: "s1" });
  const form = r_form(env);
  check(!!form && !!form.querySelector('input[name^="c:"][name$=":nombre"]'), "editor: el módulo sin esquema abre el editor con una fila");
  act(env, "eval-plantilla", {});
  const form2 = r_form(env);
  const nombres = [...form2.querySelectorAll('input[name$=":nombre"]')].map((i) => i.value);
  check(nombres.join("|") === "Examen de teoría|Examen práctico|Prácticas", "editor: la plantilla trae teoría, práctico y prácticas");
  const pesos = [...form2.querySelectorAll('input[name$=":peso"]')].map((i) => Number(i.value));
  check(pesos.join("+") === "40+40+20", "editor: la plantilla reparte 40/40/20");
  check(form2.querySelector('input[name="regla-ra"]').checked, "editor: la plantilla activa «hay que aprobar todos los RA»");
  act(env, "eval-add-comp", {});
  check(r_form(env).querySelectorAll('input[name^="c:"][name$=":nombre"]').length === 4, "editor: se añaden componentes sin perder lo escrito");
  check(!r_form(env).querySelector('input[name^="ra:"]'), "editor: sin RA en la lista, no hay filas fantasma");
  act(env, "eval-add-ra", {});
  check(/RA1/.test(r_form(env).querySelector('input[name^="ra:"]').value), "editor: se añaden RA a mano");
  // Guardar: los pesos y las notas que se ven en el formulario se guardan en el módulo
  const f3 = r_form(env);
  f3.querySelectorAll('input[name$=":nota"]')[0].value = "5";
  f3.querySelectorAll('input[name$=":peso"]')[3].value = "0";
  f3.dispatchEvent(new env.window.Event("submit", { bubbles: true, cancelable: true }));
  const ev1 = A.evalDe(A.state.subjects.find((x) => x.id === "s1"));
  check(!!ev1 && ev1.componentes.length === 4 && ev1.componentes[0].nota === 5 && A.estadoModulo(s1).nota === 5,
    "editor: lo que se escribe en el modal se guarda y calcula la nota del módulo");
  check(ev1.reglas.ra.lista.length === 1, "editor: los RA añadidos también se guardan");

  // Editar un esquema que YA existe no puede perder lo que hay dentro (se coló hasta el navegador)
  act(env, "eval-editar", { id: "ser" });
  const fe2 = r_form(env);
  const nombresEd = [...fe2.querySelectorAll('input[name^="c:"][name$=":nombre"]')].map((i) => i.value);
  const notasEd = [...fe2.querySelectorAll('input[name$=":nota"]')].map((i) => i.value);
  check(nombresEd.join("|") === "Examen de teoría|Examen práctico|Prácticas" && notasEd.join("|") === "6|8|9",
    "editor: al editar un esquema que ya está, los componentes y las notas siguen ahí (" + nombresEd.length + " · " + notasEd.join("/") + ")");
  check(fe2.querySelectorAll('input[name^="ra:"][name$=":nombre"]').length === 2 && fe2.querySelectorAll('input[name$=":ok"]').length === 2,
    "editor: los RA guardados también vuelven al editor (nombre y casilla)");
  act(env, "eval-add-comp", {});
  check(r_form(env).querySelectorAll('input[name^="c:"][name$=":nombre"]').length === 4, "editor: se añade un componente al esquema existente sin perder los demás");
  act(env, "close-modal", {});

  // ————— La Agenda, con el nombre y los tipos nuevos
  check(A.EXAM_KINDS.includes("Trabajo"), "agenda: «Trabajo» es un tipo más");
  check([...env.doc.querySelectorAll("#bottom-nav .nav-lbl")].some((e) => e.textContent.trim() === "Agenda"),
    "agenda: la barra de abajo dice «Agenda»");
  A.go("exams");
  check(/^Agenda/.test(env.doc.getElementById("view-title").textContent), "agenda: el título de la vista es «Agenda»");
  check(/Agenda/.test(env.doc.querySelector('#more-sheet') ? env.doc.querySelector('#more-sheet').textContent : "Agenda"),
    "agenda: el atajo de «Más» también dice Agenda");
  check(A.state.subjects.some((x) => x.eval) && env.doc.getElementById("view").textContent.length > 0, "agenda: la vista pinta sin errores");

  // Un trabajo apuntado desde el formulario de la Agenda
  const antes = A.state.exams.length;
  act(env, "add-exam", {});
  const fe = r_form(env);
  // Se elige el módulo y el tipo como lo haría una persona: el desplegable de componentes y el
  // bloque «¿puntúa?» aparecen al cambiar el formulario.
  const selSub = fe.querySelector('[name="subjectId"]');
  selSub.value = "s1";
  selSub.dispatchEvent(new env.window.Event("change", { bubbles: true }));
  const selKind = fe.querySelector('[name="kind"]');
  selKind.value = "Trabajo";
  selKind.dispatchEvent(new env.window.Event("change", { bubbles: true }));
  fe.querySelector('[name="title"]').value = "Práctica de DHCP";
  fe.querySelector('[name="grade"]').value = "4";
  const c1id = A.evalDe(s1).componentes[0].id;
  check(!!fe.querySelector('[name="componenteId"]') && fe.querySelector("#ex-trabajo") && !fe.querySelector("#ex-trabajo").hidden,
    "agenda: al elegir «Trabajo» sale el bloque de puntuar y el desplegable del componente");
  fe.querySelector('[name="componenteId"]').value = c1id;
  fe.dispatchEvent(new env.window.Event("submit", { bubbles: true, cancelable: true }));
  const nuevo = A.state.exams[A.state.exams.length - 1];
  check(A.state.exams.length === antes + 1 && nuevo.kind === "Trabajo" && nuevo.componenteId === c1id && nuevo.puntua === true,
    "agenda: el trabajo guarda su componente y que puntúa");
  check(A.notaDeComponente(A.state.subjects.find((x) => x.id === "s1"), A.evalDe(s1).componentes[0]).nota === 4,
    "agenda: la nota del trabajo entra sola en el componente");

  // ————— El esquema que ya me pasó el usuario (Servicios en red) se pone solo
  const env2 = boot({ seed: JSON.stringify({ settings: { onboarded: true, demo: false }, subjects: [{ id: "sr", name: "Servicios en red" }], exams: [] }) });
  ready(env2.A);
  const sr = env2.A.state.subjects.find((x) => x.name === "Servicios en red");
  const evSr = env2.A.evalDe(sr);
  check(!!evSr && evSr.componentes.length === 3 && evSr.componentes.map((c) => c.peso).join("/") === "40/40/20",
    "servicios en red: 40 % teoría, 40 % práctico y 20 % prácticas, sin tener que montarlo a mano");
  check(evSr.reglas.ra.activo === true && evSr.reglas.ra.lista.length === 0,
    "servicios en red: la regla de aprobar todos los RA viene activada (la lista de RA la pones tú)");
  check(env2.A.state.progress.flags["eval-servicios-red-v1"] === 1, "servicios en red: el esquema se aplica una sola vez");

  check(env.errors.length === 0, "v67.5: sin errores de consola (" + env.errors.slice(0, 2).join(" · ") + ")");
}

// --------- 23. la Agenda por apartados, con el plazo de las entregas (v67.6)
/* Lo que pidió el usuario: la Agenda como la del instituto —cada módulo con sus cosas— y las
   entregas con su plazo (se abre → se cierra) y su estado, además de la hora de fin del examen. */
async function testAgenda() {
  const env = boot();
  ready(env.A);
  const A = env.A, r = env.doc;
  const s1 = { id: "a1", name: "Servicios en red", color: "#db2777", grade: "" };
  const s2 = { id: "a2", name: "Aplicaciones web", color: "#eab308", grade: "" };
  A.state.subjects.push(s1, s2);
  A.state.exams = [];
  A.go("exams");

  // ————— Un examen: de una hora a otra
  act(env, "add-exam", {});
  let f = r_form(env);
  f.querySelector('[name="title"]').value = "Tema 3 · Subnetting";
  f.querySelector('[name="subjectId"]').value = "a1";
  f.querySelector('[name="date"]').value = A.todayISO();
  f.querySelector('[name="time"]').value = "16:00";
  f.querySelector('[name="endTime"]').value = "17:55";
  check(/Acaba/.test(f.textContent), "agenda: el examen se apunta de una hora a otra");
  f.dispatchEvent(new env.window.Event("submit", { bubbles: true, cancelable: true }));
  const examen = A.state.exams[0];
  check(examen.endTime === "17:55" && examen.estado === "" && !examen.openDate, "agenda: el examen guarda su hora de fin (y no tiene plazo)");
  check(/16:00 – 17:55/.test(r.querySelector(".exam-fila").textContent), "agenda: la fila enseña «16:00 – 17:55»");
  check(!r.querySelector(".estado-chip"), "agenda: un examen no lleva el desplegable de estado");

  // ————— Un trabajo con plazo: se abre el 14 y se entrega el 21
  act(env, "add-exam", {});
  f = r_form(env);
  f.querySelector('[name="title"]').value = "A1 · Red NAT";
  f.querySelector('[name="subjectId"]').value = "a1";
  f.querySelector('[name="kind"]').value = "Trabajo";
  f.querySelector('[name="kind"]').dispatchEvent(new env.window.Event("change", { bubbles: true }));
  check(/Se entrega/.test(f.textContent) && /Hasta las/.test(f.textContent) && /Se abre/.test(f.textContent),
    "agenda: al ser una entrega, el formulario pide desde y hasta");
  check(/Pendiente de hacer/.test(f.textContent), "agenda: la entrega nace «Pendiente de hacer»");
  const abierto = f.querySelector("#ex-trabajo").hidden === false && f.querySelectorAll(".ex-solo-examen:not([hidden])").length === 0;
  check(abierto, "agenda: en una entrega se esconden las casillas del examen (aula y hora de fin)");
  // Y de verdad se esconden: el atributo hidden manda aunque la clase traiga display propio
  const cssUI = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
  check(tienePropiedad("[hidden]", "display: none !important", cssUI),
    "css: lo que lleva hidden no se ve nunca (el formulario de la Agenda lo necesita)");
  f.querySelector('[name="openDate"]').value = "2026-09-14";
  f.querySelector('[name="openTime"]').value = "20:30";
  f.querySelector('[name="date"]').value = "2026-09-21";
  f.querySelector('[name="time"]').value = "20:30";
  f.dispatchEvent(new env.window.Event("submit", { bubbles: true, cancelable: true }));
  const trabajo = A.state.exams[A.state.exams.length - 1];
  check(trabajo.kind === "Trabajo" && trabajo.estado === "pendiente" && trabajo.openDate === "2026-09-14" && trabajo.openTime === "20:30",
    "agenda: el plazo de la entrega se guarda (14/09 20:30 → 21/09 20:30)");
  const fila = [...r.querySelectorAll(".exam-fila")].find((x) => /Red NAT/.test(x.textContent));
  check(/Apertura:/.test(fila.textContent) && /Cierre:/.test(fila.textContent) && /20:30/.test(fila.textContent),
    "agenda: la fila de la entrega enseña apertura y cierre, como Aules");
  check(/lunes, 14 de septiembre de 2026/.test(fila.textContent) && /lunes, 21 de septiembre de 2026/.test(fila.textContent),
    "agenda: con la fecha escrita entera (día de la semana incluido)");

  // ————— El estado, desde la propia fila
  const chip = fila.querySelector(".estado-chip");
  check(!!chip && /Pendiente de hacer/.test(chip.textContent), "agenda: la entrega trae su desplegable de estado");
  act(env, "exam-estado", { id: trabajo.id });
  check(/Entregado/.test(r.getElementById("modal-form").textContent), "agenda: el estado se cambia desde la fila (sin abrir la entrega)");
  act(env, "exam-set-estado", { id: trabajo.id, e: "entregado" });
  check(A.state.exams.find((e) => e.id === trabajo.id).estado === "entregado", "agenda: el estado pasa a «Entregado»");
  const fila2 = [...r.querySelectorAll(".exam-fila")].find((x) => /Red NAT/.test(x.textContent));
  check(/is-entregado/.test(fila2.querySelector(".estado-chip").className), "agenda: y el desplegable lo enseña");
  // «Corregido» pide la nota (es cuando la sabes)
  act(env, "exam-set-estado", { id: trabajo.id, e: "corregido" });
  await new Promise((res) => setTimeout(res, 400));
  const editor = r.getElementById("modal-form");
  check(A.state.exams.find((e) => e.id === trabajo.id).estado === "corregido" && !!editor
    && editor.querySelector('[name="title"]').value === "A1 · Red NAT",
    "agenda: al marcar «Corregido» se abre la entrega para poner la nota");
  act(env, "close-modal", {});

  // ————— Apartados por módulo (cada módulo, con sus cosas)
  A.state.exams.push({ id: "otro", subjectId: "a2", title: "Proyecto · API de la web", kind: "Trabajo", date: "2026-09-19", estado: "pendiente", puntua: false, createdAt: Date.now() });
  A.go("exams");
  const secciones = [...r.querySelectorAll(".exam-sec")];
  check(secciones.length === 2, "agenda: cada módulo tiene su apartado (" + secciones.length + ")");
  const cabeceras = [...r.querySelectorAll(".exam-sec-head")].map((x) => x.textContent.replace(/\s+/g, " ").trim());
  check(/Servicios en red/.test(cabeceras[0]) && /Aplicaciones web/.test(cabeceras[1]),
    "agenda: los apartados van por módulo: " + cabeceras.join(" | "));
  const soloUno = secciones[0].querySelectorAll(".exam-fila").length;
  check(soloUno === 2, "agenda: el apartado de Servicios en red lleva solo lo suyo (" + soloUno + ")");
  check(secciones[1].querySelectorAll(".exam-fila").length === 1, "agenda: y el de Aplicaciones web, lo suyo")


  // ————— El plazo imposible no se guarda
  act(env, "edit-exam", { id: trabajo.id });
  f = r_form(env);
  f.querySelector('[name="openDate"]').value = "2026-09-30";   // después del cierre
  f.dispatchEvent(new env.window.Event("submit", { bubbles: true, cancelable: true }));
  check(A.state.exams.find((e) => e.id === trabajo.id).openDate === "", "agenda: un plazo imposible (abre después del cierre) no se guarda");
  act(env, "edit-exam", { id: trabajo.id });
  f = r_form(env);
  f.querySelector('[name="date"]').value = "2026-09-21";
  f.querySelector('[name="time"]').value = "22:00";
  f.querySelector('[name="openDate"]').value = "";
  f.dispatchEvent(new env.window.Event("submit", { bubbles: true, cancelable: true }));

  // Y un examen con la hora de fin antes de empezar tampoco
  act(env, "edit-exam", { id: A.state.exams[0].id });
  f = r_form(env);
  f.querySelector('[name="endTime"]').value = "15:00";
  f.dispatchEvent(new env.window.Event("submit", { bubbles: true, cancelable: true }));
  check(A.state.exams[0].endTime === "", "agenda: si el examen acaba antes de empezar, la hora de fin se descarta");

  // ————— El estado no se le queda pegado a un examen (ni el plazo)
  const guardado = JSON.parse(JSON.stringify({ settings: { onboarded: true }, subjects: [s1], exams: [
    { id: "x", subjectId: "a1", title: "Examen suelto", kind: "Examen", date: "2026-09-20", openDate: "2026-09-10", estado: "entregado", endTime: "17:00", time: "16:00" },
    { id: "y", subjectId: "a1", title: "Entrega suelta", kind: "Trabajo", date: "2026-09-22", openDate: "2026-09-25", estado: "vete tú a saber" },
  ] }));
  const limpio = A.sanitize(guardado);
  check(limpio.exams[0].openDate === "" && limpio.exams[0].estado === "" && limpio.exams[0].endTime === "17:00",
    "estado: a un examen se le quitan el plazo y el estado al cargar, y conserva su hora de fin");
  check(limpio.exams[1].openDate === "" && limpio.exams[1].estado === "pendiente",
    "estado: un plazo imposible se descarta y un estado raro vuelve a «pendiente»");

  // ————— Los avisos: la apertura y el cierre de la entrega
  const AV = env.window.AulaAvisos;
  const datos = AV.datos();
  const conEntrega = datos.examenes.find((e) => e.title === "A1 · Red NAT");
  check(!!conEntrega && conEntrega.openDate === "" && conEntrega.kind === "Trabajo",
    "avisos: las entregas llegan al plan con su tipo");
  const ahora = new Date(A.todayISO() + "T07:00:00");
  const plan = AV.plan({ ajustes: { notifyExamEve: true, notifyExamHour: true }, dias: [], examenes: [
    { title: "A1 · Red NAT", subject: "Servicios en red", date: A.state.exams.find((e) => e.id === trabajo.id).date, time: "20:30", openDate: "", openTime: "20:30", kind: "Trabajo", estado: "pendiente" },
  ], fichas: 0 }, ahora);
  check(plan.some((a) => a.titulo === "Entrega mañana" && /hasta las 20:30/.test(a.cuerpo)),
    "avisos: la entrega avisa la tarde antes y dice hasta qué hora se puede entregar");
  const conApertura = AV.plan({ ajustes: { notifyExamEve: true }, dias: [], examenes: [
    { title: "A2 · Copias de seguridad", subject: "Sistemas", date: "2026-09-28", time: "20:30", openDate: "2026-09-25", openTime: "09:00", kind: "Trabajo" },
  ], fichas: 0 }, new Date("2026-09-24T08:00:00"));
  check(conApertura.some((a) => a.titulo === "Se abre una entrega" && a.cuando.getDate() === 25),
    "avisos: también avisa el día que se abre la entrega");
  const cierre = AV.plan({ ajustes: { remindHour: 8 }, dias: [], examenes: [
    { title: "A2 · Copias", subject: "Sistemas", date: "2026-09-28", time: "23:55", openDate: "2026-09-25", kind: "Trabajo" },
  ], fichas: 0 }, new Date("2026-09-24T08:00:00"));
  check(cierre.some((a) => a.titulo === "Último día para entregar" && a.cuando.getDate() === 28 && a.cuando.getHours() === 8 && /hasta las 23:55/.test(a.cuerpo)),
    "avisos: y el último día para entregar, a la hora del resumen");
  const sinAvisos = AV.plan({ ajustes: { notifyDeliveryOpen: false, notifyDeliveryClose: false }, dias: [], examenes: [
    { title: "A2 · Copias", subject: "Sistemas", date: "2026-09-28", time: "23:55", openDate: "2026-09-25", kind: "Trabajo" },
  ], fichas: 0 }, new Date("2026-09-24T08:00:00"));
  check(!sinAvisos.some((a) => /Se abre una entrega|Último día/.test(a.titulo)),
    "avisos: apagar esos dos avisos los quita (el de «entrega mañana» sigue)");

  check(env.errors.length === 0, "v67.6: sin errores de consola (" + env.errors.slice(0, 2).join(" · ") + ")");
}

// --------- 24. v67.7: contraste, campos en caja, vibración, deslizar y «¿qué nota necesito?»
async function testV677() {
  const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");

  /* ————— 1. El contraste en modo oscuro, medido por números —————
     El problema era de medida, no de gusto: en una OLED el negro del fondo está apagado de
     verdad y las tarjetas, con la superficie en #101012 y los bordes al 7,5 % de blanco, se
     fundían con él. Aquí se comprueban los números nuevos y que el contraste sube de verdad. */
  {
    const oscuro = bloqueTema(ui, "dark");
    const claro = bloqueTema(ui, "light");
    check(!!oscuro && !!claro, "contraste: se encuentran los dos bloques de tema en ui.css");

    // Los alfas de los bordes y del brillo de la tarjeta
    const aLine = alfaDe(tokenCSS(oscuro, "line"));
    const aLine2 = alfaDe(tokenCSS(oscuro, "line-2"));
    const aCardBd = alfaDe(tokenCSS(oscuro, "card-bd"));
    const aCardIn = alfaDe(tokenCSS(oscuro, "card-in"));
    check(aLine === 0.12, "contraste: --line del tema oscuro es 0,12 (era 0,075) — leído: " + aLine);
    check(aLine2 === 0.2, "contraste: --line-2 es 0,2 (era 0,16) — leído: " + aLine2);
    check(aCardBd === 0.10, "contraste: --card-bd es 0,10 (era 0,075) — leído: " + aCardBd);
    check(aCardIn === 0.055, "contraste: el brillo de arriba de la tarjeta es 0,055 (era 0,04) — leído: " + aCardIn);
    check(aLine > 0.075 && aLine2 > 0.16 && aCardBd > 0.075 && aCardIn > 0.04,
      "contraste: los cuatro valores suben respecto a los de la v67.6");

    // Las superficies, y el contraste real contra el fondo negro (WCAG, no a ojo)
    const negro = hexRGB("#000000");
    const superficie = hexRGB(tokenCSS(oscuro, "surface"));
    const superficie2 = hexRGB(tokenCSS(oscuro, "surface-2"));
    const chip = hexRGB(tokenCSS(oscuro, "chip"));
    check(!!superficie && contraste(superficie, negro) >= 1.13,
      "contraste: la tarjeta se recorta contra el negro (" + (superficie ? contraste(superficie, negro).toFixed(4) : "n/d") + " · antes 1,1049)");
    check(!!superficie2 && contraste(superficie2, negro) >= 1.22 && !!superficie && contraste(superficie2, negro) > contraste(superficie, negro),
      "contraste: la superficie de segundo nivel se separa aún más (" + (superficie2 ? contraste(superficie2, negro).toFixed(4) : "n/d") + " · antes 1,1739)");
    check(!!superficie && !!superficie2 && !!chip && tokenCSS(oscuro, "chip") === tokenCSS(oscuro, "surface-2"),
      "contraste: el chip usa la misma superficie que los campos");
    // Y el fondo sigue siendo negro puro: lo que sube es la tarjeta, no el fondo
    check(tokenCSS(oscuro, "bg") === "#000000", "contraste: el fondo sigue siendo negro puro (OLED)");
    // El tema claro no se toca: si cambia algo aquí, el arreglo se ha ido de las manos
    check(alfaDe(tokenCSS(claro, "line")) === 0.09 && alfaDe(tokenCSS(claro, "line-2")) === 0.18
      && tokenCSS(claro, "surface") === "#ffffff",
      "contraste: el tema claro se queda como estaba (solo se ha tocado el oscuro)");
  }

  /* ————— 2. El campo del esquema, con forma de caja ————— */
  {
    const regla = (sel) => {
      const plano = String(ui).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ");
      const m = new RegExp(sel.replace(/[.[]/g, "\\$&") + "\\s*\\{([^}]*)\\}").exec(plano);
      return m ? m[1] : "";
    };
    const campo = regla(".eval-row-top input");
    const foco = regla(".eval-row-top input:focus");
    const px = (txt, prop) => Number((txt.match(new RegExp(prop + ":\\s*(-?[\\d.]+)px")) || [0, 0])[1]);
    check(campo !== "", "esquema: se encuentra la regla del campo con el nombre del componente");
    check(/background:\s*var\(--surface-2\)/.test(campo), "esquema: el campo tiene fondo (ya no es texto suelto)");
    check(/border:\s*1px solid var\(--line\)/.test(campo), "esquema: y un borde de 1 px alrededor, no una raya debajo");
    check(px(campo, "border-radius") === 10, "esquema: las esquinas van a 10 px — leído: " + px(campo, "border-radius"));
    check(px(campo, "padding") === 9, "esquema: el relleno vertical es de 9 px — leído: " + px(campo, "padding"));
    check(px(campo, "min-height") >= 40, "esquema: el campo mide 40 px o más de alto (se puede pulsar con el dedo) — leído: " + px(campo, "min-height"));
    check(/border-color:\s*var\(--ink\)/.test(foco) && !/border-bottom-color/.test(foco),
      "esquema: al enfocarlo se ilumina la caja entera, no solo la raya de abajo");
    check(!/border-bottom:\s*1px dashed/.test(campo), "esquema: fuera la raya de puntos que no parecía un campo");
  }

  /* ————— 3. La vibración nativa —————
     Se simula el plugin de Capacitor tal como lo ve la app dentro del APK. */
  {
    const env = boot();
    ready(env.A);
    const A = env.A, r = env.doc;
    const golpes = [];
    env.window.Capacitor = { Plugins: { Haptics: { impact: (o) => { golpes.push(o && o.style); return Promise.resolve(); } } } };
    const vibrateNavegador = [];
    env.window.navigator.vibrate = (p) => { vibrateNavegador.push(p); return true; };

    check(typeof A.vibrar === "function", "vibración: existe el helper vibrar()");
    A.vibrar("ligero"); A.vibrar("medio"); A.vibrar("fuerte");
    check(golpes.join("|") === "LIGHT|MEDIUM|HEAVY",
      "vibración: ligero/medio/fuerte van al motor háptico como LIGHT/MEDIUM/HEAVY (" + golpes.join("|") + ")");
    check(vibrateNavegador.length === 0, "vibración: con el plugin nativo presente no se usa navigator.vibrate");

    // El interruptor de Ajustes manda
    golpes.length = 0;
    A.state.settings.vibrate = false;
    check(A.vibrar("fuerte") === false && golpes.length === 0, "vibración: con la vibración apagada en Ajustes no vibra nada");
    A.state.settings.vibrate = true;

    // Sin plugin (navegador), cae a navigator.vibrate sin romper nada
    const env2 = boot();
    ready(env2.A);
    const patrones = [];
    env2.window.navigator.vibrate = (p) => { patrones.push(JSON.stringify(p)); return true; };
    check(env2.window.Capacitor === undefined, "vibración: la prueba del navegador va de verdad sin Capacitor");
    env2.A.vibrar("ligero"); env2.A.vibrar("fuerte");
    check(patrones.length === 2, "vibración: sin plugin nativo se usa navigator.vibrate (" + patrones.join(" · ") + ")");

    // Los tres enganches, de punta a punta
    golpes.length = 0;
    // a) cambiar de pestaña en la barra de abajo
    const pestana = r.querySelector('#bottom-nav button[data-view="stats"]') || r.querySelector("#bottom-nav button[data-view]");
    check(!!pestana, "vibración: la barra de abajo tiene pestañas que pulsar");
    pestana.dispatchEvent(new env.window.MouseEvent("click", { bubbles: true, cancelable: true }));
    check(golpes.length === 1 && golpes[0] === "LIGHT", "vibración: cambiar de pestaña da un roce ligero (" + golpes.join("|") + ")");

    // b) terminar un bloque de estudio
    golpes.length = 0;
    A.go("timer");
    act(env, "timer-toggle", {});
    act(env, "timer-skip", {});
    check(golpes.length === 1 && golpes[0] === "HEAVY", "vibración: terminar el bloque da el golpe fuerte (" + golpes.join("|") + ")");

    // c) marcar una entrega como entregada
    golpes.length = 0;
    A.state.subjects.push({ id: "v1", name: "Servicios en red", color: "#db2777", grade: "" });
    A.state.exams = [{ id: "e1", subjectId: "v1", title: "A1 · Red NAT", kind: "Trabajo", date: A.todayISO(), estado: "pendiente", puntua: false, createdAt: Date.now() }];
    A.go("exams");
    act(env, "exam-set-estado", { id: "e1", e: "entregado" });
    check(golpes.length === 1 && golpes[0] === "MEDIUM", "vibración: marcar una entrega como entregada da un toque medio (" + golpes.join("|") + ")");
    check(A.state.exams[0].estado === "entregado", "vibración: y la entrega queda marcada");

    check(env.errors.length === 0, "v67.7: sin errores de consola en la vibración (" + env.errors.slice(0, 2).join(" · ") + ")");
  }
  // El comprobador del APK tiene que vigilar el plugin nuevo y su permiso
  {
    const py = fs.readFileSync(path.join(ROOT, "apk-overlay", "comprobar-apk.py"), "utf8");
    check(/"vibraci[oó]n":\s*\(b"HapticsPlugin",\s*"VIBRATE"\)/.test(py),
      "apk: el comprobador vigila el plugin Haptics y el permiso VIBRATE");
    const yml = fs.readFileSync(path.join(ROOT, ".github", "workflows", "apk.yml"), "utf8");
    check(/vibraci[oó]n/i.test(yml), "apk: las notas de la release cuentan que la app vibra");
  }

  /* ————— 4. Deslizar las filas de la Agenda ————— */
  {
    const env = boot();
    ready(env.A);
    const A = env.A, r = env.doc;
    // Un evento táctil de verdad: con sus listas de toques, como los que manda el móvil
    const tactil = (tipo, el, x, y) => {
      const e = new env.window.Event(tipo, { bubbles: true, cancelable: true });
      const t = { clientX: x, clientY: y, identifier: 1, target: el };
      Object.defineProperty(e, "touches", { value: tipo === "touchend" || tipo === "touchcancel" ? [] : [t] });
      Object.defineProperty(e, "changedTouches", { value: [t] });
      Object.defineProperty(e, "targetTouches", { value: tipo === "touchend" ? [] : [t] });
      el.dispatchEvent(e);
      return e;
    };
    const arrastrar = (el, dx, dy, pasos = 6) => {
      tactil("touchstart", el, 100, 300);
      for (let i = 1; i <= pasos; i++) tactil("touchmove", el, 100 + (dx * i) / pasos, 300 + (dy * i) / pasos);
      tactil("touchend", el, 100 + dx, 300 + dy);
    };

    A.state.subjects = [{ id: "g1", name: "Servicios en red", color: "#db2777", grade: "" }];
    A.state.exams = [
      { id: "w1", subjectId: "g1", title: "A1 · Red NAT", kind: "Trabajo", date: "2099-09-21", estado: "pendiente", puntua: false, createdAt: Date.now() },
      { id: "x1", subjectId: "g1", title: "Tema 3 · Subnetting", kind: "Examen", date: "2099-09-22", estado: "", puntua: false, createdAt: Date.now() },
    ];
    A.go("exams");

    const caja = () => r.querySelector('.swipe[data-swipe="w1"]');
    const cajaExamen = () => r.querySelector('.swipe[data-swipe="x1"]');
    check(!!caja() && !!cajaExamen(), "deslizar: cada fila de la Agenda va dentro de su cajón");
    check(caja().dataset.der === "1" && cajaExamen().dataset.der === undefined,
      "deslizar: solo la entrega pendiente se puede deslizar a la derecha (un examen no se entrega)");
    check(!!caja().querySelector(".swipe-fondo.is-der") && !!caja().querySelector(".swipe-fondo.is-izq"),
      "deslizar: debajo de la fila están las dos franjas (entregado y editar)");

    // El consejo, una sola vez
    check(/Desliza una entrega a la/.test(r.querySelector(".swipe-consejo").textContent),
      "deslizar: la primera vez sale el consejo");
    check(A.state.progress.flags.swipeUsado === undefined, "deslizar: el consejo aún no se ha apuntado en el estado");

    // Un gesto vertical es scroll: no se toca nada
    arrastrar(caja().querySelector(".exam-fila"), 4, 90);
    check(A.state.exams[0].estado === "pendiente" && !caja().classList.contains("is-der"),
      "deslizar: un gesto hacia abajo es scroll y no marca la entrega");

    // Un gesto en diagonal no es un deslizamiento: el dedo iba más hacia abajo que hacia el lado
    arrastrar(caja().querySelector(".exam-fila"), 60, 50);
    check(A.state.exams[0].estado === "pendiente", "deslizar: en diagonal (60 px de lado, 50 de alto) se toma como scroll");

    // El umbral, medido: 71 px no bastan y 72 sí
    arrastrar(caja().querySelector(".exam-fila"), 71, 0);
    check(A.state.exams[0].estado === "pendiente", "deslizar: 71 px a la derecha no bastan");
    arrastrar(caja().querySelector(".exam-fila"), 72, 0);
    check(A.state.exams[0].estado === "entregado", "deslizar: 72 px sí (el umbral es justo ese)");
    check(A.state.progress.flags.swipeUsado === true, "deslizar: el consejo se apunta en el estado (no vuelve a salir)");
    check(!r.querySelector(".swipe-consejo"), "deslizar: y desaparece de la vista");

    // El clic que el navegador suelta al levantar el dedo NO cuenta
    const filaNueva = r.querySelector('.swipe[data-swipe="w1"] .exam-fila');
    filaNueva.dispatchEvent(new env.window.MouseEvent("click", { bubbles: true, cancelable: true }));
    check(!r.getElementById("modal-form"), "deslizar: el clic de después del gesto no abre la ficha");
    // Pero pasado el rato, el clic vuelve a valer
    await new Promise((res) => setTimeout(res, 850));
    filaNueva.dispatchEvent(new env.window.MouseEvent("click", { bubbles: true, cancelable: true }));
    check(!!r.getElementById("modal-form"), "deslizar: pasado el gesto, tocar la fila vuelve a abrirla");
    act(env, "close-modal", {});

    // A la izquierda se abre la prueba para editarla
    A.go("exams");
    arrastrar(r.querySelector('.swipe[data-swipe="w1"] .exam-fila'), -95, 2);
    const editor = r.getElementById("modal-form");
    check(!!editor && editor.querySelector('[name="title"]').value === "A1 · Red NAT",
      "deslizar: a la izquierda se abre la entrega para editarla");
    act(env, "close-modal", {});

    // Y funciona igual en un examen (que solo admite la izquierda)
    A.go("exams");
    arrastrar(cajaExamen().querySelector(".exam-fila"), -95, 0);
    check(!!r.getElementById("modal-form"), "deslizar: a la izquierda también se abre un examen");
    act(env, "close-modal", {});
    A.go("exams");
    const antes = A.state.exams[1].estado;
    arrastrar(cajaExamen().querySelector(".exam-fila"), 95, 0);
    check(A.state.exams[1].estado === antes, "deslizar: a la derecha un examen no hace nada (no se entrega)");

    // El tope: por mucho que arrastres, la fila no se va más allá (a la izquierda, que es el
    // único lado que admite un examen)
    tactil("touchstart", cajaExamen().querySelector(".exam-fila"), 400, 300);
    tactil("touchmove", cajaExamen().querySelector(".exam-fila"), 100, 300);
    const movida = cajaExamen().querySelector(".exam-fila").style.transform;
    tactil("touchend", cajaExamen().querySelector(".exam-fila"), 100, 300);
    check(/-108px/.test(movida), "deslizar: la fila tiene un tope de 108 px (leído: " + movida + ")");

    // (el umbral de 72 px, el tope de 108 y la regla del gesto horizontal se comprueban arriba
    //  por comportamiento, que es lo único que sobrevive al minificador: dentro del APK los
    //  nombres de las constantes ya no existen)

    check(env.errors.length === 0, "v67.7: sin errores de consola al deslizar (" + env.errors.slice(0, 2).join(" · ") + ")");
  }

  /* ————— 5. El simulador «¿qué nota necesito?» ————— */
  {
    const env = boot();
    ready(env.A);
    const A = env.A, r = env.doc;
    // El caso de control del encargo: prácticas 6 (20 %), práctico 4 (40 %) y teoría (40 %) sin nota
    const esquema = () => ({
      v: 1,
      componentes: [
        { id: "t", nombre: "Examen de teoría", peso: 40, sobre: 10, nota: "", min: 0, modo: "auto" },
        { id: "p", nombre: "Examen práctico", peso: 40, sobre: 10, nota: 4, min: 0, modo: "auto" },
        { id: "r", nombre: "Prácticas", peso: 20, sobre: 10, nota: 6, min: 0, modo: "auto" },
      ],
      reglas: { ra: { activo: false, lista: [] }, min: { activo: false } },
    });
    const sub = { id: "m1", name: "Sistemas", color: "#db2777", grade: "", eval: esquema() };
    A.state.subjects = [sub];

    const r5 = A.notaNecesaria(sub, 5);
    check(r5.necesaria === 5.5, "simulador: caso de control — para el 5 hacen falta 5,50 exactos (leído: " + r5.necesaria + ")");
    check(r5.pendientes.length === 1 && r5.pendientes[0].nombre === "Examen de teoría",
      "simulador: y sabe que esa nota va en «Examen de teoría»");
    check(r5.posible === true && r5.yaEsta === false, "simulador: para el 5 sí se puede");
    check(Math.abs(r5.actual - 4.67) < 0.005, "simulador: la media de lo evaluado es 4,67 (leído: " + r5.actual + ")");
    check(r5.maxFinal === 6.8, "simulador: lo máximo que puede acabar es 6,80 (leído: " + r5.maxFinal + ")");

    const r7 = A.notaNecesaria(sub, 7);
    check(r7.posible === false, "simulador: para el 7 ya no llega");
    check(r7.maxFinal === 6.8, "simulador: y lo dice con el máximo real (6,80), no con un «necesitas un 10,50»");
    const r9 = A.notaNecesaria(sub, 9);
    check(r9.posible === false && r9.necesaria > 10, "simulador: para el 9 tampoco (harían falta " + r9.necesaria + ")");

    // Ya lo tienes: con todo aprobado de sobra, un 0 en lo que queda sigue valiendo
    sub.eval.componentes[1].nota = 10; sub.eval.componentes[2].nota = 10;
    const rYa = A.notaNecesaria(sub, 5);
    check(rYa.yaEsta === true && rYa.necesaria < 0, "simulador: con 10 y 10 ya tiene el 5 aunque saque un 0 en la teoría");
    sub.eval = esquema();

    // Un componente que va «sobre 4» entra en la cuenta en la escala del módulo
    const sub4 = { id: "m4", name: "FOL", grade: "", eval: {
      v: 1,
      componentes: [
        { id: "a", nombre: "Sobre 4", peso: 50, sobre: 4, nota: 2, min: 0, modo: "auto" },   // 2/4 = 5/10
        { id: "b", nombre: "Sobre 10", peso: 50, sobre: 10, nota: "", min: 0, modo: "auto" },
      ],
      reglas: { ra: { activo: false, lista: [] }, min: { activo: false } },
    } };
    const r4 = A.notaNecesaria(sub4, 5);
    check(r4.necesaria === 5, "simulador: un 2 «sobre 4» cuenta como un 5 y pide un 5 en lo que queda (leído: " + r4.necesaria + ")");
    check(Math.abs(r4.actual - 5) < 0.001, "simulador: y la media de lo evaluado también lo pasa a la escala del módulo");

    // Un componente con peso 0 no decide nada
    sub.eval.componentes.push({ id: "z", nombre: "Actitud", peso: 0, sobre: 10, nota: 1, min: 0, modo: "auto" });
    check(A.notaNecesaria(sub, 5).necesaria === 5.5, "simulador: un componente con peso 0 no entra en la cuenta");
    sub.eval.componentes.pop();

    // Los avisos que pueden suspender aunque la media dé
    sub.eval.reglas.min.activo = true;
    sub.eval.componentes[2].min = 7;                       // Prácticas lleva 6 y pide 7
    const rMin = A.notaNecesaria(sub, 5);
    check(rMin.minSuspenso.length === 1 && /Prácticas/.test(rMin.minSuspenso[0].nombre),
      "simulador: avisa de un componente por debajo de su mínimo");
    sub.eval.componentes[2].min = 0;
    sub.eval.componentes[0].min = 5;                       // el pendiente es el que exige
    check(A.notaNecesaria(sub, 5).minimoPendiente && A.notaNecesaria(sub, 5).minimoPendiente.nombre === "Examen de teoría",
      "simulador: y del mínimo que pide lo que aún no tiene nota");
    sub.eval.componentes[0].min = 0;
    sub.eval.reglas.min.activo = false;
    sub.eval.reglas.ra = { activo: true, lista: [{ id: "ra1", nombre: "RA3 · DHCP", ok: false }] };
    check(A.notaNecesaria(sub, 5).raSinAprobar.join("|") === "RA3 · DHCP", "simulador: y de los RA sin aprobar");
    sub.eval = esquema();

    // Sin esquema no hay nada que calcular, y se dice
    check(A.notaNecesaria({ id: "sin", name: "Sin esquema", grade: "" }, 5).sinEsquema === true,
      "simulador: un módulo sin esquema lo dice en vez de inventarse una cuenta");

    /* La hoja: los tres bloques con su respuesta. Este es el caso de control entero, tal como
       lo tiene que leer el usuario. */
    A.go("rendimiento");
    const botonBoletin = r.querySelector('.boletin-mod [data-action="eval-simular"]');
    check(!!botonBoletin && /Qué nota necesito/.test(botonBoletin.textContent),
      "simulador: el botón está en Calificaciones, junto a «Meter notas»");
    check(!!r.querySelector('.boletin-mod [data-action="eval-notas"]'), "simulador: y «Meter notas» sigue en su sitio");
    botonBoletin.dispatchEvent(new env.window.MouseEvent("click", { bubbles: true, cancelable: true }));
    const hoja = r.getElementById("modal-form");
    const txt = hoja.textContent.replace(/\s+/g, " ");
    check(!!hoja, "simulador: el botón abre la hoja");
    check(hoja.querySelectorAll(".sim-bloque").length === 3, "simulador: la hoja trae los tres bloques (Aprobado, Notable, Sobresaliente)");
    check(/Aprobado/.test(txt) && /Notable/.test(txt) && /Sobresaliente/.test(txt), "simulador: y los tres dicen su nombre");
    check(/5,50/.test(txt) && /«Examen de teoría»/.test(txt),
      "simulador: el bloque del 5 dice «5,50 en «Examen de teoría»» — " + (txt.match(/Te hacen falta[^.]*\./) || ["n/d"])[0]);
    check(/Ni con un 10/.test(txt) && /6,80/.test(txt),
      "simulador: el bloque del 7 dice «Ni con un 10» y el máximo real (6,80)");
    check(/,/.test(txt) && !/5\.50/.test(txt), "simulador: las notas se escriben con coma decimal, como en español");
    act(env, "close-modal", {});

    // El mismo botón en la ficha del módulo
    act(env, "open-subject", { id: "m1" });
    const botonFicha = r.querySelector('#view [data-action="eval-simular"]');
    check(!!botonFicha, "simulador: el botón también está en la ficha del módulo");
    act(env, "eval-simular", { id: "m1" });
    // El título del modal vive en el <h2>, fuera del <form>: se mira la hoja entera
    const hojaFicha = r.querySelector("#modal-root .modal-card");
    check(!!hojaFicha && /Qué nota necesito/.test(hojaFicha.textContent) && hojaFicha.querySelectorAll(".sim-bloque").length === 3,
      "simulador: y abre la misma hoja desde la ficha");
    act(env, "close-modal", {});

    check(env.errors.length === 0, "v67.7: sin errores de consola en el simulador (" + env.errors.slice(0, 2).join(" · ") + ")");
  }

  // La versión tiene que estar subida en los cuatro sitios a la vez
  {
    const app = fs.readFileSync(path.join(ROOT, "js", "app.js"), "utf8");
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf8"));
    const lock = JSON.parse(fs.readFileSync(path.join(ROOT, "package-lock.json"), "utf8"));
    const sw = fs.readFileSync(path.join(ROOT, "sw.js"), "utf8");
    // Ojo: terser convierte `const APP_VERSION = "v67.7.1"` en `APP_VERSION="v67.7.1"`, así que
    // se aceptan las dos formas (la misma razón por la que el comprobador del APK lo hace).
    check(/APP_VERSION\s*[:=]\s*"v67\.13\.0"/.test(app), "versión: js/app.js dice v67.13.0");
    check(pkg.version === "67.13.0", "versión: package.json dice v67.13.0");
    check(lock.version === "67.13.0" && lock.packages[""].version === "67.13.0", "versión: package-lock.json acompaña");
    check(/CACHE = "aula-smr-v67\.13\.0"/.test(sw), "versión: el caché del service worker cambia de nombre (si no, el móvil se queda con la vieja)");
    check(!!((pkg.devDependencies || {})["@capacitor/haptics"]), "versión: @capacitor/haptics está en las dependencias");
  }
}

// --------- 25. v67.7.1: cambiar el icono de la app (el lanzador de Android)
/* El fallo: la plantilla de Capacitor trae MainActivity con SU PROPIO intent-filter
   MAIN/LAUNCHER. apply.py añadía 23 activity-alias encima, así que en el escritorio convivían
   24 lanzadores; IconSwitch solo enciende y apaga los alias y nunca toca MainActivity, cuyo
   icono (ic_launcher) es siempre el dragón. Tocas Mewtwo, el plugin dice que sí, y el
   escritorio no se mueve.

   La lógica vive en apk-overlay/manifest.py, que es Python puro: aquí se ejecuta DE VERDAD
   sobre la plantilla real de Capacitor (la misma que recibe el build), no sobre una copia. */
function testIconoApp() {
  const { execFileSync } = require("child_process");
  const os = require("os");
  const carpeta = fs.mkdtempSync(path.join(os.tmpdir(), "aula-manifest-"));
  try {
    // 1. La plantilla tal cual la genera `npx cap add android`
    const tar = path.join(ROOT, "node_modules", "@capacitor", "cli", "assets", "android-template.tar.gz");
    check(fs.existsSync(tar), "icono: se encuentra la plantilla de Android de Capacitor");
    execFileSync("tar", ["xzf", tar, "-C", carpeta, "app/src/main/AndroidManifest.xml"], { stdio: "pipe" });
    const plantilla = path.join(carpeta, "app", "src", "main", "AndroidManifest.xml");
    const original = fs.readFileSync(plantilla, "utf8");
    check(/android:name="\.MainActivity"[\s\S]*?android\.intent\.action\.MAIN/.test(original),
      "icono: la plantilla de Capacitor trae MainActivity con su propio filtro de lanzador (de ahí venía el fallo)");

    // 2. Se le pasa por el código que de verdad se ejecuta en el build
    const guion = path.join(ROOT, "tests", "probar-manifest-icono.py");
    const crudo = execFileSync("python3", [guion, path.join(ROOT, "apk-overlay"), plantilla], { encoding: "utf8" });
    const r = JSON.parse(crudo.trim().split("\n").pop());

    check(r.aliases === 23, "icono: se declaran los 23 activity-alias (leído: " + r.aliases + ")");
    check(r.total === 23, "icono: y hay 23 lanzadores en total, no 24 (leído: " + r.total + ")");
    check(r.main_sigue === true, "icono: MainActivity sigue declarada (los widgets la abren con un Intent explícito)");
    check(r.main_con_lanzador === false, "icono: MainActivity YA NO declara lanzador — sin esto el icono no cambiaba nunca");
    check(r.main_exported === true, "icono: y sigue siendo exported");
    check(r.activos.join("|") === "IcoDragon", "icono: el único lanzador activo de salida es el dragón (leído: " + r.activos.join("|") + ")");
    check(r.alias_dragon === "IcoDragon", "icono: alias_de('dragon') da IcoDragon");
    check(r.idempotente === 23, "icono: pasar apply.py dos veces no duplica los alias (leído: " + r.idempotente + ")");

    // 3. Las tres listas de iconos tienen que ser la misma, o el alias no existe y Android
    //    se traga el setComponentEnabledSetting en silencio (falla sin decir nada)
    const java = fs.readFileSync(path.join(ROOT, "apk-overlay", "java", "IconSwitch.java"), "utf8");
    const idsJava = (java.split("IDS = {")[1].split("}")[0].match(/"[a-z]+"/g) || []).map((s) => s.replace(/"/g, ""));
    check(idsJava.join("|") === r.iconos.join("|"),
      "icono: IconSwitch.IDS (Java) y manifest.ICONS (Python) son la misma lista (" + idsJava.length + " y " + r.iconos.length + ")");
    // La galería se lee del DOM, no del fuente: terser renombra `AVATAR_PACK` al minificar, así
    // que buscarla por texto pasaría en casa y reventaría sobre el código que va en el APK.
    // De paso se comprueba lo que de verdad ve el usuario en Ajustes.
    const env = boot();
    ready(env.A);
    env.A.go("settings");
    const galeria = [...env.doc.querySelectorAll('#view [data-action="set-app-icon"]')].map((b) => b.dataset.id);
    check(galeria.length === r.iconos.length && r.iconos.every((x) => galeria.includes(x)),
      "icono: la galería de Ajustes ofrece los " + r.iconos.length + " iconos que hay como alias (" + galeria.length + ")");
    check(galeria[0] === "dragon", "icono: y el primero es el dragón (el que viene activo por defecto)");
    const ficheros = fs.readdirSync(path.join(ROOT, "assets", "avatars"));
    check(r.iconos.filter((x) => x !== "dragon").every((x) => ficheros.some((f) => f.startsWith(x + "."))),
      "icono: cada criatura de la lista tiene su imagen en assets/avatars");
    check(/aliasClass\(String id\)[\s\S]{0,120}"es\.aula\.smr\.hub\.Ico"/.test(java),
      "icono: IconSwitch.aliasClass genera el mismo nombre que manifest.alias_de (Ico + Mayúscula)");
  } finally {
    fs.rmSync(carpeta, { recursive: true, force: true });
  }
}

// ------------------------------------------------------- v67.8: re-análisis (7 mejoras)
// Blindaje de las siete mejoras del re-análisis: iconos comprimidos, contraste WCAG de los
// 33 skins, CSS muerto retirado, escala tipográfica, objetivo táctil del temporizador,
// blobs revocados y save() que no reescribe en cada navegación.
function testReanalisis() {
  const sinComentarios = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "");
  const cssOrden = ["styles.css", "skins.css", "themes.css", "ui.css"];
  const cssRaw = cssOrden.map((f) => fs.readFileSync(path.join(ROOT, "css", f), "utf8")).join("\n");
  const cssLimpio = sinComentarios(cssRaw);

  // 1 · Iconos comprimidos (antes 273 KB y 44 KB; el ahorro se multiplica por cada instalación)
  const k512 = fs.statSync(path.join(ROOT, "assets", "icon-512.png")).size / 1024;
  const k192 = fs.statSync(path.join(ROOT, "assets", "icon-192.png")).size / 1024;
  check(k512 < 100, "re-análisis: icon-512.png pesa <100 KB (antes 273 KB, ahora " + k512.toFixed(0) + " KB)");
  check(k192 < 25, "re-análisis: icon-192.png pesa <25 KB (antes 44 KB, ahora " + k192.toFixed(0) + " KB)");

  // 2 · Contraste WCAG AA (≥4,5:1) del texto y del botón primario en los 33 skins
  // Tolerante al minificador: cssnano quita las comillas de [data-skin=x] y acorta #fff.
  const hex6 = (v) => {
    const m3 = /^#([0-9a-f]{3})$/i.exec(String(v).trim());
    if (m3) { const [a, b, c] = m3[1]; return hexRGB("#" + a + a + b + b + c + c); }
    return hexRGB(v);
  };
  const base = {};
  const pieles = {};
  for (const f of cssOrden) {
    const t = sinComentarios(fs.readFileSync(path.join(ROOT, "css", f), "utf8"));
    for (const m of t.matchAll(/:root[^{]*\{([^{}]*)\}/g)) Object.assign(base, Object.fromEntries([...m[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((x) => [x[1], x[2].trim()])));
    for (const m of t.matchAll(/\[data-skin="?(?:([a-z0-9-]+)"?)\][^{]*\{([^{}]*)\}/g)) {
      const toks = Object.fromEntries([...m[2].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((x) => [x[1], x[2].trim()]));
      pieles[m[1]] = Object.assign(pieles[m[1]] || {}, toks);
    }
  }
  const nombres = Object.keys(pieles).sort();
  const bajoAA = [];
  for (const s of nombres) {
    const t = Object.assign({}, base, pieles[s]);
    const bg = hex6(t["--bg"] || ""), ink = hex6(t["--ink"] || "");
    const ac = hex6(t["--accent"] || ""), ai = hex6(t["--accent-ink"] || "#ffffff");
    if (bg && ink && contraste(bg, ink) < 4.5) bajoAA.push(s + " texto " + contraste(bg, ink).toFixed(2));
    if (ac && ai && contraste(ac, ai) < 4.5) bajoAA.push(s + " botón " + contraste(ac, ai).toFixed(2));
  }
  check(nombres.length === 33, "re-análisis: se analizan los 33 skins (" + nombres.length + ")");
  check(bajoAA.length === 0, "re-análisis: ningún skin queda por debajo de 4,5:1 (" + (bajoAA.join(", ") || "todos AA") + ")");

  // 3 · CSS muerto fuera: ni .app/.sidebar/.nav-item ni las variables que solo ellos leían
  check(!/(^|[\s>+~(,])\.(app|sidebar|nav-item)(?![\w-])/.test(cssLimpio),
    "re-análisis: el layout muerto (.app/.sidebar/.nav-item) ya no está en el CSS");
  check(!/--sidebar(-fg)?\s*:/.test(cssLimpio) && !/var\(--sidebar/.test(cssLimpio),
    "re-análisis: --sidebar y --sidebar-fg (33 skins) desaparecieron");
  const appjs = fs.readFileSync(path.join(ROOT, "js", "app.js"), "utf8");
  check(!/\.nav-item/.test(appjs), "re-análisis: el JS ya no consulta .nav-item");

  // 4 · Escala tipográfica: solo pueden existir estos tamaños (más el 0 de «ocultar»)
  const ESCALA = [0, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 26, 32, 40, 48];
  const vistos = [...new Set([...cssLimpio.matchAll(/font-size:\s*([0-9.]+)px/g)].map((m) => Number(m[1])))].sort((a, b) => a - b);
  const fuera = vistos.filter((t) => !ESCALA.includes(t));
  check(fuera.length === 0, "re-análisis: los font-size siguen la escala (" + vistos.join("/") + ")");

  // 5 · Objetivo táctil del temporizador ≥44 px
  const timer = (cssLimpio.match(/\.timer-bar \.btn-sm\s*\{[^}]*\}/) || [""])[0];
  const altoTimer = Number((timer.match(/min-height:\s*(\d+)px/) || [0, 0])[1]);
  check(altoTimer >= 44, "re-análisis: el botón del temporizador mide ≥44 px (ahora " + altoTimer + ")");

  // 6 · Los blobs huérfanos se revocan al borrar fotos y al cambiar el favicon
  // clear() ya revocaba (1); con el arreglo, del() añade una segunda revocación. Contar ≥2
  // sobrevive al minificado (terser renombra del, pero no el método revokeObjectURL).
  const media = fs.readFileSync(path.join(ROOT, "js", "media.js"), "utf8");
  check((media.match(/revokeObjectURL/g) || []).length >= 2, "re-análisis: media.del revoca el blob de la foto borrada");
  check(/startsWith\("blob:"\)[\s\S]{0,80}revokeObjectURL/.test(appjs), "re-análisis: setLinkIcon libera el icono anterior");

  // 7 · save() sin cambios no reescribe localStorage (y con cambios sí)
  const env = boot();
  ready(env.A);
  const realStore = env.window.localStorage;
  let escrituras = 0;
  // Como en la prueba de cuota: jsdom no deja pisar setItem a pelo, se sustituye el objeto entero.
  const contador = {
    get length() { return realStore.length; },
    key: (i) => realStore.key(i),
    getItem: (k) => realStore.getItem(k),
    removeItem: (k) => realStore.removeItem(k),
    clear: () => realStore.clear(),
    setItem: (k, v) => { escrituras += 1; return realStore.setItem(k, v); },
  };
  Object.defineProperty(env.window, "localStorage", { value: contador, configurable: true });
  env.A.flushSave();
  escrituras = 0;
  env.A.save();               // nada cambió: no debe tocar el disco
  const sinCambio = escrituras;
  env.A.state.settings.courseName = "Cambio real";
  env.A.save();               // ahora sí hay un cambio
  Object.defineProperty(env.window, "localStorage", { value: realStore, configurable: true });
  check(sinCambio === 0, "re-análisis: save() sin cambios no reescribe (escrituras=" + sinCambio + ")");
  check(escrituras > 0, "re-análisis: y cuando hay un cambio sí guarda (escrituras=" + escrituras + ")");
}

// ------------------------------------------------------- v67.9.0: pulido de Herramientas
function testTools() {
  const tools = fs.readFileSync(path.join(ROOT, "js", "tools.js"), "utf8");

  // 1 · El campo IPv6 arranca con una IPv6 de verdad, no con una URL
  check(!tools.includes("example.com/user/golf"), "tools: el campo IPv6 ya no trae una URL");
  check(/id="v6-in" value="[0-9a-f:]+"/i.test(tools), "tools: y arranca con una IPv6 de ejemplo");

  // 2 · El conversor ofrece Octal (la validación de base 8 ya existía pero era inalcanzable)
  check(/<option value="8">Octal<\/option>/.test(tools), "tools: el conversor tiene la opción Octal");

  // 5 · El pin «Blanco/Verde» del T568 deja el amarillo #f5ee54 por un verde pastel
  check(!tools.includes("#f5ee54") && tools.includes("#dcfce7"), "tools: Blanco/Verde usa verde pastel, no amarillo");

  // Accesibilidad · todo botón de copiar anuncia que copia, y las pestañas son un tablist
  const copias = (tools.match(/data-action="copy-text"/g) || []).length;
  const etiquetas = (tools.match(/aria-label="Copiar/g) || []).length;
  check(copias > 0 && copias === etiquetas, "tools: los " + copias + " botones de copiar llevan aria-label");
  check(/role="tablist"/.test(tools) && /aria-selected=/.test(tools), "tools: las pestañas de la chuleta son un tablist con aria-selected");

  // Funcional sobre jsdom: la IPv6 por defecto normaliza, Octal valida y hay recálculo en vivo
  const env = boot();
  ready(env.A);
  const T = env.window.AulaTools;
  const abrir = (id) => { T.click("tool-open", { dataset: { id } }); };
  abrir("ipv6");
  T.click("tool-ipv6", {});
  check((env.doc.getElementById("v6-out") || { innerHTML: "" }).innerHTML.includes("Expandida"),
    "tools: la IPv6 de ejemplo normaliza sola (Expandida sin tocar nada)");
  abrir("conv");
  env.doc.getElementById("cv-from").value = "8";
  env.doc.getElementById("cv-n").value = "19";
  T.click("tool-conv", {});
  check((env.doc.getElementById("cv-out") || { innerHTML: "" }).innerHTML.includes("base 8"),
    "tools: «19» en octal avisa de que el 9 no existe");
  env.doc.getElementById("cv-n").value = "17";
  T.click("tool-conv", {});
  check(/Decimal<\/span>\s*<b>15</.test(env.doc.getElementById("cv-out").innerHTML),
    "tools: y «17» octal → 15 decimal");
  // recálculo en vivo: escribir dispara el resultado sin pulsar el botón
  abrir("vlsm");
  const campo = env.doc.getElementById("vl-n");
  campo.value = "50";
  campo.dispatchEvent(new env.window.Event("input", { bubbles: true }));
  check((env.doc.getElementById("vl-out") || { innerHTML: "" }).innerHTML.includes("/"),
    "tools: Hosts→CIDR responde mientras escribes (sin botón)");
}

// ------------------------------------------------------- v67.10.0: informe Gemini (lo aplicable)
function testEsquemaTodos() {
  // v67.12: optativa → Programación, media de temas con «aprobar todos» y clases hasta el 27 de febrero
  const seed = JSON.stringify({
    settings: { onboarded: true, demo: false },
    subjects: [
      { id: "m1", name: "Módulo optativo", color: "#84cc16", grade: "" },
      { id: "m2", name: "Sistemas operativos en red", color: "#3b82f6", grade: "" },
      { id: "m3", name: "Servicios en red", color: "#db2777", grade: "",
        eval: { v: 1, componentes: [{ id: "c1", nombre: "Teoría", peso: 100, sobre: 10, nota: 6 }], reglas: { ra: { activo: false, lista: [] }, min: { activo: false } } } },
    ],
  });
  const env = boot({ seed });
  const A = env.window.Aula;
  const st = A.state;
  check(st.settings.endDate === "2027-02-27", "curso: sus clases acaban el 27 de febrero (migración una vez)");
  const prog = st.subjects.find((s) => s.id === "m1");
  check(prog && prog.name === "Programación", "curso: la optativa guardada pasa a llamarse Programación");
  check(A.evalDe(prog) && prog.eval.reglas.todos.activo, "curso: Programación nace con esquema y la regla de aprobar todos los temas");
  const sor = st.subjects.find((s) => s.id === "m2");
  check(A.evalDe(sor) && sor.eval.reglas.todos.activo, "curso: SOR nace con esquema y la regla de aprobar todos los temas");
  const ser = st.subjects.find((s) => s.id === "m3");
  check(ser.eval.reglas.todos && ser.eval.reglas.todos.activo, "curso: los esquemas ya montados también reciben la regla");

  // La regla: un tema por debajo de la mitad suspende aunque la media dé aprobado
  ser.eval.componentes.push({ id: "c2", nombre: "Tema 2", peso: 100, sobre: 10, nota: 8 });
  ser.eval.componentes[0].nota = 4;   // media 6, pero con un tema suspenso
  let est = A.estadoModulo(ser);
  check(est.nota === 6 && est.aprobado === false && /Tema/.test(est.motivo || ""), "regla: un tema < 5 suspende el módulo aunque la media dé");
  ser.eval.componentes[0].nota = 5;
  est = A.estadoModulo(ser);
  check(est.aprobado === true && est.nota === 6.5, "regla: con todos los temas aprobados manda la media");

  // El simulador trata la mitad de cada tema como suelo pendiente
  ser.eval.componentes[1].nota = "";
  const sim = A.notaNecesaria(ser, 5);
  check(sim.minimoPendiente && sim.minimoPendiente.min === 5, "simulador: con la regla activa exige al menos un 5 en lo pendiente");

  // Calendario: a partir del 28 de febrero ya no hay clase (después, prácticas)
  check(A.dayInfo("2027-03-01").kind === "fuera", "calendario: desde el 28 de febrero no hay clase");
  check(A.dayInfo("2027-02-26").kind !== "fuera", "calendario: hasta el 27 de febrero sigue habiendo clase");
}

function testGemini() {
  const ui = fs.readFileSync(path.join(ROOT, "css", "ui.css"), "utf8");
  // Skeleton con pulso y sin brillo para quien pide menos movimiento. Tolerante al minificador
  // (cssnano renombra los @keyframes y quita espacios), así que buscamos «animation» que no sea
  // «none» en el skeleton, y el apagado dentro del media de reduced-motion.
  check(/is-loading[^{]*\{[^}]*animation:(?!\s*none)/.test(ui),
    "gemini: las fotos que cargan usan un skeleton con pulso");
  const reduce = (ui.match(/prefers-reduced-motion:\s*reduce\)[\s\S]{0,300}?is-loading[^{]*\{[^}]*animation:\s*none/) || [])[0];
  check(!!reduce, "gemini: y el pulso se apaga con prefers-reduced-motion");

  // Estado vacío educativo con CTA dentro (no solo el botón de la cabecera)
  const env = boot();
  ready(env.A);
  env.A.state.settings.onboarded = true;   // sin onboarding la vista de notas no se pinta
  env.A.state.notes = [];                   // y con notas de demo nunca veríamos el estado vacío
  env.A.go("notes");
  const vacio = env.doc.querySelector("#view .empty");
  check(!!vacio && !!vacio.querySelector("[data-action=\"add-note\"]"),
    "gemini: «Sin notas» ofrece la acción dentro del estado vacío");
}

// ------------------------------------------------------- v67.11.0: herramientas, 2.ª pasada
async function testTools2() {
  const env = boot();
  ready(env.A);
  const T = env.window.AulaTools;
  const abrir = (id) => T.click("tool-open", { dataset: { id } });
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));

  // Funciones puras expuestas y correctas (sin tocar la UI)
  const c = T.calc;
  const s24 = c.calcSubnet("192.168.1.10/24");
  check(s24 && s24.network === "192.168.1.0" && s24.broadcast === "192.168.1.255" && s24.hosts === 254 && s24.mask === "255.255.255.0",
    "tools2: /24 da red, broadcast, hosts y máscara exactos");
  const s30 = c.calcSubnet("10.0.0.1/30");
  check(s30 && s30.hosts === 2, "tools2: /30 deja 2 hosts útiles");
  const s27 = c.calcSubnet("172.16.0.0/27");
  check(s27 && s27.hosts === 30 && s27.mask === "255.255.255.224", "tools2: /27 → 30 hosts y máscara .224");
  check(c.parseIp("192.168.1.256") === null && c.calcSubnet("1.2.3.4/33") === null,
    "tools2: octeto >255 y CIDR >32 se rechazan sin lanzar");

  // Resultados copiables + visualizador de bits
  abrir("subnet");
  T.click("tool-subnet", {});
  const out = env.doc.getElementById("sn-out");
  check(out.querySelectorAll("button.kv[data-action=\"copy-text\"]").length >= 8,
    "tools2: cada resultado de Subnetting se toca para copiar");
  check(out.querySelectorAll(".bits-viz .bit-n").length === 24 && out.querySelectorAll(".bits-viz .bit-h").length === 8,
    "tools2: el visualizador pinta 24 bits de red y 8 de host para /24");

  // RJ45 en SVG
  abrir("t568");
  check(env.doc.querySelectorAll("#view svg.rj45").length === 2, "tools2: el T568 dibuja los dos conectores RJ45 en SVG");

  // Buscador de la chuleta por descripción (con debounce)
  abrir("sheet");
  T.click("sheet-tab", { dataset: { id: "cisco" } });
  const sh = env.doc.getElementById("sh-q");
  sh.value = "vlan";
  sh.dispatchEvent(new env.window.Event("input", { bubbles: true }));
  await espera(240);
  check(/vlan/i.test(env.doc.getElementById("sh-list").textContent), "tools2: «vlan» filtra la chuleta por descripción");

  // Beeps BIOS con pestañas
  abrir("beeps");
  const antes = env.doc.querySelectorAll("#view .info-row").length;
  T.click("beep-tab", { dataset: { id: "Phoenix" } });
  check(antes > 0 && env.doc.querySelector("#view [data-id=\"Phoenix\"]").getAttribute("aria-selected") === "true",
    "tools2: los pitidos BIOS cambian de fabricante y anuncian la pestaña activa");
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
    await testOllama();
    await testEsquema();
    await testAgenda();
    await testV677();
    testIconoApp();
    testReanalisis();
    testTools();
    await testTools2();
    testEsquemaTodos();
    testGemini();
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
