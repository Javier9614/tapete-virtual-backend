const bcrypt = require('bcryptjs')
const User = require('../models/User.model')
const { generateTokens, verifyRefresh } = require('../helpers/jwt.helper')

exports.register = async (req, res) => {
  try {
    const { email, password, nickname } = req.body
    if (!email || !password || !nickname)
      return res.status(400).json({ error: 'Faltan campos obligatorios' })

    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ error: 'Email ya registrado' })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ email, passwordHash, nickname })
    const tokens = generateTokens(user._id)

    res.status(201).json({ user: { id: user._id, email: user.email, nickname: user.nickname }, ...tokens })
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Credenciales incorrectas' })

    const tokens = generateTokens(user._id)
    res.json({ user: { id: user._id, email: user.email, nickname: user.nickname }, ...tokens })
  } catch (err) {
    res.status(500).json({ error: 'Error del servidor' })
  }
}

exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(400).json({ error: 'Falta refresh token' })

    const payload = verifyRefresh(refreshToken)
    const tokens = generateTokens(payload.userId)
    res.json(tokens)
  } catch {
    res.status(401).json({ error: 'Refresh token inválido' })
  }
}

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash')
    res.json(user)
  } catch {
    res.status(500).json({ error: 'Error del servidor' })
  }
}