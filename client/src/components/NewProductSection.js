import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { Link } from 'react-router-dom';
import '../styles/NewProductSection.css';
import favoriteIcon from "../assets/icons/favorite.svg";

const NewProductSection = observer(() => {
    const { furniture } = useContext(Context);
    const newProducts = furniture.Furnitures.filter(product => product.new);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push(
                    <span key={i} className="star filled">★</span>
                );
            } else if (rating >= i - 0.5) {
                stars.push(
                    <span key={i} className="star half-filled">★</span>
                );
            } else {
                stars.push(
                    <span key={i} className="star">★</span>
                );
            }
        }
        return stars;
    };

    return (
        <section className="product-section">
            <div className="section-header">
                <h2 className="section-title">Новинки</h2>
                <Link to="/new-arrivals" className="view-all-link">
                    Смотреть все новинки →
                </Link>
            </div>

            <div className="product-grid">
                {newProducts.length > 0 ? (
                    newProducts.map(product => (
                        <div className="product-card" key={product.id}>
                            <div className="product-image-container">
                                <img
                                    src={product.img || '/placeholder-product.jpg'}
                                    alt={product.name}
                                    className="product-image"
                                    loading="lazy"
                                />
                            </div>

                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <div className="product-rating">
                                    <div className="stars">
                                        {renderStars(product.rating)}
                                    </div>
                                    <span className="reviews-count">
                                        ({product.reviewsCount} отзывов)
                                    </span>
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
                        </div>
                    ))
                ) : (
                    <div className="empty-state">
                        <p>Новых поступлений пока нет</p>
                        <Link to="/catalog" className="browse-button">
                            Перейти в каталог
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
});

export default NewProductSection;
