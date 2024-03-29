import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react'
import requireAuth from '../../../helpers/requireAuth';
import { httpRequest } from '../../../helpers/utils';
import AuthLayout from '../../../layout/authLayout';
import styles from './styles.module.scss';
import pageContainerStyles from '../../../components/PageContainer/styles.module.scss';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import InfoIcon from '@mui/icons-material/Info';
import { PageContainer } from '../../../components';
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


const Notification = ({ shouldLogOut }) => {

  const [notificationData, setNotificationData] = useState('');
  const [nextUrl, setNextUrl] = useState(notificationData?.nextUrl)
  const [loader, setLoader] = useState(false)
  const texts = useTranslate();

  const getData = async () => {
    try {
      const response = await httpRequest.get("/profile/notification");
      
      setNotificationData(response?.data);
    }
    catch (error) {
      
    }
  }

  const nextUrlCallback = useCallback(async () => {
    try {
      setLoader(true);
      const response = await httpRequest.get(nextUrl);
      const data = response.data.data;
      setNotificationData((state) => {

        return [...notificationData, ...data]
      })
      // todo fix next url here

      setNextUrl(null)
    } catch (error) {

    }
    finally {
      setLoader(false);
    }
  }, [nextUrl]);

  useEffect(() => {
    getData();
    setNextUrl(notificationData?.nextUrl);
  }, [])


  useEffect(() => {
    if (shouldLogOut) {
      signOut({ redirect: false });
      router.push('/');
    }
  }, []);
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{texts.notificationText}</h1>
      <div className={styles.notificationContainer}>
        <PageContainer
          loader={loader}
          nextUrl={nextUrl}
          nextUrlCallback={nextUrlCallback}
          additionalClassName={pageContainerStyles.clearContainer}
        >

          {notificationData?.data?.length && notificationData?.data?.map((dataItem,index) => (
            dataItem?.type == "balance" ? (
              <div  key={index+"balance"} className={styles.notificationItem}>
                <div className={styles.content}>
                  <div className={styles.balanceIcon}>
                    <AccountBalanceWalletIcon />
                  </div>
                  <div className={styles.infoContent}>
                    <h3>{dataItem?.title}</h3>
                    <p>{dataItem?.body}</p>
                  </div>
                </div>
              </div>
            ) : dataItem?.type == "info" ? (
              <div className={styles.notificationItem}>
                <div className={styles.content}>
                  <div className={styles.infoIcon}>
                    <InfoIcon />
                  </div>
                  <div className={styles.infoContent}>
                    <h3>{dataItem?.title}</h3>
                    <p>{dataItem?.body}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.notificationItem}>
                <div className={styles.content}>
                  <div className={styles.orderIcon}>
                    <ShoppingBasketIcon />
                  </div>
                  <div className={styles.infoContent}>
                    <h3>{dataItem?.title}</h3>
                    <p>{dataItem?.body}</p>
                  </div>
                </div>
              </div>
            )
          ))}
        </PageContainer>
      </div>
    </div>
  )
}


Notification.PageLayout = AuthLayout;

export default Notification