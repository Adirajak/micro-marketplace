const User = require('../models/User');
const Product = require('../models/Product');

// @route GET /favorites
exports.getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.status(200).json({ success: true, data: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @route POST /favorites/:productId
exports.addFavorite = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    if (user.favorites.includes(req.params.productId)) {
      return res.status(400).json({ success: false, message: 'Product already in favorites' });
    }

    user.favorites.push(req.params.productId);
    await user.save();

    res.status(200).json({ success: true, message: 'Added to favorites', data: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @route DELETE /favorites/:productId
exports.removeFavorite = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== req.params.productId
    );
    await user.save();

    res.status(200).json({ success: true, message: 'Removed from favorites', data: user.favorites });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};