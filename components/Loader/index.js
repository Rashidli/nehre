import Image from "next/image";
import React from "react";
import styles from "./styles.module.scss";


const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <Image alt={"loader"} src="/animations/loader.gif" width={'200%'} height={"200%"} />
    </div>
  );
};

export default Loader;
