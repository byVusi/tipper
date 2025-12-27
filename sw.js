/**
 * @fileoverview Basic service worker script for offline support.
 * Caches specified assets during installation, removes old caches on activation,
 * and serves cached assets when offline.
 */
const REPO_NAME = "tipper";
export const BASE_PATH = `/${REPO_NAME}`;
const CACHE_NAME = `${REPO_NAME}-cache-v1`;

/**
 * List of static assets to cache during the install event.
 * @constant {string[]}
 */
const FILES_TO_CACHE = [
	`${BASE_PATH}/index.html`,
	`${BASE_PATH}/assets/css/main.css`,
	`${BASE_PATH}/assets/css/components/form.css`,
	`${BASE_PATH}/assets/css/components/modal.css`,
	`${BASE_PATH}/assets/js/main.js`,
	`${BASE_PATH}/assets/js/modules/build.js`,
	`${BASE_PATH}/assets/js/modules/eventHandlers.js`,
	`${BASE_PATH}/assets/js/modules/render.js`,
	`${BASE_PATH}/assets/js/modules/storage.js`,
	`${BASE_PATH}/assets/js/modules/utils.js`,
	`${BASE_PATH}/assets/json/config.json`,
];

/**
 * Install event handler.
 * Caches all files listed in FILES_TO_CACHE.
 *
 * @param {ExtendableEvent} event - The install event.
 */
self.addEventListener("install", function (event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then(function (cache) {
			return Promise.all(
				FILES_TO_CACHE.map(function (file) {
					return fetch(file).then(function (response) {
						if (!response.ok) {
							throw new Error(
								"Request failed for: " +
									file +
									" (" +
									response.status +
									")"
							);
						}
						return cache.put(file, response.clone());
					});
				})
			);
		})
	);
	self.skipWaiting();
});

/**
 * Activate event handler.
 * Removes old caches that don’t match the current CACHE_NAME.
 *
 * @param {ExtendableEvent} event - The activate event.
 */
self.addEventListener("activate", function (event) {
	event.waitUntil(
		caches.keys().then(function (keys) {
			return Promise.all(
				keys
					.filter((key) => key !== CACHE_NAME)
					.map((key) => caches.delete(key))
			);
		})
	);
	self.clients.claim(); // Takes control of uncontrolled clients as soon as it activates.
});

/**
 * Fetch event handler.
 * Responds with cached resources when available, otherwise fetches from the network.
 *
 * @param {FetchEvent} event - The fetch event.
 */
self.addEventListener("fetch", function (event) {
	event.respondWith(
		caches.match(event.request).then(function (response) {
			return response || fetch(event.request);
		})
	);
});
