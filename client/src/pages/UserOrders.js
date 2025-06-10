import React, { useEffect, useState } from 'react';
import { getUserOrders } from '../http/FurnitureAPI';

const UserOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getUserOrders()
            .then(data => setOrders(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Загрузка заказов...</div>;
    }

    if (!orders.length) {
        return <div>У вас пока нет заказов.</div>;
    }

    return (
        <div className="user-orders-page">
            <h2>Мои заказы</h2>
            {orders.map(order => (
                <div key={order.id} className="order-card">
                    <p>Номер заказа: {order.id}</p>
                    <p>Дата: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p>Статус: {order.status}</p>
                    <hr/>
                </div>
            ))}
        </div>
    );
};

export default UserOrdersPage;
