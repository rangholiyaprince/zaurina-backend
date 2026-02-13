const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Color = require('../models/Color.model');
const Material = require('../models/Material.model');
const CaseDetails = require('../models/CaseDetails.model');
const GemDetails = require('../models/GemDetails.model');
const WatchDetail = require('../models/WatchDetails.model');
const connectDB = require('../config/db');

console.log('Starting Seeder...');

dotenv.config();

const masterData = {
  colors: [
    // BAND and CASE colors
    { name: "Rose Gold", value: "#B76E79", types: ["BAND", "CASE", "DIAL"] },
    { name: "White", value: "#FFFFFF", types: ["BAND", "CASE", "DIAL"] },
    { name: "Yellow", value: "#FFFF00", types: ["BAND", "CASE", "DIAL"] },
    { name: "Black", value: "#000000", types: ["BAND", "CASE", "DIAL"] },
    { name: "Orange", value: "#FFA500", types: ["BAND", "CASE", "DIAL"] },
    { name: "Pink", value: "#FFC0CB", types: ["BAND", "CASE", "DIAL"] },
    { name: "Blue", value: "#0000FF", types: ["BAND", "CASE", "DIAL"] },
    { name: "Rose", value: "#FF007F", types: ["BAND", "CASE", "DIAL"] },
    { name: "Yellow Gold", value: "#D4AF37", types: ["BAND", "CASE", "DIAL"] },
    { name: "Gray", value: "#808080", types: ["BAND", "CASE", "DIAL"] },
    { name: "Brown", value: "#A52A2A", types: ["BAND", "CASE", "DIAL"] },
    { name: "Beige", value: "#F5F5DC", types: ["BAND", "CASE", "DIAL"] },
    { name: "Green", value: "#008000", types: ["BAND", "CASE", "DIAL"] },
    { name: "Silver", value: "#C0C0C0", types: ["BAND", "CASE", "DIAL"] },
    { name: "Navy", value: "#000080", types: ["BAND", "CASE", "DIAL"] },
    { name: "Red", value: "#FF0000", types: ["BAND", "CASE", "DIAL"] },
    { name: "Lavender", value: "#E6E6FA", types: ["BAND", "CASE", "DIAL"] },
    { name: "Mother of Pearl", value: "#F8F8FF", types: ["DIAL"] },

    // Dial Specific Colors
    { name: "Bright black", value: "#1A1A1A", types: ["DIAL"] },
    { name: "Bright White", value: "#F0F0F0", types: ["DIAL"] },
    { name: "Bright Blue", value: "#1E90FF", types: ["DIAL"] },
    { name: "Bright Yellow", value: "#FFFFE0", types: ["DIAL"] },
    { name: "Bright Rose", value: "#FF66CC", types: ["DIAL"] },
    { name: "Bright Green", value: "#00FF00", types: ["DIAL"] },
    { name: "Bright Brown", value: "#8B4513", types: ["DIAL"] },
    { name: "Bright Red", value: "#DC143C", types: ["DIAL"] },
    { name: "Bright Pink", value: "#FF1493", types: ["DIAL"] },
    { name: "Bright Purple", value: "#9932CC", types: ["DIAL"] },
    { name: "Lavender Bright", value: "#D8BFD8", types: ["DIAL"] },
    { name: "Chronograph", value: "#333333", types: ["DIAL"] },
    { name: "Circular Date Scale", value: "#444444", types: ["DIAL"] }
  ],
  materials: [
    // Type: CASE
    { name: "Silver", type: "CASE" },
    { name: "18K Yellow Gold & Silver", type: "CASE" },
    { name: "18K Rose Gold", type: "CASE" },
    { name: "Rose Silver", type: "CASE" },
    { name: "Yellow Silver", type: "CASE" },
    { name: "14 KT Gold", type: "CASE" },
    { name: "14K Gold Plating", type: "CASE" }
  ],
  caseDetails: [
    // Type: BACK
    { name: "Sapphire Crystal", type: "BACK" },
    { name: "Stainless Steel", type: "BACK" }
  ],
  gemDetails: [
    // GEM_TYPE
    { name: "Natural", type: "GEM_TYPE" },
    { name: "Moissanite", type: "GEM_TYPE" },
    { name: "Lab-Grown", type: "GEM_TYPE" },

    // GEM_POLISH
    { name: "Excellent", type: "GEM_POLISH" },
    { name: "Very Good", type: "GEM_POLISH" },

    // GEM_CUT
    { name: "Round Cut", type: "GEM_CUT" },
    { name: "Ideal", type: "GEM_CUT" },

    // GEM_CLARITY
    { name: "FL", type: "GEM_CLARITY" },
    { name: "VS1", type: "GEM_CLARITY" },
    { name: "IF", type: "GEM_CLARITY" },
    { name: "VVS1", type: "GEM_CLARITY" },
    { name: "VVS2", type: "GEM_CLARITY" },
    { name: "VS2", type: "GEM_CLARITY" },
    { name: "SI1", type: "GEM_CLARITY" },
    { name: "SI2", type: "GEM_CLARITY" },
    { name: "D-E / VVS", type: "GEM_CLARITY" },
    { name: "VS", type: "GEM_CLARITY" },
    { name: "E-F / VVS", type: "GEM_CLARITY" },
    { name: "VVS", type: "GEM_CLARITY" },

    // GEM_COLOR
    { name: "J", type: "GEM_COLOR" },
    { name: "I", type: "GEM_COLOR" },
    { name: "H", type: "GEM_COLOR" },
    { name: "G", type: "GEM_COLOR" },
    { name: "F", type: "GEM_COLOR" },
    { name: "E", type: "GEM_COLOR" },
    { name: "D", type: "GEM_COLOR" },
    { name: "D-E", type: "GEM_COLOR" },
    { name: "D-F", type: "GEM_COLOR" }
  ]
};

