import React from 'react';
import styles from '../styles/contact.module.scss';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import Link from 'next/link';
import { connect } from 'react-redux';
import { httpRequest } from '../helpers/utils';
import { getSession } from 'next-auth/react';
import useTranslate from '../hooks/useTranslate';

export const getServerSideProps = async (context) => {
  const { query, locale, req } = context;
  const session = await getSession(context);
  if (session) {
    httpRequest.defaults.headers[
      'Authorization'
    ] = `Bearer ${session.user.accessToken}`;
  }
  httpRequest.defaults.headers['Location'] = locale;

  const response = await httpRequest.get('/content/contact');
  const data = response.data.data
  return {
    props: { mapData: data }
  }
}

const Contact = ({ mapData, settings }) => {
  const texts = useTranslate();

  const { information } = mapData;
  const { whatsappPhone, tel, companyPhone, address, email, facebook, instagram, twitter } = settings;

  return (
    <div className={styles.container}>
      <h3 className={styles.contact}>{texts.contactText}</h3>

      <div className={styles.mainDiv}>

        <div className={styles.doubleContainer}>

          <div className={styles.sectionDiv}>
            <h4 className={styles.sectionHeader}>{texts.customerSupportText}</h4>
            <span className={styles.phone}>{tel}</span>
            <span className={styles.phone}>{whatsappPhone}</span>
            <span className={styles.phone}>{companyPhone}</span>
          </div>

          <div className={styles.sectionDiv}>
            <h4 className={styles.sectionHeader}>{texts.postOfficeText}</h4>
            <span className={styles.mail}>{email}</span>
          </div>

        </div>
        <div className={styles.doubleContainer}>
          <div className={styles.sectionDiv}>
            <h4 className={styles.sectionHeader}>{texts.followOurSocialsText}</h4>
            <div className={styles.socials}>
              <Link href={instagram}><a className={styles.instagramIcon}><InstagramIcon /></a></Link>
              <Link href={twitter}><a className={styles.instagramIcon}><TwitterIcon /></a></Link>
              <Link href={facebook}><a className={styles.instagramIcon}><FacebookIcon /></a></Link>
            </div>

          </div>

          <div className={styles.sectionDiv}>
            <h4 className={styles.sectionHeader}>{texts.vendorsText}</h4>
            <span className={styles.supplierSpan}>{texts.vendorDescription}</span>
          </div>

        </div>
      </div>

      <div className={styles.sectionDiv}>
        <h4 className={styles.sectionHeader}>{texts.ourAddressText}</h4>
        <span className={styles.address}>{address}</span>
        <div className={styles.mapContainer}>
          <iframe title={texts.addressText} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13530.253397807128!2d49.27038622248594!3d40.948158636172046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x403737e93831a7dd%3A0x96283791645b2572!2sZarat!5e0!3m2!1sen!2s!4v1626433915600!5m2!1sen!2s" width="100%" height="450" allowfullscreen="" loading="lazy"></iframe>
        </div>

      </div>

      <div className={styles.sectionDiv}>
        <h4 className={styles.sectionHeader}>{texts.legalInfoText}</h4>
        <span className={styles.address}>{information}</span>
      </div>

    </div >
  )
}

const mapStateToProps = (state) => {
  return {
    settings: state.globalData.settings
  }
}


export default connect(mapStateToProps)(Contact);