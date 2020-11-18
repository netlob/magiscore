cordova.define('cordova/plugin_list', function(require, exports, module) {
  module.exports = [
    {
      "id": "cordova-plugin-customurlscheme.LaunchMyApp",
      "file": "plugins/cordova-plugin-customurlscheme/www/ios/LaunchMyApp.js",
      "pluginId": "cordova-plugin-customurlscheme",
      "clobbers": [
        "window.plugins.launchmyapp"
      ]
    },
    {
      "id": "cordova-plugin-vibration.notification",
      "file": "plugins/cordova-plugin-vibration/www/vibration.js",
      "pluginId": "cordova-plugin-vibration",
      "merges": [
        "navigator"
      ]
    },
    {
      "id": "cordova-plugin-splashscreen.SplashScreen",
      "file": "plugins/cordova-plugin-splashscreen/www/splashscreen.js",
      "pluginId": "cordova-plugin-splashscreen",
      "clobbers": [
        "navigator.splashscreen"
      ]
    },
    {
      "id": "cordova-plugin-dialogs.notification",
      "file": "plugins/cordova-plugin-dialogs/www/notification.js",
      "pluginId": "cordova-plugin-dialogs",
      "merges": [
        "navigator.notification"
      ]
    },
    {
      "id": "cordova-open-native-settings.Settings",
      "file": "plugins/cordova-open-native-settings/www/settings.js",
      "pluginId": "cordova-open-native-settings",
      "clobbers": [
        "cordova.plugins.settings"
      ]
    },
    {
      "id": "cordova-plugin-insomnia.Insomnia",
      "file": "plugins/cordova-plugin-insomnia/www/Insomnia.js",
      "pluginId": "cordova-plugin-insomnia",
      "clobbers": [
        "window.plugins.insomnia"
      ]
    },
    {
      "id": "cordova-plugin-taptic-engine.TapticEngine",
      "file": "plugins/cordova-plugin-taptic-engine/www/TapticEngine.js",
      "pluginId": "cordova-plugin-taptic-engine",
      "clobbers": [
        "TapticEngine"
      ]
    },
    {
      "id": "cordova-plugin-statusbar.statusbar",
      "file": "plugins/cordova-plugin-statusbar/www/statusbar.js",
      "pluginId": "cordova-plugin-statusbar",
      "clobbers": [
        "window.StatusBar"
      ]
    },
    {
      "id": "cordova-plugin-device.device",
      "file": "plugins/cordova-plugin-device/www/device.js",
      "pluginId": "cordova-plugin-device",
      "clobbers": [
        "device"
      ]
    },
    {
      "id": "cordova-launch-review.LaunchReview",
      "file": "plugins/cordova-launch-review/www/launchreview.js",
      "pluginId": "cordova-launch-review",
      "clobbers": [
        "LaunchReview"
      ]
    },
    {
      "id": "cordova-plugin-app-version.AppVersionPlugin",
      "file": "plugins/cordova-plugin-app-version/www/AppVersionPlugin.js",
      "pluginId": "cordova-plugin-app-version",
      "clobbers": [
        "cordova.getAppVersion"
      ]
    },
    {
      "id": "cordova-admob-plus.AdMob",
      "file": "plugins/cordova-admob-plus/www/admob.js",
      "pluginId": "cordova-admob-plus",
      "clobbers": [
        "admob"
      ]
    },
    {
      "id": "cordova-plugin-network-information.network",
      "file": "plugins/cordova-plugin-network-information/www/network.js",
      "pluginId": "cordova-plugin-network-information",
      "clobbers": [
        "navigator.connection",
        "navigator.network.connection"
      ]
    },
    {
      "id": "cordova-plugin-network-information.Connection",
      "file": "plugins/cordova-plugin-network-information/www/Connection.js",
      "pluginId": "cordova-plugin-network-information",
      "clobbers": [
        "Connection"
      ]
    },
    {
      "id": "cordova-plugin-purchase.InAppPurchase",
      "file": "plugins/cordova-plugin-purchase/www/store-ios.js",
      "pluginId": "cordova-plugin-purchase",
      "clobbers": [
        "store"
      ]
    },
    {
      "id": "cordova-plugin-wkwebview-engine.ios-wkwebview-exec",
      "file": "plugins/cordova-plugin-wkwebview-engine/src/www/ios/ios-wkwebview-exec.js",
      "pluginId": "cordova-plugin-wkwebview-engine",
      "clobbers": [
        "cordova.exec"
      ]
    },
    {
      "id": "cordova-plugin-wkwebview-engine.ios-wkwebview",
      "file": "plugins/cordova-plugin-wkwebview-engine/src/www/ios/ios-wkwebview.js",
      "pluginId": "cordova-plugin-wkwebview-engine",
      "clobbers": [
        "window.WkWebView"
      ]
    },
    {
      "id": "cordova-plugin-inappbrowser.inappbrowser",
      "file": "plugins/cordova-plugin-inappbrowser/www/inappbrowser.js",
      "pluginId": "cordova-plugin-inappbrowser",
      "clobbers": [
        "cordova.InAppBrowser.open"
      ]
    },
    {
      "id": "cordova-plugin-consent.Consent",
      "file": "plugins/cordova-plugin-consent/www/consent.js",
      "pluginId": "cordova-plugin-consent",
      "clobbers": [
        "consent"
      ]
    }
  ];
  module.exports.metadata = {
    "cordova-plugin-whitelist": "1.3.4",
    "cordova-plugin-customurlscheme": "4.4.0",
    "cordova-plugin-vibration": "3.1.1",
    "cordova-plugin-splashscreen": "5.0.3",
    "cordova-plugin-dialogs": "2.0.2",
    "cordova-open-native-settings": "1.5.2",
    "cordova-plugin-insomnia": "4.3.0",
    "cordova-plugin-taptic-engine": "2.1.0",
    "cordova-plugin-statusbar": "2.4.3",
    "cordova-plugin-device": "2.0.3",
    "cordova-launch-review": "3.1.1",
    "cordova-plugin-app-version": "0.1.9",
    "cordova-admob-plus": "0.0.0",
    "cordova-plugin-network-information": "2.0.2",
    "cordova-plugin-add-swift-support": "2.0.2",
    "cordova-plugin-purchase": "10.3.0",
    "cordova-plugin-wkwebview-engine": "1.2.1",
    "cordova-plugin-inappbrowser": "4.0.1-dev",
    "cordova-plugin-consent": "0.0.0"
  };
});