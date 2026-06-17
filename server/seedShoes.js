require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./model/Product');

const shoeProducts = [
  {
    title: "Classic White Leather Sneakers",
    description: "Sleek and clean white leather sneakers, ideal for smart-casual wear.",
    mainImg: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Shoes",
    sizes: ["7", "8", "9", "10", "11"],
    gender: "men",
    price: 1999,
    discount: 10,
    isActive: true
  },
  {
    title: "All-Weather Trail Running Shoes",
    description: "Rugged waterproof shoes designed to handle any running path or hiking trail.",
    mainImg: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Shoes",
    sizes: ["8", "9", "10", "11"],
    gender: "men",
    price: 3499,
    discount: 15,
    isActive: true
  },
  {
    title: "Formal Leather Oxford Shoes",
    description: "Elegant handcrafted black leather Oxford dress shoes for formal occasions.",
    mainImg: "https://images.unsplash.com/photo-1486308512493-ae6a1c954066?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Shoes",
    sizes: ["7", "8", "9", "10"],
    gender: "men",
    price: 4299,
    discount: 20,
    isActive: true
  },
  {
    title: "Breathable Mesh Training Shoes",
    description: "Lightweight, breathable athletic training shoes for gym workouts and everyday fitness.",
    mainImg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Shoes",
    sizes: ["8", "9", "10", "11"],
    gender: "men",
    price: 2299,
    discount: 5,
    isActive: true
  },
  {
    title: "Vintage Suede Loafers",
    description: "Comfortable and stylish slip-on tan suede loafers, perfect for summer.",
    mainImg: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Shoes",
    sizes: ["7", "8", "9", "10"],
    gender: "men",
    price: 2899,
    discount: 12,
    isActive: true
  },
  {
    title: "High-Top Canvas Sneakers",
    description: "Classic vintage style high-top canvas sneakers with durable rubber soles.",
    mainImg: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Shoes",
    sizes: ["6", "7", "8", "9", "10", "11"],
    gender: "men",
    price: 1499,
    discount: 8,
    isActive: true
  },
  {
    title: "Cushioned Road Running Shoes",
    description: "Max-cushioning road running shoes offering extra arch support and shock absorption.",
    mainImg: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Shoes",
    sizes: ["8", "9", "10", "11"],
    gender: "men",
    price: 3199,
    discount: 25,
    isActive: true
  },
  {
    title: "Heavy Duty Leather Combat Boots",
    description: "Waterproof, military-grade black leather boots featuring steel toes and rubber grip soles.",
    mainImg: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Shoes",
    sizes: ["8", "9", "10", "11", "12"],
    gender: "men",
    price: 4999,
    discount: 18,
    isActive: true
  },
  {
    title: "Casual Slip-On Boat Shoes",
    description: "Classic navy blue canvas boat shoes with non-slip soles for casual weekends.",
    mainImg: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Shoes",
    sizes: ["7", "8", "9", "10"],
    gender: "men",
    price: 1799,
    discount: 0,
    isActive: true
  },
  {
    title: "Sporty Slide Sandals",
    description: "Comfortable slip-on athletic slide sandals for recovery after workouts or pool days.",
    mainImg: "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Shoes",
    sizes: ["7", "8", "9", "10", "11"],
    gender: "men",
    price: 899,
    discount: 0,
    isActive: true
  }
];

const seedShoes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully...");

    const inserted = await Product.insertMany(shoeProducts);
    console.log(`Successfully added ${inserted.length} men's shoe products to the database!`);
    
    process.exit(0);
  } catch (err) {
    console.error("Failed to seed database:", err.message);
    process.exit(1);
  }
};

seedShoes();
