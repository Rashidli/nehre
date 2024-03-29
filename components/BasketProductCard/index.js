import Image from 'next/image';
import React, {useCallback, useState} from 'react';
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
import Link from 'next/link';
import CloseIcon from '@mui/icons-material/Close';
import useTranslate from '../../hooks/useTranslate';

const ComboProduct = ({product, selectedCurrency, deliveryDates}) => {
  const {
    productId,
    type,
    name,
    image,
    vendorName,
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
  const texts = useTranslate();
  return (
    <Link href={`/products/${productId}`} shallow={true}>
      <a className={styles.comboItemContainer}>
        <div className={styles.imageContainer}>
          <Image
            src={image}
            layout="fill"
            width={100}
            height={100}
            alt={name}
          />
        </div>
        <div className={styles.comboItemMain}>
          <h3 className={styles.comboItemTitle}>{name}</h3>
          <div className={styles.comboItemDetail}>
            <p>{vendorName}</p>
            <span className={styles.comboItemQuantity}>
              {texts.countText}: {quantity}
            </span>
            <span className={styles.comboItemTotalPrice}>
              {price * quantity || 0} {selectedCurrency}
            </span>
          </div>
          <div className={styles.comboItemFooter}>
            <span>
              {price} {selectedCurrency} {attribute ? `/ ${attribute}` : ''}
            </span>
          </div>
        </div>
      </a>
    </Link>
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
    productCount,
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
    weight,
  } = product;

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
      errorToast(texts.error);
    }
  }, []);

  const handleCount = type => {
    //    dispatch({type: type});
    // clearTimeout(debouce)
    //  debouce = setTimeout(() => {
    handlechangeQuantity(type);
    // }, 250)
  };

  const handlechangeQuantity = action => {
    if (action === 'add') {
      changeQuantity({id, variation_id, type, quantity: quantity + 1});
    } else if (action === 'remove') {
      changeQuantity({id, variation_id, type, quantity: quantity - 1});
    }
  };

  if (type === 'combo') {
    return (
      <div className={`${styles.container} ${styles.comboContainer}`}>
        <div className={styles.innerContainer}>
          <div className={styles.detailContainer}>
            <div className={styles.imageContainer}>
              <Image
                src={image}
                layout="fill"
                alt={name}
                width="100%"
                height="100%"
              />
            </div>
            <div className={styles.detailBody}>
              <h3>{name}</h3>
              <span>
                {price + ' ' + selectedCurrency}
                <button
                  type="button"
                  onClick={handleComboPress}
                  className={styles.showCombo}>
                  {texts.seeProductsText}
                </button>
              </span>
              <div className={styles.deliveryDateContainer}>
                {delivery_dates.map((date, index) => {
                  return (
                    <span key={index + 'date'}>{deliveryDates[date]}</span>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={styles.actionContainer}>
            <div className={styles.showComboContent}>
              <button
                type="button"
                onClick={handleComboPress}
                className={styles.showCombo}>
                {texts.seeProductsText}
              </button>
            </div>
            <div className={styles.counterAndPriceContainer}>
              <div className={styles.counter}>
                <button
                  type="button"
                  onClick={() => handleCount('remove')}
                  // disabled={deactivated}
                  className={clsx(
                    styles.button,
                    quantity == 1 && styles.removeButton,
                  )}>
                  {/* {!isLastCartItem && <RemoveSharpIcon className={styles.decreaseIcon} />}
                  {!!isLastCartItem && <DeleteIcon />} */}
                  {quantity == 1 ? (
                    <DeleteIcon />
                  ) : (
                    <RemoveSharpIcon className={styles.decreaseIcon} />
                  )}
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
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
                <span className={styles.oldPrice}>
                  {price} {selectedCurrency}
                </span>
              </div>
              <button
                type="button"
                className={styles.deleteWholeProduct}
                onClick={() => handleDelete(id, variation_id, type)}>
                <DeleteIcon />
              </button>
            </div>
          </div>
        </div>
        {/* <button
          type="button"
          onClick={handleComboPress}
          className={styles.modalButton}>
          Kombo məhsullarına bax
        </button> */}
        <Modal
          open={comboModalActive}
          onClose={() => setComboModalActive(false)}
          sx={{
            '&:focus': {
              outline: 'none',
            },
          }}>
          <div className={`${styles.comboModalContainer}`}>
            <div className={styles.comboModalContent}>
              <button className={styles.closeButton} onClick={handleComboPress}>
                <CloseIcon />
              </button>
              <div className={styles.comboModalHeader}>
                <div className={styles.comboModalDetailItem}>
                  <p>{texts.comboNameText}</p>
                  <div>
                    <span>{name}</span>
                  </div>
                </div>
                <div className={styles.comboModalDetailItem}>
                  <p>{texts.productCountText}</p>
                  <div>
                    <span>{productCount || 0}</span>
                  </div>
                </div>
                <div className={styles.comboModalDetailItem}>
                  <p>{texts.totalWeightText}</p>
                  <div>
                    <span>{weight || 0}</span>
                  </div>
                </div>
              </div>
              <div className={styles.comboModalItems}>
                {comboProduct?.length && (
                  <>
                    {comboProduct.map((item, index) => {
                      return (
                        <ComboProduct
                          key={item.id + 'combo' + index}
                          product={item}
                          deliveryDates={deliveryDates}
                          selectedCurrency={selectedCurrency}
                        />
                      );
                    })}
                  </>
                )}
                {/* (
                  <div className={styles.loaderContainer}>
                    <SyncLoader size={20} color={'#2d5d9b'} margin={12} />
                  </div>
                ) */}
              </div>
              <div className={styles.comboModalFooter}>
                <div className={styles.comboModalDetailItem}>
                  <p>{texts.priceText}</p>
                  <div>
                    <span>
                      {subtotal || 0} {selectedCurrency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.detailContainer}>
        <div className={styles.imageContainer}>
          <Image
            src={image}
            layout="fill"
            alt={name}
            width="100%"
            height="100%"
          />
        </div>
        <div className={styles.detailBody}>
          <h3>{name}</h3>
          <span>
            {price + ' ' + selectedCurrency}

            {!!attribute && (
              <>
                <span className={styles.slash}> / </span>
                <span className={styles.attribute}>{attribute}</span>
              </>
            )}
          </span>
          <div className={styles.deliveryDateContainer}>
            {delivery_dates.map((date, index) => {
              return <span key={index + 'date'}>{deliveryDates[date]}</span>;
            })}
          </div>
        </div>
      </div>
      <div className={styles.actionContainer}>
        <div className={styles.counter}>
          <button
            type="button"
            onClick={() => handleCount('remove')}
            // disabled={deactivated}
            className={clsx(
              styles.button,
              quantity == 1 && styles.removeButton,
            )}>
            {quantity == 1 ? (
              <DeleteIcon />
            ) : (
              <RemoveSharpIcon className={styles.decreaseIcon} />
            )}
          </button>
          <span>{quantity}</span>
          <button
            type="button"
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
            <span className={styles.oldPrice}>
              {subtotal} {selectedCurrency}
            </span>
          </div>
        </div>
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
