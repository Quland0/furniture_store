const Router = require('express');
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRating } = require('../middleware/ratingValidators');
const router = new Router();

router.get('/', ratingController.getRatings);

router.get('/product/:productId', ratingController.getRatings);

router.post('/add', authMiddleware, validateRating, ratingController.addRating);

router.get('/average/:productId', ratingController.getAverageRating);

router.post('/moderate', authMiddleware, ratingController.moderateRating);

module.exports = router;
