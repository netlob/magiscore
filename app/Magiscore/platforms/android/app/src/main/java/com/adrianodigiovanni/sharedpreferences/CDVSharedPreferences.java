package com.adrianodigiovanni.sharedpreferences;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.Set;

public class CDVSharedPreferences extends CordovaPlugin {
    private static final int NAME = 0;
    private static final int KEY = 1;
    private static final int VALUE = 2;

    private static final String MISSING_KEY = "Missing key";
    private static final String FAILED_TO_WRITE = "Failed to write";

    @Override
    public boolean execute(String action, final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if (action.equals("getBoolean")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String name = args.getString(NAME);
                        String key = args.getString(KEY);
                        SharedPreferences sharedPreferences = getSharedPreferences(name);

                        if (sharedPreferences.contains(key)) {
                            boolean booleanValue = sharedPreferences.getBoolean(key, false);
                            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, booleanValue));
                            return;
                        }

                        callbackContext.error(MISSING_KEY);

                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if (action.equals("putBoolean")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String name = args.getString(NAME);
                        String key = args.getString(KEY);
                        boolean booleanValue = args.getBoolean(VALUE);

                        boolean success = getSharedPreferences(name)
                            .edit()
                            .putBoolean(key, booleanValue)
                            .commit();

                        if (success) {
                            callbackContext.success();
                            return;
                        }

                        callbackContext.error(FAILED_TO_WRITE);
                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if (action.equals("getString")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String name = args.getString(NAME);
                        String key = args.getString(KEY);
                        SharedPreferences sharedPreferences = getSharedPreferences(name);

                        if (sharedPreferences.contains(key)) {
                            String stringValue = sharedPreferences.getString(key, "");
                            callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, stringValue));
                            return;
                        }

                        callbackContext.error(MISSING_KEY);

                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if (action.equals("putString")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String name = args.getString(NAME);
                        String key = args.getString(KEY);
                        String stringValue = args.getString(VALUE);

                        boolean success = getSharedPreferences(name)
                            .edit()
                            .putString(key, stringValue)
                            .commit();

                        if (success) {
                            callbackContext.success();
                            return;
                        }

                        callbackContext.error(FAILED_TO_WRITE);
                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if (action.equals("getNumber")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String name = args.getString(NAME);
                        String key = args.getString(KEY);
                        SharedPreferences sharedPreferences = getSharedPreferences(name);

                        if (sharedPreferences.contains(key)) {
                            double doubleValue = Double.longBitsToDouble(sharedPreferences.getLong(key, Long.MIN_VALUE));
                            JSONArray message = new JSONArray();
                            message.put(doubleValue);
                            callbackContext.success(message);
                            return;
                        }

                        callbackContext.error(MISSING_KEY);

                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if (action.equals("putNumber")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String name = args.getString(NAME);
                        String key = args.getString(KEY);
                        double doubleValue = args.getDouble(VALUE);

                        boolean success = getSharedPreferences(name)
                            .edit()
                            .putLong(key, Double.doubleToRawLongBits(doubleValue))
                            .commit();

                        if (success) {
                            callbackContext.success();
                            return;
                        }

                        callbackContext.error(FAILED_TO_WRITE);
                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if (action.equals("del")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String name = args.getString(NAME);
                        String key = args.getString(KEY);

                        boolean success = getSharedPreferences(name)
                            .edit()
                            .remove(key)
                            .commit();

                        if (success) {
                            callbackContext.success();
                            return;
                        }

                        callbackContext.error(FAILED_TO_WRITE);
                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if(action.equals("has")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String name = args.getString(NAME);
                        String key = args.getString(KEY);

                        boolean result = getSharedPreferences(name).contains(key);

                        callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, result));
                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if (action.equals("keys")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String name = args.getString(NAME);

                        Set<String> keys = getSharedPreferences(name).getAll().keySet();
                        JSONArray message = new JSONArray(keys);

                        callbackContext.success(message);
                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        if(action.equals("clear")) {
            cordova.getThreadPool().execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        String name = args.getString(NAME);

                        boolean success = getSharedPreferences(name)
                            .edit()
                            .clear()
                            .commit();

                        if (success) {
                            callbackContext.success();
                            return;
                        }

                        callbackContext.error(FAILED_TO_WRITE);
                    } catch (Exception e) {
                        callbackContext.error(e.getMessage());
                    }
                }
            });

            return true;
        }

        return false;
    }

    public SharedPreferences getSharedPreferences(String name) {
        Activity activity = cordova.getActivity();
        int mode = Activity.MODE_PRIVATE;

        if (name.equals("")) {
            return activity.getPreferences(mode);
        }

        return activity.getSharedPreferences(name, mode);
    }
}
