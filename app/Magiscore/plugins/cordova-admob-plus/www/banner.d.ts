import { AdUnitIDOption, IBannerRequest } from '@admob-plus/core';
import { AdBase, TestIds } from './base';
export default class Banner extends AdBase {
    protected testIdForAndroid: TestIds;
    protected testIdForIOS: TestIds;
    show(opts: IBannerRequest): Promise<unknown>;
    hide(id: AdUnitIDOption): Promise<unknown>;
}
