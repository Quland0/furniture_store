const { Rating, Furniture } = require('../models/models')

class RatingController {
    async addRating(req, res) {
        try {
            const { userId } = req.user
            const { furnitureId, rate } = req.body

            if (rate < 1 || rate > 5) {
                return res.status(400).json({ message: 'Рейтинг должен быть от 1 до 5' })
            }

            const existingRating = await Rating.findOne({
                where: { userId, furnitureId }
            })

            if (existingRating) {
                return res.status(400).json({ message: 'Вы уже оставили отзыв на этот товар' })
            }

            const rating = await Rating.create({ userId, furnitureId, rate })
            return res.json(rating)
        } catch (e) {
            console.error(e)
            return res.status(400).json({ message: 'Ошибка добавления отзыва' })
        }
    }

    async getRatings(req, res) {
        try {
            const { furnitureId } = req.query

            const ratings = await Rating.findAll({
                where: { furnitureId },
                include: [{ model: Furniture }]
            })

            return res.json(ratings)
        } catch (e) {
            console.error(e)
            return res.status(400).json({ message: 'Ошибка получения отзывов' })
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
