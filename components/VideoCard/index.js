import React, { useState } from 'react'
import Link from 'next/link';
import {Modal} from '@mui/material';
import Iframe from './components/Iframe';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import styles from './styles.module.scss';
import useTranslate from '../../hooks/useTranslate';

const VideoCard = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const texts = useTranslate();
    const toggle = () => {
        setIsOpen(!isOpen)
    }

    const {
        image: bgImage, 
        itemTitle: title, 
        itemDescription: description, 
        link, 
        iframeSrc,
    } = data;

    return (
      <div
        className={styles.container}
        style={{backgroundImage: `url(${bgImage})`}}>
        <div className={styles.bannerContent}>
          <h4 className={styles.bannerTitle}>{title}</h4>
          <p className={styles.bannerDescription}>{description}</p>
          <Link href={link}>
            <a className={styles.moreLink}>{texts.inDetailText}</a>
          </Link>
        </div>
        <div className={styles.playButtonContent}>
          <PlayArrowRoundedIcon
            onClick={toggle}
            className={styles.playButton}
          />
        </div>

        <Modal open={isOpen} onClose={toggle}>
          <div className={styles.modalContent}>{iframeSrc.length && <Iframe data={{iframeSrc}} />}</div>
        </Modal>
      </div>
    );
}

export default VideoCard
