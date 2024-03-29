import { Modal } from '@mui/material';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react'
import { PageContainer } from '../../../components';
import requireAuth from '../../../helpers/requireAuth';
import { httpRequest } from '../../../helpers/utils';
import AuthLayout from '../../../layout/authLayout'
import styles from './styles.module.scss';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Link from 'next/link';
import { errorToast, successToast } from '../../../helpers/notification';
import useTranslate from '../../../hooks/useTranslate';
import { connect } from 'react-redux';


export const getServerSideProps = async context => {
  httpRequest.defaults.headers['Location'] = context.locale;
  httpRequest.defaults.headers['X-Currency'] = context.req.cookies.currency
    ? JSON.parse(context.req.cookies.currency).code
    : 'AZN';
  return requireAuth(context, async session => {
    try {
      const { data } = await httpRequest.get('/profile/order');
      return {
        props: {
          orderData: data.data,
        },
      };
    } catch (error) {
      return {
        props: {
          shouldLogOut: true,
        },
      };
    }
  });
};


const Profile = ({orderData, shouldLogOut,selectedCurrency}) => {
  const [orders, setOrders] = useState(orderData?.orders);
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [modalData, setModalData] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderId, setOrderId] = useState();
  const texts = useTranslate();

  
  useEffect(() => {
    if (shouldLogOut) {
      signOut({ redirect: false });
      router.push('/');
    }
  }, [])


  const getProductData = async (orderId) => {
    try {
      const response = await httpRequest.get(`/profile/order/${orderId}/products`);
      setProducts(response?.data?.data?.products);
    }
    catch (error) {
      
    }
  }

  useEffect(() => {
    getProductData(orderId);
  }, [orderId])

  const handleOpenModalFunc = (orderData) => {
    setIsModalOpened(true);
    setModalData(orderData);
    setOrderId(orderData?.orderId)
  }

  const handleCloseModal = () => {
    setIsModalOpened(false);
  }
  
  const handleCancelOrder = useCallback(async (orderId) => {
    try {
      
      const response = await httpRequest.get(`/profile/order/${orderId}/cancel`);
      if ([200, 201].includes(response.status)) {
        successToast(texts.orderCancelSuccess);
      }
      getData();
    } catch (error) {
      errorToast(texts.cancelOrderError);

    }
  }, []);


  const getData = useCallback(async () => {
    try {
      const response = await httpRequest.get('/profile/order');
      const data = response?.data?.data?.orders;
      setOrders(data);
      
    } catch (error) { }
  }, []);


  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{texts.myOrdersText}</h1>
      {!!orders?.length ? (
        <>
          <table className={styles.ordersTable}>
            <tbody>
              {orders.map((orderItem) => (
                <tr key={orderItem?.orderId}>
                  <td className={styles.tdId}>№{orderItem?.orderId}</td>
                  <td className={styles.tdStatus}>{orderItem?.status}</td>
                  <td>{orderItem?.subtotal}{selectedCurrency}</td>
                  <td>
                    {orderItem?.createdAt}
                  </td>
                  <td>{orderItem?.quantity} {texts.productText}</td>
                  <td className={styles.learnMore}>
                    <button className={styles.learnMoreBtn} onClick={() => handleOpenModalFunc(orderItem)}>{texts.moreText}</button>
                  </td>
                  <td className={styles.cancel}>
                    <button className={styles.cancelBtn} onClick={() => handleCancelOrder(orderItem?.orderId)}>{texts.cancelText}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.ordersContainer}>
            {orders.map((orderItem) => (
              <div
                key={orderItem?.orderId}
                className={styles.mobileOrderItem}
              >
                <div className={styles.mobileOrderItemLeft}>
                  <div className={styles.mobileOrderIndex}>№{orderItem?.orderId}</div>
                  <p>
                    <span>{orderItem?.paymentStatus}</span>
                    <span>{orderItem?.subtotal}{selectedCurrency}</span>
                  </p>
                </div>
                <div className={styles.mobileOrderItemRight}>
                  <p>{orderItem?.createdAt}</p>
                  <p>{orderItem?.quantity} {texts.moreText}</p>
                  <div className={styles.mobileOrderItemButtons}>
                    <button className={styles.mobileOrderItemLearnMoreBtn} onClick={() => handleOpenModalFunc(orderItem)}>{texts.moreText}</button>
                    <button className={styles.mobileOrderItemCancelBtn} onClick={() => handleCancelOrder(orderItem?.orderId)}>{texts.cancelText}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className={styles.emptyFavoriteContainer}>
          <div className={styles.noAddress}>
            <Image
              alt="sifarişlər yoxdur"
              src="/animations/noProduct.gif"
              layout={'fill'}
            />
          </div>
          <p>{texts.orderNotAddedText}</p>
        </div>
      )}

      {isModalOpened && (
        <Modal open={isModalOpened} onClose={handleCloseModal}>
          <div className={styles.modalContainer}>
            <div className={styles.orderHeader}>
              <h1 className={styles.modalOrderNumber}>{texts.orderText} №{modalData?.orderId}</h1>
              <p>{modalData?.paymentStatus}</p>
            </div>
            <ul className={styles.orderDetailList}>
              <li> &bull; {modalData?.createdAt}</li>
              <li> &bull; {modalData?.paymentMethod} {texts.paymentText}</li>
              <li>
                &bull; {modalData?.address?.state} {texts.ofCityText}, {modalData?.address?.region} {texts.ofRegionText}, {modalData?.address?.street}, {modalData?.address?.flat}
              </li>
            </ul>
            <div className={styles.modalProductListContainer}>
              {products?.map((productItem) => (
                <div key={productItem?.productId} className={styles.productCard}>
                  <Image
                    src={productItem?.image}
                    alt='product'
                    width={94}
                    height={78}
                    className={styles.productCardImg}
                  />
                  <div className={styles.productCardDesc}>
                    <h2>{productItem?.name}</h2>
                    <span>{productItem?.vendorName}</span>
                    <p> {productItem?.attribute}</p>
                  </div>
                  <div className={styles?.productQuantityAndPrice}>
                    <span className={styles.productQuantity}>
                      {productItem?.quantity} {texts.unitsText}
                    </span>
                    <span className={styles.productPrice}><span>{productItem?.subtotal}</span> {selectedCurrency}</span>
                  </div>
                  {/* <div className={styles.productButton}>
                    <button
                      type="button"
                      className={styles.cartButton}
                    >
                      <ShoppingBasketIcon className={styles.cartIcon} />
                    </button>
                  </div> */}
                </div>
              ))}
            </div>
            <div className={styles.modalPricingValues}>
              <div className={styles.modalPricingValueItem}>
                <span>{texts.overallText}</span>
                <span>{modalData?.total} {selectedCurrency}</span>
              </div>
              <div className={styles.modalPricingValueItem}>
                <span>{texts.cashbackText}</span>
                <span>{modalData?.totalCashbackAmount} {selectedCurrency}</span>
              </div>
              <div className={styles.modalPricingValueItem}>
                <span>{texts.edvText}</span>
                <span>{modalData?.totalEdvAmount} {selectedCurrency}</span>
              </div>
            </div>
            <div className={styles.modalCheckoutButton}>
              <Link href={'/checkout'}>
                <button>
                  <AutorenewIcon />
                  <span>{texts.repeatOrderText}</span>
                </button>
              </Link>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}


Profile.PageLayout = AuthLayout;


const mapStateToProps = state => {
  return {
    selectedCurrency: state.globalData.selectedCurrency,
  };
};

export default connect(mapStateToProps)(Profile);

