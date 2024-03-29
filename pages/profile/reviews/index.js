import React, { useCallback, useEffect, useState } from 'react'
import AuthLayout from '../../../layout/authLayout'
import Image from 'next/image';
import { httpRequest } from '../../../helpers/utils';
import requireAuth from '../../../helpers/requireAuth';
import { PageContainer, ReviewCard } from '../../../components';
import styles from './styles.module.scss';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslate from '../../../hooks/useTranslate';

export const getServerSideProps = async context => {
  httpRequest.defaults.headers['Location'] = context.locale;
  httpRequest.defaults.headers['X-Currency'] = context.req.cookies.currency
    ? JSON.parse(context.req.cookies.currency).code
    : 'AZN';
  return requireAuth(context, async session => {
    try {
      httpRequest.defaults.headers[
        'Authorization'
      ] = `Bearer ${session.session.user.accessToken}`;
      const { data } = await httpRequest.get(`/profile/reviews`);
      return {
        props: {
          reviewData: data,
        },
      };
    } catch (error) {
      return {
        props: {
          shouldLogOut: true,
        }
      };
    }
  });
};


const Profile = ({ reviewData, shouldLogOut }) => {
  const [reviews, setProducts] = useState(reviewData?.data);
  const [nextUrl, setNextUrl] = useState(reviewData?.nextUrl);
  const [loader, setLoader] = useState(false);
  const router = useRouter();
  const texts = useTranslate();
  useEffect(() => {
    setProducts(reviewData?.data);
    setNextUrl(reviewData?.nextUrl);
  }, [reviewData]);

   useEffect(() => {
     if (shouldLogOut) {
       signOut({redirect: false});
        router.push('/');
     }
   }, []);

  const nextUrlCallback = useCallback(async () => {
    try {
      setLoader(true);
      const response = await httpRequest.get(nextUrl);
      const data = response.data.data;
      setProducts(state => {
        return [...state, ...data];
      });

      setNextUrl(null);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  }, [nextUrl]);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{texts.reviewText}</h1>
      <div className={styles.reviewContainer}>
        <PageContainer
          loader={loader}
          nextUrl={nextUrl}
          nextUrlCallback={nextUrlCallback}>
          {!!reviews?.length ? (
            reviews.map((item, index) => (
              <ReviewCard data={item} key={index + 'productCard'} />
            ))
          ) : <div className={styles.emptyReviews}>
            <h2 className={styles.subHeading}>{texts.yourProductReviewText}</h2>
            <p className={styles.description}>{texts.notCheckedOrdersText}</p>
          </div>}
        </PageContainer>
      </div>
    </div>
  )
}


Profile.PageLayout = AuthLayout;

export default Profile