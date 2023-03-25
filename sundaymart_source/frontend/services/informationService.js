import axiosService from "./axios";

const informationService = {
  translations: (params) =>
    axiosService.get("/rest/translations/paginate", { params }),
  settingsInfo: (params) => request.get("/rest/settings", { params }),
};

export default informationService;
