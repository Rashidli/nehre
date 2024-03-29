import Head from 'next/head'
import React, { useEffect, useRef, useState } from 'react';
import { settings } from '../helpers/settings';
import { Header, Footer, Loader } from '../components/index';
import { fetchGlobalData } from '../stores/fetchers';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import Router from 'next/router';
import { httpRequest } from '../helpers/utils';
import { getCookie } from 'cookies-next';
import { signOut, useSession } from 'next-auth/react';
import styles from './styles.module.scss';
import clsx from 'clsx';
import { useMediaQuery } from '@mui/material';
import StickBottomMenu from '../components/StickMenu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Link from 'next/link';
import 'moment/locale/az';
import 'moment/locale/ru';
import 'moment/locale/en-gb';
import moment from 'moment';

 //? For anyone who is reading this, this project has a lot of code duplication, that is because it was a very big project and we had to deliver it in a very short time. 
 //? The code was written in a hurry and is not very clean, and there were other problems that affected the whole project, that is why the code writted is bad.

const Layout = ({ children, loading, getData, selectedCurrency }) => {
  const router = useRouter()
  const { status, data } = useSession();
  const [scrollPosition, setScrollPosition] = useState(0);
  const small = useMediaQuery('(max-width:650px)');

  const CustomCartButton = () => {
    return (
      <Link
        href={
          {
            pathname: router.pathname,
            query: { ...router.query, cart: true }
          }
        }
        className={styles.customCartButton}
        shallow={true}
        scroll={false}
      >
        <a className={styles.button}>
          <ShoppingCartIcon />
        </a>
      </Link>
    )
  }

  useEffect(() => {
    const interceptor = httpRequest.interceptors.request.use(
      request => {
        const defaultCurrencyCookie = getCookie('currency');
        let defaultCurrency = {};
         defaultCurrency.code= 'AZN';
        if (defaultCurrencyCookie) {
          defaultCurrency = JSON.parse(defaultCurrencyCookie);
        }
        if (status === 'authenticated') {
          request.headers['Authorization'] = `Bearer ${data.user.accessToken}`;
        } 
        request.headers['Location'] = Router.locale;
        request.headers['X-Currency'] = defaultCurrency.code;
        return request;
      },
      error => {
        return Promise.reject(error);
      },
    );
    return () => {
      httpRequest.interceptors.request.eject(interceptor);

    };
  }, [status]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }

  const handleScroll = e => {
    const position = window.pageYOffset;
    if (position > 1 && !scrollPosition) {
      setScrollPosition(true);
    } else if (position < 1) {
      setScrollPosition(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  useEffect(() => {
    if(router.locale.includes('en')) {
  moment.locale(router.locale+'-gb')
    }
    else 
    moment.locale(router.locale)
    getData()
  }, [router.locale])

  if (loading) {
    return <Loader />
  }

  if (!loading) {
    return (
      <div className={styles.mainLayoutContainer}>
        <Head>
          <meta charSet="utf-8" />
          <title>{settings.title}</title>
          <link rel="icon" href="/images/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="Nehra MMC" />
          <script async src='https://code-ya.jivosite.com/widget/PmzGEkemHf' strategy='beforeInteractive' />

        </Head>
        
        <Header />
        <div className={styles.rightBottomFixedContainer}>
          { !!scrollPosition && (<div className={styles.customUpToTopOfPage} onClick={() => scrollToTop()}>
            <KeyboardArrowUpIcon />
          </div>)}
        </div>
        <div
          className={clsx(
            styles.container,
            scrollPosition && styles.animatedMargin,
          )}>
          {children}
          <Footer />
          <StickBottomMenu />
        </div>

      </div>
    );
  }
}

const mapState = state => {
  return ({
    loading: state.globalData?.loading,
    selectedCurrency: state.globalData?.selectedCurrency

  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    getData: () => dispatch(fetchGlobalData()),
  })
}


export default connect(mapState, mapDispatchToProps)(Layout);
