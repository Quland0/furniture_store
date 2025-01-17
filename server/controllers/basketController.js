const { Basket, BasketFurniture, Furniture } = require('../models/models')

class BasketController {
    async addToBasket(req, res) {
        try {
            const { userId } = req.user
            const { furnitureId } = req.body

            const basket = await Basket.findOne({ where: { userId } })
            if (!basket) {
                return res.status(400).json({ message: 'Корзина не найдена' })
            }

            const basketItem = await BasketFurniture.create({
                basketId: basket.id,
                furnitureId
            })

            return res.json(basketItem)
        } catch (e) {
            console.error(e)
            return res.status(400).json({ message: 'Ошибка добавления в корзину' })
        }
    }

    async getBasket(req, res) {
        try {
            const { userId } = req.user
            const basket = await Basket.findOne({
                where: { userId },
                include: [{ model: BasketFurniture, include: [Furniture] }]
            })

            return res.json(basket)
        } catch (e) {
            console.error(e)
            return res.status(400).json({ message: 'Ошибка получения корзины' })
        }
    }

    async removeFromBasket(req, res) {
        try {
            const { basketFurnitureId } = req.body
            const basketItem = await BasketFurniture.destroy({ where: { id: basketFurnitureId } })

            if (!basketItem) {
                return res.status(400).json({ message: 'Товар не найден в корзине' })
            }

            return res.json({ message: 'Товар удален из корзины' })
        } catch (e) {
            console.error(e)
            return res.status(400).json({ message: 'Ошибка удаления из корзины' })
        }
    }
}

module.exports = new BasketController()
