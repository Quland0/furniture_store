import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/FurniturePage.css';
import favoriteIcon from '../assets/icons/favorite.svg';
import { BasketContext } from '../context/BasketContext';
import {addRating, fetchOneFurniture} from '../http/FurnitureAPI';

const FurniturePage = () => {
    const { id } = useParams();

    const isAuth = true;
    const [furniture, setFurniture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [images, setImages] = useState([]);
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

    const reviews = furniture?.reviews || [];
    const manufacturerName = furniture?.manufacturer?.name || '—';

    const reviewsCount = reviews.length;
    const avgRating = reviewsCount > 0
        ? (reviews.reduce((sum, r) => sum + r.rate, 0) / reviewsCount).toFixed(1)
        : 0;
    const getReviewWord = (count) => {
        const mod100 = count % 100;
        if (mod100 >= 11 && mod100 <= 14) return 'отзывов';
        const mod10 = count % 10;
        if (mod10 === 1) return 'отзыв';
        if (mod10 >= 2 && mod10 <= 4) return 'отзыва';
        return 'отзывов';
    };
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
        const index = images.findIndex(img => img === selectedImage);
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
            const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
            setLightboxImage(images[newIndex]);
            return newIndex;
        });
    }, [images]);

    const nextImage = useCallback((e) => {
        e.stopPropagation();
        setLightboxImageIndex((prevIndex) => {
            const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
            setLightboxImage(images[newIndex]);
            return newIndex;
        });
    }, [images]);

    const handleKeyDown = useCallback((e) => {
        if (!lightboxOpen) return;
        if (e.key === 'ArrowLeft') prevImage(e);
        else if (e.key === 'ArrowRight') nextImage(e);
        else if (e.key === 'Escape') closeLightbox();
    }, [lightboxOpen, prevImage, nextImage, closeLightbox]);


    useEffect(() => {
        const fetchFurniture = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/furniture/${id}`);
                if (!response.ok) throw new Error('Ошибка при получении данных');
                const data = await response.json();

                const imagesWithUrls = data.images.map(img => ({
                    ...img,
                    url: `${process.env.REACT_APP_API_URL}/${img.img}`
                }));

                setFurniture(data);
                setImages(imagesWithUrls);
                setSelectedImage(imagesWithUrls[0]?.url || null);
                console.log('images state →', imagesWithUrls);
                console.log('selectedImage →', imagesWithUrls[0]?.url);
            } catch (err) {
                console.error(err);
                setError(err.message || 'Не удалось загрузить товар');
            } finally {
                setLoading(false);
            }
        };

        fetchFurniture();
    }, [id]);

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

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewName || !reviewRating || !reviewText) {
            console.log('Заполните все поля');
            return;
        }
        console.log('Отзыв отправлен:', { reviewName, reviewRating, reviewText });
        try {
                await addRating({
                    furnitureId: id,
                    rate: reviewRating,
                    name: reviewName,
                    review: reviewText
                });
            const updated = await fetchOneFurniture(id);
            setFurniture(updated);
                console.log('Отзыв успешно отправлен на сервер');
            } catch (err) {
                console.error('Ошибка при отправке отзыва:', err);
            }
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

    const hasReviews = reviews.length > 0;

    if (loading) return <div className="furniture-page">Загрузка...</div>;
    if (error)   return <div className="furniture-page">Ошибка: {error}</div>;
    if (!furniture) return <div className="furniture-page">Товар не найден</div>;
    return (
        <div className="furniture-page">
            {/* Галерея и информация */}
            <div className="furniture-page-top">
                <div className="furniture-gallery">
                    <div className="furniture-main-image" onClick={openLightbox}>
                        <img src={selectedImage} alt={furniture.name}/>
                    </div>
                    <div className="furniture-thumbnails">
                        {images.map((imgObj, idx) => (
                            <img
                                key={idx}
                                src={imgObj.url}
                                alt={`${furniture.name} вариант ${idx + 1}`}
                                className={selectedImage === imgObj.url ? 'thumbnail active' : 'thumbnail'}
                                onClick={() => setSelectedImage(imgObj.url)}
                            />
                        ))}
                    </div>
                </div>

                <div className="furniture-info">
                    <h1>{furniture.name}</h1>
                    <div className="furniture-rating">
                        <span className="stars">{avgRating} ★</span>
                        <span className="reviews-count">
                            ({reviewsCount} {getReviewWord(reviewsCount)})
                        </span>
                    </div>
                    <div className="furniture-price">
                        {furniture.price.toLocaleString()} ₽
                    </div>
                    <p className="manufacturer">Производитель: {manufacturerName}</p>

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
                            <img src={favoriteIcon} alt="Избранное"/>
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
                    Отзывы ({reviews.length})
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
                                {reviews.map((review) => (
                                    <div key={review.id} className="review-item">
                                        <div className="review-author">{review.name}</div>
                                        <div className="review-rating">{review.rate} ★</div>
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
                            {lightboxImageIndex + 1} / {images.length}
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
