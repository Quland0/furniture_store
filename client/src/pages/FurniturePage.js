import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/FurniturePage.css';
import favoriteIcon from '../assets/icons/favorite.svg';
import { BasketContext } from '../context/BasketContext';

// Импорт изображений
import victoriaMain from '../assets/images/products/bedroom/spalnya_mebel_gracia_4.jpg';
import victoria1 from '../assets/images/products/bedroom/spalnya_mebel_gracia_4_detali_6-scaled.jpg';
import victoria2 from '../assets/images/products/bedroom/krovat_spalnya_mebel_gracia_4.png';
import victoria3 from '../assets/images/products/bedroom/tumba_spalnya_mebel_gracia_4.png';
import victoria4 from '../assets/images/products/bedroom/spalnya_gracia_6_detali_3-scaled.jpg';
import victoria5 from '../assets/images/products/bedroom/spalnya_gracia_6_detali_9-scaled.jpg';
import victoria6 from '../assets/images/products/bedroom/spalnya_gracia_6_detali_11-scaled.jpg';
import victoria7 from '../assets/images/products/bedroom/spalnya_gracia_6_shkaf.png';
import victoria8 from '../assets/images/products/bedroom/spalnya_gracia_6_komod.png';
import victoria9 from '../assets/images/products/bedroom/spalnya_gracia_6_shkaf1.png';

const mockFurniture = {
    id: 1,
    name: 'Спальня "Виктория" 6-ти дверная',
    price: 130000,
    rating: 4.5,
    reviewsCount: 12,
    new: true,
    images: [
        victoriaMain,
        victoria1,
        victoria2,
        victoria3,
        victoria4,
        victoria5,
        victoria6,
        victoria7,
        victoria8,
        victoria9,
    ],
    manufacturer: { id: 2, name: 'Milana group' },
    types: [{ id: 1, name: 'Спальни' }],
    info: [
        { id: 1, title: 'Цвет', description: 'Шимо светлый' },
        { id: 2, title: 'Материал', description: 'ЛДСП, пленочный МДФ (фрезеровка)' },
        { id: 3, title: 'Размер кровати', description: 'ш: 2434 мм, г: 2070 мм, в: 1420 мм' },
    ],
    reviews: [
        {
            id: 101,
            author: 'Елена',
            rating: 5,
            review: 'Отличная спальня, очень довольна покупкой!',
        },
        {
            id: 102,
            author: 'Владимир',
            rating: 4,
            review: 'Хорошее качество, но доставка затянулась.',
        },
        {
            id: 103,
            author: 'Владимир',
            rating: 4,
            review: 'Хорошее качество, но доставка затянулась.',
        },
        {
            id: 104,
            author: 'Владимир',
            rating: 4,
            review: 'Хорошее качество, но доставка затянулась.',
        },
        {
            id: 105,
            author: 'Владимир',
            rating: 4,
            review: 'Хорошее качество, но доставка затянулась.',
        },
        {
            id: 106,
            author: 'Владимир',
            rating: 4,
            review: 'Хорошее качество, но доставка затянулась.',
        },
        {
            id: 107,
            author: 'Владимир',
            rating: 4,
            review: 'Хорошее качество, но доставка затянулась.',
        },
    ],
};

