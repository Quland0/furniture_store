import React, { useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Context } from '../index';
import ProductCard from '../components/ProductCard';
import '../styles/CategoryPage.css';
import { Range, getTrackBackground } from 'react-range';
import { fetchTypes, fetchFurniture } from '../http/FurnitureAPI';

const ITEMS_PER_PAGE = 24;

function getDisplayedPages(currentPage, totalPages) {
    const visiblePages = [];
    const boundaryPages = 2;
    const aroundCurrent = 2;

    for (let i = 1; i <= Math.min(boundaryPages, totalPages); i++) {
        visiblePages.push(i);
    }

    let start = Math.max(boundaryPages + 1, currentPage - aroundCurrent);
    let end = Math.min(totalPages - boundaryPages, currentPage + aroundCurrent);

    if (start > boundaryPages + 1) {
        visiblePages.push('...');
    }

    for (let i = start; i <= end; i++) {
        visiblePages.push(i);
    }

    if (end < totalPages - boundaryPages) {
        visiblePages.push('...');
    }

    for (let i = Math.max(totalPages - boundaryPages + 1, boundaryPages + 1); i <= totalPages; i++) {
        if (!visiblePages.includes(i)) {
            visiblePages.push(i);
        }
    }

    return visiblePages;
}

const CategoryPage = () => {
    const { categoryName, subcategory, pageNumber } = useParams();
    const location = useLocation();
    const { furniture } = useContext(Context);

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [paginatedProducts, setPaginatedProducts] = useState([]);
    const [selectedManufacturer, setSelectedManufacturer] = useState(null);
    const [isManufacturerDropdownOpen, setIsManufacturerDropdownOpen] = useState(false);
    const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
    const [categoryMinPrice, setCategoryMinPrice] = useState(0);
    const [categoryMaxPrice, setCategoryMaxPrice] = useState(1000);
    const [rangeValues, setRangeValues] = useState([0, 1000]);
    const [sortType, setSortType] = useState('default');
    const [types, setTypes] = useState([]);

    const priceFilterRef = useRef(null);
    const manufacturerFilterRef = useRef(null);
    const currentPage = pageNumber ? parseInt(pageNumber, 10) : 1;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentPage, location.pathname]);

    useEffect(() => {
        fetchTypes()
            .then(data => setTypes(data))
            .catch(err => console.error('Ошибка загрузки типов:', err));
        fetchTypes()
            .then(data => setTypes(data))
            .catch(err => console.error('Ошибка загрузки типов:', err));
        fetchFurniture()
            .then(data => {
                const items = data.rows || data;
                furniture.setFurnitures(items);
            })
            .catch(err => console.error('Ошибка загрузки товаров:', err));
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isPriceDropdownOpen && !priceFilterRef.current?.contains(event.target)) {
                setIsPriceDropdownOpen(false);
            }
            if (isManufacturerDropdownOpen && !manufacturerFilterRef.current?.contains(event.target)) {
                setIsManufacturerDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPriceDropdownOpen, isManufacturerDropdownOpen]);

    const getProductsInCategory = useCallback(() => {
        let products = furniture.furnitures.filter(p => !p.hidden) || [];

        if (categoryName === 'new') {
            products = products.filter(product => product.new);
        } else {
            products = products.filter(product =>
                product.types?.some(type => type.id.toString() === categoryName.toString())
            );
        }

        if (subcategory) {
            products = products.filter(product =>
                product.subtype?.name === subcategory
            );
        }

        return products;
    }, [categoryName, subcategory, furniture.furnitures]);

    useEffect(() => {
        const productsInCat = getProductsInCategory();

        if (productsInCat.length > 0) {
            const prices = productsInCat.map(p => p.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            if (minPrice === maxPrice) {
                setCategoryMinPrice(minPrice > 50 ? minPrice - 50 : 0);
                setCategoryMaxPrice(maxPrice + 50);
                setRangeValues([minPrice > 50 ? minPrice - 50 : 0, maxPrice + 50]);
            } else {
                setCategoryMinPrice(minPrice);
                setCategoryMaxPrice(maxPrice);
                setRangeValues([minPrice, maxPrice]);
            }
        } else {
            setCategoryMinPrice(0);
            setCategoryMaxPrice(1000);
            setRangeValues([0, 1000]);
        }
        setSelectedManufacturer(null);
    }, [getProductsInCategory]);

    const [manufacturersInCategory, manufacturerCountMap] = useMemo(() => {
        const productsInCat = getProductsInCategory();

        const manufacturers = [...new Set(productsInCat.map(p => p.manufacturer).filter(Boolean))];
        const countMap = productsInCat.reduce((acc, item) => {
            if (item.manufacturer) {
                acc[item.manufacturer] = (acc[item.manufacturer] || 0) + 1;
            }
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

        switch (sortType) {
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

    useEffect(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        setPaginatedProducts(filteredProducts.slice(startIndex, endIndex));
    }, [filteredProducts, currentPage]);

    const getPageTitle = () => {
        if (categoryName === 'new') return 'Новинки';
        if (subcategory) return subcategory;
        const type = types.find(t => t.id.toString() === categoryName.toString());
        return type ? type.name : categoryName;
    };

    const headerTitle = getPageTitle();
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const shouldRenderSlider = categoryMinPrice < categoryMaxPrice;

    const makePageLink = (page) => {
        if (subcategory) {
            return `/category/${categoryName}/${subcategory}/page/${page}`;
        }
        return `/category/${categoryName}/page/${page}`;
    };

    const handleSliderChange = (values) => setRangeValues(values);

    const handleMinInputChange = (e) => {
        let val = parseInt(e.target.value, 10) || 0;
        if (val < categoryMinPrice) val = categoryMinPrice;
        if (val > rangeValues[1] - 1) val = rangeValues[1] - 1;
        setRangeValues([val, rangeValues[1]]);
    };

    const handleMaxInputChange = (e) => {
        let val = parseInt(e.target.value, 10) || 0;
        if (val > categoryMaxPrice) val = categoryMaxPrice;
        if (val < rangeValues[0] + 1) val = rangeValues[0] + 1;
        setRangeValues([rangeValues[0], val]);
    };
    console.log('Текущий categoryName:', categoryName);
    console.log('Типы продуктов:', furniture.furnitures.map(p => p.typeId));
    const SortButton = ({ type, label }) => (
        <button
            onClick={() => setSortType(type)}
            style={{
                color: sortType === type ? '#2D2B2B' : '#A6A6A6',
                fontWeight: '600',
                marginRight: '15px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
            }}
        >
            {label}
        </button>

    );

    return (

        <div className="category-page">
            <h1 className="category-title">{headerTitle}</h1>

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
                        {shouldRenderSlider && (
                            <div className="range-slider-wrapper">
                                <Range
                                    step={1}
                                    min={categoryMinPrice}
                                    max={categoryMaxPrice}
                                    values={rangeValues}
                                    onChange={handleSliderChange}
                                    renderTrack={({ props, children }) => (
                                        <div
                                            {...props}
                                            style={{
                                                ...props.style,
                                                height: '4px',
                                                width: '100%',
                                                margin: '15px 0',
                                                background: getTrackBackground({
                                                    values: rangeValues,
                                                    colors: ['#e0e0e0', '#9e7f45', '#e0e0e0'],
                                                    min: categoryMinPrice,
                                                    max: categoryMaxPrice,
                                                }),
                                            }}
                                        >
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
                        )}
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
                        <div
                            onClick={() => {
                                setSelectedManufacturer(null);
                                setIsManufacturerDropdownOpen(false);
                            }}
                        >
                            Все производители
                        </div>
                    </div>
                )}
            </div>

            <div className="sorting-container">
                <SortButton type="popular" label="Сначала популярные" />
                <SortButton type="price_asc" label="Сначала дешевле" />
                <SortButton type="price_desc" label="Сначала дороже" />
            </div>

            <div className="category-grid">
                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p>В данной категории пока нет товаров.</p>
                )}
            </div>

            {filteredProducts.length > ITEMS_PER_PAGE && (
                <div className="pagination-container">
                    <div className="pagination-content">
                        <Link
                            to={makePageLink(currentPage - 1)}
                            className={`pagination-arrow ${currentPage <= 1 ? 'disabled' : ''}`}
                        >
                            ← НАЗАД
                        </Link>

                        <div className="page-numbers">
                            {getDisplayedPages(currentPage, totalPages).map((page, index) => {
                                if (page === '...') {
                                    return (
                                        <span key={`dots-${index}`} className="dots">
                ...
              </span>
                                    );
                                }

                                return (
                                    <Link
                                        key={page}
                                        to={makePageLink(page)}
                                        className={`page-number ${currentPage === page ? 'active' : ''}`}
                                    >
                                        {page}
                                    </Link>
                                );
                            })}
                        </div>

                        <Link
                            to={makePageLink(currentPage + 1)}
                            className={`pagination-arrow ${currentPage >= totalPages ? 'disabled' : ''}`}
                        >
                            ВПЕРЁД →
                        </Link>
                    </div>
                </div>
            )}

</div>
)
    ;
};

export default CategoryPage;
