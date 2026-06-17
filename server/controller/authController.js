const jwt = require('jsonwebtoken')
const User = require('../model/User')

const signToken = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  )

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password)
      return res.status(400).json({ message: 'All fields are required' })

    if (await User.findOne({ email }))
      return res.status(400).json({ message: 'Email already registered' })

    const user = await User.create({ username, email, password })
    const token = signToken(user._id)

    res.status(201).json({
      token,
      user: { _id: user._id, username: user.username, email: user.email, usertype: user.usertype }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' })

    const user = await User.findOne({ email })
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' })

    const token = signToken(user._id)

    res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email, usertype: user.usertype }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    user: { _id: req.user._id, username: req.user.username, email: req.user.email, usertype: req.user.usertype }
  })
}

module.exports = { register, login, getMe }
