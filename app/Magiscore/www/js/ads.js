let adChances = { "banner": 100, "inter": 0 }

const ads = {
    initialize() {
        this.receivedEvent('deviceready')

        fetch("https://magiscore-android.firebaseio.com/api/ads.json").then(res => res.json()).then(res => {
            this.receivedEvent(JSON.stringify(res))
            if ("banner" in res && "inter" in res) {
                adChances = res;
            }
        }).finally(e => {
            this.checkIsLoaded().then(() => {
                const showBanner = adChances.banner == 100 ? true : (Math.random() * 100) > (100 - adChances.banner)
                if (showBanner && adChances.banner != 0 && adChances.banner != false) {
                    this.showBanner()
                }

                const showInter = adChances.inter == 100 ? true : (Math.random() * 100) > (100 - adChances.inter)
                if (showInter && adChances.inter != 0 && adChances.inter != false) {
                    this.loadInter()
                }

                this.receivedEvent("done loading ads")
            })
        })
    },

    async checkIsLoaded() {
        return await admob.interstitial.isLoaded()
    },

    receivedEvent(id) {
        logConsole(`[INFO]   Received Ad Event: ${id}`);
    },

    showBanner() {
        var platform = device.platform.toLowerCase();
        if (platform == "ios") {
            admob.banner.show({ id: 'ca-app-pub-3425399211312777~6114349267' }).catch(receivedEvent)
        } else {
            admob.banner.show({ id: 'ca-app-pub-3425399211312777/4106282964' }).catch(receivedEvent)
        }
        // admob.rewardVideo
        //     .load({ id: 'test' })
        //     .then(() => admob.rewardVideo.show())
        //     .catch(console.log)
    },

    loadInter() {
        logConsole(`[INFO]   Received Ad Load Inter`);
        admob.interstitial
            .load({ id: 'ca-app-pub-3425399211312777/6833546322' })
            .then(() => {
                logConsole(`[INFO]   Loaded Ad Inter`);
            })
            .catch(receivedEvent);
    },

    async showInter() {
        logConsole(`[INFO]   Showing Ad Inter`);
        await admob.interstitial.show();
        this.loadInter();
    }
}