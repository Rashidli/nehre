import {Formik, input, Form, ErrorMessage, useinput} from 'formik';
import * as Yup from 'yup';
import FileUploader from '../FileUploader.js/FileUploader';
import {useRouter} from 'next/router';
import {useState, useCallback, useEffect, useRef} from 'react';
import styles from './styles.module.scss';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import {httpRequest} from '../../helpers/utils';
import { errorToast, successToast } from '../../helpers/notification';
import useTranslate from '../../hooks/useTranslate';

const validationSchema  = Yup.object({
  'manufacturer[phone]': Yup.string()
    .required('Məlumatı daxil edin!')
    .length(9, 'Telefon nömrəsi 9 rəqəmli olmalıdır!'),
    'manufacturer[iframe_src]': Yup.string(),
  'manufacturer[tin]': Yup.string()
    .required('Məlumatı daxil edin!')
    .length(10, 'VÖEN nömrəsi 10 rəqəmli olmalıdır!'),
  'manufacturer[plastic_card]': Yup.string().when('manufacturer[payment_type]', {
    is: value => value === 'manufacturer[plastic_card]',
    then: Yup.string()
      .required('Məlumatı daxil edin!')
      .length(16, 'Kartın şifrəsi 16 rəqəmli olmalıdır!'),
  }),
  'manufacturer[village]': Yup.string().required('Məlumatı daxil edin!'),
  'manufacturer[city]': Yup.string().required('Məlumatı daxil edin!'),
  'manufacturer[address]': Yup.string().required('Məlumatı daxil edin!'),
  phone: Yup.string()
    .required('Məlumatı daxil edin!')
    .length(9, 'Telefon nömrəsi 9 rəqəmli olmalıdır!'),
  email: Yup.string()
    .required('E-poçt daxil edin')
    .email('Düzgün e-poçt daxil edilməyib'),
  id_card_fin: Yup.string().length(7, 'FIN kod düzgün qeyd olunmayıb!'),
  id_card_no: Yup.string().required('Məlumatı daxil edin!'),
  surname: Yup.string().required('Məlumatı daxil edin!'),
  name: Yup.string().required('Məlumatı daxil edin!'),
  })



