import React from 'react';
import { ArrowBackIosNewRounded } from '@mui/icons-material';
import styles from './styles.module.scss';


const ArrowLeft = ({ onClick }) => {
    return (
        <div className={styles.arrowContainerStyle} onClick={onClick}>
            <ArrowBackIosNewRounded className={styles.arrowStyle} />
        </div>
    )
}


export default ArrowLeft;