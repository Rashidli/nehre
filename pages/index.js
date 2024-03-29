import React, { useEffect } from 'react';
import { Carousel, VideoCard, Card, CategoryCard, Container, CustomSlider, ProductCard, VendorCard, Faq, CarouselProductCard, CarouselVendorCard, FaqDetails } from '../components';
import { connect, useDispatch } from 'react-redux';
import { httpRequest } from '../helpers/utils';
import { setHomeSlice } from '../stores/features/homeSlice';
import styles from '../styles/index.module.scss'
import { faqSliderBreakpoints, productSliderBreakpoints, vendorSliderBreakpoints } from '../helpers/sliderSettings';
import { getSession, signOut } from 'next-auth/react';
import store from '../stores';
import CustomFaqSlider from '../components/CustomFaqSlider/CustomFaqSlider';
import useTranslate from '../hooks/useTranslate';


export async function getServerSideProps(context) {
  const test = store.getState();
  const { locale, req } = context;
  
    const session = await getSession(context);
  if (session) {
    httpRequest.defaults.headers['Authorization'] = `Bearer ${session.user.accessToken}`;
  }
  httpRequest.defaults.headers['Location'] = locale;
  httpRequest.defaults.headers['X-Currency'] = req.cookies.currency ? JSON.parse(req.cookies.currency).code : 'AZN';
  const response = await httpRequest.get("/content/home-page");
  const data = response.data.data

  return {
    props: {
      data: data
    },
  }
}



const Home = ({
  data,
  loading,
  banners,
  faqs,
  vendors,
  collections,
}) => {
  const dispatch = useDispatch();
  const texts = useTranslate();


  const cardData = [
    {
      title: texts.readyToServeText,
      icon: '/images/cardAboutOne.png',
    },
    {
      title: texts.nextDayDeliveryText,
      icon: '/images/cardAboutTwo.png',
    },
    {
      title: texts.noGMOText,
      icon: '/images/cardAboutThree.png',
    },
  ]

  useEffect(() => {
    dispatch(setHomeSlice(data));
  }, [data]);

  //Todo fix home page loading just in case

  if (loading) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <Carousel />
      {Object.keys(banners).length && (
        <div className={styles.middleContainer}>
          {/* <h3 className={styles.title}>Kəndlərimizdən evinizə təzə və təbii məhsulların çatdırılması!</h3> */}
          {banners.homeMiddle && (
            <>
              <h3 className={styles.title}>{banners.homeMiddle.title}</h3>
              <VideoCard data={banners.homeMiddle} />
            </>
          )}
          <div className={styles.cardContainer}>
            {cardData.map((item, index) => (
              <Card
                key={index + 'aboutCard'}
                text={item.title}
                icon={item.icon}
              />
            ))}
          </div>
          {banners.homeDown && (
            <>
              <h3 className={styles.title}>{banners.homeDown.title}</h3>
              <VideoCard data={banners.homeDown} />
            </>
          )}
        </div>
      )}

      {!!collections[0]?.products.length && (
        <Container header={texts.specialOffers}>
          <CustomSlider
            breakpoints={productSliderBreakpoints}
            data={collections[0].products}
            renderComponentKey={'specialOfferCards'}
            renderComponent={(item, index) => (
              <CarouselProductCard data={item} />
            )}
          />
        </Container>
      )}

      <Container header={texts.ourRanges}>
        <div className={styles.flexContainer}>
          {data.categories.map((category, index) => (
            <CategoryCard key={index + 'categoryCard'} data={category} />
          ))}
        </div>
      </Container>

      <div className={styles.cashBackContainer}>
        <span className={styles.cashBackTitle}>{texts.aboutBonusesText}</span>
        <p className={styles.cashBackText}>
          {texts.aboutCashbackText}
        </p>
      </div>

      {!!collections[1].products.length && (
        <Container header={texts.newProductsText}>
          <CustomSlider
            breakpoints={productSliderBreakpoints}
            data={collections[1].products}
            renderComponentKey={'newCarouselProductCard'}
            renderComponent={(item, index) => (
              <CarouselProductCard data={item} />
            )}
          />
        </Container>
      )}

      {!!vendors.length && (
        <Container header={texts.ourVillagersText}>
          <CustomSlider
            breakpoints={vendorSliderBreakpoints}
            data={vendors}
            renderComponentKey={'vendorCard'}
            renderComponent={(item, index) => (
              <CarouselVendorCard data={item} index={index} />
            )}
          />
        </Container>
      )}

      {!!faqs.length && (
        <Container header={texts.faqAnswersText}>
          {/* <CustomSlider
            breakpoints={faqSliderBreakpoints}
            data={faqs}
            hasModal={true}
            renderModalComponent={(item, index) => (<FaqDetails data={item} index={index}  />)}
            renderComponentKey={'faqCard'}
            renderComponent={(item, index) => <Faq data={item} index={index} />}
          /> */}
          <CustomFaqSlider
            breakpoints={faqSliderBreakpoints}
            data={faqs}
            hasModal={true}
            renderModalComponent={(item, index) => (
              <FaqDetails data={item} index={index} />
            )}
            renderComponentKey={'faqCard'}
            renderComponent={(item, index) => <Faq data={item} index={index} />}
          />
        </Container>
      )}
    </div>
  );
};

const mapState = state => {
  return ({
    loading: state.homeData.loading,
    banners: state.homeData.banners,
    collections: state.homeData.collections,
    faqs: state.homeData.faqs,
    vendors: state.homeData.vendors,
  })
}


export default connect(mapState)(Home);
