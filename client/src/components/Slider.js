import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Slider.css";
import { Link } from "react-router-dom";

import Slide1 from "../assets/images/slider/Slide1.jpg";
import Slide1Tablet from "../assets/images/slider/Slide1-tablet.jpg";
import Slide1Mobile from "../assets/images/slider/Slide1-mobile.jpg";

import Slide2 from "../assets/images/slider/Slide2.jpg";
import Slide2Tablet from "../assets/images/slider/Slide2-tablet.jpg";
import Slide2Mobile from "../assets/images/slider/Slide2-mobile.jpg";

import Slide3 from "../assets/images/slider/Slide3.jpg";
import Slide3Tablet from "../assets/images/slider/Slide3-tablet.jpg";
import Slide3Mobile from "../assets/images/slider/Slide3-mobile.jpg";

const ImageSlider = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        adaptiveHeight: true,
        cssEase: "linear"
    };

    const slides = [
        {
            desktop: Slide1,
            tablet: Slide1Tablet,
            mobile: Slide1Mobile,
            url: "/furniture/21",
        },
        {
            desktop: Slide2,
            tablet: Slide2Tablet,
            mobile: Slide2Mobile,
            url: "/furniture/45",
        },
        {
            desktop: Slide3,
            tablet: Slide3Tablet,
            mobile: Slide3Mobile,
            url: "/kitchens",
        }
    ];

    return (
        <div className="slider-wrapper">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="slider-item">
                        <Link to={slide.url} className="slide-link">
                            <picture>
                                <source media="(max-width: 480px)" srcSet={slide.mobile}/>
                                <source media="(min-width: 481px) and (max-width: 1024px)" srcSet={slide.tablet}/>
                                <img src={slide.desktop} alt={`Слайд ${index + 1}`} className="slider-image"/>
                            </picture>
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;
