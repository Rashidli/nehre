import React from "react";
import styles from "./styles.module.scss";
import CustomSlider   from "../../../CustomSlider";
import  CarouselProductCard  from "../../../CarouselProductCard";

import { productSliderBreakpoints } from "../../../../helpers/sliderSettings";
import VendorCard from "../../../VendorCard";
import useTranslate from "../../../../hooks/useTranslate";



const Description = ({ specifications, related, crossSelling,vendor }) => {
  const texts = useTranslate();
  return (
    <div className={styles.container}>
      <div className={styles.description}>
        <div className={styles.specificationsContainer}>
          {specifications?.map((item, index) => (
            <p key={index} className={styles.specifications}>
              <span>{item.title}: </span>
              {item.value}
            </p>
          ))}
        </div>

        <VendorCard data={vendor} />
      </div>

      {!!related.length && (
        <div className={styles.relatedProducts}>
          <h3>{texts.similarProductsText}</h3>
          <CustomSlider
            breakpoints={productSliderBreakpoints}
            data={related}
            renderComponent={(item, index) => (
              <CarouselProductCard
                shouldScroll={true}
                data={item}
                key={index + 'specialOfferCards'}
              />
            )}
          />
        </div>
      )}
      {!!crossSelling.length && (
        <div className={styles.relatedProducts}>
          <h3>{texts.buyWithText}</h3>
          <CustomSlider
            breakpoints={productSliderBreakpoints}
            data={crossSelling}
            renderComponent={(item, index) => (
              <CarouselProductCard
                shouldScroll={true}
                data={item}
                key={index + 'specialOfferCards'}
              />
            )}
          />
        </div>
      )}
    </div>
  );
};
export default Description;
