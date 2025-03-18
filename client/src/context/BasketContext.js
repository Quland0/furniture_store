import React, { createContext, useState, useEffect } from 'react';

// Имитация API для серверной логики
const fakeServerFetchBasket = () => {

    return [
        { id: 1, name: 'Спальня "Виктория" 6-ти дверная', price: 130000, manufacturer: 'Milana group', quantity: 2 }
    ];
};

const fakeServerSaveBasket = (basketItems) => {
    console.log('Сохраняем корзину на сервере:', basketItems);
};

export const BasketContext = createContext();

export const BasketProvider = ({ children, isAuth }) => {
    const [basket, setBasket] = useState([]);

    useEffect(() => {
        if (isAuth) {
            const serverBasket = fakeServerFetchBasket();
            setBasket(serverBasket);
        } else {
            const localBasket = JSON.parse(localStorage.getItem('basket')) || [];
            setBasket(localBasket);
        }
    }, [isAuth]);

    const syncBasket = (newBasket) => {
        if (isAuth) {
            fakeServerSaveBasket(newBasket);
        } else {
            localStorage.setItem('basket', JSON.stringify(newBasket));
        }
    };

    const addToBasket = (product, quantity = 1) => {
        setBasket((prev) => {
            const existingItem = prev.find((item) => item.id === product.id);
            let updatedBasket;

            if (existingItem) {
                updatedBasket = prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                updatedBasket = [...prev, { ...product, quantity }];
            }

            syncBasket(updatedBasket);
            return updatedBasket;
        });
    };

    const removeFromBasket = (productId) => {
        setBasket((prev) => {
            const updatedBasket = prev.filter((item) => item.id !== productId);
            syncBasket(updatedBasket);
            return updatedBasket;
        });
    };

    const updateQuantity = (productId, newQuantity) => {
        setBasket((prev) => {
            const updatedBasket = prev.map((item) =>
                item.id === productId ? { ...item, quantity: newQuantity } : item
            );
            syncBasket(updatedBasket);
            return updatedBasket;
        });
    };

    const clearBasket = () => {
        setBasket([]);
        syncBasket([]);
    };

    return (
        <BasketContext.Provider value={{ basket, addToBasket, removeFromBasket, updateQuantity, clearBasket }}>
            {children}
        </BasketContext.Provider>
    );
};