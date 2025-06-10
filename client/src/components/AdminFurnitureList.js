import React, {
    useState,
    useEffect,
    useMemo
} from 'react';
import '../styles/AdminFurnitureList.css';
import ErrorIcon from "../assets/icons/404.svg";
import MakeNewIcon from "../assets/icons/checkmark.svg";
import UnNewIcon from "../assets/icons/close.svg";
import editIcon from "../assets/icons/pencil.svg";
import deleteIcon from "../assets/icons/delete.svg";
import addIcon from "../assets/icons/plus.svg";
import CreateFurniture from "../components/modals/CreateFurniture";
import {
    fetchFurniture,
    fetchTypes,
    fetchSubTypes,
    deleteFurniture, createSubType, editType, editSubType, updateType, deleteType, deleteSubType
} from '../http/FurnitureAPI';
import CreateSubcategory from "./modals/CreateSubcategory";
import EditCategoryModal from "./modals/EditCategoryModal";
import AdminOrders from "../components/OrdersAdminPanel";
import { fetchOneFurniture, updateFurniture } from '../http/FurnitureAPI';

const ITEMS_PER_PAGE = 28;
const selectOptions = [
    { id: 'allInPage', label: 'Все на странице' },
    { id: 'all', label: 'Все' },
];
const actionOptions = [
    { id: 'delete', label: 'Удалить', icon: deleteIcon },
    { id: 'hide', label: 'Скрыть (404)', icon: ErrorIcon },
    { id: 'makeNew', label: 'Новинка', icon: MakeNewIcon },
    { id: 'unNew', label: 'Не новинка', icon: UnNewIcon },
    { id: 'unhide', label: 'Отобразить', icon: ErrorIcon }
];

function computeDisplayedPages(currentPage, totalPages) {
    const pages = [];
    const boundaryPages = 2;
    const aroundCurrent = 2;
    for (let i = 1; i <= Math.min(boundaryPages, totalPages); i++) pages.push(i);
    let start = Math.max(boundaryPages + 1, currentPage - aroundCurrent);
    let end = Math.min(totalPages - boundaryPages, currentPage + aroundCurrent);
    if (start > boundaryPages + 1) pages.push('...');
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - boundaryPages) pages.push('...');
    for (let i = Math.max(totalPages - boundaryPages + 1, boundaryPages + 1); i <= totalPages; i++)
        if (!pages.includes(i)) pages.push(i);
    return pages;
}

