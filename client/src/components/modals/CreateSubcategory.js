import React, { useState } from 'react';
import '../../styles/Modal.css';

const CreateSubcategory = ({ show, onHide, onCreate, parentCategoryId }) => {
    const [subName, setSubName] = useState('');

    const handleSubmit = () => {
        if (subName.trim()) {
            onCreate(subName, parentCategoryId);
            setSubName('');
            onHide();
        }
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onHide}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <h2>Добавить подкатегорию</h2>
                <input
                    type="text"
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    placeholder="Название подкатегории"
                />
                <div className="modal-buttons">
                    <button className="btn-cancel" onClick={onHide}>Отмена</button>
                    <button className="btn-save" onClick={handleSubmit}>Сохранить</button>
                </div>
            </div>
        </div>
    );
};

export default CreateSubcategory;
