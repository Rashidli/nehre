import React, { useEffect } from 'react'
import AuthLayout from '../../../layout/authLayout'
import { signOut } from 'next-auth/react';
import { httpRequest } from '../../../helpers/utils';
import requireAuth from '../../../helpers/requireAuth';
import { useRouter } from 'next/router';
import styles from './styles.module.scss';
import useTranslate from '../../../hooks/useTranslate';


export const getServerSideProps = async context => {
  return requireAuth(context, async session => {
    try { 
       await httpRequest.get('/auth/profile');
 return {
   props: {
     session,
   },
 };
    }
    catch (error) { 
         return {
           props: {
             shouldLogOut: true,
           },
         };
    }
   
  });
};




const Logout = ({shouldLogOut}) => {
  const router = useRouter();
  const texts = useTranslate();
  
  const logout = async () => {
    try {
      const {data} = await httpRequest.post('/auth/logout');
      const {result} = data;

      if ([200, 201].includes(result.code)) {
         signOut({redirect: false});
        router.push('/');
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (shouldLogOut) {
      signOut({redirect: false});
      router.push('/');
    }
  }, []);


  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{texts.logoutText}</h1>
      <div className={styles.innerContainer}>
        <p className={styles.logoutQuestion}>
          {texts.areYouSureToLogoutText}
        </p>
        <button className={styles.logOutButton} type="button" onClick={logout}>
          {texts.logOutButtonText}
        </button>
      </div>
    </div>
  );
};


Logout.PageLayout = AuthLayout;

export default Logout;