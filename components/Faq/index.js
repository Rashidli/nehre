import React from "react";
import styles from "./styles.module.scss";
import Image from "next/image";


const Faq = ({ data, index }) => {
  const [open, setOpen] = React.useState(false);
  const handleOpen = (e) => {
    setOpen(true);

  };
  const handleClose = () => {
    setOpen(false);
  };


  return (
    <div
      className={`${styles.container} ${styles.container_border}`}
    >
      <div className={styles.question}
      style={{
        backgroundColor: `${index === 0 || index % 4 === 0
          ? "#c6da60"
          : index === 1 || index % 4 === 1
            ? "#aef6fd"
            : index === 2 || index % 4 === 2
              ? "#ffb1b1"
              : "#ffdd95"
          }`,
      }}>
        <Image
          alt="question mark"
          src="/images/question.svg"
          className={styles.questionMark}
          width={54}
          height={54}
        />
        <p className={styles.questionParagraph}>{data.question}</p>
      </div>
      <button onClick={handleOpen} className={styles.button}></button>
    </div>
  );
};

export default Faq;
