const express = require("express");
require("dotenv").config();
const axios = require("axios");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/api/test", function (req, res) {
	res.send("Test request sabza");
});

// Define language translations
const translations = {
	english: {
		welcome: "Welcome to the Herb Finder App IMBEWU.",
		disclaimer: `Please read the disclaimer:
		1. This service provides natural remedy suggestions based on your symptoms.
		2. Consult with a healthcare professional for serious health issues.
		3. By continuing, you agree to these terms.`,
		acceptTerms: "Do you accept the terms?",
		accept: "1. Yes",
		decline: "2. No",
		getStarted: "1. Get Started",
		aboutApp: "2. About This App",
		exit: "3. Exit",
		symptoms: "Select your primary symptom:",
		provinces: "Select your province:",
		season: "Select the season:",
		allergies: "Do you have any allergies?",
		age: "Please enter your age or press 0 to Skip.",
		typedSymptom: "Please type in your symptom:",
		recommendations:
			"Thank you! We will provide recommendations based on your input.",
		back: "0. Back",
	},
	isiZulu: {
		welcome: "Wamkelekile kuhlelo lwe-Herb Finder App IMBEWU.",
		disclaimer: `Ngiyacela ufunde le misho:
		1. Le nsizakalo ihlinzeka ngamasu wemithi yemvelo ngokususelwa ezimpawuleni zakho.
		2. Xhumana nochwepheshe bezempilo ngezinkinga zempilo ezinzima.
		3. Ngokwenza lokhu, uvuma lezi zimo.`,
		acceptTerms: "Uyamukela lezi zimo?",
		accept: "1. Yebo",
		decline: "2. Cha",
		getStarted: "1. Qala",
		aboutApp: "2. Mayelana Nehlelo",
		exit: "3. Phuma",
		symptoms: "Khetha isimo sakho esiyinhloko:",
		provinces: "Khetha isifunda sakho:",
		season: "Khetha isikhathi sonyaka:",
		allergies: "Unama-allegies?",
		age: "Sicela ufake iminyaka yakho noma ucindezele 0 ukuze uSkip.",
		typedSymptom: "Sicela uthayiphe isimo sakho:",
		recommendations:
			"Ngiyabonga! Sizokunikeza iziphakamiso ngokuya ngempendulo yakho.",
		back: "0. Phenduka",
	},
	sesotho: {
		welcome: "Welcome to the Herb Finder App IMBEWU.",
		disclaimer: `Pele u sebelisa sesebelisoa, hlokomela:
		1. Tshebeletso ena e fa mekgwa ea mehlodi e amanang le matšoao a hau.
		2. Kopo e kgethehileng e arolelana le ngaka bakeng sa mathata a bophelo bo botle.
		3. Ha u ntse u tsoela pele, u amohela mekgwa ena.`,
		acceptTerms: "U amohela mekgwa?",
		accept: "1. E, kea amohela",
		decline: "2. Che",
		getStarted: "1. Qala",
		aboutApp: "2. Ka Motswako",
		exit: "3. Etsa",
		symptoms: "Khetha matšoao a hau:",
		provinces: "Khetha profinse:",
		season: "Khetha nako:",
		allergies: "Na u na le alergies?",
		age: "Tlhokomeliso: Kenya selemo sa hau kapa tobetsa 0 ho skip.",
		typedSymptom: "Tobetsa ho kenya matšoao a hau:",
		recommendations:
			"Kea leboha! Re tla u fa mekhahlelo ho ea ka ts'ebeliso ea hau.",
		back: "0. Boela",
	},
};

