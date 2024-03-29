import { signIn } from 'next-auth/react'
import React, { useCallback, useState } from 'react'
import ReactInputMask from 'react-input-mask'
import { errorToast, successToast } from '../../../../../helpers/notification'
import { httpRequest } from '../../../../../helpers/utils'
import { PhoneLoginScheme, PhoneSchema } from '../../../../../schemas'
import styles from './styles.module.scss'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Register from '../Register'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { setConfig } from 'next/config'
import { setCookie } from 'cookies-next'
import useTranslate from '../../../../../hooks/useTranslate'



const PhoneLogin = () => {
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [passInputVisible, setPassInputVisible] = useState(false);
  const [registerVisible, setRegisterVisible] = useState(false)
  const [showPhonePassword, setShowPhonePassword] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const texts  = useTranslate();
  const handlePhoneChange = (e) => {
    setPhone(e.target.value.replace(/\D/g, ''));
  }



  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const validatedPhone = await PhoneSchema.validate({ phone: phone.slice(3) });
      const phoneRegistered = await checkPhone(validatedPhone.phone)
      if (phoneRegistered) {
        setPassInputVisible(true)
        return
      }
      else {
        await sendOtp(validatedPhone.phone)
        return
      }
    }
    catch (error) {
      if (error.response?.data?.message) {
        errorToast(error.response.data.message)
      }
      else {
        errorToast(error.message)
      }
    }
  }

  const checkPhone = useCallback(async (phone) => {
    try {
      const response = await httpRequest.post('/auth/check', { phone });
      const { result } = response.data;


      if (result.message === "success") {
        return true;
      }
    }
    catch (error) {
      if (error.response.status === 404) {
        return
      }
      if (error.response?.data?.message) {
        errorToast(error.response.data.message)
      }
      else {
        errorToast(error.message)
      }
    }
  }, [])

  const sendOtp = async (phone) => {
    try {
      const response = await httpRequest.post('/auth/password/send-code', { phone })
      if ([200, 201].includes(response.status)) {
        setRegisterVisible(true)
        successToast(response.data.data.message)
        setCookie('otpExpiryDate',response.data.data.expired_at)
      }
    }
    catch (error) {
      if (error.response?.data?.message) {
        if(error.response.data.errors.phone)
        setRegisterVisible(true)
      }
      else {
        errorToast(error.message)
      }
    }
  }

  const handlePassSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        phone: phone?.slice(3),
        password: password,
      }
      const validatedData = await PhoneLoginScheme.validate(data);
      const { status } = await signIn('credentials', {
        redirect: false,
        ...validatedData,
      }
      )
      



      if ([200, 201].includes(status)) {
        successToast(texts.loginSuccess)
        // router.push("/profile")
        delete router.query.login;
        router.push(
          {
            pathname: router.pathname,
            query: { ...router.query },
          },
          undefined,
          { scroll: false, shallow: true },
        );
      } else {
        errorToast(texts.phoneAuthError)
      }

    }
    catch (error) {

      setError(true);
      errorToast(error.message)
    }
  }

  return (
    <>
      {!registerVisible && (
        <form autoComplete='on'
          onSubmit={passInputVisible ? handlePassSubmit : handlePhoneSubmit}
          className={styles.loginContainer}>
          <div className={styles.headerContainer}>
            <h2 className={styles.loginHeader}>{texts.loginText}</h2>
            <p>
              {texts.mustRegisterText}
            </p>
          </div>
          {!passInputVisible && (
            <div>
              <label htmlFor="phone" className={styles.phoneLabel}>
                {texts.phoneText}
              </label>
              <div>
                <ReactInputMask
                  id="phone"
                  name='phone'
                  type={'tel'}
                  alt=""
                  mask="+\9\94 (99) 999 99 99"
                  // placeholder="+994 (--) --- -- --"
                  onChange={handlePhoneChange}
                  className={styles.phoneInput}
                />
              </div>
            </div>
          )}
          {passInputVisible && (
            <div className={styles.passwordContainer}>
              <input
                id="password"
                name='password'
                onChange={e => {
                  setError(false);
                  setPassword(e.target.value);
                }}
                className={clsx(
                  styles.loginInputs,
                  error && styles.erroredInput,
                )}
                type={showPhonePassword ? 'text' : 'password'}
                placeholder={texts.passwordText}

              />
              <button
                type="button"
                className={styles.showPass}
                onClick={() => setShowPhonePassword(!showPhonePassword)}>
                {showPhonePassword ? (
                  <VisibilityOffIcon
                    color="gray"
                    className={styles.showPhonePassword}
                  />
                ) : (
                  <VisibilityIcon
                    color="gray"
                    className={styles.showPassword}
                  />
                )}
              </button>
            </div>
          )}
          <button className={styles.loginButton} type="submit">
            {passInputVisible ? texts.continue : texts.loginText}
          </button>
        </form>
      )}
      {registerVisible && (
        <Register phone={phone} setRegisterVisible={setRegisterVisible} />
      )}
    </>
  );
}

export default PhoneLogin