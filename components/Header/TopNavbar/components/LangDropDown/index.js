import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { connect, useSelector } from 'react-redux'
import styles from './styles.module.scss'

const DropDown = ({ data = [], languages }) => {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const [selected, setSelected] = useState(router.locale)
    const langData = useSelector(state => state?.globalData?.languages)

    const toggle = () => {
        setOpen(!open)
    }

    const selectLang = (item) => {
        setSelected(item.code)
        setOpen(!open)
    }

    return (
        <div className={styles.dropContainer} onMouseLeave={()=> setOpen(false)} >
            <button onClick={toggle} className={styles.button}>
                {selected.toUpperCase()}
            </button>
            {open && <div className={styles.drop}>
                {langData.map((item, index) => {
                    return <Link href={{
                        pathname: router.pathname,
                        query: router.query
                    }} key={index + 'langague'} locale={item.code}>
                        <a onClick={() => selectLang(item)} className={styles.dropButton}>
                            {item.code.toUpperCase()}
                        </a>
                    </Link>
                })}
            </div>}
        </div>
    )
}


const mapState = state => {
    return ({
        currencies: state.globalData.currencies,
        languages: state.globalData.languages,
    })
}


export default connect(mapState)(DropDown);




