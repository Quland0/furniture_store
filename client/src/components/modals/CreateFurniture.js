// src/components/modals/CreateFurniture.js
import React, { useState, useCallback, useEffect } from 'react';
import '../../styles/Modal.css';
import deleteIcon from "../../assets/icons/delete.svg";

// Пример структуры категорий
const catalogData = [
    {
        id: 'kitchen',
        name: 'Кухня',
        titlePrefix: 'Мебель для кухни',
        subcategories: ['Прямые кухни', 'Угловые кухни', 'Кухонные острова'],
    },
    {
        id: 'bedroom',
        name: 'Спальня',
        titlePrefix: 'Мебель для спальни',
        subcategories: ['Спальные гарнитуры', 'Шкафы', 'Кровати', 'Тумбочки', 'Комоды', 'Туалетные столики', 'Пуфы'],
    },
    {
        id: 'living-room',
        name: 'Гостиная',
        titlePrefix: 'Мебель для гостиной',
        subcategories: ['Гостиные и стенки', 'Комоды', 'ТВ-тумбы', 'Шкафы и витрины', 'Столы и журнальные столики', 'Консоли и зеркала'],
    },
    {
        id: 'sofas',
        name: 'Мягкая мебель',
        titlePrefix: 'Мягкая мебель',
        subcategories: ['Диваны', 'Кресла', 'Банкетки и пуфы'],
    },
    {
        id: 'hallway',
        name: 'Прихожая',
        titlePrefix: 'Мебель для прихожей',
        subcategories: ['Прихожие', 'Банкетки'],
    },
    {
        id: 'kids-room',
        name: 'Детская',
        titlePrefix: 'Мебель для детской',
        subcategories: ['Наборы детской мебели', 'Кровати', 'Столы, стулья и парты'],
    },
    {
        id: 'chandeliers',
        name: 'Люстры',
        titlePrefix: 'Люстры',
        subcategories: [],
    },
    {
        id: 'tables',
        name: 'Столы и стулья',
        titlePrefix: 'Столы и стулья',
        subcategories: ['Столы', 'Стулья'],
    },
];

