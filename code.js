const express = require("express");
require("dotenv").config();
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/test", function (req, res) {
	res.send("Test request sabza");
});

app.post("/ussd", async (req, res) => {
	const { sessionId, serviceCode, phoneNumber, text } = req.body;

	let response = "";

	if (text == "") {
		response = `CON Welcome to the Herb Finder App IMBEWU.
		Access Natural Remedies based on symptoms, location, season, allergies, and age:
		1. Get Started
		2. About This App
		3. Exit`;
	} else if (text == "1") {
		response = `CON Select your primary symptom:
		1. Headache
		2. Fever
		3. Stomachache
		4. Cough
		5. Other (type in)
		0. Back`;
	} else if (text == "2") {
		response = `CON This app offers herb recommendations for common ailments.
		Our suggestions are based on traditional South African herbal medicine, customized to your needs.
		Press any key to continue.
		0. Back`;
	} else if (text == "3") {
		response = `END Thank you for using IMBEWU! Goodbye!`;
	} else if (text.startsWith("1*") && text.split("*").length === 2) {
		response = `CON Select your province:
		1. Gauteng
		2. Western Cape
		3. KwaZulu-Natal
		4. Eastern Cape
		5. Free State
		6. Limpopo
		7. Mpumalanga
		8. North West
		9. Northern Cape
		0. Back`;
	} else if (text.startsWith("1*") && text.split("*").length === 3) {
		response = `CON Select the season:
		1. Summer
		2. Autumn
		3. Winter
		4. Spring
		0. Back`;
	} else if (text.startsWith("1*") && text.split("*").length === 4) {
		response = `CON Do you have any allergies? 
		1. Yes
		2. No
		0. Back`;
	} else if (
		text.startsWith("1*") &&
		text.endsWith("*1") &&
		text.split("*").length === 5
	) {
		response = `CON Please specify your allergies (e.g., pollen, nuts):
		0. Back`;
	} else if (
		text.startsWith("1*") &&
		(text.endsWith("*2") || text.split("*").length === 6)
	) {
		response = `CON Please enter your age: 
		0. Back`;
	} else if (text.startsWith("1*") && text.split("*").length === 7) {
		const inputs = text.split("*");
		const symptom =
			inputs[1] === "1"
				? "Headache"
				: inputs[1] === "2"
				? "Fever"
				: inputs[1] === "3"
				? "Stomachache"
				: "Cough";
		const province =
			inputs[2] === "1"
				? "Gauteng"
				: inputs[2] === "2"
				? "Western Cape"
				: inputs[2] === "3"
				? "KwaZulu-Natal"
				: inputs[2] === "4"
				? "Eastern Cape"
				: inputs[2] === "5"
				? "Free State"
				: inputs[2] === "6"
				? "Limpopo"
				: inputs[2] === "7"
				? "Mpumalanga"
				: inputs[2] === "8"
				? "North West"
				: "Northern Cape";
		const season =
			inputs[3] === "1"
				? "Summer"
				: inputs[3] === "2"
				? "Autumn"
				: inputs[3] === "3"
				? "Winter"
				: "Spring";
		const allergies =
			inputs[4] === "1" ? `Allergies: ${inputs[5]}` : "No allergies";
		const age = inputs[6];

		const prompt = `Based on the following information, suggest a suitable herb: 
        Symptom: ${symptom}, 
        Province: ${province}, 
        Season: ${season}, 
        Allergies: ${allergies}, 
        Age: ${age}.`;

		try {
			// OpenAI API request using the correct endpoint and payload structure
			const openaiResponse = await axios.post(
				"https://api.openai.com/v1/chat/completions",
				{
					model: "gpt-3.5-turbo",
					messages: [
						{
							role: "system",
							content:
								"You are an assistant providing herb recommendations. you also give steps for preparation of the herbs and where it could be found.",
						},
						{
							role: "user",
							content: prompt,
						},
					],
					max_tokens: 100,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
					},
				}
			);

			// Extract recommendation from response
			const recommendation =
				openaiResponse.data.choices[0].message.content.trim();
			response = `END ${recommendation}`;
		} catch (error) {
			console.error(
				"Error calling OpenAI:",
				error.response ? error.response.data : error.message
			);
			response = `END Sorry, there was an error generating a recommendation. Please try again later.`;
		}
	} else {
		response = `END Invalid selection. Please try again.`;
	}

	res.set("Content-Type", "text/plain");
	res.send(response);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
