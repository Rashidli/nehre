import React from 'react';
import { httpRequest } from '../helpers/utils';
import styles from '../styles/whoAreWe.module.scss';

export const getServerSideProps = async ({ locale, req }) => {
    httpRequest.defaults.headers['Location'] = locale;
    httpRequest.defaults.headers['X-Currency'] = req.cookies.currency ? JSON.parse(req.cookies.currency).code : 'AZN';

    const response = await httpRequest.get("/content/quality");
    const data = response.data.data

    return {
        props: {
            data
        }
    }
}

const Quality = ({ data }) => {

    const { link, image, title, content, description, sub_title, sub_description } = data;


    function createMarkup(content) {
        return { __html: content };
    }


    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h3 className={styles.pageTitle}>{title}</h3>
                <p dangerouslySetInnerHTML={createMarkup(description)} className={styles.description} />
            </div>
            <p dangerouslySetInnerHTML={createMarkup(content)} className={styles.whoIsContent} />
            <iframe src={link} width="100%" height="500px" frameBorder="0" allowFullScreen="" aria-hidden="false" tabIndex="0"></iframe>
            <h2 className={styles.subTitle}>{sub_title}</h2>
            <p dangerouslySetInnerHTML={createMarkup(sub_description)} className={styles.whoIsContent} />
        </div>
    )
}

export default Quality