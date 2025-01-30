import Admin from './pages/Admin';
import {
    ADMIN_ROUTE,
    BASKET_ROUTE,
    CATEGORY_ROUTE,
    DELIVERYANDASSEMBLY_ROUTE,
    FAVORITES_ROUTE,
    FURNITURE_ROUTE,
    LOGIN_ROUTE,
    REGISTRATION_ROUTE,
    SHOP_ROUTE,
    WARRANTY_ROUTE,
    PAYMENT_ROUTE,
    CREDIT_ROUTE
} from "./utils/consts";
import Basket from './pages/Basket';
import Favorites from './pages/Favorites';
import Shop from './pages/Shop';
import Auth from './pages/Auth';
import FurniturePage from './pages/FurniturePage';
import Credit from './pages/Credit';
import Payment from './pages/Payment';
import Warranty from './pages/Warranty';
import DeliveryAndAssembly from './pages/DeliveryAndAssembly';
import favorites from "./pages/Favorites";



export const authRouthes = [
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
]
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
        path: DELIVERYANDASSEMBLY_ROUTE,
        Component: DeliveryAndAssembly
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
    }
]