import React, { useContext } from 'react';
import { OrderContext } from '../context/OrderContext';
import '../styles/PrintOrderPage.css';

const PrintOrderPage = () => {
    const { orderData } = useContext(OrderContext);

    if (!orderData) {
        return <p>Заказ не найден. Вернитесь на страницу оформления заказа.</p>;
    }

    // Если в orderData нет orderDate, подставляем текущую дату
    const date = orderData.orderDate ? new Date(orderData.orderDate) : new Date();
    const dateString = date.toLocaleDateString();
    const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="print-page">
            <h1>Ваш заказ</h1>
            <button className="print-btn" onClick={handlePrint}>
                Распечатать бланк заказа
            </button>

            <div className="order-block" id="order-block-1">
                <table className="info-table">
                    <tbody>
                    <tr>
                        <td><strong>ФИО:</strong></td>
                        <td>{orderData.fullName}</td>
                    </tr>
                    <tr>
                        <td><strong>Email:</strong></td>
                        <td>{orderData.email}</td>
                    </tr>
                    <tr>
                        <td><strong>Телефон:</strong></td>
                        <td>{orderData.contactPhone}</td>
                    </tr>
                    <tr>
                        <td><strong>Доп. информация:</strong></td>
                        <td>{orderData.additionalInfo || '—'}</td>
                    </tr>
                    </tbody>
                </table>

                <hr />

                <table className="info-table">
                    <tbody>
                    <tr>
                        <td><strong>Номер заказа:</strong></td>
                        <td>{orderData.orderId || '—'}</td>
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
                    {orderData.deliveryMethod === 'transport' && orderData.deliveryPhone && (
                        <>
                            <tr>
                                <td><strong>Телефон для доставки:</strong></td>
                                <td>{orderData.deliveryPhone}</td>
                            </tr>
                            <tr>
                                <td><strong>Почтовый индекс:</strong></td>
                                <td>{orderData.deliveryPostalCode || '—'}</td>
                            </tr>
                            <tr>
                                <td><strong>Адрес доставки:</strong></td>
                                <td>{orderData.deliveryAddress || '—'}</td>
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
                    {orderData.items && orderData.items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{typeof item.manufacturer === 'object' ? item.manufacturer.name : (item.manufacturer || '—')}</td>
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
