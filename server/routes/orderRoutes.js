const router = require('express').Router()
const {
  getMyOrders, placeOrder, cancelOrder, getAllOrders, updateOrderStatus
} = require('../controller/orderController')
const { protect, adminOnly } = require('../middleware/authMiddleware')

router.use(protect)

router.get('/',              getMyOrders)
router.post('/',             placeOrder)
router.put('/:id/cancel',    cancelOrder)

router.get('/all',           adminOnly, getAllOrders)
router.put('/:id/status',    adminOnly, updateOrderStatus)

module.exports = router
