import Image from "next/image";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import { connect } from "react-redux";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { useReducer } from "react";
import { useSession } from "next-auth/react";
import { getCookie } from "cookies-next";
import { errorToast, successToast, warningToast } from "../../helpers/notification";
import { addToBasket, addToFavorites, removeFromFavorites } from "../../helpers/product";
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import clsx from "clsx";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import useTranslate from "../../hooks/useTranslate";

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

const ComboCard = ({ data, selectedCurrency }) => {
  const {
    comboId,
    name,
    slug,
    price,
    originalPrice,
    hasDiscount,
    discountPer,
    quantity,
    weight,
    inFavorite,
    image,
    inStock,
    isSoon,
    deliveryDates,
    productCount,
    cartQuantity
  } = data;
  const texts = useTranslate();

  const dates = deliveryDates ? Object.values(deliveryDates) : [];
  const [localCartQuantity, dispatch] = useReducer(reducer, cartQuantity || 0);
  const userSession = useSession();
  const [isLoaded, setLoaded] = useState(false);
  const [isInFavorite, setIsInFavorite] = useState(inFavorite);
  
  //Todo make ratings half star as well
  // const rating = parseFloat(star) || 0;
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
  }, [inFavorite, isInFavorite, comboId,texts]);

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
  }, [localCartQuantity, userSession, comboId , texts]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.cardTop}>
        {!!localCartQuantity && (
          <Link
            href={`/combos/${comboId}`}
              shallow={true}>
              <a className={styles.counter}>
                <button
                  onClick={e => handleCount('remove', e)}
                  className={clsx(styles.button)}>
                  <RemoveSharpIcon className={styles.decreaseIcon} />
                </button>
                <span>{localCartQuantity}</span>
                <button
                  onClick={e => handleCount('add', e)}
                  // Todo fix button disableing here, when new data is added to the backend
                  className={clsx(styles.button)}>
                  <AddSharpIcon className={styles.increaseIcon} />
                </button>
              </a>
            </Link>
          )}
          <Link
            href={`/combos/${comboId}`}
            className={styles.modalButton}
          >
            <Image src={image} alt={name} layout="fill" className={styles.cardImg} />
          </Link>
          <button className={clsx(styles.favoriteButton, isInFavorite && styles.inFavoriteButton)} onClick={handleFavorite}>
            {isInFavorite ? (
              <FavoriteIcon className={styles.favoriteIcon} />
            ) : (
              <FavoriteBorderIcon className={styles.favoriteIcon} />
            )}
          </button>
          {hasDiscount && (
            <span className={styles.discountSticker}>{discountPer}%</span>
          )}
          <div className={styles.delivery}>
            {dates?.map((day, index) => {
              return (
                <span
                  key={day + index}
                  className={`${styles.days} ${
                    dates.includes(day) && styles.activeDates
                  }`}>
                  {day}
                </span>
              );
            })}
          </div>
        </div>
        <div className={styles.cardBottom}>
          <div className={styles.productHeader}>
            <h5 className={styles.productName}>{name}</h5>
            <h3 className={styles.productSub}>{productCount} {texts.noDeliveryTitlePartTwo} 
              {!!weight && (
                  <>
                    <span className={styles.slash}> / </span>
                    <span className={styles.attribute}>{weight} kg</span>
                  </>
                )}
            </h3>
          </div>
          <div className={styles.priceAndAddToCard}>
            <div className={styles.priceContainer}>
              {hasDiscount && (
                <div className={styles.oldPriceContainer}>
                  <span className={styles.oldPrice}>{originalPrice} {selectedCurrency}</span>
                </div>
              )}
              <span className={styles.price}>{price} {selectedCurrency}</span>
              
              {/* <div className={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((item, index) => {
                  if (item <= rating) {
                    return (
                      <StarOutlinedIcon
                        key={index + "star"}
                        className={styles.starFilled}
                      />
                    );
                  } else {
                    return (
                      <StarOutlineOutlinedIcon
                        key={index + "star"}
                        className={styles.starOutline}
                      />
                    );
                  }
                })}
              </div> */}
            </div>
            {/* //Todo add basket button */}
            {!isSoon ? (
              <button
                type="button"
                className={styles.cartButton}
                onClick={() => handleCount('add')}
              // todo fix inStocke conditon
              >
                <ShoppingBasketIcon className={styles.cartIcon} />
              </button>
            ) : (
              <div className={styles.soonContainer}>
                <div className={styles.soonContent}>
                  <span className={styles.soonText}>{texts.soonText}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  selectedCurrency: state.globalData.selectedCurrency,
});
export default connect(mapStateToProps)(ComboCard);