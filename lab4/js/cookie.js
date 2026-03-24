"use strict";

(function attachCookieUtils(global) {
    function normalizeOptionName(key) {
        const optionMap = {
            path: "Path",
            expires: "Expires",
            maxAge: "Max-Age",
            sameSite: "SameSite",
            secure: "Secure"
        };

        return optionMap[key] || key;
    }

    function buildCookieSegment(key, value) {
        return `${key}=${value}`;
    }

    function setCookie(name, value, options) {
        const settings = {
            path: "/",
            sameSite: "Lax",
            ...options
        };

        let cookieText = buildCookieSegment(
            encodeURIComponent(name),
            encodeURIComponent(value)
        );

        if (settings.expires instanceof Date) {
            settings.expires = settings.expires.toUTCString();
        }

        Object.entries(settings).forEach(([key, optionValue]) => {
            if (optionValue === undefined || optionValue === null || optionValue === false) {
                return;
            }

            const optionName = normalizeOptionName(key);

            if (optionValue === true) {
                cookieText += `; ${optionName}`;
                return;
            }

            cookieText += `; ${buildCookieSegment(optionName, optionValue)}`;
        });

        document.cookie = cookieText;
    }

    function getCookie(name) {
        const encodedName = `${encodeURIComponent(name)}=`;
        const cookieParts = document.cookie ? document.cookie.split("; ") : [];

        for (const cookiePart of cookieParts) {
            if (cookiePart.startsWith(encodedName)) {
                return decodeURIComponent(cookiePart.slice(encodedName.length));
            }
        }

        return null;
    }

    function deleteCookie(name, options) {
        setCookie(name, "", {
            ...options,
            expires: new Date(0)
        });
    }

    global.cookieUtils = {
        setCookie,
        getCookie,
        deleteCookie
    };
})(window);
