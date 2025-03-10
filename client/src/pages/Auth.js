import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Context } from '../index';
import { LOGIN_ROUTE, REGISTRATION_ROUTE, SHOP_ROUTE } from '../utils/consts';
import '../styles/Auth.css';

const Auth = () => {
    const { user } = useContext(Context);
    const location = useLocation();
    const navigate = useNavigate();
    const isLogin = location.pathname === LOGIN_ROUTE;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password || (!isLogin && !confirmPassword)) {
            setError('Пожалуйста, заполните все поля.');
            return;
        }
        if (!isLogin && password !== confirmPassword) {
            setError('Пароли не совпадают.');
            return;
        }

        try {
            if (isLogin) {
                console.log('Авторизация:', { email, password });
                navigate(SHOP_ROUTE);
            } else {
                console.log('Регистрация:', { email, password });
                navigate(LOGIN_ROUTE);
            }
        } catch (e) {
            setError(e.response?.data?.message || 'Ошибка при выполнении запроса.');
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
                        placeholder="Введите Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Пароль</label>
                    <input
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {!isLogin && (
                    <div className="form-group">
                        <label>Подтвердите пароль</label>
                        <input
                            type="password"
                            placeholder="Повторите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                )}
                <button type="submit" className="auth-submit">
                    {isLogin ? 'Войти' : 'Зарегистрироваться'}
                </button>
            </form>
            <div className="auth-switch">
                {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
                <a
                    href="#"
                    onClick={handleSwitchMode}
                    className="switch-button"
                >
                    {isLogin ? 'Зарегистрироваться' : 'Войти'}
                </a>
            </div>
        </div>
    );
};

export default Auth;