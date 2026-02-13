const WatchProduct = require("../models/WatchProduct.model");
const WatchDetail = require("../models/WatchDetails.model");
const cloudinary = require("../config/cloudinary");
const slugify = require("slugify");

/* CREATE */
exports.createProduct = async (req, res) => {
  try {
    const media = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
          folder: "watch-products",
        });

        media.push({
          url: result.secure_url,
          public_id: result.public_id,
          type: result.resource_type,
        });
      }
    } else if (req.body.media) {
      if (Array.isArray(req.body.media)) {
        req.body.media.forEach((item) => {
          if (item.data && Array.isArray(item.data) && item.data.length > 0) {
            media.push({
              url: item.data[0].url,
              public_id: item.data[0].public_id,
              type: item.data[0].type,
            });
          } else if (item.url && item.public_id) {
            media.push({
              url: item.url,
              public_id: item.public_id,
              type: item.type,
            });
          }
        });
      }
    }

    const product = await WatchProduct.create({
      ...req.body,
      metaSlug: slugify(req.body.productTitle, { lower: true }),
      media,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* LIST */
/* LIST */
exports.getProducts = async (req, res) => {
  try {
    const { status, stock, search } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    if (stock) {
      query.stock = stock;
    }

    if (search) {
      query.productTitle = { $regex: search, $options: 'i' };
    }

    const products = await WatchProduct.find(query).sort({ createdAt: -1 }).lean();

    const formattedProducts = products.map((product) => ({
      ...product,
      media: product.media.map((file) => {
        if (file.public_id) {
          return {
            ...file,
            url: cloudinary.url(file.public_id, {
              resource_type: file.type || "image",
              secure: true,
              fetch_format: "auto",
              quality: "auto",
            }),
          };
        }
        return file;
      }),
    }));

    res.json({ success: true, count: formattedProducts.length, data: formattedProducts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* UPDATE */
exports.updateProduct = async (req, res) => {
  try {
    const media = [];

    // Handle existing/passed media in body
    if (req.body.media) {
      if (Array.isArray(req.body.media)) {
        req.body.media.forEach((item) => {
          if (typeof item === 'string') {
            // Handle raw URL strings
            media.push({
              url: item,
              public_id: null,
              type: 'image'
            });
          } else if (item.data && Array.isArray(item.data) && item.data.length > 0) {
            // Handle nested API response structure
            media.push({
              url: item.data[0].url,
              public_id: item.data[0].public_id,
              type: item.data[0].type,
            });
          } else if (item.url) {
            // Handle direct object (with or without public_id/type)
            media.push({
              url: item.url,
              public_id: item.public_id || null,
              type: item.type || 'image',
            });
          }
        });
      }
    }

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "auto",
          folder: "watch-products",
        });

        media.push({
          url: result.secure_url,
          public_id: result.public_id,
          type: result.resource_type,
        });
      }
    }

    // Only update media if we processed something or if media was explicitly passed as empty
    if (media.length > 0 || (req.body.media && Array.isArray(req.body.media) && req.body.media.length === 0)) {
      req.body.media = media;
    }

    const product = await WatchProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* DELETE */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await WatchProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    if (product.media && product.media.length > 0) {
      for (const file of product.media) {
        if (file.public_id) {
          await cloudinary.uploader.destroy(file.public_id);
        }
      }
    }

    await product.deleteOne();
    res.json({ success: true, message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/* PUBLIC LIST (USER) */
exports.getPublicProducts = async (req, res) => {
  try {
    const { search, brand } = req.query;
    const query = { status: 'active' };

    if (search) {
      query.productTitle = { $regex: search, $options: 'i' };
    }

    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    const products = await WatchProduct.find(query)
      .select('productTitle variants quartz_price quartz_discountPrice media _id brand')
      .sort({ createdAt: -1 })
      .lean();

    const formattedProducts = products.map((product) => ({
      ...product,
      media: product.media.map((file) => {
        if (file.public_id) {
          return {
            ...file,
            url: cloudinary.url(file.public_id, {
              resource_type: file.type || "image",
              secure: true,
              fetch_format: "auto",
              quality: "auto",
            }),
          };
        }
        return file;
      }),
    }));

    res.json({ success: true, count: formattedProducts.length, data: formattedProducts });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
/* PUBLIC DETAIL (USER) */
exports.getPublicProductById = async (req, res) => {
  try {
    const product = await WatchProduct.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Handle Brand Name Lookup
    let brandName = product.brand;
    if (product.brand) {
      const brandDetail = await WatchDetail.findOne({
        type: 'WATCH_BRAND',
        value: product.brand
      });
      if (brandDetail) {
        brandName = brandDetail.name;
      }
    }

    const formattedProduct = {
      ...product,
      brand: brandName,
      media: product.media.map((file) => {
        if (file.public_id) {
          return {
            ...file,
            url: cloudinary.url(file.public_id, {
              resource_type: file.type || "image",
              secure: true,
              fetch_format: "auto",
              quality: "auto",
            }),
          };
        }
        return file;
      }),
    };

    res.json({ success: true, data: formattedProduct });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
