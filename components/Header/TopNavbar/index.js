import { Phone, WhatsApp, MenuRounded, SearchRounded } from '@mui/icons-material'
import { Button, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import AccountButton from './components/AccountButton';
import FavoriteButton from './components/FavoriteButton';
import CartButton from './components/CartButton';
import LangDropDown from './components/LangDropDown';
import MoneyDropDown from './components/MoneyDropDown';
import styles from './styles.module.scss';
import SearchModal from './components/SearchModal';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import useTranslate from '../../../hooks/useTranslate';


const TopNav = ({ settings, scrollPosition }) => {
  const hasRightImage = useMediaQuery("(min-width:1200px)");
  const big = useMediaQuery("(min-width:1001px)");
  const medium = useMediaQuery("(max-width:1000px) and (min-width:651px)");
  const small = useMediaQuery("(max-width:650px)");
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
  const [searchedValue, setSearhedValue] = useState("");
  const session = useSession();
  const router = useRouter();
  const texts = useTranslate();

  const { tel, whatsappPhone } = settings ?? {};

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      router.push(`/search?query=${e.target.value}`)
    }
  }
  
  const handleSearchButtonFunc = () => {
    router.push(`/search?query=${searchedValue}`); 
  }
  const handleSetSearchInpValue = (e) => {
    setSearhedValue(e.target.value);
  }
  const toggleMobileHamburgerMenu = () => {
    setMobileMenuVisible(!isMobileMenuVisible)
  }

  if (isMobileMenuVisible) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = 'auto'
  }
  return (
    <div
      className={clsx(styles.container, !!scrollPosition && styles.noBorder)}>
      <div
        className={clsx(
          styles.innerContainer,
          !!scrollPosition && styles.scrollStyle,
        )}>
        {big && (
          <div
            className={clsx(
              styles.bigImage,
              !!scrollPosition && styles.scrollImage,
            )}>
            <Link href="/">
              <a>
                <Image
                  src={
                    scrollPosition
                      ? '/images/logoNehre2.png'
                      : '/images/Loqo_nehre.png'
                  }
                  alt=""
                  layout={'fill'}
                />
              </a>
            </Link>
          </div>
        )}
        {medium && (
          <Link href="/">
            <a>
              <Image
                src="/images/logoNehre2.png"
                alt=""
                width={100}
                height={41}
              />
            </a>
          </Link>
        )}

        {small && (
          <Link href="/">
            <a>
              <Image
                src="/images/logoNehre2.png"
                alt=""
                width={100}
                height={41}
              />
            </a>
          </Link>
        )}
        <div className={styles.middleContainer}>
          {!small && (
            <div className={styles.searchAndInfoContainer}>
              {big && (
                <div className={styles.inputContainer}>
                  <input
                    placeholder={texts.toSearchText}
                    className={styles.input}
                    onKeyDown={handleKeyDown}
                    onChange={handleSetSearchInpValue}
                  />
                  <button className={styles.searchButton} onClick={() => handleSearchButtonFunc()}>
                    <SearchRounded />
                  </button>
                </div>
              )}

              <div className={styles.phoneContainer}>
                <span className={styles.phone}>
                  <Phone />{' '}
                  <Link href={`tel:${tel}`}>
                    <a className={styles.link}>{tel}</a>
                  </Link>
                </span>
                <span className={styles.phone}>
                  <WhatsApp />
                  <a
                    href={`https://api.whatsapp.com/send/?phone=%2B${whatsappPhone?.slice(1,)}&text=Salam.+%0ASiz%C9%99+sual%C4%B1m+var&type=phone_number&app_absent=0`}
                    target="_blank"
                    rel='noreferrer'
                  >
                    <a className={styles.link}>{whatsappPhone}</a>
                  </a>
                </span>
              </div>
            </div>
          )}

          <div className={styles.actionsContainer}>
            {small && (
              <div>
                <button onClick={toggleSearch} className={styles.searchButton}>
                  <SearchRounded />
                </button>
                <SearchModal
                  isVisible={isSearchVisible}
                  toggleSearch={() => setSearchVisible(false)}
                />
              </div>
            )}
            <MoneyDropDown />
            <LangDropDown />
            <AccountButton />
            {session.status === 'authenticated' && <FavoriteButton />}

            {!small && (
              <CartButton />
            ) }
          </div>
        </div>

        {hasRightImage && (
          <div
            className={clsx(
              styles.rightImage,
              !!scrollPosition && styles.scrollImageRight,
            )}>
            <Image src="/images/element.png" alt="" layout="fill" />
          </div>
        )}
      </div>
    </div>
  );
}

const mapState = state => {
  return ({
    settings: state.globalData.settings,
  })
}


export default connect(mapState)(TopNav);