import React, { useContext, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Context } from '../index';
import ProductCard from '../components/ProductCard';
import '../styles/CategoryPage.css';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const { furniture } = useContext(Context);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const location = useLocation();

    useEffect(() => {
        let products = furniture.Furnitures;

        if (categoryName === 'new') {
            products = products.filter(product => product.new);
        } else {
            products = products.filter(product => {
                if (product.categories && Array.isArray(product.categories)) {
                    return product.categories.includes(categoryName);
                } else if (product.category) {
                    return product.category === categoryName;
                }
                return false;
            });
        }
        products = products.sort((a, b) => b.id - a.id);

        setFilteredProducts(products);
    }, [categoryName, furniture.Furnitures, location]);

    return (
        <div className="category-page">
            <h1 className="category-title">
                {categoryName === 'new' ? 'Новинки' : `Мебель для ${categoryName}`}
            </h1>
            <div className="category-grid">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p>В данной категории пока нет товаров.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
