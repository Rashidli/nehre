import { useRouter } from "next/router";
import text from "../locales";

const useTranslate = () => { 
    const router = useRouter();
    const {locale} = router;
    const texts = text[locale];
    return texts;
}

export default useTranslate ;