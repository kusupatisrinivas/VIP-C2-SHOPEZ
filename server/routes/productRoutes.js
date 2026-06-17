const router = require('express').Router()
const {
  getAllProducts, getProduct, createProduct, updateProduct, deleteProduct
} = require('../controller/productController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.get('/',     getAllProducts)
router.get('/:id',  getProduct)

router.post('/',        protect, adminOnly, createProduct)
router.put('/:id',      protect, adminOnly, updateProduct)
router.delete('/:id',   protect, adminOnly, deleteProduct)

module.exports = router
