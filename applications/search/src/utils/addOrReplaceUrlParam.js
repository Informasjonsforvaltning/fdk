import qs from "qs";

export function removeParam(key, sourceURL) {
  let rtn = sourceURL.split("?")[0];
  let param;
  let paramsArray = [];
  const queryString =
    sourceURL.indexOf("?") !== -1 ? sourceURL.split("?")[1] : "";
  if (queryString !== "") {
    paramsArray = queryString.split("&");
    for (let i = paramsArray.length - 1; i >= 0; i -= 1) {
      param = paramsArray[i].split("=")[0];
      if (param === key) {
        paramsArray.splice(i, 1);
      }
    }
    rtn = `${rtn}?${paramsArray.join("&")}`;
  }
  return rtn;
}

/**
* Add a URL parameter (or modify if already exists)
* @param {url}   string  url
* @param {param} string  the key to set
* @param {value} string  value
*/
export function addOrReplaceParam(url, param, value) {
  const encodedParam = encodeURIComponent(param);
  const r = `([&?]|&amp;)${encodedParam}\\b(?:=(?:[^&#]*))*`;
  const a = document.createElement("a");
  const regex = new RegExp(r);
  const str = encodedParam + (value ? `=${encodeURIComponent(value)}` : "");
  a.href = url;
  const q = a.search.replace(regex, `$1${str}`);
  if (q === a.search) {
    a.search += (a.search ? "&" : "") + str;
  } else {
    a.search = q;
  }
  if (value === "") {
    return removeParam(encodedParam, url);
  }
  return a.href;
}
export function addOrReplaceParamWithoutEncoding(url, param, value) {
  const r = `([&?]|&amp;)${param}\\b(?:=(?:[^&#]*))*`;
  const a = document.createElement("a");
  const regex = new RegExp(r);
  const str = param + (value ? `=${encodeURIComponent(value)}` : "");
  a.href = url;
  const q = a.search.replace(regex, `$1${str}`);
  if (q === a.search) {
    a.search += (a.search ? "&" : "") + str;
  } else {
    a.search = q;
  }
  if (value === "") {
    return removeParam(param, url);
  }
  return a.href;
}

export function addOrReplaceParamWithoutURL(uri, key, value) {
  let modifiedUri = uri;
  const re = new RegExp(`([?&])${key}=.*?(&|$)`, "i");
  const separator = modifiedUri.indexOf("?") !== -1 ? "&" : "?";
  if (modifiedUri.match(re)) {
    modifiedUri = modifiedUri.replace(re, `$1${key}=${value}$2`);
  } else {
    modifiedUri = `${modifiedUri + separator + key}=${value}`;
  }
  if (value === "") {
    return removeParam(key, modifiedUri);
  }
  return modifiedUri;
}

/**
 * Returns language code from url parameter "lang", if exists.
 * @returns {null}
 */
export function getParamFromUrl(param) {
  const queryObj = qs.parse(window.location.search.substr(1));
  if (queryObj && queryObj[param]) {
    return queryObj[param];
  }
  return null;
}

/**
 * Returns language code from url parameter "lang", if exists.
 * @returns {null}
 */
export function getParamFromString(url, param) {
  const queryObj = qs.parse(url.substr(1));
  if (queryObj && queryObj[param]) {
    return queryObj[param];
  }
  return null;
}
