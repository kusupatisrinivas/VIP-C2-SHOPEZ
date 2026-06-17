const router = require('express').Router()
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require('../controller/cartController')
const { protect } = require('../middleware/authMiddleware')

router.use(protect)

router.get('/',        getCart)
router.post('/',       addToCart)
router.put('/:id',     updateCartItem)
router.delete('/',     clearCart)
router.delete('/:id',  removeFromCart)

module.exports = router
