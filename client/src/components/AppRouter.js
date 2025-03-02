import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { SHOP_ROUTE } from '../utils/consts';
import {Context} from "../index";
import CategoryPage from "../pages/CategoryPage";


const AppRouter = () => {
    const { user } = useContext(Context);

    console.log(user)
    return (
        <Routes>
            {user.isAuth && authRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}
            <Route path="*" element={<Navigate to={SHOP_ROUTE} />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
        </Routes>
    );
};

export default AppRouter;
