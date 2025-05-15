const {Type, Manufacturer} = require("../models/models");
const ApiError = require("../error/ApiError");

class ManufacturerController {
    async create(req, res, next) {
        const { name } = req.body;
        if (!name) {
            return next(ApiError.badRequest('Название производителя обязательно'));
        }
        const manufacturer = await Manufacturer.create({ name });
        return res.json(manufacturer);
    }
    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!name) {
                return next(ApiError.badRequest('Новое имя обязательно'));
            }

            const manufacturer = await Manufacturer.findByPk(id);
            if (!manufacturer) {
                return res.status(404).json({ message: 'Производитель не найден' });
            }

            manufacturer.name = name;
            await manufacturer.save();

            return res.json(manufacturer);
        } catch (e) {
            next(e);
        }
    }

    async getAll(req,res){
        const manufacturers = await Manufacturer.findAll()
        return res.json(manufacturers)
    }

    async delete(req, res, next) {
        try {
            const { id } = req.params;
            const deleted = await Manufacturer.destroy({ where: { id } });

            if (deleted) {
                return res.status(204).send();
            } else {
                return res.status(404).json({ message: "Производитель не найден" });
            }
        } catch (e) {
            next(e);
        }
    }

}

module.exports = new ManufacturerController()