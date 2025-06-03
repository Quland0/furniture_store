const Router = require('express')
const router = new Router()
const furnitureController = require('../controllers/furnitureController')

router.post('/', furnitureController.create)
router.get('/search', furnitureController.search);
router.get('/:id', furnitureController.getOne)
router.get('/', furnitureController.getAll)
router.put('/:id', furnitureController.update)
router.delete('/:id', furnitureController.delete)

module.exports = router