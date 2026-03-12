const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env file");
  process.exit(1);
}

const exportData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const modelsDir = path.join(__dirname, "models");
    const modelFiles = fs.readdirSync(modelsDir).filter(file => file.endsWith(".js"));

    const allData = {};

    for (const file of modelFiles) {
      const modelPath = path.join(modelsDir, file);
      const model = require(modelPath);
      const modelName = model.modelName || file.replace(".js", "");
      
      console.log(`- Fetching data for collection: ${modelName}...`);
      const data = await model.find({}).lean();
      allData[modelName] = data;
    }

    const outputPath = path.join(__dirname, "mongo_data_export.json");
    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));

    console.log(`\n✨ Successfully exported all data to: ${outputPath}`);
    console.log(`Total collections exported: ${Object.keys(allData).length}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during export:", error);
    process.exit(1);
  }
};

exportData();
