const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json())

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/decks', require('./routes/deck.routes'))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

module.exports = app