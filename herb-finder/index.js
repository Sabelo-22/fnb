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
		// This is the first request. Start the response with CON
		response = `CON Welcome to the Herb Finder App.
    Please select an option:
    1. Find herbs for ailments
    2. View seasonal herbs
    3. Exit`;
	} else if (text == "1") {
		// User selects to find herbs for ailments
		response = `CON Please enter your symptoms separated by commas (e.g., headache, cough).`;
	} else if (text == "2") {
		// User selects to view seasonal herbs
		response = `CON Please select a season:
    1. Summer
    2. Autumn
    3. Winter
    4. Spring`;
	} else if (text == "3") {
		// User selects to exit
		response = `END Thank you for using Herb Finder! Goodbye!`;
	} else if (text.startsWith("1*")) {
		// This is a second-level response where the user has entered symptoms
		const symptoms = text.split("*").slice(1).join(", ");
		// Logic to get herb recommendations based on symptoms
		const recommendedHerbs = "1. Ginger\n2. Aloe Vera\n3. Peppermint"; // Placeholder for actual recommendations
		response = `CON Based on your symptoms (${symptoms}), we recommend the following herbs:
    ${recommendedHerbs}\nReply with the number for more details.`;
	} else if (text.startsWith("2*")) {
		// User selected a season to view herbs
		const season = text.split("*")[1];
		// Logic to get seasonal herb recommendations
		const seasonalHerbs = "1. Rooibos\n2. Marula\n3. Baobab"; // Placeholder for actual seasonal herbs
		response = `CON For ${season}, we recommend the following herbs:
    ${seasonalHerbs}\nReply with the number for more details.`;
	} else if (text.startsWith("1*1")) {
		// User selects a specific herb for details
		const herbDetails =
			"Ginger (Zingiber officinale): Traditional Use: Anti-inflammatory. Preparation: Fresh tea.";
		response = `END ${herbDetails}`;
	} else if (text.startsWith("1*2")) {
		// User selects the second herb for details
		const herbDetails =
			"Aloe Vera (Aloe barbadensis): Traditional Use: Healing. Preparation: Gel or juice.";
		response = `END ${herbDetails}`;
	} else if (text.startsWith("1*3")) {
		// User selects the third herb for details
		const herbDetails =
			"Peppermint (Mentha piperita): Traditional Use: Calming. Preparation: Brewed tea.";
		response = `END ${herbDetails}`;
	} else if (text.startsWith("2*1")) {
		// User selects a specific seasonal herb for details
		const seasonalHerbDetails =
			"Rooibos (Aspalathus linearis): Traditional Use: Antioxidant. Preparation: Brewed as tea.";
		response = `END ${seasonalHerbDetails}`;
	} else if (text.startsWith("2*2")) {
		// User selects the second seasonal herb for details
		const seasonalHerbDetails =
			"Marula (Sclerocarya birrea): Traditional Use: Nutritional support. Preparation: Eaten raw or as juice.";
		response = `END ${seasonalHerbDetails}`;
	} else if (text.startsWith("2*3")) {
		// User selects the third seasonal herb for details
		const seasonalHerbDetails =
			"Baobab (Adansonia digitata): Traditional Use: Nutritional support. Preparation: Powdered fruit.";
		response = `END ${seasonalHerbDetails}`;
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
