import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import { useRouter } from 'next/router';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  addToBasket,
  addToFavorites,
  removeFromFavorites,
} from '../../helpers/product';
import { useSession } from 'next-auth/react';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import clsx from 'clsx';
import { errorToast, successToast, warningToast } from '../../helpers/notification';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import { getCookie } from 'cookies-next';
import {
  FormControl,
  MenuItem,
  Select,
} from '@mui/material';
import useTranslate from '../../hooks/useTranslate';

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

const ProductCard = ({ data, selectedCurrency, shouldScroll = false }) => {
  const router = useRouter();
  const userSession = useSession();
  const [isLoaded, setLoaded] = useState(false);
  const [product, setProduct] = useState(data || {});
  const [productVariation, setProductVariation] = useState({
    attribute: data.attribute,
  });

  const {
    productId,
    name,
    deliveryDates,
    slug,
    hasVariation,
    price,
    originalPrice,
    hasDiscount,
    discountPer,
    quantity,
    attribute,
    inFavorite,
    variationId,
    image,
    inStock,
    isSoon,
    star,
    labels,
    vendorId,
    vendorName,
    cartQuantity,
    variations
  } = product;
  const [isInFavorite, setIsInFavorite] = useState(inFavorite);
  const [localCartQuantity, dispatch] = useReducer(reducer, cartQuantity || 0);

  const dates = deliveryDates ? Object.values(deliveryDates) : [];
  const texts = useTranslate();
  //Todo make ratings half star as well
  const selectProductVariation = ({ attribute }) => {
    const selectedVariation = variations.find(
      variation => variation.attribute === attribute,
    );
    setProductVariation({ ...selectedVariation });
    setProduct(state => {
      return { ...state, ...selectedVariation };
    });
  };
  const rating = parseFloat(star) || 0;

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
  }, [inFavorite, isInFavorite, productId,texts]);

  useEffect(() => {
    setProduct(data);
  }, [data]);

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

  useEffect(() => {
    if (userSession.status !== 'authenticated') {
      getLocalCount();
    }
  }, [product, userSession]);


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


  const changeQuantity = useCallback(async () => {
    try {
      const test = await addToBasket({
        session: userSession,
        quantity: localCartQuantity,
        id: productId,
        variationId,
        hasVariation,
      });
    } catch (error) {
      errorToast(texts.error);
    }
  }, [localCartQuantity, userSession, productId, variationId, hasVariation,texts]);

  return (
    <>
      <div className={styles.container + ' ' + styles.relatedContainer}>
        <div className={styles.cardTop}>
          {!!localCartQuantity && (
            <Link
              href={{
                pathname: router.pathname,
                query: { ...router.query, productId: productId },
              }}
              scroll={shouldScroll}
              shallow={true}>
              <a className={styles.counter}>
                <button
                  onClick={(e) => handleCount('remove', e)}
                  className={clsx(styles.button)}>
                  <RemoveSharpIcon className={styles.decreaseIcon} />
                </button>
                <span>{localCartQuantity}</span>
                <button
                  onClick={(e) => handleCount('add', e)}
                  className={clsx(styles.button)}>
                  <AddSharpIcon className={styles.increaseIcon} />
                </button>
              </a>
            </Link>
          )}
          <Link
            href={{
              pathname: router.pathname,
              query: { ...router.query, productId: productId },
            }}
            scroll={shouldScroll}
            shallow={true}>
            <a className={styles.modalButton}>
              <Image
                src={image ? image : '/images/noImage.jpg'}
                alt={name}
                layout="fill"
              />
              <div className={styles.overLay}>
            <ZoomInOutlinedIcon className={styles.zoomIcon} />
          </div>
            </a>
          </Link>

          {/* <div className={styles.overLay}>
            <ZoomInOutlinedIcon className={styles.zoomIcon} />
          </div> */}

          <button className={clsx(styles.favoriteButton, isInFavorite && styles.inFavoriteButton)} onClick={handleFavorite}>
            {isInFavorite ? (
              <FavoriteIcon className={styles.favoriteIcon} />
            ) : (
              <FavoriteBorderIcon className={styles.favoriteIcon} />
            )}
          </button>
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
        {/* Labels and discount stickers */}
        <div className={styles.stickerContainer}>
          {hasDiscount && (
            <span className={styles.discountSticker}>-{discountPer}%</span>
          )}
          {!!labels?.length &&
          labels.map((label, index) => {
            return (
              <Link
                href={`/label/${label.labelId}`}
                key={label.labelId + label.name}
              >
                <span
                  style={{ backgroundColor: label.color }}
                  className={styles.label}
                >
                  {label.name}
                </span>
              </Link>
            );
          })}
        </div>
        <div className={styles.cardBottom}>
          <div>
            <div className={styles.topOfBottomContainer}>
              <div className={styles.productHeader}>
                <h5 className={styles.productName}>{name}</h5>
                <h3 className={styles.productSub}>
                  {texts.vendorText}
                  <Link href={`/vendors/${vendorId}`}>
                    <a className={styles.vendorName}>{vendorName}</a>
                  </Link>
                </h3>
              </div>
              {variations?.length && (
                <FormControl
                  sx={{
                    '&:focus': {
                      outline: "none",
                    }
                  }}>
                  <Select
                    sx={{
                      // background: "red",
                      // display: "inline-block",
                      // width: "100px",
                      // margin: "6px 0",
                      // border: "none",
                      // outline: "none",
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                      '& .MuiSelect-select': {
                        padding: '0 10px 0 0',
  
                      },
                      '& .MuiSelect-select:focus': {
                        border: "none",
                        outline: "none",
                      },
                      '.MuiOutlinedInput-notchedOutline': { border: 0 },
                      "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                        border: "none",
                        outline: "none",
                      },
                      '&:focus': {
                        outline: "none",
                      }
                    }}
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
            </div>
          </div>

          <div className={styles.priceAndAddToCard}>
            <div className={styles.priceContainer}>
              {hasDiscount && (
                <div className={styles.oldPriceContainer}>
                  <span className={styles.oldPrice}>{originalPrice} {selectedCurrency}</span>
                </div>
              )}
              <span className={styles.price}>{price} {selectedCurrency}</span>

              {!!attribute && (
                <>
                  <span className={styles.slash}> / </span>
                  <span className={styles.attribute}>{attribute}</span>
                </>
              )}
              <div className={styles.starsContainer}>
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
            </div>
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
const mapState = state => {
  return {
    products: state.globalData.products,
    selectedCurrency: state.globalData.selectedCurrency,
  };
};

export default connect(mapState)(ProductCard);
