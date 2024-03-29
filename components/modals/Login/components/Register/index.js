import React, { memo,useEffect,useReducer, useState } from 'react';
import styles from './styles.module.scss';
import { errorToast, successToast } from '../../../../../helpers/notification';
import { httpRequest } from '../../../../../helpers/utils';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import OtpInput from 'react18-input-otp';
import { OtpSchema, RegisterSchema } from '../../../../../schemas';
import Countdown from 'react-countdown';
import clsx from 'clsx';
import Link from 'next/link';
import { Modal } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { getCookie, removeCookies, setCookie } from 'cookies-next';
import useTranslate from '../../../../../hooks/useTranslate';

const reducer = (state, action) => {
    return { ...state, ...action }
}

const Register = ({ phone, setRegisterVisible, expiryDate }) => {
    const [userData, dispatch] = useReducer(reducer, {
        phone,

    });
    const texts = useTranslate();
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);
    const [otp, setOtp] = useState();
    const [showOtp, setShowOtp] = useState(true);
    const [error, setError] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [sendAgain, setSendAgain] = useState(false);
    const checkOtp = async (e) => {
        e.preventDefault()

        try {
            const validatedOtp = await OtpSchema.validate({ otp });
            const response = await httpRequest.post('/auth/password/check-code', { code: validatedOtp.otp, phone: userData.phone });
            if ([200, 201].includes(response.status)) {
                setShowOtp(false)
                removeCookies('otpExpiryDate')
                setOtp("");
            }
        }
        catch (error) {
          setError('otp')
            errorToast(error.message)
        }
    }

    const togglePrivacyModal = () => {
        setShowModal(!showModal)
    }

    const handleRegisterSubmit = async (e) => {
        try {

            e.preventDefault();
            const validatedData = await RegisterSchema.validate(userData);
            if (validatedData) {
                const data = {
                    country_id: 1,
                    phone: userData.phone,
                    name: validatedData.name,
                    surname: validatedData.surname,
                    password: validatedData.password,
                    email: validatedData.email,
                    user_agreement: validatedData.userAgreement,
                    password_confirmation: validatedData.passwordRepeat,
                }
                const response = await httpRequest.post('/auth/register', data);
                if (response.status === 200) {
                    successToast(texts.registerSuccess)
                    setRegisterVisible(false)
                }
            }
        }

        catch (error) {
          if (error.path) { 
            setError(error.path)
          }
            if (error.response?.data?.message) {
                errorToast(error.response.data.message)
            }
            else {
                errorToast(error.message)
            }
        }
    }


    const handleChange = (value) => {
        try {
            setOtp(value)
        }
        catch (error) {
            errorToast(error.message)
        }
    }

    const renderer = ({ minutes, seconds }) => {
            return texts.verificationCodeSentText + minutes + ":" + seconds;
    };
    const getTime = () => {
        const dateString = getCookie("otpExpiryDate");
      const defaultValue = Date.now()+180000
      if (!dateString) {
        return defaultValue
      }
      let time = new Date(dateString).getTime();
      const value = time - Date.now()
      if(value < 0) { 
        return defaultValue
      }
      return Date.now() + value 
    }
    
    const sendOtp = async (e) => {
      try {
        e.preventDefault();
        const response = await httpRequest.post('/auth/password/send-code', { phone })
        if ([200, 201].includes(response.status)) {
          successToast(response.data.data.message)
          setCookie('otpExpiryDate',response.data.data.expired_at)
          setSendAgain(false)
        }
      }
      catch (error) {
        
      }
    }

   const handleCountdownEnd = () => {
      setSendAgain(true)
    }

    return (
      <>
      <form
        onSubmit={showOtp ? (sendAgain ? sendOtp :checkOtp) : handleRegisterSubmit}
        className={styles.registerContainer}>
        <div>
          <h2 className={styles.loginHeader}>{texts.registerText}</h2>
          {showOtp && (
            <p>
              {texts.verificationCodeSentToNumberText} +
              {userData.phone}
            </p>
          )}
        </div>
        {showOtp ? (
          <>
            <OtpInput
              containerStyle={styles.otpContainer}
              inputStyle={clsx(
                styles.otpInput,
                error === 'otp' && styles.error,
              )}
              isInputNum={true}
              value={otp}
              onChange={handleChange}
              numInputs={6}
              placeholder="●●●●●●"
            />
       <span className={styles.codeTime}>{ sendAgain  ? texts.verificationCodeExpiredText : <Countdown  renderer={renderer} date={getTime()} onComplete={handleCountdownEnd} /> }</span>  
          </>
        ) : (
          <>
            <div className={styles.inpContainer}>
              <input
                id="name"
                name="name"
                onChange={e => {
                  setError('');
                  dispatch({name: e.target.value});
                }}
                className={clsx(
                  styles.loginInputs,
                  error === 'name' && styles.error,
                )}
                type="text"
                placeholder=" "
              />
              <span className={styles.dynamicPlaceholder}>{texts.nameText}</span>
            </div>
            <div className={styles.inpContainer}>
              <input
                id="surname"
                name="surname"
                onChange={e => {
                  setError('');
                  dispatch({surname: e.target.value});
                }}
                className={clsx(
                  styles.loginInputs,
                  error === 'surname' && styles.error,
                )}
                type="text"
                placeholder=" "
              />
              <span className={styles.dynamicPlaceholder}>{texts.surnameText}</span>
            </div>
            <div className={styles.passwordContainer}>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                onChange={e => {
                  setError('');
                  dispatch({password: e.target.value});
                }}
                className={clsx(
                  styles.loginInputs,
                  styles.passwordInp,
                  error === 'password' && styles.error,
                )}
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
                  <VisibilityIcon
                    color="gray"
                    className={styles.showPassword}
                  />
                )}
              </button>
            </div>
            <div className={styles.passwordContainer}>
              <input
                id="passwordRepeat"
                name="passwordRepeat"
                type={showPasswordRepeat ? 'text' : 'password'}
                onChange={e => {
                  setError('');
                  dispatch({passwordRepeat: e.target.value});
                }}
                className={clsx(
                  styles.loginInputs,
                  styles.passwordInp,
                  error === 'passwordRepeat' && styles.error,
                )}
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
                  <VisibilityIcon
                    color="gray"
                    className={styles.showPassword}
                  />
                )}
              </button>
            </div>
            <div className={styles.inpContainer}>
              <input
                id="email"
                name="email"
                onChange={e => {
                  setError('');
                  dispatch({email: e.target.value});
                }}
                className={clsx(
                  styles.loginInputs,
                  error === 'email' && styles.error,
                )}
                type="text"
                placeholder=" "
              />
              <span className={styles.dynamicPlaceholder}>{texts.emailText}</span>
            </div>
            <label htmlFor="userAgreement" className={styles.userAgreement}>
              <input
                id="userAgreement"
                className={clsx(styles.userAgreementInput , error === 'userAgreement' && styles.error)}
                onChange={e => {
                  setError('');
                  dispatch({userAgreement: e.target.checked});
                }}
                type="checkbox"
              />
              <span>
              {texts.userAgreementTextPartOne}
            <button type='button' onClick={togglePrivacyModal} className={styles.privacyLink}>{texts.privacyPolicyText}</button>
          {texts.userAgreementTextPartTwo}
          </span>

            </label>
          </>
        )}
        <div className={styles.actionContainer}>
          <button className={styles.registerButton} type="submit">
            {showOtp ?(sendAgain ? 'Kodu yenidən göndər'  :  'Kodu təsdiqlə') : 'Qeydiyyatdan keç'}
          </button>
        </div>
      </form>
                <Modal
                    open={showModal}
                    onClose={togglePrivacyModal}
                    onRequestClose={togglePrivacyModal}
                >
                    <div className={styles.privacyModal}>
                      <div>
                        <h2 className={styles.privacyModalHeader}>{texts.privacyPolicyText}</h2>
                        <p className={styles.privacyModalText}>
                        Bu sənəddə “Nehrə MMC” dedikdə,  – “Nehrə” Məhdud Məsuliyyətli Cəmiyyəti nəzərdə tutulur. 
                            <br/><br/> 
                            Bu sənəddə “İstifadəçi” dedikdə, Veb-sayta həm üzv (müvafiq qaydada qeydiyyatdan keçmiş şəxslər) qismində, həm də üzv olmadan (qeydiyyatdan keçmədən) ziyarətçi kimi daxil olan şəxslər nəzərdə tutulurlar. 
                            <br/><br/> 
                            Biz, sizin Veb-sayta daxil olaraq ondan istifadə etdiyiniz zaman barənizdə Veb-sayta daxil edilmiş məlumatları necə topladığımızı, hansı qaydada istifadə və mühafizə etdiyimizi sizə aydın şəkildə izah edə bilməyimiz üçün bu sənədi tərtib və təsdiq etmişik. Bu sənədin hazırlanmasında əsas məqsəd, İstifadəçilərin Veb-saytdan güvənli şəkildə istifadə etmələrini təmin etmək, həmçinin Veb-saytda həyata keçirdikləri hər bir hərəkət zamanı daxil etdikləri fərdi məlumatların konfidensiallığına təminat verildiyinə onları əmin etməkdən ibarətdir. Odur ki, Veb-saytdan istifadə etməzdən əvvəl saytımızın “Məxfilik Siyasəti” ilə tanış olmağınızı tövsiyə edirik. 
                            <br/><br/> 
                            Biz, sizin Veb-sayta daxil olaraq ondan istifadə etdiyiniz zaman barənizdə Veb-sayta daxil edilmiş məlumatları necə topladığımızı, hansı qaydada istifadə və mühafizə etdiyimizi sizə aydın şəkildə izah edə bilməyimiz üçün bu sənədi tərtib və təsdiq etmişik. Bu sənədin hazırlanmasında əsas məqsəd, İstifadəçilərin Veb-saytdan güvənli şəkildə istifadə etmələrini təmin etmək, həmçinin Veb-saytda həyata keçirdikləri hər bir hərəkət zamanı daxil etdikləri fərdi məlumatların konfidensiallığına təminat verildiyinə onları əmin etməkdən ibarətdir. Odur ki, Veb-saytdan istifadə etməzdən əvvəl saytımızın “Məxfilik Siyasəti” ilə tanış olmağınızı tövsiyə edirik.
                            <br/>
                            <br/>
                            www.nehra.az veb-saytında İstifadəçi ilə Veb-sayt arasında fərdi məlumat mübadiləsi Azərbaycan Respublikasının Konstitusiyasında təsbit edilmiş əsas insan və vətəndaş hüquq və azadlıqlarına riayət edilməklə, qanunçuluq, , könüllülüyün məcburiliklə uzlaşdırılması prinsiplərinə uyğun həyata keçirilir. 
                            <br/>
                            <br/>
                            İstifadəçiyə aid fərdi məlumatlar onun özü tərəfindən könüllük prinsipinə riayət etməklə təqdim edildiyi andan mühafizə olunur. 
                            <br/>
                            <br/>
                            İstifadəçinin nəzərinə çatdırırıq ki, onun tərəfindən  təqdim edilmiş məlumatlar (adı, soyadı, atasının adı, doğulduğu tarix və yer, cinsi, vətəndaşlığı, telefon nömrəsi və elektron ünvanı, yaşadığı və olduğu yer, ixtisası və iş yeri, məşğul olduğu fəaliyyət növü, ailə vəziyyəti, şəkli və digər məlumatlar)  “Fərdi məlumatlar haqqında” Qanunun 5.2-ci maddəsinə uyğun olaraq tərəfimizdən qorunur və İstifadəçinin özünün yazılı razılığı olmadan və ya qanunla müəyyən edilmiş hallar (“Fərdi məlumatlar haqqında” Qanunun 13-cü maddəsində göstərilən hallar) istisna olmaqla, heç bir halda üçüncü şəxslərə, idarə və təşkilatlara ötürülürmür. 
                            <br/>
                            <br/>
                            Baş vermiş inzibati xətaları, cinayət əməllərini törətmiş şəxsləri ifşa etmək, belə hüquqazidd əməllərin nəticələrini aradan qaldıra bilmək məqsədilə, habelə gələcəkdə baş verə biləcək inzibati xətaların, cinayət əməllərinin qarşısını almaq, cəmiyyəti belə qəsdlərdən qorumaq məqsədilə Veb-sayta daxil edilmiş məlumatlar hüquq-mühafizə və məhkəmə orqanlarının təxirəsalınmaz tədbirləri zamanı və ya rəsmi sorğuları nəticəsində, Azərbaycan Respublikasının qanunvericiliyinin tələblərinə əməl edilməklə, İstifadəçinin razılığı alınmadan, belə orqanlara təqdim edilə bilər.
                            <br/>
                            <br/>
                            Nəzərinizə çatdırırıq ki, Veb-saytımızda müxtəlif digər veb-saytlara, internet platformalara keçidlər yerləşdirilə bilər. Belə keçidlərə daxil olmaqla, orada apardığınız yazışmaların, təqdim etdiyiniz məlumatların konfidensiallığının təmin edilməməsi ehtimalı hər zaman mövcuddur. Həmin veb-saytlarda, internet platformalarda təqdim etdiyiniz məlumatlarınızın, hərəkətlərinizin konfidensiallığına “Nehrə MMC” zəmanət vermir və cavabdehlik daşımır.
                            <br/>
                            <br/>
                            İstənilən halda siz fərdi məlumatlarınızı saytda qeyd etməmək hüququnu özünüzdə saxlayırsınız. Ancaq nəzərə alın ki, Veb-sayt vasitəsi ilə müəyyən hərəkətləri edə bilməyiniz üçün qeydiyyatdan keçməyiniz və qeydiyyatdan keçərkən özünüzə aid müxtəlif məlumatlarınızı daxil etməyiniz zəruridir. Əks halda Veb-saytda nəzərdə tutulmuş imkanlardan istifadə etməyiniz qeyri-mümkün olacaqdır.
                            <br/>
                            <br/>
                            Yuxarıda qeyd olunanlarla yanaşı, həmçinin onu da nəzərinizə çatdırırıq ki, “Nehrə MMC” gələcəkdə istənilən zaman bu “Məxfilik Siyasəti”nə birtərəfli qaydada dəyişiklik etmək hüququnu özündə saxlayır. Belə dəyişikliklərin edilməsi müxtəlif zərurətlərdən əmələ gələ bilər (məsələn: qanunvericiliyə edilmiş müxtəlif dəyişikliklərlə bağlı, istifadəçilərin Veb-saytdan istifadələrinin daha da asanlaşdırılması, müxtəlif kompaniyaların həyata keçirilməsi və s.). Lakin hər bir halda, İstifadəçiyə məxsus fərdi məlumatların konfidensiallığının təmin edilməsi prinsipinin aliliyi Bizim tərəfimizdən hər zaman rəhbər tutulacaqdır.
                            <br/>
                            <br/>
                            Bu sənədlə bağlı hər hansı iradınız, təklif və ya şikayətiniz olarsa, aşağıdakı vasitələrlə Bizimlə əlaqə saxlamağınızı xahiş edirik.
                            <br/>
                            <br/>
                                E-mail:  info@nehra.az;
                            <br/>
                            <br/>
                                Telefon: +994 12 310 00 65
                            <br/>
                            <br/>
                                Ünvan: Azərbaycan, Siyəzən rayon, Zarat kəndi
                            <br/>
                            <br/>
                              
                        </p>
                        <button className={styles.closeButton} onClick={togglePrivacyModal}><CloseIcon /></button>
                        </div>
                    </div>
                </Modal>
      </>

    );
}
export default Register