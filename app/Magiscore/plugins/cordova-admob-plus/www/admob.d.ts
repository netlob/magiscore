import { IBannerRequest } from '@admob-plus/core';
import Banner from './banner';
import Interstitial from './interstitial';
import RewardVideo from './reward-video';
declare type MobileAdOptions = {
    adUnitId: string;
};
declare class MobileAd {
    private static allAds;
    private _id;
    adUnitId: string;
    constructor({ adUnitId }: MobileAdOptions);
    get id(): number;
}
declare class BannerAd extends MobileAd {
    constructor({ adUnitId }: MobileAdOptions);
    show(opts: IBannerRequest): Promise<unknown>;
    hide(): Promise<unknown>;
}
declare class AdMob {
    banner: Banner;
    interstitial: Interstitial;
    rewardVideo: RewardVideo;
    private state;
    constructor();
    get BannerAd(): typeof BannerAd;
    setAppMuted(value: boolean): Promise<unknown>;
    setAppVolume(value: number): Promise<unknown>;
    setDevMode(value: boolean): void;
    private ready;
}
declare const admob: AdMob;
export default admob;
