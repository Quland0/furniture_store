import React from 'react';
import {Link} from 'react-router-dom';
import '../styles/Footer.css';
import logo from '../assets/images/logos/logo.png';
import instagramIcon from '../assets/icons/instagram1.svg';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-left">
                    <img src={logo} alt="МебельРум161" className="footer-logo"/>
                    <div className="social-icons">
                        <a href="https://www.instagram.com/mebelrum161" target="_blank" rel="noopener noreferrer">
                            <img src={instagramIcon} alt="Instagram"/>
                        </a>
                    </div>
                </div>

                <div className="footer-column">
                    <h4>Каталог</h4>
                    <ul>
                        <li><Link to="/category/14">Спальня</Link></li>
                        <li><Link to="/category/15">Кухня</Link></li>
                        <li><Link to="/category/16">Гостиная</Link></li>
                        <li><Link to="/category/17">Прихожая</Link></li>
                        <li><Link to="/category/18">Детская</Link></li>
                        <li><Link to="/category/19">Столы и стулья</Link></li>
                        <li><Link to="/category/21">Диваны и кресла</Link></li>
                        <li><Link to="/category/22">Люстры</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Покупателю</h4>
                    <ul>
                        <li><Link to="/delivery-and-payment">Доставка и оплата</Link></li>
                        <li><Link to="/measurer">Замерщик</Link></li>
                        <li><Link to="/contacts">О нас</Link></li>
                    </ul>
                </div>

                <div className="footer-column">
                    <h4>Контакты</h4>
                    <ul>
                        <li>+7 (918) 898-88-22</li>
                        <li>+7 (918) 898-88-38</li>
                        <li>Режим работы: 9:00 - 18:00 (МСК)</li>
                        <li>Адрес: Ростовская обл.,<br/>
                            Мясниковский район,<br/>
                            с. Крым, ул. Большесальская 45а
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>2018 - 2025 © МебельРум161</p>
            </div>
        </footer>
    );

};

export default Footer;
