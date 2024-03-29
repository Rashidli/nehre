import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import styles from '../styles/checkout.module.scss';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { connect } from 'react-redux';
import { ChevronLeft, Phone, WhatsApp } from '@mui/icons-material';
import Link from 'next/link';
import { fetchGlobalData } from '../stores/fetchers';
import PaymentIcon from '@mui/icons-material/Payment';
import DoorBackOutlinedIcon from '@mui/icons-material/DoorBackOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import {
  BasketProductCard,
  CheckoutInput,
  Loader,
  NoDeliveryProductCard,
  OrderAddressCard,
} from '../components';
import requireAuth from '../helpers/requireAuth';
import { httpRequest } from '../helpers/utils';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { errorToast, successToast, warningToast } from '../helpers/notification';
import { signOut, useSession } from 'next-auth/react';
import { AddressValidator, CheckoutSchema } from '../schemas';
import { getCookie } from 'cookies-next';
import moment from 'moment';
import Router from 'next/router';
import CheckIcon from '@mui/icons-material/Check';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Radio,
  RadioGroup,
  Select,
  TextField,

} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import AddIcon from '@mui/icons-material/Add';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import Head from 'next/head';
import { settings as pageSettings } from '../helpers/settings';
import { ClipLoader } from 'react-spinners';
import useTranslate from '../hooks/useTranslate';
const paymentIcons = {
  online: <PaymentIcon />,
  with_card_on_door: <DoorBackOutlinedIcon />,
  balance: <AccountBalanceWalletOutlinedIcon />,
  terminal: <PointOfSaleIcon />,
};

