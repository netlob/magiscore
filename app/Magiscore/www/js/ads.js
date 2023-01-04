let initialized = false;
let bannerShown = false;
let adsConfig = {
  banner: {
    chance: 100,
    ids: {
      android: "ca-app-pub-9170931639371270/4381583231",
      ios: "ca-app-pub-9170931639371270/1821786931",
    },
  },
  inter: {
    chance: 0,
    ids: {
      android: "ca-app-pub-9170931639371270/9003354522",
      ios: "ca-app-pub-9170931639371270/5064109515",
    },
  },
};



const ads = {
  initialize(hasAdFree) {
    if (initialized === true) return;
    initialized = true;
    this.receivedEvent("deviceready");

    adFree = true;
    if (hasAdFree) return;

    fetch("https://sjoerd.dev/html/gemairo/ads.json")
      .then((res) => res.json())
      .then((res) => {
        this.receivedEvent(JSON.stringify(res));
        if ("banner" in res && "inter" in res) {
          adsConfig = res;
        }
      })
      .finally((e) => {
        const showBanner =
          adsConfig.banner.chance == 100
            ? true
            : Math.random() * 100 > 100 - adsConfig.banner.chance;
        if (
          showBanner &&
          adsConfig.banner.chance != 0 &&
          adsConfig.banner.chance != false
        ) {
          this.showBanner();
        }
        const showInter =
          adsConfig.inter.chance == 100
            ? true
            : Math.random() * 100 > 100 - adsConfig.inter.chance;
        if (
          showInter &&
          adsConfig.inter.chance != 0 &&
          adsConfig.inter.chance != false
        ) {
          this.loadInter();
        }
        this.receivedEvent("done loading ads");
      });
  },

  async checkIsLoaded() {
    return await admob.interstitial.isLoaded();
  },

  receivedEvent(id) {
    logConsole(`[INFO]   Received Ad Event: ${id}`);
  },

  showBanner() {
    // admob.banner.show({
    //         id: {
    //             android: "ca-app-pub-3425399211312777/4106282964",
    //             ios: "ca-app-pub-3425399211312777/4609695903"
    //         },
    //         position: "bottom",
    //     })
    //     .catch(e => this.receivedEvent(e.toString()));
    // admob.banner.show({ id: "test" }).catch(receivedEvent).catch(e => this.receivedEvent(e.toString()));

    // const testDeviceId = '942c011c037db3ec6f3ac1b9779be499'
    console.log("show consent form");
    this.checkConsent()
      .then(async (consentStatus) => {
        console.log("consentStatus", consentStatus);
        if (consentStatus === "PERSONALIZED" && adFree != true) {
          admob.banner
            .show({
              id: adsConfig.banner.ids,
              // testDevices: [testDeviceId],
              position: "bottom",
            })
            .catch((e) => this.receivedEvent(e.toString()));
          bannerShown = true;
        } else if (adFree != true) {
          admob.banner
            .show({
              id: adsConfig.banner.ids,
              // testDevices: [testDeviceId],
              npa: "1",
              position: "bottom",
            })
            .catch((e) => this.receivedEvent(e.toString()));
        }
      })
      .catch(console.error);
  },

  hideBanner() {
    const bannerID =
      window.cordova.platformId === "ios" ? banners.ios : banners.android;
    admob.banner.hide(bannerID).catch((e) => this.receivedEvent(e.toString()));
  },

  async checkConsent(testDeviceId) {
    const publisherIds = ["pub-9170931639371270"];

    // await consent.addTestDevice(testDeviceId)
    // await consent.setDebugGeography('NL');
    const npa = await consent.checkConsent(publisherIds);
    console.log("consent: ", npa);

    // const ok = await consent.isRequestLocationInEeaOrUnknown()
    // if (!ok) {
    //     alert('please update testDeviceId from logcat')
    // }

    if (npa === "UNKNOWN" && adFree === false) {
      const form = new consent.Form({
        privacyUrl: "https://policies.google.com/privacy",
        adFree: true,
        nonPersonalizedAds: true,
        personalizedAds: true,
      });
      await form.load();
      const result = await form.show();

      if (result.userPrefersAdFree) {
        purchaseNonConsumable1();
      }

      return result.consentStatus;
    } else {
      return npa;
    }
  },

  loadInter() {
    logConsole(`[INFO]   Received Ad Load Inter`);
    admob.interstitial
      .load({
        id: adsConfig.inter.ids,
      })
      // admob.interstitial
      //     .load({
      //         id: {
      //             android: 'test',
      //             ios: 'test',
      //         }

      //     })
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
  },
};
