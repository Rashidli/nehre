import React from 'react';
import { httpRequest } from '../helpers/utils';
import useTranslate from '../hooks/useTranslate';
import styles from '../styles/privacy-policy.module.scss';

export const getServerSideProps = async ({ locale, req }) => {
    httpRequest.defaults.headers['Location'] = locale;
    httpRequest.defaults.headers['X-Currency'] = req.cookies.currency ? JSON.parse(req.cookies.currency).code : 'AZN';

    const response = await httpRequest.get("/content/about");
    const data = response.data.data

    return {
        props: {
            data
        }
    }
}

const WhoWeAre = ({ data }) => {
    const texts = useTranslate()
    const { link, tin, content, description, whoIsContent, companyName, companyAddress, companyOwnerInfo } = data;


    function createMarkup() {
        return { __html: content };
    }


    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <h3 className={styles.pageTitle}>{texts.privacyPolicyText}</h3>
            </div>
           
            <p className={styles.whoIsContent} >
                            Bu Sənəddə “Nehrə MMC” dedikdə,  – “Nehrə” Məhdud Məsuliyyətli Cəmiyyəti nəzərdə tutulur. 
                            <br/><br/> 
                            Bu Sənəddə “İstifadəçi” dedikdə, Veb-sayta həm üzv (müvafiq qaydada qeydiyyatdan keçmiş şəxslər) qismində, həm də üzv olmadan (qeydiyyatdan keçmədən) ziyarətçi kimi daxil olan şəxslər nəzərdə tutulurlar. 
                            <br/><br/> 
                            Biz, sizin Veb-sayta daxil olaraq ondan istifadə etdiyiniz zaman barənizdə Veb-sayta daxil edilmiş məlumatları necə topladığımızı, hansı qaydada istifadə və mühafizə etdiyimizi sizə aydın şəkildə izah edə bilməyimiz üçün bu Sənədi tərtib və təsdiq etmişik. Bu Sənədin hazırlanmasında əsas məqsəd, İstifadəçilərin Veb-saytdan güvənli şəkildə istifadə etmələrini təmin etmək, həmçinin Veb-saytda həyata keçirdikləri hər bir hərəkət zamanı daxil etdikləri fərdi məlumatların konfidensiallığına təminat verildiyinə onları əmin etməkdən ibarətdir. Odur ki, Veb-saytdan istifadə etməzdən əvvəl saytımızın “Məxfilik Siyasəti” ilə tanış olmağınızı tövsiyə edirik. 
                            <br/><br/> 
                            Biz, sizin Veb-sayta daxil olaraq ondan istifadə etdiyiniz zaman barənizdə Veb-sayta daxil edilmiş məlumatları necə topladığımızı, hansı qaydada istifadə və mühafizə etdiyimizi sizə aydın şəkildə izah edə bilməyimiz üçün bu Sənədi tərtib və təsdiq etmişik. Bu Sənədin hazırlanmasında əsas məqsəd, İstifadəçilərin Veb-saytdan güvənli şəkildə istifadə etmələrini təmin etmək, həmçinin Veb-saytda həyata keçirdikləri hər bir hərəkət zamanı daxil etdikləri fərdi məlumatların konfidensiallığına təminat verildiyinə onları əmin etməkdən ibarətdir. Odur ki, Veb-saytdan istifadə etməzdən əvvəl saytımızın “Məxfilik Siyasəti” ilə tanış olmağınızı tövsiyə edirik.
                            <br/>
                            <br/>
                            www.nehra.az veb-saytında İstifadəçi ilə Veb-sayt arasında fərdi məlumat mübadiləsi Azərbaycan Respublikasının Konstitusiyasında təsbit edilmiş əsas insan və vətəndaş hüquq və azadlıqlarına riayət edilməklə, qanunçuluq, , könüllülüyün məcburiliklə uzlaşdırılması prinsiplərinə uyğun həyata keçirilir. 
                            <br/>
                            <br/>
                            İstifadəçiyə aid fərdi məlumatlar onun özü tərəfindən könüllük prinsipinə riayət etməklə təqdim edildiyi andan mühafizə olunur. 
                            <br/>
                            <br/>
                            İstifadəçinin nəzərinə çatdırırıq ki, onun tərəfindən  təqdim edilmiş məlumatlar (adı, soyadı, atasının adı, doğulduğu tarix və yer, cinsi, vətəndaşlığı, telefon nömrəsi və elektron ünvanı, yaşadığı və olduğu yer, ixtisası və iş yeri, məşğul olduğu fəaliyyət növü, ailə vəziyyəti, şəkli və digər məlumatlar)  “Fərdi məlumatlar haqqında” Qanunun 5.2-ci maddəsinə uyğun olaraq tərəfimizdən qorunur və İstifadəçinin özünün yazılı razılığı olmadan və ya qanunla müəyyən edilmiş hallar (“Fərdi məlumatlar haqqında” Qanunun 13-cü maddəsində göstərilən hallar) istisna olmaqla, heç bir halda üçüncü şəxslərə, idarə və təşkilatlara ötürülürmür. 
                            <br/>
                            <br/>
                            Baş vermiş inzibati xətaları, cinayət əməllərini törətmiş şəxsləri ifşa etmək, belə hüquqazidd əməllərin nəticələrini aradan qaldıra bilmək məqsədilə, habelə gələcəkdə baş verə biləcək inzibati xətaların, cinayət əməllərinin qarşısını almaq, cəmiyyəti belə qəsdlərdən qorumaq məqsədilə Veb-sayta daxil edilmiş məlumatlar hüquq-mühafizə və məhkəmə orqanlarının təxirəsalınmaz tədbirləri zamanı və ya rəsmi sorğuları nəticəsində, Azərbaycan Respublikasının qanunvericiliyinin tələblərinə əməl edilməklə, İstifadəçinin razılığı alınmadan, belə orqanlara təqdim edilə bilər.
                            <br/>
                            <br/>
                            Nəzərinizə çatdırırıq ki, Veb-saytımızda müxtəlif digər veb-saytlara, internet platformalara keçidlər yerləşdirilə bilər. Belə keçidlərə daxil olmaqla, orada apardığınız yazışmaların, təqdim etdiyiniz məlumatların konfidensiallığının təmin edilməməsi ehtimalı hər zaman mövcuddur. Həmin veb-saytlarda, internet platformalarda təqdim etdiyiniz məlumatlarınızın, hərəkətlərinizin konfidensiallığına “Nehrə MMC” zəmanət vermir və cavabdehlik daşımır.
                            <br/>
                            <br/>
                            İstənilən halda siz fərdi məlumatlarınızı saytda qeyd etməmək hüququnu özünüzdə saxlayırsınız. Ancaq nəzərə alın ki, Veb-sayt vasitəsi ilə müəyyən hərəkətləri edə bilməyiniz üçün qeydiyyatdan keçməyiniz və qeydiyyatdan keçərkən özünüzə aid müxtəlif məlumatlarınızı daxil etməyiniz zəruridir. Əks halda Veb-saytda nəzərdə tutulmuş imkanlardan istifadə etməyiniz qeyri-mümkün olacaqdır.
                            <br/>
                            <br/>
                            Yuxarıda qeyd olunanlarla yanaşı, həmçinin onu da nəzərinizə çatdırırıq ki, “Nehrə MMC” gələcəkdə istənilən zaman bu “Məxfilik Siyasəti”nə birtərəfli qaydada dəyişiklik etmək hüququnu özündə saxlayır. Belə dəyişikliklərin edilməsi müxtəlif zərurətlərdən əmələ gələ bilər (məsələn: qanunvericiliyə edilmiş müxtəlif dəyişikliklərlə bağlı, istifadəçilərin Veb-saytdan istifadələrinin daha da asanlaşdırılması, müxtəlif kompaniyaların həyata keçirilməsi və s.). Lakin hər bir halda, İstifadəçiyə məxsus fərdi məlumatların konfidensiallığının təmin edilməsi prinsipinin aliliyi Bizim tərəfimizdən hər zaman rəhbər tutulacaqdır.
                            <br/>
                            <br/>
                            Bu sənədlə bağlı hər hansı iradınız, təklif və ya şikayətiniz olarsa, aşağıdakı vasitələrlə Bizimlə əlaqə saxlamağınızı xahiş edirik.
                            <br/>
                            <br/>
                                E-mail:  info@nehra.az;
                            <br/>
                            <br/>
                                Telefon: +994 12 310 00 65
                            <br/>
                            <br/>
                                Ünvan: Azərbaycan, Siyəzən rayon, Zarat kəndi
                            <br/>
                            <br/>
            </p>

        </div>

      
    )
}

export default WhoWeAre