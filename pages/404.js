import Image from 'next/image'
import React from 'react';
import useTranslate from '../hooks/useTranslate';
import img404 from '../public/images/F04.svg';
import styles from '../styles/notFound.module.scss';

const Eror404 = () => {
    const texts = useTranslate();
    return (
        <div className={styles.container}>
            <Image
                src={img404}
                alt="404 not found"
                className={styles.errorImg}
            />
            <p className={styles.description}>{texts.noResultSearchText}</p>
        </div>
    )
}

export default Eror404