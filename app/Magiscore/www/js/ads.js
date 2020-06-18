const ads = {
    initialize() {
        document.addEventListener(
            'deviceready',
            this.onDeviceReady.bind(this),
            false,
        )
    },

    onDeviceReady() {
        this.receivedEvent('deviceready')

        this.checkIsLoaded().then(() => {
            this.showBanner()
            this.loadInter()
        })
    },

    async checkIsLoaded() {
        return await admob.interstitial.isLoaded()
    },

    receivedEvent(id) {
        logConsole(`[INFO]   Received Ad Event: ${id}`);
    },

    showBanner() {
        admob.banner.show({ id: 'ca-app-pub-3425399211312777/4106282964' }).catch(receivedEvent)
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

ads.initialize()