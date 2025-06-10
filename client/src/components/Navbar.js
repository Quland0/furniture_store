import React, { useContext, useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {observer} from "mobx-react-lite";
import "../styles/Navbar.css";
import logo from "../assets/images/logos/logo.png";
import userIcon from "../assets/icons/user.svg";
import searchIcon from "../assets/icons/search.svg";
import basketIcon from "../assets/icons/basket.svg";
import favoriteIcon from "../assets/icons/favorite1.svg";
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

    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileRef = useRef(null);
    useEffect(() => {
        function handleClickOutside(event) {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    const goToOrders = () => {
        navigate("/my-orders");
        setShowProfileMenu(false);
    };

    const handleLogoutClick = () => {
        setShowProfileMenu(false);
        handleLogout();
    };
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
    const [showMobileSearch, setShowMobileSearch] = useState(false);

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
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery("");
        }
    };
    const location = useLocation();
    useEffect(() => {
        setMobileMenuOpen(false);
        setShowMobileSearch(false);
        setSidebarOpen(false);
    }, [location.pathname]);
    const [shortAddress, setShortAddress] = useState(false);
    useEffect(() => {
        const updateAddress = () => {
            setShortAddress(window.innerWidth <= 992);
        };

        updateAddress();
        window.addEventListener("resize", updateAddress);

        return () => window.removeEventListener("resize", updateAddress);
    }, []);
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
        {shortAddress
            ? "Ростовская обл., с. Крым, ул. Большесальская 45а"
            : <>
                Ростовская обл., Мясниковский район,<br/>
                с. Крым, ул. Большесальская 45а
            </>
        }
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
                            <img src={logo} alt="МебельРум161" className="navbar-logo"/>
                        </Link>
                        <div className="mobile-controls">
                            <button className="mobile-search-toggle"
                                    onClick={() => setShowMobileSearch(!showMobileSearch)}>
                                <img src={searchIcon} alt="Поиск"/>
                            </button>
                            <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
                                <span className="burger-icon">&#9776;</span>
                            </button>
                        </div>
                        <div className="desktop-controls">
                            <div className="navbar-center">
                                <button
                                    className="catalog-button"
                                    onClick={handleToggleSidebar}
                                    ref={catalogButtonRef}
                                >
                                    <span className="catalog-icon">&#9776;</span> Каталог
                                </button>
                                <form className="search-bar" onSubmit={handleSearch}>
                                    <input
                                        type="text"
                                        placeholder="Поиск по сайту..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button type="submit" className="search-button">
                                        <img src={searchIcon} alt="Search"/>
                                    </button>
                                </form>
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
                                    <div className="navbar-icon login" ref={profileRef}>
                                        <div
                                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                                            style={{cursor: "pointer"}}
                                        >
                                            <img
                                                src={userIcon}
                                                alt="Профиль"
                                                title="Профиль"
                                            />
                                            <span className="icon-text login-icon">Профиль</span>
                                        </div>
                                        {showProfileMenu && (
                                            <div className="profile-dropdown-menu">
                                                <button onClick={goToOrders}>Мои заказы</button>
                                                <button onClick={handleLogoutClick}>Выйти</button>
                                            </div>
                                        )}
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
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div className={`mobile-menu ${mobileMenuOpen ? "visible" : "hidden"}`}>
                        <button onClick={handleToggleSidebar} className="mobile-menu-item">
                            Каталог
                        </button>

                        <Link to={SHOP_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                            Главная
                        </Link>

                        {!user.isAuth ? (
                            <Link to={LOGIN_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                                Войти
                            </Link>
                        ) : (
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }}
                                className="mobile-menu-item"
                            >
                                Выйти
                            </button>
                        )}

                        <Link to={FAVORITES_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                            Избранное
                        </Link>
                        <Link to={BASKET_ROUTE} onClick={() => setMobileMenuOpen(false)}>
                            Корзина
                        </Link>
                        {user.isAuth && (
                            <Link to="/my-orders" onClick={() => setMobileMenuOpen(false)}>
                                Мои заказы
                            </Link>
                        )}
                    </div>
                )}
                {showMobileSearch && (
                    <form className="mobile-search-bar" onSubmit={handleSearch}>
                        <input
                            type="text"
                            placeholder="Поиск..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit">
                            <img src={searchIcon} alt="Поиск"/>
                        </button>
                    </form>
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
