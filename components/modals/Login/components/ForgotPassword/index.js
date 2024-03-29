import React, {useCallback, useReducer, useState} from 'react';
import Countdown from 'react-countdown';
import ReactInputMask from 'react-input-mask';
import OtpInput from 'react18-input-otp';
import styles from './styles.module.scss';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {ForgotPassScheme, OtpSchema, PhoneSchema} from '../../../../../schemas';
import {errorToast, successToast} from '../../../../../helpers/notification';
import {httpRequest} from '../../../../../helpers/utils';
import useTranslate from '../../../../../hooks/useTranslate';

const reducer = (state, action) => {
  return {...state, ...action};
};

const ForgotPassword = ({setPasswordResetActive}) => {
  const [passwords, dispatch] = useReducer(reducer, {});
  const [showPassInputs, setShowPassInputs] = useState(false);
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const texts = useTranslate();
  const handleSubmit = e => {
    e.preventDefault();
    if (showPassInputs) {
      handlePasswordSubmit();
    } else if (showOtp) {
      handleOtpSubmit();
    } else {
      handlePhoneSubmit();
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const validatedPasswords = await ForgotPassScheme.validate(passwords);
      const data = {
        phone,
        code: otp,
        password: validatedPasswords.password,
        password_confirmation: validatedPasswords.passwordRepeat,
      };
      const response = await httpRequest.post('/auth/password/reset', data);
      if ([200, 201].includes(response.status)) {
        successToast(texts.orderUpdateSuccess);
        setPasswordResetActive(false);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        errorToast(error.response.data.message);
      } else {
        errorToast(error.message);
      }
    }
  };

  const handleOtpSubmit = () => {
    checkOtp();
  };

  const handleChange = value => {
    try {
      setOtp(value);
    } catch (error) {
      errorToast(error.message);
    }
  };

  const handlePhoneChange = e => {
    setPhone(e.target.value.replace(/\D/g, ''));
  };

  const handlePhoneSubmit = async e => {
    try {
      const validatedPhone = await PhoneSchema.validate({
        phone: phone.slice(3),
      });
      const phoneRegistered = await checkPhone(validatedPhone.phone);

      if (phoneRegistered) {
        await sendOtp(validatedPhone.phone);
        setShowOtp(true);

        return;
      } else {
        throw Error('Nömrə qeydiyyatdan keçməyib');
      }
    } catch (error) {
      if (error.response?.data?.message) {
        errorToast(error.response.data.message);
      } else {
        errorToast(error.message);
      }
    }
  };

  const sendOtp = async phone => {
    try {
      const response = await httpRequest.post('/auth/password/send-code', {
        phone,
      });

      if ([200, 201].includes(response.status)) {
        successToast(texts.smsSentSuccess);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        errorToast(error.response.data.message);
      } else {
        errorToast(error.message);
      }
    }
  };

  const checkOtp = async () => {
    try {
      const validatedOtp = await OtpSchema.validate({otp});
      const response = await httpRequest.post('/auth/password/check-code', {
        code: validatedOtp.otp,
        phone,
      });
      if ([200, 201].includes(response.status)) {
        setShowOtp(false);
        setShowPassInputs(true);
      }
    } catch (error) {
      errorToast(error.message);
    }
  };

  const checkPhone = useCallback(async phone => {
    try {

      const response = await httpRequest.post('/auth/check', {phone});
      const {result} = response.data;

      if ([200, 201].includes(response.status)) {
        setShowOtp(true);
        return true;
      }
    } catch (error) {

      if (error.response?.data?.message) {
        errorToast(error.response.data.message);
      } else {
        errorToast(error.message);
      }
    }
  }, []);

  const renderer = ({minutes, seconds, completed}) => {
    if (completed) {
      return <p className={styles.codeTimeOut}>{texts.codeTimeoutText}</p>;
    } else {
      return (
        <span className={styles.codeTime}>
          {texts.verificationCodeSentText} {minutes}:{seconds}{' '}
        </span>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.forgotContainer}>
      <h2 className={styles.forgotTitle}>{texts.forgotPasswordText}</h2>
      {!(showOtp || showPassInputs) && (
        <div className={styles.phoneContainer}>
          <label htmlFor="phone" className={styles.phoneLabel}>
            {texts.phoneText}
          </label>
          <ReactInputMask
            id="phone"
            type={'tel'}
            alt=""
            mask="+\9\94 (99) 999 99 99"
            placeholder="+994 (--) --- -- --"
            onChange={handlePhoneChange}
            className={styles.phoneInput}
          />
        </div>
      )}
      {showOtp && (
        <>
          <OtpInput
            containerStyle={styles.otpContainer}
            inputStyle={styles.otpInput}
            isInputNum={true}
            value={otp}
            onChange={handleChange}
            numInputs={6}
          />
          <Countdown renderer={renderer} date={Date.now() + 180000} />
        </>
      )}
      {showPassInputs && (
        <div className={styles.passContainer}>
          <div className={styles.passwordContainer}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              onChange={e => dispatch({password: e.target.value})}
              className={styles.loginInputs}
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
          <div className={styles.passwordContainer}>
            <input
              id="passwordRepeat"
              type={showPasswordRepeat ? 'text' : 'password'}
              onChange={e => dispatch({passwordRepeat: e.target.value})}
              className={styles.loginInputs}
              placeholder={texts.passwordRepeatPlaceHolderText}
              
            />
            <button
              type="button"
              className={styles.showPass}
              onClick={() => setShowPasswordRepeat(!showPasswordRepeat)}>
              {showPasswordRepeat ? (
                <VisibilityOffIcon
                  color="gray"
                  className={styles.showPassword}
                />
              ) : (
                <VisibilityIcon color="gray" className={styles.showPassword} />
              )}
            </button>
          </div>
        </div>
      )}
      <div className={styles.actionContainer}>
        <button className={styles.submit} type="submit">
          {texts.confirmText}
        </button>
        <button
          type="button"
          onClick={() => setPasswordResetActive(false)}
          className={styles.back}>
          {texts.backText}
        </button>
      </div>
    </form>
  );
};

export default ForgotPassword;
