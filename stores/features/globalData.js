import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { httpRequest } from '../../helpers/utils';
import { getSession, signOut } from 'next-auth/react';

const URL = '/content/main'
export const fetchGlobalData = createAsyncThunk('globalData/content', async () => {
    try {
        const session  = await getSession();

        const response = await httpRequest.get(URL, {
            headers: { 
                'Authorizaton': session ?  `Bearer ${session.user.accessToken}` : null
            }
        })
        
        const { data } = response.data
        if(data.authorization.isAuth) { 
            if(!session) { 
                signOut();
            }
        }
        return data
    }
    catch (error) { 
        return error.message;
    }
}
)

const initialState = {
    status: "idle",
    loading: true,
    categories: {},
    currencies: [],
    languages: {},
    selectedCurrency:'\u20BC',
    settings: {},
    deliveryDates: [],
    manufacturer: {},
    labels: [],
    error: null,
    cartSum:0,
};


const globalData = createSlice({
    name: "globalData",
    initialState,
    reducers: {
        setCurrency: (state, action) => {
            state.selectedCurrency = action.payload;

        },
        setGlobalLoader: (state, action) => {
            state.loading = action.payload;
        },
        setCartSum: (state, action) => {
            
            state.cartSum = action.payload;
        }
        
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGlobalData.fulfilled, (state, action) => {
            state.manufacturer = action.payload.manufacturer
            state.categories = action.payload.categories;
            state.currencies = action.payload.currencies;
            state.languages = action.payload.languages;
            state.settings = action.payload.settings;
            state.labels = action.payload.labels;
            state.deliveryDates = action.payload.deliveryDates;
            state.status = 'succeeded'
            state.loading = false;

        })
        builder.addCase(fetchGlobalData.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
            state.loading = false;

        })
        builder.addCase(fetchGlobalData.pending, (state, action) => {
            state.status = 'pending'
            state.loading = true;

        })
    },
})


export const selectCategories = (state) => state.globalData.categories
export const selectCurrencies = (state) => state.globalData.currencies;
export const selectedCurrency = (state) => state.globalData.selectedCurrency;
export const selectLanguages = (state) => state.globalData.languages;
export const selectLabels = (state) => state.globalData.labels;
export const selectSettings = (state) => state.globalData.settings;
export const selectDeliveryDates = (state) => state.globalData.deliveryDates;
export const selectGlobalDataStatus = (state) => state.globalData.status;
export const selectGlobalDataLoader = (state) => state.globalData.loading;
export const selectGlobalDataError = (state) => state.globalData.error;
export const selectCartSum = (state) => state.globalData.cartSum;
export const {setCurrency, setGlobalLoader, setCartSum} = globalData.actions;
export default globalData.reducer;



