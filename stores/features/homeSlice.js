import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { httpRequest } from '../../helpers/utils';


const URL = '/content/home-page'
export const fetchHomeData = createAsyncThunk('home/content', async () => {
    try {
        const response = await httpRequest.get(URL)
        const { data } = response.data
        return data;
    }
    catch (error) {
        return error.message;
    }
}
)

const initialState = {
    status: "idle",
    loading: true,
    banners: {},
    collections: [],
    faqs: [],
    vendors: [],
    error: null
};


const homeSlice = createSlice({
    name: "homeData",
    initialState,
    reducers: {
        setHomeSlice: (state, action) => {
            state.banners = action.payload.banners;
            state.collections = action.payload.collections;
            state.faqs = action.payload.faqs;
            state.vendors = action.payload.vendors;
            state.status = 'succeeded'
            state.loading = false;
        }

    },
    extraReducers: (builder) => {
        builder.addCase(fetchHomeData.fulfilled, (state, action) => {
            state.banners = action.payload.banners;
            state.collections = action.payload.collections;
            state.faqs = action.payload.faqs;
            state.vendors = action.payload.vendors;
            state.status = 'succeeded'
            state.loading = false;

        })
        builder.addCase(fetchHomeData.rejected, (state, action) => {
            state.status = 'failed'
            state.error = action.error.message
            state.loading = false;

        })
        builder.addCase(fetchHomeData.pending, (state, action) => {
            state.status = 'pending'
            state.loading = true;

        })
    },
})


export const selectBanners = (state) => state.homeSlice.banners
export const selectCollections = (state) => state.homeSlice.collections;
export const selectFaqs = (state) => state.homeSlice.faqs;
export const selectVendors = (state) => state.homeSlice.vendors;
export const selectHomeDataStatus = (state) => state.homeSlice.status;
export const selectHomeDataLoader = (state) => state.homeSlice.loading;
export const selectHomeDataError = (state) => state.homeSlice.error;

export const { setHomeSlice } = homeSlice.actions
export default homeSlice.reducer;



