import React, { useCallback, useEffect, useReducer, useState } from 'react';
import requireAuth from '../../helpers/requireAuth';
import { httpRequest } from '../../helpers/utils';
import AuthLayout from '../../layout/authLayout';
import styles from './styles.module.scss';
import { Formik, Form, Field,  } from 'formik';
import Image from 'next/image';
import { OtpSchema, UpdateProfile } from '../../schemas';
import moment from 'moment';
import ReactInputMask from 'react-input-mask';
import { errorToast, infoToast, successToast } from '../../helpers/notification';
import { Modal, responsiveFontSizes, TextField } from '@mui/material';
import OtpInput from 'react18-input-otp';
import Countdown from 'react-countdown';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { signOut, useSession } from 'next-auth/react';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useRouter } from 'next/router';
import {connect} from 'react-redux';
import useTranslate from '../../hooks/useTranslate';
export const getServerSideProps = async context => {
  return requireAuth(context, async session => {
    try {
      const { data } = await httpRequest.get('/auth/profile');
      return {
        props: {
          data: data.data,
        },
      };
    }
    catch (error) {
      return {
        props: {
          shouldLogOut: true,
        }
      };
    }
  });

};

const reducer = (state, action) => {
  return { ...state, ...action };
}



const Profile = ({ data = {}, shouldLogOut,selectedCurrency }) => {
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [image, setImage] = useState(null);
  const [updatedData, dispatch] = useReducer(reducer, data);
  const [balanceModal, setBalanceModal] = useState(false);
  const [balanceValue, setBalanceValue] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);
  const session = useSession();
  const { avatar, balance, birthday, fullName, email, name, phone, surname } =
    data;

  const router = useRouter();
  const texts = useTranslate();

  useEffect(() => {
    if (shouldLogOut) {
      signOut({ redirect: false });
      router.push('/');
    }
  }, [])

  useEffect(() => {
    getBalanceData();
  }, [])

  const getBalanceData = async () => {
    try {
      const response = await httpRequest.get("/profile/balance");
      setCurrentBalance(response.data.data);
    }
    catch (error) {
      
    }
  }

  const handlePhoneChange = ({ e, setFieldValue, name }) => {
    const phoneNumber = e.target.value.replace(/\D/g, '').slice(3);
    setFieldValue(name, phoneNumber);
  };

  const handleDateChange = ({ e, setFieldValue, name }) => {
    const date = moment(e).format('YYYY-MM-DD');
    setFieldValue(name, date);
  };

  const handleChange = useCallback(({ e, setFieldValue, name }) => {
    if (e.target.files.length) {
      setImage(URL.createObjectURL(e.target.files[0]));

      const formData = new FormData();
      formData.append('avatar', e.target.files[0]);
      setFieldValue(name, formData);
    }
  }, [])

  const postData = useCallback(async (data) => {
    try {
      const avatar = data.avatar;
      avatar && delete data.avatar;

      const response = await httpRequest.put('/auth/profile', data);
      if (avatar) {
        await httpRequest.post('/auth/profile/upload', avatar, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      if ([200, 201].includes(response.data.result.code)) {
        successToast(texts.infoUpdateSuccess);
      }
    }
    catch (error) {

    }
  }, [])


  const handleSubmit = useCallback(async (data) => {
    try {
      if (!phone.includes(data.phone)) {
        setShowOtpModal(true);
        dispatch(data)
        const response = await httpRequest.post('/auth/password/send-code', {
          phone: data.phone,
        });
        if ([200, 201].includes(response.status)) {
          infoToast(
            texts.codeInfo
          );
        }
        return;
      }
      postData(data);
    }
    catch (error) {

    }
  }, [postData, phone])

  const modalToggle = () => setShowOtpModal(!open);

  const handleOtpChange = value => {
    try {
      setOtp(value);
    } catch (error) {
      errorToast(error.message);
    }
  };

  const checkOtp = useCallback(async () => {
    try {
      const validatedOtp = await OtpSchema.validate({ otp });
      const response = await httpRequest.post('/auth/password/check-code', { code: validatedOtp.otp, phone: updatedData.phone });
      if ([200, 201].includes(response.status)) {
        setShowOtpModal(false)
        postData(updatedData);
        setOtp("");
      }
    }
    catch (error) {
      errorToast(error.message)
    }
  }, [otp, postData, updatedData])


  const renderer = ({ minutes, seconds, completed }) => {
    if (completed) {
      <p className={styles.codeTimeOut}>{texts.codeTimeoutText}</p>;
    } else {
      return (
        <span className={styles.codeTime}>
          {texts.verificationCodeSentText} {minutes}:{seconds}
        </span>
      );
    }
  };

  if (shouldLogOut) {
    return <div></div>
  }

  const incrementBalance = async () => {
    try {
      const response = await httpRequest.post("/auth/profile/balance/increment", {amount: balanceValue}, {
        headers: {
          "Authorization": `Bearer ${session.data.user.accessToken}`
        }
      });
      // 
      router.push(response?.data?.data?.redirect)
    }
    catch (error) {
      
    }
  }

  const closeBalanceModal = () => {
    setBalanceModal(false);
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{texts.myInfoText}</h1>
      <Formik
        enableReinitialize={true}
        validateOnChange={false}
        onSubmit={handleSubmit}
        validationSchema={UpdateProfile}
        initialValues={{
          balance,
          birthday,
          fullName,
          email,
          name,
          phone: phone.slice(1),
          surname,
        }}>
        {({ errors, setFieldValue }) => (
          <Form className={styles.form}>
            <div className={styles.inputContainer}>
              <label htmlFor="name">{texts.nameText}*</label>
              <Field id="name" name="name" className={styles.customFormInput} />
              <span>{errors.name}</span>
            </div>
            <div className={styles.inputContainer}>
              <label htmlFor="surname">{texts.surnameText}*</label>
              <Field id="surname" name="surname" className={styles.customFormInput}  />
              <span>{errors.surname}</span>
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="email">{texts.emailText}*</label>
              <Field id="email" name="email" type="text" className={styles.customFormInput}  />
              <span>{errors.email}</span>
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="phone">{texts.numberText}*</label>
              <Field id="phone" name="phone" className={styles.customFormInput} >
                {({ field }) => (
                  <ReactInputMask
                    {...field}
                    type="tel"
                    mask="+\9\94 (99) 999 99 99"
                    placeholder="+994 (--) --- -- --"
                    onChange={e =>
                      handlePhoneChange({ e, setFieldValue, name: field.name })
                    }
                    className={styles.customFormInput}
                  />
                )}
              </Field>
              <span>{errors.phone}</span>
            </div>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <div className={styles.inputContainer}>
                <label htmlFor="birthday">{texts.birthDataText}</label>
                <Field
                  id="birthday"
                  name="birthday"
                >
                  {({ field: { name, value } }) => {
                    return (
                      <DatePicker
                        value={value}
                        minDate={'02-01-1920'}
                        maxDate={new Date()}
                        inputFormat="DD/MM/YYYY"
                        onChange={(e) => handleDateChange({ e, setFieldValue, name })}
                        renderInput={params => <TextField {...params} />}
                      />
                    )
                  }}
                </Field>
                <span>{errors.birthday}</span>
              </div>
            </LocalizationProvider>

            <div className={styles.inputContainer}>
              <label htmlFor="addBalance">{texts.balanceText}</label>
              <div className={styles.balanceContainer}>
                <p><span>{currentBalance.balance ?? 0}</span> {selectedCurrency}</p>
                <button 
                  className={styles.addBalanceButton}
                  onClick={() => setBalanceModal(true)}
                >
                    <AddCircleIcon />
                    <span>{texts.topUpBalanceText}</span>
                </button>
              </div>
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="avatar">{texts.imageText}</label>
              <div className={styles.avatarContainer}>
                <input
                  accept="image/png, 
                          image/jpeg, 
                          image/svg, 
                          image/jpg "
                  type="file"
                  id="avatar"
                  onChange={e =>
                    handleChange({ e, setFieldValue, name: 'avatar' })
                  }
                />
                <div className={styles.avatarImageContainer}>
                  <Image
                    src={image ? image : avatar}
                    layout={'fill'}
                    alt="profile image"
                  />
                </div>
              </div>
            </div>
            <button className={styles.submit} type="submit">
              {texts.confirmText}
            </button>
          </Form>
        )}
      </Formik>
      <Modal open={showOtpModal} onClose={modalToggle}>
        <div className={styles.modalContainer}>
          <button className={styles.closeButton} onClick={modalToggle}>
            <CloseIcon />
          </button>
          <h1 className={styles.moodalHeading}>{texts.enterVerificationCodeText}</h1>
          <OtpInput
            containerStyle={styles.otpContainer}
            inputStyle={styles.otpInput}
            isInputNum={true}
            value={otp}
            onChange={handleOtpChange}
            numInputs={6}
            separator={<span>|</span>}
          />
          <Countdown renderer={renderer} date={Date.now() + 180000} />
          <button className={styles.submitOtp} onClick={checkOtp}>
            {texts.continue}
          </button>
        </div>
      </Modal>


      <Modal open={balanceModal} onClose={closeBalanceModal}>
        <div className={styles.balanceModalContainer}>
          <h3>{texts.dontTopUpBalanceText}</h3>
          <div>
            <input type='text' value={balanceValue} onChange={(e) => setBalanceValue(e.target.value)}  />
            <button onClick={() => incrementBalance()}>{texts.sendText}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

Profile.PageLayout = AuthLayout;


const mapState = (state) => {
  return {
    selectedCurrency: state.globalData.selectedCurrency

  };
};
export default connect(mapState)(Profile);