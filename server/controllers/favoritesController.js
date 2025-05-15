const { Favorites, FavoritesFurniture, Furniture } = require('../models/models');
const ApiError = require('../error/ApiError');

class FavoritesController {
    async addToFavorites(req, res, next) {
        try {
            const userId = req.user.id;
            const { furnitureId } = req.body;

            let fav = await Favorites.findOne({ where: { userId } });
            if (!fav) {
                fav = await Favorites.create({ userId });
            }

            const exists = await FavoritesFurniture.findOne({
                where: { favoritesId: fav.id, furnitureId }
            });
            if (exists) {
                return res.status(400).json({ message: 'Уже в избранном' });
            }

            await FavoritesFurniture.create({
                favoritesId: fav.id,
                furnitureId
            });

            return res.json({ message: 'Добавлено в избранное' });
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Ошибка добавления в избранное'));
        }
    }

    async getFavorites(req, res, next) {
        try {
            const userId = req.user.id;
            const fav = await Favorites.findOne({ where: { userId } });
            if (!fav) return res.json([]);

            const items = await FavoritesFurniture.findAll({
                where: { favoritesId: fav.id },
                include: [{ model: Furniture }]
            });
            const products = items.map(i => i.furniture);
            return res.json(products);
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Ошибка получения избранного'));
        }
    }

    async removeFromFavorites(req, res, next) {
        try {
            const userId = req.user.id;
            const { furnitureId } = req.body;
            const fav = await Favorites.findOne({ where: { userId } });
            if (!fav) return res.status(400).json({ message: 'Избранное не найдено' });

            const deleted = await FavoritesFurniture.destroy({
                where: { favoritesId: fav.id, furnitureId }
            });
            if (!deleted) {
                return res.status(400).json({ message: 'Товар не найден в избранном' });
            }

            return res.json({ message: 'Удалено из избранного' });
        } catch (e) {
            console.error(e);
            return next(ApiError.internal('Ошибка удаления из избранного'));
        }
    }
}

module.exports = new FavoritesController();
