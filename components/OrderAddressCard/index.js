import React, {useCallback} from 'react';
import styles from './styles.module.scss';
import EditIcon from '@mui/icons-material/Edit';
import {httpRequest} from '../../helpers/utils';
import {errorToast, successToast} from '../../helpers/notification';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {Field} from 'formik';
import DeleteIcon from '@mui/icons-material/Delete';
import {FormControlLabel, Radio} from '@mui/material';
import useTranslate from '../../hooks/useTranslate';

const OrderAddressCard = ({
  item,
  index,
reset,
  refetchData,
  handleAddressEditClick,
}) => {
  const {
    addressId,
    deadEnd,
    entrance,
    flat,
    floor,
    hasBarrier,
    home,
    intercom,
    isMain,
    note,
    region,
    regionId,
    state,
    stateId,
    street,
    streetId,
  } = item;
  const texts = useTranslate()

  const handleDelete = useCallback(async () => {
    try {
      const response = await httpRequest.delete(
        `/profile/address/${addressId}`,
      );
      if ([200, 201].includes(response.status)) {
        refetchData();
        successToast(texts.addressDeleteSuccess);
      }
      reset({address:""})
    } catch (error) {
      
      errorToast(texts.deleteAddressError);
    }
  }, [addressId, refetchData,texts]);

  return (
    <div className={styles.container}>
      <div className={styles.addressContainer}>
        <FormControlLabel 
        control={<Radio 
          id={`${'address' + index}`}
          
          />}
          className={styles.radio}
          defaultValue=" "
          value={JSON.stringify(item)} 

          name="address"
        />
        <p>
          {state}, {region}, {street} {deadEnd}, {texts.buildingLowerCaseText}: {home}, {texts.entranceLowerCaseText}: {entrance},
          {texts.intercomLowerCaseText}: {!!intercom && `${intercom},`} {texts.floorLowerCaseText}: {floor}, {texts.flatLowerCaseText}:{' '}
          {flat}
        </p>
        <div className={styles.actionContainer}>
          <button
            type="button"
            onClick={handleAddressEditClick}
            className={styles.addressActionButton}>
            <EditIcon />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className={styles.addressActionButton}>
            <DeleteIcon />
          </button>
        </div>
      </div>
      <div className={styles.noteContainer}>
        <span className={styles.noteTitle}>{texts.noteText}: </span>
        <span className={styles.noteValue}>{note}</span>
      </div>
    </div>
  );
};

export default OrderAddressCard;
