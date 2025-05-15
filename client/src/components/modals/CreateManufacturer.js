import React, { useState, useEffect } from 'react';
import '../../styles/Modal.css';
import editIcon from '../../assets/icons/pencil.svg';
import deleteIcon from '../../assets/icons/delete.svg';

const CreateManufacturer = ({ show, onHide }) => {
    const [manufacturers, setManufacturers] = useState([]);
    const [newValue, setNewValue] = useState('');
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        if (show) fetchManufacturers();
    }, [show]);

    const fetchManufacturers = async () => {
        try {
            const res = await fetch('/api/manufacturer');
            const data = await res.json();
            setManufacturers(data);
        } catch (err) {
            console.error('Ошибка при загрузке производителей:', err);
        }
    };

    const handleSave = async () => {
        if (!newValue.trim()) return;

        try {
            if (editId) {
                await fetch(`/api/manufacturer/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newValue }),
                });
            } else {
                await fetch('/api/manufacturer', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newValue }),
                });
            }

            setNewValue('');
            setEditId(null);
            fetchManufacturers();
        } catch (err) {
            console.error('Ошибка при сохранении производителя:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить производителя?')) return;

        try {
            await fetch(`/api/manufacturer/${id}`, {
                method: 'DELETE',
            });
            fetchManufacturers();
        } catch (err) {
            console.error('Ошибка при удалении:', err);
        }
    };

    const startEdit = (id, name) => {
        setNewValue(name);
        setEditId(id);
    };

    const cancelEdit = () => {
        setNewValue('');
        setEditId(null);
    };

    if (!show) return null;

    return (
        <div className="modal-overlay" onClick={onHide}>
            <div className="modal-window" onClick={(e) => e.stopPropagation()}>
                <h2>Производители</h2>

                <div className="modal-form">
                    <label>{editId ? 'Редактировать производителя' : 'Добавить производителя'}</label>
                    <input
                        type="text"
                        placeholder="Название производителя"
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                    />
                    <div className="modal-buttons">
                        {editId && <button className="btn-cancel" onClick={cancelEdit}>Отмена</button>}
                        <button className="btn-save" onClick={handleSave}>
                            {editId ? 'Сохранить изменения' : 'Добавить'}
                        </button>
                    </div>
                </div>

                <ul className="manufacturer-list">
                    <h3 style={{marginBottom: '10px'}}>Список производителей: </h3>
                    {manufacturers.map((man) => (
                        <li key={man.id} className="manufacturer-item">
                            <span>{man.name}</span>
                            <div className="icon-buttons">
                                <img
                                    src={editIcon}
                                    alt="Редактировать"
                                    className="icon-btn"
                                    onClick={() => startEdit(man.id, man.name)}
                                />
                                <img
                                    src={deleteIcon}
                                    alt="Удалить"
                                    className="icon-btn"
                                    onClick={() => handleDelete(man.id)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default CreateManufacturer;
