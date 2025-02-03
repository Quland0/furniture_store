import React from "react";
import "../styles/Navbar.css";
import logo from "../assets/images/logo.png"; // Логотип
import userIcon from "../assets/icons/user.svg";
import searchIcon from "../assets/icons/search.svg";
import basketIcon from "../assets/icons/basket.svg";
import favoriteIcon from "../assets/icons/favorite.svg";

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Логотип */}
                <img src={logo} alt="МебельРум161" className="navbar-logo" />

                {/* Кнопка Каталог */}
                <button className="catalog-button">
                    <span className="catalog-icon">&#9776;</span> Каталог
                </button>

                {/* Поле поиска */}
                <div className="search-bar">
                    <input type="text" placeholder="Поиск по сайту..." />
                    <button className="search-button">
                        <img src={searchIcon} alt="Search" />
                    </button>
                </div>

                {/* Иконки справа */}
                <div className="navbar-icons">
                    <div className="navbar-icon login">
                        <img src={userIcon} alt="Войти" title="Войти" />
                        <span className="icon-text login-icon">Войти</span>
                    </div>
                    <div className="navbar-icon favorite-icon">
                        <img src={favoriteIcon} alt="Избранное" title="Избранное" />
                        <span className="icon-text favorite-icon">Избранное</span>
                    </div>
                    <div className="navbar-icon basket-icon">
                        <img src={basketIcon} alt="Корзина" title="Корзина" />
                        <span className="icon-text basaket-icon">Корзина</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
