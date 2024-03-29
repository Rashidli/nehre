import React from 'react'
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import styles from './styles.module.scss';
import Image from "next/image";
import Link from 'next/link';

const CarouselVendorCard = ({ data }) => {

  const {
    avatar,
    images,
    manufacturerType,
    name,
    rating,
    slug,
    vendorId,
  } = data;
  return (
    <Link href={`/vendors/${vendorId}`}>
      <a className={styles.container}>
        <div className={styles.cardTop}>
          <div className={styles.cardTopLeft}>
            <div className={styles.img}>
              <Image
                alt='vendor card'
                src={avatar}
                layout="fill"
              />
            </div>
          </div>
          <div className={styles.cardTopRight}>
            <p>{name}</p>
            <div className={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((item, index) => {
                if (item <= rating) {
                  return (
                    <StarOutlinedIcon
                      key={index + 'star'}
                      className={styles.starFilled}
                    />
                  );
                } else {
                  return (
                    <StarOutlineOutlinedIcon
                      key={index + 'star'}
                      className={styles.starOutline}
                    />
                  );
                }
              })}
            </div>
            <span>{manufacturerType}</span>
          </div>
        </div>
        <div className={styles.cardBottom}>
          {images.map((item, index) => (
            <div key={index} className={styles.images} >
              <Image
                alt='vendor images'
                src={item} className={styles.image} layout="fill" />
            </div>
          ))}
        </div>
      </a>
    </Link>

  );
};
export default CarouselVendorCard;