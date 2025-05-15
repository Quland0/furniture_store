const Router = require('express');
const ratingController = require('../controllers/ratingController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRating } = require('../middleware/ratingValidators');
const router = new Router();

router.get('/', ratingController.getRatings);
router.get('/furniture/:furnitureId', ratingController.getRatings);
router.post('/add', authMiddleware, validateRating, ratingController.addRating);
router.get('/average/:furnitureId', ratingController.getAverageRating);


module.exports = router;
