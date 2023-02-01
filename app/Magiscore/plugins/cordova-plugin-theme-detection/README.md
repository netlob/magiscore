# Cordova plugin for theme detection

## Donation

If you like this plugin feel free to by me a beer :beers:. So I can maintain this and other plugins and projects.

[![https://www.paypal.me/mariusb73/5](https://img.shields.io/badge/donate-paypal-blue.svg?style=flat-square)](https://www.paypal.me/mariusb73/5)


## Description

This plugin detects whether the dark mode is enabled on the device or not.

iOS 13+ must be installed on your device, to use this plugin.
For Android you can use it since Android 9 (Pie). The Browser platform requires `window.matchMedia()` support.

## Installation

Add the plugin with the following command:

`cordova plugin add cordova-plugin-theme-detection`

## Usage

```js
cordova.plugins.ThemeDetection.methodName(
  [parameter],
  function(success) {
    console.log(success);
  },
  function(error) {
    console.log(error);
  }
);
```

#### Ionic Native

If you are using Ionic, use the Ionic Native Wrapper. Install it with `npm install @ionic-native/theme-detection`.

Import the plugin in your app.module:

```ts
 @NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    ThemeDetection,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
```

And import and use it in every of your components:

```ts
import { ThemeDetection } from "@ionic-native/theme-detection/ngx";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html"
})
export class HomePage {
  constructor(private themeDetection: ThemeDetection) {}

  private async isAvailable(): Promise<ThemeDetectionResponse> {
    try {
      let dark_mode_available: ThemeDetectionResponse = await this.themeDetection.isAvailable();
    } catch (e) {
      console.log(e);
    }
  }

  private async isDarkModeEnabled(): Promise<ThemeDetectionResponse> {
    try {
      let dark_mode_enabled: ThemeDetectionResponse = await this.themeDetection.isDarkModeEnabled();
    } catch (e) {
      console.log(e);
    }
  }
}
```

### Methods

#### isAvailable

`cordova.plugins.ThemeDetection.isAvailable()`

Checks whether the device is running on iOS 13 or Android 9 or newer and returns an object with a boolean value and a message.

#### isDarkModeEnabled

`cordova.plugins.ThemeDetection.isDarkModeEnabled()`

Checks whether the dark mode is enabled on device and returns an object with a boolean value and a message.

### Responses

**ThemeDetectionResponse**:

```js
ThemeDetectionResponse {
    value: boolean;
    message: string;
}
```

## Common issues

### UIUserInterfaceStyle

If you have set the following Property in your `config.xml` file, the plugin will always return false:

```xml
<config-file parent="UIUserInterfaceStyle" platform="ios" target="*-Info.plist">
  <string>Light</string>
</config-file>
```

Please remove this property from `config.xml`.

## Changelog

- 1.3.0: Add browser platform support
- 1.2.1: Updated README
- 1.2.0: Bugfix for Android 10
- 1.1.3: Updated from beta
- 1.1.2: Fix in documentation
- 1.1.1: Updated documentation for Android
- 1.1.0: Addded Android support
- 1.0.3: Update README.md for Ionic Native Wrapper support.
- 1.0.1: iOS Version Info if Plugin is not available.
- 1.0.0: Initial version support for iOS.
