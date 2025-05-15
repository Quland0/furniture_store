import React, { useState, useEffect } from 'react';
import '../../styles/Modal.css';
import deleteIcon from "../../assets/icons/delete.svg";
import {
    createFurniture,
    updateFurniture,
    fetchManufacturers,
    fetchTypes,
    fetchSubtypesByTypeId
} from '../../http/FurnitureAPI';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const CreateFurniture = ({ show, onHide, editingFurniture, onSave }) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [typeId, setTypeId] = useState('');
    const [subTypeId, setSubTypeId] = useState('');
    const [manufacturerId, setManufacturerId] = useState('');
    const [isNew, setIsNew] = useState(false);
    const [images, setImages] = useState([]); // { file?, previewUrl, existingId? }
    const [info, setInfo] = useState([]);

    const [types, setTypes] = useState([]);
    const [subTypes, setSubTypes] = useState([]);
    const [manufacturers, setManufacturers] = useState([]);

    useEffect(() => {
        fetchTypes().then(setTypes);
        fetchManufacturers().then(setManufacturers);
    }, []);

    useEffect(() => {
        if (typeId) {
            fetchSubtypesByTypeId(typeId).then(setSubTypes);
        } else {
            setSubTypes([]);
        }
    }, [typeId]);

    useEffect(() => {
        if (editingFurniture) {
            setName(editingFurniture.name || '');
            setPrice(editingFurniture.price || '');
            setTypeId(editingFurniture.types?.[0]?.id?.toString() || '');
            setSubTypeId(editingFurniture.subTypeId?.toString() || '');
            setManufacturerId(editingFurniture.manufacturerId?.toString() || '');
            setIsNew(Boolean(editingFurniture.new));
            setInfo(
                (editingFurniture.info || []).map(i => ({
                    id: i.id,
                    title: i.title,
                    description: i.description
                }))
            );
            setImages(
                editingFurniture.images.map(img => ({
                    existingId: img.id,
                    previewUrl: `${process.env.REACT_APP_API_URL || ''}/${img.img}`
                }))
            );
        } else {
            resetForm();
        }
    }, [editingFurniture]);

    const resetForm = () => {
        setName('');
        setPrice('');
        setTypeId('');
        setSubTypeId('');
        setManufacturerId('');
        setIsNew(false);
        setImages([]);
        setInfo([]);
    };

    const handleFileChange = e => {
        const files = Array.from(e.target.files).map(file => ({
            file,
            previewUrl: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...files]);
    };

    const removeImage = index => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const addInfoRow = () => {
        setInfo(prev => [...prev, { id: Date.now(), title: '', description: '' }]);
    };

    const removeInfoRow = id => {
        setInfo(prev => prev.filter(item => item.id !== id));
    };

    const changeInfo = (id, key, value) => {
        setInfo(prev =>
            prev.map(item => (item.id === id ? { ...item, [key]: value } : item))
        );
    };
    const reorderImages = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };

    const handleSave = async () => {
        try {
            console.log('handleSave called')
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('typeId', typeId);
            if (subTypeId) formData.append('subTypeId', subTypeId);
            formData.append('manufacturerId', manufacturerId);
            formData.append('isNew', isNew ? 'true' : 'false');

            const existing = images
                .map((img, index) => img.existingId ? { id: img.existingId, order: index } : null)
                .filter(Boolean);
            formData.append('existingImages', JSON.stringify(existing));

            images
                .filter(img => img.file)
                .forEach(imgObj => formData.append('images', imgObj.file));

            formData.append('info', JSON.stringify(info));

            let result;
            if (editingFurniture && Number(editingFurniture.id)) {
                result = await updateFurniture(editingFurniture.id, formData);
            } else {
                result = await createFurniture(formData);
            }
            onSave && onSave(result);
            resetForm();
            onHide();
        } catch (e) {
            console.error('Ошибка при сохранении мебели:', e);
            alert('Не удалось сохранить мебель');
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onHide}>
            <div className="modal-window" onClick={e => e.stopPropagation()}>
                <h2>{editingFurniture ? 'Редактировать мебель' : 'Добавить мебель'}</h2>

                <label>Название</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required />

                <label>Цена</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required />

                <label>Категория</label>
                <select value={typeId} onChange={e => setTypeId(e.target.value)} required>
                    <option value="">Выберите категорию</option>
                    {types.map(t => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>

                {subTypes.length > 0 && (
                    <>
                        <label>Подкатегория</label>
                        <select value={subTypeId} onChange={e => setSubTypeId(e.target.value)}>
                            <option value="">Без подкатегории</option>
                            {subTypes.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </>
                )}

                <label>Производитель</label>
                <select value={manufacturerId} onChange={e => setManufacturerId(e.target.value)} required>
                    <option value="">Выберите производителя</option>
                    {manufacturers.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>

                <div className="checkbox-row">
                    <input
                        id="isNewCheckbox"
                        type="checkbox"
                        checked={isNew}
                        onChange={() => setIsNew(!isNew)}
                    />
                    <label htmlFor="isNewCheckbox">Новинка</label>
                </div>

                <label>Изображения</label>
                <input type="file" multiple onChange={handleFileChange} />
                <DragDropContext onDragEnd={(result) => {
                    if (!result.destination) return;
                    const reordered = reorderImages(images, result.source.index, result.destination.index);
                    setImages(reordered);
                }}>
                    <Droppable droppableId="images" direction="horizontal">
                        {(provided) => (
                            <div className="images-preview" ref={provided.innerRef} {...provided.droppableProps}>
                                {images.map((imgObj, index) => (
                                    <Draggable key={imgObj.previewUrl || imgObj.existingId || index} draggableId={(imgObj.previewUrl || imgObj.existingId || index).toString()} index={index}>
                                        {(provided) => (
                                            <div
                                                className="image-item"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <button className="delete-image-btn" onClick={() => removeImage(index)}>
                                                    <img src={deleteIcon} alt="Удалить" />
                                                </button>
                                                <img src={imgObj.previewUrl} alt="" className="thumb" />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                <label>Характеристики</label>
                <button className="btn-add-prop" onClick={addInfoRow}>Добавить характеристику</button>
                {info.map(item => (
                    <div key={item.id} className="info-row">
                        <input
                            type="text"
                            placeholder="Название свойства"
                            value={item.title}
                            onChange={e => changeInfo(item.id, 'title', e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Описание свойства"
                            value={item.description}
                            onChange={e => changeInfo(item.id, 'description', e.target.value)}
                        />
                        <button className="btn-remove-prop" onClick={() => removeInfoRow(item.id)}>
                            Удалить
                        </button>
                    </div>
                ))}

                <div className="modal-buttons">
                    <button className="btn-save" onClick={handleSave}>Сохранить</button>
                    <button className="btn-cancel" onClick={onHide}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

export default CreateFurniture;
