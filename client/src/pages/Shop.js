import React from 'react';
import ImageSlider from "../components/Slider";
import Catalog from "../components/Catalog";
import NewProductSection from "../components/NewProductSection";
import WhyUsSection from "../components/WhyUs";
import Footer from "../components/Footer";
const Shop = () => {
    return (
        <div className="page-container">
            <ImageSlider />
            <Catalog />
            <NewProductSection />
            <WhyUsSection />
            <Footer />
        </div>
    );
};

export default Shop;