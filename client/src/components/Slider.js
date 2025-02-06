import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/Slider.css";
import Slide1 from "../assets/images/Slide1.jpg";
import Slide2 from "../assets/images/Slide2.jpg";
import Slide3 from "../assets/images/Slide3.jpg";

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

    const slides = [Slide1, Slide2, Slide3];

    return (
        <div className="slider-wrapper">
            <Slider {...settings}>
                {slides.map((slide, index) => (
                    <div key={index} className="slider-item">
                        <img
                            src={slide}
                            alt={`Slide ${index + 1}`}
                            className="slider-image"
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ImageSlider;