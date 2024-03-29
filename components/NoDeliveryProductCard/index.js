import Image from 'next/image';
import React, {useCallback, useEffect, useReducer, useState} from 'react';
import styles from './styles.module.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import clsx from 'clsx';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import {connect} from 'react-redux';
import {Modal} from '@mui/material';
import {httpRequest} from '../../helpers/utils';
import {errorToast, warningToast} from '../../helpers/notification';
import {SyncLoader} from 'react-spinners';
import useTranslate from '../../hooks/useTranslate';

const ComboProduct = ({product, selectedCurrency,deliveryDates}) => {
  const {
    id,
    type,
    name,
    image,
    quantity,
    price,
    total,
    total_discount,
    subtotal,
    delivery_dates,
    variation_id,
    attribute,
    campaign_name,
    campaign_discount,
    campaign_total_discount,
  } = product;

  return (
    <div className={styles.comboItemContainer}>
      <div className={styles.imageContainer}>
        <Image src={image} layout="fill" alt={name} />
      </div>
      <div className={styles.detailContainer}>
        <h3>{name}</h3>
        <span>
          {price} {attribute ? `/${attribute}` : ''}
        </span>
        <div>
          {delivery_dates?.map((date, index) => {
            return <span key={index + 'date'}>{deliveryDates[date]}</span>;
          })}
        </div>
      </div>
    </div>
  );
};

const reducer = (state, action) => {
  if (action.type === 'add') {
    return state + 1;
  } else if (action.type === 'remove') {
    return state - 1;
  }
};

let debouce = null;

const BasketProductCard = ({
  product,
  changeQuantity,
  selectedCurrency,
  handleDelete,
  deliveryDates,
}) => {
  const {
    id,
    type,
    name,
    image,
    quantity,
    price,
    total,
    total_discount,
    subtotal,
    delivery_dates,
    variation_id,
    attribute,
    campaign_name,
    campaign_discount,
    campaign_total_discount,
  } = product;
  const texts = useTranslate()
  const [moreButtonActive, setMoreButtonActive] = useState(false);
  const [lessButtonActive, setLessButtonActive] = useState(false);
  const [deactivated, setDeactivated] = useState(true);
  const [comboModalActive, setComboModalActive] = useState(false);
  const [comboProduct, setComboProducts] = useState([]);
  // const [productQuantity, dispatch] = useReducer(reducer, quantity);

  const handleComboPress = () => {
    setComboModalActive(!comboModalActive);
    if (!comboModalActive) {
      getComboData();
      return;
    }
    setComboProducts([]);
  };

  const getComboData = useCallback(async () => {
    try {
      const response = await httpRequest.get(`/combos/${id}/products`);
      setComboProducts(response.data.data);
    } catch (error) {
      
      errorToast(texts.authError);
    }
  }, []);

  // const handleCount = type => {
  //   //    dispatch({type: type});
  //   // clearTimeout(debouce)
  //   //  debouce = setTimeout(() => {
  //   handlechangeQuantity(type);
  //   // }, 250)
  // };

  // const handlechangeQuantity = type => {
  //   if (type === 'add') {
  //     changeQuantity({id, variation_id, type, quantity: quantity + 1});
  //   } else if (type === 'remove') {
  //     changeQuantity({id, variation_id, type, quantity: quantity - 1});
  //   }
  // };

  if (type === 'combo') {
    return (
      <div className={styles.comboContainer}>
        <div className={styles.innerContainer}>
          <div className={styles.detailContainer}>
            <div className={styles.imageContainer}>
              <Image src={image} layout="fill" alt={name} />
            </div>
            <div>
              <h3>{name}</h3>
              <span>
                {price} {attribute ? `/${attribute}` : ''}
              </span>
              <div>
                {delivery_dates.map((date, index) => {
                  return (
                    <span key={index + 'date'}>{deliveryDates[date]}</span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={styles.actionContainer}>
            {/* <div className={styles.counter}>
              <button
                onClick={() => handleCount('remove')}
                // disabled={deactivated}
                className={clsx(
                  styles.button,
                  !deactivated === true && styles.deactivated,
                )}>
                <RemoveSharpIcon className={styles.decreaseIcon} />
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => handleCount('add')}
                // disabled={!deactivated}
                // Todo fix button disableing here, when new data is added to the backend
                className={clsx(
                  styles.button,
                  deactivated === false && styles.deactivated,
                )}>
                <AddSharpIcon className={styles.increaseIcon} />
              </button>
            </div>
            <div className={styles.priceContainer}>
              <div>
                <span className={styles.oldPrice}>{price} {selectedCurrency}</span>
              </div>
            </div> */}
            <button
              className={styles.deleteWholeProduct}
              onClick={() => handleDelete(id, variation_id, type)}>
              <DeleteIcon />
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={handleComboPress}
          className={styles.modalButton}>
          {texts.seeComboProductsText}
        </button>
        <Modal
          open={comboModalActive}
          onClose={() => setComboModalActive(false)}>
          <div className={styles.comboModal}>
            {comboProduct?.length ? (
              <>
                {comboProduct.map((item, index) => {
                  return <ComboProduct key={index + 'combo'} product={item} />;
                })}
                <button
                  type="button"
                  onClick={handleComboPress}
                  className={styles.modalCloseButton}>
                  {texts.backText}
                </button>
              </>
            ) : (
              <div className={styles.loaderContainer}>
                <SyncLoader size={20} color={'#2d5d9b'} margin={12} />
              </div>
            )}
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.detailContainer}>
        <div className={styles.imageContainer}>
          <Image src={image} layout="fill" alt={name} />
        </div>
        <div>
          <h3>{name}</h3>
          <span>
            {price} {attribute ? `/${attribute}` : ''}
          </span>
          <div>
            {delivery_dates.map((date, index) => {
              return <span key={index + 'date'}>{deliveryDates[date]}</span>;
            })}
          </div>
        </div>
      </div>
      <div className={styles.actionContainer}>
        {/* <div className={styles.counter}>
          <button
            onClick={() => handleCount('remove')}
            // disabled={deactivated}
            className={clsx(
              styles.button,
              !deactivated === true && styles.deactivated,
            )}>
            <RemoveSharpIcon className={styles.decreaseIcon} />
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => handleCount('add')}
            // disabled={!deactivated}
            // Todo fix button disableing here, when new data is added to the backend
            className={clsx(
              styles.button,
              deactivated === false && styles.deactivated,
            )}>
            <AddSharpIcon className={styles.increaseIcon} />
          </button>
        </div> */}
        {/* <div className={styles.priceContainer}>
          <div>
            <span className={styles.oldPrice}>{subtotal} {selectedCurrency}</span>
          </div>
        </div> */}
        <button
          type="button"
          className={styles.deleteWholeProduct}
          onClick={() => handleDelete(id, variation_id, type)}>
          <DeleteIcon />
        </button>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  return {
    selectedCurrency: state.globalData.selectedCurrency,
    deliveryDates: state.globalData.deliveryDates,
  };
};

export default connect(mapStateToProps)(BasketProductCard);
