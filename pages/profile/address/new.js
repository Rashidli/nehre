import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import requireAuth from '../../../helpers/requireAuth';
import { httpRequest } from '../../../helpers/utils';
import useTranslate from '../../../hooks/useTranslate';
import AuthLayout from '../../../layout/authLayout';
import { AddressValidator } from '../../../schemas';
import styles from './[id].module.scss';

export const getServerSideProps = async context => {
  return requireAuth(context)
};

const reducer = (state, action) => {
  return { ...state, ...action };
};

const EditAddress = ({ }) => {
  const router = useRouter();
  const [addressData, dispatch] = useReducer(reducer, {
  });
  const [citySelectDisabled, setCitySelectDisabled] = useState(false);
  const [regionSelectDisabled, setRegionSelectDisabled] = useState(false);
  const [streetSelectDisabled, setStreetSelectDisabled] = useState(false);
  const texts = useTranslate();

  const handleSubmit = useCallback(
    async validationData => {
      try {
        
        const updatedAddress = {
          state_id: parseInt(validationData.state_id),
          region_id: parseInt(validationData.region_id),
          street_id: validationData.street_id,
          dead_end: validationData.deadEnd,
          home: validationData.home,
          entrance: validationData.entrance,
          floor: validationData.floor,
          flat: validationData.flat,
          intercom: validationData.intercom,
          note: validationData.note,
          has_barrier: validationData.hasBarrier,
          is_main: validationData.isMain,
        };
        const response = await httpRequest.post(
          `/profile/address`,
          updatedAddress,
        );
        if ([200, 201].includes(response.status)) {
          router.back();
        }

      } catch (error) {
        
      }
    },
    [],
  );

  const getInitialData = useCallback(async () => {
    try {
      const citiesRequest = httpRequest.get('/common/states');
      const response = await Promise.all([
        citiesRequest,
      ]);
      const [citiesData] = response;
      const cities = citiesData.data.data;
      
      dispatch({ cities });
    } catch (error) {
      
      if (error.response.status === 401) {
        signOut({ redirect: false });
        router.push('/login');
      }
    }
  }, []);

  useEffect(() => {
    getInitialData();
  }, []);

  
  const handleStateChange = useCallback(
    async (e, handleChange) => {
      try {
        
        handleChange(e);
        setStreetSelectDisabled(true);
        setRegionSelectDisabled(true);
        const { data } = await httpRequest.get(
          `/common/${e.target.value}/regions`,
        );
        dispatch({
          state_id: e.target.value,
          regions: data?.data,
          streets: [],
          street_id: null,
          region_id: null,
        });
        if (data?.data?.length) {
          setRegionSelectDisabled(false);
        }
      } catch (error) {
        
      }
    },
    [],
  );

  const handleRegionChange = useCallback(
    async (e, handleChange) => {
      try {
        setStreetSelectDisabled(true);
        handleChange(e);
        const { data } = await httpRequest.get(
          `/common/${e.target.value}/streets`,
        );
        dispatch({
          region_id: e.target.value,
          streets: data.data,
          street_id: null,
        });
        if (data?.data?.length) {
          setStreetSelectDisabled(false);
        }
      } catch (error) {
        
      }
    },
    [],
  );

  const handleStreetChange = useCallback(
    (e, handleChange) => {
      handleChange(e);
      dispatch({ street_id: e.target.value });
    },
    [],
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{texts.editAddressText}</h1>
      <Formik
        enableReinitialize={true}
        validationSchema={AddressValidator}
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={addressData}
        onSubmit={handleSubmit}>
        {({ values, errors, isSubmitting, handleChange, err }) => {
          
          

          return (
            <Form>
              <div className={styles.form}>
                <div className={styles.selectContainer}>
                  <Field
                    id="state"
                    as="select"
                    name="state_id"
                    onChange={e => 
                      handleStateChange(e, handleChange)}
                    disabled={citySelectDisabled}
                  >
                    <option>{texts.chooseCityText}</option>
                    {values?.cities?.map((item, index) => {
                      return (
                        <option key={index + 'state'} value={item.stateId}>
                          {item.name}
                        </option>
                      );
                    })}
                  </Field>
                  {errors.state_id && (<span>{texts.chooseCityText}</span>)}
                  <span className={styles.dynamicPlaceholder}>{texts.cityText}</span>
                </div>
                <div className={styles.selectContainer}>
                  <Field
                    id="region"
                    as="select"
                    name="region_id"
                    onChange={e => handleRegionChange(e, handleChange)}
                    disabled={!!values?.regions?.length ? regionSelectDisabled : true}>
                    <option>{texts.selectRegionText}</option>
                    {values.regions?.map((item, index) => {
                      return (
                        <option
                          key={index + 'region'}
                          value={item.regionId}>
                          {item.name}
                        </option>
                      );
                    })}
                  </Field>
                  {errors?.region_id && (<span>{texts.selectRegionText}</span>)}
                  <span className={styles.dynamicPlaceholder}>{texts.regionText}</span>
                </div>
                <div className={styles.selectContainer}>
                  <Field
                    id="street"
                    as="select"
                    name="street_id"
                    onChange={e => handleStreetChange(e, handleChange)}
                    disabled={!!values?.streets?.length ? streetSelectDisabled : true}>
                    <option>{texts.selectStreetText}</option>
                    {values.streets?.map((item, index) => {
                      return (
                        <option
                          key={index + 'street'}
                          value={item.streetId}>
                          {item.name}
                        </option>
                      );
                    })}
                  </Field>
                  {errors.streerId && (<span>{texts.selectStreetText}</span>)}
                  <span className={styles.dynamicPlaceholder}>{texts.streetText}</span>
                </div>

                <div className={styles.inputContainer}>
                  <Field id="dead_end" name="dead_end" placeholder=" " />
                  {errors.deadEnd && (<span>{errors.deadEnd}</span>)}
                  <span className={styles.dynamicPlaceholder}>{texts.deadEndText}</span>
                </div>
                <div className={styles.inputContainer}>
                  <Field id="home" type="text" name="home" placeholder=" " />
                  {errors.home && (<span>{errors.home}</span>)}
                  <span className={styles.dynamicPlaceholder}>{texts.buildingText}</span>
                </div>
                <div className={styles.inputContainer}>
                  <Field id="entrance" type="text" name="entrance" placeholder=" " />
                  {errors.entrance && (<span>{errors.entrance}</span>)}
                  <span className={styles.dynamicPlaceholder}>{texts.entranceText}</span>
                </div>
                <div className={styles.inputContainer}>
                  <Field id="floor" type="text" name="floor" placeholder=" " />
                  {errors.floor && (<span>{errors.floor}</span>)}
                  <span className={styles.dynamicPlaceholder}>{texts.floorText}</span>
                </div>
                <div className={styles.inputContainer}>
                  <Field id="flat" type="text" name="flat" placeholder=" " />
                  {errors.flat && (<span>{errors.flat}</span>)}
                  <span className={styles.dynamicPlaceholder}>{texts.flatText}</span>
                </div>
                <div className={styles.inputContainer}>
                  <Field id="intercom" type="text" name="intercom" placeholder=" " />
                  {errors.intercom && (<span>{errors.intercom}</span>)}
                  <span className={styles.dynamicPlaceholder}>{texts.intercomText}</span>
                </div>

                <div className={styles.textareaContainer}>
                  <div>
                    <label htmlFor="note">{texts.noteText}</label>
                    <Field id="note" as="textarea" name="note" />
                  </div>
                  <span>{errors.note}</span>
                </div>
                <div className={styles.checkboxesContainer}>
                  <p className={styles.checkboxesText}>{texts.addressText}</p>
                  <div className={styles.checkboxContainer}>
                    <div>
                      <Field id="has_barrier" type="checkbox" name="has_barrier" />
                      <label htmlFor="has_barrier">{texts.barrierText}</label>
                    </div>
                    <span>{errors.hasBarrier}</span>
                  </div>
                  <div className={styles.checkboxContainer}>
                    <div>
                      <Field id="is_main" type="checkbox" name="is_main" />
                      <label htmlFor="is_main">{texts.mainAddressText}</label>
                    </div>
                    <span>{errors.radio}</span>
                  </div>
                </div>
                <div className={styles.submitButtonContainer}>
                  <button
                    className={styles.submit}
                    type="submit"
                    disabled={isSubmitting}>
                    {texts.confirmText}
                  </button>

                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

EditAddress.PageLayout = AuthLayout;

export default EditAddress;
