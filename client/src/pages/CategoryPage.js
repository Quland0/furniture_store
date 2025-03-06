import React, { useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Context } from '../index';
import ProductCard from '../components/ProductCard';
import '../styles/CategoryPage.css';
import { Range, getTrackBackground } from 'react-range';

const CategoryPage = () => {
    const { categoryName } = useParams();
    const { furniture } = useContext(Context);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState(null);
    const [isManufacturerDropdownOpen, setIsManufacturerDropdownOpen] = useState(false);
    const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
    const [categoryMinPrice, setCategoryMinPrice] = useState(0);
    const [categoryMaxPrice, setCategoryMaxPrice] = useState(0);
    const [rangeValues, setRangeValues] = useState([0, 0]);
    const [sortType, setSortType] = useState('default');
    const location = useLocation();
    const priceFilterRef = useRef(null);
    const manufacturerFilterRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isPriceDropdownOpen &&
                !priceFilterRef.current?.contains(event.target)) {
                setIsPriceDropdownOpen(false);
            }

            if (isManufacturerDropdownOpen &&
                !manufacturerFilterRef.current?.contains(event.target)) {
                setIsManufacturerDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPriceDropdownOpen, isManufacturerDropdownOpen]);

    const getProductsInCategory = useCallback(() => {
        let products = furniture.Furnitures;
        if (categoryName === 'new') {
            products = products.filter(product => product.new);
        } else {
            products = products.filter(product => {
                return Array.isArray(product.categories)
                    ? product.categories.includes(categoryName)
                    : product.category === categoryName;
            });
        }
        return products;
    }, [categoryName, furniture.Furnitures]);

    useEffect(() => {
        const productsInCat = getProductsInCategory();
        if (productsInCat.length > 0) {
            const prices = productsInCat.map(p => p.price);
            setCategoryMinPrice(Math.min(...prices));
            setCategoryMaxPrice(Math.max(...prices));
            setRangeValues([Math.min(...prices), Math.max(...prices)]);
        } else {
            setCategoryMinPrice(0);
            setCategoryMaxPrice(0);
            setRangeValues([0, 0]);
        }
        setSelectedManufacturer(null);
    }, [getProductsInCategory]);

    const [manufacturersInCategory, manufacturerCountMap] = useMemo(() => {
        const productsInCat = getProductsInCategory();
        const manufacturers = [...new Set(productsInCat.map(p => p.manufacturer).filter(Boolean))];
        const countMap = productsInCat.reduce((acc, item) => {
            item.manufacturer && (acc[item.manufacturer] = (acc[item.manufacturer] || 0) + 1);
            return acc;
        }, {});
        return [manufacturers, countMap];
    }, [getProductsInCategory]);

    useEffect(() => {
        let finalProducts = getProductsInCategory();

        if (selectedManufacturer) {
            finalProducts = finalProducts.filter(p => p.manufacturer === selectedManufacturer);
        }

        finalProducts = finalProducts.filter(p =>
            p.price >= rangeValues[0] && p.price <= rangeValues[1]
        );

        switch(sortType) {
            case 'popular':
                finalProducts.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
                break;
            case 'price_asc':
                finalProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                finalProducts.sort((a, b) => b.price - a.price);
                break;
            default:
                break;
        }

        setFilteredProducts(finalProducts);
    }, [getProductsInCategory, selectedManufacturer, rangeValues, location, sortType]);

    const handleSliderChange = (values) => setRangeValues(values);

    const handleMinInputChange = (e) => {
        let val = Math.max(categoryMinPrice, Math.min(rangeValues[1], parseInt(e.target.value) || 0));
        setRangeValues([val, rangeValues[1]]);
    };

    const handleMaxInputChange = (e) => {
        let val = Math.min(categoryMaxPrice, Math.max(rangeValues[0], parseInt(e.target.value) || 0));
        setRangeValues([rangeValues[0], val]);
    };

    const SortButton = ({ type, label }) => (
        <button
            onClick={() => setSortType(type)}
            style={{
                color: sortType === type ? '#2D2B2B' : '#A6A6A6',
                fontWeight:'600',
                marginRight: '15px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px'
            }}
        >
            {label}
        </button>
    );

    return (
        <div className="category-page">
            <h1 className="category-title">
                {categoryName === 'new' ? 'Новинки' : `Мебель для ${categoryName}`}
            </h1>

            {/* Фильтр по цене */}
            <div className="filter-item" ref={priceFilterRef}>
                <button
                    onClick={() => {
                        setIsPriceDropdownOpen(!isPriceDropdownOpen);
                        setIsManufacturerDropdownOpen(false);
                    }}
                    className="price-filter-button"
                    aria-expanded={isPriceDropdownOpen}
                >
                    Цена
                </button>
                {isPriceDropdownOpen && (
                    <div className="filter-dropdown price-dropdown">
                        <div className="range-slider-wrapper">
                            <Range
                                step={1}
                                min={categoryMinPrice}
                                max={categoryMaxPrice}
                                values={rangeValues}
                                onChange={handleSliderChange}
                                renderTrack={({ props, children }) => (
                                    <div {...props} style={{
                                        ...props.style,
                                        height: '4px',
                                        width: '100%',
                                        margin: '15px 0',
                                        background: getTrackBackground({
                                            values: rangeValues,
                                            colors: ['#e0e0e0', '#9e7f45', '#e0e0e0'],
                                            min: categoryMinPrice,
                                            max: categoryMaxPrice
                                        })
                                    }}>
                                        {children}
                                    </div>
                                )}
                                renderThumb={({ props }) => (
                                    <div
                                        {...props}
                                        style={{
                                            ...props.style,
                                            height: '24px',
                                            width: '24px',
                                            borderRadius: '50%',
                                            backgroundColor: '#9e7f45',
                                            border: '3px solid white',
                                            boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
                                            cursor: 'pointer',
                                        }}
                                    />
                                )}
                            />
                        </div>
                        <div className="price-inputs">
                            <div className="price-input-group">
                                <span className="price-input-label">от</span>
                                <input
                                    type="number"
                                    value={rangeValues[0]}
                                    onChange={handleMinInputChange}
                                />
                            </div>
                            <span className="price-input-separator">—</span>
                            <div className="price-input-group">
                                <span className="price-input-label">до</span>
                                <input
                                    type="number"
                                    value={rangeValues[1]}
                                    onChange={handleMaxInputChange}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="filter-item" ref={manufacturerFilterRef}>
                <button
                    onClick={() => {
                        setIsManufacturerDropdownOpen(!isManufacturerDropdownOpen);
                        setIsPriceDropdownOpen(false);
                    }}
                    aria-expanded={isManufacturerDropdownOpen}
                >
                    {selectedManufacturer ? `Производитель: ${selectedManufacturer}` : 'Производитель'}
                </button>
                {isManufacturerDropdownOpen && (
                    <div className="filter-dropdown">
                        {manufacturersInCategory.map((m) => (
                            <div
                                key={m}
                                className={selectedManufacturer === m ? 'active' : ''}
                                onClick={() => {
                                    setSelectedManufacturer(m);
                                    setIsManufacturerDropdownOpen(false);
                                }}
                            >
                                {m} ({manufacturerCountMap[m] || 0})
                            </div>
                        ))}
                        <div onClick={() => setSelectedManufacturer(null)}>
                            Все производители
                        </div>
                    </div>
                )}
            </div>

            <div className="sorting-container">
                <SortButton type="default" label="Сначала популярные" />
                <SortButton type="price_asc" label="Сначала дешевле" />
                <SortButton type="price_desc" label="Сначала дороже" />
            </div>

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