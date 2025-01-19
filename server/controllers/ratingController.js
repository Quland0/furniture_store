const { Rating, Furniture } = require('../models/models')
const { validationResult } = require('express-validator');

class RatingController {
    async addRating(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: 'Ошибка валидации', errors: errors.array() })
            }

            const { productId, rate, review, name } = req.body;

            const rating = await Rating.create({
                productId,
                rate,
                review,
                name,
                approved: false
            });

            return res.json({
                id: rating.id,
                rate: rating.rate,
                review: rating.review,
                name: rating.name,
            });
        } catch (e) {
            console.error('Add Rating Error:', e)
            res.status(500).json({ message: 'Ошибка добавления рейтинга' })
        }
    }
    async getRatings(req, res) {
        try {
            const { productId } = req.params;

            const ratings = await Rating.findAll({
                where: { productId },
                attributes: ['id', 'rate', 'review', 'name'],
            })

            return res.json(ratings);
        } catch (e) {
            console.error('Get Ratings Error:', e);
            res.status(500).json({ message: 'Ошибка получения рейтингов' })
        }
    }


    async getAverageRating(req, res) {
        try {
            const { productId } = req.params;

            const ratings = await Rating.findAll({ where: { productId } });
            const average =
                ratings.reduce((sum, r) => sum + r.rate, 0) / ratings.length || 0;

            return res.json({ average: average.toFixed(1), count: ratings.length })
        } catch (e) {
            console.error('Get Average Rating Error:', e);
            res.status(500).json({ message: 'Ошибка расчёта среднего рейтинга' })
        }
    }

    async moderateRating(req, res) {
        try {
            const { ratingId, approved } = req.body

            const rating = await Rating.findOne({ where: { id: ratingId } })
            if (!rating) {
                return res.status(400).json({ message: 'Рейтинг не найден' })
            }

            rating.approved = approved
            await rating.save()

            return res.json({ message: 'Рейтинг обновлен', rating })
        } catch (e) {
            console.error(e)
            return res.status(400).json({ message: 'Ошибка модерации отзыва' })
        }
    }
}

module.exports = new RatingController()
