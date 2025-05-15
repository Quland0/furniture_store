const Router = require('express');
const formController = require('../controllers/formController');
const router = new Router();

router.get('/questions', formController.getQuestions);
router.delete('/questions/:id', formController.deleteQuestion);
router.post('/questions', formController.createQuestion);

router.get('/measurer-requests', formController.getMeasurerRequests);
router.delete('/measurer-requests/:id', formController.deleteMeasurerRequest);
router.post('/measurer-requests', formController.createMeasurerRequest);
module.exports = router;
