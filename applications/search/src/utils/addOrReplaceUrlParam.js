import qs from 'qs';

/**
* Add a URL parameter (or modify if already exists)
* @param {url}   string  url
* @param {param} string  the key to set
* @param {value} string  value
*/
export function addOrReplaceParam(url, param, value) {
   param = encodeURIComponent(param);
   var r = "([&?]|&amp;)" + param + "\\b(?:=(?:[^&#]*))*";
   var a = document.createElement('a');
   var regex = new RegExp(r);
   var str = param + (value ? "=" + encodeURIComponent(value) : "");
   a.href = url;
   var q = a.search.replace(regex, "$1"+str);
   if (q === a.search) {
      a.search += (a.search ? "&" : "") + str;
   } else {
      a.search = q;
   }
   if(value==='') {
     return removeParam(param, url);
   }
   return a.href;
}
export function removeParam(key, sourceURL) {
    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}

/**
 * Returns language code from url parameter "lang", if exists.
 * @returns {null}
 */
export function getParamFromUrl(param) {
  const queryObj = qs.parse(window.location.search.substr(1));
  if (queryObj && queryObj[param]) {
    return queryObj[param];
  } return null;
}
