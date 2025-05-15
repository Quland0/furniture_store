import React, { createContext, useState, useEffect } from 'react';
import {
    fetchFavorites as apiFetch,
    addToFavorites as apiAdd,
    removeFromFavorites as apiRemove
} from '../http/favoritesAPI';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children, isAuth }) => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        if (isAuth) {
            apiFetch().then(setFavorites).catch(console.error);
        } else {
            const local = JSON.parse(localStorage.getItem('favorites')) || [];
            setFavorites(local);
        }
    }, [isAuth]);

    const addToFavorites = async (product) => {
        if (!favorites.find(p => p.id === product.id)) {
            const newList = [...favorites, product];
            setFavorites(newList);

            if (isAuth) {
                await apiAdd(product.id);
            } else {
                localStorage.setItem('favorites', JSON.stringify(newList));
            }
        }
    };

    const removeFromFavorites = async (productId) => {
        const newList = favorites.filter(p => p.id !== productId);
        setFavorites(newList);

        if (isAuth) {
            await apiRemove(productId);
        } else {
            localStorage.setItem('favorites', JSON.stringify(newList));
        }
    };

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites }}>
            {children}
        </FavoritesContext.Provider>
    );
};
