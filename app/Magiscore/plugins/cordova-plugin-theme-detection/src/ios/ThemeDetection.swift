/*
 Cordova Plugin to detect whether the dark mode is enabled or not
 */

@objc(ThemeDetection) class ThemeDetection : CDVPlugin {
    
    // Only iOS Devices running iOS 13 and newer can use the dark mode,
    // so check if it is available on the users system
    @objc(isAvailable:)
    func isAvailable(command: CDVInvokedUrlCommand) {
        var available: Bool = false;
        let systemVersion = UIDevice.current.systemVersion;
        
        if #available(iOS 13.0, *) {
            available = true;
        }
        
        var responseMessage = "Dark mode detection is not available. You need at least iOS 13, but you have installed iOS " + systemVersion;
        if(available) {
            responseMessage = "Dark mode detection is available";
        }
        
        let obj = createReturnObject(value: available, message: responseMessage);
        returnCordovaPluginResult(status: CDVCommandStatus_OK, obj: obj, command: command);
    }
    
    // returns an object with a boolean value if the dark mode is enabled and a message
    @objc(isDarkModeEnabled:)
    func isDarkModeEnabled(command: CDVInvokedUrlCommand) {
        var enabled: Bool = false;
        if #available(iOS 12.0, *) {
            enabled = self.viewController.traitCollection.userInterfaceStyle == .dark;
        }
        
        var responseMessage = "Dark mode is not enabled";
        if(enabled) {
            responseMessage = "Dark mode is enabled";
        }
        
        let obj = createReturnObject(value: enabled, message: responseMessage);
        returnCordovaPluginResult(status: CDVCommandStatus_OK, obj: obj, command: command);
    }
    
    private func createReturnObject(value: Bool, message: String) -> [AnyHashable : Any] {
        let logResult: [AnyHashable : Any] = ["value" : value, "message": message];
        return logResult;
    }
    
    private func returnCordovaPluginResult(status: CDVCommandStatus, obj: [AnyHashable : Any], command: CDVInvokedUrlCommand) {
        let pluginResult = CDVPluginResult(status: status, messageAs: obj);
        self.commandDelegate!.send(pluginResult, callbackId: command.callbackId);
    }
}
