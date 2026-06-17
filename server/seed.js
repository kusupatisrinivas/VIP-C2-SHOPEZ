require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./model/Product');
// adjust path if your model lives elsewhere

const sampleProducts = [
  {
    title: "Classic Crew Neck T-Shirt",
    description: "Soft cotton t-shirt, perfect for everyday wear.",
    mainImg: "https://picsum.photos/seed/tshirt1/500/500",
    carousel: ["https://picsum.photos/seed/tshirt1a/500/500", "https://picsum.photos/seed/tshirt1b/500/500"],
    category: "T-Shirts",
    sizes: ["S", "M", "L", "XL"],
    gender: "men",
    price: 599,
    discount: 10,
    isActive: true
  },
  {
    title: "Slim Fit Denim Jacket",
    description: "A durable denim jacket with a modern slim fit.",
    mainImg: "https://picsum.photos/seed/jacket1/500/500",
    carousel: ["https://picsum.photos/seed/jacket1a/500/500"],
    category: "Jackets",
    sizes: ["M", "L", "XL"],
    gender: "men",
    price: 1999,
    discount: 15,
    isActive: true
  },
  {
    title: "Running Sneakers",
    description: "Lightweight sneakers built for daily runs.",
    mainImg: "https://picsum.photos/seed/shoes1/500/500",
    carousel: ["https://picsum.photos/seed/shoes1a/500/500"],
    category: "Shoes",
    sizes: ["7", "8", "9", "10", "11"],
    gender: "men",
    price: 2499,
    discount: 0,
    isActive: true
  },
  {
    title: "Floral Summer Dress",
    description: "Light and breezy dress, perfect for summer days.",
    mainImg: "https://picsum.photos/seed/dress1/500/500",
    carousel: ["https://picsum.photos/seed/dress1a/500/500"],
    category: "Dresses",
    sizes: ["S", "M", "L"],
    gender: "women",
    price: 1399,
    discount: 20,
    isActive: true
  },
  {
    title: "High-Waist Yoga Leggings",
    description: "Stretchy, breathable leggings for workouts and lounging.",
    mainImg: "https://picsum.photos/seed/legging1/500/500",
    carousel: ["https://picsum.photos/seed/legging1a/500/500"],
    category: "Activewear",
    sizes: ["XS", "S", "M", "L"],
    gender: "women",
    price: 899,
    discount: 5,
    isActive: true
  },
  {
    title: "Kids' Graphic Hoodie",
    description: "Cozy fleece hoodie with a fun printed design.",
    mainImg: "https://picsum.photos/seed/hoodie1/500/500",
    carousel: ["https://picsum.photos/seed/hoodie1a/500/500"],
    category: "Hoodies",
    sizes: ["4-5Y", "6-7Y", "8-9Y"],
    gender: "kids",
    price: 799,
    discount: 0,
    isActive: true
  },
  {
    title: "Unisex Canvas Tote Bag",
    description: "Spacious canvas tote, great for everyday carry.",
    mainImg: "https://picsum.photos/seed/tote1/500/500",
    carousel: ["https://picsum.photos/seed/tote1a/500/500"],
    category: "Accessories",
    sizes: [],
    gender: "unisex",
    price: 499,
    discount: 0,
    isActive: true
  },
  {
    title: "Unisex Baseball Cap",
    description: "Adjustable cap with embroidered logo.",
    mainImg: "https://picsum.photos/seed/cap1/500/500",
    carousel: ["https://picsum.photos/seed/cap1a/500/500"],
    category: "Accessories",
    sizes: [],
    gender: "unisex",
    price: 349,
    discount: 0,
    isActive: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Product.deleteMany({}); // clears existing products before reseeding
    await Product.insertMany(sampleProducts);

    console.log(`Inserted ${sampleProducts.length} sample products`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedDB();