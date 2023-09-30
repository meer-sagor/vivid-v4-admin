import type { UseFetchOptions } from "nuxt/app";
import { baseURL, apiURL } from "@/config/environment";
import JwtService from "@/config/JwtService";

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {
  let headers: any = {
    accept: "application/json",
    referer: baseURL,
  };

  // const token = useCookie("XSRF-TOKEN");

  // if (!token.value){
  //   authStore.logout().then(r => console.log(r))
  // }

  // if (token.value) {
  //   headers['X-XSRF-TOKEN'] = token.value as string;
  // }

  // if (process.client) {
  const token = process.client ? JwtService.getToken() : null;
  console.log("my tokkkeeen", JwtService.getToken());

  if (token) {
    headers["Authorization"] = "Bearer " + token;
    headers["Content-Type"] = "application/json";
  }
  // }

  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(["referer"]),
    };
  }

  // useFetch(apiURL + '/api/verify-auth', {
  //   credentials: "include",
  //   watch: false,
  //   ...options,
  //   headers: {
  //     ...headers,
  //     ...options?.headers
  //   },
  // }) .then(async ({error}) => {
  //   const error_data = JSON.parse(JSON.stringify(computed(() => error.value).value))
  //   if (error_data?.statusCode === 401){
  //     JwtService.destroyToken();
  //     JwtService.destroyUser();
  //     return navigateTo("/auth/login", { replace: true })
  //   }
  // })

  console.log("Uzzal: ", headers);
  return useFetch(apiURL + path, {
    credentials: "include",
    watch: false,
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });
}
