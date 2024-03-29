import { Backdrop } from '@mui/material';
import MobileAccordion from '../MobileAccordion';
import Link from 'next/link';
import { connect, useSelector } from 'react-redux';
import styles from './styles.module.scss';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import useTranslate from '../../../../../hooks/useTranslate';



const MobileHamburgerMenu = ({ isVisible, toggleMobileHamburgerMenu }) => {
  const data = useSelector(state => state.globalData.settings);
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
    <Backdrop
      sx={{ transition: '500ms', zIndex: (theme) => theme.zIndex.drawer }}
      open={isVisible}
      onClick={toggleMobileHamburgerMenu}>
      <div className={styles.mobileHamburgerMenu} onClick={(e) => e.stopPropagation()}>
        <div className={styles.mobileHamburgerMenu__container}>
          <div>
            <div className={styles.mobileHamburgerMenu__header}>
              <div className={styles.mobileHamburgerMenu__titleContainer}>
                <p className={styles.mobileHamburgerMenu__title}>{texts.menuText}</p>
              </div>
              <div className={styles.mobileHamburgerMenu__closeBtnContainer}>
                <button className={styles.mobileHamburgerMenu__closeBtn} onClick={toggleMobileHamburgerMenu}>✖</button>
              </div>
            </div>
            <div>
              <MobileAccordion toggleMobileHamburgerMenu={toggleMobileHamburgerMenu} />
            </div>
            <div className={styles.mobileHamburgerMenu__menu}>
              <ul className={styles.mobileHamburgerMenu__menuContainer}>
                {navData.map(item => {
                  return (
                    <>
                      <li className={styles.mobileHamburgerMenu__menuItem} onClick={toggleMobileHamburgerMenu}>
                        <Link href={item.url}><a className={styles.mobileHamburgerMenu__menuLink}>{item.title}</a></Link>
                      </li>
                    </>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className={styles.mobileHamburgerMenu__footer}>
            <div className={styles.mobileHamburgerMenu__footer_bottom}>
              <p className={styles.mobileHamburgerMenu__footer_tel}>{data?.whatsappPhone}</p>
              <p className={styles.mobileHamburgerMenu__footer_tel}>{data?.tel}</p>
              <p className={styles.mobileHamburgerMenu__footer_address}>{data?.address}</p>
              <p className={styles.mobileHamburgerMenu__footer_email}>{data?.email}</p>
              <div className={styles.mobileHamburgerMenu__footer_socials}>
                <a href={data?.facebook}>
                  <FacebookIcon />
                </a>
                <a href={data?.instagram}>
                  <InstagramIcon />
                </a>
                <a href={data?.twitter}>
                  <TwitterIcon />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Backdrop>
  )
}


export default MobileHamburgerMenu