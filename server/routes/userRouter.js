const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
router.post('/registration', [
    check('email', "Email не может быть пустым").notEmpty(),
    check('email', 'Некорректный email').isEmail(),
    check('password', "Пароль не может быть пустым").notEmpty(),
    check('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6 })
], userController.registration)
router.post('/login', userController.login)
router.get('/auth', authMiddleware, userController.check)


module.exports = router