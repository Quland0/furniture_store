// src/App.js
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './components/AppRouter';
import './styles/App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="page-wrapper">
                <Navbar />
                <div className="content-wrapper">
                    <AppRouter />
                </div>
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;
