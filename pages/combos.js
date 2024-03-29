import { getSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { ComboCard, PageContainer, } from '../components';
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
    httpRequest.defaults.headers['X-Currency'] = req.cookies.currency ? JSON.parse(req.cookies.currency).code : 'AZN';

    const response = await httpRequest.get(`/combos`);
    const data = response.data

    return {
        props: {
            comboData: data
        },
    }
}

const Combos = ({ comboData }) => {

    const [products, setProducts] = useState(comboData?.data)
    const [nextUrl, setNextUrl] = useState(comboData?.nextUrl)
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [loader, setLoader] = useState(false)
    const texts= useTranslate();
    useEffect(() => {
        setProducts(comboData?.data)
        setNextUrl(comboData?.nextUrl)
    }, [comboData])


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

    const filterData = useCallback(async (id, index) => {
        try {
            setLoader(true);
            const response = await httpRequest.get(`/category/${id}`);
            const data = response.data.data;
            const nextUrl = response.data.nextUrl;
            setSelectedFilter(index)
            setProducts(data.content.products);
            setNextUrl(nextUrl);
        }
        catch (error) {

        }
        finally {
            setLoader(false);
        }
    }, [])



    return (
        <>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{texts.combosText}</h1>
            </div>
            <PageContainer loader={loader} nextUrl={nextUrl} nextUrlCallback={nextUrlCallback} >
                {!!products.length ? products.map((item, index) => <ComboCard data={item} key={index + "comboCard" +item.comboId } />) : <Image alt={texts.noProductText} src='/animations/noProduct.gif' width={300} height={300} />}
            </PageContainer>
        </>

    )
}

export default Combos