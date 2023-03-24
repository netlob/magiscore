

function ImpacTracking() {}

ImpacTracking.prototype.canRequestTracking = function(successCallback) {
    cordova.exec(successCallback, null, 'ImpacTracking', 'canRequestTracking', []);
}

ImpacTracking.prototype.trackingAvailable = function(successCallback) {
    cordova.exec(successCallback, null, 'ImpacTracking', 'trackingAvailable', []);
}

ImpacTracking.prototype.requestTracking = function(info, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, 'ImpacTracking', 'requestTracking', [info]);
}

ImpacTracking.install = function() {
    if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.impacTracking = new ImpacTracking();
    return window.plugins.impacTracking;
}
cordova.addConstructor(ImpacTracking.install);
