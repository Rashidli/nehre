import Link from 'next/link'
import React from 'react'
import useTranslate from '../../../hooks/useTranslate';
import styles from './styles.module.scss';


const CarouselCard = ({ banner }) => {
  const texts = useTranslate()
    return (
      <div>
        <div className={styles.container}>
          <div
            className={styles.imageContainer}
            style={{backgroundImage: `url(${banner.image})`}}
          />
          <div className={styles.infoContainer}>
            <h3 className={styles.cardTitle}>{banner.title}</h3>
            <Link href={banner.link ?? `/info/${banner.bannerItemId}`}>
              <a className={styles.moreLink} target={banner.link ? '_blank' : '_parent'}>
                {texts.inDetailText}
              </a>
            </Link>
          </div>
        </div>
      </div>
    );
}

export default CarouselCard