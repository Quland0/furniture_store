import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './components/AppRouter';
import './styles/App.css';
import { Context } from './index';
import { observer } from 'mobx-react-lite';
import { check } from './http/userAPI';
import { fetchFurniture } from './http/FurnitureAPI';
import { Spinner } from 'react-bootstrap';

const App = observer(() => {
    const { user, furniture } = useContext(Context);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const initialize = async () => {
            try {
                if (token) {
                    const data = await check();
                    user.setUser(data);
                    user.setIsAuth(true);
                } else {
                    user.setIsAuth(false);
                }

                const furnitureData = await fetchFurniture();
                furniture.setFurnitures(furnitureData.rows);
            } catch (error) {
                console.error("Ошибка при инициализации:", error);
                localStorage.removeItem('token');
                user.setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    if (loading) {
        return <Spinner animation="grow" />;
    }

    return (
        <BrowserRouter>
            <div className="page-wrapper">
                <Navbar />
                <div className="content-wrapper">
                    <AppRouter />
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    );
});

export default App;
