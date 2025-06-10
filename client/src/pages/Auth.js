import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../index';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../utils/consts';
import '../styles/Auth.css';
import { login, registration } from "../http/userAPI";
import { observer } from "mobx-react-lite";

const Auth = observer(() => {
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showForgotMessage, setShowForgotMessage] = useState(false);
    const [agree, setAgree] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password || (!isLogin && (!confirmPassword || !agree))) {
            setError('Пожалуйста, заполните все поля и примите условия.');
            return;
        }
        if (!isLogin && password !== confirmPassword) {
            setError('Пароли не совпадают.');
            return;
        }

        try {
            let data;
            if (isLogin) {
                data = await login(email, password);
                console.log('Авторизация успешна:', data);
            } else {
                data = await registration(email, password);
                console.log('Регистрация успешна:', data);
            }
            user.setUser(data);
            user.setIsAuth(true);
            navigate(SHOP_ROUTE);
        } catch (e) {
            const errorMessage = e.response?.data?.message || 'Ошибка при выполнении запроса.';
            setError(errorMessage);
            console.error('Ошибка при запросе:', e);
        }
    };

    const handleSwitchMode = (e) => {
        e.preventDefault();
        navigate(isLogin ? REGISTRATION_ROUTE : LOGIN_ROUTE);
    };

    return (
        <div className="auth-page">
            <h2>{isLogin ? 'Авторизация' : 'Регистрация'}</h2>
            {error && <div className="auth-error">{error}</div>}
            <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Пароль</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {isLogin && (
                    <div className="forgot-password">
                        <button
                            type="button"
                            className="forgot-button"
                            onClick={() => setShowForgotMessage(true)}
                        >
                            Забыли пароль?
                        </button>
                        {showForgotMessage && (
                            <div className="forgot-message">
                                Пожалуйста, свяжитесь с администратором для восстановления доступа.
                            </div>
                        )}
                    </div>
                )}
                {!isLogin && (
                    <>
                        <div className="form-group">
                            <label>Подтвердите пароль</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        <div className="form-group checkbox-container">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={agree}
                                    onChange={(e) => setAgree(e.target.checked)}
                                />
                                <span>
            Я принимаю{' '}
                                    <a href="/user-agreement" target="_blank" rel="noopener noreferrer">
                пользовательское соглашение
            </a>{' '}
                                    и{' '}
                                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                политику конфиденциальности
            </a>
        </span>
                            </label>
                        </div>

                    </>
                )}
                <button type="submit" className="auth-submit">
                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </button>
            </form>
            <div className="auth-switch">
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                <button type="button" onClick={handleSwitchMode} className="switch-button">
                    {isLogin ? 'Зарегистрироваться' : 'Войти'}
                </button>
            </div>
        </div>
    );
});

export default Auth;
