const { Basket, BasketFurniture, Furniture } = require('../models/models');

class BasketController {
    async addToBasket(req, res) {
        try {
            const { userId }    = req.user;
            const { furnitureId, quantity = 1 } = req.body;

            const basket = await Basket.findOne({ where: { userId } });
            if (!basket) {
                return res.status(400).json({ message: 'Корзина не найдена' });
            }

            let basketItem = await BasketFurniture.findOne({
                where: { basketId: basket.id, furnitureId }
            });

            if (basketItem) {
                basketItem.quantity += parseInt(quantity, 10);
                await basketItem.save();
            } else {
                basketItem = await BasketFurniture.create({
                    basketId:    basket.id,
                    furnitureId,
                    quantity:    parseInt(quantity, 10)
                });
            }

            return res.json(basketItem);
        } catch (e) {
            console.error('Add to Basket Error:', e);
            return res.status(400).json({ message: 'Ошибка добавления в корзину' });
        }
    }

    async getBasket(req, res) {
        const { userId } = req.user;
        const basket = await Basket.findOne({
            where: { userId },
            include: [
                {
                    model: BasketFurniture,
                    include: [
                        {
                            model: Furniture,
                            include: [
                                {
                                    model: FurnitureImg,
                                    as: 'images',
                                    separate: true,
                                    order: [['order', 'ASC']]
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        return res.json(basket);
    }

    async removeFromBasket(req, res) {
        try {
            const { basketFurnitureId } = req.body;
            const deleted = await BasketFurniture.destroy({
                where: { id: basketFurnitureId }
            });
            if (!deleted) {
                return res.status(400).json({ message: 'Товар не найден в корзине' });
            }
            return res.json({ message: 'Товар удалён из корзины' });
        } catch (e) {
            console.error('Remove from Basket Error:', e);
            return res.status(400).json({ message: 'Ошибка удаления из корзины' });
        }
    }

    async updateQuantity(req, res) {
        try {
            const { basketFurnitureId, quantity } = req.body;
            const basketItem = await BasketFurniture.findByPk(basketFurnitureId);
            if (!basketItem) {
                return res.status(400).json({ message: 'Элемент не найден' });
            }
            basketItem.quantity = parseInt(quantity, 10);
            await basketItem.save();
            return res.json(basketItem);
        } catch (e) {
            console.error('Update Quantity Error:', e);
            return res.status(400).json({ message: 'Ошибка обновления количества' });
        }
    }
}

module.exports = new BasketController();
