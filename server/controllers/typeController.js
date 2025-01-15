const {Type, Manufacturer} = require('../models/models');
const ApiError = require('../error/ApiError');

class TypeController {
    async create(req,res){
        const { name } = req.body
        const type = await Type.create({name})
        return res.json(type);
    }

    async getAll(req,res){
        const types = await Type.findAll()
        return res.json(types)
    }

    async delete(req, res) {
        const { id } = req.params;
        const deleted = await Type.destroy({ where: { id } });

        if (deleted) {
            return res.status(204).send();
        } else {
            return res.status(404).json({ message: "Тип не найден" });
        }
    }
}

module.exports = new TypeController()