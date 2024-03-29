import React, { useCallback } from 'react'
import styles from './styles.module.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { httpRequest } from '../../helpers/utils';
import {errorToast,successToast} from '../../helpers/notification';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useTranslate from '../../hooks/useTranslate';


const AddressCard = ({item, refetchData}) => {
  const router = useRouter();
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

  const texts = useTranslate();
  const handleDelete = useCallback(async() => {
    try {
      const response = await httpRequest.delete(`/profile/address/${addressId}`);
      if ([200, 201].includes(response.status))
      {
        refetchData();
        successToast(texts.addressDeleteSuccess);
        }
        
    }
    catch (error) {
      
      errorToast(texts.deleteAddressError);
    }
  }, [addressId, refetchData, texts]);

    const handleMainAddress = useCallback(async () => {
      try {
        const response = await httpRequest.post(
          `/profile/address/${addressId}/default`, 
        );
        if ([200, 201].includes(response.status)) {
           refetchData();
           successToast(texts.addressMainSuccess);
        }
      } catch (error) {
        
        errorToast(texts.error);
      }
    }, [addressId, refetchData,texts]);

    return (
      <div className={styles.container}>
        <div className={styles.addressContainer}>
          <div className={styles.address}>
            <div className={styles.addressItem}>
              <span className={styles.addressItemTitle}>{texts.cityText}:</span>
              <span className={styles.addressItemValue}>{state}</span>
            </div>
            <div className={styles.addressItem}>
              <span className={styles.addressItemTitle}>{texts.regionText}:</span>
              <span className={styles.addressItemValue}>{region}</span>
            </div>
            <div className={styles.addressItem}>
              <span className={styles.addressItemTitle}>{texts.streetText}:</span>
              <span className={styles.addressItemValue}>{street}</span>
            </div>
            <div className={styles.addressItem}>
              <span className={styles.addressItemTitle}>{texts.deadEndText}:</span>
              <span className={styles.addressItemValue}>{deadEnd}</span>
            </div>
            <div className={styles.addressItem}>
              <span className={styles.addressItemTitle}>{texts.barrierText}:</span>
              <span className={styles.addressItemValue}>
                {hasBarrier ? texts.haveText : texts.dontHaveText}{' '}
              </span>
            </div>

            <div className={styles.addressItem}>
              <span className={styles.addressItemTitle}>{texts.buildingText}:</span>
              <span className={styles.addressItemValue}>{home}</span>
            </div>
            <div className={styles.addressItem}>
              <span className={styles.addressItemTitle}>{texts.floorText}:</span>
              <span className={styles.addressItemValue}>{floor}</span>
            </div>
            <div className={styles.addressItem}>
              <span className={styles.addressItemTitle}>{texts.entranceText}:</span>
              <span className={styles.addressItemValue}>{entrance}</span>
            </div>
            <div className={styles.addressItem}>
              <span className={styles.addressItemTitle}>{texts.intercomText}:</span>
              <span className={styles.addressItemValue}>{intercom}</span>
            </div>
            <div className={styles.addressItem}>
              <span className={styles.addressItemTitle}>{texts.flatText}:</span>
              <span className={styles.addressItemValue}>{flat}</span>
            </div>
          </div>
          <div className={styles.noteItem}>
            <span className={styles.noteTitle}>{texts.noteText}:</span>
            <span className={styles.noteValue}>{note}</span>
          </div>
        </div>
        <div className={styles.addressActions}>
          <Link href={`${router.pathname}/${addressId}`}>
            <a className={styles.addressActionButton} >
              <EditIcon />
            </a>
          </Link>

          <button
            className={styles.addressButton}
            onClick={handleMainAddress}
            disabled={isMain}>
            {isMain ? texts.isMainAddressText : texts.makeMainAddressText}
          </button>
          <button className={styles.addressActionButton} onClick={handleDelete}>
            <DeleteIcon />
          </button>
        </div>
      </div>
    );
}


export default AddressCard;