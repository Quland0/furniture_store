import React, { useState } from 'react';
import '../../styles/Modal.css';
import { CreateType } from '../../http/FurnitureAPI';


const CreateCategory = ({ show, onHide }) => {
    const [value, setValue] = useState('');

    const handleSave = async () => {
        if (!value.trim()) return;

        try {
            await CreateType({ name: value });
            setValue('');
            onHide();
        } catch (error) {
            console.error('Ошибка при добавлении типа:', error);
        }
    };


    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onHide}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <h2>Добавить категорию</h2>
                <div className="modal-form">
                    <label>Название категории</label>
                    <input
                        type="text"
                        placeholder="Введите название категории"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                    />
                    <div className="modal-buttons">
                        <button className="btn-cancel" onClick={onHide}>Отмена</button>
                        <button className="btn-save" onClick={handleSave}>Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateCategory;
