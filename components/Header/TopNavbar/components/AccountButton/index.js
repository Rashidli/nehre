import React from 'react';
import styles from './styles.module.scss';
import PersonIcon from '@mui/icons-material/Person';
import {useSession} from 'next-auth/react';
import Link from 'next/link';
import {useRouter} from 'next/router';

import shoppingBasketIcon from '../../../../../public/images/basket-shopping-solid.svg';
import circleUserIcon from '../../../../../public/images/circle-user-solid.svg';
import giftIcon from '../../../../../public/images/gift-solid.svg';
import signOutIcon from '../../../../../public/images/right-from-bracket-solid.svg';
import {signOut} from 'next-auth/react';
import Image from 'next/image';
import {useState} from 'react';
import {Modal} from '@mui/material';
import {httpRequest} from '../../../../../helpers/utils';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import useTranslate from '../../../../../hooks/useTranslate';


const DropDown = () => {
  const {status} = useSession();
  const router = useRouter();
  const texts = useTranslate();
  const [isModalOpened, setIsModalOpened] = useState(false);

  const handleClose = () => setIsModalOpened(false);
  const accountDropdownMenuItems = [
    {
      id: 'dropdownMenuItem1',
      name: texts.profileText,
      icon: circleUserIcon,
      link: '/profile',
    },
    {
      id: 'dropdownMenuItem2',
      name: texts.ordersText,
      icon: shoppingBasketIcon,
      link: '/profile/orders',
    },
    {
      id: 'dropdownMenuItem3',
      name: texts.bonusesText,
      icon: giftIcon,
      link: '/profile/bonuses',
    },
  ];
  

  const logout = async () => {
    try {
      const {data} = await httpRequest.post('/auth/logout');
      const {result} = data;

      if ([200, 201].includes(result.code)) {
        signOut({redirect: false});
        setIsModalOpened(false);
        router.push('/');
      }
    } catch (error) {}
  };
  return (
    <div className={styles.dropContainer}>
      {status != 'authenticated' ? (
        <Link
          href={{
            pathname: router.pathname,
            query: {...router.query, login: true},
          }}
          shallow={status === 'authenticated' ? false : true}>
          <a className={styles.button}>
            {status === 'authenticated' ? <ContactMailIcon /> : <PersonIcon />}
          </a>
        </Link>
      ) : (
        <a className={styles.button}>
          {status === 'authenticated' ? <ContactMailIcon /> : <PersonIcon />}
        </a>
      )}
      {status === 'authenticated' && (
        <div className={styles.dropdownMenu}>
          <ul className={styles.dropdownMenuList}>
            <Link href={'/profile'}>
              <div
                className={[
                  styles.dropdownMenuListItem,
                  styles.dropdownMenuListItem1,
                ].join(' ')}>
                <div style={{color: '#96BC90'}}>
                  <Image
                    src={circleUserIcon}
                    alt={`personal cabinet icon`}
                    width={16}
                    height={16}
                    color="#96BC90"
                  />
                </div>
                <p>{texts.profileText}</p>
              </div>
            </Link>
            <Link href={'/profile/orders'}>
              <div
                className={[
                  styles.dropdownMenuListItem,
                  styles.dropdownMenuListItem2,
                ].join(' ')}>
                <div style={{color: '#96BC90'}}>
                  <Image
                    src={shoppingBasketIcon}
                    alt={`orders icon`}
                    width={16}
                    height={16}
                    color="#96BC90"
                  />
                </div>
                <p>{texts.ordersText}</p>
              </div>
            </Link>
            <Link href={'/profile/bonuses'}>
              <div
                className={[
                  styles.dropdownMenuListItem,
                  styles.dropdownMenuListItem3,
                ].join(' ')}>
                <div style={{color: '#96BC90'}}>
                  <Image
                    src={giftIcon}
                    alt={`bonuses icon`}
                    width={16}
                    height={16}
                    color="#96BC90"
                  />
                </div>
                <p>{texts.bonusesText}</p>
              </div>
            </Link>
            <div
              className={[
                styles.dropdownMenuListItem,
                styles.dropdownMenuListItem4,
              ].join(' ')}
              onClick={() => setIsModalOpened(true)}>
              <div style={{color: '#96BC90'}}>
                <Image
                  src={signOutIcon}
                  alt={`logout icon`}
                  width={16}
                  height={16}
                  color="#96BC90"
                />
              </div>
              <p>{texts.logoutText}</p>
            </div>
          </ul>
        </div>
      )}
      {isModalOpened && (
        <Modal open={isModalOpened} onClose={handleClose}>
          <div className={styles.logOutModalContainer}>
            <p>{texts.areYouSureToLogoutText}</p>
            <button className={styles.logOutModalButton} onClick={logout}>
              {texts.logoutText}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DropDown;
