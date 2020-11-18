document.addEventListener('deviceready', initStore);
document.addEventListener('deviceready', refreshLockedUI);

let purchasing = false;
let adFree = undefined;

function initStore() {

    if (!window.store) {
        console.log('Store not available');
        return;
    }

    store.verbosity = store.INFO;
    store.register({
        id: '1',
        type: store.NON_CONSUMABLE
    });

    store.error(function (error) {
        console.log('ERROR ' + error.code + ': ' + error.message);
        purchasing = false;
        viewController.overlay("hide");
    });

    store.when('1').updated(refreshProductUI);
    store.when('1').approved(function (p) {
        purchasing = false;
        viewController.overlay("hide");
        p.verify();
    });
    store.when('1').verified(finishPurchase);

    store.refresh();
}

function refreshLockedUI() {
    console.log("refreshLockedUI")
}

function refreshProductUI(product) {
    console.log("refreshProductUI", product)

    $("#herstel-aankopen").show();
    $("#verwijder-ads").show();

    ads.initialize(product.owned);

    adFree = product.owned;

    if (product.owned) {
        $("#herstel-aankopen").show();
        $("#verwijder-ads").hide();

        // if (bannerShown) {
        ads.hideBanner();
        // }
    }

    logConsole(JSON.stringify(product))
}

function purchaseNonConsumable1() {
    if (purchasing) return;
    purchasing = true;
    viewController.overlay("show");
    store.order('1');
}

function restorePurchases1() {
    viewController.overlay("show");
    store.refresh();
    viewController.overlay("hide");
}

function finishPurchase(p) {
    console.log("finishPurchase", p)
    p.finish();
    refreshLockedUI();
}