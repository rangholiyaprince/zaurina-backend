const Cart = require('../models/Cart.model');
const WatchProduct = require('../models/WatchProduct.model');

/**
 * @desc    Save item to cart (Add or Update quantity)
 * @route   POST /api/cart/save
 * @access  Private
 */
const saveCart = async (req, res, next) => {
  try {
    const { product_id, variant_name, qty, price } = req.body;
    const userId = req.user._id;

    if (!product_id || !variant_name || !price) {
      return res.status(400).json({ success: false, message: 'Please provide product_id, variant_name, and price' });
    }

    let cart = await Cart.findOne({ user_id: userId });

    // Ensure product exists and get details (like title/image) for snapshot
    const product = await WatchProduct.findById(product_id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const productTitle = product.productTitle;
    const image = product.media && product.media.length > 0 ? product.media[0].url : null;

    if (cart) {
      // Cart exists for user
      const itemIndex = cart.items.findIndex(p =>
        p.product.toString() === product_id && p.variantName === variant_name
      );

      if (itemIndex > -1) {
        // Product exists in cart, update quantity or remove if qty <= 0
        if (qty <= 0) {
          cart.items.splice(itemIndex, 1);
        } else {
          // If the user sends just qty (e.g. +1 or explicit new qty), here we assume absolute qty is sent
          // If the requirement suggests incremental, user should use different logic, but standard is absolute for 'save'
          // However, user said "update qty other case mange your side". I'll assume `qty` is the target quantity.
          cart.items[itemIndex].qty = qty;
          cart.items[itemIndex].price = price; // Update price if changed (dynamic pricing support)
        }
      } else {
        // Product does not exist in cart, add new item
        if (qty > 0) {
          cart.items.push({
            product: product_id,
            variantName: variant_name,
            qty: qty,
            price: price,
            productTitle,
            image
          });
        }
      }
      cart = await cart.save();
    } else {
      // No cart for user, create new cart
      if (qty > 0) {
        cart = await Cart.create({
          user_id: userId,
          items: [{
            product: product_id,
            variantName: variant_name,
            qty: qty,
            price: price,
            productTitle,
            image
          }]
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Cart updated successfully',
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user_id: userId }).populate('items.product', 'productTitle productDescription metaSlug media stock');

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          items: [],
          count: 0,
          subTotal: 0,
          total: 0
        }
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: cart._id,
        items: cart.items,
        count: cart.count,
        subTotal: cart.subTotal,
        total: cart.totalPrice,
        updatedAt: cart.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/remove
 * @access  Private
 */
const removeCartItem = async (req, res, next) => {
  try {
    const { product_id, variant_name } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(p =>
      p.product.toString() === product_id && p.variantName === variant_name
    );

    if (itemIndex > -1) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return res.status(200).json({ success: true, message: 'Item removed from cart', data: cart });
    } else {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

  } catch (error) {
    next(error);
  }
};


/**
 * @desc    Update item quantity in cart
 * @route   PUT /api/user/cart/update-qty
 * @access  Private
 */
const updateCartQty = async (req, res, next) => {
  try {
    const { product_id, variant_name, qty } = req.body;
    const userId = req.user._id;

    if (!product_id || !variant_name || qty === undefined) {
      return res.status(400).json({ success: false, message: 'Please provide product_id, variant_name, and qty' });
    }

    let cart = await Cart.findOne({ user_id: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(p =>
      p.product.toString() === product_id && p.variantName === variant_name
    );

    if (itemIndex > -1) {
      if (qty <= 0) {
        // If qty is 0 or less, remove the item
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].qty = qty;
      }

      await cart.save();

      return res.status(200).json({
        success: true,
        message: 'Cart quantity updated successfully',
        data: cart
      });
    } else {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

  } catch (error) {
    next(error);
  }
};

module.exports = {
  saveCart,
  getCart,
  removeCartItem,
  updateCartQty
};
