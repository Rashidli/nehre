import Image from 'next/image';
import React from 'react'
import styles from './styles.module.scss';
import SyncLoader from "react-spinners/SyncLoader";
import useTranslate from '../../hooks/useTranslate';
const PageContainer = ({ children, nextUrl, nextUrlCallback, loader, subTitle, additionalClassName }) => {
    const texts = useTranslate();
    
    return (
        <>
            {subTitle && <h3 className={styles.subTitle}>{subTitle}</h3>}
            <div className={`${styles.container} ${additionalClassName}`}>
                {loader &&
                    <div className={styles.loaderContainer}>
                        <SyncLoader size={20} color={"#2d5d9b"} margin={12} />
                    </div>
                }
                {children}
                {!!nextUrl && <div className={styles.loadMoreContainer}>
                    <button className={styles.button} type='button' onClick={nextUrlCallback} >
                        {texts.moreText}
                    </button>
                </div>}
            </div>
        </>
    )
}

export default PageContainer

