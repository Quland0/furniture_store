import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CatalogSidebar.css';

// Импорт иконок для категорий
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
        subcategories: ['Прямые кухни', 'Угловые кухни', 'Кухонные острова'],
    },
    {
        id: 'bedroom',
        name: 'Спальня',
        icon: bedroomIcon,
        subcategories: ['Спальные гарнитуры', 'Шкафы', 'Кровати', 'Тумбочки', 'Комоды', 'Туалетные столики', 'Пуфы'],
    },
    {
        id: 'living-room',
        name: 'Гостиная',
        icon: livingRoomIcon,
        subcategories: ['Гостинные и стенки', 'Комоды', 'ТВ-тумбы', 'Шкафы и витрины', 'Столы и Журнальные столики', 'Консоли и зеркала'],
    },
    {
        id: 'sofas',
        name: 'Мягкая мебель',
        icon: sofasIcon,
        subcategories: ['Диваны', 'Кресла', 'Банкетки и пуфы'],
    },
    {
        id: 'hallway',
        name: 'Прихожая',
        icon: hallwayIcon,
        subcategories: ['Прихожие', 'Банкетки'],
    },
    {
        id: 'kids-room',
        name: 'Детская',
        icon: kidsRoomIcon,
        subcategories: ['Наборы детской мебели', 'Кровати', 'Столы, стулья и парты'],
    },
    {
        id: 'chandeliers',
        name: 'Люстры',
        icon: chandelierIcon,
        subcategories: [],
    },
    {
        id: 'tables',
        name: 'Столы и стулья',
        icon: tablesIcon,
        subcategories: ['Столы', 'Стулья'],
    },
];

const CatalogSidebar = ({ isOpen, onClose }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const sidebarRef = useRef(null);

    const handleSelectCategory = (catId) => {

        if (selectedCategory === catId) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(catId);
        }
    };

    const activeCategory = catalogData.find(cat => cat.id === selectedCategory);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (isOpen && sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <div className={`catalog-sidebar ${isOpen ? 'open' : ''}`} ref={sidebarRef}>
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
                                    Мебель для {activeCategory.name.toLowerCase()}
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
