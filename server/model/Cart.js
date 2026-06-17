const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  userId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:       { type: String, required: true },
  description: { type: String },
  mainImg:     { type: String },
  size:        { type: String },
  quantity:    { type: Number, default: 1, min: 1 },
  price:       { type: Number, required: true },
  discount:    { type: Number, default: 0 },
  productId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
}, { timestamps: true })

module.exports = mongoose.model('Cart', cartSchema)