const FurniturePage = () => {
    const { id } = useParams();
    const furniture = mockFurniture;

    const isAuth = true;

    const [selectedImage, setSelectedImage] = useState(furniture.images[0]);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
    const [activeTab, setActiveTab] = useState("details");
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const [isFavorite, setIsFavorite] = useState(false);
    const handleAddToFavorite = () => {
        setIsFavorite(!isFavorite);
        console.log(isFavorite ? "Удалено из избранного" : "Добавлено в избранное", furniture.name);
    };

    const [isInCart, setIsInCart] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => Math.max(1, prev - 1));

    const { basket, addToBasket, removeFromBasket } = useContext(BasketContext);

    const handleAddToCart = () => {
        if (!isInCart) {
            addToBasket(furniture, quantity);
            setIsInCart(true);
            console.log("Добавлено в корзину:", furniture.name, "в количестве", quantity);
        } else {
            removeFromBasket(furniture.id);
            setIsInCart(false);
            console.log("Удалено из корзины:", furniture.name);
        }
    };

    const handleTabClick = (tab) => setActiveTab(tab);

    const openLightbox = () => {
        setLightboxImage(selectedImage);
        const index = furniture.images.findIndex(img => img === selectedImage);
        setLightboxImageIndex(index !== -1 ? index : 0);
        setLightboxOpen(true);
        document.body.classList.add('lightbox-open');
    };

    const closeLightbox = useCallback(() => {
        setLightboxOpen(false);
        document.body.classList.remove('lightbox-open');
    }, []);

    const prevImage = useCallback((e) => {
        e.stopPropagation();
        setLightboxImageIndex((prevIndex) => {
            const newIndex = prevIndex === 0 ? furniture.images.length - 1 : prevIndex - 1;
            setLightboxImage(furniture.images[newIndex]);
            return newIndex;
        });
    }, [furniture.images]);

    const nextImage = useCallback((e) => {
        e.stopPropagation();
        setLightboxImageIndex((prevIndex) => {
            const newIndex = prevIndex === furniture.images.length - 1 ? 0 : prevIndex + 1;
            setLightboxImage(furniture.images[newIndex]);
            return newIndex;
        });
    }, [furniture.images]);

    const handleKeyDown = useCallback((e) => {
        if (!lightboxOpen) return;
        if (e.key === 'ArrowLeft') prevImage(e);
        else if (e.key === 'ArrowRight') nextImage(e);
        else if (e.key === 'Escape') closeLightbox();
    }, [lightboxOpen, prevImage, nextImage, closeLightbox]);

    useEffect(() => {
        if (lightboxOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [lightboxOpen, handleKeyDown]);

    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [hoverRating, setHoverRating] = useState(0);

    const openReviewModal = () => {
        setReviewModalOpen(true);
    };

    const closeReviewModal = () => {
        setReviewModalOpen(false);
        setReviewName('');
        setReviewRating(0);
        setReviewText('');
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!reviewName || !reviewRating || !reviewText) {
            console.log('Заполните все поля');
            return;
        }
        console.log('Отзыв отправлен:', { reviewName, reviewRating, reviewText });
        setReviewName('');
        setReviewRating(0);
        setReviewText('');
        setReviewModalOpen(false);
    };

    const renderRatingStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const isFilled = hoverRating ? i <= hoverRating : i <= reviewRating;
            stars.push(
                <span
                    key={i}
                    className={`star-selector ${isFilled ? 'filled' : ''}`}
                    onMouseEnter={() => setHoverRating(i)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setReviewRating(i)}
                >
          ★
        </span>
            );
        }
        return stars;
    };

    const hasReviews = furniture.reviews && furniture.reviews.length > 0;

    return (
        <div className="furniture-page">
            {/* Галерея и информация */}
            <div className="furniture-page-top">
                <div className="furniture-gallery">
                    <div className="furniture-main-image" onClick={openLightbox}>
                        <img src={selectedImage} alt={furniture.name} />
                    </div>
                    <div className="furniture-thumbnails">
                        {furniture.images.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`${furniture.name} вариант ${idx + 1}`}
                                className={selectedImage === img ? 'thumbnail active' : 'thumbnail'}
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                </div>
                <div className="furniture-info">
                    <h1>{furniture.name}</h1>
                    <div className="furniture-rating">
                        <span className="stars">{furniture.rating} ★</span>
                        <span className="reviews-count">({furniture.reviewsCount} отзывов)</span>
                    </div>
                    <div className="furniture-price">
                        {furniture.price.toLocaleString()} ₽
                    </div>
                    <p className="manufacturer">Производитель: {furniture.manufacturer.name}</p>

                    <div className="quantity-controls">
                        <button className="quantity-btn" onClick={handleDecrement} disabled={quantity === 1}>-</button>
                        <input
                            type="number"
                            min="1"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                            className="quantity-input"
                        />
                        <button className="quantity-btn" onClick={handleIncrement}>+</button>
                    </div>

                    <div className="action-buttons">
                        <button
                            className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
                            onClick={handleAddToCart}
                        >
                            {isInCart ? 'В корзине' : 'В корзину'}
                        </button>
                        <button
                            className={`favorite-button ${isFavorite ? 'active' : ''}`}
                            onClick={handleAddToFavorite}
                        >
                            <img src={favoriteIcon} alt="Избранное" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Вкладки */}
            <div className="furniture-tabs">
                <button
                    className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
                    onClick={() => handleTabClick('details')}
                >
                    Детали
                </button>
                <button
                    className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                    onClick={() => handleTabClick('reviews')}
                >
                    Отзывы ({furniture.reviews.length})
                </button>
            </div>

            <div className="furniture-tab-content">
                {activeTab === 'details' && (
                    <div className="details-tab">
                        <table className="details-table">
                            <tbody>
                            {furniture.info.map((infoItem) => (
                                <tr key={infoItem.id}>
                                    <td className="details-key">{infoItem.title}</td>
                                    <td className="details-value">{infoItem.description}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div className="reviews-tab">
                        <button className="review-button" onClick={openReviewModal}>
                            Оставить отзыв
                        </button>
                        {hasReviews ? (
                            <>
                                {furniture.reviews.map((review) => (
                                    <div key={review.id} className="review-item">
                                        <div className="review-author">{review.author}</div>
                                        <div className="review-rating">{review.rating} ★</div>
                                        <div className="review-text">{review.review}</div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            <div className="no-reviews">
                                <p>Отзывов пока нет.</p>
                                <p>Будьте первым, кто оставил отзыв на {furniture.name}</p>
                                {!isAuth && <p>Для отправки отзыва вам необходимо авторизоваться</p>}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {lightboxOpen && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <div className="lightbox-container" onClick={(e) => e.stopPropagation()}>
                        <button className="close-lightbox" onClick={closeLightbox}>
                            ×
                        </button>
                        <img src={lightboxImage} alt={furniture.name} className="lightbox-image" />
                        <button className="lightbox-nav prev" onClick={prevImage}>
                            &#10094;
                        </button>
                        <button className="lightbox-nav next" onClick={nextImage}>
                            &#10095;
                        </button>
                        <div className="lightbox-counter">
                            {lightboxImageIndex + 1} / {furniture.images.length}
                        </div>
                    </div>
                </div>
            )}
            {reviewModalOpen && (
                <div className="review-modal-overlay" onClick={closeReviewModal}>
                    <div className="review-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Новый отзыв</h2>
                        {!isAuth ? (
                            <p style={{ color: 'red' }}>
                                Для отправки отзыва нужно авторизоваться.
                            </p>
                        ) : (
                            <form onSubmit={handleSubmitReview} className="new-review-form">
                                <div className="form-group">
                                    <label>Как вас зовут? *</label>
                                    <input
                                        type="text"
                                        value={reviewName}
                                        onChange={(e) => setReviewName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Ваша оценка *</label>
                                    <div className="rating-stars">{renderRatingStars()}</div>
                                </div>
                                <div className="form-group">
                                    <label>Ваш отзыв *</label>
                                    <textarea
                                        value={reviewText}
                                        onChange={(e) => setReviewText(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="submit-review-button">
                                    Отправить
                                </button>
                            </form>
                        )}
                        <button className="review-modal-close" onClick={closeReviewModal}>
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FurniturePage;
