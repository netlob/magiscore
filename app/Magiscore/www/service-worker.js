var cacheName = 'v28';

var cacheFiles = [
    './',
    './index.html',
    './login/index.html',
    './vendor/fontawesome-free/css/all.min.css',
    'https://fonts.googleapis.com/css?family=Nunito:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i',
    './css/sb-admin-2.css',
    './css/main.css',
    './vendor/jquery/jquery.min.js',
    './vendor/bootstrap/js/bootstrap.bundle.min.js',
    './vendor/jquery-easing/jquery.easing.min.js',
    './js/deps/sb-admin-2.js',
    './vendor/chart.js/Chart.min.js',
    './js/deps/algebra.js',
    './js/deps/imagecache.js',
    './js/deps/chartannotation.js',
    './js/deps/jspdf.min.js',
    './js/deps/swipe.min.js',
    './js/Lesson.js',
    './js/ViewController.js',
    './js/LessonController.js',
    './js/main.js',
    './js/login.js',
    './img/icons/icon-128x128.png',
    './manifest.webmanifest'
]

self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Installed');
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
            console.log('[ServiceWorker] Caching cacheFiles');
            return cache.addAll(cacheFiles);
        })
    );
});


self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activated');
    e.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (thisCacheName) {
                if (thisCacheName !== cacheName) {
                    console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }));
        })
    );
});


self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    if (e.request.url == 'https://magiscore.nl/api/grades') {
        console.log('[ServiceWorker] Stopped fetching because of call to API')
        return false;
    }
    e.respondWith(
        caches.match(e.request)
            .then(function (response) {
                if (response) {
                    // refresh("poep")
                    console.log("[ServiceWorker] Found in Cache", e.request.url, response);
                    return response;
                }

                var requestClone = e.request.clone();
                return fetch(requestClone)
                    .then(function (response) {
                        if (!response) {
                            console.log("[ServiceWorker] No response from fetch ")
                            return response;
                        }
                        var responseClone = response.clone();
                        caches.open(cacheName).then(function (cache) {
                            cache.put(e.request, responseClone);
                            console.log('[ServiceWorker] New Data Cached', e.request.url);
                            return response;
                        });
                    })
                    .catch(function (err) {
                        console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
                    });
            })
    );
});

self.addEventListener("push", e => {
    const data = e.data.json();
    console.dir(data)
    self.registration.showNotification('Magiscore geupdate!', {
        body: "Magiscore is klaar om offline te gebruiken!",
        icon: "https://magiscore.nl/img/icons/icon-128x128.png",
        title: 'Magistat'
    });
});

self.addEventListener('message', function (event) {
    console.log("[ServiceWorker] Message from client:", event)
    if (event.data == "updateAvailablePleaseUpdate") {
        caches.delete(cacheName);
        console.log('[ServiceWorker] Deleted cache')
        event.ports[0].postMessage("Deleted cache");
        return;
    }
});

function refresh(response) {
    return self.clients.matchAll().then(function (clients) {
        clients.forEach(function (client) {
            var message = {
                type: 'refresh',
                url: response.url,
                eTag: response.headers.get('ETag')
            };
            client.postMessage(JSON.stringify(message));
        });
    });
}