import React from 'react'
import styles from './styles.module.scss'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { connect } from 'react-redux';
import Link from 'next/link';
import Image from 'next/image';
import ArrowLeft from '../../ArrowLeft';
import ArrowRight from '../../ArrowRight';
import clsx from 'clsx';

const settings = {
  infinite: true,
  speed: 250,
  slidesToShow: 8,
  slidesToScroll: 2,
  arrows: true,
  initialSlide: 0,
  prevArrow: <ArrowLeft />,
  nextArrow: <ArrowRight />,

  responsive: [
    {
      breakpoint: 1000,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 2,
      }
    },
    {
      breakpoint: 650,
      settings: {
        slidesToShow: 4,
        slidesToScroll: 2
      }
    }
  ]
};

const DownNavbar = ({ categories, scrollPosition }) => {
  return (
    <nav className={styles.container}>
      <ul className={styles.listContainer}>
        <Slider
          className={styles.slickStyles}
          {...settings}>
          {categories?.map((item, index) => {
            return <Link href={`/category/${item.categoryId}`} key={item.categoryUUID + index}>
              <a className={styles.categoryLink}>
                <div className={clsx(styles.imageContainer, scrollPosition && styles.scrollStyle)}>
                  <Image src={item.thumb} layout={"fill"} alt={item.name} />
                </div>
                <span className={styles.categoryName}>
                  {item.name}
                </span>
              </a>
            </Link>
          })}
        </Slider>
      </ul>
    </nav>
  )
}


const mapState = state => {
  return ({
    categories: state.globalData.categories,
  })
}


export default connect(mapState)(DownNavbar);
