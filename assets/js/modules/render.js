import { BUILDER } from "./build.js";
import { EVENT_HANDLER } from "./eventHandlers.js";

function renderModal() {
	document.body.append(BUILDER.MODAL());
	const MODAL = document.querySelector(".modal");

	if (!MODAL) return;

	MODAL.removeEventListener("click", EVENT_HANDLER.CLICK.MODAL.CLOSE);
	MODAL.addEventListener("click", (e) => {
		EVENT_HANDLER.CLICK.MODAL.CLOSE(e);
	});

	MODAL.removeEventListener("click", EVENT_HANDLER.CLICK.MODAL.SAVE);
	MODAL.addEventListener("click", async (e) => {
		EVENT_HANDLER.CLICK.MODAL.SAVE(e);
	});
}

function renderSettingsButton() {
	document.querySelector("nav")?.append(BUILDER.SETTINGS_BUTTON());
	const SETTINGS_ELEMENT = document.querySelector("nav button");

	if (!SETTINGS_ELEMENT) return;

	SETTINGS_ELEMENT.removeEventListener("click", EVENT_HANDLER.CLICK.SETTINGS);
	SETTINGS_ELEMENT.addEventListener("click", (e) => {
		EVENT_HANDLER.CLICK.SETTINGS(e);
	});
}

export const RENDERER = {
	MODAL: renderModal,
	SETTINGS_BUTTON: renderSettingsButton,
};
