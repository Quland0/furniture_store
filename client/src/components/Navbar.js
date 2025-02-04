import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import logo from "../assets/images/logo.png";
import userIcon from "../assets/icons/user.svg";
import searchIcon from "../assets/icons/search.svg";
import basketIcon from "../assets/icons/basket.svg";
import favoriteIcon from "../assets/icons/favorite.svg";
import locationIcon from "../assets/icons/location.svg";

import {
    SHOP_ROUTE,
    LOGIN_ROUTE,
    FAVORITES_ROUTE,
    BASKET_ROUTE,
    DELIVERYANDASSEMBLY_ROUTE,
    MEASURER_ROUTE,
    CONTACTS_ROUTE, CREDIT_ROUTE,
} from "../utils/consts";

const Navbar = () => {
    return (
        <header>
            {/* Top Bar */}
            <div className="top-bar">
                <div className="top-bar-container">
                    <div className="top-bar-address">
                        <img src={locationIcon} alt="Местоположение" className="location-logo"/>
                        <span>Ростовская обл., Мясниковский район, <br/> с. Крым, ул. Большесальская 45а</span>
                    </div>
                    <div className="top-bar-info">
                    <Link to={CONTACTS_ROUTE}>Контакты</Link>
                        <Link to={MEASURER_ROUTE}>Замерщик</Link>
                        <Link to={CREDIT_ROUTE}>Кредит и рассрочка</Link>
                        <Link to={DELIVERYANDASSEMBLY_ROUTE}>Доставка и сборка</Link>
                    </div>
                    <div className="top-bar-phones">
                        <a href="tel:+79188988822">+7 (918) 898-88-22</a>
                        <a href="tel:+79188988838">+7 (918) 898-88-38</a>
                    </div>
                </div>
            </div>

            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to={SHOP_ROUTE}>
                        <img src={logo} alt="МебельРум161" className="navbar-logo" />
                    </Link>
                    <Link to={SHOP_ROUTE}>
                        <button className="catalog-button">
                            <span className="catalog-icon">&#9776;</span> Каталог
                        </button>
                    </Link>
                    <div className="search-bar">
                        <input type="text" placeholder="Поиск по сайту..." />
                        <button className="search-button">
                            <img src={searchIcon} alt="Search" />
                        </button>
                    </div>
                    <div className="navbar-icons">
                        <Link to={LOGIN_ROUTE} className="navbar-icon login">
                            <img src={userIcon} alt="Войти" title="Войти" />
                            <span className="icon-text login-icon">Войти</span>
                        </Link>
                        <Link to={FAVORITES_ROUTE} className="navbar-icon favorite-icon">
                            <img src={favoriteIcon} alt="Избранное" title="Избранное" />
                            <span className="icon-text favorite-icon">Избранное</span>
                        </Link>
                        <Link to={BASKET_ROUTE} className="navbar-icon basket-icon">
                            <img src={basketIcon} alt="Корзина" title="Корзина" />
                            <span className="icon-text basket-icon">Корзина</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
