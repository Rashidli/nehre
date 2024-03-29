import Image from 'next/image';
import React from 'react';
import styles from './styles.module.scss';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import useTranslate from '../../hooks/useTranslate';

const OrderModalProductItem = ({productItem,selectedCurrency}) => {
  const texts = useTranslate();
  return (
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
      <div className={styles.productButton}>
        <button
          type="button"
          className={styles.cartButton}
        >
          <ShoppingBasketIcon className={styles.cartIcon} />
        </button>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
  selectedCurrency: state.globalData.selectedCurrency,
  };
};

export default connect(mapStateToProps)(OrderModalProductItem);