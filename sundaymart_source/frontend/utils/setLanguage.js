import { setCookie } from "nookies";

export const setLanguage = (language) => {
  setCookie(null, "language_id", language.id, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
  setCookie(null, "language_locale", language.locale, {
    maxAge: 30 * 24 * 60 * 60,
    path: "/",
  });
};
