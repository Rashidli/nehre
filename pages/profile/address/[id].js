import { Formik, Form, Field, ErrorMessage } from 'formik';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useReducer, useState } from 'react'
import { Loader } from '../../../components';
import requireAuth from '../../../helpers/requireAuth';
import { httpRequest } from '../../../helpers/utils';
import useTranslate from '../../../hooks/useTranslate';
import AuthLayout from '../../../layout/authLayout';
import { AddressValidator } from '../../../schemas';
import styles from './[id].module.scss';

export const getServerSideProps = async context => {
  return requireAuth(context, async session => {
    try {
      const { query } = context;
      const { data } = await httpRequest.get(`/profile/address/${query.id}`);
      return {
        props: {
          data: data.data,
        },
      };
    } catch (error) {
      return {
        props: {
          shouldLogOut: true,
        }
      };
    }
  });
};

const reducer = (state, action) => {
  return { ...state, ...action }
}



const EditAddress = ({ data, shouldLogOut }) => {
  const texts = useTranslate();
  const router = useRouter();
  const [addressData, dispatch] = useReducer(reducer, {
    ...data
  })



  const [citySelectDisabled, setCitySelectDisabled] = useState(false);
  const [regionSelectDisabled, setRegionSelectDisabled] = useState(false);
  const [streetSelectDisabled, setStreetSelectDisabled] = useState(false);
  const [loader, setLoader] = useState(true);

  const handleSubmit = useCallback(async (validationData) => {
    
    try {

      const updatedAddress = {
        state_id: parseInt(validationData.stateId),
        region_id: parseInt(validationData.regionId),
        street_id: validationData.streetId,
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
      const response = await httpRequest.put(
        `/profile/address/${addressData.addressId}`, updatedAddress
      );

      if ([200, 201].includes(response.status)) {
        router.back();

      }
    }
    catch (error) {
      
    }
  }, [])


  useEffect(() => {
    if (shouldLogOut) {
      signOut({ redirect: false });
      router.push('/');
    }
  }, []);


  const getInitialData = useCallback(async () => {
    try {
      const citiesRequest = httpRequest.get('/common/states');
      let regionsRequest;
      let streetsRequest;

      if (addressData.stateId) {
        regionsRequest = httpRequest.get(`/common/${addressData.stateId}/regions`);
      }
      if (addressData.regionId) {
        streetsRequest = httpRequest.get(
          `/common/${addressData.regionId}/streets`,
        );
      }

      const response = await Promise.all([
        citiesRequest,
        regionsRequest,
        streetsRequest,
      ]);

      const [citiesData, regionsData, streetsData] = response;

      const cities = citiesData?.data?.data;
      const regions = regionsData?.data?.data;
      const streets = streetsData?.data?.data;
      dispatch({ cities, regions, streets })
      setLoader(false);
    }
    catch (error) {
      
    }

  }, [addressData])

  useEffect(() => {
    getInitialData()
  }, [])


  const handleStateChange = useCallback(async (e, handleChange) => {

    try {
      setStreetSelectDisabled(true);
      setRegionSelectDisabled(true);
      handleChange(e)
      const { data } = await httpRequest.get(`/common/${e.target.value}/regions`);
      dispatch({ stateId: e.target.value, regions: data?.data, streets: [], streerId: null, regionId: null });
      if (data?.data?.length) {
        setRegionSelectDisabled(false);
      }
    }
    catch (error) {
      
    }
  }, [addressData])

  const handleRegionChange = useCallback(async (e, handleChange) => {
    try {
      setStreetSelectDisabled(true);
      handleChange(e)
      const { data } = await httpRequest.get(`/common/${e.target.value}/streets`);
      dispatch({ regionId: e.target.value, streets: data.data, streetId: data?.data?.[0]?.streerId });
      if (data?.data?.length) {
        setStreetSelectDisabled(false);
      }
    }
    catch (error) {
      
    }
  }, [addressData])


  const handleStreetChange = useCallback((e, handleChange) => {
    handleChange(e)
    dispatch({ streetId: e.target.value });
  }, [addressData])

  return (
    <div className={styles.container}>
      {loader ? <Loader /> :
        <>
          <h1 className={styles.heading}>{texts.editAddressText}</h1>
          <Formik
            enableReinitialize={true}
            // validationSchema={AddressValidator}
            validateOnChange={false}
            initialValues={addressData}
            onSubmit={handleSubmit}>
            {({ values, errors, isSubmitting, handleChange }) => {
              return (
                <Form>
                  <div className={styles.form}>
                    <div className={styles.selectContainer}>
                      <Field
                        id="state"
                        as="select"
                        name="stateId"
                        onChange={e => handleStateChange(e, handleChange)}
                        disabled={citySelectDisabled}>
                        <option>{texts.chooseCityText}</option>
                        {values.cities?.map((item, index) => {
                          return (
                            <option key={index + 'state'} value={item.stateId}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.stateId && (<span>{texts.chooseCityText}</span>)}
                      <span className={styles.dynamicPlaceholder}>{texts.cityText}</span>
                    </div>
                    <div className={styles.selectContainer}>
                      <Field
                        id="region"
                        as="select"
                        name="regionId"
                        onChange={e => handleRegionChange(e, handleChange)}
                        disabled={!!values?.regions?.length ? regionSelectDisabled : true}>

                        <option>{texts.selectRegionText}</option>

                        {values.regions?.map((item, index) => {
                          return (
                            <option key={index + 'region'} value={item.regionId}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors?.regionId && (<span>{texts.selectRegionText}</span>)}
                      <span className={styles.dynamicPlaceholder}>{texts.regionText}</span>
                    </div>

                    <div className={styles.selectContainer}>
                      <Field
                        id="street"
                        as="select"
                        name="streetId"
                        onChange={e => handleStreetChange(e, handleChange)}
                        disabled={!!values?.streets?.length ? streetSelectDisabled : true}>
                        <option>{texts.selectStreetText}</option>
                        {values.streets?.map((item, index) => {
                          return (
                            <option key={index + 'street'} value={item.streetId}>
                              {item.name}
                            </option>
                          );
                        })}
                      </Field>
                      {errors.streetId && (<span>{texts.selectStreetText}</span>)}
                      <span className={styles.dynamicPlaceholder}>{texts.streetText}</span>
                    </div>
                    <div className={styles.inputContainer}>
                      <Field id="deadEnd" name="deadEnd" placeholder=" " />
                      {errors?.deadEnd && (<span>{errors.deadEnd}</span>)}
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
                      <Field id="floor" type="text" name="floor" />
                      {errors.floor && (<span>{errors.floor}</span>)}
                      <span className={styles.dynamicPlaceholder}>{texts.floorText}</span>
                    </div>
                    <div className={styles.inputContainer}>
                      <Field id="flat" type="text" name="flat" />
                      {errors.flat && (<span>{errors.flat}</span>)}
                      <span className={styles.dynamicPlaceholder}>{texts.flatText}</span>
                    </div>
                    <div className={styles.inputContainer}>
                      <Field id="intercom" type="text" name="intercom" />
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
                          <label htmlFor="hasBarrier">{texts.barrierText}</label>
                          <Field id="hasBarrier" type="checkbox" name="hasBarrier" />
                        </div>
                        <span>{errors.hasBarrier}</span>
                      </div>
                      <div className={styles.checkboxContainer}>
                        <div>
                          <label htmlFor="isMain">{texts.mainAddressText}</label>
                          <Field id="isMain" type="checkbox" name="isMain" />
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
        </>

      }
    </div>
  );
}

EditAddress.PageLayout = AuthLayout;


export default EditAddress;