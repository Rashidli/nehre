import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image';
import { Container, CustomSlider, PageContainer, ProductCard, ReviewCard } from '../../components';
import { httpRequest } from '../../helpers/utils';
import styles from './styles.module.scss'
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Review from '../../components/modals/Product/Review';
import StarOutlineOutlinedIcon from "@mui/icons-material/StarOutlineOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import { reviewSliderBreakPoints } from '../../helpers/sliderSettings';
import {Modal} from '@mui/material';
import { getSession } from 'next-auth/react';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import {Navigation} from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import ReactPlayer from 'react-player';
import CustomPlayOverlay from '../../components/CustomPlayOverlay';
import useTranslate from '../../hooks/useTranslate';


export async function getServerSideProps(context) {
   const {query, locale, req} = context;
   const session = await getSession(context);
   if (session) {
     httpRequest.defaults.headers[
       'Authorization'
     ] = `Bearer ${session.user.accessToken}`;
   }
    httpRequest.defaults.headers['Location'] = locale;
    httpRequest.defaults.headers['X-Currency'] = req.cookies.currency ? JSON.parse(req.cookies.currency).code : 'AZN';

    const response = await httpRequest.get(`/vendors/${query.id}`);
    const data = response.data.data

    return {
        props: {
            data: data
        },
    }
}

