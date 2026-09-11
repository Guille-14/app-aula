package es.aula.smr.hub;

import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.os.Build;

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
}
