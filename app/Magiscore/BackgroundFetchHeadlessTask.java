// Mensen met meer verstand van java zijn zeer welkom, om de code te verbeteren.

package com.transistorsoft.cordova.backgroundfetch;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.IOException;
import java.net.Socket;
import org.json.*;
import org.json.JSONObject;
import java.lang.Object;
import android.content.SharedPreferences;
import com.transistorsoft.tsbackgroundfetch.BackgroundFetch;
import com.transistorsoft.tsbackgroundfetch.BGTask;
import android.util.Log;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import androidx.core.app.NotificationCompat;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.app.PendingIntent;
import app.netlob.magiscore.R;

public class BackgroundFetchHeadlessTask implements HeadlessTask {
  @Override
  public void onFetch(Context context, BGTask task) {
    String taskId = task.getTaskId();
    boolean isTimeout = task.getTimedOut();
    if (isTimeout) {
      Log.d(BackgroundFetch.TAG, "My BackgroundFetchHeadlessTask TIMEOUT: " + taskId);
      BackgroundFetch.getInstance(context).finish(taskId);
      return;
    }
    Log.d(BackgroundFetch.TAG, "My BackgroundFetchHeadlessTask:  onFetch: " + taskId);
    // Perform your work here....
    Thread thread = new Thread(new Runnable() {
      @Override
      public void run() {
        SharedPreferences SharedPrefs = context.getSharedPreferences("Gemairo", 0);
        String Bearer = SharedPrefs.getString("Tokens", "");
        String SchoolURL = SharedPrefs.getString("SchoolURL", "");
        String PersonID = SharedPrefs.getString("PersonID", "");
        String latestgrades = SharedPrefs.getString("latestGrades", "");
        try {
          JSONObject Tokens = new JSONObject(Bearer);
          final JSONObject latestGrades = new JSONObject(latestgrades);

          String CompleteURL = "https://" + SchoolURL.replaceAll("\"", "") + "/api/personen/" + PersonID
              + "/cijfers/laatste?top=50&skip=0";
          try {
            URL url = new URL(CompleteURL);
            StringBuffer content = new StringBuffer();
            HttpURLConnection con = (HttpURLConnection) url.openConnection();
            con.setRequestMethod("GET");
            con.setRequestProperty("Content-Type", "application/json");
            con.setRequestProperty("Authorization", "Bearer " + Tokens.getString("access_token"));
            con.setRequestProperty("noCache", java.time.Clock.systemUTC().instant().toString());
            con.setRequestProperty("x-requested-with", "app.netlob.magiscore");
            try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(con.getInputStream()))) {
              for (String line; (line = reader.readLine()) != null;) {
                content.append(line);
              }
            }
            String result = content.toString();
            final JSONObject jsonresult = new JSONObject(result);
            Log.d(BackgroundFetch.TAG, "Are latestgrade object's the same? "
                + jsonresult.getString("items").equals(latestGrades.getString("items")));
            if (!jsonresult.getString("items").equals(latestGrades.getString("items"))) {
              NotificationManager mNotificationManager;

              NotificationCompat.Builder mBuilder = new NotificationCompat.Builder(context.getApplicationContext(),
                  "Gemairo");
              Intent ii = new Intent(context.getPackageManager().getLaunchIntentForPackage("app.netlob.magiscore"));
              PendingIntent pendingIntent = PendingIntent.getActivity(context, 0, ii,
                  PendingIntent.FLAG_UPDATE_CURRENT);

              NotificationCompat.BigTextStyle bigText = new NotificationCompat.BigTextStyle();
              bigText.bigText("Nieuwe cijfer(s) beschikbaar");
              bigText.setBigContentTitle("Nieuwe cijfers in Gemairo");

              mBuilder.setContentIntent(pendingIntent);
              mBuilder.setSmallIcon(R.drawable.notification);
              mBuilder.setContentTitle("Nieuwe cijfers in Gemairo");
              mBuilder.setContentText("Nieuwe cijfer(s) beschikbaar");
              mBuilder.setPriority(Notification.PRIORITY_HIGH);
              mBuilder.setStyle(bigText);
              mBuilder.setAutoCancel(true);
              mBuilder.setOnlyAlertOnce(true);

              mNotificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

              if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                String channelId = "Gemairo-Cijfers";
                NotificationChannel channel = new NotificationChannel(
                    channelId,
                    "Cijfers",
                    NotificationManager.IMPORTANCE_DEFAULT);
                mNotificationManager.createNotificationChannel(channel);
                mBuilder.setChannelId(channelId);
              }

              mNotificationManager.notify(0, mBuilder.build());
            }
            BackgroundFetch.getInstance(context).finish(taskId);
          } catch (Exception ex) {
            ex.printStackTrace();
            Log.d(BackgroundFetch.TAG, Log.getStackTraceString(ex));
            BackgroundFetch.getInstance(context).finish(taskId);
          }
        } catch (JSONException e) {
          e.printStackTrace();
          Log.d(BackgroundFetch.TAG, Log.getStackTraceString(e));
          BackgroundFetch.getInstance(context).finish(taskId);
        }
      }
    });
    thread.start();
    BackgroundFetch.getInstance(context).finish(taskId);
  }
}