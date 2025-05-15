import React, { createContext, useState, useEffect } from 'react';
import {
    fetchBasket    as fetchBasketFromServer,
    addToBasket    as addToBasketOnServer,
    removeFromBasket as removeFromBasketOnServer,
    updateBasketQuantity
} from '../http/basketAPI';

export const BasketContext = createContext();

export const BasketProvider = ({ children, isAuth }) => {
    const [basket, setBasket] = useState([]);

    useEffect(() => {
        if (isAuth) {
            fetchBasketFromServer()
                .then(serverBasket => setBasket(serverBasket))
                .catch(console.error);
        } else {
            const raw = JSON.parse(localStorage.getItem('basket')) || [];
            const normalized = raw.map(item => {
                const fileName = item.images?.[0]?.img;
                const url = fileName
                    ? `${process.env.REACT_APP_API_URL}/${fileName}`
                    : '/placeholder-product.jpg';
            return {
                basketItemId: item.id,
                id:           item.id,
                name:         item.name,
                price:        item.price,
                quantity:     item.quantity,
                img:          url,
                manufacturer: item.manufacturer,
            };
        });
        setBasket(normalized);
    }
    }, [isAuth]);

    const addToBasket = (product, quantity = 1) => {
        setBasket(prev => {
            const existing = prev.find(item => item.id === product.id);
            let updatedBasket;

            if (existing) {
                updatedBasket = prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                const fileName = product.images?.[0]?.img;
                const url = fileName
                    ? `${process.env.REACT_APP_API_URL}/${fileName}`
                    : '/placeholder-product.jpg';
                const norm = {
                    basketItemId: product.id,
                    id:           product.id,
                    name:         product.name,
                    price:        product.price,
                    quantity,
                    img:          url,
                    manufacturer: product.manufacturer
                };
                updatedBasket = [...prev, norm];
            }

            if (isAuth) {
                addToBasketOnServer(product.id, quantity).catch(console.error);
            } else {
                localStorage.setItem('basket', JSON.stringify(updatedBasket));
            }

            return updatedBasket;
        });
    };

    const removeFromBasket = (productId) => {
        setBasket(prev => {
            const updatedBasket = prev.filter(item => item.id !== productId);

            if (isAuth) {
                removeFromBasketOnServer(productId).catch(console.error);
            } else {
                localStorage.setItem('basket', JSON.stringify(updatedBasket));
            }

            return updatedBasket;
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        setBasket(prev => {
            const updatedBasket = prev.map(item =>
                item.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );

            if (isAuth) {
                updateBasketQuantity(productId, newQuantity).catch(console.error);
            } else {
                localStorage.setItem('basket', JSON.stringify(updatedBasket));
            }

            return updatedBasket;
        });
    };

    const clearBasket = () => {
        setBasket([]);
        if (isAuth) {

        } else {
            localStorage.removeItem('basket');
        }
    };

    return (
        <BasketContext.Provider value={{
            basket,
            addToBasket,
            removeFromBasket,
            updateQuantity,
            clearBasket
        }}>
            {children}
        </BasketContext.Provider>
    );
};
