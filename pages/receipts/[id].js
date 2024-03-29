import Image from "next/image";
import React from "react";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import RoomServiceOutlinedIcon from "@mui/icons-material/RoomServiceOutlined";
import { httpRequest } from "../../helpers/utils";
import styles from "./styles.module.scss";
import { Container, CustomSlider, CarouselProductCard} from '../../components';
import { productSliderBreakpoints } from '../../helpers/sliderSettings';
import useTranslate from "../../hooks/useTranslate";

export async function getServerSideProps({ query, locale, req }) {
  httpRequest.defaults.headers['Location'] = locale;
  httpRequest.defaults.headers['X-Currency'] = req.cookies.currency ? JSON.parse(req.cookies.currency).code : 'AZN';

  const response = await httpRequest.get(`/receipts/${query.id}`);
  const data = response.data.data;

  return {
    props: {
      data: data,
    },
  };
}
const Receipt = ({ data }) => {
  const texts = useTranslate();
  const { name, image, cookingTime, portion, difficultly, description, steps, products } = data;
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>{name}</h3>
      <div className={styles.image}>
        <Image
          src={image}
          alt={name}
          layout="fill"
        />
      </div>
      <div className={styles.receiptDesc}>
        <div className={styles.row}>
          <AccessTimeOutlinedIcon className={styles.infoIcon} />
          <span className={styles.infoText}>
            {cookingTime.hour
              ? `${cookingTime.hour} ${texts.hoursText} ${cookingTime.minute} ${texts.minutesText}`
              : `${cookingTime.minute} ${texts.minutesText}`}
          </span>
        </div>
        <div className={styles.difficulty}>
          {[1, 2, 3, 4, 5].map((item, index) => {
            if (item < difficultly) {
              return (
                <span
                  key={index + "filledHardnes"}
                  className={styles.hardnessContainer}
                >
                  <Image
                    alt=""
                    src={"/images/recipeLevelFilled.svg"}
                    layout={"responsive"}
                    width={"100%"}
                    height={"100%"}
                  />
                </span>
              );
            }
            return (
              <span
                key={index + "unfilledHardnes"}
                className={styles.hardnessContainer}
              >
                <Image
                  alt=""
                  src={"/images/recipeLevel.svg"}
                  layout={"responsive"}
                  width={"100%"}
                  height={"100%"}
                />
              </span>
            );
          })}
        </div>
        <div className={styles.textPlain}>{texts.portionText}</div>
        <div className={styles.row}>
          <RoomServiceOutlinedIcon className={styles.infoIcon} />
          <span className={styles.infoText}>{portion}</span>
        </div>
      </div>
      <div className={styles.description}>
        <p>{description}</p>
      </div>
      <div className={styles.steps}>
        <h3 className={styles.stepsTitle}>{texts.howIsItCookedText}</h3>
        {steps.map((item, index) => (
          <div key={index} className={styles.step}>
            <div className={styles.stepCount}>
              <span className={index <= 9 ? `${styles.countS}` : `${styles.countL}`}>{index + 1}</span>
              <Image
              alt={texts.countText}
                src={"/images/step.svg"}
                layout="fill"
                className={styles.countImg}
              />
            </div>
            <p className={styles.stepText}>{item}</p>
          </div>
        ))}
      </div>
      {!!products.length && (
        <Container header={texts.buyRightProductsText}>
          <CustomSlider
            breakpoints={productSliderBreakpoints}
            data={products}
            renderComponentKey={'receiptOfferCards'}
            renderComponent={(item, index) => (
              <CarouselProductCard data={item} />
            )}
          />
        </Container>
      )}
    </div>
  );
};
export default Receipt;
