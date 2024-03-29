import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styles from './styles.module.scss'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { httpRequest } from '../../../../../helpers/utils';
import { getCookie } from 'cookies-next';
import {  setCartSum } from '../../../../../stores/features/globalData';

const DropDown = ({selectedCurrency,cartSum,setCartSum}) => {
  const router = useRouter();
  const { status,data } = useSession();

  const getCart = async () => {
    try { 
      const defaultCurrencyCookie = getCookie('currency');

      let defaultCurrency = {};
      defaultCurrency.code= 'AZN';
      if (defaultCurrencyCookie) {
        defaultCurrency = JSON.parse(defaultCurrencyCookie);
      }
      httpRequest.defaults.headers.common['Authorization'] = `Bearer ${data.user.accessToken}`;
      httpRequest.defaults.headers['X-Currency'] = defaultCurrency.code;

      const response =  await httpRequest.get('profile/cart');


      const total = response.data.cart.subtotal;

      setCartSum(total);
    }
    catch (error) {
      
    }
  }
  const getPrices = async () => {
    try {
      const defaultCurrencyCookie = getCookie('currency');
      let defaultCurrency = {};
      defaultCurrency.code= 'AZN';
      if (defaultCurrencyCookie) {
        defaultCurrency = JSON.parse(defaultCurrencyCookie);
      }
      httpRequest.defaults.headers['X-Currency'] = defaultCurrency.code;
      const localCart =getCookie('nehre-local-cart')
      if(!localCart) {
        setCartSum(0);
        return;
      }
      const response = await httpRequest.post('profile/cart/get-guest-cart', {products:JSON.parse(localCart)});
      const total = response.data.cart.subtotal;
      setCartSum(total);

    }
    catch (error) {
      
    }
  }



  const getPrice = () => {
    if (status === 'authenticated') {
        getCart();
    }
    else {
      getPrices();
    }
  }
  
  useEffect(() => {
    getPrice();

  }, [selectedCurrency, status])
      
  
  return (
    <div className={styles.dropContainer}>
      <Link
        href={
          {
            pathname: router.pathname,
            query: { ...router.query, cart: true }
          }
        }
        shallow={true}
        scroll={false}
      >
        <a className={styles.button}>
          <ShoppingCartIcon />
         {!!cartSum && <span className={styles.price}>{cartSum} {selectedCurrency}</span>}
        </a>
      </Link>
    </div>
  );
}


const mapState = state => {
  return ({
    selectedCurrency: state.globalData.selectedCurrency,
    cartSum: state.globalData.cartSum,
  })
}



const mapDispatchToProps = (dispatch) => {
  return ({
      setCartSum: (value) => dispatch(setCartSum(value)),
  })
}


export default connect(mapState,mapDispatchToProps )(DropDown);




