// src/components/CatalogSidebar.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import '../styles/CatalogSidebar.css';
import defaultIcon from "../assets/icons/default-type.svg";
import kitchenIcon from '../assets/icons/kitchen.svg';
import bedroomIcon from '../assets/icons/bedroom.svg';
import livingRoomIcon from '../assets/icons/livingroom.svg';
import sofasIcon from '../assets/icons/sofas.svg';
import hallwayIcon from '../assets/icons/hallway.svg';
import kidsRoomIcon from '../assets/icons/kidsroom.svg';
import chandelierIcon from '../assets/icons/chandeliers.svg';
import tablesIcon from '../assets/icons/tables.svg';
import { fetchTypes, fetchSubtypesByTypeId } from '../http/FurnitureAPI';

// Мэппинг иконок по имени типа
const iconMapping = {
    "Кухня": kitchenIcon,
    "Спальня": bedroomIcon,
    "Гостиная": livingRoomIcon,
    "Мягкая мебель": sofasIcon,
    "Прихожая": hallwayIcon,
    "Детская": kidsRoomIcon,
    "Люстры": chandelierIcon,
    "Столы и стулья": tablesIcon
};

const CatalogSidebar = ({ isOpen, onClose, catalogButtonRef }) => {
    const [types, setTypes] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [subtypes, setSubtypes] = useState([]);
    const sidebarRef = useRef(null);
    const [sidebarPosition, setSidebarPosition] = useState({ top: 0, left: 0 });

    // 1) Загрузка типов при монтировании
    useEffect(() => {
        fetchTypes()
            .then(data => setTypes(data))
            .catch(err => console.error("Ошибка получения типов мебели:", err));
    }, []);

    // 2) При выборе типа подгружаем его подкатегории
    useEffect(() => {
        if (selectedType) {
            fetchSubtypesByTypeId(selectedType)
                .then(data => setSubtypes(data))
                .catch(err => {
                    console.error("Ошибка получения подкатегорий:", err);
                    setSubtypes([]);
                });
        } else {
            setSubtypes([]);
        }
    }, [selectedType]);

    // 3) Сброс выбора при закрытии
    useEffect(() => {
        if (!isOpen) {
            setSelectedType(null);
            setSubtypes([]);
        }
    }, [isOpen]);

    // 4) Расчёт позиции сайдбара под кнопку
    const calculatePosition = useCallback(() => {
        if (isOpen && catalogButtonRef?.current) {
            const btn = catalogButtonRef.current.getBoundingClientRect();
            // поправка на шапку
            const offsetY = window.scrollY < 50 ? btn.bottom + 15 : btn.bottom + 5;
            setSidebarPosition({
                top: offsetY,
                left: btn.right - 135,
            });
        }
    }, [isOpen, catalogButtonRef]);

    useEffect(() => {
        calculatePosition();
        if (isOpen) {
            window.addEventListener('scroll', calculatePosition);
        }
        return () => window.removeEventListener('scroll', calculatePosition);
    }, [isOpen, calculatePosition]);

    // 5) Закрытие при клике вне
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                isOpen &&
                sidebarRef.current &&
                !sidebarRef.current.contains(e.target) &&
                catalogButtonRef.current &&
                !catalogButtonRef.current.contains(e.target)
            ) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose, catalogButtonRef]);

    return (
        <div
            className={`catalog-sidebar ${isOpen ? 'open' : ''}`}
            ref={sidebarRef}
            style={{
                position: 'fixed',
                top: `${sidebarPosition.top}px`,
                left: `${sidebarPosition.left}px`,
                transform: 'none',
            }}
        >
            <div className="catalog-sidebar-container">
                <button className="close-btn" onClick={onClose}>×</button>
                <div className="catalog-sidebar-left">
                    <ul className="category-list">
                        {types.map(type => (
                            <li
                                key={type.id}
                                className={selectedType === type.id ? 'active' : ''}
                                onClick={() => setSelectedType(type.id)}
                            >
                                <img
                                    src={type.icon
                                        ? `http://localhost:5000/${type.icon}`
                                        : (iconMapping[type.name] || defaultIcon)}
                                    alt={type.name}
                                    className="category-icon"
                                />
                                <span>{type.name}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="catalog-sidebar-right">
                    {selectedType ? (
                        <>
                            <h3 className="type-title">
                                <Link
                                    to={`/category/${selectedType}`}
                                    onClick={onClose}
                                    className="type-link"
                                >
                                    {types.find(t => t.id === selectedType)?.name}
                                </Link>
                            </h3>
                            {subtypes.length > 0 ? (
                                <ul className="subcategory-list">
                                    {subtypes.map(sub => (
                                        <li key={sub.id} className="subcategory-item">
                                            <Link
                                                to={`/category/${selectedType}/${encodeURIComponent(sub.name)}`}
                                                onClick={onClose}
                                                className="subcategory-link"
                                            >
                                                {sub.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="no-subtypes">Подкатегорий нет</p>
                            )}
                        </>
                    ) : (
                        <p className="prompt">Выберите тип слева</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CatalogSidebar;