const CreateFurniture = ({ show, onHide, editingFurniture, onSave }) => {
    // Вкладки модалки
    const [activeTab, setActiveTab] = useState("main");

    // Основные поля
    const [name, setName] = useState(editingFurniture ? editingFurniture.name : '');
    const [price, setPrice] = useState(editingFurniture ? editingFurniture.price : '');
    const [selectedManufacturer, setSelectedManufacturer] = useState(editingFurniture ? editingFurniture.manufacturer : '');
    const [isNew, setIsNew] = useState(editingFurniture ? editingFurniture.isNew : false);
    const [images, setImages] = useState(editingFurniture ? editingFurniture.images || [] : []); // ожидается массив объектов { file, previewUrl }
    const [info, setInfo] = useState(editingFurniture ? editingFurniture.info || [] : []);
    const [selectedCategories, setSelectedCategories] = useState(editingFurniture ? editingFurniture.categories || [] : []);
    const [expandedCats, setExpandedCats] = useState([]);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    // SEO поля
    const [metaTitle, setMetaTitle] = useState(editingFurniture && editingFurniture.seo ? editingFurniture.seo.metaTitle : '');
    const [metaDescription, setMetaDescription] = useState(editingFurniture && editingFurniture.seo ? editingFurniture.seo.metaDescription : '');
    const [metaKeywords, setMetaKeywords] = useState(editingFurniture && editingFurniture.seo ? editingFurniture.seo.metaKeywords : '');

    // При изменении editingFurniture обновляем поля
    useEffect(() => {
        if (editingFurniture) {
            setName(editingFurniture.name);
            setPrice(editingFurniture.price);
            setSelectedManufacturer(editingFurniture.manufacturer);
            setIsNew(editingFurniture.isNew);
            setImages(editingFurniture.images || []);
            setInfo(editingFurniture.info || []);
            setSelectedCategories(editingFurniture.categories || []);
            setMetaTitle(editingFurniture.seo ? editingFurniture.seo.metaTitle : '');
            setMetaDescription(editingFurniture.seo ? editingFurniture.seo.metaDescription : '');
            setMetaKeywords(editingFurniture.seo ? editingFurniture.seo.metaKeywords : '');
        } else {
            setName('');
            setPrice('');
            setSelectedManufacturer('');
            setIsNew(false);
            setImages([]);
            setInfo([]);
            setSelectedCategories([]);
            setMetaTitle('');
            setMetaDescription('');
            setMetaKeywords('');
        }
    }, [editingFurniture]);

    // ====== ЛОГИКА ВЫБОРА КАТЕГОРИЙ ======
    const handleMainCategoryChange = (catTitle) => {
        if (selectedCategories.includes(catTitle)) {
            // Убираем основную категорию и все её подкатегории
            setSelectedCategories(prev =>
                prev.filter(cat => !cat.startsWith(catTitle))
            );
        } else {
            setSelectedCategories(prev => [...prev, catTitle]);
        }
    };

    const handleSubcategoryChange = (mainTitle, sub) => {
        const full = `${mainTitle} - ${sub}`;
        if (selectedCategories.includes(full)) {
            setSelectedCategories(prev => prev.filter(c => c !== full));
        } else {
            setSelectedCategories(prev => [...prev, full]);
        }
    };

    const toggleExpand = (catId) => {
        setExpandedCats(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    // ====== ЗАГРУЗКА ФАЙЛОВ (с превью) ======
    const handleFileChange = (e) => {
        const fileList = Array.from(e.target.files);
        const newImagesPromises = fileList.map(file =>
            new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (ev) => resolve({ file, previewUrl: ev.target.result });
                reader.readAsDataURL(file);
            })
        );
        Promise.all(newImagesPromises).then(loadedImages => {
            setImages(prev => [...prev, ...loadedImages]);
        });
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    // ====== Drag-and-drop reorder ======
    const [draggedIndex, setDraggedIndex] = useState(null);
    const onDragStart = (e, index) => setDraggedIndex(index);
    const onDragOver = (e) => e.preventDefault();
    const onDrop = (e, dropIndex) => {
        e.preventDefault();
        if (draggedIndex === null) return;
        setImages(prev => {
            const newArr = [...prev];
            const [draggedItem] = newArr.splice(draggedIndex, 1);
            newArr.splice(dropIndex, 0, draggedItem);
            return newArr;
        });
        setDraggedIndex(null);
    };

    // ====== ХАРАКТЕРИСТИКИ (info) ======
    const addInfoRow = () => {
        setInfo(prev => [...prev, { id: Date.now(), title: '', description: '' }]);
    };

    const removeInfoRow = (id) => {
        setInfo(prev => prev.filter(item => item.id !== id));
    };

    const changeInfo = (id, key, value) => {
        setInfo(prev =>
            prev.map(item => (item.id === id ? { ...item, [key]: value } : item))
        );
    };

    // ====== СОХРАНЕНИЕ ======
    const handleSave = () => {
        const newFurniture = {
            name,
            price,
            manufacturer: selectedManufacturer,
            categories: selectedCategories,
            isNew,
            images, // на сервер будем отправлять файлы из поля file
            info,
            seo: {
                metaTitle,
                metaDescription,
                metaKeywords,
            },
        };
        if (editingFurniture) {
            onSave(newFurniture);
        } else {
            console.log('Добавлена мебель:', newFurniture);
        }
        // Сброс полей
        setName('');
        setPrice('');
        setSelectedManufacturer('');
        setIsNew(false);
        setSelectedCategories([]);
        setExpandedCats([]);
        setImages([]);
        setInfo([]);
        setMetaTitle('');
        setMetaDescription('');
        setMetaKeywords('');
        onHide();
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onHide}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                {/* Вкладки модалки */}
                <div className="modal-tabs">
                    <button
                        className={`modal-tab ${activeTab === "main" ? "active" : ""}`}
                        onClick={() => setActiveTab("main")}
                    >
                        Основное
                    </button>
                    <button
                        className={`modal-tab ${activeTab === "seo" ? "active" : ""}`}
                        onClick={() => setActiveTab("seo")}
                    >
                        SEO настройки
                    </button>
                </div>

                {activeTab === "main" && (
                    <>
                        <h2>{editingFurniture ? "Редактировать мебель" : "Добавить мебель"}</h2>
                        <label>Выберите производителя</label>
                        <select
                            value={selectedManufacturer}
                            onChange={(e) => setSelectedManufacturer(e.target.value)}
                        >
                            <option value="">Не выбрано</option>
                            <option value="Арида">Арида</option>
                            <option value="Milana group">Milana group</option>
                        </select>

                        <label>Название мебели</label>
                        <input
                            type="text"
                            placeholder="Например: Спальня Виктория"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label>Цена</label>
                        <input
                            type="number"
                            placeholder="130000"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        {/* Чекбокс «Новинка» */}
                        <div className="checkbox-row">
                            <input
                                id="isNewCheckbox"
                                type="checkbox"
                                checked={isNew}
                                onChange={() => setIsNew(!isNew)}
                            />
                            <label htmlFor="isNewCheckbox">Новинка</label>
                        </div>

                        {/* Категории */}
                        <label>Категории</label>
                        <button
                            className="btn-select-categories"
                            onClick={() => setShowCategoryModal(true)}
                        >
                            Выбрать категории
                        </button>

                        {/* Загрузка изображений */}
                        <label>Загрузить изображения</label>
                        <input type="file" multiple onChange={handleFileChange} />
                        {images.length > 0 ? (
                            <ul className="file-list">
                                {images.map((imgObj, idx) => (
                                    <li key={idx}>
                                        {imgObj.file.name}
                                        <button
                                            className="delete-image-btn"
                                            onClick={() => removeImage(idx)}
                                            title="Удалить"
                                        >
                                            <img src={deleteIcon} alt="Удалить" style={{ width: '26px', height: '26px' }} />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="file-info">Файлы не выбраны</p>
                        )}

                        {/* Превью изображений с drag-and-drop */}
                        <div className="images-preview">
                            {images.map((imgObj, index) => (
                                <div
                                    className="image-item"
                                    key={index}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, index)}
                                    onDragOver={onDragOver}
                                    onDrop={(e) => onDrop(e, index)}
                                >
                                    <img src={imgObj.previewUrl} alt="preview" className="thumb" />
                                    <button
                                        className="delete-image-btn"
                                        onClick={() => removeImage(index)}
                                        title="Удалить"
                                    >
                                        <img src={deleteIcon} alt="Удалить" style={{ width: '26px', height: '26px' }} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Свойства (характеристики) */}
                        <button className="btn-add-prop" onClick={addInfoRow}>
                            Добавить новое свойство
                        </button>
                        {info.map((item) => (
                            <div key={item.id} className="info-row">
                                <input
                                    type="text"
                                    placeholder="Название свойства"
                                    value={item.title}
                                    onChange={(e) => changeInfo(item.id, 'title', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Описание свойства"
                                    value={item.description}
                                    onChange={(e) => changeInfo(item.id, 'description', e.target.value)}
                                />
                                <button className="btn-remove-prop" onClick={() => removeInfoRow(item.id)}>
                                    Удалить
                                </button>
                            </div>
                        ))}
                    </>
                )}

                {activeTab === "seo" && (
                    <>
                        <h2>SEO настройки</h2>
                        <label>SEO Заголовок</label>
                        <input
                            type="text"
                            placeholder="Введите SEO заголовок"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                        />

                        <label>SEO Описание</label>
                        <textarea
                            placeholder="Введите SEO описание"
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                        />

                        <label>SEO Ключевые слова</label>
                        <input
                            type="text"
                            placeholder="Введите ключевые слова через запятую"
                            value={metaKeywords}
                            onChange={(e) => setMetaKeywords(e.target.value)}
                        />
                    </>
                )}

                {/* Кнопки модального окна */}
                <div className="modal-buttons">
                    <button className="btn-cancel" onClick={onHide}>
                        Отмена
                    </button>
                    <button className="btn-save" onClick={handleSave}>
                        Сохранить
                    </button>
                </div>

                {/* Модальное окно категорий */}
                {showCategoryModal && (
                    <div className="category-modal-overlay" onClick={() => setShowCategoryModal(false)}>
                        <div className="category-modal-window" onClick={(e) => e.stopPropagation()}>
                            <div className="category-modal-header">
                                <h3>Выберите категории</h3>
                                <button className="close-modal-btn" onClick={() => setShowCategoryModal(false)}>
                                    ×
                                </button>
                            </div>
                            <div className="category-modal-body">
                                <ul className="category-main-list">
                                    {catalogData.map((cat) => {
                                        const isMainChecked = selectedCategories.includes(cat.titlePrefix);
                                        return (
                                            <li key={cat.id} className="category-main-item">
                                                <div className="category-main-row">
                                                    <input
                                                        type="checkbox"
                                                        checked={isMainChecked}
                                                        onChange={() => handleMainCategoryChange(cat.titlePrefix)}
                                                    />
                                                    <span>{cat.titlePrefix}</span>
                                                    {cat.subcategories.length > 0 && (
                                                        <button className="expand-btn" onClick={() => toggleExpand(cat.id)}>
                                                            {expandedCats.includes(cat.id) ? '–' : '+'}
                                                        </button>
                                                    )}
                                                </div>
                                                {expandedCats.includes(cat.id) && cat.subcategories.length > 0 && (
                                                    <ul className="subcategory-list">
                                                        {cat.subcategories.map((sub) => {
                                                            const fullName = `${cat.titlePrefix} - ${sub}`;
                                                            const isSubChecked = selectedCategories.includes(fullName);
                                                            return (
                                                                <li key={sub} className="subcategory-item">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isSubChecked}
                                                                        onChange={() => handleSubcategoryChange(cat.titlePrefix, sub)}
                                                                    />
                                                                    <span>{sub}</span>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateFurniture;
