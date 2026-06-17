const mongoose = require('mongoose')
const User = require('./model/User')
require('dotenv').config()

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI)

  const exists = await User.findOne({ email: 'admin@shopez.com' })
  if (exists) {
    console.log('Admin already exists →  admin@shopez.com  /  admin123')
    process.exit(0)
  }

  await User.create({
    username: 'Admin',
    email: 'admin@shopez.com',
    password: 'admin123',
    usertype: 'admin'
  })

  console.log('✓ Admin created')
  console.log('  Email    : admin@shopez.com')
  console.log('  Password : admin123')
  process.exit(0)
}

run().catch(e => { console.error(e); process.exit(1) })
