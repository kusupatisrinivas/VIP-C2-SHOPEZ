const Product = require('../model/Product')

// GET /api/products
const getAllProducts = async (req, res) => {
  try {
    const { category, gender, search, minPrice, maxPrice } = req.query
    const query = { isActive: true }

    if (category) {
      if (category === 'Clothing') {
        query.category = { $in: ['T-Shirts', 'Jackets', 'Dresses', 'Activewear', 'Hoodies'] }
      } else {
        query.category = category
      }
    }
    if (gender)   query.gender = gender
    if (search)   query.title = { $regex: search, $options: 'i' }
    if (minPrice || maxPrice) {
      query.price = {}
      if (minPrice) query.price.$gte = Number(minPrice)
      if (maxPrice) query.price.$lte = Number(maxPrice)
    }

    const products = await Product.find(query).sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/products/:id
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/products  [admin]
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// PUT /api/products/:id  [admin]
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json(product)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// DELETE /api/products/:id  [admin]
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!product) return res.status(404).json({ message: 'Product not found' })
    res.json({ message: 'Product removed' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getAllProducts, getProduct, createProduct, updateProduct, deleteProduct }
