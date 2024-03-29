import {signIn} from 'next-auth/react';
import React, {useReducer, useState} from 'react';
import {errorToast} from '../../../../../helpers/notification';
import {LoginSchema} from '../../../../../schemas';
import styles from './styles.module.scss';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ForgotPassword from '../ForgotPassword';
import {useRouter} from 'next/router';
import clsx from 'clsx';
import { httpRequest } from '../../../../../helpers/utils';
import useTranslate from '../../../../../hooks/useTranslate';

const reducer = (state, action) => {
  return {...state, ...action};
};

const EmailLogin = () => {
  const [userData, dispatch] = useReducer(reducer, {});
  const [showPassword, setShowPassword] = useState(false);
  const [passwordResetActive, setPasswordResetActive] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const texts = useTranslate();
  const handleSubmit = async e => {
    try {
      e.preventDefault();
      const data = {
        email: userData.email,
        password: userData.password,
      };
      const validatedData = await LoginSchema.validate(data);
      if (validatedData) {
        const {status, error} = await signIn('credentials', {
          redirect: false,
          password: validatedData.password,
          email: validatedData.email,
        });

        if (error) {
          errorToast(texts.authError);
        } else if ([200, 201].includes(status)) {
          delete router.query.login;
          router.push(
            {
              pathname: router.pathname,
              query: {...router.query},
            },
            undefined,
            {scroll: false,shallow:true},
          );
          
        }
      }
    } catch (error) {
      if (error.path) { 
        setError(error.path)
      }
      if (error.response?.data?.message) {
        errorToast(error.response.data.message);
      } else {
        errorToast(error.message);
      }
    }
  };

  return (
    <>
      {passwordResetActive ? (
        <ForgotPassword setPasswordResetActive={setPasswordResetActive} />
      ) : (
        <form onSubmit={handleSubmit} className={styles.loginContainer}>
          <h2 className={styles.loginHeader}>{texts.singInWithEmailText}</h2>
          <div className={styles.emailContainer}>
            <input
              id="email"
              name="email"
              onChange={e => {
                setError('')
                dispatch({email: e.target.value})}}
              className={clsx(styles.loginInputs, error === 'email' && styles.error)}
              type="text"
              placeholder=" "
            />
            <span className={styles.dynamicPlaceholder}>{texts.emailText}</span>
          </div>
          <div className={styles.passwordContainer}>
            <input
              id="password"
              name="password"
              onChange={e => {
                setError('')
                dispatch({password: e.target.value})}}
              className={clsx(styles.loginInputs, styles.passwordInp,error === 'password' && styles.error)}
              type={showPassword ? 'text' : 'password'}
              placeholder={texts.passwordText}
            />
            <button
              type="button"
              className={styles.showPass}
              onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <VisibilityOffIcon
                  color="gray"
                  className={styles.showPassword}
                />
              ) : (
                <VisibilityIcon color="gray" className={styles.showPassword} />
              )}
            </button>
          </div>
          <div className={styles.actionContainer}>
            <button className={styles.loginButton} type="submit">
              {texts.loginText}
            </button>
            <button
              type="button"
              onClick={() => setPasswordResetActive(true)}
              className={styles.forgotPassword}>
              {texts.forgotPasswordText}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default EmailLogin;
