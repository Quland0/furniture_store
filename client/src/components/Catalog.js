import React from "react";
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

const categories = [
    { id: "bedroom", name: "Мебель для спальни", img: bedroomImg },
    { id: "kitchen", name: "Мебель для кухни", img: kitchenImg },
    { id: "living-room", name: "Мебель для гостиной", img: livingRoomImg },
    { id: "kids-room", name: "Мебель для детской", img: kidsRoomImg },
    { id: "tables", name: "Столы и стулья", img: tableImg },
    { id: "sofas", name: "Мягкая мебель", img: sofaImg },
    { id: "hallway", name: "Мебель для прихожей", img: hallwayImg },
    { id: "chandeliers", name: "Люстры", img: chandelierImg },
];

const Catalog = () => {
    return (
        <div className="catalog">
            <h2>Каталог</h2>
            <div className="catalog-grid">
                {categories.map((category) => (
                    <Link
                        to={`/category/${category.id}`}
                        key={category.id}
                        className="catalog-item"
                    >
                        <img src={category.img} alt={category.name} />
                        <p>{category.name}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Catalog;
