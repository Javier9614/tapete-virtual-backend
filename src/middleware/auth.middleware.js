const { verifyAccess } = require('../helpers/jwt.helper')

module.exports = (req, res, next) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'No autorizado' })

  try {
    const payload = verifyAccess(header.split(' ')[1])
    req.userId = payload.userId
    next()
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' })
  }
}