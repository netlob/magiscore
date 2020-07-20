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
    },

    async checkIsLoaded() {
        return await admob.interstitial.isLoaded()
    },

    receivedEvent(id) {
        logConsole(`[INFO]   Received Ad Event: ${id}`);
    },

    showBanner() {
        // admob.banner.show({ id: { android: "ca-app-pub-3425399211312777/4106282964", ios: "ca-app-pub-3425399211312777/4609695903" } }).catch(e => this.receivedEvent(e.toString()));
        admob.banner.show({
            id: {
                android: "ca-app-pub-3940256099942544/6300978111", ios: "ca-app-pub-3940256099942544/2934735716"
            },
            position: "bottom"
        }).catch(e => this.receivedEvent(e.toString()));
        // admob.banner.show({ id: "test" }).catch(receivedEvent).catch(e => this.receivedEvent(e.toString()));
    },

    loadInter() {
        logConsole(`[INFO]   Received Ad Load Inter`);
        // admob.interstitial.load({
        //     id: {
        //         android: 'ca-app-pub-3425399211312777/6833546322',
        //         ios: 'ca-app-pub-3425399211312777/7035165802',
        //     },
        // })
        admob.interstitial
            .load({
                id: {
                    android: 'test',
                    ios: 'test',
                }
            })
            .then(() => {
                logConsole(`[INFO]   Loaded Ad Inter`);
            })
            .catch(receivedEvent);
    },

    async showInter() {
        logConsole(`[INFO]   Showing Ad Inter`);
        if (!(await this.checkIsLoaded())) await this.loadInter();
        await admob.interstitial.show();
        this.loadInter();
    }
}