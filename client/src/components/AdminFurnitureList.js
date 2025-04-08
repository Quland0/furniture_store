import React, { useState, useMemo, useEffect } from 'react';
import '../styles/AdminFurnitureList.css';
import ErrorIcon from "../assets/icons/404.svg";
import MakeNewIcon from "../assets/icons/checkmark.svg";
import UnNewIcon from "../assets/icons/close.svg";
import editIcon from "../assets/icons/pencil.svg";
import deleteIcon from "../assets/icons/delete.svg";
import addIcon from "../assets/icons/plus.svg";
import CreateFurniture from "../components/modals/CreateFurniture"; // подключаем модалку

const mockFurnitures = [
    {
        id: 1,
        name: "Спальня Виктория 6 дв.",
        manufacturer: "Milana group",
        price: 89000,
        categories: ["Мебель для спальни", "Шкафы"],
        isNew: true,
        img: "/placeholder-product.jpg"
    },
    {
        id: 2,
        name: "Стол Стулович",
        manufacturer: "Арида",
        price: 30000,
        categories: ["Мебель для гостиной", "Столы"],
        isNew: false,
        img: "/placeholder-product.jpg"
    },
    {
        id: 3,
        name: "Стол Стулович",
        manufacturer: "Арида",
        price: 30000,
        categories: ["Мебель для гостиной", "Столы"],
        isNew: false,
        img: "/placeholder-product.jpg"
    },
];

const adminCategories = [
    {
        id: 'all',
        label: 'Все',
        subcategories: []
    },
    {
        id: 'bedroom',
        label: 'Мебель для спальни',
        subcategories: ['Кровати', 'Шкафы', 'Тумбочки', 'Комоды', 'Пуфы']
    },
    {
        id: 'living-room',
        label: 'Мебель для гостиной',
        subcategories: ['Гостиные и стенки', 'Комоды', 'ТВ-тумбы', 'Шкафы и витрины', 'Столы и журнальные столики', 'Консоли и зеркала']
    },
    {
        id: 'kitchen',
        label: 'Кухня',
        subcategories: ['Прямые кухни', 'Угловые кухни', 'Кухонные острова']
    },
    {
        id: 'sofas',
        label: 'Мягкая мебель',
        subcategories: ['Диваны', 'Кресла', 'Банкетки и пуфы']
    },
    {
        id: 'hallway',
        label: 'Мебель для прихожей',
        subcategories: ['Прихожие', 'Банкетки']
    },
    {
        id: 'kids-room',
        label: 'Мебель для детской',
        subcategories: ['Наборы детской мебели', 'Кровати', 'Столы, стулья и парты']
    },
    {
        id: 'tables',
        label: 'Столы и стулья',
        subcategories: ['Столы', 'Стулья']
    },
    {
        id: 'chandeliers',
        label: 'Люстры',
        subcategories: []
    },
];

const selectOptions = [
    { id: 'allInPage', label: 'Все на странице' },
    { id: 'all', label: 'Все' },
];

const actionOptions = [
    { id: 'delete', label: 'Удалить', icon: deleteIcon },
    { id: 'hide', label: 'Скрыть (404)', icon: ErrorIcon },
    { id: 'makeNew', label: 'Новинка', icon: MakeNewIcon },
    { id: 'unNew', label: 'Не новинка', icon: UnNewIcon },
];

const ITEMS_PER_PAGE = 28;

function computeDisplayedPages(currentPage, totalPages) {
    const pages = [];
    const boundaryPages = 2;
    const aroundCurrent = 2;

    for (let i = 1; i <= Math.min(boundaryPages, totalPages); i++) {
        pages.push(i);
    }

    let start = Math.max(boundaryPages + 1, currentPage - aroundCurrent);
    let end = Math.min(totalPages - boundaryPages, currentPage + aroundCurrent);

    if (start > boundaryPages + 1) {
        pages.push('...');
    }

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (end < totalPages - boundaryPages) {
        pages.push('...');
    }

    for (let i = Math.max(totalPages - boundaryPages + 1, boundaryPages + 1); i <= totalPages; i++) {
        if (!pages.includes(i)) {
            pages.push(i);
        }
    }

    return pages;
}

