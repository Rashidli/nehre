import { selectCategories, selectCurrencies, selectLanguages, selectSettings, selectGlobalDataError, selectGlobalDataStatus, selectGlobalDataLoader } from "./features/globalData";
import {
    selectBanners,
    selectCollections,
    selectFaqs,
    selectVendors,
    selectHomeDataStatus,
    selectHomeDataLoader,
    selectHomeDataError,
} from './features/homeSlice'

export {
    //global selectors

    selectCategories,
    selectCurrencies,
    selectLanguages,
    selectSettings,
    selectGlobalDataError,
    selectGlobalDataStatus,
    selectGlobalDataLoader,

    //home selectors
    selectBanners,
    selectCollections,
    selectFaqs,
    selectVendors,
    selectHomeDataStatus,
    selectHomeDataLoader,
    selectHomeDataError,

}