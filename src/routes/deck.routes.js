const router = require('express').Router()
const auth = require('../middleware/auth.middleware')
const { getDecks, getDeck, createDeck, updateDeck, deleteDeck } = require('../controllers/deck.controller')

router.use(auth)
router.get('/',        getDecks)
router.get('/:id',     getDeck)
router.post('/',       createDeck)
router.put('/:id',     updateDeck)
router.delete('/:id',  deleteDeck)

module.exports = router