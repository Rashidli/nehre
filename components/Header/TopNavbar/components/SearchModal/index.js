import { SearchRounded } from '@mui/icons-material'
import { Backdrop, Button } from '@mui/material'
import React, { useState } from 'react'
import clsx from 'clsx'
import styles from './styles.module.scss'
import { useRouter } from 'next/router';
import useTranslate from '../../../../../hooks/useTranslate'

const SearchModal = ({ isVisible, toggleSearch }) => {
  const router = useRouter();
  const [searchedValue, setSearhedValue] = useState();
  const texts = useTranslate();
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      router.push(`/search?query=${e.target.value}`)
    }
  }
  
  const handleSearchFunc = () => {
    router.push(`/search?query=${searchedValue}`)
  }
  
  const handleSetValue = (e) => {
    setSearhedValue(e.target.value);
  }

  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer }}
      open={isVisible}
      onClick={toggleSearch}
    >
      <div onClick={(e) => e.stopPropagation()} className={styles.wrapper}>
        <div className={styles.searchContainer}  >
          <h3 className={styles.heading}>{texts.toSearchText}</h3>
          <input name='search' className={styles.input} onKeyDown={handleKeyDown} onChange={handleSetValue} placeholder={texts.toSearchText} />
          <Button className={styles.Button} onClick={() => handleSearchFunc()}>
            <SearchRounded />
          </Button>
        </div>
      </div>

    </Backdrop>

  )
}

export default SearchModal