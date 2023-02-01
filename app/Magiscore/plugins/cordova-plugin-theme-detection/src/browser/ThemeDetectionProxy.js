function isAvailable(success, error, opts) {
    // Check if we can even query for things like theme
    if (typeof window.matchMedia !== "function") {
        success({value: false, message: "Dark mode detection is not available."});
        return false;
    }
    success({value: true, message: "Dark mode detection is available."});
    return true;
}
function isDarkModeEnabled(success, error, opts) {
    var isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    success({value: isDark, message: "Dark mode is" + (isDark ? "" : " not") + " enabled."});
    return isDark;
}

module.exports = {
    isAvailable: isAvailable,
    isDarkModeEnabled: isDarkModeEnabled
};

require('cordova/exec/proxy').add('ThemeDetection', module.exports);
