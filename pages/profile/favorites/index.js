import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react'
import { PageContainer, ProductCard } from '../../../components';
import requireAuth from '../../../helpers/requireAuth';
import { httpRequest } from '../../../helpers/utils';
import AuthLayout from '../../../layout/authLayout'
import styles from './styles.module.scss';
import productCardStyles from '../../../components/ProductCard/styles.module.scss';
import pageContainerStyles from '../../../components/PageContainer/styles.module.scss';
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
      const { data } = await httpRequest.get('/profile/favorites');
      return {
        props: {
          favoriteData: data.data,
        },
      };
    } catch (error) {
      return {
        props: {
          shouldLogOut: true,
        },
      };
    }
  });
};

const Favorites = ({ favoriteData, shouldLogOut }) => {
  const [products, setProducts] = useState(favoriteData?.products);
  const [nextUrl, setNextUrl] = useState(favoriteData?.nextUrl);
  // const [selectedFilter, setSelectedFilter] = useState(0);
  const [loader, setLoader] = useState(false);
  // const [count, setCount] = useState(productCount);
  const router = useRouter();
  const texts = useTranslate();
  useEffect(() => {
    setProducts(favoriteData?.products);
    setNextUrl(favoriteData?.nextUrl);

    // setCount(category.productCount);
    // setSelectedFilter(0);
  }, [favoriteData]);

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
      // todo fix next url here
      setNextUrl(null);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  }, [nextUrl]);
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{texts.favoriteProductsText}</h1>
      <PageContainer
        loader={loader}
        nextUrl={nextUrl}
        nextUrlCallback={nextUrlCallback}
        additionalClassName={pageContainerStyles.clearContainer}
        >
        {(!!products?.length) ? (
            products.map((item, index) => (
              <ProductCard data={item} key={index + 'productCard' + item.productID} additionalClassName={`${productCardStyles.favoriteProductContainer}`} />
            ))
        ) : (
          <div className={styles.emptyFavoriteContainer}>
            <div className={styles.noAddress}>
              <Image
                alt={texts.noFavoritesText}
                src="/animations/noProduct.gif"
                layout={'fill'}
              />
            </div>
            <p>
              {texts.noProductsInFavoritesText}
            </p>
          </div>
        )}
      </PageContainer>
    </div>
  );
};


Favorites.PageLayout = AuthLayout;

export default Favorites;