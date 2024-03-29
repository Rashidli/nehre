import React from 'react'
import styles from './styles.module.scss';


const Container = ({ header, children }) => {
    return (
        <div className={styles.container}>
            {!!header && <h3 className={styles.header}>{header}</h3>}
            <div className={styles.innerContainer}>
                {children}
            </div>
        </div>
    )
}

export default Container