import React, { useState } from 'react';
import '../styles/Admin.css';
import CreateFurniture from '../components/modals/CreateFurniture';
import CreateCategory from '../components/modals/CreateCategory';
import CreateManufacturer from '../components/modals/CreateManufacturer';
import AdminFurnitureList from '../components/AdminFurnitureList';
import AdminFormsList from '../components/AdminFormsList';

const Admin = () => {
    const [furnitureVisible, setFurnitureVisible] = useState(false);
    const [categoryVisible, setCategoryVisible] = useState(false);
    const [manufacturerVisible, setManufacturerVisible] = useState(false);

    return (
        <div className="admin-container">
            <h1>Админ‑панель</h1>

            <div className="admin-top-section">
                <div className="admin-buttons">
                    <button onClick={() => setFurnitureVisible(true)}>
                        Добавить мебель
                    </button>
                    {/* Кнопка "Добавить категорию" убрана */}
                    <button onClick={() => setManufacturerVisible(true)}>
                        Добавить производителя
                    </button>
                </div>

                <div className="admin-forms-shortcut">
                    <AdminFormsList />
                </div>
            </div>

            <AdminFurnitureList
                onAddCategory={() => setCategoryVisible(true)}
            />

            <CreateFurniture
                show={furnitureVisible}
                onHide={() => setFurnitureVisible(false)}
            />
            <CreateCategory
                show={categoryVisible}
                onHide={() => setCategoryVisible(false)}
            />
            <CreateManufacturer
                show={manufacturerVisible}
                onHide={() => setManufacturerVisible(false)}
            />
        </div>
    );
};

export default Admin;
