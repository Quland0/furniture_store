import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import UserStore from './store/UserStore';
import FurnitureStore from './store/FurnitureStore';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FavoritesProvider } from './context/FavoritesContext';
import { BasketProvider } from './context/BasketContext';
import { OrderProvider } from './context/OrderContext';

export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Context.Provider
        value={{
            user: new UserStore(),
            furniture: new FurnitureStore(),
        }}
    >
        <FavoritesProvider isAuth={false}>
            <BasketProvider isAuth={false}>
                <OrderProvider>
                    <App />
                </OrderProvider>
            </BasketProvider>
        </FavoritesProvider>
    </Context.Provider>
);
