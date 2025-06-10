const Router = require('express');
const router = new Router();
const optionalAuthMiddleware = require('../middleware/optionalAuthMiddleware');
const orderController = require('../controllers/orderController');

router.get('/', orderController.getAll);
router.get('/user', optionalAuthMiddleware, orderController.getUserOrders);
router.post('/', optionalAuthMiddleware, orderController.create);
router.put('/:id/status', orderController.updateStatus);
module.exports = router;