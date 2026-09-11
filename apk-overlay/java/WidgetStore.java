package es.aula.smr.hub;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

public final class WidgetStore {
  public static final String PREFS = "aula.widget";
  public static final String[] ALL_IDS = {
    "clase", "hoy", "horario", "festivos",
    "media", "racha", "estudio", "semana", "xp", "fichas",
    "asistencia", "curso", "bandeja",
    "foco", "festivo", "hint", "mini_clase", "mini_racha", "duo"
  };

  private WidgetStore() {}

  public static void put(Context ctx, String json) {
    ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).edit().putString("data", json).apply();
    refresh(ctx);
  }

  public static JSONObject get(Context ctx) {
    try {
      String s = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE).getString("data", "{}");
      return new JSONObject(s == null ? "{}" : s);
    } catch (Exception e) {
      return new JSONObject();
    }
  }

  public static String str(JSONObject o, String path, String fb) {
    try {
      String[] p = path.split("\\.");
      JSONObject cur = o;
      for (int i = 0; i < p.length - 1; i++) cur = cur.optJSONObject(p[i]);
      if (cur == null) return fb;
      String v = cur.optString(p[p.length - 1], fb);
      return v == null || v.isEmpty() ? fb : v;
    } catch (Exception e) {
      return fb;
    }
  }

  public static String box(JSONObject d, String id, String key, String fb) {
    try {
      JSONObject b = d.optJSONObject(id);
      if (b == null) return fb;
      String v = b.optString(key, fb);
      return v == null || v.isEmpty() ? fb : v;
    } catch (Exception e) {
      return fb;
    }
  }

  public static PendingIntent openApp(Context ctx, int req) {
    Intent i = new Intent(ctx, MainActivity.class);
    i.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_SINGLE_TOP);
    int flags = PendingIntent.FLAG_UPDATE_CURRENT;
    flags |= PendingIntent.FLAG_IMMUTABLE;
    return PendingIntent.getActivity(ctx, req, i, flags);
  }

  public static String className(String id) {
    if (id == null) return "WidgetHoy";
    switch (id) {
      case "clase": return "WidgetClase";
      case "hoy": return "WidgetHoy";
      case "horario": return "WidgetHorario";
      case "media": return "WidgetMedia";
      case "racha": return "WidgetRacha";
      case "estudio": return "WidgetEstudio";
      case "semana": return "WidgetSemana";
      case "xp": return "WidgetXp";
      case "fichas": return "WidgetFichas";
      case "asistencia": return "WidgetAsistencia";
      case "curso": return "WidgetCurso";
      case "bandeja": return "WidgetBandeja";
      case "foco": return "WidgetFoco";
      case "festivo": return "WidgetFestivo";
      case "hint": return "WidgetHint";
      case "festivos": return "WidgetFestivos";
      case "mini_clase": return "WidgetMiniClase";
      case "mini_racha": return "WidgetMiniRacha";
      case "duo": return "WidgetDuo";
      default: return "WidgetHoy";
    }
  }

  public static Class<?> clsFor(String id) {
    try {
      return Class.forName("es.aula.smr.hub." + className(id));
    } catch (Exception e) {
      return WidgetHoy.class;
    }
  }

  public static RemoteViews views(Context ctx, String id) {
    if (id == null) id = "hoy";
    switch (id) {
      case "clase": return claseViews(ctx);
      case "hoy": return hoyViews(ctx);
      case "horario":
      case "festivos":
        return listViews(ctx, id);
      case "mini_clase":
      case "mini_racha":
        return tinyViews(ctx, id);
      case "duo":
        return duoViews(ctx);
      case "foco":
      case "festivo":
      case "hint":
        return cardViews(ctx, id);
      default:
        return statViews(ctx, id);
    }
  }

  public static void refresh(Context ctx) {
    AppWidgetManager m = AppWidgetManager.getInstance(ctx);
    for (String id : ALL_IDS) {
      try {
        Class<?> cls = clsFor(id);
        int[] ids = m.getAppWidgetIds(new ComponentName(ctx, cls));
        if (ids == null || ids.length == 0) continue;
        RemoteViews v = views(ctx, id);
        for (int w : ids) m.updateAppWidget(w, v);
      } catch (Exception ignored) {}
    }
  }

  public static RemoteViews claseViews(Context ctx) {
    JSONObject d = get(ctx);
    RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_clase);
    v.setTextViewText(R.id.w_kicker, str(d, "clase.kicker", "PRÓXIMA CLASE"));
    v.setTextViewText(R.id.w_title, str(d, "clase.title", "Abre Aula SMR"));
    v.setTextViewText(R.id.w_sub, str(d, "clase.sub", "Los datos salen al abrir la app"));
    v.setOnClickPendingIntent(R.id.widget_root, openApp(ctx, 11));
    return v;
  }

  public static RemoteViews hoyViews(Context ctx) {
    JSONObject d = get(ctx);
    RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_hoy);
    v.setTextViewText(R.id.w_clase, str(d, "clase.title", "Sin clase"));
    v.setTextViewText(R.id.w_clase_sub, str(d, "clase.sub", ""));
    v.setTextViewText(R.id.w_clase_k, str(d, "clase.kicker", "CLASE"));
    v.setTextViewText(R.id.w_exam, str(d, "festivo.title", "Sin clase"));
    v.setTextViewText(R.id.w_exam_sub, str(d, "festivo.sub", ""));
    v.setOnClickPendingIntent(R.id.widget_root, openApp(ctx, 13));
    return v;
  }

  public static RemoteViews cardViews(Context ctx, String id) {
    JSONObject d = get(ctx);
    RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_card);
    v.setTextViewText(R.id.w_kicker, box(d, id, "kicker", "AULA"));
    v.setTextViewText(R.id.w_title, box(d, id, "title", "Abre Aula SMR"));
    v.setTextViewText(R.id.w_sub, box(d, id, "sub", ""));
    v.setOnClickPendingIntent(R.id.widget_root, openApp(ctx, 30 + Math.abs(id.hashCode() % 70)));
    return v;
  }

  public static RemoteViews statViews(Context ctx, String id) {
    JSONObject d = get(ctx);
    RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_stat);
    v.setTextViewText(R.id.w_kicker, box(d, id, "kicker", "STAT"));
    v.setTextViewText(R.id.w_num, box(d, id, "num", "—"));
    v.setTextViewText(R.id.w_sub, box(d, id, "sub", ""));
    v.setOnClickPendingIntent(R.id.widget_root, openApp(ctx, 40 + Math.abs(id.hashCode() % 70)));
    return v;
  }

  public static RemoteViews tinyViews(Context ctx, String id) {
    JSONObject d = get(ctx);
    RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_tiny);
    v.setTextViewText(R.id.w_kicker, box(d, id, "kicker", "MINI"));
    v.setTextViewText(R.id.w_num, box(d, id, "num", "—"));
    v.setOnClickPendingIntent(R.id.widget_root, openApp(ctx, 50 + Math.abs(id.hashCode() % 70)));
    return v;
  }

  public static RemoteViews duoViews(Context ctx) {
    JSONObject d = get(ctx);
    RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_duo);
    v.setTextViewText(R.id.w_lk, box(d, "duo", "lk", "CLASE"));
    v.setTextViewText(R.id.w_lt, box(d, "duo", "lt", str(d, "clase.title", "—")));
    v.setTextViewText(R.id.w_rk, box(d, "duo", "rk", "SIN CLASE"));
    v.setTextViewText(R.id.w_rt, box(d, "duo", "rt", str(d, "festivo.title", "—")));
    v.setOnClickPendingIntent(R.id.widget_root, openApp(ctx, 14));
    return v;
  }

  public static RemoteViews listViews(Context ctx, String id) {
    JSONObject d = get(ctx);
    RemoteViews v = new RemoteViews(ctx.getPackageName(), R.layout.widget_list);
    JSONObject box = d.optJSONObject(id);
    String kicker = "LISTA";
    JSONArray rows = null;
    if (box != null) {
      String k = box.optString("kicker", kicker);
      if (k != null && !k.isEmpty()) kicker = k;
      rows = box.optJSONArray("rows");
    }
    v.setTextViewText(R.id.w_kicker, kicker);
    int[] ts = { R.id.w_r1t, R.id.w_r2t, R.id.w_r3t };
    int[] ss = { R.id.w_r1s, R.id.w_r2s, R.id.w_r3s };
    for (int i = 0; i < 3; i++) {
      String t = "";
      String s = "";
      if (rows != null && i < rows.length()) {
        JSONObject r = rows.optJSONObject(i);
        if (r != null) {
          t = r.optString("t", "");
          s = r.optString("s", "");
        }
      }
      if (i == 0 && (t == null || t.isEmpty())) t = "Nada que mostrar";
      v.setTextViewText(ts[i], t == null ? "" : t);
      v.setTextViewText(ss[i], s == null ? "" : s);
    }
    v.setOnClickPendingIntent(R.id.widget_root, openApp(ctx, 20 + Math.abs(id.hashCode() % 70)));
    return v;
  }
}
