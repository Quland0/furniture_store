import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductCard.css';
import favoriteIcon from '../assets/icons/favorite.svg';

const ProductCard = ({ product }) => {
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

    return (
        <div className="product-card">
            <div className="product-image-container">
                <Link to={`/furniture/${product.id}`}>
                    <img
                        src={product.img || '/placeholder-product.jpg'}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                    />
                </Link>
            </div>

            <div className="product-info">
                <h3 className="product-name">
                    <Link to={`/furniture/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {product.name}
                    </Link>
                </h3>
                <div className="product-rating">
                    <div className="stars">
                        {renderStars(product.rating)}
                    </div>
                    <span className="reviews-count">({product.reviewsCount} отзывов)</span>
                </div>
            </div>
            <div className="product-footer">
        <span className="product-price">
          {new Intl.NumberFormat('ru-RU').format(product.price)} ₽
        </span>
                <div className="product-actions">
                    <button
                        className="add-to-cart-button"
                        disabled={product.inCart}
                    >
                        {product.inCart ? 'В корзине' : 'В корзину'}
                    </button>
                    <button className="favorite-button">
                        <img src={favoriteIcon} alt="Избранное" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
