import React, {useContext, useEffect, useState} from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRouter from './components/AppRouter';
import './styles/App.css';
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {check} from "./http/userAPI";
import {Spinner} from "react-bootstrap";

const App = observer(() => {
    const{user} = useContext(Context);
    const  [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            check()
                .then(data => {
                    user.setUser(data);
                    user.setIsAuth(true);
                })
                .catch(() => {
                    localStorage.removeItem('token');
                    user.setIsAuth(false);
                })
                .finally(() => setLoading(false));
        } else {
            user.setIsAuth(false);
            setLoading(false);
        }
    }, []);


    if(loading){
        return <Spinner animation={"grow"}/>
    }

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
});

export default App;
