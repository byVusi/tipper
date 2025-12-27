import { UTILITIES } from "./utils.js";
import { RENDERER } from "./render.js";
import { STORAGE } from "./storage.js";
import { BUILDER } from "./build.js";

const TOTAL_ELEMENT = document.querySelector(".total");
const RATE_ELEMENT = document.querySelector(".rate");
const MINUS_BUTTON = document.querySelector(".counter button:first-of-type");
const PLUS_BUTTON = document.querySelector(".counter button:last-of-type");
const SPLIT_ELEMENT = document.querySelector(".counter p");
const SPLIT_TOTAL_ELEMENT = document.querySelector(".split_total");
const TIP_AMOUNT_ELEMENT = document.querySelector(".tip");
const FINAL_TOTAL_ELEMENT = document.querySelector(".final");
const TIP_CONTAINER = document.querySelector(".tip-container");

const CONFIG = await STORAGE.FETCH();

function numpadClickHandler(e) {
	const clickedButton = e.target.closest("button");
	if (!clickedButton) return;

	const htmlCollection = clickedButton.children;
	const buttonType = htmlCollection.length === 0 ? "normal" : "backspace";

	handleClickedButtonType(clickedButton, buttonType);
	handleInsertingCalculationResults();
}

function counterClickHandler(e) {
	const clickedButton = e.target.closest("button");
	if (!clickedButton) return;

	if (clickedButton === PLUS_BUTTON) {
		SPLIT_ELEMENT.textContent = Number(SPLIT_ELEMENT.textContent) + 1;
	}

	if (clickedButton === MINUS_BUTTON && SPLIT_ELEMENT.textContent !== "1") {
		SPLIT_ELEMENT.textContent = Number(SPLIT_ELEMENT.textContent) - 1;
	}

	if (!TIP_CONTAINER.classList.contains("hide")) {
		SPLIT_TOTAL_ELEMENT.textContent = UTILITIES.CALCULATE.SPLIT_TOTAL.RATE(
			TOTAL_ELEMENT.textContent,
			RATE_ELEMENT.textContent,
			SPLIT_ELEMENT.textContent
		);
	} else {
		SPLIT_TOTAL_ELEMENT.textContent =
			UTILITIES.CALCULATE.SPLIT_TOTAL.AMOUNT(
				TOTAL_ELEMENT.textContent,
				TIP_AMOUNT_ELEMENT.textContent,
				SPLIT_ELEMENT.textContent
			);
	}
}

function settingsClickHandler(e) {
	const clickedButton = e.target.closest("nav button");
	if (!clickedButton) return;

	RENDERER.MODAL();
}

function closeButtonClickHandler(e) {
	const clickedButton = e.target.closest(".modal-header .btn-close");
	if (!clickedButton) return;

	document.querySelector(".modal")?.remove();
}

function saveButtonClickHandler(e) {
	e.preventDefault();
	const clickedButton = e.target.closest(".modal .save-btn");
	if (!clickedButton) return;

	const SELECT_ELEMENT = document.querySelector("select");
	const VALUE_INPUT_ELEMENT = document.querySelector("input");

	const unit = SELECT_ELEMENT.value;
	let value = VALUE_INPUT_ELEMENT.value;

	CONFIG.settings.general.unit = unit;
	if (value.trim() !== "") CONFIG.settings.general.default = value;

	STORAGE.SAVE(CONFIG);

	if (unit === "percentage") {
		TIP_CONTAINER.classList.remove("hide");
		value = value?.trim() !== "" ? value : CONFIG.settings.general.default;
		document.querySelector(".rate").textContent = value;
	} else {
		TIP_CONTAINER.classList.add("hide");
		document.querySelector(".tip").textContent = value;
	}

	document.querySelector(".modal")?.remove();
	handleInsertingCalculationResultsDuringSession(CONFIG);
}

/**
 * HELPER FUNCTIONS
 */
function handleClickedButtonType(clickedButton, buttonType) {
	const TOTAL = TOTAL_ELEMENT.textContent;
	let number;
	if (buttonType === "normal") {
		number = clickedButton.textContent;

		if (TOTAL === "0") {
			TOTAL_ELEMENT.textContent = number === "." ? "0" : number;
		} else {
			TOTAL_ELEMENT.textContent += !TOTAL.includes(".")
				? number
				: number === "."
				? ""
				: TOTAL.length - TOTAL.indexOf(".") !== 3 //  no more then two decimal places
				? number
				: "";
		}
	}

	if (!number || buttonType === "backspace") {
		let numArray = TOTAL.split("");
		numArray.splice(-1);
		TOTAL_ELEMENT.textContent = numArray.join("");

		if (TOTAL_ELEMENT.textContent === "") {
			TOTAL_ELEMENT.textContent = "0";
		}
	}
}

