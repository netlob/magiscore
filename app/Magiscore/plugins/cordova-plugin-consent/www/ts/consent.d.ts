/// <reference path="../../../index.d.ts" />
declare type ConsentStatus = 'PERSONALIZED' | 'NON_PERSONALIZED' | 'UNKNOWN';
interface ConsentFormOptions {
    privacyUrl: string;
    adFree?: boolean;
    nonPersonalizedAds?: boolean;
    personalizedAds?: boolean;
}
declare class ConsentForm {
    private id;
    private opts;
    constructor(opts: ConsentFormOptions);
    load(): Promise<void>;
    show(): Promise<{
        consentStatus: ConsentStatus;
        userPrefersAdFree: boolean;
    }>;
}
declare const _default: {
    Form: typeof ConsentForm;
    checkConsent(publisherIds: string[]): Promise<ConsentStatus>;
    isRequestLocationInEeaOrUnknown(): Promise<unknown>;
    addTestDevice(deviceId: string): Promise<unknown>;
    setDebugGeography(geography: 'EEA' | 'NOT_EEA'): Promise<unknown>;
};
export default _default;
