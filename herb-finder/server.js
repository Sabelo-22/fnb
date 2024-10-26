const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post("/ussd", (req, res) => {
	// Parse the request parameters from Africa's Talking
	const { sessionId, serviceCode, phoneNumber, text } = req.body;

	// Implement USSD menu logic here
	let response = "";

	if (text === "") {
		// Initial Menu
		response = `CON Welcome to Herb Finder!
        1. Find herbs by symptoms
        2. Browse common herbs
        3. Learn about herbal care`;
	} else if (text === "1") {
		response = `CON Select a symptom:
        1. Headache
        2. Cough
        3. Fever`;
	} else if (text === "1*1") {
		response = `END Recommended herb for headache: Ginger`;
	} else if (text === "2") {
		response = `CON Select an herb:
        1. Aloe Vera
        2. Turmeric
        3. Ginger`;
	} else {
		response = `END Invalid choice. Please try again.`;
	}

	res.set("Content-Type", "text/plain");
	res.send(response);
});

const port = 3000;
app.listen(port, () => {
	console.log(`USSD app running on port ${port}`);
});
