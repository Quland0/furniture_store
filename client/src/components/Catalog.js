import React from "react";
import "../styles/Catalog.css";
import bedroomImg from "../assets/images/bedroom1.png";
import kitchenImg from "../assets/images/kitchen1.png";
import livingRoomImg from "../assets/images/livingRoom1.png";
import kidsRoomImg from "../assets/images/kidsRoom1.png";
import tableImg from "../assets/images/dining1.png";
import sofaImg from "../assets/images/sofa1.png";
import hallwayImg from "../assets/images/hallway1.png";
import chandelierImg from "../assets/images/chandelier1.png";

const categories = [
    { name: "Мебель для спальни", img: bedroomImg},
    { name: "Мебель для кухни", img: kitchenImg},
    { name: "Мебель для гостиной", img: livingRoomImg},
    { name: "Мебель для детской", img: kidsRoomImg},
    { name: "Столы и стулья", img: tableImg},
    { name: "Мягкая мебель", img: sofaImg},
    { name: "Мебель для прихожей", img: hallwayImg},
    { name: "Люстры", img: chandelierImg}
];

const Catalog = () => {
    return (
        <div className="catalog">
            <h2>Каталог</h2>
            <div className="catalog-grid">
                {categories.map((category, index) => (
                    <div key={index} className="catalog-item">
                        <img src={category.img} alt={category.name} />
                        <p style={{ marginTop: category.textMargin }}>{category.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Catalog;
