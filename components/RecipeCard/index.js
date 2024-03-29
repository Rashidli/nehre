import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import styles from './styles.module.scss';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import RoomServiceOutlinedIcon from '@mui/icons-material/RoomServiceOutlined';
import useTranslate from '../../hooks/useTranslate';


const RecipeCard = ({ item }) => {
    const texts = useTranslate();
    const { cookingTime, receiptId, description, difficultly, image, name, portion, slug, } = item;
    const timeString = cookingTime.hour ? `${cookingTime.hour} ${texts.hoursLowerCaseText} ${cookingTime.minute} dəqiqə` : `${cookingTime.minute} dəqiqə`;

    return (
        <Link href={`/receipts/${receiptId}`}>
            <a className={styles.card}>
                <div className={styles.imageContainer}>
                    <Image alt={name} src={image} layout={'fill'} />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>{name}</h3>
                    <div className={styles.info}>
                        <div className={styles.infoItem}>
                            <AccessTimeOutlinedIcon className={styles.infoIcon} />
                            <p className={styles.infoText}>{timeString}</p>
                        </div>
                        <div className={styles.infoItem}>
                            <RoomServiceOutlinedIcon className={styles.infoIcon} />
                            <p className={styles.infoText}>{portion}</p>
                        </div>

                        <div className={styles.infoItem}>

                            {[1, 2, 3, 4, 5].map((item, index) => {
                                if (item < difficultly) {
                                    return <span key={index + 'filledHardnes'} className={styles.hardnessContainer}>
                                        <Image alt='' src={'/images/recipeLevelFilled.svg'} layout={'responsive'} width={'100%'} height={"100%"} />
                                    </span>

                                }
                                return <span key={index + 'unfilledHardnes'} className={styles.hardnessContainer}>
                                    <Image alt='' src={'/images/recipeLevel.svg'} layout={'responsive'} width={'100%'} height={"100%"} />
                                </span>

                            })}
                        </div>
                    </div>

                </div>
            </a>
        </Link>

    )
}

export default RecipeCard