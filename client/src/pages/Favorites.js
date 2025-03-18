import React, { useContext } from 'react';
import { FavoritesContext } from '../context/FavoritesContext';
import ProductCard from '../components/ProductCard';
import '../styles/Favorites.css';

const Favorites = ({ isAuth }) => {
    const { favorites } = useContext(FavoritesContext);

    return (
        <div className="favorites-page">
            <h1>Избранные товары</h1>

            {!isAuth && (
                <p style={{ color: '#666', marginBottom: '20px' }}>
                    Войдите, чтобы мы сохранили ваши товары и вы могли вернуться к ним с другого устройства.
                </p>
            )}
            {favorites.length === 0 ? (
                <p>У вас пока нет избранных товаров.</p>
            ) : (
                <div className="favorites-grid">
                    {favorites.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;
