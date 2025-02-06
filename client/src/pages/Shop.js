import React from 'react';
import ImageSlider from "../components/Slider";
import Catalog from "../components/Catalog";

const Shop = () => {
    return (
        <div className="page-container">
            <ImageSlider />
            <Catalog />
        </div>
    );
};

export default Shop;