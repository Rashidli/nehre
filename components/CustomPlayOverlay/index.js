import React from 'react'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import styles from './styles.module.scss';
const CustomPlayOverlay = ({setPlay}) => {
  return (
    <div className={styles.playButtonContent}>
      <PlayArrowRoundedIcon
        onClick={() => setPlay(true)}
        className={styles.playButton}
      />
    </div>
  );
}

export default CustomPlayOverlay;