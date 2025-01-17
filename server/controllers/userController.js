const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Basket, Favorites } = require('../models/models');
const {validationResult} = require('express-validator');


const generateJwt = (id, email, role) => {
    return jwt.sign(
        { id, email, role },
        process.env.SECRET_KEY,
        { expiresIn: '1h' })
}
class UserController {
    async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const { email, password, role} = req.body;

            const candidate = await User.findOne({ where: { email } });
            if (candidate) {
                return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
            }

            const hashPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ email, role, password: hashPassword });

            await Basket.create({ userId: user.id });
            await Favorites.create({ userId: user.id });
            const token = generateJwt(user.id, user.email, user.role)


            return res.json({ token });
        } catch (e) {
            console.error(req.body, e);
            res.status(400).json({ message: 'Ошибка регистрации'});
        }
    }

    async login(req, res) {
        try {
            const { email, password, role } = req.body;
            const user = await User.findOne({where: {email}})
            if (!user) {
                return res.status(400).json({message: `Пользователь c почтой ${email} не найден`})
            }
            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Введен неверный пароль`})
            }
            const token = generateJwt(user.id, user.email, user.role)
            return res.json({ token })

        }catch (e) {
            console.log(e)
            res.status(400).json({message: 'Ошибка входа'})
        }
    }

    async check(req, res, next) {
        const token = generateJwt(req.user.id, req.user.email, req.user.role);
        return res.json({ token });
    }
}

module.exports = new UserController();
