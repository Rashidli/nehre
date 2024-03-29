import React, { useState } from "react";
import { Instagram, Facebook, Twitter } from "@mui/icons-material";
import Link from "next/link";
import Image from "next/image";
import styles from "./styles.module.scss";
import FooterAnket from "../FooterAnket";
import { useRouter } from "next/router";
import { connect } from "react-redux";
import footerBannerImg from '../../public/images/footerTopImg.jpg';
import { httpRequest } from '../../helpers/utils';
import { errorToast, successToast } from '../../helpers/notification';
import { ErrorMessage, Field, Form, Formik } from "formik";
import { SubscribeEmailSchema } from "../../schemas";
import { useSession } from "next-auth/react";
import useTranslate from "../../hooks/useTranslate";


const Footer = ({ settings }) => {
  const router = useRouter();
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeEmailError, setSubscribeEmailError] = useState(false);
  const [subscribeEmailSuccess, setSubscribeEmailSuccess] = useState(false);
  const session  = useSession();
  const texts = useTranslate()
  const setSubscribeEmailHandler = (e) => {
    setSubscribeEmail(e.target.value);
  };

  const subscribeEmailHandler = async () => {
    // e.preventDefault();

    if (subscribeEmail === "") {
      setSubscribeEmailError(true);
      setSubscribeEmailSuccess(false);
      return;
    } else {
      setSubscribeEmailError(false);
      setSubscribeEmailSuccess(true);
    }

    const response = await httpRequest.post('/subscribe', { email: subscribeEmail });

    if (response?.status.includes(['200', '201'])) {
      setSubscribeEmailError(false);
      setSubscribeEmailSuccess(true);
    } else {
      setSubscribeEmailError(true);
      setSubscribeEmailSuccess(false);

      successToast(response?.message);
    }

  };

  const subscribeEmailFunc = async (data) => {
    try {
      const requestData = {
        email: data.email
      }
      const response = await httpRequest.post('/subscribe', requestData);
      successToast(texts.subscriptionSuccess);
    } catch (error) {
      if (error.response?.data?.message) {
        errorToast(error.response.data.message);
      } else {
        errorToast(error.message);
      }
    }
  };


  return (
    <>
      {router.query['vendor-form'] && <FooterAnket />}
      <div className={styles.footerTopBannerImg}>
        <Image
          src={footerBannerImg}
          alt='footer banner'
          width={1200}
          height={400}
        />
      </div>
      <div className={styles.footer}>
        <div className={styles.subscribeContainer}>
          <h2>{texts.subscribeForNewsText}</h2>
          {/* <form className={styles.subscripbeForm}>
            <input type="email" placeholder=" " onChange={(e) => setSubscribeEmail(e.target.value)} />
            <button type="button" onClick={() => subscribeEmailFunc()}>Subscribe</button>
            <span className={styles.dynamicPlaceholder}>Email</span>
          </form> */}

          <Formik
            onSubmit={subscribeEmailFunc}
            validationSchema={SubscribeEmailSchema}
            validateOnChange={false}
            validateOnBlur={false}
            initialValues={{
              email: ' '
            }}
          >
            {({ errors, values, handleSubmit }) => (
              <Form className={styles.subscripbeForm}>
                <div>
                  <Field
                    id="email"
                    type="email"
                    placeholder=" "
                    value={values.email}
                  />
                  <button type="submit" onClick={handleSubmit}>
                    {texts.subscribeText}
                  </button>
                  <span className={styles.dynamicPlaceholder}>{texts.emailText}</span>
                </div>
                <ErrorMessage
                  className={styles.subscribeErrorMessage}
                  name="email"
                  component="div"
                />
              </Form>
            )}
          </Formik>

          <p>{texts.specialOffersDescription}</p>
        </div>
        <div className={styles.container}>
          <div className={styles.row}>
            <h3 className={styles.title}>{texts.forCustomersText}</h3>
            <div className={styles.links}>
            {session.status === "authenticated" &&  <Link href="/profile/bonuses">
              <a>{texts.bonusesText}</a>
            </Link>}
              <Link href="/privacy-policy">
                <a>{texts.privacyPolicyText}</a>
              </Link>
              <Link href="/delivery">
                <a>{texts.deliveryAndPaymentText}</a>
              </Link>
              <Link href="/refund">
                <a>{texts.returnsText}</a>
              </Link>
            </div>
          </div>
          <div className={styles.row}>
            <h3 className={styles.title}>{texts.aboutCompanyText}</h3>
            <div className={styles.links}>
              <Link href="/who-are-we">
                <a>{texts.whoAreWeText}</a>
              </Link>
              <Link href="/quality">
                <a>{texts.qualityAssuranceText}</a>
              </Link>
              <Link href="/contact">
                <a>{texts.contactText}</a>
              </Link>
            </div>
          </div>
          <div className={styles.row}>
            <h3 className={styles.title}>{texts.PartnersText}</h3>
            <div className={styles.links}>
              <Link href="/vendors">
                <a>{texts.vendorsText}</a>
              </Link>
              <Link
                href={{
                  pathname: router.pathname,
                  query: { ...router.query, 'vendor-form': true },
                }}
                scroll={false} shallow={true}>
                <a>{texts.vendorAnketText}</a>
              </Link>
            </div>
          </div>
          <div className={styles.row}>
            <h3 className={styles.title}>{texts.contactText}</h3>
            <div className={styles.links}>
              {/* //todo add correct phone numbers here */}
              <a
                href={`https://api.whatsapp.com/send/?phone=%2B${settings?.whatsappPhone?.slice(1,)}&text=Salam.+%0ASiz%C9%99+sual%C4%B1m+var&type=phone_number&app_absent=0`}
                target="_blank"
                rel="noreferrer"
              >
                <a>{settings?.whatsappPhone}</a>
              </a>
              <Link href={`tel:${settings?.tel}`}>
                <a>{settings?.tel}</a>
              </Link>
              <Link href="/google_maps">
                <a>{settings?.address}</a>
              </Link>
              <Link href={`mailto:${settings?.email}`}>
                <a>{settings?.email}</a>
              </Link>
            </div>
            <div className={styles.social_media}>
              <Link href={`${settings?.facebook}`}>
                <a>
                  <Facebook />
                </a>
              </Link>
              <Link href={`${settings?.instagram}`}>
                <a>
                  <Instagram />
                </a>
              </Link>
              <Link href={`${settings?.twitter}`}>
                <a>
                  <Twitter />
                </a>
              </Link>
            </div>
          </div>
          <div className={styles.image_container}>
            <Image
              src="/images/logo_footer.png"
              alt="logo"
              width="157"
              height="120"
            />
          </div>
          <div className={styles.payment_container}>
            <h3 className={styles.title}>{texts.paymentsText}</h3>
            <div className={styles.payment_methods}>
              <div className={styles.payment_method}>
                <Image
                  src="/images/visa.svg"
                  alt="visa"
                  layout="fill"
                  objectFit='contain'
                />
              </div>
              <div className={styles.payment_method}>
                <Image
                  src="/images/mastercard.png"
                  alt="mastercard"
                  layout="fill"
                  objectFit='contain'
                />
              </div>
              <div className={styles.payment_method}>
                <Image
                  src="/images/maestro.png"
                  alt="maestro"
                  layout="fill"
                  objectFit='contain'
                />
              </div>
              <div className={styles.payment_method}>
                <Image
                  src="/images/apple-pay.png"
                  alt="apple-pay"
                  layout="fill"
                  objectFit='contain'
                />
              </div>
              <div className={styles.payment_method}>
                <Image
                  src="/images/google-pay.png"
                  alt="google-pay"
                  layout="fill"
                  objectFit='contain'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


const mapState = state => {
  return ({
    settings: state.globalData.settings,
  })
}

export default connect(mapState)(Footer);
