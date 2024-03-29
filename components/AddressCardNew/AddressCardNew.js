import React, { useCallback } from 'react'
import styles from './styles.module.scss';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { httpRequest } from '../../helpers/utils';
import { errorToast, successToast } from '../../helpers/notification';
import Link from 'next/link';
import { useRouter } from 'next/router';


const AddressCardNew = ({ item, refetchData }) => {
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


    const handleDelete = useCallback(async () => {
        try {
            const response = await httpRequest.delete(`/profile/address/${addressId}`);
            if ([200, 201].includes(response.status)) {
                refetchData();
                successToast(texts.addressDeleteSuccess);
            }

        }
        catch (error) {

            errorToast(texts.deleteAddressError);
        }
    }, [addressId, refetchData,texts]);

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
            <div className={styles.mainAdress}>
                <div>
                    {` ${state} ${ofCityText}, ${region}, ${street} ${deadEnd}, ${flat} `}
                </div>
            </div>
            <div className={styles.typeButton}>
                <button
                    className={styles.addressButton}
                    onClick={handleMainAddress}
                    disabled={isMain}>
                    {isMain ? texts.isMainAddressText : texts.makeMainAddressText}
                </button>
            </div>
            <div className={styles.buttons}>
                <Link href={`${router.pathname}/${addressId}`}>
                    <button className={styles.addressActionButton} >
                        {texts.editText}
                    </button>
                </Link>
                <button className={styles.addressActionButton} onClick={handleDelete}>
                    {texts.deleteText}
                </button>
            </div>
        </div>
    );
}


export default AddressCardNew;