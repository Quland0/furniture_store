import Admin from './pages/Admin';
import {
    ADMIN_ROUTE,
    BASKET_ROUTE,
    CATEGORY_ROUTE,
    DELIVERYANDPAYMENT_ROUTE,
    FAVORITES_ROUTE,
    FURNITURE_ROUTE,
    LOGIN_ROUTE,
    REGISTRATION_ROUTE,
    SHOP_ROUTE,
    MEASURER_ROUTE,
    CONTACTS_ROUTE,
    ORDER_ROUTE,
    ORDER_THANKS_ROUTE,
    ORDER_PRINT_ROUTE,
} from "./utils/consts";

import Basket from './pages/Basket';
import Favorites from './pages/Favorites';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
import FurniturePage from './pages/FurniturePage';
import DeliveryAndPayment from './pages/DeliveryAndPayment';
import Measurer from "./pages/Measurer";
import Contacts from "./pages/Contacts";
import CategoryPage from "./pages/CategoryPage";
import Order from "./pages/Order";
import ThanksPage from "./pages/ThanksPage";
import PrintOrderPage from "./pages/PrintOrderPage";



export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: BASKET_ROUTE,
        Component: Basket
    },
    {
        path: FAVORITES_ROUTE,
        Component: Favorites
    },
];

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Auth
    },
    {
        path: LOGIN_ROUTE,
        Component: Auth
    },
    {
        path: FURNITURE_ROUTE + '/:id',
        Component: FurniturePage
    },
    {
        path: DELIVERYANDPAYMENT_ROUTE,
        Component: DeliveryAndPayment
    },
    {
        path: MEASURER_ROUTE,
        Component: Measurer
    },
    {
        path: CONTACTS_ROUTE,
        Component: Contacts
    },
    {
        path: CATEGORY_ROUTE + '/:categoryName',
        Component: CategoryPage
    },
    {
        path: ORDER_ROUTE,
        Component: Order
    },
    {
        path: ORDER_THANKS_ROUTE,
        Component: ThanksPage
    },
    {
        path: ORDER_PRINT_ROUTE,
        Component: PrintOrderPage
    },
];
