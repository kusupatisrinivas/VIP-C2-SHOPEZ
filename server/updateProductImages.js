require('dotenv').config();
const mongoose = require('mongoose');
const https = require('https');
const Product = require('./model/Product');

const replacements = [
  {
    id: "6a2ff1194486dea900445e94",
    title: "Classic Crew Neck T-Shirt",
    mainImg: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=500&q=80"
    ]
  },
  {
    id: "6a2ff1194486dea900445e95",
    title: "Slim Fit Denim Jacket",
    mainImg: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?auto=format&fit=crop&w=500&q=80"
    ]
  },
  {
    id: "6a2ff1194486dea900445e96",
    title: "Running Sneakers",
    mainImg: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=500&q=80"
    ]
  },
  {
    id: "6a2ff1194486dea900445e97",
    title: "Floral Summer Dress",
    mainImg: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1612336307429-8a898d10e223?auto=format&fit=crop&w=500&q=80"
    ]
  },
  {
    id: "6a2ff1194486dea900445e98",
    title: "High-Waist Yoga Leggings",
    mainImg: "https://images.unsplash.com/photo-1506152983158-b4a74a01c721?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1548690312-e3b507d8c110?auto=format&fit=crop&w=500&q=80"
    ]
  },
  {
    id: "6a2ff1194486dea900445e99",
    title: "Kids' Graphic Hoodie",
    mainImg: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80"
    ]
  },
  {
    id: "6a2ff1194486dea900445e9a",
    title: "Unisex Canvas Tote Bag",
    mainImg: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=80"
    ]
  },
  {
    id: "6a2ff1194486dea900445e9b",
    title: "Unisex Baseball Cap",
    mainImg: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=500&q=80",
    carousel: [
      "https://images.unsplash.com/photo-1575424909138-46b05e5919ec?auto=format&fit=crop&w=500&q=80"
    ]
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

const runUpdates = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    let updatedCount = 0;
    const failedUrls = [];
    const updatedProductsInfo = [];

    for (const item of replacements) {
      console.log(`Processing product: ${item.title}...`);

      // Check URLs first
      const mainImgOk = await checkUrl(item.mainImg);
      if (!mainImgOk) failedUrls.push(item.mainImg);

      for (const img of item.carousel) {
        const carouselImgOk = await checkUrl(img);
        if (!carouselImgOk) failedUrls.push(img);
      }

      // Update the product
      const product = await Product.findById(item.id);
      if (product) {
        product.mainImg = item.mainImg;
        product.carousel = item.carousel;
        await product.save();
        updatedCount++;
        updatedProductsInfo.push({ id: product._id, title: product.title });
      } else {
        console.warn(`Product ID ${item.id} not found in database.`);
      }
    }

    console.log("\n--- Execution Report ---");
    console.log(`Successfully updated ${updatedCount} products.`);
    console.log("Updated Products:");
    updatedProductsInfo.forEach(p => console.log(` - ${p.title} (${p.id})`));

    if (failedUrls.length > 0) {
      console.log("\nFailed/Unreachable Image URLs:");
      failedUrls.forEach(url => console.log(` - ${url}`));
    } else {
      console.log("\nAll image URLs are accessible and returned success codes!");
    }

    process.exit(0);
  } catch (err) {
    console.error("Migration script failed:", err.message);
    process.exit(1);
  }
};

runUpdates();
