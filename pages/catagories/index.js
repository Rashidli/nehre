import { getSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CategoryCard } from '../../components';
import { httpRequest } from '../../helpers/utils';
import styles from './styles.module.scss';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Link from 'next/link';
import useTranslate from '../../hooks/useTranslate';


export const getServerSideProps = async (context) => {
  const { query, locale, req } = context;
  const session = await getSession(context);
  if (session) {
    httpRequest.defaults.headers[
      'Authorization'
    ] = `Bearer ${session.user.accessToken}`;
  }
  httpRequest.defaults.headers['Location'] = locale;

  const response = await httpRequest.get('/content/contact');
  const data = response.data.data
  return {
    props: { mapData: data }
  }
}

const AccordionButton = () => {

  return(
    <div className={styles.accordionButton}> 
      <ExpandMoreIcon />
    </div>
  )
}

const Catagories = ({ mapData, settings }) => {
  const [categories, setCategories] = useState();
  const [expanded, setExpanded] = React.useState('panel1');
  const texts  = useTranslate();
  const getData = async () => {
    try {
      const response = await httpRequest.get("/category/categories");
      setCategories(response?.data?.data);
      
    }
    catch (error) {
      
    }
  }

  useEffect(() => {
    getData();
  }, [])

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  




  return (
    <div className={styles.container}>
      <div className={styles.categoriesSidebarContainer}>
        {categories?.map((categoryItem) => (
          <Accordion
            key={categoryItem?.categoryId}
            expanded={expanded === categoryItem?.categoryId}
            onChange={handleChange(categoryItem?.categoryId)}
            expandIcon={<ExpandMoreIcon />}
            sx={{
              border: "none",
              boxShadow: "none",
              outline: "none",
              '&:before': {
                display: 'none',
              }
            }}
            className={styles.accordionCustom}
          >
            <AccordionSummary
              aria-controls={`${categoryItem?.categoryId}-content`}
              id={`${categoryItem?.categoryId}-header`}
              expandIcon={<AccordionButton />}
              sx={{
                border: "none",
                boxShadow: "none",
                outline: "none",
              }}
              className={styles.accordionSummaryCustom}
            >
              <Typography
                className={styles.accordionSummaryHeaderCustom}
              >
                {categoryItem?.name}
              </Typography>
            </AccordionSummary>
            <AccordionDetails className={styles.accordionDetailsCustom}>
              {categoryItem?.subCategories?.map((subCategoryItem) => (
                <Link href={`/category/${categoryItem?.categoryId}`} key={subCategoryItem?.categoryId} >
                  <Typography 
                    className={styles.accordionDetailsHeaderCustom}
                  >
                    {subCategoryItem?.name}
                  </Typography>
                </Link>
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
      <div className={styles.categoryContainer}>
        <h1 className={styles.heading}>{texts.categoriesText}</h1>
        <div className={styles.categoryCardContainer}>
          {
            categories?.map((dataItem) => (
              <CategoryCard key={dataItem?.categoryId} data={dataItem} />
            ))
          }
        </div>
      </div>
    </div >
  )
}

export default Catagories;