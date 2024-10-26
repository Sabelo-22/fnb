const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

// Load the dataset into memory
let herbsData = [];

// Read and parse the CSV file
fs.createReadStream("herbs_dataset.csv")
	.pipe(csv())
	.on("data", (row) => {
		herbsData.push(row);
	})
	.on("end", () => {
		console.log("CSV file successfully processed");
	});

// Define the API endpoint
app.get("/herbs", (req, res) => {
	const { symptom, region, season } = req.query;

	// Filter herbs based on user selections
	const filteredHerbs = herbsData.filter((herb) => {
		const matchesSymptom = symptom
			? herb["Traditional Use"].toLowerCase().includes(symptom.toLowerCase())
			: true;
		const matchesRegion = region
			? herb["Region"].toLowerCase().includes(region.toLowerCase())
			: true;
		const matchesSeason = season
			? herb["Season"].toLowerCase().includes(season.toLowerCase())
			: true;
		return matchesSymptom && matchesRegion && matchesSeason;
	});

	res.json(filteredHerbs);
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
