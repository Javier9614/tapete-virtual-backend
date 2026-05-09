require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

const PORT = process.env.PORT || 3001

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado — magia el arrejuntamiento 🧙')
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`))
  })
  .catch(err => console.error('Error conectando MongoDB:', err))