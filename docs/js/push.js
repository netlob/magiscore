const publicVapidKey = "BC79U18J9Pn9ddyl7Vme5nYZC3blOTTlZS3qWj2QyMbtgZiMpOwe2tEWJstSsUaoHXbNQRiJ5Wi8cX2D4upxZP4";

async function send() {
  const subscription = await navigator.serviceWorker.controller.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://magiscore.nl/api/push",
    "method": "GET",
    "headers": {
      "subscription": subscription
    }
  }

  $.ajax(settings).done(function (response) {
    console.log(response)
  })
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}