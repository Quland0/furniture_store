import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { Context } from '../index';
import { Link } from 'react-router-dom';
import '../styles/NewProductSection.css';
import ProductCard from './ProductCard';

const NewProductSection = observer(() => {
    const { furniture } = useContext(Context);
    const newProducts = furniture.Furnitures.filter(product => product.new);
    const lastFourNewProducts = newProducts
        .sort((a, b) => b.id - a.id)
        .slice(0, 4);

    return (
        <section className="product-section">
            <div className="section-header">
                <h2 className="section-title">Новинки</h2>
                <Link to="/category/new" className="view-all-link">
                    Смотреть все новинки →
                </Link>
            </div>

            <div className="product-grid">
                {lastFourNewProducts.length > 0 ? (
                    lastFourNewProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
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
