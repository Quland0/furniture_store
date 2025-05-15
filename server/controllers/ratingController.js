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
            console.error('Add Rating Error:', e);
            return res.status(500).json({ message: 'Ошибка добавления рейтинга' });
        }
    }

    async getRatings(req, res) {
        try {
            const { furnitureId } = req.params;

            const ratings = await Rating.findAll({
                where: { furnitureId },
                attributes: ['id', 'rate', 'review', 'name'],
            });

            return res.json(ratings);
        } catch (e) {
            console.error('Get Ratings Error:', e);
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
}

module.exports = new RatingController();
