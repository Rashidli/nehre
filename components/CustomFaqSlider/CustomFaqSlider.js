import React, { useRef, useState } from 'react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './styles.module.scss';
import { Modal } from '@mui/material';


const SlideRight = () => {
  const swiperFaq = useSwiper();
  return (
    <div className={styles.nextButton} onClick={() => swiperFaq.slideNext()} />
  );
};

const ModalSlideRight = () => {
  const swiperFaqModal = useSwiper();
  return (
    <div className={styles.modalNextButton} onClick={() => swiperFaqModal.slideNext()} />
  );
};


const SlideLeft = () => {
  const swiperFaq = useSwiper();
  return <div className={styles.prevButton} onClick={() => swiperFaq.slidePrev()} />

};

const ModalSlideLeft = () => {
  const swiperFaqModal = useSwiper();
  return <div className={styles.modalPrevButton} onClick={() => swiperFaqModal.slidePrev()} />

};

const CustomFaqSlider = ({
  renderModalComponent,
  breakpoints,
  renderComponent,
  renderComponentKey,
  data,
  className,
  hasModal = false,
}) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  const handleClose = () => setOpen(false);

  return (
    <>
      <Swiper
        className={styles.slider}
        breakpoints={breakpoints}
        shortSwipes={false}
        loop={true}
        a11y={false}
        navigation={true}
        modules={[Navigation]}
        noSwiping
        noSwipingClass='MuiFormControl-root'
      >
        <div className={styles.arrowContainer}>
          <SlideLeft />
          <SlideRight />
        </div>
        {data?.map((item, index) => (
          <SwiperSlide
            onClick={() => {
              setActiveIndex(index);
              setOpen(true);
            }}
            key={index + renderComponentKey}
            className={`${styles.swiperItem} ${className}`}>
            {renderComponent(item, index)}
          </SwiperSlide>
        ))}
      </Swiper>
      {hasModal && (
        <Modal open={open} onClose={handleClose}>
          <div className={styles.modalInnerContainer}>
            {/* <div className={styles.modalArrowContainer}>
              <ModalSlideLeft />
              <ModalSlideRight />
            </div> */}
            {/* <div> */}
            <Swiper
              ref={swiperRef}
              a11y={false}
              loop={true}
              preventInteractionOnTransition={true}
              className={styles.modalSlider}
              navigation={{
                nextEl: '.modalNextButton',
              }}
              breakpoints={{
                500: {
                  slidesPerView: 1,
                  spaceBetween: 50,
                },
              }}
              initialSlide={activeIndex}>
              {data?.map((item, index) => (
                <SwiperSlide
                  key={index + renderComponentKey}
                  className={`${styles.swiperItem} ${className}`}>
                  {renderModalComponent(item, index)}
                </SwiperSlide>
              ))}
              <div className={styles.modalArrowContainer}>
                <ModalSlideLeft />
                <ModalSlideRight />
              </div>
            </Swiper>
            {/* </div> */}
          </div>
        </Modal>
      )}
    </>
  );
}

export default CustomFaqSlider