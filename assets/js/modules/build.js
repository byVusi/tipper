import { STORAGE } from "./storage.js";
import { UTILITIES } from "./utils.js";
import { ELEMENTS } from "./eventHandlers.js";

const CONFIG = await STORAGE.FETCH();

function buildModal(title = "Settings") {
	const modal = createElement("modal");
	const modal_dialog = createElement("modal-dialog");
	const modal_content = createElement("modal-content");
	const modal_header = createElement("modal-header");
	const modal_body = createElement("modal-body");
	// const modal_footer = createElement("modal-footer");

	const modal_title = createElement("modal-title", "h5");
	modal_title.textContent = title;

	const closeButton = createButton("btn-close", "button", "Close");
	closeButton.append(getCloseIcon());

	modal_header.append(modal_title, closeButton);
	modal_body.append(buildModalContent());

	modal_content.append(modal_header, modal_body);
	modal_dialog.append(modal_content);
	modal.append(modal_dialog);

	return modal;
}

function buildSettingsButton() {
	const button = createButton("settings-btn", "button", "Settings");
	button.append(getSettingsIcon());

	return button;
}

function buildModalContent() {
	const fragment = document.createDocumentFragment();

	const generalSection = createElement("settings-section");

	const generalSectionHeader = document.createElement("h6");
	generalSectionHeader.textContent = "General";

	generalSection.append(
		generalSectionHeader,
		buildForm([
			{ title: "Unit: ", id: "unit", type: "select" },
			{ title: "Value: ", id: "value", type: "number" },
		])
	);

	fragment.append(generalSection);

	return fragment;
}

function buildForm(options = []) {
	const form = createElement("settings-form", "form");

	for (const option of options) {
		const { title, id, type } = option;
		form.append(buildInput(title, id, type));
	}

	const div = document.createElement("div");

	const button = createButton("save-btn", "submit", "Save");
	button.textContent = "Save changes";

	div.append(button);
	form.append(div);

	return form;
}

function buildInput(title = "Input title", id = "inputId", type = "text") {
	let storedUnit = CONFIG.settings.general.unit;
	let storedDefault = CONFIG.settings.general.default;

	const div = createElement("settings-form-field");

	const label = document.createElement("label");
	label.setAttribute("for", id);
	label.textContent = title;

	if (type === "select") {
		const select = createElement("settings-form-select", "select");
		select.name = id;
		select.id = id;

		const option1 = document.createElement("option");
		const option2 = document.createElement("option");

		option1.value = "percentage";
		option1.textContent = "Percentage";

		option2.value = "amount";
		option2.textContent = "Amount";

		option1.value === storedUnit
			? option1.setAttribute("selected", true)
			: option1.removeAttribute("selected");

		option2.value === storedUnit
			? option2.setAttribute("selected", true)
			: option2.removeAttribute("selected");

		select.append(option1, option2);

		div.append(label, select);
		return div;
	}

	const input = document.createElement("input");
	input.setAttribute("id", id);
	input.type = type;

	if (type === "number") {
		input.setAttribute("min", "0");
		input.placeholder = storedDefault;
	}

	storedUnit === "percentage"
		? input.setAttribute("max", "100")
		: input.removeAttribute("max");

	div.append(label, input);
	return div;
}

function getCloseIcon() {
	const SVG_NS = "http://www.w3.org/2000/svg";

	// create <svg>
	const svg = document.createElementNS(SVG_NS, "svg");
	svg.setAttribute("width", "24px");
	svg.setAttribute("height", "24px");
	svg.setAttribute("viewBox", "0 0 24 24");
	svg.setAttribute("fill", "none");

	// first <path>
	const path1 = document.createElementNS(SVG_NS, "path");
	path1.setAttribute(
		"d",
		"M2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12Z"
	);

	// second <path>
	const path2 = document.createElementNS(SVG_NS, "path");
	path2.setAttribute("d", "M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5");
	path2.setAttribute("stroke-linecap", "round");

	// assemble
	svg.appendChild(path1);
	svg.appendChild(path2);

	return svg;
}

function getSettingsIcon() {
	const SVG_NS = "http://www.w3.org/2000/svg";

	// <svg>
	const svg = document.createElementNS(SVG_NS, "svg");
	svg.setAttribute("width", "24px");
	svg.setAttribute("height", "24px");
	svg.setAttribute("viewBox", "0 0 24 24");
	svg.setAttribute("fill", "none");

	// <circle>
	const circle = document.createElementNS(SVG_NS, "circle");
	circle.setAttribute("cx", "12");
	circle.setAttribute("cy", "12");
	circle.setAttribute("r", "3");

	// <path>
	const path = document.createElementNS(SVG_NS, "path");
	path.setAttribute(
		"d",
		"M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z"
	);

	// assemble
	svg.appendChild(circle);
	svg.appendChild(path);

	return svg;
}

async function changeTipPreview() {
	const CONFIG = await STORAGE.FETCH();

	if (CONFIG.settings.general.unit === "amount") {
		ELEMENTS.TIP_CONTAINER.classList.add("hide");
		ELEMENTS.TIP_AMOUNT.textContent = UTILITIES.CALCULATE.TIP_AMOUNT.AMOUNT(
			CONFIG.settings.general.default
		);
	} else {
		ELEMENTS.TIP_CONTAINER.classList.remove("hide");
		ELEMENTS.RATE_ELEMENT.textContent = CONFIG.settings.general.default;
	}
}

function createElement(className = "", tagName = "div") {
	const element = document.createElement(tagName);

	if (className?.length) element.classList.add(className);

	return element;
}

function createButton(className = "", type = "button", label = "Button") {
	const button = createElement(className, "button");
	button.type = type;
	button.setAttribute("aria-label", label);

	return button;
}

export const BUILDER = {
	MODAL: buildModal,
	SETTINGS_BUTTON: buildSettingsButton,
	TIP_PREVIEW: changeTipPreview,
};
