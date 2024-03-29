import React from 'react'
import styles from './styles.module.scss'
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import FavoriteIcon from '@mui/icons-material/Favorite';


const DropDown = () => {
    const {status} = useSession();
    const router = useRouter()
    return (
      <div className={styles.dropContainer}>
        <Link
          href={
            status === 'authenticated'
              ? '/profile/favorites'
              : {
                  pathname: router.pathname,
                  query: {...router.query, login: true},
                }
          }>
          <a className={styles.button}>
            <FavoriteIcon />
          </a>
        </Link>
      </div>
    );
}




export default DropDown;




