const User = require('../model/User')
const Product = require('../model/Product')
const Order = require('../model/Order')
const Category = require('../model/Category')
const Banner = require('../model/Banner')

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [users, products, orders, categories] = await Promise.all([
      User.countDocuments({ usertype: 'user' }),
      Product.countDocuments({ isActive: true }),
      Order.countDocuments(),
      Category.countDocuments({ isActive: true })
    ])
    const revenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$quantity'] } } } }
    ])
    res.json({ users, products, orders, categories, revenue: revenue[0]?.total || 0 })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── Categories ──────────────────────────────────────────────
const getCategories = async (req, res) => {
  try {
    const cats = await Category.find().sort({ createdAt: -1 })
    res.json(cats)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createCategory = async (req, res) => {
  try {
    const cat = await Category.create(req.body)
    res.status(201).json(cat)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id)
    res.json({ message: 'Category deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── Banners ─────────────────────────────────────────────────
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 })
    res.json(banners)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const createBanner = async (req, res) => {
  try {
    const banner = await Banner.create(req.body)
    res.status(201).json(banner)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

const deleteBanner = async (req, res) => {
  try {
    await Banner.findByIdAndDelete(req.params.id)
    res.json({ message: 'Banner deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─── Users ───────────────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ usertype: 'user' }).select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getStats,
  getCategories, createCategory, deleteCategory,
  getBanners, createBanner, deleteBanner,
  getAllUsers
}
