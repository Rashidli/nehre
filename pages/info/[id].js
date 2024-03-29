import React, { useState } from 'react'
import { httpRequest } from '../../helpers/utils';
import Image from 'next/image';
import Iframe from '../../components/Iframe';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import CustomSlider   from "../../components/CustomSlider";
import styles from './styles.module.scss'
import { imagesSilderBreakpoints } from "../../helpers/sliderSettings";
import {Modal} from '@mui/material';
import { getSession } from 'next-auth/react';
import useTranslate from '../../hooks/useTranslate';


export async function getServerSideProps(context) {
   const {query, locale, req} = context;
   const session = await getSession(context);
   if (session) {
     httpRequest.defaults.headers[
       'Authorization'
     ] = `Bearer ${session.user.accessToken}`;
   }
    httpRequest.defaults.headers['Location'] = locale;

    const response = await httpRequest.get(`/banner/${query.id}/info`);
    const data = response.data.data

    return {
        props: {
            data: data
        },
    }
}

const InfoPage = ({ data }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen(!isOpen)
    }

    const {
        title,
        description,
        content,
        iframeSrc,
        image,
        images,
    } = data;

    return (
      <>
        <div className={styles.container}>
          <div className={styles.infoContainer}>
            <div className={styles.imageContainer}>
              <Image
                src={image}
                alt={title}
                layout={'fill'}
                width={100}
                height={100}
              />
              <div className={styles.playButtonContent}>
                <PlayArrowRoundedIcon
                  onClick={toggle}
                  className={styles.playButton}
                />
              </div>
            </div>
            <div className={styles.descriptionContainer}>
              <h3 className={styles.title}>{title}</h3>
              <p className={styles.description}>{description}</p>
            </div>
          </div>

          <div className={styles.contentContainer}>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{__html: content}}></div>
          </div>

          {!!images.length && (
            <div className={styles.bannerGalleryContainer}>
              <CustomSlider
                breakpoints={imagesSilderBreakpoints}
                data={images}
                renderComponent={(item, index) => (
                  <div className={styles.bannerGalleryContent}>
                    <Image
                      alt={title}
                      src={item}
                      layout="fill"
                      className={styles.sliderImage}
                    />
                  </div>
                )}
              />
            </div>
          )}

          <Modal open={isOpen} onClose={toggle}>
            <div className={styles.modalContent}>
              {iframeSrc.length && <Iframe data={{iframeSrc}} />}
            </div>
          </Modal>
        </div>
      </>
    );
}

export default InfoPage



