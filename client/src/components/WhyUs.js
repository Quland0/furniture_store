import React from 'react';
import '../styles/WhyUs.css';

import deliveryIcon from '../assets/icons/delivery.svg';
import guaranteeIcon from '../assets/icons/guarantee.svg';
import bestpriceIcon from '../assets/icons/bestprice.svg';
import moneybackIcon from '../assets/icons/moneyback1.svg';
import assortmentIcon from '../assets/icons/assortment.svg';

const WhyUsSection = () => {
    const advantages = [
        { text: 'Быстрая доставка', icon: deliveryIcon },
        { text: 'Гарантия качества', icon: guaranteeIcon },
        { text: 'Лучшая цена', icon: bestpriceIcon },
        { text: 'Быстрый возврат', icon: moneybackIcon },
        { text: 'Широкий ассортимент', icon: assortmentIcon },
    ];

    return (
        <section className="why-us-section">
            <h2 className="section-title">Почему именно мы</h2>

            <div className="advantages-grid">
                {advantages.map((item, index) => (
                    <div className="advantage-item" key={index}>
                        <img
                            src={item.icon}
                            alt={item.text}
                            className="advantage-icon"
                            loading="lazy"
                        />
                        <span className="advantage-text">{item.text}</span>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default WhyUsSection;