import Link from 'next/link'
import React, { useState } from 'react'
import { connect } from 'react-redux';
import useTranslate from '../../hooks/useTranslate';
import styles from './styles.module.scss'

const LabelNavbar = ({ labels }) => {
  const [open, setOpen] = useState(false)
  const texts = useTranslate();
  const toggle = () => {
      setOpen(!open)
  }

  return (
    <div className={styles.dropContainer} onMouseLeave={() => setOpen(false)} >
        <button onClick={toggle} className={styles.button}>
            {texts.labelsText}
        </button>
        {open && <div className={styles.drop}>
            {labels.map((item) => {
                return <Link href={`/label/${item.labelId}`} key={item.labelId + 'label'} onClick={() => setOpen(false)}>
                    <a className={styles.dropMenuLink}>{item.name}</a>
                </Link>
            })}
        </div>}

    </div>
  )
};


const mapStateToProps = (state) => {
  return {
    labels: state.globalData.labels
  }
}

export default connect(mapStateToProps)(LabelNavbar);