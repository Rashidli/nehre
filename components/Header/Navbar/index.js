import clsx from 'clsx';
import Link from 'next/link'
import React, { useState } from 'react'
import useTranslate from '../../../hooks/useTranslate';
import styles from './styles.module.scss'



const Navbar = ({scrollPosition}) => {
  const texts = useTranslate();


const navData = [
  {
      title: texts.discountsText, 
      url: '/discount',
      hasSubMenu: false,
  },
  {
      title: texts.campaignsText,
      url: '/campaigns',
      hasSubMenu: false,
  },
  {
      title: texts.recipesText, 
      url: '/recipes',
      hasSubMenu: false,
  },
  {
      title: texts.combosText, 
      url: '/combos',
      hasSubMenu: false,
  },
  {
      title: texts.vendorsText,
      url: '/vendors',
      hasSubMenu: false,
  },
  {
      title: texts.aboutUsText, 
      url: '/about-us',
      hasSubMenu: true,
      subMenu: [
        {
          title: texts.whoAreWeText, 
          url: '/who-are-we',
        },
        {
            title: texts.qualityAssuranceText, 
            url: '/quality',
        },
        {
            title: texts.deliveryAndPaymentText, 
            url: '/delivery',
        },
        {
            title: texts.dontReturnText, 
            url: '/refund',
        },
      ],
  },
  {
      title: texts.contactText,
      url: '/contact',
      hasSubMenu: false,
  },

]
  return (
    <nav className={clsx(styles.container, !!scrollPosition &&  styles.hideNavbar)}>
      <ul className={styles.listContainer}>
        {navData.map((item, index) => {
          return item.hasSubMenu ? (
            <li className={styles.navButtonContainer} key={index + 'navLink'}>
              <span className={styles.navButton}>{item.title}</span>
              <div className={styles.subMenuContainer}>
                {item.subMenu.map((item, index) => {
                  return (
                    <span
                      className={`${styles.subMenuLinkContainer}`}
                      key={index + 'navLink'}>
                      <Link href={item.url}>
                        <a className={styles.subMenuLink}>{item.title}</a>
                      </Link>
                    </span>
                  );
                })}
              </div>
            </li>
          ) : (
            <li
              className={`${styles.navLinkContainer} ${styles.navLinkHover}`}
              key={index + 'navLink'}>
              <Link href={item.url}>
                <a className={styles.navLink}>{item.title}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Navbar