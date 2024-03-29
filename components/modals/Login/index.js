import React, { useState } from 'react'
import styles from './styles.module.scss';
import PhoneLogin from './components/PhoneLogin';
import EmailLogin from './components/EmailLogin';
import Link from 'next/link';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import CloseIcon from '@mui/icons-material/Close';
import { httpRequest } from '../../../helpers/utils';
import Image from 'next/image';
import useTranslate from '../../../hooks/useTranslate';




const Login = () => {
    const [withPhone, setWithPhone] = useState(true);
    const router = useRouter();
    const texts = useTranslate();

  const handleGoogle = async ()=> { 
    try { 
      const response = await httpRequest.post('/auth/socialite/google');
      
    }
    catch (error) { 
      
    }
  }

   const handleClick = () => {
    delete router.query.login;
    router.push(
      {
        pathname: router.pathname,
        query: {...router.query},
      },
      undefined,
      {scroll: false,shallow:true},
    );
  };

    return (
      <div className={styles.loginContainer}>
        <button className={styles.closeButton} onClick={handleClick}>
          <CloseIcon  />
        </button>
        {withPhone ? (
          <PhoneLogin  />
        ) : (
          <EmailLogin />
        )}
          <button
            className={styles.emailOrPhone}
            type="button"
            onClick={() => setWithPhone(!withPhone)}>
            {withPhone ? texts.loginWithEmailText :texts.loginWithPhoneText}
          </button>
          {/* <div>

        <button
        >
          <Image width={48} height={48} src="/images/google.png" />
        </button>

        <button
        >
          <Image width={48} height={48} src="/images/facebook.png" />
        </button>
  </div> */}
 </div>
    );
}

export default Login