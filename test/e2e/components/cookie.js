class Cookies {
    constructor(driver) {
        this._driver = driver;
    }

    async get(name) {
        const cookies = await this._driver.manage().getCookies();
        return new Cookie(cookies.find(cookie => {
            return cookie.name === name;
        }));
    }

    async getCookieConsentCookie() {
        return await this.get('vl-cookie-consent-cookie-consent');
    }

    async getCookieConsentDateCookie() {
        return await this.get('vl-cookie-consent-cookie-consent-date');
    }

    async getCookieConsentOptedInFunctionalCookie() {
        return await this.get('vl-cookie-consent-functional');
    }

    async getCookieConsentOptedInSocialCookie() {
        return await this.get('vl-cookie-consent-socialmedia');
    }
}

class Cookie {
    constructor(cookie) {
        if (cookie) {
            this._value = cookie.value;
            delete cookie.value;
            Object.assign(this, cookie);
        }
    }

    get value() {
        return this._value ? JSON.parse(this._value) : undefined;
    }
}

module.exports = {
    Cookie: Cookie,
    Cookies: Cookies
};
