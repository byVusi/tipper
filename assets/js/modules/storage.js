const STORAGE_NAME = "tipper-config";
const REPO_NAME = "tipper";
const CONFIG_URL = `/${REPO_NAME}/assets/json/config.json`;

function readLocalStorage() {
	const raw = localStorage.getItem(STORAGE_NAME);
	if (!raw) return null;

	try {
		return JSON.parse(raw);
	} catch {
		return null;
		// Add user ui feedback code below...
	}
}

function writeLocalStorage(data) {
	try {
		localStorage.setItem(STORAGE_NAME, JSON.stringify(data));
	} catch (err) {
		console.warn("Unable to write to localStorage:", err);
		// Add user ui feedback code below...
	}
}

/**
 * Ensures a valid config exists in localStorage.
 * If missing or corrupt, seeds it from bootstrapConfig.
 */
async function getConfig() {
	const bootstrapConfig = await getData();

	if (typeof localStorage === "undefined") {
		return bootstrapConfig;
	}

	const stored = readLocalStorage();

	if (stored) {
		return stored;
	}

	// Seed localStorage once
	writeLocalStorage(bootstrapConfig);
	return bootstrapConfig;
}

async function getData() {
	const url = CONFIG_URL;
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error(error.message);
		// Add user ui feedback code below...
	}
}

export const STORAGE = {
	FETCH: getConfig,
	SAVE: writeLocalStorage,
};
