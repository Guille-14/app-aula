/* Aula SMR · avisos programados en Android
 * ----------------------------------------
 * En el navegador los avisos de js/app.js solo suenan con la app abierta (o recién usada):
 * el navegador no deja programarlos. Dentro del APK, en cambio, Android sí sabe despertarse
 * a una hora concreta aunque la app esté cerrada y el móvil bloqueado; eso es lo que hace
 * este fichero a través del plugin de notificaciones locales de Capacitor.
 *
 * Se programan los mismos avisos que ya existían, con las mismas reglas y los mismos
 * interruptores de Ajustes:
 *   · 10 minutos antes de cada clase (lectiva y con horario ese día)
 *   · la víspera de cada examen a las 18:00 y una hora antes (cada uno se puede apagar)
 *   · resumen por la mañana (hora configurable, 8 por defecto)
 *   · fichas de repaso pendientes (a las 18:00)
 *   · el bloque de estudio: uno al empezar («enfocado hasta las HH:MM») y otro al terminar,
 *     de forma que el final del bloque suena aunque hayas cerrado la app o apagado la pantalla
 *
 * Cada aviso lleva a qué vista pertenece: al tocar la notificación, la app se abre en
 * Exámenes, Horario, Fichas o Inicio. También hay una prueba de 5 segundos para comprobar
 * desde Ajustes que los avisos suenan de verdad en ese móvil.
 *
 * Para que suenen de verdad (con la app cerrada y el móvil en el bolsillo) Android necesita
 * tres cosas, y esta app las persigue desde Ajustes:
 *   1. permiso de notificaciones (POST_NOTIFICATIONS) — el clásico;
 *   2. alarmas con hora exacta: desde Android 12 el teléfono las trae bloqueadas
 *      («Alarmas y recordatorios»). Sin ellas el plugin de Capacitor programa alarmas
 *      inexactas que el móvil puede retrasar o nunca disparar. `alarmasExactas()` lo
 *      detecta y `pedirAlarmasExactas()` abre la pantalla del sistema para activarlas;
 *   3. exención de la optimización de batería: varios fabricantes (Xiaomi, Samsung,
 *      Oppo…) matan las alarmas en segundo plano. `bateria()` la detecta y `pedirBateria()`
 *      abre el diálogo del sistema.
 *  Y todos los avisos se programan con `allowWhileIdle: true`: que suenen aunque el móvil
 *  esté en modo de reposo (Doze) — con `false`, que era como estaba, el teléfono podía
 *  guardarse la notificación «para luego» y no sonar nunca a la hora.
 *
 * `plan()` es una función pura (datos de entrada, lista de avisos de salida) para poder
 * probarla sin móvil ni navegador; la parte nativa solo traduce ese plan a llamadas.
 */
