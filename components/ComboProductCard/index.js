import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';
import { connect } from 'react-redux';
import styles from './styles.module.scss';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import ZoomInOutlinedIcon from '@mui/icons-material/ZoomInOutlined';
import { useRouter } from 'next/router';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { addToFavorites, removeFromFavorites } from '../../helpers/product';
import { useSession } from 'next-auth/react';
import useTranslate from '../../hooks/useTranslate';
import { successToast, warningToast } from '../../helpers/notification';

const ComboProductCard = ({ data, selectedCurrency, shouldScroll = false }) => {
  const router = useRouter();
  const userSession = useSession();
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
    image,
    inStock,
    isSoon,
    star,
    labels,
    vendorId,
    vendorName,
  } = data;

  const [isInFavorite, setIsInFavorite] = useState(inFavorite);
  const dates = deliveryDates ? Object.values(deliveryDates) : [];
  const texts = useTranslate();
  //Todo make ratings half star as well

  const rating = parseFloat(star) || 0;

  const handleFavorite = useCallback(async () => {
    try {
       if (userSession.status !== 'authenticated') {
         router.push(
           {
             pathname: router.pathname,
             query: {...router.query, login: true},
           },
           undefined,
           {scroll: false},
         );
         return;
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
    } catch (error) {

    }
  }, [inFavorite, isInFavorite, productId]);
  
  return (
    <>
      <div className={styles.container + ' ' + styles.relatedContainer}>
        <div className={styles.cardTop}>
          <Link
            href={
              {
                pathname: router.pathname,
                query: { ...router.query, productId: productId },
              }
            }
            scroll={shouldScroll}>
            <a className={styles.modalButton}>
              <Image
                src={image ? image : '/images/noImage.jpg'}
                alt={name}
                layout="fill"
              />
              <div className={styles.overLay}>
                <ZoomInOutlinedIcon className={styles.zoomIcon} />
              </div>

              <div className={styles.stickerContainer}>
                {/* {hasDiscount && (
                  <span className={styles.discountSticker}>{discountPer}%</span>
                )} */}
                {/* {!!labels?.length &&
                  labels.map((label, index) => {
                    return (
                      <span
                        style={{backgroundColor: label.color}}
                        className={styles.label}
                        key={label.labelId + label.name}>
                        {label.name}
                      </span>
                    );
                  })} */}
              </div>
            </a>
          </Link>

          {/* <button className={styles.favoriteButton} onClick={handleFavorite}>
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
                  className={`${styles.days} ${
                    dates.includes(day) && styles.activeDates
                  }`}>
                  {day}
                </span>
              );
            })}
          </div> */}
        </div>

        <div className={styles.cardBottom}>
          <div className={styles.productHeader}>
            <h5 className={styles.productName}>{name}</h5>
            <h3 className={styles.productSub}>{texts.vendorText}: 
              <Link href={`/vendors/${vendorId}`}>
                <a className={styles.vendorName}>{vendorName}</a>
              </Link>
            </h3>
          </div>

          <div className={styles.priceAndAddToCard}>
            <div className={styles.priceContainer}>
              {/* {hasDiscount && (
                <div className={styles.oldPriceContainer}>
                  <span className={styles.oldPrice}>{oldPrice} {selectedCurrency}</span>
                </div>
              )}
              <span className={styles.price}>{currentPrice} {selectedCurrency}</span> */}

              {!!attribute && (
                <>
                  {/* <span className={styles.slash}> / </span> */}
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
            {/* //Todo add basket button */}
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

export default connect(mapState)(ComboProductCard);
