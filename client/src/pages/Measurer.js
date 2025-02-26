import React, {useEffect, useRef, useState} from 'react';
import '../styles/Measurer.css';

const Measurer = () => {
    const [showRequestForm, setShowRequestForm] = useState(false);
    const formRef = useRef(null);
    const handleOpenForm = () => {
        setShowRequestForm(true);
    };

    const handleCloseForm = () => {
        setShowRequestForm(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Заявка отправлена!');
        setShowRequestForm(false);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                showRequestForm &&
                formRef.current &&
                !formRef.current.contains(e.target)
            ) {
                handleCloseForm();
            }
        };

        if (showRequestForm) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showRequestForm]);

    return (
        <div className="measurer-page">
            <div className="measurer-container">
                <h1 className="measurer-title">Вызовите замерщика на дом</h1>

                <p>
                    Наш опытный специалист по замерам точно рассчитает размеры помещения, учтёт особенности
                    планировки и пожелания по дизайну. В результате вы получите максимально точные данные,
                    необходимые для дальнейшего проектирования мебели.
                </p>

                <h2>Почему важен точный замер?</h2>
                <p>
                    Замер мебели напрямую влияет на планировку и удобство её использования. Точное измерение
                    – залог безупречного результата. Наши специалисты снимают размеры с максимальной точностью,
                    чтобы избежать ошибок даже в миллиметровых погрешностях. Например, неверно указанное расстояние
                    может привести к тому, что гарнитур будет иметь излишние зазоры или, наоборот, не поместится в
                    отведённое пространство, что повлечёт за собой дополнительные расходы.
                </p>

                <h2>Преимущества наших услуг:</h2>
                <ul>
                    <li>100% точность: Замер производится с использованием профессионального оборудования, что гарантирует абсолютную точность измерений.</li>
                    <li>Комплексное снятие размеров: Замерщик точно учитывает плинтусы, ниши, колонны и другие сложные элементы, обеспечивая корректность плана.</li>
                    <li>Быстрая установка: Правильный замер позволяет избежать задержек и проблем при монтаже гарнитура, экономя ваше время.</li>
                    <li>Подготовка проекта: Специалист составит подробный план помещения, который будет согласован с вами и передан дизайнеру для дальнейшей работы.</li>
                </ul>

                <h2>Бесплатный замер и проект!</h2>
                <p>
                    Вызовите замерщика по телефону +7 918 898 88 22 или оставьте заявку на сайте – услуга бесплатна для клиентов, заказавших кухню в нашем магазине.
                    Вам останется только наслаждаться качеством и комфортом новой кухни!
                </p>
            </div>
            <div style={{ marginTop: '40px' }}>
                <button className="request-button" onClick={handleOpenForm}>
                    Оставить заявку
                </button>
            </div>
            {showRequestForm && (
                <div className="form-overlay">
                    <div className="request-form" ref={formRef}>
                        <button className="close-icon" onClick={handleCloseForm}>
                            ×
                        </button>

                        <h2>Создать заявку</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                <input type="text" name="name" placeholder="Имя" required />
                            </label>

                            <label>
                                <input type="text" name="contact" placeholder="Телефон/Email" required />
                            </label>

                            <label>
                                <textarea name="message" rows="4" placeholder="Сообщение" />
                            </label>

                            <div className="form-buttons">
                                <button type="submit">Отправить</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Measurer;
