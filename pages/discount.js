import { getSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { PageContainer, ProductCard } from '../components';
import { httpRequest } from '../helpers/utils';
import useTranslate from '../hooks/useTranslate';
import styles from '../styles/discount.module.scss';

export async function getServerSideProps(context) {
     const {query, locale, req} = context;
     const session = await getSession(context);
     if (session) {
       httpRequest.defaults.headers[
         'Authorization'
       ] = `Bearer ${session.user.accessToken}`;
     }
    httpRequest.defaults.headers['Location'] = locale;
    httpRequest.defaults.headers['X-Currency'] = req.cookies.currency ? JSON.parse(req.cookies.currency).code : 'AZN';

    const response = await httpRequest.get(`/products/discounts`);
    const data = response.data

    return {
        props: {
            data: data
        },
    }
}

const Category = ({ data }) => {
    const texts = useTranslate();


    const [products, setProducts] = useState(data.data)
    const [nextUrl, setNextUrl] = useState(data.nextUrl)
    const [loader, setLoader] = useState(false)


    useEffect(() => {
        setProducts(data?.data)
        setNextUrl(data?.nextUrl)
    }, [data])

    const nextUrlCallback = useCallback(async () => {
        try {
            setLoader(true);
            const response = await httpRequest.get(nextUrl);
            const data = response.data.data;
            setProducts((state) => {
                return [...state, ...data]
            })
            // todo fix next url here
            setNextUrl(data.nextUrl)
        } catch (error) {

        }
        finally {
            setLoader(false);
        }
    }, [nextUrl]);

    return (
        <>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{texts.discountsText}</h1>
            </div>
            <PageContainer loader={loader} nextUrl={nextUrl} nextUrlCallback={nextUrlCallback} >
                {!!products.length ? products.map((item, index) => <ProductCard data={item} key={index + "productCard" + item.productId} />) : <Image alt={texts.noProductText} src='/animations/noProduct.gif' width={300} height={300} />}
            </PageContainer>
        </>
    )
}

export default Category