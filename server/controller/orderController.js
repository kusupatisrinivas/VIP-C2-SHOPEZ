const Order = require('../model/Order')
const Cart = require('../model/Cart')

// GET /api/orders  (user's own orders)
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/orders
const placeOrder = async (req, res) => {
  try {
    const {
      name, mobile, email, address, pincode,
      title, description, image, size, quantity,
      price, discount, paymentMethod, productId
    } = req.body

    if (!name || !mobile || !address || !pincode || !title || !quantity || !price)
      return res.status(400).json({ message: 'Required fields missing' })

    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + 5)

    const order = await Order.create({
      userId: req.user._id,
      name, mobile, email, address, pincode,
      title, description, image, size,
      quantity, price, discount,
      paymentMethod: paymentMethod || 'cod',
      deliveryDate
    })

    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/orders/:id/cancel
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user._id })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    if (order.status !== 'pending')
      return res.status(400).json({ message: `Cannot cancel order with status: ${order.status}` })

    order.status = 'cancelled'
    await order.save()
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/orders/all  [admin]
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'username email').sort({ createdAt: -1 })
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// PUT /api/orders/:id/status  [admin]
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
    if (!order) return res.status(404).json({ message: 'Order not found' })
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getMyOrders, placeOrder, cancelOrder, getAllOrders, updateOrderStatus }
