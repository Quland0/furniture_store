import React, { useContext, useState, useEffect } from 'react';
import { BasketContext } from '../context/BasketContext';
import { FavoritesContext } from '../context/FavoritesContext';
import '../styles/Basket.css';
import favoriteIcon from "../assets/icons/favorite.svg";
import deleteIcon from "../assets/icons/delete.svg";

const Basket = ({ isAuth }) => {
    const { basket, removeFromBasket, updateQuantity, clearBasket } = useContext(BasketContext);
    const { favorites, addToFavorites, removeFromFavorites } = useContext(FavoritesContext);
    const [selectedItems, setSelectedItems] = useState([]);
    const totalPrice = basket.reduce((sum, item) => sum + item.price * item.quantity, 0);

    useEffect(() => {
        if (basket.length > 0) {
            setSelectedItems(basket.map(item => item.id));
        }
    }, [basket]);

    const toggleSelectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const removeSelectedItems = () => {
        selectedItems.forEach(id => removeFromBasket(id));
        setSelectedItems([]);
    };

    const handleFavoriteClick = (item) => {
        const isFavorite = favorites.some(p => p.id === item.id);
        if (isFavorite) {
            removeFromFavorites(item.id);
        } else {
            addToFavorites(item);
        }
    };

    const renderBasketItems = () => (
        <div className="basket-list">
            {basket.map((item) => (
                <div key={item.id} className="basket-item">
                    <input
                        type="checkbox"
                        className="basket-item-checkbox"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleSelectItem(item.id)}
                    />
                    <img
                        src={item.img || (item.images && item.images[0]) || '/placeholder-product.jpg'}
                        alt={item.name}
                        className="basket-item-image"
                    />
                    <div className="basket-item-info">
                        <h3>{item.name}</h3>
                        <p>
                            Производитель:{" "}
                            {typeof item.manufacturer === 'object'
                                ? item.manufacturer.name
                                : item.manufacturer}
                        </p>
                    </div>
                    <div className="basket-item-quantity">
                        <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>
                            -
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                            +
                        </button>
                    </div>
                    <div className="basket-item-price">
                        {(item.price * item.quantity).toLocaleString()} ₽
                        {item.quantity > 1 && (
                            <span className="item-price-per-unit">
                {item.price.toLocaleString()} ₽/шт
              </span>
                        )}
                    </div>
                    <div className="basket-item-actions">
                        <button
                            className={`favorite-button ${favorites.some(p => p.id === item.id) ? 'active' : ''}`}
                            onClick={() => handleFavoriteClick(item)}
                        >
                            <img src={favoriteIcon} alt="В избранное" />
                        </button>
                        <button className="delete-button" onClick={() => removeFromBasket(item.id)}>
                            <img src={deleteIcon} alt="Удалить" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    if (!isAuth) {
        return (
            <div className="basket-page">
                <h1>Корзина</h1>
                <p>
                    Войдите, чтобы мы сохранили ваши товары. Можно будет вернуться к ним с другого устройства.
                </p>
                {basket.length === 0 ? (
                    <p>Ваша корзина пуста.</p>
                ) : (
                    <>
                        {selectedItems.length > 0 && (
                            <button className="delete-selected-button" onClick={removeSelectedItems}>
                                Удалить выбранные
                            </button>
                        )}
                        <div className="basket-content">
                            <div className="basket-list">{renderBasketItems()}</div>
                            <div className="basket-summary">
                                <h2>
                                    Итого <span>{totalPrice.toLocaleString()} ₽</span>
                                </h2>
                                <button className="checkout-button">Оформить заказ</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="basket-page">
            <h1>Корзина</h1>
            {basket.length === 0 ? (
                <p>Ваша корзина пуста.</p>
            ) : (
                <>
                    {selectedItems.length > 0 && (
                        <button className="delete-selected-button" onClick={removeSelectedItems}>
                            Удалить выбранные
                        </button>
                    )}
                    <div className="basket-content">
                        <div className="basket-list">{renderBasketItems()}</div>
                        <div className="basket-summary">
                            <h2>
                                Итого <span>{totalPrice.toLocaleString()} ₽</span>
                            </h2>
                            <button className="checkout-button">Оформить заказ</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Basket;