const AdminFurnitureList = ({ onAddCategory }) => {
    const [furnitures, setFurnitures] = useState(mockFurnitures);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [sortOption, setSortOption] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);

    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState([]);

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        categoryId: null,
        isSubcategory: false,
    });

    useEffect(() => {
        if (contextMenu.visible) {
            const handleGlobalClick = () => {
                setContextMenu(prev => ({ ...prev, visible: false }));
            };
            document.addEventListener('click', handleGlobalClick);
            return () => document.removeEventListener('click', handleGlobalClick);
        }
    }, [contextMenu.visible]);

    const handleCategoryContextMenu = (e, catId) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            categoryId: catId,
            isSubcategory: false,
        });
    };

    const handleSubcategoryContextMenu = (e, subName) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.pageX,
            y: e.pageY,
            categoryId: subName,
            isSubcategory: true,
        });
    };

    const handleAddSubcategory = () => {
        console.log("Добавить подкатегорию к категории ID=", contextMenu.categoryId);
    };

    const handleEditCategory = () => {
        console.log("Редактировать категорию или подкатегорию:", contextMenu.categoryId);
    };

    const handleDeleteCategory = () => {
        console.log("Удалить категорию или подкатегорию:", contextMenu.categoryId);
    };

    const handleCategorySelect = (catIdOrSub) => {
        setSelectedCategory(catIdOrSub);
        setCurrentPage(1);
    };

    const toggleExpand = (catId) => {
        setExpandedCategories(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const toggleSelectItem = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
        );
    };

    const handleDeleteOne = (id) => {
        setFurnitures(prev => prev.filter(f => f.id !== id));
        setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    };

    const filteredAndSortedFurnitures = useMemo(() => {
        let result = [...furnitures];

        if (selectedCategory !== 'all') {
            const mainCat = adminCategories.find(cat => cat.id === selectedCategory);
            if (mainCat) {
                const catLabel = mainCat.label.toLowerCase();
                result = result.filter(item =>
                    item.categories?.some(cat => cat.toLowerCase().includes(catLabel))
                );
            } else {
                result = result.filter(item =>
                    item.categories?.includes(selectedCategory)
                );
            }
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.manufacturer.toLowerCase().includes(query)
            );
        }

        switch (sortOption) {
            case 'price_asc':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                result.sort((a, b) => b.price - a.price);
                break;
            default:
                result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
                break;
        }

        return result;
    }, [furnitures, selectedCategory, searchQuery, sortOption]);

    const totalPages = Math.ceil(filteredAndSortedFurnitures.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedFurnitures = filteredAndSortedFurnitures.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const displayedPages = useMemo(() => computeDisplayedPages(currentPage, totalPages), [currentPage, totalPages]);

    const [showFurnitureModal, setShowFurnitureModal] = useState(false);
    const [editingFurniture, setEditingFurniture] = useState(null);

    const handleEditClick = (item) => {
        setEditingFurniture(item);
        setShowFurnitureModal(true);
    };

    const handleSaveFurniture = (updatedFurniture) => {
        setFurnitures(prev =>
            prev.map(item => (item.id === updatedFurniture.id ? updatedFurniture : item))
        );
        setShowFurnitureModal(false);
        setEditingFurniture(null);
    };

    return (
        <div className="admin-furniture-list">
            <aside className="admin-categories">
                <button
                    className="add-btn"
                    onClick={onAddCategory}
                >
                    Добавить категорию
                </button>
                <ul className="category-list">
                    {adminCategories.map(cat => (
                        <li key={cat.id} className="category-item">
                            <div
                                className="category-row"
                                onContextMenu={(e) => handleCategoryContextMenu(e, cat.id)}
                            >
                                {cat.subcategories.length > 0 && (
                                    <button
                                        className="expand-btn"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleExpand(cat.id);
                                        }}
                                    >
                                        {expandedCategories.includes(cat.id) ? '–' : '+'}
                                    </button>
                                )}
                                <span
                                    className={`category-name ${selectedCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => handleCategorySelect(cat.id)}
                                >
                                    {cat.label}
                                </span>
                            </div>
                            {expandedCategories.includes(cat.id) && (
                                <ul className="subcategory-list">
                                    {cat.subcategories.map(sub => (
                                        <li
                                            key={sub}
                                            className={`subcategory-item ${selectedCategory === sub ? 'active' : ''}`}
                                            onContextMenu={(e) => handleSubcategoryContextMenu(e, sub)}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCategorySelect(sub);
                                            }}
                                        >
                                            {sub}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </aside>

            <div className="admin-list-panel">
                <div className="top-panel">
                    <div className="dropdown-container">
                        <button className="dropdown-btn" onClick={() => setIsSelectOpen(prev => !prev)}>
                            Выбрать
                        </button>
                        {isSelectOpen && (
                            <div className="dropdown-menu select-menu">
                                {selectOptions.map(opt => (
                                    <div key={opt.id} className="dropdown-item" onClick={() => {
                                        if (opt.id === 'allInPage') {
                                            setSelectedItems(paginatedFurnitures.map(f => f.id));
                                        } else {
                                            setSelectedItems(furnitures.map(f => f.id));
                                        }
                                        setIsSelectOpen(false);
                                    }}>
                                        {opt.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="dropdown-container">
                        <button className="dropdown-btn" onClick={() => setIsActionOpen(prev => !prev)}>
                            Выберите действие
                        </button>
                        {isActionOpen && (
                            <div className="dropdown-menu action-menu">
                                {actionOptions.map(opt => (
                                    <div key={opt.id} className="dropdown-item action-item" onClick={() => {
                                        switch (opt.id) {
                                            case 'delete':
                                                setFurnitures(prev => prev.filter(f => !selectedItems.includes(f.id)));
                                                setSelectedItems([]);
                                                break;
                                            case 'hide':
                                                console.log("Скрыть выбранные товары");
                                                break;
                                            case 'makeNew':
                                                setFurnitures(prev => prev.map(f =>
                                                    selectedItems.includes(f.id) ? { ...f, isNew: true } : f
                                                ));
                                                break;
                                            case 'unNew':
                                                setFurnitures(prev => prev.map(f =>
                                                    selectedItems.includes(f.id) ? { ...f, isNew: false } : f
                                                ));
                                                break;
                                        }
                                        setIsActionOpen(false);
                                    }}>
                                        <img src={opt.icon} alt={opt.label} className="dropdown-icon" />
                                        <span>{opt.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <select className="sort-select" value={sortOption} onChange={handleSortChange}>
                        <option value="name">По названию</option>
                        <option value="price_asc">Сначала дешевле</option>
                        <option value="price_desc">Сначала дороже</option>
                    </select>

                    <input
                        type="text"
                        className="search-input"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>

                <table className="admin-furniture-table">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Название</th>
                        <th>Производитель</th>
                        <th>Цена</th>
                        <th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedFurnitures.map(item => (
                        <tr key={item.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedItems.includes(item.id)}
                                    onChange={() => toggleSelectItem(item.id)}
                                />
                            </td>
                            <td>
                                <div className="item-name">{item.name}</div>
                                <div className="item-cats">{item.categories.join(', ')}</div>
                            </td>
                            <td>{item.manufacturer}</td>
                            <td>{item.price.toLocaleString()} ₽</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEditClick(item)}>
                                    <img src={editIcon} alt="Редактировать" />
                                </button>
                                <button className="delete-btn" onClick={() => handleDeleteOne(item.id)}>
                                    <img src={deleteIcon} alt="Удалить" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {filteredAndSortedFurnitures.length > ITEMS_PER_PAGE && (
                    <div className="pagination-container">
                        <div className="pagination-content">
                            <button
                                className={`pagination-arrow ${currentPage <= 1 ? 'disabled' : ''}`}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                disabled={currentPage <= 1}
                            >
                                ← НАЗАД
                            </button>

                            <div className="page-numbers">
                                {displayedPages.map((p, i) =>
                                    p === '...' ? (
                                        <span key={i} className="dots">…</span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setCurrentPage(p)}
                                            className={`page-number ${currentPage === p ? 'active' : ''}`}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}
                            </div>

                            <button
                                className={`pagination-arrow ${currentPage >= totalPages ? 'disabled' : ''}`}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage >= totalPages}
                            >
                                ВПЕРЁД →
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {contextMenu.visible && (
                <div
                    className="category-context-menu"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <div className="context-menu-item" onClick={handleAddSubcategory}>
                        <img src={addIcon} alt="Добавить подкатегорию" className="context-icon" />
                        <span>Добавить подкатегорию</span>
                    </div>
                    <div className="context-menu-item" onClick={handleEditCategory}>
                        <img src={editIcon} alt="Изменить" className="context-icon" />
                        <span>Изменить</span>
                    </div>
                    <div className="context-menu-item delete-context-menu-item" onClick={handleDeleteCategory}>
                        <img src={deleteIcon} alt="Удалить" className="context-icon" />
                        <span>Удалить</span>
                    </div>
                </div>
            )}

            {showFurnitureModal && (
                <CreateFurniture
                    show={showFurnitureModal}
                    onHide={() => {
                        setShowFurnitureModal(false);
                        setEditingFurniture(null);
                    }}
                    editingFurniture={editingFurniture}
                    onSave={handleSaveFurniture}
                />
            )}
        </div>
    );
};

export default AdminFurnitureList;
