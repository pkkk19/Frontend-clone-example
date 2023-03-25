import i18n from "i18next";

i18n.init({
  resources: {},
  ns: "translation",
  defaultNS: "translation",
  fallbackLng: "en",
  debug: false,
  react: {
    wait: true,
  },
});

export default i18n;
