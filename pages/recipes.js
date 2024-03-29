import { getSession } from 'next-auth/react';
import Image from 'next/image';
import React, { useCallback, useState } from 'react'
import { PageContainer, RecipeCard } from '../components';
import RecipeFilter from '../components/RecipeFilter';
import { httpRequest } from '../helpers/utils';
import useTranslate from '../hooks/useTranslate';
import styles from '../styles/recipes.module.scss';

export async function getServerSideProps(context) {
     const {query, locale, req} = context;
     const session = await getSession(context);
     if (session) {
       httpRequest.defaults.headers[
         'Authorization'
       ] = `Bearer ${session.user.accessToken}`;
     }
    httpRequest.defaults.headers['Location'] = locale;

    const response = await httpRequest.get(`/receipts`);
    const data = response.data
    return {
        props: {
            data: data
        },
    }
}

const Recipes = ({ data }) => {
    const [recipes, setRecipes] = useState(data.data?.receipts || [])
    const recipeCategories = data.data?.categories || []
    const [nextUrl, setNextUrl] = useState(data.nextUrl)
    const [loader, setLoader] = useState(false)
    const texts = useTranslate();

    const filterCallback = useCallback(async (filter) => {
        try {
          const requestData = {
            ...filter,
            receipt_categories: filter.receipt_categories?.filter(Boolean),
          }
            setLoader(true);
            const response = await httpRequest.get(`/receipts`, {
                params:requestData,
            });
            const data = response.data;
            setRecipes(data.data.receipts)
            setNextUrl(data.nextUrl)
        } catch (error) {

        }
        finally {
            setLoader(false);
        }
    }, [])
    

    const nextUrlCallback = useCallback(async () => {
        try {
            setLoader(true);
            const response = await httpRequest.get(nextUrl);
            const data = response.data.data;
            
            setRecipes((state) => {
                return [...state, ...data]
            })
            
            // todo fix next url here
            setNextUrl(data.nextUrl)
        } catch (error) {

        }
        finally {
            setLoader(false);
        }
    }, [nextUrl]);

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>{texts.recipesText}</h1>
            </div>
            <RecipeFilter categories={recipeCategories} filterCallback={filterCallback} />


            <div className={styles.recipesContainer}>
               
            </div>

            <PageContainer
          loader={loader}
          nextUrl={nextUrl}
          nextUrlCallback={nextUrlCallback}>
          {!!recipes.length ? (
            recipes.map((item, index) => <RecipeCard item={item} key={index + "recipeCard"} />)
          ) : (
            <div className={styles.noProductContainer}>
              <Image
                alt={texts.noProductText}
                src="/animations/noProduct.gif"
                width={300}
                height={300}
              />
              <p>{texts.noProductText}</p>
            </div>
          )}
        </PageContainer>
        </div>
    )
}

export default Recipes