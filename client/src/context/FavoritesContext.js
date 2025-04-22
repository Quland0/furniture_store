import React, { createContext, useState, useEffect } from 'react';

const fakeServerFetchFavorites = () => {
    return [{ id: 1, name: 'Товар из сервера', price: 1000 }];
};
const fakeServerSaveFavorites = (favorites) => {
    console.log('Синхронизация с сервером:', favorites);
};

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children, isAuth }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (isAuth) {
            const serverFav = fakeServerFetchFavorites();
            setFavorites(serverFav);
        } else {
            const localFav = JSON.parse(localStorage.getItem('favorites')) || [];
            setFavorites(localFav);
        }
    }, [isAuth]);

    const addToFavorites = (product) => {
        setFavorites((prev) => {

            if (prev.find((p) => p.id === product.id)) return prev;

            const newList = [...prev, product];

            if (!isAuth) {
                localStorage.setItem('favorites', JSON.stringify(newList));
            } else {
                // Авторизован: отправляем на сервер
                fakeServerSaveFavorites(newList);
            }

            return newList;
        });
    };

    const removeFromFavorites = (productId) => {
        setFavorites((prev) => {
            const newList = prev.filter((p) => p.id !== productId);

            if (!isAuth) {
                localStorage.setItem('favorites', JSON.stringify(newList));
            } else {
                fakeServerSaveFavorites(newList);
            }
            return newList;
        });
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};