app.post("/ussd", async (req, res) => {
	const { sessionId, serviceCode, phoneNumber, text } = req.body;
	let response = "";
	let currentLanguage = "english"; // Default language

	if (text === "") {
		// Initial language selection
		response = `CON Select your language:
		1. English
		2. isiZulu
		3. Sesotho`;
	} else if (text === "1") {
		currentLanguage = "english";
		response = `CON ${translations[currentLanguage].welcome}
		${translations[currentLanguage].disclaimer}
		${translations[currentLanguage].acceptTerms}
		${translations[currentLanguage].accept}
		${translations[currentLanguage].decline}`;
	} else if (text === "2") {
		currentLanguage = "isiZulu";
		response = `CON ${translations[currentLanguage].welcome}
		${translations[currentLanguage].disclaimer}
		${translations[currentLanguage].acceptTerms}
		${translations[currentLanguage].accept}
		${translations[currentLanguage].decline}`;
	} else if (text === "3") {
		currentLanguage = "sesotho";
		response = `CON ${translations[currentLanguage].welcome}
		${translations[currentLanguage].disclaimer}
		${translations[currentLanguage].acceptTerms}
		${translations[currentLanguage].accept}
		${translations[currentLanguage].decline}`;
	} else if (text === "1*1" || text === "2*1" || text === "3*1") {
		// User accepts the disclaimer
		response = `CON Thank you for accepting the terms. 
		${translations[currentLanguage].getStarted}
		${translations[currentLanguage].aboutApp}
		${translations[currentLanguage].exit}`;
	} else if (text === "1*2" || text === "2*2" || text === "3*2") {
		// User declines the disclaimer
		response = `END Thank you for using our service. Goodbye!`;
	} else if (
		text.startsWith("1*1") ||
		text.startsWith("2*1") ||
		text.startsWith("3*1")
	) {
		// User selects to get started and picks symptom
		response = `CON ${translations[currentLanguage].symptoms}
		1. Headache
		2. Fever
		3. Stomachache
		4. Cough
		5. Other (type in your symptom)
		0. ${translations[currentLanguage].back}`;
	} else if (
		text.startsWith("1*1*5") ||
		text.startsWith("2*1*5") ||
		text.startsWith("3*1*5")
	) {
		// User chooses to type in their symptom
		response = `CON ${translations[currentLanguage].typedSymptom}
		0. ${translations[currentLanguage].back}`;
	} else if (
		text.startsWith("1*1*5*") ||
		text.startsWith("2*1*5*") ||
		text.startsWith("3*1*5*")
	) {
		// If user has entered their symptom, proceed to province selection
		const typedSymptom = text.split("*")[3];

		if (typedSymptom.trim()) {
			// Ensure that the input is not just whitespace
			response = `CON Your symptom is: ${typedSymptom}. 
			${translations[currentLanguage].provinces}
			1. Gauteng
			2. Western Cape
			3. KwaZulu-Natal
			4. Eastern Cape
			5. Free State
			6. Limpopo
			7. Mpumalanga
			8. North West
			9. Northern Cape
			10. Skip
			0. ${translations[currentLanguage].back}`;
		} else {
			// If there's no valid input, prompt again
			response = `CON ${translations[currentLanguage].typedSymptom}
			0. ${translations[currentLanguage].back}`;
		}
	} else if (text.startsWith("1*1*") && text.split("*").length === 3) {
		// After symptom selection, ask for province with skip option
		response = `CON ${translations[currentLanguage].provinces}
		1. Gauteng
		2. Western Cape
		3. KwaZulu-Natal
		4. Eastern Cape
		5. Free State
		6. Limpopo
		7. Mpumalanga
		8. North West
		9. Northern Cape
		10. Skip
		0. ${translations[currentLanguage].back}`;
	} else if (text.startsWith("1*1*") && text.split("*").length === 4) {
		// After province selection, ask for season with skip option
		response = `CON ${translations[currentLanguage].season}
		1. Summer
		2. Autumn
		3. Winter
		4. Spring
		5. Skip
		0. ${translations[currentLanguage].back}`;
	} else if (text.startsWith("1*1*") && text.split("*").length === 5) {
		// After season selection, ask for allergies
		response = `CON ${translations[currentLanguage].allergies}
		1. Yes
		2. No
		0. ${translations[currentLanguage].back}`;
	} else if (text.startsWith("1*1*") && text.split("*").length === 6) {
		// After allergies, ask for age with skip option
		response = `CON ${translations[currentLanguage].age}
		0. Skip`;
	} else if (text.startsWith("1*1*") && text.split("*").length === 7) {
		// After age input, provide recommendations
		response = `END ${translations[currentLanguage].recommendations}`;
	} else {
		response = `END Invalid input. Please try again.`;
	}

	res.set("Content-Type", "text/plain");
	res.send(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
