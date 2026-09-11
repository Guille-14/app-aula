package es.aula.smr.hub;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    registerPlugin(AulaWidgetPlugin.class);
    super.onCreate(savedInstanceState);
    try { IconSwitch.restore(this); } catch (Exception ignored) {}
  }
}
