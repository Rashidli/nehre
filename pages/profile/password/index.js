import React, {useEffect, useReducer} from 'react';
import requireAuth from '../../../helpers/requireAuth';
import {httpRequest} from '../../../helpers/utils';
import AuthLayout from '../../../layout/authLayout';
import styles from './styles.module.scss';
import {Formik, Form, Field} from 'formik';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { ChangePassword } from '../../../schemas';
import { errorToast, infoToast } from '../../../helpers/notification';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import useTranslate from '../../../hooks/useTranslate';

export const getServerSideProps = async context => {
  return requireAuth(context, async session => {
    try {
      const {data} = await httpRequest.get('/auth/profile');
      return {
        props: {
          data: data.data,
        },
      };
    } catch (error) {
      return {
        props: {
          shouldLogOut: true,
        },
      };
    }
  });
};

const reducer = (state, action) => {
  
  
  if (action.type === 'currentPassword') {
    return {
      ...state,
      currentPassword: !state.currentPassword,
    };
  } else if (action.type === 'password') {
    return {
      ...state,
      password: !state.password,
    };
  } else if (action.type === 'passwordConfirm') {
    return {
      ...state,
      passwordConfirm: !state.passwordConfirm,
    };
  }
};



const Password = ({ shouldLogOut }) => {
  const texts = useTranslate();

  const router = useRouter();
  const [showPasswords, dispatch] = useReducer(reducer, {
    currentPassword: false,
    password: false,
    passwordConfirm: false,
  });

  const handleSubmit = async data => {
    try {
      const reuqestData = {
        current_password: data.currentPassword,
        password: data.password,
        password_confirmation: data.passwordConfirm,
      };
      const response = await httpRequest.post(
        '/auth/password/change',
        reuqestData,
      );
      if ([200, 201].includes(response.status)) {

        signOut({redirect: false});
        router.push('/');
        infoToast(texts.reLoginInfo)
      }
    } catch (error) {
      
      errorToast(error.response.data.message);
    }
  };

  useEffect(() => {
      if (shouldLogOut) {
      signOut({redirect: false});
      router.push('/');
    }
  }, []);


  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{texts.changePasswordText}</h1>
      <Formik
        onSubmit={handleSubmit}
        validationSchema={ChangePassword}
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          currentPassword: '',
          password: '',
          passwordConfirm: '',
        }}>
        {({errors}) => (
          <Form className={styles.form}>
            <div className={styles.inputContainer}>
              <label htmlFor="currentPassword">{texts.correctPasswordText}</label>
              <div>
                <div className={styles.passInput}>
                  <Field
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.currentPassword ? 'text' : 'password'}
                    placeHolder={texts.correctPasswordText}
                  />

                  <button
                    type="button"
                    className={styles.showPass}
                    onClick={() => dispatch({type: 'currentPassword'})}>
                    {showPasswords.currentPassword ? (
                      <VisibilityOffIcon
                        color="gray"
                        className={styles.showPassword}
                      />
                    ) : (
                      <VisibilityIcon
                        color="gray"
                        className={styles.showPassword}
                      />
                    )}
                  </button>
                </div>
                <span>{errors.currentPassword}</span>
              </div>
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="password">{texts.newPasswordText}</label>
              <div>
                <div className={styles.passInput}>
                  <Field
                    id="password"
                    name="password"
                    type={showPasswords.password ? 'text' : 'password'}
                    placeHolder={texts.newPasswordText}
                  />

                  <button
                    type="button"
                    className={styles.showPass}
                    onClick={() => dispatch({type: 'password'})}>
                    {showPasswords.password ? (
                      <VisibilityOffIcon
                        color="gray"
                        className={styles.showPassword}
                      />
                    ) : (
                      <VisibilityIcon
                        color="gray"
                        className={styles.showPassword}
                      />
                    )}
                  </button>
                </div>
                <span>{errors.password}</span>
              </div>
            </div>

            <div>
              <div className={styles.inputContainer}>
                <label htmlFor="passwordConfirm">{texts.passwordRepeatText}</label>
                <div>
                  <div className={styles.passInput}>
                    <Field
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type={showPasswords.passwordConfirm ? 'text' : 'password'}
                      placeHolder={texts.passwordRepeatText}
                    />

                    <button
                      type="button"
                      className={styles.showPass}
                      onClick={() => dispatch({type: 'passwordConfirm'})}>
                      {showPasswords.passwordConfirm ? (
                        <VisibilityOffIcon
                          color="gray"
                          className={styles.showPassword}
                        />
                      ) : (
                        <VisibilityIcon
                          color="gray"
                          className={styles.showPassword}
                        />
                      )}
                    </button>
                  </div>
                  <span>{errors.passwordConfirm}</span>
                </div>
              </div>
            </div>

            <button className={styles.submit} type="submit">
              {texts.confirmText}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

Password.PageLayout = AuthLayout;

export default Password;
