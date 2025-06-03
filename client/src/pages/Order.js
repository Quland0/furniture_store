import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Order.css';
import { OrderContext } from '../context/OrderContext';
import { BasketContext } from '../context/BasketContext';
import { ORDER_THANKS_ROUTE } from '../utils/consts';

const Order = () => {
    const navigate = useNavigate();
    const { basket } = useContext(BasketContext);
    const { setOrderData } = useContext(OrderContext);

    const totalPrice = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const [deliveryMethod, setDeliveryMethod] = useState("");
    const [phone, setPhone] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [contactPhone, setContactPhone] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [agree, setAgree] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (deliveryMethod === "transport") {
            if (!phone || !postalCode || !deliveryAddress) {
                alert('Заполните поля для доставки!');
                return;
            }
        }
        if (!fullName || !email || !contactPhone) {
            alert('Заполните обязательные поля для оформления заказа!');
            return;
        }
        if (!agree) {
            alert('Необходимо согласие на обработку персональных данных!');
            return;
        }

        const newOrder = {
            deliveryMethod,
            delivery:
                deliveryMethod === "transport"
                    ? { phone, postalCode, deliveryAddress }
                    : { pickup: true },
            order: {
                fullName,
                email,
                contactPhone,
                additionalInfo,
            },
            orderItems: basket,
            totalPrice,
            orderId: Math.floor(Math.random() * 10000),
            orderDate: new Date(),
        };

        setOrderData(newOrder);

        navigate(ORDER_THANKS_ROUTE);
    };

    return (
        <div className="order-page">
            <h1>Оформление заказа</h1>
            <form onSubmit={handleSubmit} className="order-form">
                <div className="order-section">
                    <h2>Доставка</h2>
                    <div className="form-group radio-group">
                        <label>
                            <input
                                type="radio"
                                name="deliveryMethod"
                                value="pickup"
                                checked={deliveryMethod === "pickup"}
                                onChange={() => setDeliveryMethod("pickup")}
                            />
                            <span>Самовывоз</span>
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="deliveryMethod"
                                value="transport"
                                checked={deliveryMethod === "transport"}
                                onChange={() => setDeliveryMethod("transport")}
                            />
                            <span>
                Транспортной компанией — способ и цену доставки согласовываете с менеджером по телефону
              </span>
                        </label>
                    </div>
                    {deliveryMethod === "transport" && (
                        <>
                            <div className="form-group">
                                <label>Телефон *</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Почтовый индекс *</label>
                                <input
                                    type="text"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Адрес доставки *</label>
                                <textarea
                                    value={deliveryAddress}
                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                    required
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="order-section">
                    <h2>Оформление заказа</h2>
                    <div className="form-group">
                        <label>ФИО *</label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Email *</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Телефон *</label>
                        <input
                            type="tel"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Дополнительная информация</label>
                        <textarea
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                        />
                    </div>
                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={agree}
                                onChange={() => setAgree(!agree)}
                            />
                            <span>
            Я соглашаюсь на обработку моих{' '}
                                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                персональных данных
            </a>
        </span>
                        </label>
                    </div>
                </div>

                <button type="submit" className="submit-order-button">
                    Оформить заказ
                </button>
            </form>
        </div>
    );
};

export default Order;
