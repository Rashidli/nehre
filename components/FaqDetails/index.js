import React from 'react'
import styles from './styles.module.scss';

const style = {
  position: 'absolute',
  padding: '10px',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  p: 4,
};

const FaqDetails = ({ data, index }) => {

  return (
    <div
      className={styles.container + ' ' + styles.modal_container}
      style={{
        backgroundColor: `${
          index === 0 || index % 4 === 0
            ? '#c6da60'
            : index === 1 || index % 4 === 1
            ? '#aef6fd'
            : index === 2 || index % 4 === 2
            ? '#ffb1b1'
            : '#ffdd95'
        }`,
      }}>
      <div className={styles.modal_question}>
        <p className={styles.questionParagraph}>{data.question}</p>
      </div>
      <p className={styles.answerParagraph + ' ' + styles.modal_answer}>
        {data.answer}
      </p>
    </div>
  );
}

export default FaqDetails;