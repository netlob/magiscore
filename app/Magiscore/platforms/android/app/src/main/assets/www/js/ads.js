let adsInitialized = false;
let adsConfig = {
  banner: {
    chance: 100,
    ids: {
      android: "ca-app-pub-9170931639371270/4381583231",
      ios: "ca-app-pub-9170931639371270/1821786931",
      // android: "ca-app-pub-3940256099942544/6300978111",
      // ios: "ca-app-pub-3940256099942544/2934735716",
    },
  },
  inter: {
    chance: 100,
    ids: {
      android: "ca-app-pub-9170931639371270/9003354522",
      ios: "ca-app-pub-9170931639371270/5064109515",
      // android: "ca-app-pub-3940256099942544/1033173712",
      // ios: "ca-app-pub-3940256099942544/4411468910",
    },
  },
};

let showInterNext = false;

let _interstitial;
let _interstitialLoaded = false;
let _banner;
let _npa;
const adFree = false;

const bannerID = () =>
  window.cordova.platformId === "ios"
    ? adsConfig.banner.ids.ios
    : adsConfig.banner.ids.android;
const interID = () =>
  window.cordova.platformId === "ios"
    ? adsConfig.inter.ids.ios
    : adsConfig.inter.ids.android;

const ads = {
  async initialize() {
    this.receivedEvent(`Initializing... (${adsInitialized})`);
    if (adsInitialized === true) return;
    adsInitialized = true;

    this.receivedEvent("starting admob...");
    await admob.start();
    this.receivedEvent("admob started!");

    let theme = "white";
    try {
      theme = viewController.config.darkTheme ? "black" : "white";
    } catch (e) {
      theme = "white";
    }
    admob.BannerAd.config({ backgroundColor: theme });
    admob.configure({
      testDeviceIds: ["6ea04e8011fad00d37e3a96a44cbc072"],
    });

    const res = await fetch(
      "https://cors.sjoerd.dev/https://sjoerd.dev/html/gemairo/ads.json"
    ).then((res) => res.json());

    this.receivedEvent("res: " + JSON.stringify(res));
    if ("banner" in res && "inter" in res) {
      adsConfig = res;
    }
    this.receivedEvent("config set");

    const showBanner =
      adsConfig.banner.chance == 100
        ? true
        : Math.random() * 100 > 100 - adsConfig.banner.chance;
    this.receivedEvent(`showbanner: ${showBanner.toString()}`);
    if (
      showBanner &&
      adsConfig.banner.chance != 0 &&
      adsConfig.banner.chance != false
    ) {
      await this.loadBanner().catch((e) => {
        this.receivedEvent("kak" + e.message);
        this.receivedEvent("kak" + e);
      });
      await this.showBanner().catch((e) => {
        this.receivedEvent("stront" + e.message);
        this.receivedEvent("stront" + e);
      });
    }
    this.receivedEvent("done loading ads");

    // this.checkInter();
  },

  // async checkIsLoaded() {
  //   return await admob.interstitial.isLoaded();
  // },

  receivedEvent(id) {
    logConsole(`[INFO]   Ad: ${id}`);
  },

  async loadBanner() {
    if (
      _banner != undefined ||
      window.location.hash == "#noNewAds" ||
      document.hidden
    ) {
      // banner already loaded
      return;
    }

    if (adFree == true) return;

    const lastBannerId =
      _banner != undefined && typeof _banner.id == "number"
        ? _banner.id
        : localStorage.getItem("lastBannerId");

    const consentStatus = await this.checkConsent();
    _banner = new admob.BannerAd({
      adUnitId: bannerID(),
      position: "bottom",
      npa: consentStatus === "PERSONALIZED" ? "3" : "0",
      id: lastBannerId ? Number.parseInt(lastBannerId) : null,
    });
    this.receivedEvent("banner made " + JSON.stringify(_banner));
    _banner.on("load", (ex) => {
      this.receivedEvent(`banner loaded ${JSON.stringify(ex, null, 2)}`);
      localStorage.setItem("lastBannerId", ex.adId);
    });

    _banner.on("impression", async (evt) => {
      this.receivedEvent("banner impression");
    });

    this.receivedEvent("calling banner load ");
    await _banner
      .load()
      .then((e) => {
        this.receivedEvent("poep2" + e);
      })
      .catch((e) => {
        this.receivedEvent("poep" + e.message);
        this.receivedEvent("poep" + e);
      });
  },

  async showBanner() {
    if (adFree == true) return;

    if (_banner == undefined) {
      this.receivedEvent("calling banner load before show");
      this.loadBanner();
    }

    this.receivedEvent("calling banner load before show");
    await _banner
      .show()
      .then((e) => {
        this.receivedEvent("poep3: " + e);
      })
      .catch((e) => {
        this.receivedEvent("poep4: " + e.message);
        this.receivedEvent("poep4: " + e);
      });

    // setInterval(async () => {
    //   try {
    //     this.receivedEvent(await this.checkIsLoaded());
    //   } catch (e) {
    //     this.receivedEvent(`e: ${e.toString() + e.message}`);
    //   }
    // }, 1000);
  },

  async hideBanner() {
    if (_banner != undefined) {
      await _banner.hide();
    }
  },

  async checkConsent() {
    try {
      await consent.addTestDevice("6ea04e8011fad00d37e3a96a44cbc072");
      await consent.addTestDevice("311D123F-F79E-426B-87FC-D691AE1AE1F6");
      await consent.addTestDevice("D6394BAE-355C-498A-B88E-731D2D81FFAE");
    } catch (e) {}
    _npa = await consent.checkConsent(["pub-9170931639371270"]);
    return new Promise(async (resolve, reject) => {
      if (_npa === "UNKNOWN" && adFree != true) {
        const form = new consent.Form({
          privacyUrl: "https://policies.google.com/privacy",
          // adFree: true,
          adFree: false,
          nonPersonalizedAds: true,
          personalizedAds: true,
        });
        await form.load();
        const result = await form.show();

        // if (result.userPrefersAdFree) {
        //   purchaseNonConsumable1();
        // }

        _npa = result.consentStatus;
      }

      try {
        if (_npa != "UNKNOWN") {
          window.plugins.impacTracking.trackingAvailable((available) => {
            console.log("Tracvking avaialable: ", available);
            window.plugins.impacTracking.canRequestTracking((canRequest) => {
              if (!canRequest) {
                console.log("Cannot request tracking");
                resolve(_npa);
                return;
              }

              console.log("Request tracking");
              window.plugins.impacTracking.requestTracking(
                undefined,
                () => resolve(_npa),
                () => resolve(_npa)
              );
            });
          });
        }
      } catch (e) {
        resolve(_npa);
        console.error(e);
      }
    });
  },

  checkInter() {
    this.receivedEvent(`showInterNext: ${showInterNext.toString()}`);
    if (showInterNext) {
      // showInterNext = false;
      this.showInter();
    }

    showInterNext =
      adsConfig.inter.chance == 100
        ? true
        : Math.random() * 100 > 100 - adsConfig.inter.chance;
    this.receivedEvent(`showInterNext2: ${showInterNext.toString()}`);
    if (
      showInterNext &&
      adsConfig.inter.chance != 0 &&
      adsConfig.inter.chance != false
    ) {
      this.loadInter();
    }
  },

  async loadInter() {
    this.receivedEvent(`[INFO]   Received Ad Load Inter`);
    // admob.interstitial
    //   .load({
    //     id: adsConfig.inter.ids,
    //   })
    //   // admob.interstitial
    //   //     .load({
    //   //         id: {
    //   //             android: 'test',
    //   //             ios: 'test',
    //   //         }

    //   //     })
    //   .then(() => {
    //     this.receivedEvent(`[INFO]   Loaded Ad Inter`);
    //   })
    //   .catch((e) => this.receivedEvent(e.toString()));

    _interstitial = new admob.InterstitialAd({
      adUnitId: interID(),
      npa: _npa === "PERSONALIZED" ? "3" : "0",
    });

    _interstitial.on("load", (evt) => {
      _interstitialLoaded = true;
      this.receivedEvent(`[INFO]   Loaded Ad Inter`);
    });

    if (!_interstitialLoaded) {
      await _interstitial.load();
    }
  },

  async showInter() {
    this.receivedEvent(`[INFO]   Showing Ad Inter`);
    // if (!(await this.checkIsLoaded())) await this.loadInter();
    // await admob.interstitial.show();
    if (!_interstitialLoaded) {
      await this.loadInter();
    }
    await _interstitial.show();
    _interstitialLoaded = false;
    // this.loadInter();
  },
};