const watchDetailsData = {
  WATCH_MODEL: [
    "Submariner", "Daytona", "Datejust", "Day-Date", "Oyster Perpetual", "Santos", "Tank",
    "Royal Oak", "Nautilus", "Aquanaut", "RM series", "Jacob Five Time Zone", "Royal Oak Offshore",
    "Yacht-Master", "Sky-Dweller", "Tonneau", "RM 11-03 Chronograph", "Bugatti Chiron Style"
  ],
  WATCH_TYPE: [
    "Luxury Watch", "Diamond-Studded Watch", "Iced Out Watch", "Moissanite Watch", "Swiss Made Watch",
    "Quartz Watch", "Skeleton Watch", "Chronograph Watch", "Automatic Tourbillon Watch", "Two Tone Iced Out Watch"
  ],
  WATCH_DISPLAY: [
    "Analog", "Quartz Movement", "Swiss Movement", "Japan Made"
  ],
  WATCH_MOVEMENT: [
    "Mechanical", "Automatic", "Quartz", "Hybrid"
  ],
  WATCH_FUNCTIONALITY: [
    "Time Only", "Date Display", "Day-Date", "Chronograph", "Dual Time Zone", "World Timer", "Moonphase", "Skeleton Movement"
  ],
  WATCH_MATERIAL: [
    "Metal", "Stainless Steel", "Yellow Gold", "White Gold", "Rose Gold", "Two-Tone", "Platinum", "Titanium", "Rubber", "Leather"
  ],
  CASE_MATERIAL: [
    "Silver", "18K Yellow Gold & Silver", "18K Rose Gold", "Rose Silver", "Yellow Silver", "14 KT Gold", "14K Gold Plating"
  ],
  CASE_SHAPE: [
    "Round", "Square", "Oval", "Rectangle", "Custom Shapes", "Rounded Octagonal", "Tonneau"
  ],
  CASE_BACK: [
    "Sapphire Crystal", "Stainless Steel"
  ],
  STRAP_TYPE: [
    "Oyster Bracelet", "Jubilee Bracelet", "President Bracelet", "Rubber Strap", "Leather Strap", "Nato Strap",
    "Steel Bracelet", "Two-Tone Bracelet", "Iced-Out Bracelet", "Custom Color Strap"
  ],
  WATCH_STRAP: [
    "Oyster", "three-piece solid links", "Silver with Folding Strap", "18K Rose Gold With Folding Strap",
    "Rubber Strap", "18K Yellow Gold With Folding Strap", "Leather strap", "Yellow Silver with Folding Strap",
    "14 KT Gold With Folding Strap", "14K Gold Folding Strap", "14K Gold Plating With Folding Strap",
    "Folding Oysterclasp with Easylink 5 mm comfort extension link", "Silver with Folding Clasp",
    "18K Rose Gold With Folding Clasp", "18K Rose Gold with Folding diamond Clasp", "Silver Diamond with Folding Clasp",
    "Box Clasp", "14 KT Gold With Folding Clasp", "14K Gold With Folding Clasp", "14K Gold Plating With Folding Clasp"
  ],
  WATCH_CLASP: [
    "Folding Oysterclasp with Easylink 5 mm comfort extension link", "Silver with Folding Clasp",
    "18K Rose Gold With Folding Clasp", "18K Rose Gold with Folding diamond Clasp", "Silver Diamond with Folding Clasp",
    "Box Clasp", "14 KT Gold With Folding Clasp", "14K Gold With Folding Clasp", "14K Gold Plating With Folding Clasp"
  ],
  DIAL_STYLE: [
    "Roman Numerals", "Arabic Numerals", "Stick Markers", "Diamond Markers", "Skeleton Dial", "Sunburst Dial",
    "Textured Dial", "Pave Dial (Fully Iced Dial)", "Rainbow Arabic Numerals", "Rainbow Roman Numerals",
    "Standard Numerals", "Rainbow Stick Markers", "geometric", "Rainbow Diamond Markers"
  ],
  GEM_SETTING: [
    "Prong Set", "Channel Set", "Pave Set", "Invisible Set", "Baguette Setting"
  ],
  AGE_GROUP: [
    "Adults", "Universal", "All ages"
  ],
  WATCH_WEIGHT: [
    "Lightweight", "Medium", "Heavy"
  ],
  CROWN: [
    "14K Gold Plating", "14 KT Gold", "Yellow Silver", "Rose Silver", "18K Rose Gold", "18K Yellow Gold & Silver", "Silver"
  ],
  BEZEL_TYPE: [
    "Plain Bezel", "Fluted Bezel", "Diamond Bezel", "Colored Gemstone Bezel", "Rainbow Bezel", "Custom Designed Bezel"
  ]
};

