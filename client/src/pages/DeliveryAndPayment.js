import React from 'react';
import '../styles/DeliveryAndPayment.css';

const DeliveryAndPaymentPage = () => {
    return (
        <div className="delivery-payment-page">
            <div className="container">
                <section className="delivery-section">
                    <h1>Доставка</h1>

                    <div className="delivery-option">
                        <h2>Самовывоз</h2>
                        <p>
                            Вы можете забрать свой заказ на нашем складе по адресу: Ростовская обл., Мясниковский район,
                            с.Крым, ул. Большесальская 45а с понедельника по субботу с 10-00 до 17-00,
                            предварительно предупредив о дате отгрузки за один день по телефону +7 918 898 88 22.
                        </p>
                    </div>

                    <div className="delivery-option">
                        <h2>Доставка нашим транспортом</h2>
                        <p>
                            По вашему желанию, ваш заказ мы можем доставить и нашим транспортом.
                            Способ и цену доставки согласовать с менеджером по телефону
                        </p>
                    </div>

                    <div className="delivery-option">
                        <h2>Доставка Транспортной Компанией</h2>
                        <p>
                            Доставка Транспортной Компанией по выбору покупателя. Стоимость зависит от объема,
                            веса груза и расстояния между городами. Более подробно можно просчитать в калькуляторе
                            на сайте выбранной Транспортной Компании.
                        </p>
                    </div>
                </section>

                <section className="payment-section">
                    <h1>Оплата</h1>

                    <div className="payment-info">
                        <p>Мы принимаем любую форму оплаты удобную для покупателя!</p>
                        <p>У нас есть кредит и беспроцентная рассрочка платежа.</p>
                        <p>
                            Оформить кредит или рассрочку можно дистанционно с любого города.
                            <a href="/credit" className="more-info-link">Подробнее</a>
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DeliveryAndPaymentPage;