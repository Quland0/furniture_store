import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Slider.css";
import Slide1 from "../assets/images/slider/Slide1.jpg";
import Slide2 from "../assets/images/slider/Slide2.jpg";
import Slide3 from "../assets/images/slider/Slide3.jpg";
import { Link } from "react-router-dom";

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
            image: Slide1,
            url: "/furniture/21",
        },
        {
            image: Slide2,
            url: "/furniture/45",
        },
        {
            image: Slide3,
            url: "/kitchens",
        }
    ];

    return (
        <div className="slider-wrapper">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="slider-item">
                        <Link
                            to={slide.url}
                            className="slide-link"
                        >
                            <img
                                src={slide.image}
                                alt={slide.title}
                                className="slider-image"
                            />
                        </Link>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;