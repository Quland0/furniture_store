import React, { useContext } from 'react';
import { OrderContext } from '../context/OrderContext';
import '../styles/PrintOrderPage.css';

const PrintOrderPage = () => {
    const { orderData } = useContext(OrderContext);

    if (!orderData) {
        return <p>Заказ не найден. Вернитесь на страницу оформления заказа.</p>;
    }

    const dateString = orderData.orderDate.toLocaleDateString();
    const timeString = orderData.orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="print-page">
            <h1>Ваш заказ</h1>
            <button className="print-btn" onClick={handlePrint}>
                Распечатать бланк заказа
            </button>

            {/* Блок 1: Информация о клиенте и заказе */}
            <div className="order-block" id="order-block-1">
                <table className="info-table">
                    <tbody>
                    <tr>
                        <td><strong>ФИО:</strong></td>
                        <td>{orderData.order.fullName}</td>
                    </tr>
                    <tr>
                        <td><strong>Email:</strong></td>
                        <td>{orderData.order.email}</td>
                    </tr>
                    <tr>
                        <td><strong>Телефон:</strong></td>
                        <td>{orderData.order.contactPhone}</td>
                    </tr>
                    <tr>
                        <td><strong>Доп. информация:</strong></td>
                        <td>{orderData.order.additionalInfo || '—'}</td>
                    </tr>
                    </tbody>
                </table>

                <hr />

                <table className="info-table">
                    <tbody>
                    <tr>
                        <td><strong>Номер заказа:</strong></td>
                        <td>{orderData.orderId}</td>
                    </tr>
                    <tr>
                        <td><strong>Статус заказа:</strong></td>
                        <td>Новый</td>
                    </tr>
                    <tr>
                        <td><strong>Дата заказа:</strong></td>
                        <td>{dateString} {timeString}</td>
                    </tr>
                    <tr>
                        <td><strong>Сумма:</strong></td>
                        <td>{orderData.totalPrice.toLocaleString()} руб.</td>
                    </tr>
                    <tr>
                        <td><strong>Доставка:</strong></td>
                        <td>
                            {orderData.deliveryMethod === 'transport'
                                ? 'Транспортной компанией'
                                : 'Самовывоз'}
                        </td>
                    </tr>
                    {orderData.deliveryMethod === 'transport' && orderData.delivery && (
                        <>
                            <tr>
                                <td><strong>Телефон для доставки:</strong></td>
                                <td>{orderData.delivery.phone}</td>
                            </tr>
                            <tr>
                                <td><strong>Почтовый индекс:</strong></td>
                                <td>{orderData.delivery.postalCode}</td>
                            </tr>
                            <tr>
                                <td><strong>Адрес доставки:</strong></td>
                                <td>{orderData.delivery.deliveryAddress}</td>
                            </tr>
                        </>
                    )}
                    </tbody>
                </table>
            </div>

            <div className="order-block" id="order-block-2">
                <table className="order-table">
                    <thead>
                    <tr>
                        <th>Название</th>
                        <th>Производитель</th>
                        <th>Цена, руб</th>
                        <th>Количество</th>
                        <th>Сумма, руб</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orderData.orderItems && orderData.orderItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{typeof item.manufacturer === 'object' ? item.manufacturer.name : item.manufacturer}</td>
                            <td>{item.price.toLocaleString()}</td>
                            <td>{item.quantity}</td>
                            <td>{(item.price * item.quantity).toLocaleString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <p className="order-total">
                    <strong>Итого: {orderData.totalPrice.toLocaleString()} руб.</strong>
                </p>
            </div>
        </div>
    );
};

export default PrintOrderPage;