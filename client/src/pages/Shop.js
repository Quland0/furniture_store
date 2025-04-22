import React, {useContext, useEffect} from 'react';
import ImageSlider from "../components/Slider";
import Catalog from "../components/Catalog";
import NewProductSection from "../components/NewProductSection";
import WhyUsSection from "../components/WhyUs";
import {observer} from "mobx-react-lite"
import {Context} from "../index";
import {fetchManufacturers, fetchTypes} from "../http/FurnitureAPI";

const Shop = observer(() => {
    const {furniture} = useContext(Context);

    useEffect(() => {
        fetchTypes().then(data  => furniture.setTypes(data));
        fetchManufacturers().then(data  => furniture.setManufacturers(data));
    },  [])
    return (
        <div className="page-container">
            <ImageSlider />
            <Catalog />
            <NewProductSection />
            <WhyUsSection />
        </div>
    );
});

export default Shop;