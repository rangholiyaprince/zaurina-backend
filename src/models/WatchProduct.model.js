const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  url: String,
  public_id: String,
  type: { type: String, enum: ["image", "video"] }
});

const watchProductSchema = new mongoose.Schema(
  {
    productTitle: { type: String, required: true },
    productDescription: String,
    metaSlug: { type: String, unique: true },

    swiss_price: { type: Number, required: true },
    swiss_discountPrice: Number,

    quartz_price: Number,
    quartz_discountPrice: Number,

    categories: [String],
    variants: [String],

    media: [mediaSchema],

    bandColor: String,
    caseColor: String,
    watchMaterial: String,
    ageGroup: String,
    watchDisplay: String,
    watchType: String,
    brand: String,
    watchModel: String,
    caseShape: String,
    strapType: String,
    strapColor: String,
    watchStrap: String,

    dialColor: String,
    dialStyle: String,
    bezelType: String,
    caseSize: String,
    caseMaterial: String,
    caseBack: String,
    caseWaterResistance: String,

    gemType: String,
    gemSetting: String,
    gemPolish: String,
    gemCut: String,
    gemClarity: String,
    gemColor: String,

    watchFunctionality: String,
    watchMovement: String,
    watchWeight: String,

    hands: String,
    crown: String,
    watchClaps: String,

    metaTitle: String,
    metaDescription: String,

    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    },
    stock: {
      type: String,
      enum: ['instock', 'outstock'],
      default: 'instock'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("WatchProduct", watchProductSchema);
