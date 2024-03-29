import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import styles from './styles.module.scss';
import moment from 'moment';
import { connect } from 'react-redux';
import { useMediaQuery } from '@mui/material';

const CampaignCard = ({ data, selectedCurrency }) => {
  const {
    campaignId,
    title,
    slug,
    description,
    content,
    amount,
    price_type,
    start_date,
    end_date,
    image,
  } = data;

  const currentSize = useMediaQuery('(min-width:950px)');
  const isPercentage = price_type === 'percent';

  const size = currentSize ? 12 : 8;

  const formattedStartDate = moment(start_date).format('DD MMMM YY');
  const formattedEndDate = moment(end_date).format('DD MMMM YY');
  return (
    <Link href={`/campaigns/${campaignId}`}>
      <a className={styles.card}>
        <div className={styles.imageContainer}>
          <Image alt={title} src={image} layout={'fill'} />
          <span className={styles.discountContainer}>{amount} {isPercentage ? '%' :
          selectedCurrency
          }</span>
        </div>
        <div className={styles.content}>
          <p className={styles.timeText}>{formattedStartDate} - {formattedEndDate}</p>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>

        </div>
      </a>
    </Link>

  )
}


const mapState = (state) => {
  return {
    selectedCurrency: state.globalData.selectedCurrency

  };
};
export default connect(mapState)(CampaignCard)