const seedMasterData = async () => {
  try {
    await connectDB();
    console.log('Connected to DB. Seeding Master Data...');

    // 1. Seed Colors
    for (const colorDef of masterData.colors) {
      for (const type of colorDef.types) {
        // Check if exists
        const exists = await Color.findOne({ name: colorDef.name, type: type });
        if (!exists) {
          await Color.create({ name: colorDef.name, value: colorDef.value, type: type });
          console.log(`Created Color: ${colorDef.name} (${type})`);
        }
      }
    }

    // 2. Seed Materials
    for (const mat of masterData.materials) {
      const exists = await Material.findOne({ name: mat.name, type: mat.type });
      if (!exists) {
        await Material.create(mat);
        console.log(`Created Material: ${mat.name}`);
      }
    }

    // 3. Seed Case Details
    for (const cd of masterData.caseDetails) {
      const exists = await CaseDetails.findOne({ name: cd.name, type: cd.type });
      if (!exists) {
        await CaseDetails.create(cd);
        console.log(`Created CaseDetail: ${cd.name}`);
      }
    }

    // 4. Seed Gem Details
    for (const gd of masterData.gemDetails) {
      const exists = await GemDetails.findOne({ name: gd.name, type: gd.type });
      if (!exists) {
        await GemDetails.create(gd);
        console.log(`Created GemDetail: ${gd.name}`);
      }
    }

    // 5. Seed Watch Details
    for (const [type, values] of Object.entries(watchDetailsData)) {
      for (const value of values) {
        // Check if exists
        const exists = await WatchDetail.findOne({ name: value, type: type });
        if (!exists) {
          await WatchDetail.create({ name: value, value: value, type: type });
          console.log(`Created WatchDetail: ${value} (${type})`);
        }
      }
    }

    console.log('✅ Master Data Seeding Completed.');
    process.exit();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedMasterData();
