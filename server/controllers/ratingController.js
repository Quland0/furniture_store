const { Rating, Furniture } = require('../models/models');
const { validationResult } = require('express-validator');
const { fn, col } = require('sequelize');

class RatingController {
    async addRating(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Ошибка валидации', errors: errors.array() });
            }

            const { furnitureId, rate, review, name } = req.body;

            // новый отзыв
            const rating = await Rating.create({ furnitureId, rate, review, name });

            // новое количество и средний рейтинг
            const stats = await Rating.findOne({
                where: { furnitureId },
                attributes: [
                    [fn('COUNT', col('id')), 'count'],
                    [fn('AVG',   col('rate')), 'avg']
                ],
                raw: true
            });

            const count = parseInt(stats.count, 10);
            const avg   = parseFloat(stats.avg).toFixed(1);

            // Обновление полей в Furniture
            await Furniture.update(
                { reviewsCount: count, rating: avg },
                { where: { id: furnitureId } }
            );

            return res.json({
                id:     rating.id,
                rate:   rating.rate,
                review: rating.review,
                name:   rating.name,
            });
        } catch (e) {
            console.log('Incoming rating body:', req.body);
            return res.status(500).json({ message: 'Ошибка добавления рейтинга' });
        }
    }

    async getRatings(req, res) {
        try {
            const { furnitureId } = req.params;

            if (!furnitureId) {
                return res.status(400).json({ message: 'Не указан ID мебели' });
            }

            const ratings = await Rating.findAll({
                where: { furnitureId },
                attributes: ['id', 'rate', 'review', 'name'],
            });

            return res.json(ratings);
        } catch (e) {
            console.error('Get Ratings Error:', e.message);
            return res.status(500).json({ message: 'Ошибка получения рейтингов' });
        }
    }

    async getAverageRating(req, res) {
        try {
            const { furnitureId } = req.params;

            const ratings = await Rating.findAll({ where: { furnitureId } });
            const average =
                ratings.reduce((sum, r) => sum + r.rate, 0) / ratings.length || 0;

            return res.json({ average: average.toFixed(1), count: ratings.length });
        } catch (e) {
            console.error('Get Average Rating Error:', e);
            return res.status(500).json({ message: 'Ошибка расчёта среднего рейтинга' });
        }
    }

    async getAllRatings(req, res) {
        try {
            const ratings = await Rating.findAll({
                include: [{ model: Furniture, as: 'furniture', attributes: ['name'] }],
                attributes: ['id', 'rate', 'review', 'name'],
            });

            const response = ratings.map(r => ({
                id: r.id,
                rate: r.rate,
                review: r.review,
                name: r.name,
                productName: r.furniture?.name || 'Неизвестно'
            }));

            return res.json(response);
        } catch (e) {
            console.error('Get All Ratings Error:', e);
            return res.status(500).json({ message: 'Ошибка получения всех отзывов' });
        }
    }
    async deleteRating(req, res) {
        try {
            const { id } = req.params;

            const rating = await Rating.findByPk(id);
            if (!rating) {
                return res.status(404).json({ message: 'Отзыв не найден' });
            }

            const furnitureId = rating.furnitureId;
            await rating.destroy();

            // Пересчёт статистики
            const stats = await Rating.findOne({
                where: { furnitureId },
                attributes: [
                    [fn('COUNT', col('id')), 'count'],
                    [fn('AVG',   col('rate')), 'avg']
                ],
                raw: true
            });

            const count = parseInt(stats.count || 0, 10);
            const avg   = stats.avg ? parseFloat(stats.avg).toFixed(1) : 0;

            await Furniture.update(
                { reviewsCount: count, rating: avg },
                { where: { id: furnitureId } }
            );

            return res.json({ message: 'Отзыв удалён' });
        } catch (e) {
            console.error('Delete Rating Error:', e);
            return res.status(500).json({ message: 'Ошибка при удалении отзыва' });
        }
    }
}

module.exports = new RatingController();
