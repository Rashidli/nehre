import React, { useCallback, useEffect, useState } from 'react'
import { AddressCard, PageContainer } from '../../../components';
import requireAuth from '../../../helpers/requireAuth';
import { httpRequest } from '../../../helpers/utils';
import AuthLayout from '../../../layout/authLayout'
import styles from './styles.module.scss';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import AddressCardNew from '../../../components/AddressCardNew/AddressCardNew';
import { useRouter } from 'next/router';
import useTranslate from '../../../hooks/useTranslate';

export const getServerSideProps = async context => {
  return requireAuth(context, async session => {
    try {
     
      const { data } = await httpRequest.get('/profile/address');
      return {
        props: {
          address: data?.data || [],
        },
      };
    } catch (error) {
      return {
        props: {
          address: [],

          shouldLogOut: true,
        },
      };
    }
  });
};

const Address = ({ address, shouldLogOut }) => {

  const [data, setData] = useState([]);
  const router = useRouter();
  const texts = useTranslate();


  useEffect(() => {
    setData(address || []);
  }, [address]);

  const refetchData = useCallback(async () => {
    try {
      const { data } = await httpRequest.get('/profile/address');
      setData(data?.data || []);

    }
    catch (error) {

    }
  }, [])

  useEffect(() => {
      if (shouldLogOut) {
      signOut({redirect: false});
      router.push('/');
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{texts.myInfoText}</h1>
      <div className={styles.addressContainer}>
        {!!data.length ? (
          data.map((item, index) => {
            return (
              <>
                <AddressCardNew
                  key={index + 'userAddress'}
                  item={item}
                  refetchData={refetchData}
                />
              </>
            );
          })
        ) : (
          <PageContainer
          // loader={loader}
          // nextUrl={nextUrl}
          // nextUrlCallback={nextUrlCallback}
          >
            <div className={styles.noAddressContainer}>
              <div className={styles.noAddress}>
                <Image
                  alt={texts.noProductText}
                  src="/animations/noProduct.gif"
                  layout={'fill'}
                />
              </div>
              <p>{texts.noAddressText}</p>
            </div>
          </PageContainer>
        )}

        <Link href="/profile/address/new">
          <a className={styles.newAddressButton}>{texts.newAddressText}</a>
        </Link>
      </div>
    </div>
  );
};


Address.PageLayout = AuthLayout;

export default Address;