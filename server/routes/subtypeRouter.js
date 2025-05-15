const Router = require('express');
const router = new Router();
const subTypeController = require('../controllers/subTypeController');
const checkRole = require('../middleware/checkRoleMiddleware');
router.post('/', checkRole('ADMIN'), subTypeController.create);
router.get('/', subTypeController.getAll);
router.get('/by-type/:typeId', subTypeController.getByType);
router.delete('/:id', checkRole('ADMIN'), subTypeController.delete);

module.exports = router;
