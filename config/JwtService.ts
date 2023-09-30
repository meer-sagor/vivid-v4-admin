const ID_TOKEN_KEY = "access_token" as any;
const ID_USER_KEY = "user" as any;

/**
 * @description get token form localStorage
 */
export const getToken = (): any | null => {
  if (process.client) {
    return window.localStorage.getItem(ID_TOKEN_KEY);
  }
  return null;
};



export const getUser = (): any | null => {
  if (process.client) {
    return window.localStorage.getItem(ID_USER_KEY);
  }
  return null;
};

/**
 * @description save token into localStorage
 * @param token: string
 */
export const saveToken = (token: any): void => {
  window.localStorage.setItem(ID_TOKEN_KEY, token);
};
export const saveUser = (user: any): void => {
  window.localStorage.setItem(ID_USER_KEY, user);
};

/**
 * @description remove token form localStorage
 */
export const destroyToken = (): void => {
  window.localStorage.removeItem(ID_TOKEN_KEY);
};
export const destroyUser = (): void => {
  window.localStorage.removeItem(ID_USER_KEY);
};

export default { getToken, saveToken, destroyToken, getUser, saveUser, destroyUser };
