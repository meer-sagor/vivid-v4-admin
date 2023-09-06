import type { UseFetchOptions } from "nuxt/app";
import { baseURL, apiURL } from "@/config/environment"

export function useApiFetch<T> (path: string, options: UseFetchOptions<T> = {}) {

  let headers: any = {
    accept: "application/json",
    referer: baseURL
  }

  const token = useCookie("XSRF-TOKEN");

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