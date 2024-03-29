import {setCookie, getCookie} from 'cookies-next';
import { setCartSum } from '../stores/features/globalData';
import { errorToast, successToast, warningToast } from './notification';
import {httpRequest} from './utils';
import store from '../stores';
import Router from 'next/router';
import text from "../locales/index"

export const addToFavorites = async (id, type="product") => {
  try {
    const response = await httpRequest.post(`profile/favorite/${type}/${id}`);
    return true
  } catch (error) {
    
    return false
  }
};

export const removeFromFavorites = async (id, type="product") => {
  try {
    const response = await httpRequest.delete(
      `profile/favorite/${type}/${id}/remove`,
    );
    return true
  } catch (error) {
    
    return false
  }
};

const findItem = ({id,hasVariation,type,variationId, localCartArray})=>  { 
  if(type === 'combo') {
    return localCartArray.findIndex(item => item.combo_id === id);
  }
  else if(hasVariation) {
    return localCartArray.findIndex(item => item.variation_id === variationId);
  }
  else if (!hasVariation && type !== 'combo') {
    return localCartArray.findIndex(item => item.product_id === id);
  }
}

const getNewCartItem = ({quantity, id, variationId, type ,hasVariation}) => {
  if(type === 'combo') {
    return {
      combo_id: id,
      quantity: quantity,
    }
  }
  else if(hasVariation) {
    return {
      variation_id: variationId,
      quantity: quantity,
    }
  }
  else if (!hasVariation && type !== 'combo') {
    return {
      product_id: id,
      quantity: quantity,
    }
  }
}
export const getCart = async () => {
  try { 
    const defaultCurrencyCookie = getCookie('currency');

    let defaultCurrency = {};
    defaultCurrency.code= 'AZN';
    if (defaultCurrencyCookie) {
      defaultCurrency = JSON.parse(defaultCurrencyCookie);
    }
    httpRequest.defaults.headers['X-Currency'] = defaultCurrency.code;

    const response =  await httpRequest.get('profile/cart');

    const total = response.data.cart.total;

    store.dispatch(setCartSum(total))

  }
  catch (error) {
    
  }
}

 export const getPrices = async () => {
    try {
      const defaultCurrencyCookie = getCookie('currency');

      let defaultCurrency = {};
      defaultCurrency.code= 'AZN';
      if (defaultCurrencyCookie) {
        defaultCurrency = JSON.parse(defaultCurrencyCookie);
      }
      httpRequest.defaults.headers['X-Currency'] = defaultCurrency.code;
      const localCart =getCookie('nehre-local-cart')
      if(!localCart) {
        return;
      }
      const response = await httpRequest.post('profile/cart/get-guest-cart', {products:JSON.parse(localCart)});
      
      const total = response.data.cart.total;
      store.dispatch(setCartSum(total))
    }
    catch (error) {
      
    }
  }



const addToLocalCart = ({quantity, id, variationId, type ,hasVariation}) => {
  const localCart = getCookie('nehre-local-cart');
  let localCartArray = localCart ? JSON.parse(localCart) : [];
const itemIndex= findItem({id,hasVariation,type,variationId,localCartArray});

if(itemIndex !== -1) {
  
  if(quantity === 0) {
    localCartArray.splice(itemIndex, 1);
  }
  else {
  localCartArray[itemIndex].quantity = quantity;
  }
}else if (itemIndex === -1) {
   const getDataToPush =getNewCartItem({quantity, id, variationId, type ,hasVariation});
   
    localCartArray.push(getDataToPush);
  }
  
    setCookie('nehre-local-cart', JSON.stringify(localCartArray));
   return;
}

export const addToBasket = async ({session, quantity,id, variationId, hasVariation,type} ) => {
  try {
     let response;
    if (session.status !== 'authenticated') {
      addToLocalCart({quantity, id, variationId, type, hasVariation})
      await getPrices();
     return
    }
    if (type === 'combo') {
      response = await httpRequest.post('/profile/cart/add', {
        quantity: quantity,
        combo_id: id,
      });
  }
  else if (hasVariation) {
     response = await httpRequest.post('/profile/cart/add', {
       quantity: quantity,
       product_id: id,
       variation_id: variationId
     });
   } 
     else {
       response = await httpRequest.post('/profile/cart/add', {
         quantity: quantity,
         product_id: id,
       });
     }
     if ([200, 201].includes(response.status)) {
      await getCart();
       return response.data
     }
   } catch (error) {
    const {locale} = Router
    const texts = text[locale]
    
     errorToast(texts.errorTryAgain);
   }
 }