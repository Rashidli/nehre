import React from 'react'
import CarouselCard from './CarouselCard'
import styles from './styles.module.scss'
import ArrowRight from '../ArrowRight';
import ArrowLeft from '../ArrowLeft';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { connect } from 'react-redux';


const settings = {
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    pauseOnFocus: true,
    infinite: true,
    speed: 250,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: true,
    focusOnSelect: true,
    accessibility: true,
    initialSlide: 0,
    prevArrow: <ArrowLeft />,
    nextArrow: <ArrowRight />,

    responsive: [
        {
            breakpoint: 900,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows: false
            },
        },

    ],
};

const Carousel = ({ banners }) => {
    const { homeSlider } = banners;

    return (
        <div className={styles.carouselContainer}>
            <Slider
                className={styles.slickStyles}
                {...settings}>{
                    homeSlider?.bannerItems.map((banner, index) => <CarouselCard banner={banner} key={index + "card"} />)
                }
            </Slider>
        </div>
    )
}


const mapState = state => {
    return ({
        banners: state.homeData.banners,
        loading: state.homeData.loading,
    })
}

export default connect(mapState)(Carousel)