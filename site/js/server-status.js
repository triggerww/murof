const SERVER_ADDRESS = "mc.murof.me";
const STATUS_ENDPOINT = `https://api.mcsrvstat.us/3/${SERVER_ADDRESS}`;

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
		const response = await fetch(STATUS_ENDPOINT, {
			cache: "no-store",
		});

		if (!response.ok) {
			throw new Error(`HTTP ${response.status}`);
		}

		const data = await response.json();
		const online = Boolean(data.online);

		statusDot.classList.add(online ? "online" : "offline");
		serverAddress.textContent = SERVER_ADDRESS;
		widget.title = SERVER_ADDRESS;
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
