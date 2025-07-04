import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { SHOP_ROUTE } from '../utils/consts';
import { Context } from '../index';
import CategoryPage from '../pages/CategoryPage';
import FurniturePage from "../pages/FurniturePage";
import Favorites from "../pages/Favorites";
import Basket from "../pages/Basket";
import UserAgreement from '../pages/UserAgreement';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import SearchResultsPage from "../pages/SearchResultsPage";
import UserOrders from "../pages/UserOrders";

const AppRouter = () => {
    const { user } = useContext(Context);

    return (
        <Routes>
            {/* Приватные маршруты */}
            {user.isAuth && authRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}

            {/* Публичные маршруты */}
            {publicRoutes.map(({ path, Component }) => (
                <Route key={path} path={path} element={<Component />} />
            ))}

            <Route path="/category/:categoryName/:subcategory/page/:pageNumber" element={<CategoryPage />} />
            <Route path="/category/:categoryName/page/:pageNumber" element={<CategoryPage />} />
            <Route path="/category/:categoryName/:subcategory" element={<CategoryPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/furniture/:id" element={<FurniturePage />} />
            <Route path="/favorites" element={<Favorites isAuth={user.isAuth} />} />
            <Route path="/basket" element={<Basket isAuth={user.isAuth} />} />
            <Route path="/user-agreement" element={<UserAgreement />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/my-orders" element={<UserOrders />} />

            <Route path="*" element={<Navigate to={SHOP_ROUTE} replace />} />
        </Routes>
    );
};

export default AppRouter;