function handleInsertingCalculationResults() {
	if (!TIP_CONTAINER.classList.contains("hide")) {
		TIP_AMOUNT_ELEMENT.textContent = UTILITIES.CALCULATE.TIP_AMOUNT.RATE(
			TOTAL_ELEMENT.textContent,
			RATE_ELEMENT.textContent
		);

		SPLIT_TOTAL_ELEMENT.textContent = UTILITIES.CALCULATE.SPLIT_TOTAL.RATE(
			TOTAL_ELEMENT.textContent,
			RATE_ELEMENT.textContent,
			SPLIT_ELEMENT.textContent
		);
	} else {
		TIP_AMOUNT_ELEMENT.textContent = UTILITIES.CALCULATE.TIP_AMOUNT.AMOUNT(
			CONFIG.settings.general.default
		);

		SPLIT_TOTAL_ELEMENT.textContent =
			UTILITIES.CALCULATE.SPLIT_TOTAL.AMOUNT(
				TOTAL_ELEMENT.textContent,
				TIP_AMOUNT_ELEMENT.textContent,
				SPLIT_ELEMENT.textContent
			);
	}

	FINAL_TOTAL_ELEMENT.textContent = UTILITIES.CALCULATE.FINAL_TOTAL(
		TOTAL_ELEMENT.textContent,
		TIP_AMOUNT_ELEMENT.textContent
	);
}

function handleInsertingCalculationResultsDuringSession(CONFIG) {
	const TIP_CONTAINER = document.querySelector(".tip-container");
	const TIP_AMOUNT_ELEMENT = document.querySelector(".tip");
	const TOTAL_ELEMENT = document.querySelector(".total");
	const RATE_ELEMENT = document.querySelector(".rate");
	const SPLIT_TOTAL_ELEMENT = document.querySelector(".split_total");
	const SPLIT_ELEMENT = document.querySelector(".counter p");
	const FINAL_TOTAL_ELEMENT = document.querySelector(".final");

	if (!TIP_CONTAINER.classList.contains("hide")) {
		TIP_AMOUNT_ELEMENT.textContent = UTILITIES.CALCULATE.TIP_AMOUNT.RATE(
			TOTAL_ELEMENT.textContent,
			RATE_ELEMENT.textContent
		);

		SPLIT_TOTAL_ELEMENT.textContent = UTILITIES.CALCULATE.SPLIT_TOTAL.RATE(
			TOTAL_ELEMENT.textContent,
			RATE_ELEMENT.textContent,
			SPLIT_ELEMENT.textContent
		);
	} else {
		TIP_AMOUNT_ELEMENT.textContent = UTILITIES.CALCULATE.TIP_AMOUNT.AMOUNT(
			CONFIG.settings.general.default
		);

		SPLIT_TOTAL_ELEMENT.textContent =
			UTILITIES.CALCULATE.SPLIT_TOTAL.AMOUNT(
				TOTAL_ELEMENT.textContent,
				TIP_AMOUNT_ELEMENT.textContent,
				SPLIT_ELEMENT.textContent
			);
	}

	FINAL_TOTAL_ELEMENT.textContent = UTILITIES.CALCULATE.FINAL_TOTAL(
		TOTAL_ELEMENT.textContent,
		TIP_AMOUNT_ELEMENT.textContent
	);
}

/**
 * EXPORT FUNCTIONS AS OBJECTS
 */
export const EVENT_HANDLER = {
	CLICK: {
		NUMPAD: numpadClickHandler,
		COUNTER: counterClickHandler,
		SETTINGS: settingsClickHandler,
		INSERT: handleInsertingCalculationResults,
		MODAL: {
			CLOSE: closeButtonClickHandler,
			SAVE: saveButtonClickHandler,
		},
	},
};

export const ELEMENTS = {
	TIP_CONTAINER,
	TIP_AMOUNT: TIP_AMOUNT_ELEMENT,
	RATE_ELEMENT,
};
