const { Order, OrderItem, Furniture } = require('../models/models');
const logger = require('../logger');

class OrderController {
    async getAll(req, res) {
        try {
            const orders = await Order.findAll({
                include: [
                    {
                        model: OrderItem,
                        include: [
                            {
                                model: Furniture
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });
            res.json(orders);
        } catch (error) {
            logger.error('Ошибка при получении заказов', error);
            res.status(500).json({ message: "Ошибка при получении заказов" });
        }
    }

    async create(req, res) {
        try {
            const {
                fullName,
                email,
                contactPhone,
                additionalInfo,
                deliveryMethod,
                deliveryPhone,
                deliveryPostalCode,
                deliveryAddress,
                totalPrice,
                items
            } = req.body;

            const order = await Order.create({
                fullName,
                email,
                contactPhone,
                additionalInfo,
                deliveryMethod,
                deliveryPhone,
                deliveryPostalCode,
                deliveryAddress,
                totalPrice,
                userId: req.user?.id || null,
            });

            const orderItems = items.map(item => ({
                orderId: order.id,
                furnitureId: item.furnitureId,
                quantity: item.quantity,
                price: item.price
            }));

            await OrderItem.bulkCreate(orderItems);

            const createdOrder = await Order.findByPk(order.id, {
                include: [{ model: OrderItem, include: [Furniture] }],
            });

            res.json(createdOrder);
        } catch (error) {
            logger.error('Ошибка при создании заказа', error);
            res.status(500).json({ message: "Ошибка при создании заказа" });
        }
    }


    async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;

            const order = await Order.findByPk(id);
            if (!order) {
                return res.status(404).json({ message: "Заказ не найден" });
            }

            order.status = status;
            await order.save();

            res.json({ message: "Статус обновлён", order });
        } catch (error) {
            logger.error('Ошибка обновления статуса заказа', error);
            res.status(500).json({ message: "Ошибка обновления статуса" });
        }
    }
    async getUserOrders(req, res) {
        try {
            const userId = req.user.id;

            const orders = await Order.findAll({
                where: { userId },
                include: [
                    {
                        model: OrderItem,
                        include: [{ model: Furniture }]
                    }
                ],
                order: [['createdAt', 'DESC']]
            });

            res.json(orders);
        } catch (error) {
            logger.error('Ошибка при получении заказов пользователя', error);
            res.status(500).json({ message: "Ошибка при получении заказов пользователя" });
        }
    }
}

module.exports = new OrderController();
