import * as yup from 'yup';


export const LoginSchema = yup.object().shape({
  password: yup
    .string()
    .required('Şifrə daxil edin')
    .min(8, 'Şifrə 8 simvoldan az ola bilməz'),
  email: yup
    .string()
    .required('E-poçt daxil edin')
    .email('Düzgün e-poçt daxil edilməyib'),
});

export const RegisterSchema = yup.object().shape({
    userAgreement: yup.bool().required('İstifadəçi razılaşmasını qəbul edin').oneOf([true], 'İstifadəçi razılaşmasını qəbul edin'),
    email: yup.string().required('E-poçt daxil edin').email('Düzgün e-poçt daxil edilməyib'),
    passwordRepeat: yup.string().required('Şifrə təkrarı daxil edin').oneOf([yup.ref('password'), null], 'Şifrələr eyni deyil'),
    password: yup.string().required('Şifrə daxil edin').min(8, 'Şifrə 8 simvoldan az ola bilməz'),
    surname: yup.string().required('Soyad daxil edin'),
    name: yup.string().required('Ad daxil edin'),
})

export const OtpSchema = yup.object().shape({
    otp: yup.string().required('Kod daxil edin').min(6, 'Kod 6 simvoldan az ola bilməz')
})





export const LoginSchemaPhonePassword = yup.object().shape({
    password: yup.string().required('Şifrə daxil edin').min(8, 'Şifrə 8 simvoldan az ola bilməz'),
    phone: yup.string().required('Telefon nömrəsi boş ola bilməz').length(9, 'Telefon nömrəsi 9 rəqəmli olmalıdır')
}
)

export const VendorAnketValidation = yup.object().shape({
    name: yup.string()
        .required('Məlumatlar doldurulmalıdır'),
    surname: yup.string()
        .required('Məlumatlar doldurulmalıdır'),
    patronymic: yup.string()
        .required('Məlumatlar doldurulmalıdır'),
})



export const PhoneSchema = yup.object().shape({
    phone: yup.string().required('Telefon nömrəsi boş ola bilməz').length(9, 'Telefon nömrəsi 9 rəqəmli olmalıdır')
})


export const PhoneLoginScheme = yup.object().shape({
    password: yup.string().required('Şifrə daxil edin').min(8, 'Şifrə 8 simvoldan az ola bilməz'),
    phone: yup.string().required('Telefon nömrəsi boş ola bilməz').length(9, 'Telefon nömrəsi 9 rəqəmli olmalıdır')
})


export const ForgotPassScheme = yup.object().shape({
    passwordRepeat: yup.string().required('Şifrə təkrarı daxil edin').oneOf([yup.ref('password'), null], 'Şifrələr eyni deyil'),
    password: yup.string().required('Şifrə daxil edin').min(8, 'Şifrə 8 simvoldan az ola bilməz'),
})



export const UpdateProfile = yup.object().shape({
    birthday: yup.date(),
    phone: yup.string().required('Telefon nömrəsi boş ola bilməz').length(9, 'Telefon nömrəsi 9 rəqəmli olmalıdır'),
  email: yup
    .string()
    .required('E-poçt daxil edin')
    .email('Düzgün e-poçt daxil edilməyib'),
  surname: yup.string().required('Soyad daxil edin'),
  name: yup.string().required('Ad daxil edin'),
});


export const ChangePassword = yup.object().shape({
    passwordConfirm: yup.string().required('Şifrə təkrarı daxil edin').oneOf([yup.ref('password'), null], 'Şifrələr eyni deyil'),
    password: yup.string().required('Şifrə daxil edin').min(8, 'Şifrə 8 simvoldan az ola bilməz'),
 currentPassword: yup.string().required('Şifrə daxil edin').min(8, 'Şifrə 8 simvoldan az ola bilməz'),
})

export const AddressValidator = yup.object().shape({
    state_id: yup.number().required('Şəhər seçilməyib'),
    region_id: yup.number().required('Rayon seçilməyib').nullable(),
    street_id: yup.number().required('Küçə seçilməyib').nullable(),
    dead_end: yup.string().required('Dalan nömrəsi daxil edilməyib'),
    home: yup.string().required('Bina nömrəsi daxil edilməyib'),
    entrance: yup.string().required('Blok nömrəsi daxil edilməyib'),
    floor: yup.number("Mərtəbə ədəd olmalıdır").required('Mərtəbə daxil edilməyib'),
    flat: yup.string().required('Mənzil daxil edilməyib'),
    intercom: yup.string(),
    note: yup.string().nullable(),
    has_barrier: yup.boolean(),
    isMain: yup.boolean(),
})


export const CheckoutSchema = yup.object().shape({
    name: yup.string().required('Ad daxil edilməyib'),
    surname: yup.string().required('Soyad daxil edilməyib'),
    email: yup.string().required('E-poçt daxil edilməyib').email('Düzgün e-poçt daxil edilməyib'),
    phone: yup.string().required('Telefon nömrəsi boş ola bilməz'),
    payment_method: yup.string().required('Ödəniş növü seçilməyib'),
    delivery_date: yup.string('Tarix seçilməyib').required('Tarix seçilməyib'),
    address: yup.string().nullable().required('Ünvan seçilməyib'),
    // address: yup.object().shape({
    //     state_id: yup.number().required('Şəhər seçilməyib'),
    //     region_id: yup.number().required('Rayon seçilməyib').nullable(),
    //     street_id: yup.number().required('Küçə seçilməyib').nullable(),
    //     dead_end: yup.string().required('Dalan nömrəsi daxil edilməyib'),
    //     home: yup.string().required('Bina nömrəsi daxil edilməyib'),
    //     entrance: yup.string().required('Blok nömrəsi daxil edilməyib'),
    //     floor: yup.string().required('Mərtəbə daxil edilməyib'),
    //     flat: yup.string().required('Mənzil daxil edilməyib'),
    //     intercom: yup.string(),
    //     note: yup.string(),
    //     has_barrier: yup.boolean(),
    // })
})

export const SubscribeEmailSchema = yup.object().shape({
  email: yup
    .string()
    .required('E-poçt daxil edin')
    .email('Düzgün e-poçt daxil edilməyib'),
});
