const KEY = '__appname_authentication';

export const getAuthDetails = () => JSON.parse(window.localStorage.getItem(KEY)) || {};

export const storeAuthDetails = (data) => window.localStorage.setItem(KEY, JSON.stringify(data));

export const removeAuthDetails = () => window.localStorage.removeItem(KEY);
