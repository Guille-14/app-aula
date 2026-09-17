package es.aula.smr.hub;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.PowerManager;
import android.provider.Settings;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AulaWidget")
public class AulaWidgetPlugin extends Plugin {
  @PluginMethod
  public void update(PluginCall call) {
    JSObject data = call.getData();
    WidgetStore.put(getContext(), data != null ? data.toString() : "{}");
    call.resolve();
  }

  @PluginMethod
  public void setIcon(PluginCall call) {
    String id = call.getString("id", "dragon");
    IconSwitch.apply(getContext(), id);
    JSObject ok = new JSObject();
    ok.put("ok", true);
    ok.put("id", IconSwitch.normalize(id));
    call.resolve(ok);
  }

  @PluginMethod
  public void pin(PluginCall call) {
    String id = call.getString("id", "hoy");
    Class<?> cls = WidgetStore.clsFor(id);
    if (cls == null) cls = WidgetHoy.class;
    AppWidgetManager mgr = AppWidgetManager.getInstance(getContext());
    if (Build.VERSION.SDK_INT >= 26 && mgr.isRequestPinAppWidgetSupported()) {
      mgr.requestPinAppWidget(new ComponentName(getContext(), cls), null, null);
      JSObject ok = new JSObject();
      ok.put("ok", true);
      call.resolve(ok);
    } else {
      call.reject("unsupported");
    }
  }

  /** ¿Está la app exenta de la optimización de batería? (Xiaomi, Samsung & co. matan las
   *  alarmas en segundo plano de las apps que no lo están, y los avisos no suenan nunca.)
   *  Necesita el permiso REQUEST_IGNORE_BATTERY_OPTIMIZATIONS en el manifiesto. */
  @PluginMethod
  public void verBateria(PluginCall call) {
    JSObject r = new JSObject();
    boolean ignorando = false;
    try {
      PowerManager pm = (PowerManager) getContext().getSystemService(Context.POWER_SERVICE);
      if (pm != null) ignorando = pm.isIgnoringBatteryOptimizations(getContext().getPackageName());
    } catch (Exception ignored) { /* sin permiso, se responde «no exenta» */ }
    r.put("ignorando", ignorando);
    call.resolve(r);
  }

  /** Abre el diálogo del sistema «¿Permitir a Aula SMR usar energía sin restricciones?»
   *  para eximirla de la optimización de batería. Se intenta directamente (sin
   *  resolveActivity, que en Android 11+ miente por visibilidad de paquetes): si el
   *  móvil no lo ofrece o no está el permiso, se responde con ok=false. */
  @PluginMethod
  public void pedirBateria(PluginCall call) {
    JSObject r = new JSObject();
    try {
      Intent i = new Intent(
          Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS,
          Uri.parse("package:" + getContext().getPackageName()));
      i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
      getContext().startActivity(i);
      r.put("ok", true);
      call.resolve(r);
    } catch (Exception e) {
      r.put("ok", false);
      r.put("motivo", "no-disponible");
      call.resolve(r);
    }
  }
}
