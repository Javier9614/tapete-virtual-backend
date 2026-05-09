const router = require('express').Router()
const auth = require('../middleware/auth.middleware')
const { register, login, refresh, me } = require('../controllers/auth.controller')

router.post('/register', register)
router.post('/login',    login)
router.post('/refresh',  refresh)
router.get('/me',        auth, me)

module.exports = router