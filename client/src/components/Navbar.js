// src/components/Navbar.js
import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {observer} from "mobx-react-lite";
import "../styles/Navbar.css";
import logo from "../assets/images/logos/logo.png";
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
    DELIVERYANDPAYMENT_ROUTE,
    MEASURER_ROUTE,
    CONTACTS_ROUTE,
    ADMIN_ROUTE,
} from "../utils/consts";
import CatalogSidebar from "./CatalogSidebar";
import { Context } from "../index";

const Navbar = observer( () => {
    const { user } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const topBar = document.querySelector(".top-bar");
            const navbar = document.querySelector(".navbar");

            if (currentScroll > 50) {
                topBar.style.transform = "translateY(-100%)";
                navbar.style.top = "0";
            } else {
                topBar.style.transform = "translateY(0)";
                navbar.style.top = "50px";
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const catalogButtonRef = useRef(null);

    const handleToggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen((prev) => !prev);
    };

    const handleLogout = () => {
        if (window.confirm("Вы уверены, что хотите выйти из аккаунта?")) {
            localStorage.removeItem("token");

            if (user.logout) {
                user.logout();
            } else {
                user.setIsAuth(false);
                user.setUser({});
            }
            navigate(LOGIN_ROUTE);
        }
    };

    return (
        <header>
            <div className="top-bar">
                <div className="top-bar-container">
                    <div className="top-bar-address">
                        <img
                            src={locationIcon}
                            alt="Местоположение"
                            className="location-logo"
                        />
                        <span>
                            Ростовская обл., Мясниковский район,
                            <br /> с. Крым, ул. Большесальская 45а
                        </span>
                    </div>
                    <div className="top-bar-info">
                        <Link to={CONTACTS_ROUTE}>Контакты</Link>
                        <Link to={MEASURER_ROUTE}>Замерщик</Link>
                        <Link to={DELIVERYANDPAYMENT_ROUTE}>Доставка и оплата</Link>
                    </div>
                    <div className="top-bar-phones">
                        <a href="tel:+79188988822">+7 (918) 898-88-22</a>
                        <a href="tel:+79188988838">+7 (918) 898-88-38</a>
                    </div>
                </div>
            </div>

            <nav className="navbar">
                <div className="navbar-container">
                    <div className="navbar-content">
                        <Link to={SHOP_ROUTE}>
                            <img src={logo} alt="МебельРум161" className="navbar-logo" />
                        </Link>
                        <div className="desktop-controls">
                            <button
                                className="catalog-button"
                                onClick={handleToggleSidebar}
                                ref={catalogButtonRef}
                            >
                                <span className="catalog-icon">&#9776;</span> Каталог
                            </button>
                            <div className="search-bar">
                                <input type="text" placeholder="Поиск по сайту..." />
                                <button className="search-button">
                                    <img src={searchIcon} alt="Search" />
                                </button>
                            </div>
                            <div className="navbar-icons">
                                {!user.isAuth ? (
                                    <Link to={LOGIN_ROUTE} className="navbar-icon login">
                                        <img
                                            src={userIcon}
                                            alt="Войти"
                                            title="Войти"
                                        />
                                        <span className="icon-text login-icon">Войти</span>
                                    </Link>
                                ) : (
                                    <div
                                        className="navbar-icon login"
                                        onClick={handleLogout}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <img
                                            src={userIcon}
                                            alt="Выйти"
                                            title="Выйти"
                                        />
                                        <span className="icon-text login-icon">Выйти</span>
                                    </div>
                                )}
                                <Link to={FAVORITES_ROUTE} className="navbar-icon favorite-icon">
                                    <img
                                        src={favoriteIcon}
                                        alt="Избранное"
                                        title="Избранное"
                                    />
                                    <span className="icon-text favorite-icon">Избранное</span>
                                </Link>
                                <Link to={BASKET_ROUTE} className="navbar-icon basket-icon">
                                    <img
                                        src={basketIcon}
                                        alt="Корзина"
                                        title="Корзина"
                                    />
                                    <span className="icon-text basket-icon">Корзина</span>
                                </Link>
                                {user.isAuth && user.user.role === "ADMIN" && (
                                    <Link to={ADMIN_ROUTE} className="navbar-icon admin-icon">
                                        <span className="icon-text admin-icon">Admin</span>
                                    </Link>
                                )}
                            </div>
                        </div>

                        <div className="mobile-menu-button" onClick={toggleMobileMenu}>
                            <span>&#9776;</span>
                        </div>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div className="mobile-menu">
                        <Link to={SHOP_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                            Главная
                        </Link>
                        {!user.isAuth ? (
                            <Link to={LOGIN_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                                Войти
                            </Link>
                        ) : (
                            <div onClick={() => {
                                toggleMobileMenu();
                                handleLogout();
                            }}>
                                Выйти
                            </div>
                        )}
                        <Link to={FAVORITES_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                            Избранное
                        </Link>
                        <Link to={BASKET_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                            Корзина
                        </Link>
                        {user.isAuth && user.user.role === "ADMIN" && (
                            <Link to={ADMIN_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                                Админ
                            </Link>
                        )}
                    </div>
                )}
            </nav>

            <CatalogSidebar
                isOpen={sidebarOpen}
                onClose={handleCloseSidebar}
                catalogButtonRef={catalogButtonRef}
            />
        </header>
    );
});

export default Navbar;
