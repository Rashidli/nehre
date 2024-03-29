import React, { useState, useEffect, useCallback, useReducer } from 'react';
import Image from 'next/image';
import styles from './styles.module.scss';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Description from './Description';
import Review from './Review';
import { useRouter } from 'next/router';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { connect } from 'react-redux';
import SyncLoader from 'react-spinners/SyncLoader';
import { httpRequest } from '../../../helpers/utils';
import { FormControl, IconButton, InputLabel, MenuItem, Modal, Select } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomSlider from '../../CustomSlider';
import { reviewSliderBreakPoints } from '../../../helpers/sliderSettings';
import ReactPlayer from 'react-player';
import CustomPlayOverlay from '../../CustomPlayOverlay';
import { addToBasket, addToFavorites, removeFromFavorites } from '../../../helpers/product';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { errorToast, successToast, warningToast } from '../../../helpers/notification';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import { getCookie } from 'cookies-next';
import useTranslate from '../../../hooks/useTranslate';

const SlideRight = () => {
  const swiper = useSwiper();
  return <div className={styles.nextButton} onClick={() => swiper.slideNext()} />
}

const SlideLeft = () => {
  const swiper = useSwiper();

  return (
    <div className={styles.prevButton} onClick={() => swiper.slidePrev()} />
  );
};

const reducer = (state, action) => {
  if (action.type === 'add') {
    return state + 1;
  } else if (action.type === 'remove') {
    return state - 1;
  } else if (action.type === 'set') {
    return action.payload;
  }
};

let debouce = null;
let reviewRatingInactivetyTime = null;

