import React, { useState } from 'react';
import '../styles/AdminFormsList.css';
import deleteIcon from "../assets/icons/delete.svg";

const AdminFormsList = () => {
    const mockQuestions = [
        { id: 1, name: 'Иванов Иван', email: 'ivanov@example.com', message: 'Можно ли заказать мебель по индивидуальному проекту?' },
        { id: 2, name: 'Ольга', email: 'olga@mail.ru', message: 'Каковы сроки доставки по Москве?' },
        { id: 3, name: 'Сергей', email: 'sergey@test.ru', message: 'Интересует информация о гарантии.' },
    ];
    const mockMeasurer = [
        { id: 1, name: 'Алексей', contact: 'alexey@ya.ru', message: 'Хотел бы заказать замер на следующую неделю.' },
        { id: 2, name: 'Мария', contact: '89005553535', message: 'Уточните, в какие дни возможен выезд замерщика.' },
    ];
    const mockReviews = [
        {
            id: 1,
            productId: 1,
            productName: 'Спальня Виктория 6 дв.',
            name: 'Иванов',
            rate: 5,
            review: 'Отличная мебель! Очень доволен.'
        },
        {
            id: 2,
            productId: 2,
            productName: 'Стол Стулович',
            name: 'Петрова',
            rate: 4,
            review: 'Хорошее качество, но доставка задержалась.'
        },
        {
            id: 3,
            productId: 3,
            productName: 'Кресло Комфорт',
            name: 'Сидоров',
            rate: 3,
            review: 'Ожидал лучшего, цена не оправдывает.'
        },
    ];

    const [modalType, setModalType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (type) => {
        setModalType(type);
        setModalVisible(true);
    };
    const closeModal = () => setModalVisible(false);

    const handleDelete = (id) => {
        alert(`Удалить заявку/отзыв с ID ${id} (заглушка)`);
    };

    let forms = [];
    let title = '';
    if (modalType === 'questions') {
        forms = mockQuestions;
        title = 'Заданные вопросы';
    } else if (modalType === 'measurer') {
        forms = mockMeasurer;
        title = 'Заявки замерщика';
    } else if (modalType === 'reviews') {
        forms = mockReviews;
        title = 'Отзывы пользователей';
    }

    return (
        <div className="admin-forms-list">
            <div className="forms-tabs">
                <button
                    className={`tab-button ${modalType === 'questions' ? 'active' : ''}`}
                    onClick={() => openModal('questions')}
                >
                    Заданные вопросы ({mockQuestions.length})
                </button>
                <button
                    className={`tab-button ${modalType === 'measurer' ? 'active' : ''}`}
                    onClick={() => openModal('measurer')}
                >
                    Замерщик ({mockMeasurer.length})
                </button>
                <button
                    className={`tab-button ${modalType === 'reviews' ? 'active' : ''}`}
                    onClick={() => openModal('reviews')}
                >
                    Отзывы ({mockReviews.length})
                </button>
            </div>
            {modalVisible && (
                <div className="form-modal-overlay" onClick={closeModal}>
                    <div className="form-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-button" onClick={closeModal}>×</button>
                        <h3 className="modal-title">{title}</h3>

                        <div className="forms-list">
                            {forms.map(form => (
                                <div key={form.id} className="form-item">
                                    <div className="form-content">
                                        {modalType === 'reviews' && (
                                            <p className="review-product">
                                                <strong>Товар:</strong> {form.productName}
                                            </p>
                                        )}
                                        {modalType === 'questions' && (
                                            <p className="form-email">
                                                <strong>Email:</strong> {form.email}
                                            </p>
                                        )}
                                        {modalType === 'measurer' && (
                                            <p className="form-contact">
                                                <strong>Контакт:</strong> {form.contact}
                                            </p>
                                        )}
                                        <p>
                                            <strong>{form.name}:</strong>{' '}
                                            {modalType === 'reviews'
                                                ? `Оценка: ${form.rate}. ${form.review}`
                                                : form.message}
                                        </p>
                                    </div>
                                    <button className="delete-btn" onClick={() => handleDelete(form.id)}>
                                        <img src={deleteIcon} alt="Удалить"/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminFormsList;