const VendorPage = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const texts = useTranslate();
    const {
        avatar,
        createdAt,
        email,
        certificates,
        manufacturer,
        name,
        phone,
        products,
        rating,
        reviews,
        vendorId,
        whatsappPhone,
        rating_statistics,
        images,
        reviews_count: reviewCount,
    } = data;

    const {
      iframeSrc,

    } = manufacturer;

    
    const [isVisible, setIsVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [nextUrl, setNextUrl] = useState(products.nextUrl);
    const [vendorProducts, setVendorProducts] = useState(products.data);
    const [loader, setLoader] = useState(false);
    const [videoPlaying, setVideoPlaying] = useState(false);


    const pauseVideo = () => {
      if (videoPlaying)
        setVideoPlaying(false);
    };

    const SlideRight = () => { 
      const swiper = useSwiper();
      return< div className={styles.nextButton} onClick={() => swiper.slideNext()} />
    }

    const SlideLeft = () => {
      const swiper = useSwiper();
      return  <div className={styles.prevButton} onClick={() => swiper.slidePrev()} />
    };

    const setModal = (image) => {
        setIsVisible(true);
        setImage(image);
    }
    const hideModal = () => {
        setIsVisible(false);
        setImage(null);
    }

    useEffect(() => {
        setVendorProducts(products.data);
        setNextUrl(products.nextUrl);
    }, [data])


    const nextUrlCallback = useCallback(async () => {
        try {

            //todo test next url
            setLoader(true);
            const response = await httpRequest.get(nextUrl);
            const data = response.data.data;
            setVendorProducts((state) => {

                return [...state, ...data]
            })
            // todo fix next url here

            setNextUrl(null)
        } catch (error) {

        }
        finally {
            setLoader(false);
        }
    }, [nextUrl]);

    return (
      <div className={styles.container}>
        <div className={styles.vendorInfoContainer}>
          {/* <div className={styles.videoContainer}>
            <iframe
              id="player"
              type="text/html"
              width="100%"
              height="100%"
              src={manufacturer?.link}
              frameborder="0"></iframe>
          </div> */}
          <div className={styles.imageContainer}>
            <Swiper
              onSlideChange={e => setActiveIndex(e.realIndex + 1)}
              key={images?.length}
              onSlideNextTransitionEnd={pauseVideo}
              preventInteractionOnTransition
              className={styles.vendorSlider}>
              <div className={styles.arrowContainer}>
                <SlideLeft />
                <span>{activeIndex}/{image ? images?.length + 1 : images?.length}</span>
                <SlideRight />
              </div>
              <SwiperSlide>
                <ReactPlayer
                  playIcon={<CustomPlayOverlay setPlay={setVideoPlaying} />}
                  light={image}
                  width="100%"
                  playing={videoPlaying}
                  height="100%"
                  url={iframeSrc}
              />
              </SwiperSlide>
              {images?.map((image, index) => (
                <SwiperSlide key={index}>
                  <Image alt="product image" src={image} layout="fill" />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className={styles.vendorInfo}>
            <h3 className={styles.vendorName}>{name}</h3>

            <div className={styles.vendorRating}>
              <div className={styles.rating}>
                {[1, 2, 3, 4, 5].map((item, index) => {
                  if (item <= rating) {
                    return (
                      <StarOutlinedIcon
                        key={index + 'star'}
                        className={styles.starFilled}
                      />
                    );
                  } else {
                    return (
                      <StarOutlineOutlinedIcon
                        key={index + 'star'}
                        className={styles.starOutline}
                      />
                    );
                  }
                })}
              </div>
              <span className={styles.ratingCount}>
                ({reviewCount}) {texts.evaluationText}
              </span>
            </div>
            <span className={styles.supplierText}>
              <span className={styles.preSupplierText}> {texts.productTypeText}:</span>
              {manufacturer.type}
            </span>
            <p className={styles.description}>
              <span> {texts.descriptionText}:</span>
              {manufacturer.description}
            </p>
          </div>
        </div>

        <Tabs className={styles.tabContainer}>
          <TabList className={styles.tabList}>
            <Tab className={styles.tab} selectedClassName={styles.tabActive}>
              {texts.productsText}
            </Tab>
            <Tab className={styles.tab} selectedClassName={styles.tabActive}>
              {texts.aboutVendorText}
            </Tab>
            <Tab className={styles.tab} selectedClassName={styles.tabActive}>
              {texts.certificatesText}
            </Tab>
            <Tab className={styles.tab} selectedClassName={styles.tabActive}>
              {texts.reviewText}

            </Tab>
          </TabList>
          <TabPanel
            className={styles.tabPanel}
            selectedClassName={styles.tabPanelActive}>
            <PageContainer
              loader={loader}
              nextUrl={nextUrl}
              nextUrlCallback={nextUrlCallback}>
              {!!vendorProducts.length ? (
                vendorProducts.map((item, index) => (
                  <ProductCard data={item} key={index + 'productCard'} />
                ))
              ) : (
                <Image
                  alt={texts.noProductText}
                  src="/animations/noProduct.gif"
                  width={300}
                  height={300}
                />
              )}
            </PageContainer>
          </TabPanel>

          <TabPanel
            className={styles.tabPanel}
            selectedClassName={styles.tabPanelActive}>
            <p className={styles.description}> {manufacturer.description}</p>
          </TabPanel>

          <TabPanel
            className={styles.tabPanel}
            selectedClassName={styles.tabPanelActive}>
            <CustomSlider
              breakpoints={reviewSliderBreakPoints}
              data={certificates || []}
              renderComponent={(item, index) => (
                <div
                  className={styles.certificateContainer}
                  onClick={() => setModal(item)}>
                  <Image
                    alt={texts.certificatesText}
                    src={item}
                    layout="fill"
                    className={styles.certificateImage}
                  />
                </div>
              )}
            />
          </TabPanel>
          <TabPanel
            className={styles.tabPanel}
            selectedClassName={styles.tabPanelActive}>
            <Review
              ratingStatistics={rating_statistics}
              reviews={reviews}
              rating={rating}
              reviewCount={reviewCount}
            />
          </TabPanel>
        </Tabs>

        <Modal open={isVisible} onClose={hideModal}>
          <div className={styles.modalContent}>
            {image && (
              <Image
                alt={texts.certificatesText}
                src={image}
                layout="fill"
                className={styles.modalImage}
              />
            )}
          </div>
        </Modal>
      </div>
    );
}

export default VendorPage