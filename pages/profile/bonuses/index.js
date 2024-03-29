import { signOut } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { PageContainer } from '../../../components';
import requireAuth from '../../../helpers/requireAuth';
import AuthLayout from '../../../layout/authLayout';
import styles from './styles.module.scss';
import useTranslate from '../../../hooks/useTranslate';


export const getServerSideProps = async context => {
  return requireAuth(context, async session => {
    try {
      return {
        props: {
          session
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


const Profile = ({shouldLogOut}) => {
  
  const texts = useTranslate();
  
  useEffect(() => {
    if (shouldLogOut) {
      signOut({redirect: false});
      router.push('/');
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{texts.bonusesText}</h1>
      <PageContainer
        // loader={loader}
        // nextUrl={nextUrl}
        // nextUrlCallback={nextUrlCallback}
      >
        <div className={styles.emptyFavoriteContainer}>
          <div className={styles.noAddress}>
            <Image
              alt={texts.bonusesNotAddedText}
              src="/animations/noProduct.gif"
              layout={'fill'}
            />
          </div>
          <p>{texts.bonusesNotAddedText}</p>
        </div>
      </PageContainer>
    </div>
  )
}


Profile.PageLayout = AuthLayout;

export default Profile