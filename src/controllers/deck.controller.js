const Deck = require('../models/Deck.model')

const parseRawList = (rawList) => {
  return rawList.split('\n')
    .map(l => l.trim())
    .filter(l => l && !l.startsWith('//') && !l.startsWith('#'))
    .map(l => {
      const match = l.match(/^(\d+)x?\s+(.+)$/)
      return match ? { qty: parseInt(match[1]), name: match[2].trim() } : null
    })
    .filter(Boolean)
}

exports.getDecks = async (req, res) => {
  try {
    const decks = await Deck.find({ userId: req.userId }).select('-cards').sort('-createdAt')
    res.json(decks)
  } catch {
    res.status(500).json({ error: 'Error del servidor' })
  }
}

exports.getDeck = async (req, res) => {
  try {
    const deck = await Deck.findOne({ _id: req.params.id, userId: req.userId })
    if (!deck) return res.status(404).json({ error: 'Mazo no encontrado' })
    res.json(deck)
  } catch {
    res.status(500).json({ error: 'Error del servidor' })
  }
}

exports.createDeck = async (req, res) => {
  try {
    const { name, format, commander, rawList } = req.body
    if (!name || !rawList) return res.status(400).json({ error: 'Faltan campos obligatorios' })

    const cards = parseRawList(rawList)
    const deck = await Deck.create({ userId: req.userId, name, format, commander, cards, rawList })
    res.status(201).json(deck)
  } catch {
    res.status(500).json({ error: 'Error del servidor' })
  }
}

exports.updateDeck = async (req, res) => {
  try {
    const { name, format, commander, rawList } = req.body
    const update = { name, format, commander }
    if (rawList) { update.rawList = rawList; update.cards = parseRawList(rawList) }

    const deck = await Deck.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      update,
      { new: true }
    )
    if (!deck) return res.status(404).json({ error: 'Mazo no encontrado' })
    res.json(deck)
  } catch {
    res.status(500).json({ error: 'Error del servidor' })
  }
}

exports.deleteDeck = async (req, res) => {
  try {
    const deck = await Deck.findOneAndDelete({ _id: req.params.id, userId: req.userId })
    if (!deck) return res.status(404).json({ error: 'Mazo no encontrado' })
    res.json({ message: 'Mazo eliminado' })
  } catch {
    res.status(500).json({ error: 'Error del servidor' })
  }
}