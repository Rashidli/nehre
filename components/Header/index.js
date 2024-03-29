import React, { useEffect, useState } from 'react'
import TopNavbar from './TopNavbar'
import Navbar from './Navbar';
import { useMediaQuery } from '@mui/material';
import DownNavbar from './DownNavbar';
import styles from './styles.module.scss'
import { useRouter } from 'next/router';
import { Product, Login } from '../../components';
import {Modal} from '@mui/material'
import clsx from 'clsx';
import Cart from '../modals/Cart';

const Header = () => {
  const small = useMediaQuery("(max-width:650px)");
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);

  const handleScroll = (e) => {
    const position = window.pageYOffset;
    if (position > 1 && !scrollPosition) {
      setScrollPosition(true);
      
    } else if (position === 0) {
      setScrollPosition(false);
    }
  
  };

  

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {passive: true});

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);



    return (
      <div
        className={clsx(
          styles.container,
          scrollPosition && styles.scrollStyles,
        )}>
        
        <TopNavbar scrollPosition={scrollPosition} />
        {!small && <Navbar scrollPosition={scrollPosition} />}
        <DownNavbar scrollPosition={scrollPosition} />

        {router.query.productId && <Product />}
        {router.query.login && (
          <Modal
            open={true}
            onClose={() => {
              delete router.query.login;
              router.push(
                {
                  pathname: router.pathname,
                  query: {...router.query},
                },
                undefined,
                {scroll: false,shallow:true},
              );
            }}>
            <Login />
          </Modal>
        )}

        {router.query.cart  && <Cart />}
      </div>
    );
}




export default Header
