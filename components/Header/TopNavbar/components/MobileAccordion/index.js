import Link from 'next/link';
import { connect } from 'react-redux';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from './styles.module.scss';
import useTranslate from '../../../../../hooks/useTranslate';


const  MobileAccordion = ({ toggleMobileHamburgerMenu, categories })=> {
  const texts = useTranslate();
  return (
    // <Accordion defaultActiveKey="0" className={styles.mobileAccordion}>
    //   <Accordion.Item eventKey="0" className={styles.mobileAccordion__mainContainer}>
    //     <Accordion.Header className={styles.mobileAccordion__headerContainer}>
    //       <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="WidgetsIcon"><path d="M13 13v8h8v-8h-8zM3 21h8v-8H3v8zM3 3v8h8V3H3zm13.66-1.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65z"></path></svg>
    //       <h1 className={styles.mobileAccordion__title}>Məhsul Çeşidləri</h1>
    //     </Accordion.Header>
    //     <Accordion.Body className={styles.mobileAccordion__body}>
    //       <ul className={styles.mobileAccordion__container}>
    //         {categories.map(item => {
    //           return (
    //             <>
    //               <li className={styles.mobileAccordion__item} key={item.categoryUUID} onClick={toggleMobileHamburgerMenu}>
    //                 <Link href={`/category/${item.categoryId}`}>
    //                   <a className={styles.mobileAccordion__link}>{item.name}</a>
    //                 </Link>
    //               </li>
    //             </>
    //           )
    //         })}

    //       </ul>
    //     </Accordion.Body>
    //   </Accordion.Item>
    // </Accordion>

    <Accordion className={styles.mobileAccordion}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        className={styles.mobileAccordion__mainContainer}
      >
        <Typography className={styles.mobileAccordion__headerContainer}>
          <svg className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" data-testid="WidgetsIcon">
            <path d="M13 13v8h8v-8h-8zM3 21h8v-8H3v8zM3 3v8h8V3H3zm13.66-1.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65z"></path>
          </svg>
          <h1 className={styles.mobileAccordion__title}>{texts.productKindText}</h1>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography className={styles.mobileAccordion__body}>
          <ul className={styles.mobileAccordion__container}>
            {categories?.map(item => {
              return (
                <>
                  <li className={styles.mobileAccordion__item} key={item.categoryUUID} onClick={toggleMobileHamburgerMenu}>
                    <Link href={`/category/${item.categoryId}`}>
                      <a className={styles.mobileAccordion__link}>{item.name}</a>
                    </Link>
                  </li>
                </>
              )
            })}
          </ul>
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}

const mapState = state => {
  return ({
    categories: state.globalData.categories,
  })
}


export default connect(mapState)(MobileAccordion);
