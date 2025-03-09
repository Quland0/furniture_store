import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CatalogSidebar.css';

import kitchenIcon from '../assets/icons/kitchen.svg';
import bedroomIcon from '../assets/icons/bedroom.svg';
import livingRoomIcon from '../assets/icons/livingroom.svg';
import sofasIcon from '../assets/icons/sofas.svg';
import hallwayIcon from '../assets/icons/hallway.svg';
import kidsRoomIcon from '../assets/icons/kidsroom.svg';
import chandelierIcon from '../assets/icons/chandeliers.svg';
import tablesIcon from '../assets/icons/tables.svg';

const catalogData = [
    {
        id: 'kitchen',
        name: 'Кухня',
        icon: kitchenIcon,
        titlePrefix: 'Мебель для кухни',
        subcategories: ['Прямые кухни', 'Угловые кухни', 'Кухонные острова'],
    },
    {
        id: 'bedroom',
        name: 'Спальня',
        icon: bedroomIcon,
        titlePrefix: 'Мебель для спальни',
        subcategories: ['Спальные гарнитуры', 'Шкафы', 'Кровати', 'Тумбочки', 'Комоды', 'Туалетные столики', 'Пуфы'],
    },
    {
        id: 'living-room',
        name: 'Гостиная',
        icon: livingRoomIcon,
        titlePrefix: 'Мебель для гостиной',
        subcategories: ['Гостинные и стенки', 'Комоды', 'ТВ-тумбы', 'Шкафы и витрины', 'Столы и Журнальные столики', 'Консоли и зеркала'],
    },
    {
        id: 'sofas',
        name: 'Мягкая мебель',
        icon: sofasIcon,
        titlePrefix: 'Мягкая мебель',
        subcategories: ['Диваны', 'Кресла', 'Банкетки и пуфы'],
    },
    {
        id: 'hallway',
        name: 'Прихожая',
        icon: hallwayIcon,
        titlePrefix: 'Мебель для прихожей',
        subcategories: ['Прихожие', 'Банкетки'],
    },
    {
        id: 'kids-room',
        name: 'Детская',
        icon: kidsRoomIcon,
        titlePrefix: 'Мебель для детской',
        subcategories: ['Наборы детской мебели', 'Кровати', 'Столы, стулья и парты'],
    },
    {
        id: 'chandeliers',
        name: 'Люстры',
        icon: chandelierIcon,
        titlePrefix: 'Люстры',
        subcategories: [],
    },
    {
        id: 'tables',
        name: 'Столы и стулья',
        icon: tablesIcon,
        titlePrefix: 'Столы и стулья',
        subcategories: ['Столы', 'Стулья'],
    },
];

const CatalogSidebar = ({ isOpen, onClose, catalogButtonRef }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sidebarPosition, setSidebarPosition] = useState({ top: 0, left: 0 });
    const sidebarRef = useRef(null);

    const handleSelectCategory = (catId) => {
        setSelectedCategory(prev => (prev === catId ? null : catId));
    };

    const activeCategory = catalogData.find(cat => cat.id === selectedCategory);

    const calculatePosition = useCallback(() => {
        if (isOpen && catalogButtonRef?.current) {
            const buttonRect = catalogButtonRef.current.getBoundingClientRect();
            const topBar = document.querySelector('.top-bar');
            const navbar = document.querySelector('.navbar');
            let baseTop = buttonRect.bottom + 15;
            if (window.scrollY < 50 && topBar) {
                baseTop = buttonRect.bottom + 15;
            } else if (navbar) {
                baseTop = buttonRect.bottom + 15 - 10;
            }
            setSidebarPosition({
                top: baseTop,
                left: buttonRect.right - 135,
            });
        }
    }, [isOpen, catalogButtonRef]);

    useEffect(() => {
        calculatePosition();
    }, [calculatePosition]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target) &&
                catalogButtonRef?.current &&
                !catalogButtonRef.current.contains(e.target)
            ) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose, catalogButtonRef]);

    useEffect(() => {
        if (isOpen) {
            calculatePosition();
            window.addEventListener('scroll', calculatePosition);
        }
        return () => {
            window.removeEventListener('scroll', calculatePosition);
        };
    }, [isOpen, calculatePosition]);

    return (
        <div
            className={`catalog-sidebar ${isOpen ? 'open' : ''}`}
            ref={sidebarRef}
            style={{
                position: 'fixed',
                top: `${sidebarPosition.top}px`,
                left: `${sidebarPosition.left}px`,
                transform: 'none',
                marginLeft: 0,
            }}
        >
            <div className="catalog-sidebar-container">
                <button className="close-btn" onClick={onClose}>×</button>
                <div className="catalog-sidebar-left">
                    <ul className="category-list">
                        {catalogData.map(category => (
                            <li
                                key={category.id}
                                className={selectedCategory === category.id ? 'active' : ''}
                                onClick={() => handleSelectCategory(category.id)}
                            >
                                <img src={category.icon} alt={category.name} className="category-icon" />
                                <span>{category.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="catalog-sidebar-right">
                    {activeCategory ? (
                        <>
                            <h3>
                                <Link
                                    to={`/category/${activeCategory.id}`}
                                    onClick={onClose}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                >
                                    {activeCategory.titlePrefix}
                                </Link>
                            </h3>
                            <ul className="subcategory-list">
                                {activeCategory.subcategories.map((sub, index) => (
                                    <li key={index}>
                                        <Link
                                            to={`/category/${activeCategory.id}/${encodeURIComponent(sub)}`}
                                            onClick={onClose}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                        >
                                            {sub}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>Выберите категорию</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CatalogSidebar;
