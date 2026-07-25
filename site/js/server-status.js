const SERVER_ADDRESS = "mc.murof.me";
const STATUS_ENDPOINTS = [
	`https://api.mcstatus.io/v2/status/java/${SERVER_ADDRESS}`,
	`https://api.mcsrvstat.us/3/${SERVER_ADDRESS}`,
];

async function fetchServerStatus() {
	let lastError = null;

	for (const endpoint of STATUS_ENDPOINTS) {
		try {
			const response = await fetch(endpoint, {
				cache: "no-store",
			});

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			lastError = error;
			console.warn(`Falha ao consultar ${endpoint}:`, error);
		}
	}

	throw lastError ?? new Error("Nenhum endpoint de status respondeu.");
}

async function checkServerStatus() {
	const statusDot = document.getElementById("serverStatusDot");
	const serverAddress = document.getElementById("serverAddress");
	const widget = document.getElementById("serverStatusWidget");

	if (!statusDot || !serverAddress || !widget) {
		return;
	}

	statusDot.classList.remove("online", "offline");
	serverAddress.textContent = SERVER_ADDRESS;
	widget.title = SERVER_ADDRESS;

	try {
		const data = await fetchServerStatus();
		const online = Boolean(data.online);

		statusDot.classList.add(online ? "online" : "offline");
		serverAddress.textContent = SERVER_ADDRESS;
		widget.title = online ? `${SERVER_ADDRESS} (online)` : `${SERVER_ADDRESS} (offline)`;
	} catch (error) {
		statusDot.classList.add("offline");
		serverAddress.textContent = SERVER_ADDRESS;
		widget.title = SERVER_ADDRESS;
		console.error("Falha ao verificar o status do servidor:", error);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	checkServerStatus();
	window.setInterval(checkServerStatus, 60000);
});
