const { SubType } = require('../models/models');

class SubTypeController {
    async create(req, res, next) {
        try {
            const { name, typeId } = req.body;

            if (!typeId) {
                return res.status(400).json({ message: 'Не указан typeId' });
            }
            const subtype = await SubType.create({ name, typeId });

            return res.json(subtype);
        } catch (e) {
            next(e);
        }
    }
    async getAll(req, res) {
        const subtypes = await SubType.findAll();
        return res.json(subtypes);
    }

    async getByType(req, res) {
        const { typeId } = req.params;
        const subtypes = await SubType.findAll({ where: { typeId } });
        return res.json(subtypes);
    }
    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const count = await SubType.destroy({ where: { id } });
            if (count === 0) {
                return res.status(404).json({ message: 'Подкатегория не найдена' });
            }
            return res.json({ message: 'Подкатегория удалена' });
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new SubTypeController();
