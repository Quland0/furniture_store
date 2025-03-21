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
    WARRANTY_ROUTE,
    PAYMENT_ROUTE,
    CREDIT_ROUTE,
    MEASURER_ROUTE,
    CONTACTS_ROUTE
} from "./utils/consts";
import Basket from './pages/Basket';
import Favorites from './pages/Favorites';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
import FurniturePage from './pages/FurniturePage';
import Credit from './pages/Credit';
import Payment from './pages/Payment';
import Warranty from './pages/Warranty';
import DeliveryAndPayment from './pages/DeliveryAndPayment';
import Measurer from "./pages/Measurer";
import Contacts from "./pages/Contacts";
import CategoryPage from "./pages/CategoryPage";

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
        path: PAYMENT_ROUTE,
        Component: Payment
    },
    {
        path: WARRANTY_ROUTE,
        Component: Warranty
    },
    {
        path: CREDIT_ROUTE,
        Component: Credit
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
    }
];
