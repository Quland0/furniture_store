const Router = require('express')
const favoritesController = require('../controllers/favoritesController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.get('/', authMiddleware, favoritesController.getFavorites)
router.post('/add', authMiddleware, favoritesController.addToFavorites)
router.post('/remove', authMiddleware, favoritesController.removeFromFavorites)

module.exports = router
