require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./model/Product');

const updateRatings = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // Find all products that do not have a rating field
    const products = await Product.find({ rating: { $exists: false } });
    if (products.length === 0) {
      console.log("All products already have ratings.");
      process.exit(0);
    }

    console.log(`Updating ${products.length} products with a random rating between 3.5 and 5.0...`);
    for (const p of products) {
      p.rating = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
      await p.save();
    }

    console.log("Successfully updated ratings!");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  }
};

updateRatings();
