const Cart = require('../model/Cart')
const Product = require('../model/Product')

// GET /api/cart
const getCart = async (req, res) => {
  try {
    const items = await Cart.find({ userId: req.user._id })
    res.json(items)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/cart
const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body

    const product = await Product.findById(productId)
    if (!product) return res.status(404).json({ message: 'Product not found' })

    // if same product + same size already in cart → increase qty
    const existing = await Cart.findOne({ userId: req.user._id, productId, size })
    if (existing) {
      existing.quantity += quantity || 1
      await existing.save()
      return res.json(existing)
    }

    const item = await Cart.create({
      userId:      req.user._id,
      productId,
      title:       product.title,
      description: product.description,
      mainImg:     product.mainImg,
      size:        size || '',
      quantity:    quantity || 1,
      price:       product.price,
      discount:    product.discount
    })

    res.status(201).json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/cart/:id
const updateCartItem = async (req, res) => {
  try {
    const item = await Cart.findOne({ _id: req.params.id, userId: req.user._id })
    if (!item) return res.status(404).json({ message: 'Cart item not found' })

    const { quantity } = req.body
    if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' })

    item.quantity = quantity
    await item.save()
    res.json(item)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/cart/:id
const removeFromCart = async (req, res) => {
  try {
    const item = await Cart.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!item) return res.status(404).json({ message: 'Cart item not found' })
    res.json({ message: 'Item removed from cart' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    await Cart.deleteMany({ userId: req.user._id })
    res.json({ message: 'Cart cleared' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart }
