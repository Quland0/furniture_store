import React, { useEffect, useState } from 'react';
import { fetchAllOrders, updateOrderStatus } from '../http/FurnitureAPI';
import '../styles/OrderAdminPanel.css';

const OrdersAdminPanel = () => {
    const [orders, setOrders] = useState([]);
    const [statusUpdates, setStatusUpdates] = useState({});

    useEffect(() => {
        fetchAllOrders()
            .then(setOrders)
            .catch(e => console.error('Ошибка загрузки заказов:', e));
    }, []);

    const loadOrders = () => {
        fetchAllOrders()
            .then(setOrders)
            .catch(e => console.error('Ошибка загрузки заказов:', e));
    };

    const handleStatusChange = (orderId, newStatus) => {
        setStatusUpdates(prev => ({
            ...prev,
            [orderId]: newStatus
        }));
    };

    const handleSaveStatus = async (orderId) => {
        try {
            const newStatus = statusUpdates[orderId];
            if (!newStatus) return;

            await updateOrderStatus(orderId, newStatus);
            loadOrders();
        } catch (e) {
            console.error('Ошибка обновления статуса:', e);
        }
    };

    const statusOptions = ['Новый', 'В обработке', 'Доставлен', 'Отменён'];

    return (
        <div className="orders-panel">
            <h2>Список заказов</h2>
            <table className="admin-furniture-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>ФИО</th>
                    <th>Email</th>
                    <th>Телефон</th>
                    <th>Метод доставки</th>
                    <th>Адрес доставки</th>
                    <th>Товары</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.fullName}</td>
                        <td>{order.email}</td>
                        <td>{order.contactPhone}</td>
                        <td>{order.deliveryMethod}</td>
                        <td>
                            {order.deliveryMethod !== 'Самовывоз' ? (
                                <>
                                    {order.deliveryPostalCode && <div>Индекс: {order.deliveryPostalCode}</div>}
                                    {order.deliveryAddress && <div>Адрес: {order.deliveryAddress}</div>}
                                    {order.deliveryPhone && <div>Телефон: {order.deliveryPhone}</div>}
                                </>
                            ) : (
                                <em>Самовывоз</em>
                            )}
                        </td>
                        <td>
                            {order.order_items?.map(i =>
                                `${i.furniture?.name} (${i.quantity} шт.)`
                            ).filter(Boolean).join(', ')}
                        </td>
                        <td>{order.totalPrice.toLocaleString()} ₽</td>
                        <td>{order.status}</td>
                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                        <td>
                            <select
                                value={statusUpdates[order.id] || order.status}
                                onChange={e => handleStatusChange(order.id, e.target.value)}
                                className="status-select"
                            >
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                            <br />
                            <button
                                onClick={() => handleSaveStatus(order.id)}
                                className="status-save-btn"
                            >
                                Сохранить
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersAdminPanel;
