import React, { useCallback, useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlaceIcon from '@mui/icons-material/Place';
import DescriptionIcon from '@mui/icons-material/Description';
import SpeakerNotesIcon from '@mui/icons-material/SpeakerNotes';
import LogoutIcon from '@mui/icons-material/Logout';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Link from 'next/link';
import styles from './styles.module.scss';
import { useMediaQuery } from '@mui/material';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { httpRequest } from '../../helpers/utils';
import useTranslate from '../../hooks/useTranslate';


const userMenu = [
  {
    title: "Şəxsi kabinet",
    link: "/profile",
    icon: <AccountCircleIcon />
  },
  {
    title: "Şifrə",
    link: "/profile/password",
    icon: <LockIcon />
  },
  {
    title: "Ünvan",
    link: "/profile/address",
    icon: <PlaceIcon />
  },
  {
    title: "Sevimlilər",
    link: "/profile/favorites",
    icon: <FavoriteIcon />
  },
  {
    title: "Sifarişlərim",
    link: "/profile/orders",
    icon: <DescriptionIcon />
  },
  {
    title: "Bonuslar",
    link: "/profile/bonuses",
    icon: <MonetizationOnIcon />
  },
  {
    title: "Balans",
    link: "/profile/deposite",
    icon: <AccountBalanceWalletIcon />
  },
  {
    title: "Bildirişlər",
    link: "/profile/notification",
    icon: <NotificationsIcon />
  },
  {
    title: "Şərhlər",
    link: "/profile/reviews",
    icon: <SpeakerNotesIcon />
  },
  {
    title: "Tövsiyyələr",
    link: "/profile/referrer",
    icon: <ThumbUpIcon />
  },
  {
    title: "Çıxış",
    link: "/profile/logout",
    icon: <LogoutIcon />
  },

]


const AuthLayout = ({ children }) => {
  const router = useRouter();
  const [notificationData, setNotificationData] = useState();
  const [favoriteData, setFavoriteData] = useState();
  const texts = useTranslate();

const userMenu = [
  {
    title: texts.profileText, 
    link: "/profile",
    icon: <AccountCircleIcon />
  },
  {
    title: texts.passwordText,
    link: "/profile/password",
    icon: <LockIcon />
  },
  {
    title: texts.addressText,
    link: "/profile/address",
    icon: <PlaceIcon />
  },
  {
    title: texts.favoritesText,
    link: "/profile/favorites",
    icon: <FavoriteIcon />
  },
  {
    title: texts.myOrdersText, 
    link: "/profile/orders",
    icon: <DescriptionIcon />
  },
  {
    title: texts.bonusesText, 
    link: "/profile/bonuses",
    icon: <MonetizationOnIcon />
  },
  {
    title: texts.balanceText, 
    link: "/profile/deposite",
    icon: <AccountBalanceWalletIcon />
  },
  {
    title: texts.notificationsText,
    link: "/profile/notification",
    icon: <NotificationsIcon />
  },
  {
    title: texts.reviewText,
    link: "/profile/reviews",
    icon: <SpeakerNotesIcon />
  },
  {
    title: texts.recommendationsText,
    link: "/profile/referrer",
    icon: <ThumbUpIcon />
  },
  {
    title: texts.logOutButtonText,
    link: "/profile/logout",
    icon: <LogoutIcon />
  },

]

  const findActiveMenu = useCallback(data => {
    const index = 0;
    for (let i in data) {
      if (data[i].link === router.pathname) {
        index = i;
        break;
      }
    }
    return index;
  }, []);


  const getNotificationData = async () => {
    try {
      const response = await httpRequest.get("/profile/notification");
      setNotificationData(response?.data?.data);
    }
    catch (error) {
      
    }
  }

  const getFavoriteData = async () => {
    try {
      const response = await httpRequest.get("/profile/favorites");
      setFavoriteData(response?.data?.data?.products);
    }
    catch (error) {
      
    }
  }

  useEffect(() => {
    getFavoriteData();
    getNotificationData();
  }, [])


  const [selectedMenu, setSelectedMenu] = useState(findActiveMenu(userMenu));
  const isDesktop = useMediaQuery('(min-width:960px)');
  return (
    <div className={styles.authContainer}>
      <div className={styles.authMenuContainerScrollRow}>
        <ul className={styles.authMenuContainer}>
          {
            userMenu.map((item, index) => {
              return (
                <li
                  className={styles.authMenuLink}
                  key={item.title + index}>
                  <Link href={item.link}>
                    <a
                      className={clsx(
                        selectedMenu == index &&
                        styles.selectedAuthMenuLink,
                      )}
                      onClick={() => setSelectedMenu(index)}>
                      {item.icon}
                      {isDesktop && (
                        <span className={styles.menuTitle}>
                          {item.title}
                        </span>
                      )}
                    </a>
                  </Link>
                  {item.link == "/profile/favorites" && (
                    <p className={styles.authMenuLinkQuantity}>{favoriteData?.length}</p>
                  )}
                  {item.link ==  "/profile/notification" && (
                    <p className={styles.authMenuLinkQuantity}>{notificationData?.length}</p>
                  )}
                </li>
              );
            })
          }
        </ul>
      </div>

      {children}
    </div>
  )
}

export default AuthLayout