import React, { useEffect, useState } from 'react';
import '../styles/AdminFormsList.css';
import deleteIcon from "../assets/icons/delete.svg";

const AdminFormsList = () => {
    const [questions, setQuestions] = useState([]);
    const [measurerRequests, setMeasurerRequests] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [modalType, setModalType] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchQuestions();
        fetchMeasurerRequests();
        fetchReviews();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await fetch('/api/forms/questions');
            const data = await response.json();
            setQuestions(data);
        } catch (error) {
            console.error('Ошибка при загрузке вопросов:', error);
        }
    };

    const fetchMeasurerRequests = async () => {
        try {
            const response = await fetch('/api/forms/measurer-requests');
            const data = await response.json();
            setMeasurerRequests(data);
        } catch (error) {
            console.error('Ошибка при загрузке заявок на замер:', error);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch('/api/reviews');
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Ошибка при загрузке отзывов:', error);
        }
    };

    const openModal = (type) => {
        setModalType(type);
        setModalVisible(true);
    };

    const closeModal = () => setModalVisible(false);

    const handleDelete = async (id) => {
        try {
            let url = '';
            if (modalType === 'questions') {
                url = `/api/forms/questions/${id}`;
            } else if (modalType === 'measurer') {
                url = `/api/forms/measurer-requests/${id}`;
            } else if (modalType === 'reviews') {
                url = `/api/reviews/${id}`;
            }
            await fetch(url, { method: 'DELETE' });

            if (modalType === 'questions') fetchQuestions();
            if (modalType === 'measurer') fetchMeasurerRequests();
            if (modalType === 'reviews') fetchReviews();
        } catch (error) {
            console.error('Ошибка при удалении:', error);
        }
    };

    let forms = [];
    let title = '';
    if (modalType === 'questions') {
        forms = questions;
        title = 'Заданные вопросы';
    } else if (modalType === 'measurer') {
        forms = measurerRequests;
        title = 'Заявки замерщика';
    } else if (modalType === 'reviews') {
        forms = reviews;
        title = 'Отзывы пользователей';
    }

    return (
        <div className="admin-forms-list">
            <div className="forms-tabs">
                <button
                    className={`tab-button ${modalType === 'questions' ? 'active' : ''}`}
                    onClick={() => openModal('questions')}
                >
                    Заданные вопросы ({questions.length})
                </button>
                <button
                    className={`tab-button ${modalType === 'measurer' ? 'active' : ''}`}
                    onClick={() => openModal('measurer')}
                >
                    Замерщик ({measurerRequests.length})
                </button>
                <button
                    className={`tab-button ${modalType === 'reviews' ? 'active' : ''}`}
                    onClick={() => openModal('reviews')}
                >
                    Отзывы ({reviews.length})
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
                                                : modalType === 'questions'
                                                    ? form.question
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
