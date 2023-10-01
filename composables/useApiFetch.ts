import type { UseFetchOptions } from "nuxt/app";
import { baseURL, apiURL } from "@/config/environment";
import JwtService from "@/config/JwtService";

export function useApiFetch<T>(path: string, options: UseFetchOptions<T> = {}) {
  let headers: any = {
    accept: "application/json",
    referer: baseURL,
  };

  const token = process.client ? JwtService.getToken() : null;

  if (token) {
    headers["Authorization"] = "Bearer " + token;
  }


  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(["referer"]),
    };
  }

  // if (token){
  //   useFetch(apiURL + '/api/verify-auth', {
  //     method: "GET",
  //     credentials: "include",
  //     watch: false,
  //     ...options,
  //     headers: {
  //       ...headers,
  //       ...options?.headers
  //     },
  //   }) .then(async ({error}) => {
  //     const error_data = JSON.parse(JSON.stringify(computed(() => error.value).value))
  //     if (error_data?.statusCode === 401){
  //       JwtService.destroyToken();
  //       JwtService.destroyUser();
  //       return navigateTo("/auth/login", { replace: true })
  //     }
  //   })
  // }

  // @ts-ignore
  // if (!options.headers || !options.headers['Content-Type']) {
  //   headers['Content-Type'] = 'application/json';
  // }

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
