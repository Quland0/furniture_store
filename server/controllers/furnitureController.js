const uuid = require('uuid')
const path = require('path')
const {Furniture, FurnitureInfo, Manufacturer} = require('../models/models')
const ApiError = require('../error/ApiError')
class FurnitureController {
    async create(req, res, next){
        try {
            let {name, price, typeId, manufacturerId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            if(info) {
                info = JSON.parse(info)
                info.forEach(
                    FurnitureInfo.create({
                        title: i.title,
                        description: i.description,
                        furnitureId: furinture.id
                    })
                )
            }

            const furinture = await Furniture.create({name, price, typeId, manufacturerId, img: fileName})

            return res.json(furinture)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req,res){
        let {manufacturerId, typeId, limit, page} = req.query
        page = page || 1
        limit = limit || 9
        let offset = page * limit - limit
        let furnitures;
        if(!manufacturerId && !typeId){
            furnitures = await Furniture.findAndCountAll({limit, offset})
        }
        if (manufacturerId && !typeId){
            furnitures = await Furniture.findAndCountAll({where: {manufacturerId, limit, offset}})
        }
        if (!manufacturerId && typeId){
            furnitures = await Furniture.findAndCountAll({where: {typeId, limit, offset}})
        }
        if (manufacturerId && typeId){
            furnitures = await Furniture.findAndCountAll({where: {manufacturerId, typeId, limit, offset}})
        }
        return res.json(furnitures)
    }

    async getOne(req,res) {
        const {id} = req.params
        const furniture = await Furniture.findOne(
            {
                where: {id},
                include: [{model: FurnitureInfo, as: 'info'}]
            }
        )
        return res.json(furniture)
    }

    async delete(req, res) {
        const { id } = req.params;
        const deleted = await Furniture.destroy({ where: { id } });

        if (deleted) {
            return res.status(204).send();
        } else {
            return res.status(404).json({ message: "Мебель не найдена" });
        }
    }

}

module.exports = new FurnitureController()