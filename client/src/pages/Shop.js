import React from 'react';
import ImageSlider from "../components/Slider";
import Catalog from "../components/Catalog";
import NewProductSection from "../components/NewProductSection";
const Shop = () => {
    return (
        <div className="page-container">
            <ImageSlider />
            <Catalog />
            <NewProductSection />
        </div>
    );
};

export default Shop;