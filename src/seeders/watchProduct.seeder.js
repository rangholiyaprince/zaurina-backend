const mongoose = require('mongoose');
const dotenv = require('dotenv');
const slugify = require('slugify');
const WatchProduct = require('../models/WatchProduct.model');

const connectDB = require('../config/db');

dotenv.config();



// --- Sample Products ---
const sampleProducts = [
  // 15 Watches
  {
    productTitle: "Rolex Submariner Date",
    price: 10500,
    brand: "Rolex",
    watchType: "Automatic",
    status: "active",
    stock: "instock",
    productDescription: "The archetypal diving watch.",
    categories: ["Men", "Luxury", "Sport"],
    attributes: { bandColor: "Silver", caseMaterial: "Oystersteel", dialColor: "Black" }
  },
  {
    productTitle: "Omega Speedmaster Moonwatch",
    price: 7000,
    brand: "Omega",
    watchType: "Manual",
    status: "active",
    stock: "instock",
    productDescription: "The watch that went to the moon.",
    categories: ["Men", "Chronograph", "Iconic"],
    attributes: { bandColor: "Silver", caseMaterial: "Steel", dialColor: "Black" }
  },
  {
    productTitle: "Patek Philippe Nautilus",
    price: 35000,
    brand: "Patek Philippe",
    watchType: "Automatic",
    status: "active",
    stock: "outstock",
    productDescription: "The ultimate luxury sports watch.",
    categories: ["Men", "Luxury", "High-End"],
    attributes: { bandColor: "Silver", caseMaterial: "Steel", dialColor: "Blue" }
  },
  {
    productTitle: "Audemars Piguet Royal Oak",
    price: 28000,
    brand: "Audemars Piguet",
    watchType: "Automatic",
    status: "active",
    stock: "instock",
    productDescription: "First luxury sports watch in steel.",
    categories: ["Men", "Luxury", "Iconic"],
    attributes: { bandColor: "Silver", caseMaterial: "Steel", dialColor: "Blue" }
  },
  {
    productTitle: "Cartier Tank Must",
    price: 3500,
    brand: "Cartier",
    watchType: "Quartz",
    status: "active",
    stock: "instock",
    productDescription: "A classic design that never goes out of style.",
    categories: ["Unisex", "Dress", "Classic"],
    attributes: { bandColor: "Black", caseMaterial: "Steel", dialColor: "White" }
  },
  {
    productTitle: "Tudor Black Bay 58",
    price: 3800,
    brand: "Tudor",
    watchType: "Automatic",
    status: "active",
    stock: "instock",
    productDescription: "Vintage inspired diver.",
    categories: ["Men", "Diver", "Vintage"],
    attributes: { bandColor: "Silver", caseMaterial: "Steel", dialColor: "Black" }
  },
  {
    productTitle: "Breitling Navitimer",
    price: 9000,
    brand: "Breitling",
    watchType: "Automatic",
    status: "active",
    stock: "instock",
    productDescription: "The pilot's favorite chronograph.",
    categories: ["Men", "Aviation", "Chronograph"],
    attributes: { bandColor: "Black", caseMaterial: "Steel", dialColor: "Black" }
  },
  {
    productTitle: "IWC Portugieser Chronograph",
    price: 8500,
    brand: "IWC",
    watchType: "Automatic",
    status: "active",
    stock: "instock",
    productDescription: "Elegant chronograph design.",
    categories: ["Men", "Dress", "Chronograph"],
    attributes: { bandColor: "Blue", caseMaterial: "Steel", dialColor: "White" }
  },
  {
    productTitle: "Panerai Luminor Marina",
    price: 7800,
    brand: "Panerai",
    watchType: "Automatic",
    status: "active",
    stock: "instock",
    productDescription: "Distinctive Italian design.",
    categories: ["Men", "Diver", "Bold"],
    attributes: { bandColor: "Brown", caseMaterial: "Steel", dialColor: "Black" }
  },
  {
    productTitle: "Hublot Big Bang",
    price: 12000,
    brand: "Hublot",
    watchType: "Automatic",
    status: "active",
    stock: "instock",
    productDescription: "Fusion of materials.",
    categories: ["Men", "Sport", "Modern"],
    attributes: { bandColor: "Black", caseMaterial: "Ceramic", dialColor: "Skeleton" }
  },
  {
    productTitle: "Tag Heuer Carrera",
    price: 4500,
    brand: "Tag Heuer",
    watchType: "Automatic",
    status: "active",
    stock: "instock",
    productDescription: "Racing inspired chronograph.",
    categories: ["Men", "Racing", "Sport"],
    attributes: { bandColor: "Silver", caseMaterial: "Steel", dialColor: "Blue" }
  },
  {
    productTitle: "Jaeger-LeCoultre Reverso",
    price: 6500,
    brand: "Jaeger-LeCoultre",
    watchType: "Manual",
    status: "active",
    stock: "instock",
    productDescription: "The watch with the swivel case.",
    categories: ["Unisex", "Dress", "Art Deco"],
    attributes: { bandColor: "Brown", caseMaterial: "Steel", dialColor: "Silver" }
  },
  {
    productTitle: "Vacheron Constantin Overseas",
    price: 25000,
    brand: "Vacheron Constantin",
    watchType: "Automatic",
    status: "inactive",
    stock: "outstock",
    productDescription: "High horology sports watch.",
    categories: ["Men", "Luxury", "Travel"],
    attributes: { bandColor: "Silver", caseMaterial: "Steel", dialColor: "Blue" }
  },
  {
    productTitle: "Casio G-Shock",
    price: 150,
    brand: "Casio",
    watchType: "Digital",
    status: "active",
    stock: "instock",
    productDescription: "The toughest watch of all time.",
    categories: ["Men", "Sport", "Utility"],
    attributes: { bandColor: "Black", caseMaterial: "Resin", dialColor: "Digital" }
  },
  {
    productTitle: "Seiko Prospex",
    price: 1200,
    brand: "Seiko",
    watchType: "Automatic",
    status: "active",
    stock: "instock",
    productDescription: "Reliable Japanese diver.",
    categories: ["Men", "Diver", "Value"],
    attributes: { bandColor: "Silver", caseMaterial: "Steel", dialColor: "Green" }
  },

  // 5 Jewelry Products
  {
    productTitle: "Diamond Tennis Bracelet",
    price: 5000,
    brand: "Zaurina",
    watchType: "Jewelry",
    status: "active",
    stock: "instock",
    productDescription: "Classic diamond bracelet.",
    categories: ["Women", "Jewelry", "Diamond"],
    attributes: { gemType: "Diamond", gemCut: "Round", gemClarity: "VS1" }
  },
  {
    productTitle: "Sapphire Engagement Ring",
    price: 8000,
    brand: "Zaurina",
    watchType: "Jewelry",
    status: "active",
    stock: "instock",
    productDescription: "Blue sapphire with diamond halo.",
    categories: ["Women", "Ring", "Engagement"],
    attributes: { gemType: "Sapphire", gemCut: "Oval", gemSetting: "Halo" }
  },
  {
    productTitle: "Gold Chain Necklace",
    price: 1500,
    brand: "Zaurina",
    watchType: "Jewelry",
    status: "active",
    stock: "instock",
    productDescription: "18k gold chain.",
    categories: ["Unisex", "Necklace", "Gold"],
    attributes: { caseMaterial: "Gold" }
  },
  {
    productTitle: "Pearl Earrings",
    price: 600,
    brand: "Zaurina",
    watchType: "Jewelry",
    status: "active",
    stock: "instock",
    productDescription: "Freshwater pearls.",
    categories: ["Women", "Earrings", "Pearl"],
    attributes: { gemType: "Pearl" }
  },
  {
    productTitle: "Ruby Pendant",
    price: 3000,
    brand: "Zaurina",
    watchType: "Jewelry",
    status: "inactive",
    stock: "outstock",
    productDescription: "Deep red ruby pendant.",
    categories: ["Women", "Necklace", "Gemstone"],
    attributes: { gemType: "Ruby", gemCut: "Emerald" }
  }
];

const importData = async () => {
  try {
    await connectDB();
    console.log('🔗 Connected to DB');



    // 2. Seed Watch Products
    console.log('⌚ Seed Watch Products...');
    // Optional: Clear existing products if you want a clean slate, otherwise append
    // await WatchProduct.deleteMany({}); 

    const productsToInsert = sampleProducts.map(item => {
      const { attributes, ...rest } = item;
      return {
        ...rest,
        ...attributes,
        // Ensure unique slug if running multiple times without clearing
        metaSlug: slugify(item.productTitle, { lower: true }) + '-' + Math.floor(Math.random() * 10000)
      };
    });

    // Check availability or upsert based on title if needed, but insertMany is faster for seeding
    // Use generic insert for now as duplicates might be okay for testing, or use loop to check.
    // Given the random slug, insertMany won't crash on unique slug error.
    await WatchProduct.insertMany(productsToInsert);

    console.log('✅ Data Imported Successfully');
    process.exit();
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
