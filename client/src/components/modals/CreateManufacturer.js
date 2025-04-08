import React, { useState } from 'react';
import '../../styles/Modal.css';

const CreateManufacturer = ({ show, onHide }) => {
    const [value, setValue] = useState('');

    const handleSave = () => {
        console.log('Добавлен производитель:', value);
        setValue('');
        onHide();
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onHide}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <h2>Добавить производителя</h2>
                <div className="modal-form">
                    <label>Название производителя</label>
                    <input
                        type="text"
                        placeholder="Введите название производителя"
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

export default CreateManufacturer;
