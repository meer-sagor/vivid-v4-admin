export const environment = "dev";
const apiDev = "http://localhost:8000";
const apiProd = "http://18.119.12.43";

const localDev = "http://localhost:3002/";
const localProd = "http://3.134.82.149/";

export const baseURL = environment === "dev" ? localDev : localProd;
export const apiURL = environment === "dev" ? apiDev : apiProd;

