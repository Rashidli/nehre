import React from 'react';
import styles from './styles.module.scss';
import { ArrowForwardIosRounded } from '@mui/icons-material';

const ArrowRight = ({ onClick }) => {
    return (
        <div className={styles.arrowContainerStyle} onClick={onClick}>
            <ArrowForwardIosRounded className={styles.arrowStyle} />
        </div>
    )
}

export default ArrowRight;