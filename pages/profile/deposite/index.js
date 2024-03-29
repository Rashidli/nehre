import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { useCallback } from 'react';
import { PageContainer } from '../../../components';
import requireAuth from '../../../helpers/requireAuth';
import { httpRequest } from '../../../helpers/utils';
import AuthLayout from '../../../layout/authLayout';
import styles from './styles.module.scss';
import SyncLoader from "react-spinners/SyncLoader";
import useTranslate from '../../../hooks/useTranslate';
import { connect } from 'react-redux';

export const getServerSideProps = async context => {
  httpRequest.defaults.headers['Location'] = context.locale;
  httpRequest.defaults.headers['X-Currency'] = context.req.cookies.currency
    ? JSON.parse(context.req.cookies.currency).code
    : 'AZN';
  return requireAuth(context, async session => {
    try {
      const { data } = await httpRequest.get('/profile/balance');
      return {
        props: {
          balanceData: data,
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


const Deposit = ({ balanceData, shouldLogOut,selectedCurrency }) => {

  const [data, setData] = useState(balanceData);
  const [nextUrl, setNextUrl] = useState(data?.nextUrl)
  const [loader, setLoader] = useState(false)
  const texts = useTranslate();
  // const getData = async () => {
  //   try {
  //     const response = await httpRequest.get("/profile/balance");
  //     
  //     setData(response.data);
  //   }
  //   catch (error) {
  //     
  //   }
  // }
  // 

  

  const nextUrlCallback = useCallback(async () => {
    try {
      setLoader(true);
      const response = await httpRequest.get(nextUrl);
      const dataAdd = response.data.data;
      setData(() => {[...data?.data, ...dataAdd]})

      setNextUrl(null)
    } catch (error) {

    }
    finally {
      setLoader(false);
    }
  }, [nextUrl]);

  useEffect(() => {
    // getData();
    setNextUrl(data?.nextUrl);
  }, [])

  useEffect(() => {
    if (shouldLogOut) {
      signOut({ redirect: false });
      router.push('/');
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{texts.depositText}</h1>
      <p className={styles.balance}>{texts.yourBalanceText}  &nbsp; <span>{data?.data?.balance ? data?.data?.balance  : 0} {selectedCurrency}</span></p>
      <table className={styles.depositeTable}>
        <thead>
          <tr>
            <th>{texts.dateText}</th>
            <th>{texts.priceText}</th>
            <th>{texts.statusText}</th>
          </tr>
        </thead>
        <tbody>
          {loader &&
            <tr className={styles.noOrderTr}>
              <td colSpan={3}>
                <SyncLoader size={20} color={"#2d5d9b"} margin={12} />
              </td>
            </tr>
          }
          {
            data?.data?.data?.length ? data?.data?.data?.map((dataItem) => (
              <tr key={dataItem?.id} className={styles.orderListItem}>
                <td>{dataItem.created_at}</td>
                <td>{dataItem.amount}</td>
                <td>{dataItem.paymentStatus}</td>
              </tr>
            )) : (
              <tr className={styles.noOrderTr}>
                <td colSpan={3}>{texts.noOrderText}</td>
              </tr>
            )
          }
          {!!nextUrl &&
            <tr className={styles.noOrderTr}>
              <td colSpan={3}>
                <button className={styles.viewMoreButton} type='button' onClick={nextUrlCallback} >
                  {texts.moreText}
                </button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  )
}


Deposit.PageLayout = AuthLayout;

const mapStateToProps = state => ({
  selectedCurrency: state.globalData.selectedCurrency,
});

export default connect(mapStateToProps)(Deposit);

