const Router = require('express')
const basketController = require('../controllers/basketController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()


router.get('/', authMiddleware, basketController.getBasket)
router.post('/add', authMiddleware, basketController.addToBasket)
router.post('/remove', authMiddleware, basketController.removeFromBasket)
router.patch('/update',    authMiddleware, basketController.updateQuantity);

module.exports = router