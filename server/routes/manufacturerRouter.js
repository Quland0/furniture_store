const Router = require('express')
const router = new Router()
const manufacturerController = require('../controllers/manufacturerController')

router.post('/', manufacturerController.create)
router.get('/', manufacturerController.getAll)
router.delete('/:id', manufacturerController.delete)

module.exports = router