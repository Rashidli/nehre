import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { PageContainer, ProductCard, SubCategoryButton } from '../../components';
import { httpRequest, productFilterObj } from '../../helpers/utils';
import styles from './styles.module.scss';
import { getCookies } from 'cookies-next';
import { colors, FormControl, InputLabel, NativeSelect } from '@mui/material';
import { useRouter } from 'next/router';
import { getSession } from 'next-auth/react';
import LabelDropdown from '../../components/LabelDropdown';

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
    
    const { popularity,aplhabetical,price } = query;
    const response = await httpRequest.get(`/label/${query.id}`, { 
        params: {
            popularity: popularity,
            aplhabetical: aplhabetical,
            price: price,
            new: query?.new,
        },
    });
  const data = response.data.data;
    
  return {
    props: {
          data: data,
    },
  };
}


const GetFilter = ({queryValue, setLoader}) => { 
    const router = useRouter();
    const [selectedFilter, setSelectedFilter] = useState(queryValue || productFilterObj[0]);
    
    const selectFilterCategory = (index) => { 
        const filter = productFilterObj[index]
        setSelectedFilter(filter)
        setLoader(true);
    }

    useEffect(() => {
        const { filter } = selectedFilter;
        router.push({
            pathname: router.pathname,
            query: { id:router.query.id, ...filter },
        })
    }, [selectedFilter])
    

    return (
      <div className={styles.row}>
        <FormControl fullWidth>
          <NativeSelect
            sx={{
              '&:after': {
                display: 'none',
              },
              '&:before': {
                display: 'none',
              },
              fontSize: '14px',
              color: '#808080',
              margin: '0 0 0 0',
              padding: '0 0 0 0',
              fontFamily:'Asap'
            }}
            defaultValue={selectedFilter.title}
            onChange={e => selectFilterCategory(e.target.value)}
            className={styles.filter}>
            {productFilterObj.map((item, index) => (
              <option key={index + 'filter'} value={index}>
                {item.title}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
        <LabelDropdown/>
      </div>
    );
}

const LabelPage = ({ data }) => {
    const {
      label, content,
    } = data;
    const { name, productCount, categoryId } = label;
    const [products, setProducts] = useState(content.products)
    const [nextUrl, setNextUrl] = useState(content.nextUrl)
    const [loader, setLoader] = useState(false)

  
    useEffect(() => {
        setProducts(content.products);
        setNextUrl(content.nextUrl);
        setLoader(false);
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
          <h1 className={styles.pageTitle}>{name}</h1>

          <div className={styles.filterContainer}>
            <GetFilter setLoader={setLoader} />
          </div>
        </div>
        <PageContainer
          loader={loader}
          nextUrl={nextUrl}
          nextUrlCallback={nextUrlCallback}>
          {!!products.length ? (
            products.map((item, index) => (
              <ProductCard data={item} key={index + 'productCard' + item.productId} />
            ))
          ) : (
            <div className={styles.noProductContainer}>
              <Image
                alt={texts.noProductText}
                src="/animations/noProduct.gif"
                width={300}
                height={300}
              />
              <p>{texts.noProductText}</p>
            </div>
          )}
        </PageContainer>
      </>
    );
}

export default LabelPage