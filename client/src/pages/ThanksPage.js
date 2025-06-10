import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { OrderContext } from '../context/OrderContext';
import '../styles/ThanksPage.css';
import { ORDER_PRINT_ROUTE } from '../utils/consts';

const ThanksPage = () => {
    const { orderData } = useContext(OrderContext);

    if (!orderData) {
        return (
            <p>
                Заказ не найден. Вернитесь на{' '}
                <Link to="/order">форму заказа</Link>.
            </p>
        );
    }

    // Если orderDate отсутствует, используем текущую дату
    const orderDate = orderData.orderDate ? new Date(orderData.orderDate) : new Date();
    const dateString = orderDate.toLocaleDateString();
    const timeString = orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="thanks-container">
            <h2>Спасибо за заказ</h2>
            <p>
                Проверить статус заказа вы можете по{' '}
                <Link to={ORDER_PRINT_ROUTE}>ссылке</Link>.
            </p>
            <p>Номер вашего заказа: № {orderData.orderId || '—'}</p>
            <p>Дата заказа: {dateString} {timeString}</p>
            <p>
                Доставка:{' '}
                {orderData.deliveryMethod === 'transport'
                    ? 'Транспортной компанией'
                    : 'Самовывоз'}
            </p>
            <p>Сумма к оплате: {orderData.totalPrice.toLocaleString()} руб.</p>

            <Link to={ORDER_PRINT_ROUTE} className="thanks-print-button">
                Распечатать бланк заказа
            </Link>
        </div>
    );
};

export default ThanksPage;
