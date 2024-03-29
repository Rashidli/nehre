import React, {useState, useEffect, useCallback} from 'react';
import styles from './styles.module.scss';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ReviewCard from '../../../ReviewCard';
import {SyncLoader} from 'react-spinners';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import { useMediaQuery } from '@mui/material';
import useTranslate from '../../../../hooks/useTranslate';

{/* <style jsx>{`
    .count::after{
        width:  'var(--bar-width)';
    }
`}
</style> */}



const Statistics = ({ data }) => {
  const t = useTranslate();
  const texts = {
    "5": t.ratingPerfect,
    "4": t.ratingGood ,
    "3": t.ratingAverage,
    "2": t.ratingBad,
    "1": t.ratingTerrible ,
  }
  const { reviewCount, ratingStatistics } = data;
  const stats = Object.entries(ratingStatistics ?? []);
  return stats.map((item, index) => {
    return (
      <div className={styles.statisticsBox} key={index + 'statistics'}>
        <span className={styles.labelContainer}>{texts[item[0]]}</span>
        <div>
          {[1, 2, 3, 4, 5].map((star, index) => {
            if (star <= item[0]) {
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
                  className={styles.starEmpty}
                />
              );
            }
          })}
        </div>
        <span className={styles.count}>
          <span className={styles.countInner} style={{width: `${item[1] / reviewCount * 100}%`}}>{item[1]}</span>
        </span>
      </div>
    );
  });
};

const Review = ({reviews, rating, reviewCount, ratingStatistics}) => {
  const [reviewsArray, setReviewsArray] = useState(reviews.data);
  const [nextUrl, setNextUrl] = useState(reviews.data.nextUrl);
  const [loader, setLoader] = useState(false);
  const small = useMediaQuery('(max-width: 650px)');
  const t = useTranslate();

  const nextUrlCallback = useCallback(async () => {
    try {
      setLoader(true);
      const response = await httpRequest.get(nextUrl);
      const data = response.data.data;
      setReviewsArray(state => {
        return [...state, ...data];
      });
      // todo fix next url here

      setNextUrl(null);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  }, [nextUrl]);

  return (
    <div className={styles.container}>
      <div className={styles.generalRatings}>
        <div className={styles.ratingBox}>
          <span className={styles.ratingValue}>
            {rating}
            <StarOutlinedIcon className={styles.reviewStar} />
          </span>
          <span className={styles.ratingText}>{t.generalRatingText}</span>
        </div>
        <div className={styles.ratingBox}>
          <span className={styles.ratingValue}>
            {reviewCount}
            <FavoriteIcon className={styles.reviewStar + ' ' + styles.heart} />
          </span>
          <span className={styles.ratingText}>{t.reviewText}</span>
        </div>
        {!small && !!Object.keys(ratingStatistics).length && (
          <div className={styles.statisticsContainer}>
            <Statistics data={{ratingStatistics, reviewCount}} />
          </div>
        )}
      </div>
      {small && !!Object.keys(ratingStatistics).length && (
        <div className={styles.statisticsContainer}>
          <Statistics data={{ratingStatistics, reviewCount}} />
        </div>
      )}
      <div className={styles.customerReviews}>
        {loader && (
          <div className={styles.loaderContainer}>
            <SyncLoader size={20} color={'#2d5d9b'} margin={12} />
          </div>
        )}
        {reviews.data.map((item, index) => {
          return <ReviewCard data={item} key={index + 'productReview'} />;
        })}
        {!!nextUrl && (
          <div className={styles.loadMoreContainer}>
            <button
              className={styles.button}
              type="button"
              onClick={nextUrlCallback}>
              {t.moreText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Review;
