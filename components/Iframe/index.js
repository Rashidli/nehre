import React from 'react'
import styles from './styles.module.scss'

const Iframe = ({data}) => {
    const {iframeSrc} = data;

    return (
        <div className={styles.container} >
            <iframe 
                id="player" 
                type="text/html" 
                width="100%" 
                height="100%"
                src={iframeSrc}
                frameborder="0">
            </iframe>
        </div >
    )
}

export default Iframe