const AdminFurnitureList = ({ onAddCategory }) => {
    // --- state ---
    const [furnitures, setFurnitures] = useState([]);
    const [types, setTypes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subtypes, setSubtypes] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [sortOption, setSortOption] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const [isSelectOpen, setIsSelectOpen] = useState(false);
    const [isActionOpen, setIsActionOpen] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState([]);
    const [contextMenu, setContextMenu] = useState({
        visible: false, x: 0, y: 0, categoryId: null, isSubcategory: false
    });
    const [showFurnitureModal, setShowFurnitureModal] = useState(false);
    const [editingFurniture, setEditingFurniture] = useState(null);

    const [editModalData, setEditModalData] = useState(null);

    const [showSubModal, setShowSubModal] = useState(false);
    const [selectedTypeId, setSelectedTypeId] = useState(null);
    const [editingFurnitureFull, setEditingFurnitureFull] = useState(null);

    const createFormData = item => {
        const form = new FormData();
        form.append('name', item.name);
        form.append('price', item.price);
        form.append('manufacturerId', item.manufacturerId);
        form.append('typeId', item.types?.[0]?.id || '');
        form.append('subTypeId', item.subTypeId || '');
        form.append('isNew', item.new ? 'true' : 'false');
        form.append('hidden', item.hidden ? 'true' : 'false');
        form.append('existingImages', JSON.stringify(
            (item.images || []).map(img => ({ id: img.id, order: img.order }))
        ));
        form.append('info', JSON.stringify(item.info || []));
        return form;
    };

    useEffect(() => {
        fetchFurniture()
            .then(data => setFurnitures(data.rows || []))
            .catch(e => console.error("Ошибка загрузки мебели:", e));
        Promise.all([fetchTypes(), fetchSubTypes()])
            .then(([typesData, subtypesData]) => {
                setTypes(typesData);
                setSubtypes(subtypesData);
                const cats = typesData.map(t => ({
                    id: t.id,
                    label: t.name,
                    subcategories: subtypesData
                        .filter(s => s.typeId === t.id)
                        .map(s => s.name)
                }));
                setCategories([{ id: 'all', label: 'Все', subcategories: [] }, ...cats]);
            })
            .catch(e => console.error("Ошибка загрузки типов/подтипов:", e));
    }, []);

    useEffect(() => {
        if (contextMenu.visible) {
            const handler = () => setContextMenu(prev => ({ ...prev, visible: false }));
            document.addEventListener('click', handler);
            return () => document.removeEventListener('click', handler);
        }
    }, [contextMenu.visible]);

    const handleCategoryContextMenu = (e, catId) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.pageX, y: e.pageY, categoryId: catId, isSubcategory: false });
    };
    const handleSubcategoryContextMenu = (e, sub) => {
        e.preventDefault();
        setContextMenu({ visible: true, x: e.pageX, y: e.pageY, categoryId: sub, isSubcategory: true });
    };
    const handleAddSubcategory = () => {
        setSelectedTypeId(contextMenu.categoryId);
        setShowSubModal(true);
        setContextMenu(prev => ({ ...prev, visible: false }));
    };

    const handleEditCategory = () => {
        setEditModalData({
            id: contextMenu.categoryId,
            isSubcategory: contextMenu.isSubcategory,
            name: contextMenu.categoryId // если хочешь отображать текущее имя
        });
        setContextMenu(prev => ({ ...prev, visible: false }));
    };
    const handleDeleteCategory = async () => {
        try {
            if (contextMenu.isSubcategory) {
                const sub = subtypes.find(s => s.name === contextMenu.categoryId);
                if (sub) await deleteSubType(sub.id);
            } else {
                await deleteType(contextMenu.categoryId);
            }
            window.location.reload();
        } catch (e) {
            console.error("Ошибка удаления:", e);
        }
        setContextMenu(prev => ({ ...prev, visible: false }));
    };
    const handleEditClick = async (id) => {
        try {
            const full = await fetchOneFurniture(id);
            setEditingFurnitureFull(full);
            setShowFurnitureModal(true);
        } catch (e) {
            console.error("Не удалось загрузить товар:", e);
        }
    };

    const toggleSelectItem = id => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };
    const handleDeleteOne = id => {
        deleteFurniture(id)
            .then(() => setFurnitures(prev => prev.filter(f => f.id !== id)))
            .catch(e => console.error("Ошибка удаления мебели:", e));
        setSelectedItems(prev => prev.filter(x => x !== id));
    };
    const handleCreateSubcategory = async (subName, typeId) => {
        try {
            await createSubType({ name: subName, typeId });
            alert("Подкатегория добавлена!");
        } catch (e) {
            console.error("Ошибка при добавлении подкатегории", e);
        }
    };

    const filteredAndSortedFurnitures = useMemo(() => {
        let result = [...furnitures];
        if (!['all', 'orders'].includes(selectedCategory)) {
            return furnitures.filter(product => product.category === selectedCategory);
        }
        if (selectedCategory !== 'all') {
            const cat = categories.find(c => c.id === selectedCategory);
            if (cat) {
                result = result.filter(item =>
                    item.typeId === selectedCategory ||
                    item.categories?.some(sub => cat.subcategories.includes(sub))
                );
            }
        }
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(item =>
                item.name.toLowerCase().includes(q) ||
                (item.manufacturerName || '').toLowerCase().includes(q)
            );
        }
        switch (sortOption) {
            case 'price_asc': result.sort((a,b)=>a.price-b.price); break;
            case 'price_desc': result.sort((a,b)=>b.price-a.price); break;
            default: result.sort((a,b)=>a.name.localeCompare(b.name)); break;
        }
        return result;
    }, [furnitures, selectedCategory, searchQuery, sortOption, categories]);

    const handleBulkAction = async actionId => {
        console.log("Bulk action:", actionId, selectedItems);

        if (actionId === 'delete') {
            selectedItems.forEach(handleDeleteOne);
        } else {
            const promises = selectedItems.map(async id => {
                const item = await fetchOneFurniture(id);
                if (!item) return;

                const updated = { ...item };

                if (actionId === 'hide')   updated.hidden = true;
                if (actionId === 'unhide') updated.hidden = false;
                if (actionId === 'makeNew') updated.new    = true;
                if (actionId === 'unNew')   updated.new    = false;

                const fd = createFormData(updated);

                await updateFurniture(id, fd);
            });

            await Promise.all(promises);

            setFurnitures(prev =>
                prev.map(f =>
                    selectedItems.includes(f.id)
                        ? {
                            ...f,
                            hidden: actionId === 'hide'
                                ? true
                                : actionId === 'unhide'
                                    ? false
                                    : f.hidden,
                            new:    actionId === 'makeNew'
                                ? true
                                : actionId === 'unNew'
                                    ? false
                                    : f.new
                        }
                        : f
                )
            );
        }

        setSelectedItems([]);
        setIsActionOpen(false);
    };
    // --- pagination ---
    const totalPages = Math.ceil(filteredAndSortedFurnitures.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedFurnitures = filteredAndSortedFurnitures.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    const displayedPages = useMemo(() => computeDisplayedPages(currentPage, totalPages), [currentPage, totalPages]);


    return (
        <div className="admin-furniture-list">
            <aside className="admin-categories">
                <button
                    className={`category-item special-tab ${selectedCategory === 'orders' ? 'active' : ''}`}
                    onClick={() => setSelectedCategory('orders')}
                >
                    Заказы
                </button>
                <button className="add-btn" onClick={onAddCategory}>Добавить категорию</button>
                <ul className="category-list">
                    {categories.map(cat => (
                        <li key={cat.id} className="category-item">
                            <div
                                className="category-row"
                                onContextMenu={e => handleCategoryContextMenu(e, cat.id)}
                            >
                                {cat.subcategories.length > 0 && (
                                    <button
                                        className="expand-btn"
                                        onClick={e => {
                                            e.stopPropagation();
                                            setExpandedCategories(prev =>
                                                prev.includes(cat.id) ? prev.filter(x => x !== cat.id) : [...prev, cat.id]
                                            );
                                        }}
                                    >
                                        {expandedCategories.includes(cat.id) ? '–' : '+'}
                                    </button>
                                )}
                                <span
                                    className={`category-name ${selectedCategory === cat.id ? 'active' : ''}`}
                                    onClick={() => {
                                        setSelectedCategory(cat.id);
                                        setCurrentPage(1);
                                    }}
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
                                            onContextMenu={e => handleSubcategoryContextMenu(e, sub)}
                                            onClick={e => {
                                                e.stopPropagation();
                                                setSelectedCategory(sub);
                                                setCurrentPage(1);
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

            {selectedCategory === 'orders' ? (
                <AdminOrders/>
            ) : (
                <div className="admin-list-panel">
                    <div className="top-panel">
                        <div className="dropdown-container">
                        <button className="dropdown-btn" onClick={()=>setIsSelectOpen(o=>!o)}>Выбрать</button>
                        {isSelectOpen && (
                            <div className="dropdown-menu select-menu">
                                {selectOptions.map(opt=>(
                                    <div key={opt.id} className="dropdown-item" onClick={()=>{
                                        if(opt.id==='allInPage') setSelectedItems(paginatedFurnitures.map(f=>f.id));
                                        else setSelectedItems(furnitures.map(f=>f.id));
                                        setIsSelectOpen(false);
                                    }}>{opt.label}</div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="dropdown-container">
                        <button className="dropdown-btn" onClick={()=>setIsActionOpen(o=>!o)}>Выберите действие</button>
                        {isActionOpen && (
                            <div className="dropdown-menu action-menu">
                                {actionOptions.map(opt => (
                                    <div
                                        key={opt.id}
                                        className="dropdown-item action-item"
                                        onClick={() => handleBulkAction(opt.id)}
                                    >
                                        <img src={opt.icon} alt="" className="dropdown-icon" />
                                        <span>{opt.label}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <select className="sort-select" value={sortOption} onChange={e=>setSortOption(e.target.value)}>
                        <option value="name">По названию</option>
                        <option value="price_asc">Сначала дешевле</option>
                        <option value="price_desc">Сначала дороже</option>
                    </select>

                    <input
                        type="text"
                        className="search-input"
                        placeholder="Поиск..."
                        value={searchQuery}
                        onChange={e=>{ setSearchQuery(e.target.value); setCurrentPage(1); }}
                    />
                </div>

                <table className="admin-furniture-table">
                    <thead>
                    <tr>
                        <th></th><th>Название</th><th>Производитель</th><th>Цена</th><th>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {paginatedFurnitures.map(item=>(
                        <tr key={item.id}>
                            <td><input type="checkbox" checked={selectedItems.includes(item.id)} onChange={()=>toggleSelectItem(item.id)}/></td>
                            <td>
                                <div className={`item-name ${item.hidden ? 'hidden' : ''}`}>{item.name}</div>
                                <div className="item-cats">{item.categories?.join(', ')}</div>
                            </td>
                            <td>{item.manufacturer?.name || '—'}</td>
                            <td>{item.price.toLocaleString()} ₽</td>
                            <td>
                                <button className="edit-btn" onClick={()=> handleEditClick(item.id)}>
                                    <img src={editIcon} alt="Редактировать" />
                                </button>
                                <button className="delete-btn" onClick={()=>handleDeleteOne(item.id)}>
                                    <img src={deleteIcon} alt="Удалить" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                {totalPages>1 && (
                    <div className="pagination-container">
                        <button disabled={currentPage<=1} onClick={()=>setCurrentPage(p=>p-1)} className="pagination-arrow">← НАЗАД</button>
                        <div className="page-numbers">
                            {displayedPages.map((p,i)=>p==='...' ? <span key={i} className="dots">…</span>
                                : <button key={p} onClick={()=>setCurrentPage(p)} className={`page-number ${currentPage===p?'active':''}`}>{p}</button>
                            )}
                        </div>
                        <button disabled={currentPage>=totalPages} onClick={()=>setCurrentPage(p=>p+1)} className="pagination-arrow">ВПЕРЁД →</button>
                    </div>
                )}

            </div>
            )}


            {contextMenu.visible && (
                <div className="category-context-menu" style={{ top: contextMenu.y, left: contextMenu.x }}>
                    <div className="context-menu-item" onClick={handleAddSubcategory}><img src={addIcon} className="context-icon" />Добавить подкатегорию</div>
                    <div className="context-menu-item" onClick={handleEditCategory}><img src={editIcon} className="context-icon" />Изменить</div>
                    <div className="context-menu-item delete-context-menu-item" onClick={handleDeleteCategory}><img src={deleteIcon} className="context-icon" />Удалить</div>
                </div>
            )}

            {showFurnitureModal && (
                <CreateFurniture
                    show={showFurnitureModal}
                    onHide={()=>{setShowFurnitureModal(false); setEditingFurniture(null);}}
                    editingFurniture={editingFurnitureFull}
                    onSave={updated => {
                        setFurnitures(f => f.map(x => x.id === updated.id ? updated : x));
                        setShowFurnitureModal(false);
                        setEditingFurnitureFull(null);
                    }}
                />
            )}
            {showSubModal && (
                <CreateSubcategory
                    show={showSubModal}
                    onHide={() => setShowSubModal(false)}
                    onCreate={handleCreateSubcategory}
                    parentCategoryId={selectedTypeId}
                />
            )}
            {editModalData && (
                <EditCategoryModal
                    show={true}
                    onHide={() => setEditModalData(null)}
                    data={editModalData}
                    onSave={async (newName) => {
                        try {
                            if (editModalData.isSubcategory) {
                                const sub = subtypes.find(s => s.name === editModalData.name);
                                if (sub) await editSubType(sub.id, newName);
                            } else {
                                await editType(editModalData.id, newName);
                            }

                            const [updatedTypes, updatedSubtypes] = await Promise.all([fetchTypes(), fetchSubTypes()]);
                            const updatedCategories = updatedTypes.map(t => ({
                                id: t.id,
                                label: t.name,
                                subcategories: updatedSubtypes
                                    .filter(s => s.typeId === t.id)
                                    .map(s => s.name)
                            }));
                            setTypes(updatedTypes);
                            setSubtypes(updatedSubtypes);
                            setCategories([{ id: 'all', label: 'Все', subcategories: [] }, ...updatedCategories]);

                            setEditModalData(null);
                        } catch (e) {
                            console.error("Ошибка при редактировании:", e);
                            alert('Ошибка при сохранении');
                        }
                    }}
                />
            )}


        </div>
    );
};

export default AdminFurnitureList;
