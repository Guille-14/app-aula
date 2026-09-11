package es.aula.smr.hub;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

public class WidgetClase extends AppWidgetProvider {
  public static void updateAll(Context ctx, AppWidgetManager mgr, int[] ids) {
    for (int id : ids) mgr.updateAppWidget(id, WidgetStore.claseViews(ctx));
  }

  @Override
  public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
    updateAll(context, appWidgetManager, appWidgetIds);
  }
}
