import axios from "axios";
import store from "../stores";
//! this is the final form of server reqeust



export const httpRequest = axios.create({
    baseURL: 'https://nehre.codio.az/api/v1',
    timeout: 7500,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        token: 'SeCReTNkkGeDhbVRnzgQRG6HfSVzhCyjPpRqSrYfF2LFBMueryTdFR8',
    },
});

export const productFilterObj = [
  {
    title: 'Polulyarlığa görə',
        filter: { 
            "popularity":true,
        }
    },
    {
        title: 'Əlifba sırasına görə',
        filter: { 
             "alphabetic": true,
        }
            
           
    },
    {
        title: 'Baha',
        filter: {
              "price": 'desc',
        }
            
          
    },
     {
        title: 'Ucuz',
         filter: {
              "price":'asc',
         }
             
            
    },
    {
        title: 'Yeni',
        filter: {
            "new":true,
        }
            
    },
];
