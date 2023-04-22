// $("#takeoverAd").show();
// $("#takeoverAd-image").attr(
//   "src"
//   "https://cdn.gemairo.app/file/saaf-gemairo/c5021a97-466a-4e65-aa82-a6116eb15aeb.webp"
// );
// $("#takeoverAd-title").text("25% korting");
// $("#takeoverAd-subtitle").text(
//   "Alleen vandaag not 25% als op alle jaarabbonnementen"
// );
// $("#takeoverAd-cta").text("Claim jouw korting");

class Saaf {
  constructor() {
    this.takeoverAd = null;
  }
}

// class SaafTakeoverAd {
//   constructor(
//     request,
//     style,
//     onLoad,
//     onImpression,
//     onClick,
//     onReport,
//     baseUrl,
//     errorWidget
//   ) {
//     this.request = request;
//     this.style = style || new TakeoverAdStyle();
//     this.onLoad = onLoad;
//     this.onImpression = onImpression;
//     this.onClick = onClick;
//     this.onReport = onReport;
//     this.baseUrl = baseUrl || "https://api.stats.fm/api/v1/saaf";
//     this.errorWidget = errorWidget;
//     this.adResponse = null;
//   }

//   get isLoaded() {
//     return this.adResponse instanceof TakeoverAdResponse;
//   }

//   async load() {
//     if (this.onLoad) {
//       this.onLoad(this.request);
//     }
//     console.log(JSON.stringify(this.request.toJson()));
//     const response = await fetch(`${this.baseUrl}/takeovers/query`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(this.request.toJson()),
//     });
//     if (response.status !== 201) {
//       console.log(response.url);
//       console.log(await response.text());
//       throw new Error("failed to load ad");
//     }
//     this.adResponse = TakeoverAdResponse.fromJson(await response.json());
//     return this.adResponse;
//   }

//   async show(context) {
//     if (!this.isLoaded) {
//       throw new Error("Takeover not loaded");
//     }
//     this._impression(this.adResponse);
//     const dialog = document.createElement("div");
//     dialog.style.position = "fixed";
//     dialog.style.top = "0";
//     dialog.style.left = "0";
//     dialog.style.width = "100%";
//     dialog.style.height = "100%";
//     dialog.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
//     const widget = new TakeoverAdWidget({
//       adResponse: this.adResponse,
//       style: this.style,
//       onClick: this._click.bind(this),
//       onReport: this.onReport,
//     });
//     widget.mount(dialog);
//     context.appendChild(dialog);
//   }

//   async _impression(adResponse) {
//     if (!adResponse) {
//       return;
//     }
//     if (this.onImpression) {
//       this.onImpression(adResponse);
//     }
//     const response = await fetch(
//       `${this.baseUrl}/impressions/takeovers/${adResponse.requestId}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           app: "statsfm",
//           platform: navigator.platform,
//         }),
//       }
//     );
//   }

//   async _click(adResponse, context) {
//     if (!adResponse) {
//       return;
//     }
//     if (this.onClick) {
//       this.onClick(adResponse);
//     }
//     if (typeof adResponse.takeover.inAppNavigate !== "string") {
//       window.open(
//         `${this.baseUrl}/clicks/takeovers/${adResponse.requestId}`,
//         "_blank"
//       );
//     } else {
//       const response = await fetch(
//         `${this.baseUrl}/clicks/takeovers/${adResponse.requestId}`
//       );
//     }
//     context.remove();
//   }
// }
