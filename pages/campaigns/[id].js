import moment from 'moment';
import {getSession} from 'next-auth/react';
import Image from 'next/image';
import React, {useCallback, useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Tab, TabList, TabPanel, Tabs} from 'react-tabs';
import {PageContainer, ProductCard} from '../../components';
import {httpRequest} from '../../helpers/utils';
import {KeyboardArrowUp, KeyboardArrowDown} from '@mui/icons-material';
import styles from './styles.module.scss';
import useTranslate from '../../hooks/useTranslate';

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

  const response = await httpRequest.get(`/campaigns/${query.id}`);
  const data = response.data.data;
  return {
    props: {
      data: data,
    },
  };
}

const CampaignDetails = ({data, selectedCurrency}) => {
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
    products,
  } = data;

  const [nextUrl, setNextUrl] = useState(products.nextUrl);
  const [campaignProducts, setCampaignProducts] = useState(products || []);
  const [loader, setLoader] = useState(false);
  const [campaignAmount, setCampaignAmount] = useState(amount);
  const [moreText, setMoreText] = useState(false);
  const texts = useTranslate();
  useEffect(() => {
    setCampaignProducts(data.products);
    setNextUrl(data.nextUrl);
    setCampaignAmount(data.amount);
  }, [data]);

  const isPercentege = price_type === 'percent';

  const nextUrlCallback = useCallback(async () => {
    try {
      //todo test next url
      setLoader(true);
      const response = await httpRequest.get(nextUrl);
      const data = response.data.data;
      setCampaignProducts(state => {
        return [...state, ...data];
      });
      // todo fix next url here

      setNextUrl(null);
    } catch (error) {
    } finally {
      setLoader(false);
    }
  }, [nextUrl]);

  function createMarkup() {
    return {__html: content};
  }

  const setMoreTextHandler = () => {
    setMoreText(!moreText);
  };

  const formattedStartDate = moment(start_date).format('DD MMMM, YYYY');
  const formattedEndDate = moment(end_date).format('DD MMMM, YYYY');

  return (
    <div className={styles.container}>
      <div className={styles.campaignInfoContainer}>
        <div className={styles.videoContainer}>
          <Image
            src={image}
            layout="fill"
            alt={title}
            width={100}
            height={100}
          />
        </div>
        <div className={styles.campaignInfo}>
          <div className={styles.campaignInfoTop}>
            <h3 className={styles.campaignName}>{title}</h3>
            <div className={styles.timeContainer}>
              <p className={styles.timeText}>
                {formattedStartDate} - {formattedEndDate}
              </p>
            </div>
            <p className={styles.campaignDescription}>
              {moreText ? description : `${description.slice(0, 100)}...`}
              <button
                className={styles.moreTextButton}
                onClick={setMoreTextHandler}>
                {moreText ? texts.showLess : texts.showMore}
                {moreText ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              </button>
            </p>
          </div>
          <span className={styles.price}>
            {texts.campaignDiscountText} - {campaignAmount}{' '}
            {isPercentege ? '%' : selectedCurrency}
          </span>
        </div>
      </div>

      <Tabs className={styles.tabContainer}>
        <TabList className={styles.tabList}>
          <Tab className={styles.tab} selectedClassName={styles.tabActive}>
            {texts.campaignProductsText}
          </Tab>
          <Tab className={styles.tab} selectedClassName={styles.tabActive}>
            {texts.campaignDetailsText}
          </Tab>
        </TabList>
        <TabPanel>
          <PageContainer
            loader={loader}
            nextUrl={nextUrl}
            nextUrlCallback={nextUrlCallback}>
            {!!campaignProducts.length ? (
              campaignProducts.map((item, index) => (
                <ProductCard data={item} key={index + 'productCard'} />
              ))
            ) : (
              <Image
                alt={texts.noProductText}
                src="/animations/noProduct.gif"
                width={300}
                height={300}
              />
            )}
          </PageContainer>
        </TabPanel>
        <TabPanel>
          <p
            className={styles.description}
            dangerouslySetInnerHTML={createMarkup()}
          />
        </TabPanel>
      </Tabs>
    </div>
  );
};

const mapState = state => {
  return {
    selectedCurrency: state.globalData.selectedCurrency,
  };
};
export default connect(mapState)(CampaignDetails);
