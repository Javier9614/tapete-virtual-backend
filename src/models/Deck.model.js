const mongoose = require('mongoose')

const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty:  { type: Number, required: true, min: 1 },
}, { _id: false })

const deckSchema = new mongoose.Schema({
  userId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:       { type: String, required: true, trim: true },
  format:     { type: String, enum: ['commander', 'modern', 'standard', 'custom'], default: 'commander' },
  commander:  { type: String, default: null },
  cards:      [cardSchema],
  rawList:    { type: String },
}, { timestamps: true })

module.exports = mongoose.model('Deck', deckSchema)