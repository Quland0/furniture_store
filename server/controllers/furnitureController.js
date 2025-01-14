const uuid = require('uuid')
const path = require('path')
const {Furniture} = require('../models/models')
const ApiError = require('../error/ApiError')
class FurnitureController {
    async create(req, res, next){
        try {
            const {name, price, typeId, manufacturerId, info} = req.body
            const {img} = req.files
            let fileName = uuid.v4() + ".jpg"
            img.mv(path.resolve(__dirname, '..', 'static', fileName));

            const furinture = await Furniture.create({name, price, typeId, manufacturerId, img: fileName})

            return res.json(furinture)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req,res){

    }

    async getOne(req,res){

    }
    async delete(req, res){

    }

}

module.exports = new FurnitureController()