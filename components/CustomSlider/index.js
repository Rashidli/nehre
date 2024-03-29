import React, { useRef, useState } from 'react';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './styles.module.scss';
import { Modal } from '@mui/material';



const CustomSlider = ({
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
        // preventInteractionOnTransition={true}
        className={styles.slider}
        breakpoints={breakpoints}
        // shortSwipes={false}
        navigation={true}
        modules={[Navigation]}
        noSwiping={true}
        noSwipingClass='MuiFormControl-root'
        a11y={false}>

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
            <div>
              <Swiper
                ref={swiperRef}
                a11y={false}
                preventInteractionOnTransition={true}
                className={styles.slider}
                navigation={{
                  nextEl: '.nextButton',
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
              </Swiper>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default CustomSlider;
