const Router = require('express')
const ratingController = require('../controllers/ratingController')
const authMiddleware = require('../middleware/authMiddleware')
const router = new Router()

router.get('/', ratingController.getRatings)
router.post('/add', authMiddleware, ratingController.addRating)

//admin
router.post('/moderate', authMiddleware, ratingController.moderateRating)

module.exports = router
