import { getSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { CampaignCard, PageContainer, } from '../components';
import { httpRequest } from '../helpers/utils';
import useTranslate from '../hooks/useTranslate';
import styles from '../styles/combos.module.scss';

export async function getServerSideProps(context) {
  const {query, locale, req} = context;
  const session = await getSession(context);
  if (session) {
    httpRequest.defaults.headers[
      'Authorization'
    ] = `Bearer ${session.user.accessToken}`;
  }
  httpRequest.defaults.headers['Location'] = locale;
  httpRequest.defaults.headers['X-Currency'] = req.cookies.currency
    ? JSON.parse(req.cookies.currency).code
    : 'AZN';

  const response = await httpRequest.get(`/campaigns`);
  const data = response.data;
  return {
    props: {
      capmaignData: data,
    },
  };
}


const Campaigns = ({ capmaignData }) => {
    const [products, setProducts] = useState(capmaignData?.data)
    const [nextUrl, setNextUrl] = useState(capmaignData?.nextUrl)
    const [loader, setLoader] = useState(false)
    const texts = useTranslate();

    useEffect(() => {
        setProducts(capmaignData?.data)
        setNextUrl(capmaignData?.nextUrl)
    }, [capmaignData])


    const nextUrlCallback = useCallback(async () => {
        try {
            setLoader(true);
            const response = await httpRequest.get(nextUrl);
            const data = response.data.data;
            setProducts((state) => {

                return [...state, ...data]
            })
            // todo fix next url here

            setNextUrl(null)
        } catch (error) {

        }
        finally {
            setLoader(false);
        }
    }, [nextUrl]);

    return (
        <>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{texts.campaignsText}</h1>
            </div>
            <PageContainer loader={loader} nextUrl={nextUrl} nextUrlCallback={nextUrlCallback} >
                {!!products.length ? products.map((item, index) => <CampaignCard data={item} key={index + "campaignCard" + item.campaignId} />) : <Image alt={texts.noProductText} src='/animations/noProduct.gif' width={300} height={300} />}
            </PageContainer>
        </>

    )
}

export default Campaigns