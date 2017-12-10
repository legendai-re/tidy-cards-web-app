export class TcApiUrl {

    public static get LOGIN(): string { return 'auth/login'; }
    public static get LOGOUT(): string { return 'auth/logout'; }
    public static get SIGNUP(): string { return 'auth/signup'; }
    public static get CURRENT_USER(): string { return 'auth/currentuser'; }
    public static get UNLINK(): string { return 'auth/unlink'; }
    public static get PASSWORD_UPDATE(): string { return 'auth/password/update'; }

    public static get LANGUAGES(): string { return 'api/languages' ; }
    public static get USERS(): string { return 'api/users' ; }
    public static get VALID_USERNAME(): string { return 'api/users/helpers/valid-username' ; }
    public static get VALID_EMAIL(): string { return 'api/users/helpers/valid-email' ; }
    public static get CONFIRM_EMAIL(): string { return 'api/users/helpers/confirm-email' ; }
    public static get ROLES(): string { return 'api/roles'; }
    public static get IMAGES(): string { return 'api/images' ; }
    public static get COLLECTIONS(): string { return 'api/collections' ; }
    public static get ITEMS(): string { return 'api/items' ; }
    public static get ITEMS_CONTENT_CREATE(): string { return 'api/items/content/create' ; }
    public static get STAR(): string { return 'api/stars' ; }
    public static get RESET_INITIATE(): string { return 'api/reset/initiate'; }
    public static get RESET_COMPLETE(): string { return 'api/reset/complete'; }
    public static get PAYMENT_CHARGE(): string { return 'api/payments/charge'; }

    public static getImageProxyUrl(url){
        return TcApiUrl.IMAGES + '?url=' + encodeURIComponent(url);
    }

}