(function () {
  const CANAL = "aula-smr";
  const DIAS = 14; // se programan dos semanas; al abrir la app se vuelve a calcular
  const MAX = 64; // tope de avisos vivos (Android admite muchos más, pero así sobra)
  const ID_PRUEBA = 2147483000; // id reservado para el aviso de prueba
  const ID_BLOQUE = 2147483001; // id reservado para el «bloque terminado»
  const ID_ENFOQUE = 2147483002; // id reservado para el «enfocado hasta las…»
  const FICHAS_HORA = "18:00";
  const DIAS_SEMANA = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  // Qué vista se abre al tocar cada tipo de aviso
  const VISTA = { clase: "schedule", examen: "exams", fichas: "cards", resumen: "dashboard" };

  function app() { return window.Aula || null; }

  function nativo() {
    return !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === "function" && window.Capacitor.isNativePlatform());
  }

  function plugin() {
    if (!nativo()) return null;
    const P = window.Capacitor.Plugins && window.Capacitor.Plugins.LocalNotifications;
    return P && typeof P.schedule === "function" ? P : null;
  }

  /** Avisos programables de verdad: la app va dentro del APK y el plugin está en pie. */
  function disponible() { return !!plugin(); }

  // id estable de 31 bits a partir del texto del aviso (Android lo quiere entero)
  function clave(texto) {
    let h = 2166136261;
    for (let i = 0; i < texto.length; i++) {
      h ^= texto.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return (h % 2147483647) || 1;
  }

  const dos = (n) => String(n).padStart(2, "0");
  const fechaHora = (iso, hhmm, minutosExtra) => {
    const m = /^(\d{1,2}):(\d{2})/.exec(String(hhmm || ""));
    const h = m ? Number(m[1]) : 0;
    const mi = m ? Number(m[2]) : 0;
    const f = new Date(String(iso) + "T00:00:00");
    f.setHours(h, mi + (minutosExtra || 0), 0, 0);
    return f;
  };

  /** Datos reales de la app (estado + horario + exámenes) en el formato que come plan(). */
  function datos() {
    const A = app();
    if (!A || !A.state) return null;
    const st = A.state;
    const dias = [];
    const hoy = new Date();
    for (let i = 0; i < DIAS; i++) {
      const dia = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + i);
      const iso = A.localISO(dia);
      const info = A.dayInfo(iso);
      const lectivo = info.kind === "lectivo";
      const clases = lectivo
        ? A.eventsOnDate(iso).map((e) => ({ start: e.start, subject: A.subjectName(e.subjectId), room: e.room || "" }))
        : [];
      dias.push({ iso, lectivo, etiqueta: info.label || info.short || "Hoy no hay clase", clases });
    }
    return {
      ajustes: st.settings || {},
      dias,
      examenes: (st.exams || []).map((e) => ({
        title: e.title, subject: A.subjectName(e.subjectId), date: e.date, time: e.time, room: e.room || "",
        kind: e.kind || "", puntua: e.puntua !== false,
        openDate: e.openDate || "", openTime: e.openTime || "",
        estado: e.estado || "", endTime: e.endTime || "",
      })),
      fichas: typeof A.dueCards === "function" ? A.dueCards().length : 0,
    };
  }

  const pad2 = (n) => String(n).padStart(2, "0");

  /** Plan de avisos: puro, sin tocar el móvil. `ahora` permite probarlo con fechas fijas. */
  function plan(d, ahora) {
    if (!d || !d.ajustes) return [];
    const ahoraMs = (ahora || new Date()).getTime();
    const st = d.ajustes;
    const lista = [];
    const mete = (id, tipo, titulo, cuerpo, cuando, vista) => {
      if (!cuando || isNaN(cuando.getTime()) || cuando.getTime() <= ahoraMs) return;
      lista.push({ id: clave(id), tipo, titulo, cuerpo, cuando, vista: vista || VISTA[tipo] || "dashboard" });
    };

    // Clases: diez minutos antes de cada una
    if (st.notifyClass !== false) {
      (d.dias || []).forEach((dia) => {
        (dia.clases || []).forEach((c, i) => {
          const cuando = fechaHora(dia.iso, c.start, -10);
          mete("clase|" + dia.iso + "|" + i + "|" + c.start, "clase", "Clase en 10 min",
            c.subject + (c.room ? " · " + c.room : "") + " · " + c.start, cuando, "schedule");
        });
      });
    }

    // Exámenes: la tarde anterior y una hora antes
    (d.examenes || []).forEach((e, i) => {
      if (!e.date) return;
      const esTrabajo = String(e.kind || "").toLowerCase() === "trabajo";
      const etiqueta = e.title || e.subject || (esTrabajo ? "Entrega" : "Examen");
      const cola = [e.subject, e.time ? (esTrabajo ? "hasta las " + e.time : e.time) : "", e.room].filter(Boolean).join(" · ");
      // El día que se abre la entrega, para que no se te pase por empezarla tarde
      if (esTrabajo && e.openDate && st.notifyDeliveryOpen !== false) {
        mete("entrega-abre|" + e.openDate + "|" + i, "examen", "Se abre una entrega",
          etiqueta + (e.subject ? " · " + e.subject : "") + (e.time ? " · hasta el " + e.date + " a las " + e.time : ""),
          fechaHora(e.openDate, e.openTime || "08:00", 0), "exams");
      }
      // El último día para entregar, a la hora del resumen (por defecto las 8:00 de la mañana)
      if (esTrabajo && st.notifyDeliveryClose !== false) {
        mete("entrega-cierra|" + e.date + "|" + i, "examen", "Último día para entregar",
          etiqueta + (e.time ? " · hasta las " + e.time : "") + (e.subject ? " · " + e.subject : ""),
          fechaHora(e.date, pad2(st.remindHour || 8) + ":00", 0), "exams");
      }
      if (st.notifyExamEve !== false) {
        mete("examen-vispera|" + e.date + "|" + i, "examen", esTrabajo ? "Entrega mañana" : "Mañana examen",
          etiqueta + (cola ? " · " + cola : ""), fechaHora(e.date, "18:00", -1440), "exams");
      }
      if (st.notifyExamHour !== false && e.time) {
        mete("examen-hora|" + e.date + "|" + i, "examen", esTrabajo ? "Entrega en 1 hora" : "Examen en 1 hora", etiqueta + (e.subject ? " · " + e.subject : ""), fechaHora(e.date, e.time, -60), "exams");
      }
    });

    // Resumen de la mañana: cuántas clases y a qué hora empieza la primera
    if (st.morningSummary !== false) {
      const hora = Math.min(12, Math.max(5, Number(st.remindHour) || 8));
      (d.dias || []).forEach((dia) => {
        const n = (dia.clases || []).length;
        const cuerpo = !n ? dia.etiqueta : n + (n === 1 ? " clase" : " clases") + " · primera a las " + dia.clases[0].start;
        mete("manana|" + dia.iso, "resumen", "Buenos días", cuerpo, fechaHora(dia.iso, hora + ":00", 0), "dashboard");
      });
    }

    // Fichas de repaso pendientes (solo si hay alguna; se recalcula al abrir la app)
    if (st.notifyCards !== false && d.fichas > 0) {
      (d.dias || []).slice(0, 2).forEach((dia) => {
        mete("fichas|" + dia.iso, "fichas", "Fichas pendientes", d.fichas + " para repasar", fechaHora(dia.iso, FICHAS_HORA, 0), "cards");
      });
    }

    return lista.sort((a, b) => a.cuando - b.cuando).slice(0, MAX);
  }

  /** Texto corto para Ajustes: qué va a avisar el móvil y cuándo es lo siguiente. */
  function resumen(d, ahora) {
    const lista = plan(d, ahora);
    if (!lista.length) return "No hay nada que avisar en las próximas dos semanas.";
    const a = lista[0];
    const f = a.cuando;
    const ahoraMs = (ahora || new Date()).getTime();
    const dias = Math.round((new Date(f.getFullYear(), f.getMonth(), f.getDate()) - new Date(new Date(ahoraMs).getFullYear(), new Date(ahoraMs).getMonth(), new Date(ahoraMs).getDate())) / 86400000);
    const cuando = dias === 0 ? "hoy a las " + dos(f.getHours()) + ":" + dos(f.getMinutes())
      : dias === 1 ? "mañana a las " + dos(f.getHours()) + ":" + dos(f.getMinutes())
      : DIAS_SEMANA[f.getDay()] + " " + f.getDate() + " a las " + dos(f.getHours()) + ":" + dos(f.getMinutes());
    return "Programados " + lista.length + (lista.length === 1 ? " aviso" : " avisos") + " · el siguiente, " + cuando;
  }

  /** Programa de verdad: pide permiso si hace falta y deja el móvil con los avisos puestos. */
  async function sincronizar(opciones) {
    const o = opciones || {};
    const P = plugin();
    if (!P) return { nativo: false, programados: 0, permiso: false };
    const d = o.datos || datos();
    if (!d) return { nativo: true, programados: 0, permiso: true };
    let permiso = false;
    try {
      const actual = await P.checkPermissions();
      permiso = actual.display === "granted";
      if (!permiso && o.pedirPermiso) {
        const pedido = await P.requestPermissions();
        permiso = pedido.display === "granted";
      }
    } catch { permiso = false; }
    if (!permiso) return { nativo: true, programados: 0, permiso: false };
    try {
      await P.createChannel({
        id: CANAL, name: "Avisos de Aula SMR", description: "Clases, exámenes y repaso",
        importance: 4, visibility: 1, lights: true, vibration: true,
      });
    } catch { /* el canal ya existe o la versión no lo necesita */ }
    // Fuera lo viejo: el plan nuevo refleja los exámenes y el horario de ahora mismo
    try {
      const viejos = await P.getPending();
      const ids = (viejos.notifications || []).map((n) => ({ id: n.id }));
      if (ids.length) await P.cancel({ notifications: ids });
    } catch { /* si no se puede limpiar, programar igualmente es mejor que nada */ }
    const avisos = plan(d, o.ahora || new Date());
    if (avisos.length) {
      try {
        await P.schedule({
          notifications: avisos.map((a) => ({
            id: a.id, title: a.titulo, body: a.cuerpo, channelId: CANAL,
            extra: { vista: a.vista },
            // allowWhileIdle: true es lo que hace sonar el aviso aunque el móvil esté
            // bloqueado y en reposo (Doze). Con false, Android puede retrasarlo o no
            // dispararlo nunca: era por ahí por donde se escapaban las notificaciones.
            schedule: { at: a.cuando, allowWhileIdle: true },
          })),
        });
      } catch {
        return { nativo: true, programados: 0, permiso: true };
      }
    }
    return { nativo: true, programados: avisos.length, permiso: true };
  }

  /** Avisos del bloque de estudio: el de «enfocado» y el del final (que suena con la app cerrada).
   *  `fin` es el instante en que acaba el bloque; `minutos` solo se usa para el texto. */
  async function programarBloque(datos) {
    const o = datos || {};
    const P = plugin();
    if (!P) return { nativo: false, ok: false };
    const fin = o.fin && typeof o.fin.getTime === "function" ? o.fin : null;
    if (!fin || fin.getTime() <= Date.now()) return { nativo: true, ok: false };
    const minutos = Math.max(1, Math.round(Number(o.minutos) || (fin.getTime() - Date.now()) / 60000));
    const etiqueta = o.etiqueta ? " · " + o.etiqueta : "";
    const hhmm = dos(fin.getHours()) + ":" + dos(fin.getMinutes());
    try {
      const p = await P.checkPermissions();
      if (p.display !== "granted") return { nativo: true, ok: false, permiso: false };
      await cancelarBloque();   // fuera los del bloque anterior (o de un móvil reiniciado)
      await P.schedule({
        notifications: [
          {
            id: ID_ENFOQUE, title: "Enfocado hasta las " + hhmm,
            body: minutos + " min de estudio" + etiqueta + ". Puedes cerrar la app: te aviso al terminar.",
            channelId: CANAL, extra: { vista: "timer" }, autoCancel: true,
            schedule: { at: new Date(Date.now() + 1000), allowWhileIdle: true },
          },
          {
            id: ID_BLOQUE, title: "Bloque terminado", body: "+" + minutos + " min" + etiqueta + ". Toca para el descanso.",
            channelId: CANAL, extra: { vista: "timer" },
            // que suene aunque la pantalla esté apagada y el móvil en reposo: ese es el punto
            schedule: { at: fin, allowWhileIdle: true },
          },
        ],
      });
      return { nativo: true, ok: true, fin };
    } catch {
      return { nativo: true, ok: false };
    }
  }

  /** Quita los avisos del bloque (al pausar, terminar o cambiar de modo). */
  async function cancelarBloque() {
    const P = plugin();
    if (!P) return { nativo: false, ok: false };
    try {
      await P.cancel({ notifications: [{ id: ID_BLOQUE }, { id: ID_ENFOQUE }] });
      return { nativo: true, ok: true };
    } catch { return { nativo: true, ok: false }; }
  }

  /** Estado del permiso de Android, para poder enseñarlo en Ajustes. */
  async function permiso() {
    const P = plugin();
    if (!P) return "no-nativo";
    try {
      const p = await P.checkPermissions();
      return p.display === "granted" ? "concedido" : p.display === "denied" ? "denegado" : "preguntar";
    } catch { return "desconocido"; }
  }

  /** Aviso de prueba: suena 5 segundos después de tocarlo (para probar en el móvil). */
  async function probar(opciones) {
    const o = opciones || {};
    const P = plugin();
    if (!P) return { nativo: false, ok: false };
    // Siempre 5 segundos después (opciones.ahora solo existe para poder probarlo con fechas fijas)
    // (se acepta cualquier objeto con getTime: dentro del navegador, un Date de otro contexto
    // no pasa un instanceof Date y se programaría en el momento equivocado)
    const base = o.ahora && typeof o.ahora.getTime === "function" ? o.ahora : new Date();
    const at = new Date(base.getTime() + 5000);
    try {
      const p = await P.checkPermissions();
      if (p.display !== "granted") {
        const pedido = await P.requestPermissions();
        if (pedido.display !== "granted") return { nativo: true, ok: false, permiso: false };
      }
      await P.schedule({
        notifications: [{
          id: ID_PRUEBA, title: "Aula SMR", body: "Prueba de aviso: si ves esto, funciona. Te avisará en 5 segundos.",
          channelId: CANAL, extra: { vista: "settings" }, schedule: { at, allowWhileIdle: true },
        }],
      });
      return { nativo: true, ok: true, permiso: true, cuando: at };
    } catch {
      return { nativo: true, ok: false, permiso: true };
    }
  }

  /** ¿Tiene el móvil permiso para programar alarmas a una hora exacta? (Android 12+:
   *  «Alarmas y recordatorios».) `null` = no se puede saber (fuera del APK o móvil antiguo
   *  donde no existe el interruptor: ahí las alarmas son exactas por defecto). */
  async function alarmasExactas() {
    const P = plugin();
    if (!P || typeof P.checkExactNotificationSetting !== "function") return null;
    try {
      const r = await P.checkExactNotificationSetting();
      return r && r.exact_alarm === "granted";
    } catch { return null; }
  }

  /** Abre la pantalla del sistema para activar las alarmas exactas. Devuelve el estado
   *  final (`exact_alarm`) cuando el usuario vuelve. */
  async function pedirAlarmasExactas() {
    const P = plugin();
    if (!P || typeof P.changeExactNotificationSetting !== "function") return { ok: false, motivo: "no-disponible" };
    try {
      const r = await P.changeExactNotificationSetting();
      return { ok: true, exact_alarm: r && r.exact_alarm };
    } catch { return { ok: false, motivo: "fallo" }; }
  }

  /** ¿Le vigila el móvil la batería? `vigilada` = la optimización de batería puede matar
   *  las alarmas en segundo plano; `exenta` = el móvil la respeta; `null` = fuera del APK
   *  o no se puede comprobar. */
  async function bateria() {
    if (!nativo()) return null;
    const W = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.AulaWidget;
    if (!W || typeof W.verBateria !== "function") return null;
    try {
      const r = await W.verBateria();
      return r && r.ignorando ? "exenta" : "vigilada";
    } catch { return null; }
  }

  /** Pide al móvil que excluya a la app de la optimización de batería (diálogo del sistema). */
  async function pedirBateria() {
    if (!nativo()) return { ok: false, motivo: "no-nativo" };
    const W = window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.AulaWidget;
    if (!W || typeof W.pedirBateria !== "function") return { ok: false, motivo: "no-disponible" };
    try {
      const r = await W.pedirBateria();
      return r && typeof r.ok === "boolean" ? r : { ok: false, motivo: "fallo" };
    } catch { return { ok: false, motivo: "fallo" }; }
  }

  /** Al tocar una notificación se llama a `cb(vista)`: la app abre esa pantalla. */
  function escucharToques(cb) {
    const P = plugin();
    if (!P || typeof P.addListener !== "function" || typeof cb !== "function") return false;
    try {
      P.addListener("localNotificationActionPerformed", (info) => {
        const datos = (info && (info.notification || info)) || {};
        const extra = datos.extra || {};
        if (extra.vista) cb(extra.vista);
      });
      return true;
    } catch { return false; }
  }

  /** Botón de Ajustes: pide permiso (la primera vez) y deja los avisos programados. */
  async function activar() {
    return sincronizar({ pedirPermiso: true });
  }

  /** Apaga los avisos programados (al desactivarlos desde Ajustes). */
  async function apagar() {
    const P = plugin();
    if (!P) return { nativo: false, programados: 0 };
    try {
      const viejos = await P.getPending();
      const ids = (viejos.notifications || []).map((n) => ({ id: n.id }));
      if (ids.length) await P.cancel({ notifications: ids });
    } catch { /* nada que cancelar */ }
    return { nativo: true, programados: 0 };
  }

  window.AulaAvisos = {
    plan, datos, resumen, sincronizar, activar, apagar, permiso, probar, escucharToques,
    programarBloque, cancelarBloque,
    alarmasExactas, pedirAlarmasExactas, bateria, pedirBateria,
    disponible, nativo, maxAvisos: MAX, idPrueba: ID_PRUEBA, idBloque: ID_BLOQUE, idEnfoque: ID_ENFOQUE,
  };
})();
