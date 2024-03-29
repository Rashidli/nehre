import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useEffect, useCallback, useReducer, useState } from 'react'
import { connect } from 'react-redux';
import { PageContainer, ComboProductCard } from '../../components';
import { errorToast, successToast, warningToast } from '../../helpers/notification';
import { addToBasket } from '../../helpers/product';
import { httpRequest } from '../../helpers/utils';
import styles from './styles.module.scss'
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import { getCookie } from 'cookies-next';
import clsx from 'clsx';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { KeyboardArrowUp, KeyboardArrowDown } from '@mui/icons-material';
import useTranslate from '../../hooks/useTranslate';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

export async function getServerSideProps(context) {
  const { query, locale, req } = context;
  const session = await getSession(context);
  if (session) {
    httpRequest.defaults.headers[
      'Authorization'
    ] = `Bearer ${session.user.accessToken}`;
  }
  httpRequest.defaults.headers['Location'] = locale;
  httpRequest.defaults.headers['X-Currency'] = req.cookies.currency ? JSON.parse(req.cookies.currency).code : 'AZN';

  const response = await httpRequest.get(`/combos/${query.id}`);
  const data = response.data.data

  return {
    props: {
      data: data
    },
  }
}

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


const ComboPage = ({ data, selectedCurrency }) => {
  const userSession = useSession();
  const {
    comboId,
    name,
    slug,
    description,
    note,
    price,
    originalPrice,
    comboCost,
    hasDiscount,
    discountPer,
    quantity,
    weight,
    inFavorite,
    image,
    inStock,
    isSoon,
    products,
    deliveryDates,
    cart,
    cartQuantity
  } = data;
  const dates = deliveryDates ? Object.values(deliveryDates) : [];
  const [localCartQuantity, dispatch] = useReducer(reducer, cartQuantity || 0);
  const [isLoaded, setLoaded] = useState(false);
  const [moreText, setMoreText] = useState(false);
  const texts = useTranslate();
  const [isInFavorite, setIsInFavorite] = useState(inFavorite);

  const getLocalCount = () => {
    const localCount = getCookie('nehre-local-cart');
    if (localCount) {
      const localCountParsed = JSON.parse(localCount);
      const localCountItem = localCountParsed.find(
        item => item.combo_id == comboId,
      );
      if (localCountItem) {
        dispatch({ type: 'set', payload: localCountItem.quantity });
      }
    }
  };

  const setMoreTextHandler = () => {
    setMoreText(!moreText);
  };

  const handleCount = (type, e) => {
    e?.preventDefault();
    if (type === 'add') {
      if (localCartQuantity < quantity) {
        dispatch({ type: 'add' });
        successToast(texts.productAddSuccess);
      } else {
        errorToast(texts.stockError);
      }
    } else if (type === 'remove' && localCartQuantity > 0) {
      dispatch({ type: 'remove' });
      successToast(texts.productDeleteSuccess);
    }
  };

  const changeQuantity = useCallback(async () => {
    try {
      await addToBasket({
        session: userSession,
        quantity: localCartQuantity,
        id: comboId,
        type: 'combo',
      });
    } catch (error) {
      errorToast(texts.error);
    }
  }, [localCartQuantity, userSession, comboId]);


  useEffect(() => {
    if (isLoaded) {
      clearTimeout(debouce);
      debouce = setTimeout(() => {
        changeQuantity();
      }, 250);
    } else {
      setLoaded(true);
    }
  }, [localCartQuantity]);

  useEffect(() => {
    if (userSession.status !== 'authenticated') {
      getLocalCount();
    }
  }, [data, userSession]);


  const handleFavorite = useCallback(async () => {
    try {
      if (userSession.status !== 'authenticated') {
        warningToast(texts.loginToAddFavoriteWarning);
      }
      if (inFavorite || isInFavorite) {
        const response = await removeFromFavorites(comboId, 'combo');
        if (response) {
          setIsInFavorite(false);
          successToast(texts.deletedFromFavoritesSuccess)
        }
        return;
      }
      const response = await addToFavorites(comboId, 'combo');
      if (response) {
        setIsInFavorite(true);
        successToast(texts.addedToFavoritesSuccess)
      }
    } catch (error) { }
  }, [inFavorite, isInFavorite, comboId]);



  return (
    <>
      <div className={styles.container}>
        <div className={styles.comboInfoContainer}>
          <div className={styles.comboTop}>
            <div className={styles.imageContainer}>
              <Image src={image} alt={name} layout={'fill'} width={100} height={100} />
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
          </div>
          <div className={styles.comboBottom}>
            <div className={styles.comboInfo}>
              <div className={styles.comboNameAndFavoriteButton}>
                <h3 className={styles.comboName}>
                  {name}
                </h3>
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
              <span className={styles.comboCountWeight}>{products.length} {texts.productText} - {weight} kg</span>

              <div className={styles.descriptionContainer}>
                <p className={styles.description}>
                  {moreText ? description : `${description.slice(0, 100)}...`}
                  <button
                    className={styles.moreTextButton}
                    onClick={setMoreTextHandler}>
                {moreText ? texts.showLess : texts.showMore}
                    {moreText ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </button>
                </p>
              </div>
            </div>
            <div className={styles.comboBottomContent}>
              <div className={styles.priceContainer}>
                <span className={styles.price}>
                  {hasDiscount && (
                    <div className={styles.oldPriceContainer}>
                      <span className={styles.oldPrice}>{originalPrice} {selectedCurrency}</span>
                    </div>
                  )}
                  <span className={styles.price}>{price} {selectedCurrency}</span>
                  {!!weight && (
                    <>
                      <span className={styles.attribute}> / {weight} kg</span>
                    </>
                  )}
                </span>
              </div>
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
      <PageContainer subTitle={texts.comboProductsText} >
        {!!products.length ? products.map((item, index) => <ComboProductCard data={item} key={index + "comboProductCard" + item.productId} />) : <Image alt={texts.noProductText} src='/animations/noProduct.gif' width={300} height={300} />}
      </PageContainer>
    </>
  )
}

const mapState = (state) => ({
  selectedCurrency: state.globalData.selectedCurrency,
});

export default connect(mapState)(ComboPage);