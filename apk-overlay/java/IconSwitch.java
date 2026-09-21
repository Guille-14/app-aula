package es.aula.smr.hub;

import android.content.ComponentName;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;

public final class IconSwitch {
  public static final String[] IDS = {
    "dragon",
    "arcanine", "arceus", "blastoise", "charizard", "gyarados", "garchomp",
    "deoxys", "espeon", "gengar", "giratina", "groudon", "kyogre",
    "lucario", "lugia", "metagross", "mewtwo", "rayquaza", "salamence"
  };
  private static final String PREF = "aula_icon";
  private static final String KEY = "id";

  private IconSwitch() {}

  public static String aliasClass(String id) {
    if (id == null || id.isEmpty()) id = "dragon";
    return "es.aula.smr.hub.Ico" + Character.toUpperCase(id.charAt(0)) + id.substring(1);
  }

  public static String normalize(String id) {
    if (id == null || id.isEmpty() || id.startsWith("c:")) return "dragon";
    for (String s : IDS) if (s.equals(id)) return s;
    return "dragon";
  }

  public static void apply(Context ctx, String id) {
    id = normalize(id);
    ctx.getSharedPreferences(PREF, Context.MODE_PRIVATE).edit().putString(KEY, id).apply();
    PackageManager pm = ctx.getPackageManager();
    String pkg = ctx.getPackageName();
    ComponentName enable = new ComponentName(pkg, aliasClass(id));
    try {
      pm.setComponentEnabledSetting(enable, PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP);
    } catch (Exception ignored) {}
    for (String ico : IDS) {
      if (ico.equals(id)) continue;
      try {
        pm.setComponentEnabledSetting(
          new ComponentName(pkg, aliasClass(ico)),
          PackageManager.COMPONENT_ENABLED_STATE_DISABLED,
          PackageManager.DONT_KILL_APP
        );
      } catch (Exception ignored) {}
    }
  }

  public static void restore(Context ctx) {
    String id = ctx.getSharedPreferences(PREF, Context.MODE_PRIVATE).getString(KEY, "dragon");
    apply(ctx, id);
  }
}
