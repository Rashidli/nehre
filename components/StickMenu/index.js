import React from 'react';
import styles from './styles.module.scss';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import WindowIcon from '@mui/icons-material/Window';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Link from 'next/link';
import { useState } from 'react';
import { MenuRounded } from '@mui/icons-material';
import MobileHamburgerMenu from '../Header/TopNavbar/components/MobileHamburgerMenu';
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react";
import useTranslate from '../../hooks/useTranslate';



const StickBottomMenu = () => {
  const [selectedMenu, setSelectedMenu] = useState('/');
  const [isMobileMenuVisible, setMobileMenuVisible] = useState(false);
  const session = useSession();
  const router = useRouter();
  const userSession = useSession();
  const texts = useTranslate();
  const menuData = [
    {
      id: "stickMenuId1",
      name: texts.mainMenuText,
      icon: <HomeIcon />,
      link: '/'
    },
    {
      id: "stickMenuId2",
      name: texts.categoriesText,
      icon: <WindowIcon />,
      link: '/catagories'
    },
    {
      id: "stickMenuId3",
      name: texts.basketText,
      icon: <ShoppingBasketIcon />,
      link:  {
        pathname: router.pathname,
        query: { ...router.query, cart: true }
      }
    },
  
  ]

  const toggleMobileHamburgerMenu = () => {
    setSelectedMenu("sidebarMenu");
    setMobileMenuVisible(!isMobileMenuVisible);
  }

  return (
    <div className={styles.container}>
      {menuData.map((menuItem,index) => (
        <Link href={menuItem.link} key={menuItem.id + "bottomMenu"} >
          <div
            className={router.pathname == menuItem.link ? styles.selectedMenuItem : styles.menuItem}
            onClick={() => setSelectedMenu(menuItem.link)}
          >
            {menuItem.icon}
            <p>{menuItem.name}</p>
          </div>
        </Link>
      ))}

      {
        userSession.status == 'authenticated' && (
          <Link href={'/profile/favorites'}>
            <div
              className={router.pathname == "/profile/favorites" ? styles.selectedMenuItem : styles.menuItem}
              onClick={() => setSelectedMenu('/profile/favorites')}
            >
              <FavoriteIcon />
              <p>{texts.favoritesText}</p>
            </div>
          </Link>
        )
      }
      <div className={styles.menuButtonContainer}>
        <button
          className={styles.menuItem}
          onClick={toggleMobileHamburgerMenu}
        >
          <MenuIcon />
          <p>{texts.menuText}</p>
        </button>
        <MobileHamburgerMenu
          isVisible={isMobileMenuVisible}
          toggleMobileHamburgerMenu={() => setMobileMenuVisible(false)}
        />
      </div>
    </div>
  )
}

export default StickBottomMenu