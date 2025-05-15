import React, { useState, useEffect } from 'react';
import '../../styles/Modal.css';

const EditCategoryModal = ({ show, onHide, data, onSave }) => {
    const [value, setValue] = useState('');

    useEffect(() => {
        if (data?.name) {
            setValue(data.name);
        }
    }, [data]);

    const handleSubmit = () => {
        if (value.trim()) {
            onSave(value.trim());
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onHide}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <h2>Редактировать {data.isSubcategory ? 'подкатегорию' : 'категорию'}</h2>
                <div className="modal-form">
                    <label>Новое название</label>
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Введите новое имя"
                    />
                    <div className="modal-buttons">
                        <button className="btn-cancel" onClick={onHide}>Отмена</button>
                        <button className="btn-save" onClick={handleSubmit}>Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCategoryModal;
