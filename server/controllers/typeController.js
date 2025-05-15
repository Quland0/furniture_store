const path = require('path');
const uuid = require('uuid');
const { Type } = require('../models/models');
const {badRequest, notFound} = require("../error/ApiError");

class TypeController {
    async create(req, res) {
        try {
            const { name } = req.body;
            let fileName = null;

            if (req.files && req.files.icon) {
                const icon = req.files.icon;
                fileName = uuid.v4() + path.extname(icon.name);
                icon.mv(path.resolve(__dirname, '..', 'static', fileName));
            }

            const type = await Type.create({ name, icon: fileName });
            return res.json(type);
        } catch (e) {
            console.error(e);
            return res.status(500).json({ message: 'Ошибка при создании типа' });
        }
    }

    async getAll(req, res) {
        const types = await Type.findAll();
        return res.json(types);
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            const type = await Type.findByPk(id);
            if (!type) {
                return next(notFound('Категория не найдена'));
            }

            type.name = name;
            await type.save();

            return res.json(type);
        } catch (e) {
            next(badRequest(e.message));
        }
    }


    async delete(req, res) {
        const { id } = req.params;
        const deleted = await Type.destroy({ where: { id } });
        return res.json({ deleted });
    }

}

module.exports = new TypeController();
