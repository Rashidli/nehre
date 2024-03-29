import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { connect, useDispatch } from 'react-redux'
import { setCurrency } from '../../../../../stores/features/globalData'
import styles from './styles.module.scss'
import { getCookie, setCookie } from 'cookies-next';

const currencyObj = {
  "AZN": "₼",
  "USD": "$",
  "RUB": "₽",
}

const DropDown = ({ currencies = [], selectedCurrency }) => {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()

  const selectCurrency = (item) => {
    const selectedCurrecy = currencyObj[item.code]
        dispatch(setCurrency(selectedCurrecy))
        setCookie("currency", item)
        setOpen(!open)
        router.replace(router.asPath, undefined,{scroll: false, shallow:false})

    }

    const toggle = () => {
        setOpen(!open)
    }

    const assignCookieCurrency = () => {
      const defaultCurrencyCookie = getCookie("currency");
      
        if (defaultCurrencyCookie) {
            const defaultCurrency = JSON.parse(defaultCurrencyCookie);
            dispatch(setCurrency(currencyObj[defaultCurrency.code]))
        } else {
            dispatch(setCurrency(currencyObj["AZN"]))
        }
    }

    useEffect(() => {
        assignCookieCurrency()
    }, [])


    return (
      <div className={styles.dropContainer} onMouseLeave={() => setOpen(false)}>
        <button onClick={toggle} className={styles.button}>
          {selectedCurrency}
        </button>
        {open && (
          <div id="myDropdown" className={styles.drop}>
            {currencies.map((item, index) => {
              return (
                <button
                  key={index + 'currency'}
                  onClick={() => selectCurrency(item)}
                  className={styles.dropButton}>
                  {currencyObj[item.code]}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
}


const mapState = state => {
    return ({
        currencies: state.globalData.currencies,
        selectedCurrency: state.globalData.selectedCurrency
    })
}


export default connect(mapState)(DropDown);




