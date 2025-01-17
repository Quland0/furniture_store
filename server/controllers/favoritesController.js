const { Favorites, Furniture } = require('../models/models')

class FavoritesController {
    async addToFavorites(req, res) {
        try {
            const { userId } = req.user
            const { furnitureId } = req.body

            const favoriteExists = await Favorites.findOne({
                where: { userId, furnitureId }
            })

            if (favoriteExists) {
                return res.status(400).json({ message: 'Этот товар уже в избранном' })
            }

            const favorite = await Favorites.create({ userId, furnitureId })
            return res.json(favorite)
        } catch (e) {
            console.error(e)
            return res.status(400).json({ message: 'Ошибка добавления в избранное' })
        }
    }

    async getFavorites(req, res) {
        try {
            const { userId } = req.user
            const favorites = await Favorites.findAll({
                where: { userId },
                include: [{ model: Furniture }]
            })

            return res.json(favorites)
        } catch (e) {
            console.error(e)
            return res.status(400).json({ message: 'Ошибка получения избранного' })
        }
    }

    async removeFromFavorites(req, res) {
        try {
            const { userId } = req.user
            const { furnitureId } = req.body

            const favorite = await Favorites.destroy({
                where: { userId, furnitureId }
            })

            if (!favorite) {
                return res.status(400).json({ message: 'Товар не найден в избранном' })
            }

            return res.json({ message: 'Товар удален из избранного' })
        } catch (e) {
            console.error(e)
            return res.status(400).json({ message: 'Ошибка удаления из избранного' })
        }
    }
}

module.exports = new FavoritesController()
