import clsx from 'clsx';
import Link from 'next/link'
import React, { useState } from 'react'
import { connect } from 'react-redux';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import styles from './styles.module.scss'

const SlideRight = () => {
  const swiper = useSwiper();
  return (
    <div className={styles.nextButton} onClick={() => swiper.slideNext()} />
  );
};


const SlideLeft = () => {
  const swiper = useSwiper();
  return <div className={styles.prevButton} onClick={() => swiper.slidePrev()} />

};

const LabelNavbar = ({ labels }) => {

  return (
    <nav className={clsx(styles.container)}>
      {/* <Swiper
        className={`${styles.listContainer} mySwiper`}
        a11y={false}
        loop={true}
        slidesPerView={"auto"}
        spaceBetween={24}
        pagination={{
          clickable: true,
        }}
      > */}
        {/* <div className={styles.arrowContainer}>
          <SlideLeft />
          <SlideRight />
        </div> */}
        {/* {labels.map((item, index) =>
          <SwiperSlide 
            key={index + 'navLink'}
            className={styles.sliderItem}
          >
            <div
              className={`${styles.navLinkContainer} ${styles.navLinkHover}`}
            >
              <Link href={`/label/${item.labelId}`}>
                <a className={styles.navLink}>{item.name}</a>
              </Link>
            </div>
          </SwiperSlide>
        )}
      </Swiper> */}
          <div className={styles.overFlowContainer}>
            <div className={styles.listContainer}>
              {labels.map((item, index) => (
                  <div
                    key={index + 'navLink'}
                    className={`${styles.navLinkContainer}`}
                  >
                    <Link href={`/label/${item.labelId}`}>
                      <a className={styles.navLink}>{item.name}</a>
                    </Link>
                  </div>
                )
              )}
            </div>
          </div>
    </nav>
  );
};


const mampStateToProps = (state) => {
  return {
    labels: state.globalData.labels
  }
}
export default connect(mampStateToProps)(LabelNavbar);