const FooterAnket = () => {
  const router = useRouter();
  const [imgName, setImgName] = useState('');
  const [error, setError]  = useState({});
  const texts = useTranslate();
  const handleClick = () => {
    delete router.query['vendor-form'];
    router.push(
      {
        pathname: router.pathname,
        query: {...router.query},
      },
      undefined,
      {scroll: false, shallow: true},
    );
  };

  

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
     const values = new FormData(e.target)
    const plainFormData = {};
     for (const [key, value] of values.entries()) {
      plainFormData[key] = value;
    }
    const validated=await  validationSchema.validate(plainFormData)
   if(validated) { 
      // const response = await httpRequest.post('/vendors', values, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data',
      //   },
      // });

  const response = await fetch('https://nehre.codio.az/api/v1/vendors', {
        Method: 'POST',
        headers: {
          Accept: 'application.json',
          'Content-Type': 'application/json',
          token: 'SeCReTNkkGeDhbVRnzgQRG6HfSVzhCyjPpRqSrYfF2LFBMueryTdFR8',
        },
        Body: values,
        Cache: 'default'
      })
   
   }


   successToast(texts.anketSuccess)
    } catch (error) {
      if(error?.path) { 
        setError({path: error.path, message: error.message})
      }
    errorToast(texts.anketError)
    }

  };

  return (
    <Modal
      open={true}
      sx={{
        maxWidth: '90%',
        margin: '0 auto',
      }}
      onClose={handleClick}>
          <div className={styles.container}>
            <div className={styles.anket}>
              <div className={styles.anket__modalHeader}>
                <button
                  className={styles.anket__closeButton}
                  onClick={handleClick}>
                  <CloseIcon />
                </button>
                <div className={styles.anket__modalTitle}>
                  <div className={styles.anket__headerContainer}>
                    <h1 className={styles.anket__header}>{texts.vendorAnketText}</h1>
                    <p className={styles.anket__description}>
                     {texts.vendorNoteText}
                    </p>
                  </div>
                </div>
              </div>
              <form 
               onSubmit={handleSubmit}>
                <div className={styles.anket__content}>
                  <div className={styles.anket__body}>
                    <div className={styles.anket_margin}>
                      <p className={styles.anket__sectionTitle}>{texts.vendorText}</p>
                      <div className={styles.anket__userInfo}>
                        <label
                          htmlFor="name"
                          className={`${styles.anket__label} ${styles.anket__label_width}`}>
                          <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder=" "
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                          />
                          {error.path == "name" &&<p
                            className={styles.anket__error}
                            name="name"
                            
                          >{error.message}</p>}
                          <span className={styles.dynamicPlaceholder}>{texts.nameOfText}</span>
                        </label>
                        <label
                          htmlFor="surname"
                          className={`${styles.anket__label} ${styles.anket__label_width}`}>
                          <input
                            id="surname"
                            type="text"
                            placeholder=" "
                            name="surname"
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                          />
                          {error.path == "surname" &&<p
                            className={styles.anket__error}
                            name="surname"
                            
                          >{error.message}</p>}
                          <span className={styles.dynamicPlaceholder}>
                            {texts.surnameOfText}
                          </span>
                        </label>
                        <label
                          htmlFor="patronymic"
                          className={`${styles.anket__label} ${styles.anket__label_width}`}>
                          <input
                            id="patronymic"
                            type="text"
                            placeholder=" "
                            name="father_name"
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                          />
                          {error.path == "father_name" &&<p
                            className={styles.anket__error}
                            name="father_name"
                            
                          >{error.message}</p>}
                          <span className={styles.dynamicPlaceholder}>
                            {texts.fatherNameText}
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className={styles.anket_margin}>
                      <p className={styles.anket__sectionTitle}>
                        {texts.idDetailsText}
                      </p>
                      <div className={styles.anket__userInfo}>
                        <label
                          htmlFor="seriaNumber"
                          className={`${styles.anket__label} ${styles.anket__label_width}`}>
                          <input
                            id="seriaNumber"
                            type="text"
                            placeholder=" "
                            name="id_card_no"
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                          />
                          {error.path == "id_card_no" &&<p
                            className={styles.anket__error}
                            name="id_card_no"
                            
                          >{error.message}</p>}
                          <span className={styles.dynamicPlaceholder}>
                            {texts.idNumberText}
                          </span>
                        </label>
                        <label
                          htmlFor="finCode"
                          className={`${styles.anket__label} ${styles.anket__label_width}`}>
                          <input
                            id="finCode"
                            type="text"
                            placeholder=" "
                            name="id_card_fin"
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                          />
                          {error.path == "id_card_fin" &&<p
                            className={styles.anket__error}
                            name="id_card_fin"
                            
                          >{error.message}</p>}
                          <span className={styles.dynamicPlaceholder}>
                            {texts.finCodeText}
                          </span>
                        </label>
                      </div>
                    </div>
                    <div
                      className={`${styles.anket_flex} ${styles.anket_margin}`}>
                      <div className={styles.anket_width}>
                        <p
                          htmlFor="sessionDate"
                          className={styles.anket__sectionTitle}>
                          {texts.birthDataText}
                        </p>
                        <input
                          type="date"
                          id="sessionDate"
                          name="birthday"
                          className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                        />
                      </div>
                      <div className={styles.anket_width}>
                        <p className={styles.anket__sectionTitle}>{texts.genderText}</p>
                        <div className={styles.anket__radioInputContainer}>
                          <div>
                            <input
                              id="male"
                              type="radio"
                              name="gender"
                              value="male"
                              checked
                            />
                            <label htmlFor="male">{texts.maleText}</label>
                          </div>
                          <div>
                            <input
                              id="female"
                              type="radio"
                              name="gender"
                              value="female"
                            />
                            <label htmlFor="female">{texts.femaleText}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${styles.anket_flex} ${styles.anket_margin}`}>
                      <div
                        className={`${styles.anket__address} ${styles.anket_width}`}>
                        <p className={styles.anket__sectionTitle}>{texts.addressText}</p>
                        <div className={styles.anket__addressContent}>
                          <label
                            htmlFor="homeAddress"
                            className={`${styles.anket__label}`}>
                            <input
                              id="homeAddress"
                              type="text"
                              placeholder=" "
                              name="manufacturer[address]"
                              className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                            />
                            {error.path == "manufacturer[address]" &&<p
                              className={styles.anket__error}
                              name="manufacturer[address]"
                              
                            >{error.message}</p>}
                            <span className={styles.dynamicPlaceholder}>
                              {texts.homeAddressText}
                            </span>
                          </label>
                          <label
                            htmlFor="homeAddress2"
                            className={`${styles.anket__label}`}>
                            <input
                              id="homeAddress2"
                              name="manufacturer[secondary_address]"
                              type="text"
                              placeholder=" "
                              className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                            />
                            <span className={styles.dynamicPlaceholder}>
                              {texts.homeAddressText} 2
                            </span>
                          </label>
                          <div
                            className={`${styles.anket_flex} ${styles.anket__address_gap}`}>
                            <label
                              htmlFor="city"
                              className={`${styles.anket__label} ${styles.anket__label_width}`}>
                              <input
                                id="city"
                                type="text"
                                placeholder=" "
                                name="manufacturer[city]"
                                className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                              />
                              {error.path == "manufacturer[city]" &&<p
                                className={styles.anket__error}
                                name="manufacturer[city]"
                                
                              >{error.message}</p>}
                              <span className={styles.dynamicPlaceholder}>
                               {texts.cityOrRegion}
                              </span>
                            </label>
                            <label
                              htmlFor="village"
                              className={`${styles.anket__label} ${styles.anket__label_width}`}>
                              <input
                                id="village"
                                type="text"
                                placeholder=" "
                                name="manufacturer[village]"
                                className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                              />
                              {error.path == "manufacturer[village]" &&<p
                                className={styles.anket__error}
                                name="manufacturer[village]"
                                
                              >{error.message}</p>}
                              <span className={styles.dynamicPlaceholder}>
                                {texts.villageText}
                              </span>
                            </label>
                          </div>
                          <label
                            htmlFor="postCode"
                            className={`${styles.anket__label}`}>
                            <input
                              id="postCode"
                              name="manufacturer[zip_code]"
                              type="text"
                              placeholder=" "
                              className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                            />
                            <span className={styles.dynamicPlaceholder}>
                              {texts.zipCodeText}
                            </span>
                          </label>
                        </div>
                      </div>
                      <div className={styles.anket_width}>
                        <p className={styles.anket__sectionTitle}>
                          {texts.juridicalStatusText}
                        </p>
                        <div className={styles.anket__radioInputContainer}>
                          <div>
                            <input
                              id="villa"
                              type="radio"
                              name="manufacturer[manufacturer_type_id]"
                              value="1"
                              checked
                            />
                            <label htmlFor="vStatus">{texts.villagerText}</label>
                          </div>
                          <div>
                            <input
                              id="individualStatus"
                              type="radio"
                              name="manufacturer[manufacturer_type_id]"
                              value="2"
                            />
                            <label htmlFor="individualStatus">
                              {texts.physicalPersonText}
                            </label>
                          </div>
                          <div>
                            <input
                              id="entityStatus"
                              type="radio"
                              name="manufacturer[manufacturer_type_id]"
                              value="3"
                            />
                            <label htmlFor="entityStatus">{texts.juridicalPersonText}</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`${styles.anket_flex} ${styles.anket_margin}`}>
                      <div className={styles.anket_width}>
                        <p className={styles.anket__sectionTitle}>
                          {texts.calculationTypeText}
                        </p>
                        <div className={styles.anket_width}>
                          <div className={styles.anket__radioInputContainer}>
                            <div>
                              <input
                                id="cash"
                                type="radio"
                                name="manufacturer[payment_type]"
                                value="cash"
                                checked
                              />
                              <label htmlFor="cash">{texts.cashText}</label>
                            </div>
                            <div>
                              <input
                                id="card"
                                type="radio"
                                name="manufacturer[payment_type]"
                                value="plastic_card"
                              />
                              <label htmlFor="plasticCart">{texts.cardText}</label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={styles.anket_width}>
                        <p className={styles.anket__sectionTitle}>
                          {texts.plasticCardText}
                        </p>
                        <label
                          htmlFor="plasticCardNumber"
                          className={styles.anket__label}>
                          <input
                            id="plasticCardNumber"
                            name="manufacturer[plastic_card]"
                            type="text"
                            placeholder=" "
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                          />
                          {error.path == "manufacturer[plastic_card]" &&<p
                            className={styles.anket__error}
                            name="manufacturer[plastic_card]"
                            
                          >{error.message}</p>}
                          {/* <span className={styles.dynamicPlaceholder}>Bank kartı (16 rəqəmli şifrə)</span> */}
                        </label>
                      </div>
                    </div>
                    <div
                      className={`${styles.anket_flex} ${styles.anket_margin}`}>
                      <div className={styles.anket_width}>
                        <p className={styles.anket__sectionTitle}>{texts.emailText}</p>
                        <label htmlFor="email" className={styles.anket__label}>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="example@example.com"
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                          />
                          {error.path == "email" &&<p
                            className={styles.anket__error}
                            name="email"
                            
                          >{error.message}</p>}
                        </label>
                      </div>
                      <div className={styles.anket_width}>
                        <p className={styles.anket__sectionTitle}>VÖEN</p>
                        <label htmlFor="voen" className={styles.anket__label}>
                          <input
                            id="voen"
                            name="manufacturer[tin]"
                            type="text"
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                          />
                          {error.path == "manufacturer[tin]" &&<p
                            className={styles.anket__error}
                            name="manufacturer[tin]"
                            
                          >{error.message}</p>}
                        </label>
                      </div>
                    </div>
                    <div
                      className={`${styles.anket_flex} ${styles.anket_margin}`}>
                      <div className={styles.anket_width}>
                        <p className={styles.anket__sectionTitle}>
                          {texts.contactNumberText}
                        </p>
                        <label
                          htmlFor="phoneNumber"
                          className={`${styles.anket__label} ${styles.anket__label_position}`}>
                          <span
                            className={`${styles.anket__beginningNumber} ${styles.anket__beginningNumber_position}`}>
                            +994
                          </span>
                          <input
                            id="phoneNumber"
                            name="phone"
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width} ${styles.anket__input_phone}`}
                          />
                          {error.path == "phone" &&<p
                            className={styles.anket__error}
                            name="phone"
                            
                          >{error.message}</p>}
                        </label>
                      </div>
                      <div className={styles.anket_width}>
                        <p className={styles.anket__sectionTitle}>
                          {texts.whatsappNumberText}
                        </p>
                        <label
                          htmlFor="whatsapp"
                          className={`${styles.anket__label} ${styles.anket__label_position}`}>
                          <span
                            className={`${styles.anket__beginningNumber} ${styles.anket__beginningNumber_position}`}>
                            +994
                          </span>
                          <input
                            id="whatsapp"
                            name="whatsapp_phone"
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width} ${styles.anket__input_phone}`}
                          />
                          {error.path == "whatsapp_phone" &&<p
                            className={styles.anket__error}
                            name="whatsapp_phone"
                            
                          >{error.message}</p>}
                        </label>
                      </div>
                    </div>
                    <div
                      className={`${styles.anket_flex} ${styles.anket_margin}`}>
                      <div className={styles.anket_width}>
                        <p className={styles.anket__sectionTitle}>
                          {texts.relatedPersonText}
                        </p>
                        <label
                          htmlFor="relatedPersonNumber"
                          className={`${styles.anket__label} ${styles.anket__label_position}`}>
                          <span
                            className={`${styles.anket__beginningNumber} ${styles.anket__beginningNumber_position}`}>
                            +994
                          </span>
                          <input
                            id="relatedPersonNumber"
                            name="manufacturer[phone]"
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width} ${styles.anket__input_phone}`}
                          />
                          {error.path == "manufacturer[phone]" &&<p
                            className={styles.anket__error}
                            name="manufacturer[phone]"
                            
                          >{error.message}</p>}
                        </label>
                      </div>
                      <div className={styles.anket_width}>
                        <p className={styles.anket__sectionTitle}>
                          {texts.relatedPersonNameText}
                        </p>
                        <label
                          htmlFor="relatedPersonName"
                          className={styles.anket__label}>
                          <input
                            id="relatedPersonName"
                            name="manufacturer[name]"
                            type="text"
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width} `}
                          />
                          {error.path == "manufacturer[name]" &&<p
                            className={styles.anket__error}
                            name="manufacturer[name]"
                            
                          >{error.message}</p>}
                        </label>
                      </div>
                    </div>
                    <div
                      className={`${styles.anket_flex} ${styles.anket_margin}`}>
                      <div className={styles.anket_width}>
                        <p className={styles.anket__sectionTitle}>
                          {texts.youtubeLinkText}
                        </p>
                        <label htmlFor="email" className={styles.anket__label}>
                          <input
                            id="iframe_src"
                            type="url"
                            name="iframe_src"
                            placeholder=" "
                            className={`${styles.anket__input} ${styles.anket__input_color} ${styles.anket__input_width}`}
                          />
                          {error.path == "iframe_src" &&<p
                            className={styles.anket__error}
                            name="iframe_src"
                            
                          >{error.message}</p>}
                        </label>
                      </div>
                    </div>
                    <div className={styles.anket_margin}>
                      <p className={styles.anket__sectionTitle}>
                        {texts.uploadOfImageOrCertificatesText}
                      </p>
                      <div className={styles.anket__fileInputContainer}>
                        <label htmlFor="addedFile"></label>
                     
                        <input
                          id="manufacturer.certificates"
                          type="file"
                          multiple
                          accept="image/*"
                          name="manufacturer[certificates[]]"
                          className={`${styles.anket__fileInput}`}
                        />
                        <p className={styles.anket__uploadedImg}>{imgName}</p>
                        {error.path == "manufacturer[certificates]" &&<p
                          className={styles.anket__error}
                          name="manufacturer[certificates]"
                          
                        >{error.message}</p>}
                      </div>
                    </div>
                    <div className={styles.anket_margin}>
                      <p className={styles.anket__sectionTitle}>{texts.noteText}</p>
                      <div>
                        <input
                          name="description"
                          id="record"
                          as="textarea"
                          className={`${styles.anket__textArea} ${styles.anket__input_color}`}
                        />
                        {error.path == "description" &&<p
                          className={styles.anket__error}
                          name="description"
                          
                        >{error.message}</p>}
                      </div>
                    </div>
                    <div className={styles.anket__btnContainer}>
                      <button type="submit" className={styles.anket__btn}>
                        {texts.sendText}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
    </Modal>
  );
};

export default FooterAnket;
