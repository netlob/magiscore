# README #

## Cordova Plugin for App Tracking Transparency Framework ##

This framework allows to implement the App Tracking Transparency Framework for iOS 14.5. Also you can display a screen before asking the user for permission.


### Installation ###

```
cordova plugin add cordova-plugin-tracking-transparency
```

### Implementation ###

First you have to add a string in the app info.plist for NSUserTrackingUsageDescription.
To do this, add following code in your config.xml and reinstall ios platform.

```xml
<edit-config file="*-Info.plist" mode="merge" target="NSUserTrackingUsageDescription">
            <string>ENTER YOUR TEXT HERE</string>
</edit-config>
```


The plugin consists of three functions.
Next you see a declaration of the plugins api for typescript.
```ts
declare var window: {plugins: {
    impacTracking: {
        canRequestTracking: (callback: (result: boolean) => void) => void,
        trackingAvailable: (callback: (result: boolean) => void) => void
        requestTracking: (info: string | undefined, callback: (result: boolean) => void, errorCallback: (error: any) => void) => void
    }
}};
```

Now first you should check if tracking is available. If not you should check if it is possible to request tracking. This is not available for os below 14.5 or if the user disabled the tracking globally.
If tracking is not available but can be requested perform the ```requestTracking``` method. The user gets now a popup displayed asking him to allow tracking.

### Optional display Informations before asking  ###

If you perform requestTracking you can optiobal add a info object that describes the screen displayed before the popup.
The object should be stringified bevor adding to ```requestTracking```. 

```
private async request(info: TrackingRequestInfo | undefined): Promise<boolean> {
    const sub = new Subject<boolean>();
    window.plugins.impacTracking.requestTracking(JSON.stringify(info), (result) => {
        sub.next(result);
        sub.complete();
    }, (error) => {
        console.log(error);
        sub.next(false);
        sub.complete();
    });
    return sub.toPromise();
}    
```

Note that image can be a base64 image or a name of a SF-Symbol.
```ts
interface TrackingRequestInfo {
    primaryColor: string;
    secondaryColor: string;
    onPrimaryColor: string;
    onSecondaryColor: string;
    title: string;
    text?: string;
    subText: string;
    buttonTitle: string;
    reasons: TrackingRequestReason[];
}

interface TrackingRequestReason {
    text: string;
    image: string;
    tintImage: boolean;
}
```
