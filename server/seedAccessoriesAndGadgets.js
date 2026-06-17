require('dotenv').config();
const mongoose = require('mongoose');
const https = require('https');
const Product = require('./model/Product');
const Category = require('./model/Category');

const newCategories = [
  {
    name: "Sunglasses",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=80",
    isActive: true
  },
  {
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500&q=80",
    isActive: true
  }
];

const newProducts = [
  {
    title: "Classic Aviator Sunglasses",
    description: "Sleek metal frame aviators with polarized dark lenses, perfect for sun protection and style.",
    mainImg: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Sunglasses",
    sizes: [],
    gender: "unisex",
    price: 1499,
    discount: 10,
    rating: 4.5,
    isActive: true
  },
  {
    title: "Vintage Round Metal Sunglasses",
    description: "Retro-style circular metallic frame sunglasses featuring modern UV400 protective lenses.",
    mainImg: "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Sunglasses",
    sizes: [],
    gender: "unisex",
    price: 1899,
    discount: 15,
    rating: 4.2,
    isActive: true
  },
  {
    title: "Polarized Wayfarer Sunglasses",
    description: "Durable acetate-framed wayfarer sunglasses with polarized lenses for reduced glare.",
    mainImg: "https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Sunglasses",
    sizes: [],
    gender: "unisex",
    price: 2499,
    discount: 20,
    rating: 4.7,
    isActive: true
  },
  {
    title: "Modern Hexagonal Sunglasses",
    description: "Trendy hexagonal metal frames offering a sophisticated urban aesthetic.",
    mainImg: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Sunglasses",
    sizes: [],
    gender: "unisex",
    price: 2999,
    discount: 12,
    rating: 4.4,
    isActive: true
  },
  {
    title: "Premium Cat-Eye Sunglasses",
    description: "Iconic cat-eye silhouette frames with tinted UV lenses for a bold fashion statement.",
    mainImg: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Sunglasses",
    sizes: [],
    gender: "unisex",
    price: 3499,
    discount: 8,
    rating: 4.6,
    isActive: true
  },
  {
    title: "Wireless Earbuds",
    description: "High-fidelity active noise-canceling wireless earbuds featuring long-lasting battery life and a charging case.",
    mainImg: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Electronics",
    sizes: [],
    gender: "unisex",
    price: 2999,
    discount: 15,
    rating: 4.6,
    isActive: true
  },
  {
    title: "Smart Watch",
    description: "Fitness and health tracking smart watch with a premium heart rate monitor and always-on display.",
    mainImg: "https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Electronics",
    sizes: [],
    gender: "unisex",
    price: 4999,
    discount: 10,
    rating: 4.4,
    isActive: true
  },
  {
    title: "Bluetooth Speaker",
    description: "Portable waterproof Bluetooth speaker with deep bass, rich treble, and 12-hour continuous playback.",
    mainImg: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Electronics",
    sizes: [],
    gender: "unisex",
    price: 1999,
    discount: 20,
    rating: 4.3,
    isActive: true
  },
  {
    title: "Power Bank",
    description: "Compact 10,000mAh fast-charging portable power bank equipped with dual USB outputs.",
    mainImg: "https://images.unsplash.com/photo-1609592424109-dd9892f1b17c?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1619086303291-0ef7b4140da3?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Electronics",
    sizes: [],
    gender: "unisex",
    price: 1499,
    discount: 5,
    rating: 4.1,
    isActive: true
  },
  {
    title: "Wireless Mouse",
    description: "Sleek, ergonomic silent-click wireless mouse with customizable DPI sensitivity.",
    mainImg: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=500&q=80"
    ],
    category: "Electronics",
    sizes: [],
    gender: "unisex",
    price: 999,
    discount: 12,
    rating: 4.5,
    isActive: true
  }
];

// Helper to check URL accessibility
const checkUrl = (url) => {
  return new Promise((resolve) => {
    const checkWithMethod = (method) => {
      const options = {
        method: method,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      };
      https.request(url, options, (res) => {
        const ok = res.statusCode >= 200 && res.statusCode < 400;
        if (!ok && method === 'HEAD') {
          checkWithMethod('GET');
        } else {
          resolve(ok);
        }
      }).on('error', () => {
        if (method === 'HEAD') {
          checkWithMethod('GET');
        } else {
          resolve(false);
        }
      }).on('timeout', () => {
        resolve(false);
      }).end();
    };
    checkWithMethod('HEAD');
  });
};

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // 1. Create/Upsert Categories
    const categoriesCreated = [];
    for (const catData of newCategories) {
      const existing = await Category.findOne({ name: catData.name });
      if (!existing) {
        await Category.create(catData);
        categoriesCreated.push(catData.name);
      } else {
        categoriesCreated.push(`${catData.name} (already existed)`);
      }
    }

    // 2. Check and Insert Products
    const productsInserted = [];
    const failedUrls = [];

    for (const item of newProducts) {
      // Validate URLs
      const mainImgOk = await checkUrl(item.mainImg);
      if (!mainImgOk) failedUrls.push(item.mainImg);

      for (const img of item.carousel) {
        const carouselImgOk = await checkUrl(img);
        if (!carouselImgOk) failedUrls.push(img);
      }

      // Insert product
      await Product.create(item);
      productsInserted.push(item.title);
    }

    console.log("\n--- Seeding Report ---");
    console.log("Categories Created/Verified:");
    categoriesCreated.forEach(cat => console.log(` - ${cat}`));
    
    console.log(`\nSuccessfully inserted ${productsInserted.length} products:`);
    productsInserted.forEach(p => console.log(` - ${p}`));

    if (failedUrls.length > 0) {
      console.log("\nFailed/Unreachable Image URLs:");
      failedUrls.forEach(url => console.log(` - ${url}`));
    } else {
      console.log("\nAll image URLs successfully verified online!");
    }

    process.exit(0);
  } catch (err) {
    console.error("Seeding script failed:", err.message);
    process.exit(1);
  }
};

runSeed();
