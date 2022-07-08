// export const baseUrl = `https://pvxdrugs.com/vtu` //staging

export const baseUrl = `https://vtu.payrizone.com` //staging


const urls = {
    AUTH: {
        sign_up: `${baseUrl}/user/signup.php`,
        login: `${baseUrl}/user/login.php`,
        resend_otp: `${baseUrl}/user/resend_token.php`,
        verify_otp: `${baseUrl}/user/verify_email.php`,
        biometric_login: `${baseUrl}/user/fingerprint_login.php`,
    },

    PROFILE: {
        user_profile: `${baseUrl}/user/getprofile.php`,
        upload_image: `${baseUrl}/user/image.php`
    },

    VERIFICATION: {
        verify_email: `${baseUrl}/user/resend_token.php`
    },

    SERVICES: {
        get_services: `${baseUrl}/services/index.php`,
        get_data_and_verify: `${baseUrl}/data/data_fetch.php`
    },

    PHONE_BOOK: {
        get_all_phone_books_and_verify: `${baseUrl}/user/phonebook.php`,
    },

    PIN: {
        set_pin: `${baseUrl}/user/pin.php`,
    },

    PROVIDERS: {
        get_cables: `${baseUrl}/cable/list.php`,
        get_electricity: `${baseUrl}/power/list.php`,
        get_startimes: `${baseUrl}/cable/startimes_packages.php`
    },

    VERIFY: {
        verify_multichoice: `${baseUrl}/cable/verify_multchoic.php`,
        verify_startTimes: `${baseUrl}/cable/verify_startimes.php`,
        verify_meter: `${baseUrl}/power/meter.php`,
        verify_star_times: `${baseUrl}/cable/verify_startimes.php`
    },

    RATE: {
        setting: `${baseUrl}/app/app_settings.php`
    },

    BANKS: {
        get_banks: `${baseUrl}/bank/index.php`,
        payment_proof: `${baseUrl}/bank/proof.php`,
        list_of_banks: `${baseUrl}/bank/other_banks.php`,
        statement_of_account: `${baseUrl}/app/account_statement.php`
    },

    RESET: {
        reset_pin: `${baseUrl}/user/pin.php`,
        reset_password: `${baseUrl}/user/change_password.php`,
        reset_profile: `${baseUrl}user/update_profile.php`,
        change_password: `${baseUrl}/user/reset_password.php`

    },

    HISTORY: {
        get_history: `${baseUrl}/user/history.php`
    },

    FUND: {
        fund_user: `${baseUrl}/user/fund_user.php`,
        pay_electricity: `${baseUrl}/power/topup.php`,
        pay_cable: `${baseUrl}/cable/topup.php`
    },

    AD: {
        get_all_ads: `${baseUrl}/banner/index.php`
    },

    RECHARGE: {
        fund_data_and_airtime: `${baseUrl}/airtime/execute.php`
    },

    SUPPORT: {
        get_all_frequent_questions: `${baseUrl}/app/faqs.php`,
        create_new_tickets: `${baseUrl}/app/tickets.php`,
    },

    TRANSFER: {
        verify_account_tranfser: `${baseUrl}/user/transfer.php`
    },
    NOTIFICATION: {
        get_all_notifications: `${baseUrl}/app/notification.php`,
    },
    VERSION: {
        check_version: `${baseUrl}/app/app_release.php`
    },
    VENDOR: {
        get_all_vendors: `${baseUrl}/vendors/vendors.php`
    }

}


export default urls