const Product = ({ weekObj, selectedCurrency }) => {
  const router = useRouter();
  const productQueryId = router.query.productId;
  const [product, setProduct] = useState({});
  const [productVariation, setProductVariation] = useState(null);
  const [isVisible, setIsVisible] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isInFavorite, setIsInFavorite] = useState(false);
  const [moreText, setMoreText] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const [isLoaded, setLoaded] = useState(false);
  const [isVisibleReviewModal, setIsVisibleReviewModal] = useState(false);
  const [hoverReviewRating, setHoverReviewRating] = useState(0);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const texts = useTranslate();
  const userSession = useSession();

  useEffect(() => {
    setProduct({});
    getData(productQueryId);
  }, [productQueryId]);

  useEffect(() => {
    if (userSession.status !== 'authenticated') {
      getLocalCount();
    }
  }, [product, userSession]);

  const handleReview = (count) => {
    setIsVisibleReviewModal(true);
    setReviewRating(count);
  };

  const hoverReviewRatingIcon = (item) => {
    clearTimeout(reviewRatingInactivetyTime);
    reviewRatingInactivetyTime =  setTimeout(() => {
      setHoverReviewRating(0);
    }, 1500);
    setHoverReviewRating(item);
  };

  const postReview = async () => {
    if (userSession.status !== 'authenticated') {
      return warningToast(texts.loginToWriteReview);
    }

    
    let response = await httpRequest.post(`/products/${productId}/review`, {
      rating: reviewRating,
      review: reviewText,
    });

    if ([200, 201].includes(response.status)) {
      successToast(texts.reviewSuccess);
      setIsVisibleReviewModal(false);
      getData(productId);
    } else {
      errorToast(texts.errorTryAgain);
    }
  };

  const {
    productId,
    name,
    price,
    originalPrice,
    images,
    description,
    composition,
    reviews,
    reviewCount,
    specifications,
    related,
    certificates,
    labels,
    attribute,
    image,
    isSoon,
    inStock,
    variationId,
    hasVariation,
    iframeSrc,
    discountPer,
    deliveryDates,
    hasDiscount,
    rating,
    crossSelling,
    variations,
    inFavorite,
    units,
    vendor,
    rating_statistics,
    cartQuantity,
    quantity,
  } = product;
  const [localCartQuantity, dispatch] = useReducer(reducer, cartQuantity || 0);

  const setModal = image => {
    setIsVisible(true);
    setModalImage(image);
  };
  const hideModal = () => {
    setIsVisible(false);
    setModalImage(null);
  };
  const setMoreTextHandler = () => {
    setMoreText(!moreText);
  };

  const getData = async id => {
    try {
      if (userSession.status == 'authenticated') {
        httpRequest.defaults.headers[
          'Authorization'
        ] = `Bearer ${userSession.data.user.accessToken}`;
      }
      const response = await httpRequest.get(`/products/${id}`);
      const data = response.data.data;
      setProduct({
        ...data, ...data.variations?.[0]
      });
      setProductVariation({ attribute: data.attribute });
      setIsInFavorite(data.inFavorite)
    } catch (error) { }
  };
  const getLocalCount = () => {
    const localCount = getCookie('nehre-local-cart');
    if (localCount) {
      const localCountParsed = JSON.parse(localCount);
      const localCountItem = localCountParsed.find((item)=> { 
        if (hasVariation) {
          return  item.variation_id === variationId;
        }
        return  item.product_id === productId;
      }
      );
      if (localCountItem) {
        dispatch({ type: 'set', payload: localCountItem.quantity });
      }
    }
  };


  const handleCount = (type, e) => {
    e?.preventDefault();
    if (type === 'add') {
      if (localCartQuantity < quantity) {
        dispatch({ type: 'add' });
        successToast(texts.productAddSuccess);
      }
      else {
        errorToast(texts.stockError)
      }
    } else if (type === 'remove' && localCartQuantity > 0) {
      dispatch({ type: 'remove' });
      successToast(texts.productDeleteSuccess);
    }
  }

  useEffect(() => {
    if (isLoaded) {
      clearTimeout(debouce);
      debouce = setTimeout(() => {
        changeQuantity();
      }, 250);
    }
    else {
      setLoaded(true)
    }
  }, [localCartQuantity])



  const changeQuantity = useCallback(async () => {
    try {
      await addToBasket({
        session: userSession,
        quantity: localCartQuantity,
        id: productId,
        variationId,
        hasVariation,
      });
    } catch (error) {
      errorToast(texts.error);
    }
  }, [localCartQuantity, userSession, productId, variationId, hasVariation]);


  const handleFavorite = useCallback(async () => {
    try {
      if (userSession.status !== 'authenticated') {
        warningToast(texts.loginToAddFavoriteWarning);
      }
      if (inFavorite || isInFavorite) {
        const response = await removeFromFavorites(productId);
        if (response) {
          setIsInFavorite(false);
          successToast(texts.deletedFromFavoritesSuccess)
        }
        return;
      }
      const response = await addToFavorites(productId);
      if (response) {
        setIsInFavorite(true);
      successToast(texts.addedToFavoritesSuccess)

      }
    } catch (error) { }
  }, [inFavorite, isInFavorite, productId]);


  const variationData = !!units && Object.entries(units);
  // const weekDays = Object.values(weekObj);
  const dates = deliveryDates ? Object.values(deliveryDates) : [];

  const selectProductVariation = ({ attribute }) => {
    const selectedVariation = variations.find(variation => variation.attribute === attribute);
    setProductVariation({ ...selectedVariation });
    setProduct((state) => {
      return { ...state, ...selectedVariation }
    })

  }

  const handleClick = () => {
    router.push(
      {
        pathname: router.pathname,
        query: router.query.id && { id: router.query.id },
      },
      undefined,
      { scroll: false, shallow: true },
    );
  };

  const pauseVideo = () => {
    if (videoPlaying)
      setVideoPlaying(false);
  };


  const handlePress = useCallback(async () => {
    try {
      await addToBasket({
        session: userSession,
        quantity: 1,
        id: productId,
        variationId,
        hasVariation,
      });

    } catch (error) {

      errorToast(texts.error);
    }
  }, [userSession, productId, variationId, hasVariation,texts]);

  return (
    <Modal
      open={true}
      onClose={handleClick}
      sx={{
        overflowY: 'scroll',
        border: "none",
        "&:focus": {
          border: "none"
        },
        '& .MuiDialog-container': {
          outline: 'none',
          border: 'none',
          backgroundColor: 'red',
        }
      }}>
      <div className={styles.container}>
        <button className={styles.closeButton} onClick={handleClick}>
          <CloseIcon />
        </button>
        {!!Object.keys(product).length ? (
          <>
            <div className={styles.modalTop}>
              <div className={styles.imageContainer}>
                <Swiper
                  onSlideChange={e => setActiveIndex(e.realIndex + 1)}
                  key={images?.length}
                  onSlideNextTransitionEnd={pauseVideo}
                  preventInteractionOnTransition
                  className={styles.productSlider}>
                  {images.length > 1 && (<div className={styles.arrowContainer}>
                    <SlideLeft />
                    <span>{activeIndex}/{image ? images?.length + 1 : images?.length}</span>
                    <SlideRight />
                  </div>)}
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
                <div className={styles.stickers}>
                  {hasDiscount && (
                    <span className={styles.discountSticker}>
                      {discountPer} %
                    </span>
                  )}
                  {!!labels?.length &&
                    labels.map((label, index) => {
                      return (
                        <span
                          style={{ backgroundColor: label.color }}
                          className={styles.stickers}
                          key={index + 'campaignSticker'}>
                          {label.name}
                        </span>
                      );
                    })}
                </div>
                <div className={styles.delivery}>
                  {dates?.map((day, index) => {
                    return (
                      <span
                        key={day + index}
                        className={`${styles.days} ${dates.includes(day) && styles.activeDates
                          }`}>
                        {day}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className={styles.productInfo}>
                <div className={styles.productInfoTop}>
                  <span className={styles.productName}>{name}</span>
                  <div className={styles.startsAndFavoriteContainer}>
                    <div className={styles.starsContainer}>
                      <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map((item, index) => {
                          if (item <= (hoverReviewRating > 0 ? hoverReviewRating : rating)) {
                            return (
                              <StarOutlinedIcon
                                key={index + 'star'}
                                className={styles.starFilled}
                                onMouseEnter={() => hoverReviewRatingIcon(item)}
                                onMouseLeave={() => hoverReviewRatingIcon(0)}
                                onClick={() => handleReview(item)}
                              />
                            );
                          } else {
                            return (
                              <StarOutlineOutlinedIcon
                                key={index + 'star'}
                                className={styles.starOutline}
                                onMouseEnter={() => hoverReviewRatingIcon(item)}
                                onMouseLeave={() => hoverReviewRatingIcon(0)}
                                onClick={() => handleReview(item)}
                              />
                            );
                          }
                        })}
                      </div>
                      <div className={styles.reviews}>
                        {texts.reviewCountText} - {reviewCount}
                      </div>
                    </div>

                    {isVisibleReviewModal && 
                        <div className={styles.reviewModalContainer}>
                          <div className={styles.reviewModalTop}>
                            <textarea
                              className={styles.reviewModalTextarea}
                              placeholder={texts.shareYourThoughtsText}
                              onInput={e => setReviewText(e.target.value)}
                              rows={5}
                            ></textarea>
                          </div>
                          <div className={styles.reviewModalBottom}>
                            <div className={styles.reviewModalBottomLeft}>
                              <div className={styles.starsContainer}>
                                <div className={styles.stars}>
                                  {[1, 2, 3, 4, 5].map((item, index) => {
                                    if (item <= (reviewRating > 0 ? reviewRating : rating)) {
                                      return (
                                        <StarOutlinedIcon
                                          key={index + 'star'}
                                          className={styles.starFilled}
                                          // onMouseEnter={() => setReviewRating(item)}
                                          onClick={() => handleReview(item)}
                                        />
                                      );
                                    } else {
                                      return (
                                        <StarOutlineOutlinedIcon
                                          key={index + 'star'}
                                          className={styles.starOutline}
                                          // onMouseEnter={() => setReviewRating(item)}
                                          onClick={() => handleReview(item)}
                                        />
                                      );
                                    }
                                  })}
                                </div>
                              </div>
                              <span className={styles.reviewModalBottomLeftText}>
                                {reviewRating > 0 ? reviewRating : rating} {texts.starsText}
                              </span>
                            </div>
                            <div className={styles.reviewModalBottomRight}>
                              <button
                                className={styles.reviewModalBottomRightButton}
                                onClick={postReview}>
                                {texts.sendText}
                              </button>
                              <button
                                className={`${styles.reviewModalBottomRightButton} ${styles.reviewModalBottomCancelButton}`}
                                onClick={() => setIsVisibleReviewModal(false)}>
                                {texts.cancelText}
                              </button>
                            </div>
                          </div>
                        </div>
                      }
                    <button
                      type="button"
                      onClick={handleFavorite}
                      className={clsx(styles.favoriteButton, isInFavorite && styles.inFavoriteButton)}>
                      {isInFavorite ? (
                        <FavoriteIcon className={styles.favoriteIcon} />
                      ) : (
                        <FavoriteBorderIcon className={styles.favoriteIcon} />
                      )}
                    </button>
                  </div>
                  <p className={styles.description}>
                    <span> {texts.detailsText}:</span>
                    {moreText ? description : `${description.slice(0, 100)}...`}
                    <button
                      className={styles.moreTextButton}
                      onClick={setMoreTextHandler}>
                     {moreText ? texts.showLess : texts.showMore}
                      {moreText ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </button>
                  </p>
                  <p className={styles.description}>
                    <span> {texts.compositionText}:</span>
                    {composition}
                  </p>
                </div>
                <div className={styles.priceAndAddToCard}>
                  <div className={styles.priceContainer}>
                    <span className={styles.price}>{price} {selectedCurrency}</span>
                    {hasDiscount && (
                      <div className={styles.oldPriceContainer}>
                        <span className={styles.oldPrice}>{originalPrice} {selectedCurrency}</span>
                      </div>
                    )}
                    {!!attribute && (
                      <>
                        <span className={styles.attribute}> / {attribute}</span>
                      </>
                    )}
                  </div>
                  <div className={styles.productAddToCartContainer}>
                    {variations?.length && (
                      <FormControl>
                        <Select
                          sx={
                            {
                              // padding: '14px 12px',
                              '& .MuiSelect-select': {
                                  padding: '0px !important',
                              },
                              border: '1px solid #a0a6a6',
                              height: '100%',
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                              },
                            }
                          }
                          className={styles.variationSelect}
                          value={productVariation?.attribute}
                          onChange={e =>
                            selectProductVariation({ attribute: e.target.value })
                          }>
                          {variations?.map((item, index) => {
                            return (
                              <MenuItem
                                key={index + 'prodVariation'}
                                value={item.attribute}>
                                {item.attribute}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    )}
                    <div className={styles.basketAndFavorite}>
                      {!isSoon ? (
                        !localCartQuantity ?
                          <button
                            className={styles.addBasket}
                            type="button"
                            onClick={() => handleCount('add')}
                          >
                            <ShoppingBasketIcon
                              className={styles.shoppingBasket}
                            />
                            <span>{texts.addToBasketText}</span>
                          </button>
                          : (<div className={styles.counter}>
                            <button
                              onClick={(e) => handleCount('remove', e)}
                              className={clsx(styles.button)}>
                              <RemoveSharpIcon className={styles.decreaseIcon} />
                            </button>
                            <span>{localCartQuantity}</span>
                            <button
                              onClick={(e) => handleCount('add', e)}
                              // Todo fix button disableing here, when new data is added to the backend
                              className={clsx(styles.button)}>
                              <AddSharpIcon className={styles.increaseIcon} />
                            </button>
                          </div>
                          )
                      ) : (
                        <span className={styles.soonText}>{texts.soonText}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.modalBottom}>
              <Tabs className={styles.tabContainer}>
                <TabList className={styles.tabList}>
                  <Tab
                    className={styles.tab}
                    selectedClassName={styles.tabActive}>
                    {texts.detailText}
                  </Tab>
                  <Tab
                    className={styles.tab}
                    selectedClassName={styles.tabActive}>
                    {texts.singleReviewText} ({reviewCount})
                  </Tab>
                  <Tab
                    className={styles.tab}
                    selectedClassName={styles.tabActive}>
                    {texts.certificatesText}
                  </Tab>
                </TabList>
                <TabPanel
                  className={styles.tabPanel}
                  selectedClassName={styles.tabPanelActive}>
                  <Description
                    vendor={vendor}
                    specifications={specifications}
                    related={related}
                    crossSelling={crossSelling}
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
                          alt="sertifikat"
                          src={item}
                          layout="fill"
                          className={styles.certificateImage}
                        />
                      </div>
                    )}
                  />
                </TabPanel>
                <div className={styles.closeTextContainer}>
                  <button className={styles.closeText} onClick={handleClick}>{texts.closeText}</button>
                </div>
              </Tabs>
            </div>
            <Modal open={isVisible} onClose={hideModal}>
              <div className={styles.modalContent}>
                {image && (
                  <Image
                    alt="sertifikat"
                    src={modalImage}
                    layout="fill"
                    className={styles.modalImage}
                  />
                )}
              </div>
            </Modal>
          </>
        ) : (
          <div className={styles.loaderContainer}>
            <SyncLoader size={20} color={'#2d5d9b'} margin={12} />
          </div>
        )}
      </div>
    </Modal>
  );
};

const mapStateToProps = state => {
  return {
    weekObj: state.globalData.deliveryDates,
    selectedCurrency: state.globalData.selectedCurrency,
  };
};

export default connect(mapStateToProps)(Product);
