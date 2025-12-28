if ("serviceWorker" in navigator) {
	navigator.serviceWorker
		.register("/sw.js")
		.then(() => console.log("✅ Service Worker registered"))
		.catch((err) => console.error("❌ Service Worker failed:", err));
}

import { EVENT_HANDLER } from "./modules/eventHandlers.js";
import { BUILDER } from "./modules/build.js";

const NUMBER_PAD_ELEMENT = document.querySelector(".numpad");
const COUNTER_ELEMENT = document.querySelector(".counter");
const SETTINGS_ELEMENT = document.querySelector("nav button");

BUILDER.TIP_PREVIEW(); // Decides whether the tip rate should be shown or not

NUMBER_PAD_ELEMENT.addEventListener("click", (e) =>
	EVENT_HANDLER.CLICK.NUMPAD(e)
);

COUNTER_ELEMENT.addEventListener("click", (e) =>
	EVENT_HANDLER.CLICK.COUNTER(e)
);

SETTINGS_ELEMENT.addEventListener("click", (e) => {
	EVENT_HANDLER.CLICK.SETTINGS(e);
});
