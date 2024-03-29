import Link from 'next/link';
import React from 'react'
import useTranslate from '../../hooks/useTranslate';
import styles from './styles.module.scss';


const CategoryCard = ({ data }) => {
    const { categoryId, categoryUUID, image, name, productCount, slug, thumb } = data;
    const texts = useTranslate()

    return (
        <Link href={`/category/${categoryId} `}>
            <a className={styles.container} style={{ backgroundImage: `url(${image})` }}>
                <div className={styles.overlay}>
                    <h5 className={styles.title}>{name}</h5>
                    <div className={styles.descriptionContainer}>
                        <p className={styles.description}>{productCount} {texts.moreProductsText}</p>
                    </div>
                </div>
            </a>
        </Link >

    )
}

export default CategoryCard