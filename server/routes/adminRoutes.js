const router = require('express').Router()
const {
  getStats,
  getCategories, createCategory, deleteCategory,
  getBanners, createBanner, deleteBanner,
  getAllUsers
} = require('../controller/adminController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.use(protect, adminOnly)

router.get('/stats', getStats)

router.get('/categories',       getCategories)
router.post('/categories',      createCategory)
router.delete('/categories/:id', deleteCategory)

router.get('/banners',          getBanners)
router.post('/banners',         createBanner)
router.delete('/banners/:id',   deleteBanner)

router.get('/users',            getAllUsers)

module.exports = router
