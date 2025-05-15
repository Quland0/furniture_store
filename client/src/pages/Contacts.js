import React, { useEffect, useRef } from 'react';
import '../styles/Contacts.css';

const ContactsPage = () => {
    const mapRef = useRef(null);
    const mapLoaded = useRef(false);

    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        question: ''
    });

    useEffect(() => {
        if (mapLoaded.current) return;

        const loadHighQualityMap = () => {
            if (mapRef.current) {
                mapRef.current.innerHTML = '';
            }

            const mapContainer = document.createElement('div');
            mapContainer.id = 'ymap-container';
            mapContainer.style.width = '100%';
            mapContainer.style.height = '100%';
            mapRef.current.appendChild(mapContainer);

            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.charset = 'utf-8';
            script.async = true;

            script.src = 'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A0be0899d51ca2522e57e5d1ce796725900259d21540ea3c6b2c831f727d691e8&amp;width=100%&amp;height=100%&amp;lang=ru_RU&amp;scroll=true&amp;hdpi=true&amp;controls=zoomControl';

            script.onload = () => {
                mapLoaded.current = true;
                console.log('Карта загружена в высоком качестве');
            };

            mapContainer.appendChild(script);
        };

        setTimeout(loadHighQualityMap, 100);

        return () => {
            mapLoaded.current = false;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/forms/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Вопрос успешно отправлен!');
                setFormData({ name: '', email: '', message: '' });
            } else {
                alert('Ошибка при отправке вопроса');
            }
        } catch (error) {
            console.error('Ошибка при отправке:', error);
            alert('Ошибка при отправке вопроса');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="contacts-page">
            <div className="container">
                <h1>Наш адрес</h1>

                <div className="main-content">
                    <div className="map-section">
                        <div ref={mapRef} className="yandex-map"></div>
                    </div>

                    <div className="info-section">
                        <div className="business-info">
                            <h2>ИП "Абраамян В.Л."</h2>
                            <p><span className="detail-label">ИНН:</span> 755502469353</p>

                            <div className="contact-details">
                                <p><span className="detail-label">Адрес:</span> Ростовская обл, Мясниковский р-н, с. Крым, ул. Большесальская, 45а</p>
                                <p>
                                    <span className="detail-label">Телефон:</span>
                                    <a href="tel:+79188988822">+7 (918) 898-88-22</a>
                                    <a href="tel:+79188988838">+7 (918) 898-88-38</a>
                                </p>
                                <p>
                                    <span className="detail-label">Email:</span>
                                    <a href="mailto:mru161@yandex.ru">mru161@yandex.ru</a>
                                </p>
                                <p><span className="detail-label">Режим работы:</span> Пн-Сб 9:00 - 18:00 (МСК)</p>
                            </div>
                        </div>

                        <div className="contact-form-section">
                            <h2>Задать вопрос</h2>
                            <form onSubmit={handleSubmit} className="contact-form">
                                <div className="form-row">
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Имя"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <textarea
                                    name="question"
                                    placeholder="Сообщение"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows="5"
                                    required
                                ></textarea>

                                <button type="submit" className="submit-button">
                                    Отправить
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactsPage;

