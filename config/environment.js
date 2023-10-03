export const environment = "prod";
const apiDev = "http://localhost:8000";
const apiProd = "http://18.217.130.231";

const localDev = "http://localhost:3002/";
const localProd = "http://18.116.100.219/";

export const baseURL = environment === "dev" ? localDev : localProd;
export const apiURL = environment === "dev" ? apiDev : apiProd;

