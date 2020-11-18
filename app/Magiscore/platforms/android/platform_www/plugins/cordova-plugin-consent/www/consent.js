cordova.define("cordova-plugin-consent.Consent", function(require, exports, module) {
'use strict';

var cordova = require('cordova');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var state = {
    nextFormId: 0,
    forms: new Map(),
};
var execAsync = function (action, args) {
    return new Promise(function (resolve, reject) {
        cordova.exec(resolve, reject, 'Consent', action, args);
    });
};
var waitEvent = function (successEvent, failEvent) {
    if (failEvent === void 0) { failEvent = ''; }
    return new Promise(function (resolve, reject) {
        document.addEventListener(successEvent, function (event) {
            resolve(event);
        }, false);
        if (failEvent) {
            document.addEventListener(failEvent, function (failedEvent) {
                reject(failedEvent);
            }, false);
        }
    });
};
var ConsentForm = /** @class */ (function () {
    function ConsentForm(opts) {
        this.id = state.nextFormId;
        state.forms.set(this.id, this);
        state.nextFormId += 1;
        this.opts = opts;
    }
    ConsentForm.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execAsync('loadConsentForm', [
                            {
                                id: this.id,
                                privacyUrl: this.opts.privacyUrl,
                                adFree: this.opts.adFree,
                                nonPersonalizedAds: this.opts.nonPersonalizedAds,
                                personalizedAds: this.opts.personalizedAds,
                            },
                        ])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, waitEvent('consent.form.loaded', 'consent.form.error')];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ConsentForm.prototype.show = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execAsync('showConsentForm', [{ id: this.id }])];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, waitEvent('consent.form.closed', 'consent.form.error')];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return ConsentForm;
}());
document.addEventListener('deviceready', function () {
    cordova.exec(function (event) {
        cordova.fireDocumentEvent(event.type, event.data);
    }, function (err) {
        console.log(err);
    }, 'Consent', 'ready');
}, false);
var consent = {
    Form: ConsentForm,
    checkConsent: function (publisherIds) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, execAsync('checkConsent', [publisherIds])];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    },
    isRequestLocationInEeaOrUnknown: function () {
        return execAsync('isRequestLocationInEeaOrUnknown');
    },
    addTestDevice: function (deviceId) {
        return execAsync('addTestDevice', [deviceId]);
    },
    setDebugGeography: function (geography) {
        return execAsync('setDebugGeography', [geography]);
    },
};

module.exports = consent;

});
