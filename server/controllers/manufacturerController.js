const {Type, Manufacturer} = require("../models/models");
const ApiError = require("../error/ApiError");

class ManufacturerController {
    async create(req,res){
            const { name } = req.body
            const manufacturer = await Manufacturer.create({name})
            return res.json(manufacturer);
    }

    async getAll(req,res){
        const manufacturers = await Manufacturer.findAll()
        return res.json(manufacturers)
    }

    async delete(req, res) {
        const { id } = req.params;
        const deleted = await Manufacturer.destroy({ where: { id } });

        if (deleted) {
            return res.status(204).send();
        } else {
            return res.status(404).json({ message: "Производитель не найден" });
        }
    }
}

module.exports = new ManufacturerController()