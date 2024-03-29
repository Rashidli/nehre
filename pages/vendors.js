import { getSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useCallback, useState } from 'react';
import { PageContainer, VendorCard } from '../components';
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

    const response = await httpRequest.get(`/vendors`);
    const data = response.data

    return {
        props: {
            vendorData: data
        },
    }
}

const Vendors = ({ vendorData }) => {

    const [vendors, setVendors] = useState(vendorData?.data)
    const [nextUrl, setNextUrl] = useState(vendorData?.nextUrl)
    const [loader, setLoader] = useState(false)
    const texts = useTranslate();


    const nextUrlCallback = useCallback(async () => {
        try {
            setLoader(true);
            const response = await httpRequest.get(nextUrl);
            const data = response.data.data;
            setVendors((state) => {

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
            setVendors(data.content.products);
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
                <h1 className={styles.pageTitle}>{texts.vendorsText}</h1>
            </div>
            <PageContainer loader={loader} nextUrl={nextUrl} nextUrlCallback={nextUrlCallback} >
                {!!vendors.length ? vendors.map((item, index) => <VendorCard data={item} key={index + "venderCards"} />) : <Image alt={texts.noProductText} src='/animations/noProduct.gif' width={300} height={300} />}
            </PageContainer>
        </>

    )
}

export default Vendors