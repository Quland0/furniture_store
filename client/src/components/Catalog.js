import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Catalog.css";
import bedroomImg from "../assets/images/catalog/bedroom1.png";
import kitchenImg from "../assets/images/catalog/kitchen1.png";
import livingRoomImg from "../assets/images/catalog/livingRoom1.png";
import kidsRoomImg from "../assets/images/catalog/kidsRoom1.png";
import tableImg from "../assets/images/catalog/dining1.png";
import sofaImg from "../assets/images/catalog/sofa1.png";
import hallwayImg from "../assets/images/catalog/hallway1.png";
import chandelierImg from "../assets/images/catalog/chandelier1.png";
import { fetchTypes } from "../http/FurnitureAPI";

const staticImages = {
    "Спальня": bedroomImg,
    "Кухня": kitchenImg,
    "Гостиная": livingRoomImg,
    "Детская": kidsRoomImg,
    "Столы и стулья": tableImg,
    "Диваны и кресла": sofaImg,
    "Прихожая": hallwayImg,
    "Люстры": chandelierImg,
};

const Catalog = () => {
    const [types, setTypes] = useState([]);

    useEffect(() => {
        fetchTypes()
            .then(data => setTypes(data))
            .catch(err => console.error('Ошибка загрузки типов:', err));
    }, []);

    return (
        <div className="catalog">
            <h2>Каталог</h2>
            <div className="catalog-grid">
                {types.map((type) => (
                    <Link
                        to={`/category/${type.id}`}
                        key={type.id}
                        className="catalog-item"
                    >
                        <img
                            src={staticImages[type.name] || kitchenImg}
                            alt={type.name}
                        />
                        <p>{type.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Catalog;
