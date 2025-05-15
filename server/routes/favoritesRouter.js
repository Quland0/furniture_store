const Router = require('express');
const router = new Router();
const favoritesController = require('../controllers/favoritesController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/',    authMiddleware, favoritesController.getFavorites);
router.post('/add',    authMiddleware, favoritesController.addToFavorites);
router.post('/remove', authMiddleware, favoritesController.removeFromFavorites);

module.exports = router;
