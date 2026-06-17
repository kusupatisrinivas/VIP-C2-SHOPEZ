const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  description: { type: String, required: true },
  mainImg:     { type: String, required: true },
  carousel:    [{ type: String }],
  category:    { type: String, required: true },
  sizes:       [{ type: String }],
  gender:      { type: String, enum: ['men', 'women', 'unisex', 'kids'], default: 'unisex' },
  price:       { type: Number, required: true },
  discount:    { type: Number, default: 0 },
  isActive:    { type: Boolean, default: true },
  rating:      { type: Number, default: () => Math.round((Math.random() * 1.5 + 3.5) * 10) / 10 }
}, { timestamps: true })

module.exports = mongoose.model('Product', productSchema)
