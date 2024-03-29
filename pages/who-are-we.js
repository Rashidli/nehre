import React from 'react';
import { httpRequest } from '../helpers/utils';
import useTranslate from '../hooks/useTranslate';
import styles from '../styles/whoAreWe.module.scss';

export const getServerSideProps = async ({ locale, req }) => {
    httpRequest.defaults.headers['Location'] = locale;
    httpRequest.defaults.headers['X-Currency'] = req.cookies.currency ? JSON.parse(req.cookies.currency).code : 'AZN';

    const response = await httpRequest.get("/content/about");
    const data = response.data.data

    return {
        props: {
            data
        }
    }
}

const WhoWeAre = ({ data }) => {
    const texts = useTranslate();
    const { link, tin, content, description, whoIsContent, companyName, companyAddress, companyOwnerInfo } = data;


    function createMarkup() {
        return { __html: content };
    }


    return (
        <div className={styles.container}>
            {/* //todo add breadcrum here */}
            <div className={styles.pageHeader}>
                <h3 className={styles.pageTitle}>{texts.aboutUsText}</h3>
                <p className={styles.description}>{description}</p>
            </div>
            <h2 className={styles.whoIsTitle}>{texts.whoAreWeText}</h2>
            <div className={styles.companyInfoContainer}>
                <span className={styles.infoText}>{texts.companyText}: {companyName}</span>
                <span className={styles.infoText}>{texts.addressText}: {companyAddress}</span>
                <span className={styles.infoText}>{texts.companyOwnerText}: {companyOwnerInfo}</span>
                <span className={styles.infoText}>{texts.countryRegistrationText} № (VÖEN): {tin}</span>

            </div>
            <p className={styles.whoIsContent} >{whoIsContent}</p>

            <iframe src={link} width="100%" height="500px" frameBorder="0" allowFullScreen="" aria-hidden="false" tabIndex="0"></iframe>

            <div dangerouslySetInnerHTML={createMarkup()} className={styles.contentStyle} />



        </div>
    )
}

export default WhoWeAre