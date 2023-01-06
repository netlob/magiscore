import * as cordova from 'cordova';
import channel from 'cordova/channel';
import exec from 'cordova/exec';
import { AdMob } from '.';
import { MobileAd, NativeActions } from './shared';
var admob = new AdMob();
function onMessageFromNative(event) {
    var data = event.data;
    if (data && data.adId) {
        data.ad = MobileAd.getAdById(data.adId);
    }
    cordova.fireDocumentEvent(event.type, data);
}
var feature = 'onAdMobPlusReady';
channel.createSticky(feature);
channel.waitForInitialization(feature);
channel.onCordovaReady.subscribe(function () {
    exec(onMessageFromNative, console.error, 'AdMob', NativeActions.ready, []);
    channel.initializationComplete(feature);
});
export default admob;
//# sourceMappingURL=admob.js.map