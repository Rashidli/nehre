import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import requireAuth from '../../../helpers/requireAuth';
import AuthLayout from '../../../layout/authLayout';
import styles from './styles.module.scss';
import bonus1Img from '../../../public/images/bonus-1.svg';
import bonus2Img from '../../../public/images/bonus-2.svg';
import bonus3Img from '../../../public/images/bonus-3.svg';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { httpRequest } from '../../../helpers/utils';
import useTranslate from '../../../hooks/useTranslate';




const Referer = ({ shouldLogOut }) => {
  const router = useRouter();
  const [data, setData] = useState('');
  const texts = useTranslate();

  const getData = async () => {
    try {
      const response = await httpRequest.get("/profile/referrer");
      setData(response?.data?.data?.referrerCode);
    }
    catch (error) {
      
    }
  }
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (shouldLogOut) {
      signOut({ redirect: false });
      router.push('/');
    }
  }, []);

  

  return (
    <div className={styles.container}>
      <div className={styles.topBanner}>{texts.bringFriendsText}</div>
      <div className={styles.promocodeStatisticsContainer}>
        <div className={styles.promocodeContainer}>
          <h2 className={styles.promocodeHeader}>{texts.getBonusPromoText}</h2>
          <p className={styles.promocodeDescription}>
          {texts.takeParkInProgramText}
          </p>
          <div className={styles.promocodeCopyForm}>
            <input
              value={data}
              className={styles.promocodeInput}
              name='promocode'
              id='promocode'
              readOnly
            />
            <button className={styles.promocodeButton} onClick={() => navigator.clipboard.writeText(promocode)}>Kopyala</button>
          </div>
        </div>
        <div className={styles.statisticsContainer}>
          <h2 className={styles.statisticsHeader}>{texts.statisticsText}</h2>
          <p className={styles.statisticsItem}>
            <span>{texts.completedOrdersText}</span>
            <span>0</span>
          </p>
          <p className={styles.statisticsItem}>
            <span>{texts.ordersToBeDeliveredText}</span>
            <span>0</span>
          </p>
          <p className={styles.statisticsItem}>
            <span>{texts.bonusGotText}</span>
            <span>0</span>
          </p>
          <p className={styles.statisticsDesc}>1 {texts.bonusText} = 1 AZN</p>
        </div>
      </div>
      <div className={styles.cardsContainer}>
        <div className={styles.card}>
          <div className={styles.cardImg}>
            <Image
              src={bonus1Img}
              alt='bonus'
              width={144}
              height={108}
            />
            <h3>{texts.copyText}</h3>
          </div>
          <p className={styles.cardDesc}>
            &quote;{texts.adviceText}&quote; {texts.copyPersonalPromoCodeText}
          </p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardImg}>
            <Image
              src={bonus2Img}
              alt='bonus'
              width={144}
              height={108}
            />
            <h3>{texts.shareText}</h3>
          </div>
          <p className={styles.cardDesc}>
            {texts.shareWithFriendsText}
          </p>
        </div>
        <div className={styles.card}>
          <div className={styles.cardImg}>
            <Image
              src={bonus3Img}
              alt='bonus'
              width={144}
              height={108}
            />
            <h3>{texts.acceptBonusesText}</h3>
          </div>
          <p className={styles.cardDesc}>
            {texts.yourFriendWillGetText}
          </p>
        </div>
      </div>
    </div>
  )
}


Referer.PageLayout = AuthLayout;

export default Referer;