const CheckoutHeader = ({ settings, children, getData, loading }) => {
  const router = useRouter();
  const texts = useTranslate();
  const handleClick = () => router.back();
  useEffect(() => {
    getData();
  }, [router.locale]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      <Head>
        <meta charSet="utf-8" />
        <title>{pageSettings.payment}</title>
        <link rel="icon" href="/images/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Nehra MMC" />
        <script async src='https://code-ya.jivosite.com/widget/PmzGEkemHf' strategy='beforeInteractive' />

      </Head>
      <div className={styles.headerWrapper}>
        <div className={styles.container}>
          <div className={styles.mobileHeaderContainer}>
            <button
              type="button"
              onClick={handleClick}
              className={styles.backButton}>
              <ChevronLeftIcon className={styles.backButtonIcon} />
            </button>
            <span className={styles.headerText}>{texts.orderText}</span>
          </div>
          <div className={styles.desktopHeaderContainer}>
            <Link href={'/'}>
              <a className={styles.logo}>
                <Image
                  src={'/images/logoNehre2.png'}
                  alt="logo"
                  layout={'fill'}
                />
              </a>
            </Link>

            <div className={styles.phoneContainer}>
              <span className={styles.phone}>
                <Phone />{' '}
                <Link href={`tel:${settings?.tel}`}>
                  <a className={styles.link}>{settings?.tel}</a>
                </Link>
              </span>
              <span className={styles.phone}>
                <WhatsApp />
                <Link
                  href={`https://api.whatsapp.com/send/?phone=%2B${settings?.whatsappPhone?.slice(
                    1,
                  )}&text=Salam.+%0ASiz%C9%99+sual%C4%B1m+var&type=phone_number&app_absent=0`}>
                  <a className={styles.link}>{settings?.whatsappPhone}</a>
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
};

export const getServerSideProps = async context => {
  return requireAuth(context, async session => {
    try {
      const { locale, req } = context;
      httpRequest.defaults.headers['Location'] = locale;
      httpRequest.defaults.headers['X-Currency'] = req.cookies.currency
        ? JSON.parse(req.cookies.currency).code
        : 'AZN';
      const { data } = await httpRequest.get('/profile/order/checkout');
      return {
        props: {
          data: data.data || [],
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

const Address = ({ addressData, setAddressVisible, getCheckoutData }) => {
  const texts = useTranslate();
  const [locationData, setLocationData] = useState({
    cities: [],
    regions: [],
    streets: [],
  });
  const [citySelectDisabled, setCitySelectDisabled] = useState(false);
  const [regionSelectDisabled, setRegionSelectDisabled] = useState(false);
  const [streetSelectDisabled, setStreetSelectDisabled] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    control,

    formState: { errors },
  } = useForm({
    resolver: yupResolver(AddressValidator),
    defaultValues: Object.keys(addressData).length
      ? {
        address_id: addressData.addressId,
        state_id: addressData.stateId,
        region_id: addressData.regionId,
        street_id: addressData.streetId,
        dead_end: addressData.deadEnd,
        home: addressData.home,
        entrance: addressData.entrance,
        floor: addressData.floor,
        flat: addressData.flat,
        intercom: addressData.intercom,
        note: addressData.note,
        has_barrier: addressData.hasBArrier,
        is_main: true,
      }
      : {
        state_id: null,
        region_id: 'choose_region',
        street_id: 'choose_street',
        dead_end: null,
        home: null,
        entrance: null,
        floor: null,
        flat: null,
        intercom: null,
        note: null,
        has_barrier: false,
        is_main: true,
      },

  });

  const submitAddress = useCallback(async validationData => {
    try {
      let response;
      if (Object.keys(addressData).length) {
        response = await httpRequest.put(
          `/profile/address/${validationData.address_id}}`,
          validationData,
        );
        if (response.status === 200) {
          successToast(texts.addressUpdateSuccess);
        }
      } else {
        response = await httpRequest.post('/profile/address', validationData);
        if (response.status === 200) {
          successToast(texts.addressAddSuccess);
        }
      }
      setAddressVisible(false);
      getCheckoutData(true);
    } catch (error) {
      
    }
  }, []);

  const handleStateChange = useCallback(async e => {
    try {
      
      setStreetSelectDisabled(true);
      setRegionSelectDisabled(true);
      const { data } = await httpRequest.get(`/common/${e.target.value}/regions`);
      setLocationData(state => {
        return { ...state, regions: data.data, streets: [] };
      });
      if (data?.data?.length) {
        reset({
          address_id: addressData.addressId,
          region_id: 'choose_region',
          street_id: 'choose_street',
          is_main: true,
        });
        setRegionSelectDisabled(false);
      }
    } catch (error) {
      
    }
  }, []);

  const handleRegionChange = useCallback(async e => {
    try {
      setStreetSelectDisabled(true);
      const { data } = await httpRequest.get(`/common/${e.target.value}/streets`);
      setLocationData(state => {
        return { ...state, streets: data.data };
      });
      if (data?.data?.length) {
        reset({
          address_id: addressData.addressId,
          street_id: 'choose_street',
          is_main: true,

        });
        setStreetSelectDisabled(false);
      }
    } catch (error) {
      
    }
  }, []);

  const getAddressData = useCallback(async () => {
    try {
      const citiesRequest = httpRequest.get('/common/states');
      let regionsRequest;
      let streetsRequest;
      if (Object.keys(addressData).length) {
        if (addressData.regionId) {
          regionsRequest = httpRequest.get(
            `/common/${addressData.stateId}/regions`,
          );
        }
        if (addressData.streetId) {
          streetsRequest = httpRequest.get(
            `/common/${addressData.regionId}/streets`,
          );
        }
      }

      const response = await Promise.all([
        citiesRequest,
        regionsRequest,
        streetsRequest,
      ]);
      const [citiesData, regionsData, streetsData] = response;
      const cities = citiesData.data.data;

      const regions = regionsData?.data.data || [];
      const streets = streetsData?.data.data || [];
      setLocationData({ cities, regions, streets });
    } catch (error) {
      
    }
  }, [addressData]);

  useEffect(() => {
    getAddressData();
  }, []);

  return (
    <div className={styles.box}>
      <h1 className={styles.heading}>
        {Object.keys(addressData).length
          ? texts.editAddressText
          : texts.newAddressText}
      </h1>
      <form className={styles.addressForm}>
        <div className={styles.form}>

          <div className={styles.inputContainer}>
            <div>
              <Controller
                name="state_id"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={e => {
                      handleStateChange(e);
                      field.onChange(e);
                    }}
                    className={
                      clsx(styles.input, errors?.state_id && styles.errorStyle)
                    }
                    disabled={citySelectDisabled}>
                    <option value={'choose_city'}>{texts.chooseCityText}</option>
                    {locationData.cities?.map((item, index) => {
                      return (
                        <option key={index + 'state'} value={item.stateId}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>)}
              />
              <span className={styles.dynamicPlaceholder}>{texts.cityText}</span>

            </div>
          </div>


          <div className={styles.inputContainer}>
            <div>
              <Controller
                name="region_id"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <select
                    {...field}
                    onChange={e => {
                      handleRegionChange(e);
                      field.onChange(e)
                    }}

                    className={
                      clsx(styles.input, errors?.region_id && styles.errorStyle)
                    }
                    disabled={regionSelectDisabled || !locationData.regions.length}>
                    <option value={'choose_region'}>{texts.selectRegionText}</option>
                    {locationData.regions?.map((item, index) => {
                      return (
                        <option key={index + 'region'} value={item.regionId}>
                          {item.name}
                        </option>
                      );
                    })}

                  </select>
                )} />
              <span className={styles.dynamicPlaceholder}>{texts.regionText}</span>

            </div>
          </div>
          <div className={styles.inputContainer}>
            <div>
              <Controller
                name="street_id"
                control={control}
                defaultValue=""
                rules={{ required: true }}
                render={({ field }) => (
                  <select
                    {...field}
                    className={
                      clsx(styles.input, errors?.street_id && styles.errorStyle)
                    }
                    disabled={streetSelectDisabled || !locationData.streets.length}>
                    <option value={'choose_street'}>{texts.selectStreetText}</option>
                    {locationData.streets?.map((item, index) => {
                      return (
                        <option key={index + 'street'} value={item.streetId}>
                          {item.name}
                        </option>
                      );
                    })}
                  </select>
                )} />
              <span className={styles.dynamicPlaceholder}>{texts.streetText}</span>

            </div>
          </div>

          <CheckoutInput
            message={errors.dead_end?.message}
            hookForm={register('dead_end')}
            title={texts.deadEndText}
            placeholder=" "
          />

          <CheckoutInput
            message={errors.home?.message}
            hookForm={register('home')}
            title={texts.buildingText}
            placeholder=" "
          />

          <CheckoutInput
            message={errors.entrance?.message}
            hookForm={register('entrance')}
            title={texts.entranceText}
            placeholder=" "
          />

          <CheckoutInput
            message={errors.floor?.message}
            hookForm={register('floor')}
            title={texts.floorText}
            placeholder=" "
          />

          <CheckoutInput
            message={errors.flat?.message}
            hookForm={register('flat')}
            title={texts.flatText}
            placeholder=" "
          />

          <CheckoutInput
            message={errors.intercom?.message}
            hookForm={register('intercom')}
            title={texts.intercomText}
            placeholder=" "
          />


          <div className={clsx(styles.inputContainer, styles.noteContainer)}>
            <textarea className={
              clsx(styles.input, styles.noteInput)
            } {...register('note')} />
            <span className={styles.dynamicPlaceholder}>{texts.noteText}</span>

          </div>
          <div className={styles.checkboxContainer}>
            <div>
              <label htmlFor="hasBarrier">{texts.barrierText}</label>
              <input {...register('has_barrier')} type="checkbox" />
            </div>
            <span>{errors.has_barrier?.message}</span>
          </div>
          <div className={styles.buttonContainer}>
            <button className={styles.submit} type="button" onClick={handleSubmit(submitAddress)} disabled={false}>
              {texts.confirmText}
            </button>
            <button
              className={styles.back}
              type="button"
              onClick={() => {
                setAddressVisible(false);
              }}
              disabled={false}>
              {texts.backText}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

const Checkout = ({ data, shouldLogOut, selectedCurrency }) => {
  const texts = useTranslate();
  const [disableCheckoutButton, setDisableCheckoutButton] = useState(false);
  const [showTerminalInput, setShowTerminalInput] = useState(false);
  const [orderData, setOrderData] = useState(data);
  const [isAddressVisible, setAddressVisible] = useState(false);
  const [addressData, setAddressData] = useState({});
  const [deliveryDate, setDelivertDate] = useState('');
  const router = useRouter();
  const handleClick = () => router.back();
  const session = useSession();
  const cart = orderData?.cart || {};
  const { products, delivery, user, addresses } = orderData;
  const { discount, subtotal, total, quantity, promoDiscount = 0 } = cart;
  const deliveryArray = Object.entries(delivery);
  const [promoCodeText, setPromoCodeText] = useState('');
  const [promoCodeError, setPromoCodeError] = useState('');
  const [promoCode, setPromoCode] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);
  const [disableTerminalCodeButton, setDisableTerminalCodeButton] = useState(false);
  const [disablePromoButton, setDisablePromoButton] = useState(false);
  const deliveryData = useMemo(
    () => orderData?.delivery[deliveryDate],
    [deliveryDate, orderData],
  );
  const mainAddress = useMemo(
    () => orderData.addresses.find(address => address.isMain === true),
    [orderData],
  );
  const {
    register,
    control,
    reset,
    formState: { errors, isValid },
    handleSubmit,
    getValues,
    setValue,

    unregister,
    watch
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
    resolver: yupResolver(CheckoutSchema),
    defaultValues: {
      name: user.name,
      surname: user.surname,
      phone: user.phone,
      email: user.email,
      payment_method: '',
      delivery_date: '',
      promo_code: '',
      address: JSON.stringify(mainAddress),
    },
  });

  const values = watch();
  const terminal = getValues('terminal') || {};


  useEffect(() => {
    if (shouldLogOut) {
      signOut({ redirect: false });
      router.push('/');
    }
    if (!orderData.products.length) {
      router.push('/');
    }
  }, [orderData]);

  useEffect(() => {
    const interceptor = httpRequest.interceptors.request.use(
      request => {
        const defaultCurrencyCookie = getCookie('currency');

        let defaultCurrency = {};
        defaultCurrency.code = 'AZN';
        if (defaultCurrencyCookie) {
          defaultCurrency = JSON.parse(defaultCurrencyCookie);
        }
        if (session.status === 'authenticated') {
          request.headers[
            'Authorization'
          ] = `Bearer ${session.data.user.accessToken}`;
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
  }, [session, data]);

  const handleDeliveryChange = value => {
    try {
      setDelivertDate(value);
    } catch (error) {
      
    }
  };

  const handleDelete = useCallback(async (id, variationId, type) => {
    try {
      await httpRequest.delete(`/profile/cart/remove`, {
        data:
          type === 'combo'
            ? {
              combo_id: id,
            }
            : {
              product_id: id,
              variation_id: variationId,
            },
      });
      getCheckoutData();
    } catch (error) { }
  }, []);

  const handleNoDeliveryDelete = useCallback(
    (id, variationId, type) => {
      try {
        const newOrderData = orderData.products.filter(item => item.id !== id);
        const newCartData = newOrderData.reduce(
          (first, second) => {
            
            return {
              discount:
                first.discount +
                (second.total_discount ? parseFloat(second.total_discount) : 0),
              subtotal:
                first.subtotal +
                (second.subtotal ? parseFloat(second.subtotal) : 0),
              total:
                first.total + (second.total ? parseFloat(second.total) : 0),
              quantity:
                first.quantity +
                (second.quantity ? parseFloat(second.quantity) : 0),
            };
          },
          {
            discount: 0,
            subtotal: 0,
            total: 0,
            quantity: 0,
          },
        );
        const newDeliveryArray = deliveryArray.map(delivery => {
          return [
            delivery[0],
            {
              can_not_delivery_products:
                delivery[1].can_not_delivery_products.filter(
                  item => item.id !== id,
                ),
              delivery_info: delivery[1].delivery_info,
            },
          ];
        });
        const newDelivery = Object.fromEntries(newDeliveryArray);
        setOrderData({
          ...orderData,
          cart: { ...newCartData },
          products: [...newOrderData],
          delivery: { ...newDelivery },
        });
      } catch (error) {
        
      }
    },
    [orderData, deliveryData, deliveryDate, deliveryArray],
  );

  const changeQuantity = useCallback(
    async ({ id, variation_id, type, quantity }) => {
      try {
        await httpRequest.post(
          'profile/cart/update',
          type === 'combo'
            ? {
              combo_id: id,
              quantity: quantity,
            }
            : {
              product_id: id,
              variation_id: variation_id,
              quantity: quantity,
            },
          {
            headers: {
              Authorization: `Bearer ${session.data.user.accessToken}`,
            },
          },
        );
        getCheckoutData();
      } catch (error) {
        warningToast(texts.noAvailableStock);
      }
    },
    [],
  );

  const getCheckoutData = useCallback(async (isFromAddress) => {
    try {
      const { data } = await httpRequest.get('/profile/order/checkout');
      setOrderData(data.data);
      if (isFromAddress) {
        reset({
          address: JSON.stringify(data.data.addresses.find(address => address.isMain === true)),
        })
      }
    } catch (error) {
      
    }
  }, [mainAddress, orderData]);

  const handleAddressEditClick = useCallback(item => {
    setAddressData(item);
    setAddressVisible(true);
  }, []);

  const handleNewAddressClick = useCallback(async () => {
    setAddressData({})
    setAddressVisible(true);
  }, []);

  const submitCheckout = useCallback(
    async values => {

      values.phone = values.phone.replace(/\D/g, '').slice(3);
      try {
        const address = JSON.parse(values.address);
        
        const orderData = {
          ...values,
          address: {
            address_id: address.addressId,
            state: address.state,
            region: address.region,
            street: address.street,
            region_id: address.regionId,
            street_id: address.streetId,
            state_id: address.stateId,
            dead_end: address.deadEnd,
            home: address.home,
            entrance: address.entrance,
            floor: address.floor,
            flat: address.flat,
            intercom: address.intercom,
            note: address.note,
            has_barrier: address.hasBarrier,
          },
        };
        const { data } = await httpRequest.post('/profile/order', orderData);

        if (data.data.redirect) {
          router.push(data.data.redirect);
        } else {
          setModalVisible(true);
          setTimeout(() => {
            router.push('/');
          }, 2000);
        }
      } catch (error) {
        errorToast(error.response.data.message)
        
      }
    },
    [deliveryDate],
  );
  const handlePromoCodeChange = ({ e }) => {
    try {
      setPromoCodeText(e.target.value);
    } catch (error) {
      
    }
  };

  const handlePromoCode = useCallback(async () => {
    try {
      setDisablePromoButton(true);
      const response = await httpRequest.post('profile/promo-check', {
        promo_code: promoCodeText,
      });
      const responseData = response.data;
      
      if (responseData.data?.status !== 'success') {
        throw Error()
      }
      
      setPromoCode(responseData.data);
      setPromoCodeError('')
      setOrderData(state => ({
        ...state,
        cart: {
          ...state.cart,
          total: parseFloat(data.cart.total) - parseFloat(responseData.data.discount),
          promoDiscount: responseData.data.discount,
        },
      }));
      setValue("promo", responseData.data)
      setDisablePromoButton(false);


    } catch (error) {
      setDisablePromoButton(false);
      setPromoCodeError(texts.noPromoCodeText);
      setPromoCode({});
      setOrderData(data);
      setValue("promo", {})


      
    }
  }, [promoCodeText,texts]);

  

  const handleTerminal = (paymentOption) => {
    if (paymentOption?.[0] !== 'terminal') {
      setShowTerminalInput(false)
      setDisableCheckoutButton(false)
      setValue('terminal', {})
      return
    }
    setShowTerminalInput(true)
    setDisableCheckoutButton(true)
    return
  }

  const handleTerminalSubmit = async () => {
    try {
      setDisableTerminalCodeButton(true)
      const terminal_code = getValues().terminalInput
      const response = await httpRequest.post('/profile/check-terminal', {
        terminal_code
      }, {
        timeout: 0
      })
      const payload = response.data.payload;
      setDisableTerminalCodeButton(false)
      setDisableCheckoutButton(false)
      
      setValue('terminal', payload)
    }
    catch (terminalError) {
      
      errorToast(texts.incorrectPaymentCodeError)
      setDisableCheckoutButton(true)
      setDisableTerminalCodeButton(false)
      setValue('terminal', {})


    }
  }

  return (
    <div className={styles.contentWrapper}>
      <div className={styles.checkoutHeading}>
        <button type="button" onClick={handleClick} className={styles.goBack}>
          <ChevronLeft />
          <span>{texts.backText}</span>
        </button>
        <h1>{texts.orderText}</h1>
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.checkoutContainer}>
          <div className={`${styles.box} ${styles.cartContainer}`}>
            <Accordion
              sx={{
                margin: '0',
                padding: '0',
                boxShadow: 'none',
                transition: 'color 0.5s ease',
                '&:hover': {
                  color: '#7dbf2a',
                },
              }}>
              <AccordionSummary
                sx={{
                  margin: '0',
                  padding: '0',

                  fontFamily: 'Asap',
                  fontSize: '18px',
                  fontWeight: '700',
                }}
                expandIcon={<ExpandMoreIcon fontSize="100px" />}
                aria-controls="panel1a-content"
                id="panel1a-header">
                {texts.basketText} {!!products.length && `(${products?.length})`}
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  maxHeight: '500px',
                  overflow: 'auto',
                }}>
                <div className={styles.cartProductsContainer}>
                  {products?.map((product, index) => {
                    return (
                      <BasketProductCard
                        handleDelete={handleDelete}
                        changeQuantity={changeQuantity}
                        product={product}
                        key={index + 'product'}
                      />
                    );
                  })}
                </div>
              </AccordionDetails>
            </Accordion>
          </div>

          <form
            className={styles.formContainer}
            onSubmit={handleSubmit(submitCheckout)}>
            <div className={`${styles.box}`}>
              <h3>{texts.contactInfoText}</h3>
              <div className={styles.contactInnerContainer}>
                <CheckoutInput
                  hookForm={register('name')}
                  title={texts.nameText}
                  placeholder=" "
                  message={errors.name?.message}
                  twobytwo={true}

                />
                <CheckoutInput
                  message={errors.surname?.message}
                  hookForm={register('surname')}
                  title={texts.surnameText}
                  placeholder=" "
                  twobytwo={true}


                />
                <CheckoutInput
                  hookForm={register('email')}
                  title={texts.emailText}
                  placeholder=" "
                  message={errors.email?.message}
                  twobytwo={true}


                />
                <CheckoutInput
                  hookForm={register('phone')}
                  title={texts.phoneText}
                  placeholder=" "
                  message={errors.phone?.message}
                  type="phone"
                  twobytwo={true}


                />
              </div>
            </div>
            {isAddressVisible ? (
              <Address
                addressData={addressData}
                setAddressVisible={setAddressVisible}
                getCheckoutData={getCheckoutData}
              />
            ) : (<div className={`${styles.box} ${styles.addressContainer}`}>
              <h3>
                {texts.addressText}
                <span className={styles.errorStyle}>
                  {errors?.address?.message}
                </span>
              </h3>
              <div className={styles.addressInnnerWrapper}>
                <Controller
                  name="address"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field }) => (

                    <RadioGroup
                      {...field}
                      defaultValue={JSON.stringify(mainAddress)}
                      name="address">
                      {addresses.map((item, index) => (
                        <label
                          key={index + 'radio'}
                          htmlFor={`${'address' + index}`}
                          className={styles.addressLabel}>
                          <OrderAddressCard
                            reset={reset}
                            refetchData={getCheckoutData}
                            handleAddressEditClick={() =>
                              handleAddressEditClick(item)
                            }
                            item={item}
                            index={index}
                          />
                        </label>
                      ))}
                    </RadioGroup>)}
                />
              </div>
              <button
                type="button"
                onClick={handleNewAddressClick}
                className={styles.addAddressButton}>
                <AddIcon className={styles.addIcon} />
                {texts.newAddressText}
              </button>
            </div>)}
            <div className={`${styles.box} ${styles.timeContainer}`}>
              <h3>
                {texts.deliveryDate}
                <span className={styles.errorStyle}>
                  {errors?.delivery_date?.message}
                </span>
              </h3>
              <FormControl
                sx={{
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '2px solid #7dbf29',
                  },
                }}
              >
                <InputLabel
                  sx={{
                    '&.Mui-focused': {
                      color: '#7dbf29',
                      fontWeight: '600',
                      fontSize: '14px',
                    },
                    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: '2px solid #7dbf29',
                    },
                  }}
                  id="select-label">
                  {texts.deliveryDay}
                </InputLabel>
                <Controller
                  control={control}
                  name="delivery_date"
                  render={({ field }) => (
                    <Select
                      {...field}
                      onChange={e => {
                        handleDeliveryChange(e.target.value);
                        field.onChange(e);
                      }}
                      sx={{
                        width: "fit-content",
                        minWidth: '50%',
                        maxWidth: '100%',
                        borderRadius: '12px',
                        fontSize: '14px',
                        backgroundColor: '#f4f4f4',
                        '& .MuiSelect-select': {
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: '16px',
                          backgroundColor: '#f4f4f4',

                        }
                      }}
                      label={texts.deliveryDay}
                      labelId="elect-label"
                      id="delivery_date">
                      {deliveryArray?.map((item, index) => {
                        const count =
                          item[1]?.can_not_delivery_products?.length;
                        return (
                          <MenuItem
                            sx={{
                              margin: '0px',
                              backgroundColor: '#f4f4f4',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              gap: '10px',
                              fontSize: '12px',
                            }}
                            key={index + 'delivery'}
                            value={item[0]}
                            className={styles.selectItem}>
                            {moment(item[0]).format('DD MMMM YYYY, dddd')}
                            {!!count && (
                              <span className={styles.infoContainer}>
                                <InfoOutlinedIcon
                                  className={styles.infoIcon}
                                />
                                {`${texts.noDeliveryTitlePartOne} ${count} ${texts.noDeliveryTitlePartTwo}`}
                              </span>
                            )}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  )}
                />
              </FormControl>
              {deliveryData?.can_not_delivery_products?.length > 0 && (
                <div className={styles.noDeliveryProductsHeader}>
                  <h3 >
                    {texts.noDelivery}
                  </h3>
                  <span className={styles.staticInfoContainer}>
                    <InfoOutlinedIcon
                      className={styles.infoIcon}
                    />
                    {texts.noDeliveryDescription}
                  </span>
                </div>
              )}
              <div className={styles.cannotDeliverContainer}>
                {deliveryData?.can_not_delivery_products?.length > 0 && (
                  <>
                    {deliveryData?.can_not_delivery_products?.map(
                      (product, index) => {
                        return (
                          <NoDeliveryProductCard
                            key={index + 'product'}
                            handleDelete={handleNoDeliveryDelete}
                            product={product}
                          />
                        );
                      },
                    )}
                  </>
                )}
              </div>
            </div>
            <div className={`${styles.box} ${styles.paymentContainer}`}>
              <h3>
                {texts.paymentTypeText}
                <span className={styles.errorStyle}>
                  {errors?.payment_method?.message}
                </span>
              </h3>
              <div className={styles.radioContainer}>
                <Controller
                  control={control}
                  name="payment_method"
                  render={({ field }) => (
                    <RadioGroup {...field}
                      className={styles.radioGroup}>
                      {Object.entries(orderData.payment_methods).map(
                        (item, index) => {
                          return (
                            <label htmlFor={item[0]} key={item[0]}>
                              <span>
                                {paymentIcons[item[0]]}
                                {item[1]}
                              </span>

                              <Radio
                                onChange={e => {
                                  handleTerminal(item);
                                  field.onChange(e);
                                }}
                                id={item[0]}
                                sx={{
                                  color: '#d3d3d3',
                                  width: '20px',
                                  height: '20px',
                                  '&.Mui-checked': {
                                    color: '#7dbf29',
                                  },
                                }}
                                value={item[0]}
                              />
                            </label>
                          );
                        },
                      )}
                    </RadioGroup>
                  )}
                />
              </div>

              {
                showTerminalInput && <div className={styles.promoContainer}>
                  <div className={styles.promoInputContainer}>
                    <input
                      {...register('terminalInput')}
                      placeholder={texts.paymentCodeText}
                      id="terminal"
                      type="text"
                      pattern='[0-9]*'
                      name="terminalInput"
                      className={styles.promoInput}
                    />
                    <button
                      type="button"
                      disabled={!getValues().terminalInput || disableTerminalCodeButton}
                      onClick={handleTerminalSubmit}>
                      {disableTerminalCodeButton ? <ClipLoader color='white' /> :
                        <CheckIcon />

                      }
                    </button>
                  </div>
                  {!!Object.keys(terminal).length && (
                    <div className={styles.promoTextContainer}>
                      <span>{terminal.statusMsg}</span>
                      <span>
                        {terminal.amount} {terminal.currency}
                      </span>
                    </div>
                  )}

                </div>
              }
              <div className={styles.promoContainer}>
                <h4>{texts.promoDiscountText}</h4>
                <div className={styles.promoInputContainer}>
                  <input
                    {...register('promo_code', {
                      onChange: e => {
                        handlePromoCodeChange({
                          e,
                        });
                      },
                    })}
                    placeholder={texts.promoCodeText}
                    id="promo_code"
                    type="text"
                    name="promo_code"
                    className={styles.promoInput}
                  />
                  {<button
                    type="button"
                    disabled={!getValues().promo_code || disablePromoButton}
                    onClick={handlePromoCode}>
                    {disablePromoButton ? <ClipLoader color='white' /> :
                      <CheckIcon />

                    }
                  </button>
                  }
                </div>
                {!!Object.keys(promoCode).length && (
                  <div className={styles.promoTextContainer}>
                    <span>{promoCode.promo_code}</span>
                    <span>
                      {promoCode.discount} {selectedCurrency}
                    </span>
                  </div>
                )}
                {promoCodeError && (
                  <span className={styles.promoErrorStyle}>
                    {promoCodeError}
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
        <div className={`${styles.box} ${styles.priceInfoContainer}`}>
          <h3>{texts.orderPriceText}</h3>
          <div className={styles.priceContainer}>
            <div>
              <span>{texts.countText}</span>
              <span>{quantity}</span>
            </div>
            <div>
              <span>{texts.basketText}</span>
              <span>
                {subtotal} {selectedCurrency}
              </span>
            </div>
            <div>
              <span>{texts.discountText}</span>
              <span>
                {discount} {selectedCurrency}
              </span>
            </div>
            <div>
              <span>{
                texts.promoDiscountText}</span>
              <span>
                {promoDiscount} {selectedCurrency}
              </span>
            </div>
          </div>
          <div className={styles.finalPriceContainer}>
            <span>
              {texts.finalPriceText}
            </span>
            <span>
              {total} {selectedCurrency}
            </span>
          </div>
          <button
            type="submit"
            onClick={handleSubmit(submitCheckout)}
            disabled={!isValid || isAddressVisible || deliveryData?.can_not_delivery_products?.length || disableCheckoutButton}
            className={styles.submitButton}>
            {texts.orderText}
          </button>
        </div>
      </div>
      <Modal open={isModalVisible} className={styles.modal}>
        <div className={styles.modalContainer}>
          <div>
            <CheckIcon />
          </div>
          <span>
            {texts.orderAcceptedText}
          </span>
        </div>
      </Modal>
    </div>
  );
};

const mapState = state => {
  return {
    loading: state.globalData.loading,
    settings: state.globalData.settings,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getData: () => dispatch(fetchGlobalData()),
  };
};

const mapStateToPropsCheckout = state => {
  return {
    selectedCurrency: state.globalData.selectedCurrency,
  };
};

Checkout.CheckoutHeader = connect(mapState, mapDispatchToProps)(CheckoutHeader);

export default connect(mapStateToPropsCheckout)(Checkout);
