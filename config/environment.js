export const environment = "dev";
const adminURL = "http://localhost:3002/";

export const baseURL = environment === "dev" ? adminURL : adminURL;
export const apiURL = environment === "dev" ? "http://localhost:8000" : "http://localhost:8000";

