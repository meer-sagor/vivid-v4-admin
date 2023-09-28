import type { UseFetchOptions } from "nuxt/app";
import { baseURL, apiURL } from "@/config/environment"
import {useAuthStore} from "~/stores/useAuthStore";

export function useApiFetch<T> (path: string, options: UseFetchOptions<T> = {}) {

  const authStore = useAuthStore();

  let headers: any = {
    accept: "application/json",
    referer: baseURL
  }

  const token = useCookie("XSRF-TOKEN");

  // if (!token.value){
  //   authStore.logout().then(r => console.log(r))
  // }

  if (token.value) {
    headers['X-XSRF-TOKEN'] = token.value as string;
  }

  if (process.server) {
    headers = {
      ...headers,
      ...useRequestHeaders(["referer", "cookie"])
    }
  }

  return useFetch(apiURL + path, {
    credentials: "include",
    watch: false,
    ...options,
    headers: {
      ...headers,
      ...options?.headers
    },
  });
}