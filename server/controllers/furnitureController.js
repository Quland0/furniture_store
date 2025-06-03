const uuid = require('uuid');
const path = require('path');
const {
    Furniture,
    FurnitureInfo,
    Manufacturer,
    FurnitureImg,
    Type,
    SubType,
    Rating,
} = require('../models/models');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');

class FurnitureController {
    async create(req, res, next) {
        try {
            let {
                name,
                price,
                typeId,
                subTypeId,
                manufacturerId,
                isNew,
                info
            } = req.body;
            const images = req.files?.images;

            const payload = {
                name,
                price: parseInt(price, 10),
                new: isNew === 'true',
                hidden: false
            };
            if (manufacturerId) payload.manufacturerId = parseInt(manufacturerId, 10);
            if (subTypeId) payload.subTypeId = parseInt(subTypeId, 10);

            const furniture = await Furniture.create(payload);

            if (typeId) {
                await furniture.addType(parseInt(typeId, 10));
            }

            const files = images ? (Array.isArray(images) ? images : [images]) : [];
            for (let i = 0; i < files.length; i++) {
                const fileName = uuid.v4() + ".jpg";
                await files[i].mv(path.resolve(__dirname, '..', 'static', fileName));
                await FurnitureImg.create({
                    furnitureId: furniture.id,
                    img: fileName,
                    order: i
                });
            }

            if (info) {
                const parsedInfo = JSON.parse(info);
                for (const i of parsedInfo) {
                    await FurnitureInfo.create({
                        title: i.title,
                        description: i.description,
                        furnitureId: furniture.id
                    });
                }
            }

            return res.json(furniture);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async update(req, res, next) {
        try {
            const { id } = req.params;
            let {
                name,
                price,
                typeId,
                subTypeId,
                manufacturerId,
                isNew,
                hidden,
                info,
                existingImages
            } = req.body;

            existingImages = JSON.parse(existingImages || '[]');

            const payload = { name };
            if (price) payload.price = parseInt(price, 10);
            payload.new = isNew === 'true';
            payload.hidden = hidden === 'true';
            if (manufacturerId) payload.manufacturerId = parseInt(manufacturerId, 10);
            if (subTypeId) payload.subTypeId = parseInt(subTypeId, 10);

            await Furniture.update(payload, { where: { id } });

            const furniture = await Furniture.findByPk(id);
            if (typeId) {
                await furniture.setTypes([parseInt(typeId, 10)]);
            } else {
                await furniture.setTypes([]);
            }

            const allImgs = await FurnitureImg.findAll({ where: { furnitureId: id } });
            for (const img of allImgs) {
                if (!existingImages.find(e => e.id === img.id)) {
                    await img.destroy();
                }
            }

            for (const { id: imgId, order } of existingImages) {
                await FurnitureImg.update({ order }, { where: { id: imgId } });
            }

            if (req.files?.images) {
                const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
                for (let i = 0; i < files.length; i++) {
                    const fileName = uuid.v4() + ".jpg";
                    await files[i].mv(path.resolve(__dirname, '..', 'static', fileName));
                    await FurnitureImg.create({
                        furnitureId: id,
                        img: fileName,
                        order: existingImages.length + i
                    });
                }
            }

            await FurnitureInfo.destroy({ where: { furnitureId: id } });
            if (info) {
                const parsed = JSON.parse(info);
                for (const i of parsed) {
                    await FurnitureInfo.create({
                        title: i.title,
                        description: i.description,
                        furnitureId: id
                    });
                }
            }

            const updated = await Furniture.findOne({
                where: { id },
                include: [
                    {
                        model: FurnitureImg,
                        as: 'images',
                        separate: true,
                        order: [['order', 'ASC']]
                    },
                    { model: FurnitureInfo, as: 'info' },
                    { model: Type, through: {}, attributes: ['id', 'name'] },
                    { model: SubType, as: 'subtype' }
                ]
            });

            return res.json(updated);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            console.log('📦 getAll called');
            const { manufacturerId, typeId, limit, page, includeHidden } = req.query;

            const where = {};
            if (!includeHidden || includeHidden !== 'true') {
                where.hidden = false;
            }
            if (manufacturerId) where.manufacturerId = manufacturerId;

            const include = [
                {
                    model: FurnitureImg,
                    as: 'images',
                    separate: true,
                    order: [['order', 'ASC']]
                },
                {
                    model: Type,
                    through: {},
                    attributes: ['id', 'name'],
                    ...(typeId && {
                        where: { id: parseInt(typeId) },
                        required: true
                    })
                },
                {
                    model: SubType,
                    as: 'subtype'
                },
                {
                    model: Manufacturer
                }
            ];

            const attributes = [
                'id', 'name', 'price', 'rating', 'reviewsCount',
                'new', 'manufacturerId', 'hidden', 'createdAt', 'updatedAt'
            ];

            if (!limit) {
                const rows = await Furniture.findAll({
                    where,
                    include,
                    attributes,
                    order: [['id', 'ASC']]
                });
                return res.json({ count: rows.length, rows });
            }

            const pageNum = parseInt(page) || 1;
            const perPage = parseInt(limit) || 9;
            const offset = (pageNum - 1) * perPage;

            const result = await Furniture.findAndCountAll({
                where,
                include,
                attributes,
                limit: perPage,
                offset,
                order: [['id', 'ASC']]
            });

            return res.json(result);
        } catch (e) {
            next(e);
        }
    }

    async getOne(req, res) {
        const { id } = req.params;
        const furniture = await Furniture.findOne({
            where: { id },
            include: [
                { model: FurnitureInfo, as: 'info' },
                {
                    model: FurnitureImg,
                    as: 'images',
                    separate: true,
                    order: [['order', 'ASC']]
                },
                { model: Type, through: {}, attributes: ['id', 'name'] },
                { model: SubType, as: 'subtype' },
                { model: Manufacturer, attributes: ['name']},
                {
                    model: Rating,
                    as: 'reviews',
                    attributes: ['id','rate','review','name','userId'],
                    order: [['createdAt','DESC']]
                }
            ]
        });

        if (!furniture) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        const authHeader = req.headers.authorization;
        const isAdmin = authHeader?.startsWith('Bearer ');

        if (furniture.hidden && !isAdmin) {
            return res.status(404).json({ message: "Товар не найден" });
        }

        return res.json(furniture);
    }

    async delete(req, res) {
        const { id } = req.params;
        const deleted = await Furniture.destroy({ where: { id } });
        return deleted ? res.status(204).send() : res.status(404).json({ message: "Мебель не найдена" });
    }

    async search(req, res) {
        const query = req.query.q || '';
        try {
            const results = await Furniture.findAll({
                where: {
                    name: {
                        [Op.iLike]: `%${query}%`
                    },
                    hidden: false
                },
                include: [
                    {
                        model: FurnitureImg,
                        as: 'images',
                        separate: true,
                        order: [['order', 'ASC']]
                    },
                    {
                        model: Type,
                        through: {},
                        attributes: ['id', 'name']
                    },
                    {
                        model: SubType,
                        as: 'subtype'
                    },
                    {
                        model: Manufacturer
                    }
                ],
                attributes: [
                    'id', 'name', 'price', 'rating', 'reviewsCount',
                    'new', 'manufacturerId', 'hidden', 'createdAt', 'updatedAt'
                ]
            });

            res.json(results);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Ошибка при поиске мебели' });
        }
    }
}

module.exports = new FurnitureController();
