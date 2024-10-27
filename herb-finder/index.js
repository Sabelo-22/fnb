const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Test request handlers
app.get("/api/test", function (req, res) {
	res.send("Test request sabza");
});

app.post("/ussd", (req, res) => {
	// Read the variables sent via POST from our API
	const { sessionId, serviceCode, phoneNumber, text } = req.body;

	let response = "";

	if (text == "") {
		// Initial menu options
		response = `CON Welcome to the Herb Finder App IMBEWU.
	Access Natural Remedies based on symptoms, Location, and season:
	1. Get Started
	2. About This App
	3. Exit`;
	} else if (text == "1") {
		// User selects to find herbs for ailments
		response = `CON Select your primary symptom:
	1. Headache
	2. Fever
	3. Stomachache
	4. Cough
	5. Other (type in)
	0. Back`;
	} else if (text == "2") {
		// About the app
		response = `CON This app offers herb recommendations for common ailments.
	Our suggestions are based on traditional South African herbal medicine, customized to your needs.
	Press any key to continue.
	0. Back`;
	} else if (text == "3") {
		// Exit the app
		response = `END Thank you for using IMBEWU! Goodbye!`;
	} else if (text == "1*0" || text == "2*0") {
		// User selects "Back" from a submenu
		response = `CON Welcome to the Herb Finder App IMBEWU.
	Access Natural Remedies based on symptoms, Location, and season:
	1. Get Started
	2. About This App
	3. Exit`;
	} else if (text.startsWith("1*1")) {
		// Headache selected
		response = `CON Recommended Herb for Headache:
	Ginger - Anti-inflammatory, soothing tea.
	0. Back`;
	} else if (text.startsWith("1*2")) {
		// Fever selected
		response = `CON Recommended Herb for Fever:
	Baobab - High in vitamin C, promotes immune health.
	0. Back`;
	} else if (text.startsWith("1*3")) {
		// Stomachache selected
		response = `CON Recommended Herb for Stomachache:
	Peppermint - Calms digestive issues, brewed as tea.
	0. Back`;
	} else if (text.startsWith("1*4")) {
		// Cough selected
		response = `CON Recommended Herb for Cough:
	Honeybush - Relieves cough symptoms, brewed as tea.
	0. Back`;
	} else if (text.startsWith("1*5")) {
		// Other symptom
		response = `CON Please type in your specific symptom (e.g., nausea).
	0. Back`;
	} else if (text.startsWith("1*5*")) {
		// Custom symptom entered by the user
		const customSymptom = text.split("*").slice(2).join(" ");
		// Placeholder logic for handling a custom symptom
		response = `CON We recommend exploring general herbal teas for symptoms like "${customSymptom}".
	0. Back`;
	} else if (
		text == "1*1*0" ||
		text == "1*2*0" ||
		text == "1*3*0" ||
		text == "1*4*0" ||
		text == "1*5*0"
	) {
		// User selects "Back" from herb detail view
		response = `CON Select your primary symptom:
	1. Headache
	2. Fever
	3. Stomachache
	4. Cough
	5. Other (type in)
	0. Back`;
	} else {
		// Handle unrecognized input
		response = `END Invalid selection. Please try again.`;
	}

	// Send the response back to the API
	res.set("Content-Type", "text/plain"); // Corrected header
	res.send(response);
});

// PORT
const PORT = process.env.PORT || 3000;

// APP Listen
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
