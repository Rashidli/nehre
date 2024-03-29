import React from 'react';
import useTranslate from '../hooks/useTranslate';
import styles from '../styles/notFound.module.scss';

const Server500 = () => {
    const texts = useTranslate();

    return (
        <div className={styles.container}>
            <h1 className={styles.headerText}>500</h1>
            <p className={styles.description}>{texts.serverError}</p>
        </div>
    )
}

export default Server500;