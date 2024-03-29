import { configureStore } from '@reduxjs/toolkit'
import { globalDataReducer, homeDataReducer } from "./reducers";

const store = configureStore({
    reducer: {
        globalData: globalDataReducer,
        homeData: homeDataReducer
    },
})


export default store