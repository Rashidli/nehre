import Image from 'next/image'
import React from 'react'
import styles from './styles.module.scss';


const Card = ({ text, icon }) => {
    return (
        <div className={styles.container}>
            <div className={styles.icon}>
                <Image src={icon} width={100} height={100} alt="Nehra.az" layout="responsive" />
            </div>
            <p className={styles.title}>{text}</p>
        </div>
    )
}

export default Card