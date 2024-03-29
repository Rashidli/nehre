import { Modal } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './styles.module.scss';
import CloseIcon from '@mui/icons-material/Close';
import { connect } from 'react-redux';
import { httpRequest } from '../../../helpers/utils';
import { SyncLoader } from 'react-spinners';
import BasketProductCard from '../../BasketProductCard';
import clsx from 'clsx';
import { errorToast, warningToast } from '../../../helpers/notification';
import { signOut, useSession } from 'next-auth/react';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import { getCookie, deleteCookie, setCookie } from 'cookies-next';
import moment from 'moment';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import { setCartSum } from '../../../stores/features/globalData';
import useTranslate from '../../../hooks/useTranslate';

function Cart({ settings, selectedCurrency,setCartSum }) {
  const { minOrderAmount } = settings;
  const [orderData, setOrderData] = useState({
    products: [],
    cart: {}
  });
  const router = useRouter();
  const [loader, setLoader] = useState(true);
  const { status, data } = useSession();
  const texts = useTranslate();
  const handleCheckoutClick = () => {
    if (status === 'unauthenticated') {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, cart: true, login: true },
      }, undefined, { scroll: false, shallow: true });
      return
    }
    router.push('/checkout');
  };



  const changeQuantity = useCallback(async ({ id, variation_id, type, quantity }) => {
    try {

      const response = await httpRequest.post('profile/cart/update',
        type === 'combo'
          ? {
            combo_id: id,
            quantity: quantity,
          }
          : {
            product_id: id,
            variation_id: variation_id,
            quantity: quantity,
          }
      );
      setOrderData(response.data);
    }
    catch (error) {
      warningToast(texts.noAvailableStock);

    }
  }, []);


  const handleDelete = useCallback(async (id, variationId, type) => {
    try {

      if(status === 'unauthenticated') {
        const localCart = getCookie('nehre-local-cart');
        if(!localCart) { 
          return;
        }
          const localCartData = JSON.parse(localCart);
          
          const newLocalCartData = localCartData.filter(item => {
            if(type === 'combo')  return item.combo_id !== id;  
            if(item.variation_id ) return item.variation_id !== variationId 
            if(item.product_id) return item.product_id !== id;
          });
          

          setCookie('nehre-local-cart', newLocalCartData);
          getLocalData();
        return
      }
      const response = await httpRequest.delete(
        `/profile/cart/remove`,
        {
          data: type === 'combo'
            ? {
              combo_id: id,
            }
            : {
              product_id: id,
              variation_id: variationId,
            },
        });
      getData();
      setCartSum(JSON.parse(response.data.data.total));
    } catch (error) {
      
    }
  }, []);

  const handleClick = () => {
    delete router.query.cart;
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query },
      },
      undefined,
      { scroll: false, shallow: true }
    );
  };

  const getData = useCallback(async () => {
    try {
      const response = await httpRequest.get('profile/cart');
      const data = response.data;
      setOrderData(data);
      
      setLoader(false);
    } catch (error) { }
  }, [loader]);

  const getInitalData = useCallback(async () => {
    try {
      const localCart = getCookie('nehre-local-cart');
      if (localCart) {
        const localCartArray = JSON.parse(localCart);
        await httpRequest.post('profile/cart/add-many', { products: localCartArray });
        deleteCookie('nehre-local-cart');

      }
      if (status === 'authenticated') {
        httpRequest.defaults.headers['Authorization'] = `Bearer ${data.user.accessToken}`;
      }

      const response = await httpRequest.get('profile/cart');
      const orderData = response.data;
      setOrderData(orderData);
      setLoader(false);
    } catch (error) {
      
      if (error.response.status === 401) {
        errorToast(texts.sessionError);
        signOut();
      }
      
    }
  }, [loader,status]);



  const getLocalData = useCallback(async () => {
    try {
      const response = getCookie('nehre-local-cart')
      if (!response) {
        setLoader(false);
        return;
      }
      const localData = JSON.parse(response);

      const { data } = await httpRequest.post('profile/cart/get-guest-cart', {
        products: localData
      })
      setOrderData(data)
      setCartSum(JSON.parse(data.cart.total));
      setLoader(false);

    }
    catch (error) {
      
    }
  }, [loader]);

  useEffect(() => {
    if (status === 'authenticated') {
      getInitalData();

    } else {
      getLocalData();
    }
  }, [status]);

  useEffect(() => {

    document.body.style.overflow = 'hidden';

    return () => document.body.style.overflow = 'unset';
  }, []);

  const deleteAllCartItems = useCallback(async () => {
    try {
      if (status === 'unauthenticated') {
        deleteCookie('nehre-local-cart');
        setOrderData({
          products: [],
          cart: {}
        });
        return;
      }
      await httpRequest.delete(`/profile/cart/reset`);
      getData();
    } catch (error) {
      
    }
  }, [])


  if (loader) {
    return (
      <Modal disableScrollLock={true} open={true} onClose={handleClick}>
        <div className={styles.loaderContainer}>
          <button className={styles.closeButton} onClick={handleClick}>
            <CloseIcon />
          </button>
          <SyncLoader size={20} color={'#2d5d9b'} margin={12} />
        </div>
      </Modal>
    );
  }

  return (
    <Modal 
      open={true} 
      onClose={handleClick}
      sx={{
        "&:focus": {
          outline: "none"
        }
      }}>
      <div className={styles.container}>
        <div className={styles.cartContainer}>
          <div className={styles.cartMain}>
            <div className={styles.cartItems}>
              <div className={styles.headerContainer}>
                <div className={styles.cartHeaderAndDesc}>
                  <div className={styles.cartHeaderContent}>
                    <h2 className={styles.cartHeader}>{texts.basketText}</h2>
                    
                    <button
                      type="button"
                      className={`${styles.cartHeaderEmptyCartButton} ${styles.mobileDisplay}`}
                      onClick={deleteAllCartItems}
                    >
                      <DeleteIcon />
                      <span>{texts.clearText}</span>
                    </button>
                  </div>
                  <div className={clsx(styles.cartHeaderDescContent)}>
                    <span className={styles.cartHeaderDescription}>
                      {texts.minimumRateForFreeDelivery}
                      <span> {minOrderAmount} {selectedCurrency}</span>
                    </span>
                  </div>
                </div>
                <button className={`${styles.closeButton} ${styles.mobileDisplay}`} onClick={handleClick}>
                  <CloseIcon />
                </button>
              </div>
              {!loader && (
                <div className={styles.bottomContainer}>
                  <div className={styles.productsContainer}>
                    {orderData.products.length ? (
                      orderData.products.map((product, index) => {
                        return (
                          <BasketProductCard
                            handleDelete={handleDelete}
                            changeQuantity={changeQuantity}
                            product={product}
                            key={index + 'product'} />
                        );
                      })
                    ) : (
                      <>
                      <RemoveShoppingCartIcon className={styles.emmtyCartIcon} />
                      <p className={styles.emptyCart}>{texts.emptyBasketText}</p>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {!!orderData.products.length &&   <div className={styles.cartSidebar}>
            <div className={styles.cartSidebarHeader}>
              {!!orderData.cart.nearestDeliveryDate && <div className={styles.nearestDeliveryDateContainer} >
                <span className={styles.nearestDeliveryText}> <AccessTimeFilledIcon fontSize='10px' />{texts.fastestDeliveryDateText}</span>
                <span className={styles.nearestDeliveryDate}>{moment(orderData.cart.nearestDeliveryDate).format("dddd, DD MMMM")}</span>
              </div>}
              <button className={styles.closeButton} onClick={handleClick}>
                <CloseIcon />
              </button>
            </div>
            <div className={clsx(styles.cartSidebarBody, !orderData.cart.nearestDeliveryDate && styles.cartSidebarBodyMargin)}>
              <div className={styles.cartDetails}>
                <div className={styles.cartDetailItem}>
                  <p>{texts.productsCountText}</p>
                  <div>
                    <span>{orderData.cart.quantity || 0}</span>
                  </div>
                </div>
                <div className={styles.cartDetailItem}>
                  <p>{texts.packageWeightText}</p>
                  <div>
                    <span>{orderData.cart.total_weight || 0}</span>
                  </div>
                </div>
                {!!orderData.cart.campaign_total_discount && <div className={styles.cartDetailItem}>
                    <p>{texts.campaignDiscountText}</p>
                    <div>
                      <span>{orderData.cart.campaign_total_discount} {selectedCurrency}</span>
                    </div>
                  </div>
                }
                <div className={styles.cartDetailItem}>
                  <p>{texts.priceText}</p>
                  <div>
                    <span className={styles.oldPrice}>{orderData?.cart?.total || 0} {selectedCurrency}</span>
                    <span className={styles.price}>{orderData?.cart?.subtotal || 0} {selectedCurrency}</span>
                    {/* <span>{orderData?.cart?.total || 0} {selectedCurrency}</span> */}
                  </div>
                </div>
                {/* <div className={styles.cartDetailItem}>
                  <p>Endirim</p>
                  <div>
                    <span>{orderData?.cart?.discount || 0} {selectedCurrency}</span>
                  </div>
                </div> */}

                {/* <div className={styles.subtotalPrice}>
                  <p>Yekun qiymət</p>
                  <div>
                    <span>{orderData?.cart?.subtotal || 0} {selectedCurrency}</span>
                  </div>
                </div> */}
                {/* <div className={styles.cartDetailItem}>
                  <p>Ümumi bonus</p>
                  <div>
                    <span>{orderData.cart.total_cashback_amount || 0} {selectedCurrency}</span>
                  </div>
                </div>
                <div className={styles.cartDetailItem}>
                  <p>Ümumi Ədv</p>
                  <div>
                    <span>{orderData.cart.total_edv_amount || 0} {selectedCurrency}</span>
                  </div>
                </div> */}
              </div>
              <button
                onClick={handleCheckoutClick}
                className={clsx(
                  styles.order,
                  (!orderData.products.length || !orderData.cart.checkoutIsAvailable) && styles.disabled
                )}
                disabled={!orderData.products.length || !orderData.cart.checkoutIsAvailable}>
                {texts.orderText}
              </button>
              {/* <div className={styles.paymentAdditionalInfoContainer} >
                <span className={styles.overallBonuses}>Alacağınız ümumi bonus : {orderData.cart.total_cashback_amount}  {selectedCurrency}</span>
                <span className={styles.paymentLimitAtDoor}>Ümumi Ədv miqdarı : {orderData.cart.total_edv_amount} {selectedCurrency}</span>
              </div> */}
            </div>
            <div className={styles.cartSidebarFooter}>
              <button
                type="button"
                className={styles.emptyCartButton}
                onClick={deleteAllCartItems}
              >
                <DeleteIcon />
                <span>{texts.clearBasketText}</span>
              </button>
            </div>
          </div>}
        </div>
      </div>
    </Modal>
  );
}


const mapState = state => {
  return {
    settings: state.globalData.settings,
    selectedCurrency: state.globalData.selectedCurrency,
  };
};


const mapDispatchToProps = (dispatch) => {
  return ({
      setCartSum: (value) => dispatch(setCartSum(value)),
  })
}


export default connect(mapState,mapDispatchToProps)(Cart);