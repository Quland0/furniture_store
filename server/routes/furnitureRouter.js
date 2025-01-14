const Router = require('express')
const router = new Router()
const furnitureController = require('../controllers/furnitureController')

router.post('/', furnitureController.create)
router.get('/', furnitureController.getAll)
router.get('/:id', furnitureController.getOne)
router.delete('/:id', furnitureController.delete)

module.exports = router