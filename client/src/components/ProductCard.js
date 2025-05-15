import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';
import favoriteIcon from '../assets/icons/favorite.svg';
import { FavoritesContext } from '../context/FavoritesContext';
import { BasketContext } from '../context/BasketContext';

const ProductCard = ({ product }) => {
    const { favorites, addToFavorites, removeFromFavorites } = useContext(FavoritesContext);
    const { basket, addToBasket, removeFromBasket } = useContext(BasketContext);

    const isFavorite = favorites.some(p => p.id === product.id);
    const isInCart = basket.some(item => item.id === product.id);

    const handleAddToFavorite = () => {
        if (isFavorite) {
            removeFromFavorites(product.id);
        } else {
            addToFavorites(product);
        }
    };

    const handleBasketClick = () => {
        if (isInCart) {
            removeFromBasket(product.id);
        } else {
            addToBasket(product);
        }
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(<span key={i} className="star filled">★</span>);
            } else if (rating >= i - 0.5) {
                stars.push(<span key={i} className="star half-filled">★</span>);
            } else {
                stars.push(<span key={i} className="star">★</span>);
            }
        }
        return stars;
    };
    const getReviewWord = (count) => {
        const mod100 = count % 100;
        if (mod100 >= 11 && mod100 <= 14) return 'отзывов';
        const mod10 = count % 10;
        if (mod10 === 1) return 'отзыв';
        if (mod10 >= 2 && mod10 <= 4) return 'отзыва';
        return 'отзывов';
    };
    const reviewsCount = product.reviewsCount || 0;
    const avgRating    = product.rating      || 0;
    const sortedImages = product.images?.slice().sort((a, b) => a.order - b.order);
    return (
        <div className="product-card">
            <div className="product-image-container">
                <Link to={`/furniture/${product.id}`}>
                    <img
                        src={
                            sortedImages?.[0]
                                ? `${process.env.REACT_APP_API_URL}/${sortedImages[0].img}`
                                : '/placeholder-product.jpg'
                        }
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                    />
                </Link>
            </div>

            <div className="product-info">
                <h3 className="product-name">
                    <Link to={`/furniture/${product.id}`} style={{textDecoration: 'none', color: 'inherit'}}>
                        {product.name}
                    </Link>
                </h3>
                <div className="product-rating">
                    <div className="stars">
                        {renderStars(avgRating)}
                    </div>
                    <span className="reviews-count">
                        ({reviewsCount} {getReviewWord(reviewsCount)})
                    </span>
                </div>
            </div>
            <div className="product-footer">
        <span className="product-price">
          {new Intl.NumberFormat('ru-RU').format(product.price)} ₽
        </span>
                <div className="product-actions">
                    <button
                        className={`add-to-cart-button ${isInCart ? 'active' : ''}`}
                        onClick={handleBasketClick}
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
    );
};

export default ProductCard;
