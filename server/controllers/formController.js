const { Question, MeasurerRequest } = require('../models/models');

class FormController {
    async createQuestion(req, res) {
        try {
            const { name, email, question } = req.body;
            const q = await Question.create({ name, email, question });
            res.status(201).json(question);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при создании вопроса' });
        }
    }

    async getQuestions(req, res) {
        try {
            const questions = await Question.findAll();
            res.json(questions);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при получении вопросов' });
        }
    }

    async deleteQuestion(req, res) {
        try {
            const { id } = req.params;
            await Question.destroy({ where: { id } });
            res.json({ message: 'Вопрос удалён' });
        } catch (e) {
            res.status(500).json({ message: 'Ошибка удаления вопроса' });
        }
    }

    async getMeasurerRequests(req, res) {
        try {
            const requests = await MeasurerRequest.findAll();
            res.json(requests);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при получении заявок на замер' });
        }
    }

    async deleteMeasurerRequest(req, res) {
        try {
            const { id } = req.params;
            await MeasurerRequest.destroy({ where: { id } });
            res.json({ message: 'Заявка удалена' });
        } catch (e) {
            res.status(500).json({ message: 'Ошибка удаления заявки' });
        }
    }

    async createMeasurerRequest(req, res) {
        console.log('Тело запроса:', req.body);
        try {
            const { name, contact, message } = req.body;
            const request = await MeasurerRequest.create({ name, contact, message });
            res.status(201).json(request);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Ошибка при создании заявки' });
        }
    }
}

module.exports = new FormController();
