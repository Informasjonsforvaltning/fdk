webpackJsonp([1,4],{

/***/ 145:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__ = __webpack_require__(589);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__security_authentication_service__ = __webpack_require__(235);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_router__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__environments_environment__ = __webpack_require__(146);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CatalogService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var TEST_CATALOGS = [
    {
        "id": "974760673",
        "title": { "nb": "Datakatalog for Brønnøysundregistrene" },
        "description": { "nb": "Katalog med datasett fra Brønnøysundregistrene" }
    },
    {
        "id": "974761076",
        "title": { "nb": "Skatteetaten" },
        "description": { "nb": "Katalog med datasett fra Skatt" }
    }
];
var CatalogService = (function () {
    function CatalogService(http, router, authenticationService) {
        this.http = http;
        this.router = router;
        this.authenticationService = authenticationService;
        //TODO don't hard code
        this.catalogsUrl = __WEBPACK_IMPORTED_MODULE_5__environments_environment__["a" /* environment */].api + "/catalogs";
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
    }
    CatalogService.prototype.getAll = function () {
        return this.http.get(this.catalogsUrl)
            .toPromise()
            .then(function (response) { return response.json().content; })
            .catch(this.handleError);
    };
    CatalogService.prototype.handleError = function (error) {
        console.error('An error occured', error); //todo implement proper error handling and logging
        return Promise.reject(error.message || error);
    };
    CatalogService.prototype.get = function (id) {
        var url = this.catalogsUrl + "/" + id + "/";
        return this.http.get(url)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    CatalogService.prototype.save = function (catalog) {
        var url = this.catalogsUrl + "/" + catalog.id + "/";
        var authorization = localStorage.getItem("authorization");
        this.headers.append("Authorization", "Basic " + authorization);
        return this.http
            .put(url, JSON.stringify(catalog), { headers: this.headers })
            .toPromise()
            .then(function () { return catalog; })
            .catch(this.handleError);
    };
    CatalogService.prototype.clone = function (object) {
        return JSON.parse(JSON.stringify(object));
    };
    CatalogService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_4__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__security_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__security_authentication_service__["a" /* AuthenticationService */]) === 'function' && _c) || Object])
    ], CatalogService);
    return CatalogService;
    var _a, _b, _c;
}());
//# sourceMappingURL=D:/git/fdk/registrering-gui/src/catalog.service.js.map

/***/ }),

/***/ 146:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
var environment = {
    production: false,
    envName: 'dev',
    api: 'http://localhost:8099'
};
//# sourceMappingURL=D:/git/fdk/registrering-gui/src/environment.js.map

/***/ }),

/***/ 234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__ = __webpack_require__(589);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(146);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatasetService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TEST_DATASETS = [
    {
        "id": "1001",
        "title": {
            "nb": "Enhetsregisteret testdatasett"
        },
        "description": {
            "nb": "Datasett med mange attributter"
        },
        "catalog": "974760673",
        "_lastModified": "2012-04-23"
    }
];
var DatasetService = (function () {
    function DatasetService(http) {
        this.http = http;
        this.catalogsUrl = __WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].api + "/catalogs";
        this.datasetPath = "/datasets/";
        this.headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]({ 'Content-Type': 'application/json' });
    }
    DatasetService.prototype.getAll = function (catId) {
        var datasetUrl = this.catalogsUrl + "/" + catId + "/" + this.datasetPath;
        return this.http.get(datasetUrl)
            .toPromise()
            .then(function (response) { return response.json().content; })
            .catch(this.handleError);
    };
    DatasetService.prototype.handleError = function (error) {
        console.error('An error occured', error); //todo implement proper error handling and logging
        return Promise.reject(error.message || error);
    };
    DatasetService.prototype.get = function (catId, datasetId) {
        var datasetUrl = this.catalogsUrl + "/" + catId + "/" + this.datasetPath + datasetId + "/";
        return this.http.get(datasetUrl)
            .toPromise()
            .then(function (response) { return response.json(); })
            .catch(this.handleError);
    };
    DatasetService.prototype.save = function (catId, dataset) {
        var datasetUrl = this.catalogsUrl + "/" + catId + this.datasetPath + dataset.id + "/";
        var authorization = localStorage.getItem("authorization");
        this.headers.append("Authorization", "Basic " + authorization);
        return this.http
            .put(datasetUrl, JSON.stringify(dataset), { headers: this.headers })
            .toPromise()
            .then(function () { return dataset; })
            .catch(this.handleError);
    };
    DatasetService.prototype.create = function (catId) {
        var created;
        var authorization = localStorage.getItem("authorization");
        this.headers.append("Authorization", "Basic " + authorization);
        var datasetUrl = this.catalogsUrl + "/" + catId + this.datasetPath;
        console.debug(datasetUrl);
        return this.http
            .post(datasetUrl, {}, { headers: this.headers })
            .toPromise()
            .then(function (res) { return res.json(); })
            .catch(this.handleError);
    };
    DatasetService.prototype.clone = function (object) {
        return JSON.parse(JSON.stringify(object));
    };
    DatasetService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === 'function' && _a) || Object])
    ], DatasetService);
    return DatasetService;
    var _a;
}());
//# sourceMappingURL=D:/git/fdk/registrering-gui/src/dataset.service.js.map

/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(588);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(146);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthenticationService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AuthenticationService = (function () {
    function AuthenticationService(http) {
        this.http = http;
        // var authorization: string;
        // this.token = currentUser && currentUser.token;
    }
    AuthenticationService.prototype.login = function (username, password) {
        var _this = this;
        var headers = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* Headers */]();
        var authorization = btoa(username + ":" + password);
        headers.append("Authorization", "Basic " + authorization);
        return this.http.post(__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].api + '/catalogs/login', '', { headers: headers })
            .map(function (response) {
            // login successful if there's a jwt token in the response
            if (response.ok) {
                // store username and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('authorization', authorization);
                localStorage.setItem('username', response.text());
                _this.authorization = authorization;
                // return true to indicate successful login
                return true;
            }
            else {
                // return false to indicate failed login
                return false;
            }
        });
    };
    AuthenticationService.prototype.logout = function () {
        // clear token remove user from local storage to log user out
        this.authorization = null;
        localStorage.removeItem('authorization');
        localStorage.removeItem('username');
    };
    AuthenticationService = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Http */]) === 'function' && _a) || Object])
    ], AuthenticationService);
    return AuthenticationService;
    var _a;
}());
//# sourceMappingURL=D:/git/fdk/registrering-gui/src/authentication.service.js.map

/***/ }),

/***/ 252:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "/*  A D J U S T M E N T S  */\r\n\r\n.fdk-middle {\r\n\tvertical-align: middle;\r\n}\r\n\r\n/*  H E A D E R   &   F O O T E R   &   C O N T A I N E R  */\r\n\r\nsection {\r\n    height: auto;\r\n}\r\n\r\n.fdk-header-beta {\r\n    background-color: #5A6778;\r\n    padding: 8px;\r\n    margin: 0px;\r\n    font-size: 14px;\r\n    font-weight: 400;\r\n    color: #fff;\r\n    text-align: center;\r\n}\r\n\r\n.fdk-header-menu-fullwidth {\r\n\twidth: 100%;\r\n\theight: 57px;\r\n\tborder-bottom: 1px solid #F2F3F7;\r\n\tmargin-bottom: 20px;\r\n\tpadding: 10px 0px 10px 0px;\r\n}\r\n\r\n.fdk-header-menu {\r\n    background-color: #fff;\r\n    width: 100%;\r\n    height: 56px;\r\n    padding: 10px 0px;\r\n}\r\n\r\nfooter.fdk-footer {\r\n    border-top: 1px solid #C8CDD4;\r\n    background-color: #fff;\r\n    padding: 20px 0px 10px 0px;\r\n    margin-top: 100px;\r\n    text-align: center;\r\n}\r\n\r\n.fdk-footer-logo {\r\n    -ms-flex-line-pack: center;\r\n        align-content: center;\r\n    margin: 0px 20px 0px 20px;\r\n}\r\n\r\n.container {\r\n    position: relative;\r\n    padding: 0px 15px;\r\n}\r\n\r\n/*  I N P U T  */\r\n\r\ninput.fdk-search {\r\n    color: #5A6778;\r\n    border: 1px solid #5A6778;\r\n    border-radius: 5px;\r\n    width: 100%;\r\n    padding: 10px 15px 10px 15px;\r\n    font-size: 28px;\r\n    margin: 20px 0px 20px 0px;\r\n}\r\n\r\n::-webkit-input-placeholder { /* PLACEHOLDER COLOR FOR: WebKit, Blink, Edge */\r\n    color: #C8CDD4;\r\n}\r\n\r\n:-moz-placeholder { /* PLACEHOLDER COLOR FOR: Mozilla Firefox 4 to 18 */\r\n   color: #C8CDD4;\r\n   opacity: 1;\r\n}\r\n\r\n::-moz-placeholder { /* PLACEHOLDER COLOR FOR: Mozilla Firefox 19+ */\r\n   color: #C8CDD4;\r\n   opacity: 1;\r\n}\r\n\r\n:-ms-input-placeholder { /* PLACEHOLDER COLOR FOR: Internet Explorer 10-11 */\r\n   color: #C8CDD4;\r\n}\r\n\r\n/*  D R O P D O W N   U N I V E R S A L  */\r\n\r\n.dropdown-menu {\r\n    min-width: auto;\r\n    padding: 0px;\r\n    border: none;\r\n    right: 0;\r\n    left: auto;\r\n}\r\n\r\n.dropdown-menu > li > a {\r\n    padding: 10px 15px;\r\n    background-image: none;\r\n}\r\n\r\n/*  D R O P D O W N   M E N U  */\r\n\r\ni.fdk-fa-menu { /* Menu icon */\r\n\tcolor: #5A6778;\r\n}\r\n\r\n.fdk-dropdown-toggle-menu > a:hover > i.fdk-fa-menu { /* Hover for menu icon */\r\n\tcolor: #213B4C;\r\n}\r\n\r\n.fdk-dropdown-toggle-menu > a:focus > i.fdk-fa-menu { /* Focus for menu icon */\r\n\tcolor: #213B4C;\r\n}\r\n\r\n.fdk-dropdown-toggle-menu {\r\n    position: relative;\r\n    right: 0;\r\n    z-index: 2;\r\n    float: right;\r\n    margin-left: 15px;\r\n}\r\n\r\n.fdk-dropdown-toggle-menu > a {\r\n    color: #213B4C;\r\n    font-size: 34px;\r\n    line-height: 34px;\r\n    text-decoration: none;\r\n}\r\n\r\n.fdk-dropdown-toggle-menu > a:hover {\r\n    color: #5A6778;\r\n}\r\n\r\n.fdk-dropdown-toggle-menu > a:focus {\r\n    text-decoration: none;\r\n}\r\n\r\n.fdk-dropdown-menu {\r\n    margin-top: 5px;\r\n}\r\n\r\n.fdk-dropdown-menu li {\r\n    font-size: 14px;\r\n    background-color: #213B4C;\r\n}\r\n\r\n.fdk-dropdown-menu > li > a {\r\n    color: #fff;\r\n    text-decoration: none;\r\n}\r\n\r\n.fdk-dropdown-menu > li > a:hover {\r\n    color: #213B4C;\r\n}\r\n\r\n.fdk-dropdown-menu:after {\r\n    position: absolute;\r\n    top: -6px;\r\n    right: 10px;\r\n    display: inline-block;\r\n    border-right: 6px solid transparent;\r\n    border-bottom: 6px solid #213B4C;\r\n    border-left: 6px solid transparent;\r\n    content: '';\r\n}\r\n\r\n/*  D R O P D O W N   L A N G U A G E  */\r\n\r\n.fdk-container-dropdown-language {\r\n    position: relative;\r\n    float: right;\r\n    z-index: 2;\r\n}\r\n\r\n.fdk-dropdown-toggle-language { /* Menu button */\r\n    background-image: none;\r\n    background-color: #fff;\r\n    border: 1px solid #C8CDD4;\r\n    border-radius: 20px;\r\n    padding: 8px 10px 8px 10px;\r\n    margin-bottom: 0px;\r\n    font-size: 14px;\r\n    line-height: 14px;\r\n    color: #5A6778;\r\n    margin-bottom: 5px;\r\n}\r\n\r\n.fdk-dropdown-toggle-language:hover { /*Menu button hover */\r\n    background-color: #F2F3F7;\r\n    border: 1px solid #C8CDD4;\r\n    color: #5A6778;\r\n}\r\n\r\n.fdk-dropdown-toggle-language:focus {\r\n    border: 1px solid #C8CDD4;\r\n    color: #5A6778;\r\n}\r\n\r\n.fdk-dropdown-language {\r\n    width: auto;\r\n    background-color: #F2F3F7;\r\n}\r\n\r\n.fdk-dropdown-language > ul {\r\n    background-color: #F2F3F7;\r\n    color: #5A6778;\r\n}\r\n\r\n.fdk-dropdown-language > li > a {\r\n    color: #5A6778;\r\n    font-size: 12px;\r\n    text-decoration: none;\r\n}\r\n\r\n.fdk-dropdown-language > li > a:hover {\r\n    color: #5A6778;\r\n    font-size: 12px;\r\n    text-decoration: none;\r\n}\r\n\r\n.fdk-dropdown-language-flag {\r\n    margin-right: 5px;\r\n    width: 18px;\r\n}\r\n\r\n/*  L A B E L S   &   B U T T O N S  */\r\n\r\n.fdk-label-default {\r\n    background-color: #fff;\r\n    color: #5A6778;\r\n\t\tfont-size: 14px;\r\n    line-height: 16px;\r\n    font-weight: 400;\r\n    border: 1px solid #5A6778;\r\n    border-radius: 20px;\r\n    padding: 5px 12px 5px 12px;\r\n    margin: 0px 2px 6px 0px;\r\n    display: inline-block;\r\n}\r\n\r\n.fdk-label-default:hover {\r\n    background-color: #5A6778;\r\n    color: #fff;\r\n}\r\n\r\n/*  S E A R C H   R E S U L T  */\r\n\r\n.fdk-search-result-container {\r\n  background-color: #F2F3F7;\r\n  margin: 0px 0px 10px 0px;\r\n  padding: 40px;\r\n  border-radius: 5px;\r\n  border: 0px;\r\n}\r\n\r\n.fdk-search-result-container:hover {\r\n  background-color: #C8CDD4;\r\n}\r\n\r\n/*  T Y P O G R A P H Y  */\r\n\r\nh1 {\r\n    font-size: 36px;\r\n    line-height: 40px;\r\n    font-weight: 700;\r\n    color: #213B4C;\r\n    margin: 0px 0px 12px 0px;\r\n}\r\n\r\nh1.fdk-heading {\r\n\tfont-size: 22px;\r\n\tline-height: 40px;\r\n    text-align: center;\r\n}\r\n\r\nh1.fdk-heading-small {\r\n    text-align: center;\r\n    font-size: 24px;\r\n    line-height: 28px;\r\n    float: left;\r\n    margin: 0px;\r\n}\r\n\r\nh2 {\r\n    color: #213B4C;\r\n    font-size: 22px;\r\n    line-height: 26px;\r\n    font-weight: 700;\r\n    margin: 0px 0px 12px 0px;\r\n}\r\n\r\nh2.regular {\r\n    font-weight: 400;\r\n}\r\n\r\nh3 {\r\n    color: #213B4C;\r\n    font-size: 22px;\r\n    line-height: 26px;\r\n    font-weight: 400;\r\n    margin: 0px 0px 13px 0px;\r\n    padding: 0px 0px 13px 0px;\r\n    border-bottom: 1px solid #213B4C;\r\n}\r\n\r\nh4 {\r\n    color: #213B4C;\r\n    font-size: 16px;\r\n    line-height: 24px;\r\n    font-weight: 700;\r\n    margin: 0px 0px 12px 0px;\r\n}\r\n\r\nh4.register {\r\n    color: #fff;\r\n    margin: 0px;\r\n    padding: 0px;\r\n}\r\n\r\np {\r\n    color: #5A6778;\r\n    font-weight: 400;\r\n    font-size: 16px;\r\n    line-height: 24px;\r\n    margin: 0px 0px 12px 0px;\r\n}\r\n\r\np > a {\r\n    color: #5A6778;\r\n    font-weight: 700;\r\n    text-decoration: underline;\r\n}\r\n\r\np > a:hover {\r\n    text-decoration: none;\r\n    color: #5A6778;\r\n}\r\n\r\na.white-link {\r\n    color: #fff;\r\n    text-decoration: underline;\r\n}\r\n\r\na.white-link:hover {\r\n    color: #C8CDD4;\r\n}\r\n\r\np.fdk-single-line {\r\n    margin: 0;\r\n}\r\n\r\np.ingress {\r\n    font-size: 22px;\r\n    line-height: 30px;\r\n    font-weight: 300;\r\n}\r\n\r\n.fdk-text-white {\r\n\tcolor: white;\r\n}\r\n\r\n.fdk-text-right {\r\n\t\ttext-align: right;\r\n}\r\n\r\n.fdk-text-center {\r\n\ttext-align: center;\r\n}\r\n\r\n.fdk-text-regular {\r\n\tfont-weight: 400px;\r\n}\r\n\r\n/*  F O N T   A W E S O M E  */\r\n\r\ni.fdk-fa-button {\r\n\tmargin-left: 5px;\r\n\tcolor: #5A6778;\r\n}\r\n\r\n.fdk-label-default:hover > i.fdk-fa-button { /* Hovering for labels with font awesome icons */\r\n\tcolor: #fff;\r\n}\r\n\r\n/*  G E NE R A L   C S S  */\r\n.fdk-no-margin {\r\n\tmargin: 0px;\r\n}\r\n\r\n.fdk-extra-margin-top {\r\n\tmargin-top: 30px;\r\n}\r\n\r\n/*  O V E R R I D E S  */\r\n\r\n@media screen and (min-width: 768px) {\r\n  .jumbotron .h1, .jumbotron h1 {\r\n    font-size: 63px;\r\n  }\r\n\r\n  .btn-default {\r\n    text-shadow: none;\r\n  }\r\n\r\n  hr {\r\n    margin: 30px 0px 30px 0px;\r\n  }\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 253:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "/*  C O N T A I N E R S  */\r\n\r\n.fdk-container-register-switch {\r\n\theight: 32px;\r\n\tmargin-bottom: 20px;\r\n}\r\n\r\n.fdk-container-register {\r\n\twidth: 60%;\r\n\tpadding: 0px 15px 0px 0px;\r\n\tmargin: 0px;\r\n\tfloat: left;\r\n}\r\n\r\n/*  P A N E L S  */\r\n\r\n.fdk-panel {\r\n\tborder: none;\r\n}\r\n\r\n.fdk-panel-big-heading {\r\n\tbackground-color: #213B4C;\r\n\tpadding: 12px;\r\n\tcolor: #fff;\r\n\tborder-radius: 5px 5px 0px 0px;\r\n}\r\n\r\n.fdk-panel-big-body {\r\n\tbackground-color: #F2F3F7;\r\n\tpadding: 20px 25px 15px 25px;\r\n\tborder-radius: 0px 0px 5px 5px;\r\n}\r\n\r\n.fdk-panel-heading {\r\n\tbackground-color: #213B4C;\r\n\tpadding: 12px 15px 8px 15px;\r\n\tcolor: #fff;\r\n\tborder-radius: 5px 5px 0px 0px\r\n}\r\n\r\n.fdk-panel-body {\r\n\tbackground-color: #F2F3F7;\r\n\tpadding: 15px;\r\n\tborder-top: 1px solid #213B4C;\r\n\tborder-radius: 0px 0px 5px 5px;\r\n}\r\n\r\n.fdk-panel-button {\r\n  background-color: #F2F3F7;\r\n  padding: 15px;\r\n  border-radius: 0px 0px 5px 5px;\r\n}\r\n\r\n/*  T A B L E  */\r\n\r\ntable.fdk-register {\r\n\twidth: 100%;\r\n\tmargin: 0px;\r\n\tpadding: 0px;\r\n}\r\n\r\ntd.fdk-register {\r\n\theight: auto;\r\n\tvertical-align: top;\r\n\tpadding: 0px 0px 6px 5px;\r\n}\r\n\r\ntd.fdk-register-dataset-1 {\r\n\twidth: 26%;\r\n\tfont-weight: 700;\r\n\tpadding: 8px 0px 0px 0px;\r\n}\r\n\r\ntd.fdk-register-dataset-2 {\r\n\twidth: 68%;\r\n\tpadding: 0px 0px 6px 0px;\r\n}\r\n\r\ntd.fdk-register-dataset-3 {\r\n\twidth: 6%;\r\n\tpadding: 2px 0px 0px 0px;\r\n}\r\n\r\ntd.fdk-register-datacatalogue-1 {\r\n\twidth: 70%;\r\n\tpadding: 2px 0px 0px 0px;\r\n}\r\n\r\ntd.fdk-register-datacatalogue-1 {\r\n\twidth: 30%;\r\n\tpadding: 0px;\r\n}\r\n\r\n.fdk-register-divider {\r\n\tborder-top: 1px solid red;\r\n}\r\n\r\n.fdk-table-hover > tbody > tr:hover {\r\n  background-color: #C8CDD4;\r\n}\r\n\r\ntr.fdk-row-padding > td {\r\n  padding-top: 5px;\r\n  padding-bottom: 5px;\r\n}\r\n\r\n/*  I N P U T   F I E L D   &   T E X T   A R E A  */\r\n\r\ninput.fdk-register-h1 {\r\n    background-color: #213B4C;\r\n\t\tborder: 1px solid #213B4C;\r\n\t\tfont-size: 36px;\r\n\t\tcolor: #fff;\r\n    width: 100%;\r\n    padding: 2px 10px 0px 10px;\r\n\t\tmargin: 0px;\r\n}\r\n\r\ninput.fdk-register-h1:hover {\r\n\tborder: 1px solid #fff;\r\n\tborder-radius: 5px;\r\n}\r\n\r\ninput.fdk-register-h1:focus {\r\n\tborder: 1px solid #fff;\r\n\tborder-radius: 5px;\r\n}\r\n\r\ntextarea.fdk-register-h3 {\r\n    background-color: #F2F3F7;\r\n    border: 1px solid #F2F3F7;\r\n\t\tborder-radius: 5px;\r\n\t\tfont-size: 20px;\r\n\t\tfont-weight: 300;\r\n\t\tcolor: #213B4C;\r\n    width: 100%;\r\n\t\theight: 130px;\r\n\t\tmargin: 0px;\r\n\t\tpadding: 5px;\r\n}\r\n\r\ntextarea.fdk-register-h3:hover{\r\n\tborder: 1px solid #5A6778;\r\n\tbackground-color: #fff;\r\n}\r\n\r\ntextarea.fdk-register-h3:focus{\r\n\tborder: 1px solid #5A6778;\r\n\tbackground-color: #fff;\r\n}\r\n\r\ninput.fdk-register-p {\r\n    background-color: #F2F3F7;\r\n    border: 1px solid #F2F3F7;\r\n    border-radius: 5px;\r\n    width: 100%;\r\n    padding: 5px 5px 5px 5px;\r\n\t\tmargin: 0px;\r\n}\r\n\r\ninput.fdk-register-p:hover {\r\n\tborder: 1px solid #5A6778;\r\n\tbackground-color: #fff;\r\n}\r\n\r\ninput.fdk-register-p:focus {\r\n\tborder: 1px solid #5A6778;\r\n\tbackground-color: #fff;\r\n}\r\n\r\ntextarea.fdk-register-h4 {\r\n\r\n}\r\n\r\n/*  I C O N S  */\r\n\r\nimg.fdk-register-icon {\r\n\theight: 28px;\r\n\twidth: 28px;\r\n\tfloat: right;\r\n\tborder: none;\r\n}\r\n\r\nimg.fdk-icon-check-dark {\r\n\tbackground-image: url(\"/assets/img/icons/icon-check-dark.png\");\r\n}\r\n\r\nimg.fdk-icon-attention-dark {\r\n\tbackground-image: url(\"/assets/img/icons/icon-attention-dark.png\");\r\n}\r\n\r\nimg.fdk-icon-warning-dark {\r\n\tbackground-image: url(\"/assets/img/icons/icon-warning-dark.png\");\r\n}\r\n\r\n/*  F O N T S  */\r\n\r\np.register {\r\n\tpadding: 0px;\r\n}\r\n\r\n\r\n/*  O T H E R  */\r\n\r\n.fdk-vertical-align {\r\n\tvertical-align: middle;\r\n}\r\n", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 412:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__catalog_service__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_switchMap__ = __webpack_require__(827);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_switchMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_switchMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dataset_dataset_service__ = __webpack_require__(234);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CatalogComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CatalogComponent = (function () {
    function CatalogComponent(route, router, service, datasetService) {
        this.route = route;
        this.router = router;
        this.service = service;
        this.datasetService = datasetService;
        this.title = 'Registrer katalog';
    }
    CatalogComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.language = 'nb';
        // snapshot alternative
        var id = this.route.snapshot.params['cat_id'];
        this.service.get(id).then(function (catalog) { return _this.catalog = catalog; });
        this.datasetService.getAll(id).then(function (datasets) { return _this.datasets = datasets; });
    };
    CatalogComponent.prototype.save = function () {
        var _this = this;
        this.service.save(this.catalog)
            .then(function () {
            _this.saved = true;
            var d = new Date();
            _this.lastSaved = ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2) + ':' + ("0" + d.getSeconds()).slice(-2);
        });
    };
    CatalogComponent.prototype.selectDataset = function (catalog, dataset) {
        this.router.navigate(['/catalogs', catalog.id, 'datasets', dataset.id]);
    };
    CatalogComponent.prototype.formatDate = function (dateToFormat) {
        if (dateToFormat == null) {
            return new Date('01-01-2000');
        }
        return new Date(dateToFormat);
    };
    CatalogComponent.prototype.valuechange = function (a, b, c) {
        var that = this;
        this.delay(function () { that.save.call(that); }, 1000);
    };
    CatalogComponent.prototype.delay = function (callback, ms) {
        clearTimeout(this.timer);
        this.timer = setTimeout(callback, ms);
    };
    ;
    CatalogComponent.prototype.getTitle = function (dataset) {
        if (dataset.title == null) {
            return '';
        }
        return dataset.title[this.language];
    };
    CatalogComponent.prototype.newDataset = function () {
        var _this = this;
        this.datasetService.create(this.catalog.id)
            .then(function (dataset) { return _this.selectDataset(_this.catalog, dataset); });
    };
    CatalogComponent.prototype.back = function () {
        this.router.navigate(['/']);
    };
    CatalogComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Component */])({
            selector: 'app-catalog',
            template: __webpack_require__(816),
            styles: [__webpack_require__(787), __webpack_require__(252), __webpack_require__(253)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__catalog_service__["a" /* CatalogService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__catalog_service__["a" /* CatalogService */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__dataset_dataset_service__["a" /* DatasetService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_4__dataset_dataset_service__["a" /* DatasetService */]) === 'function' && _d) || Object])
    ], CatalogComponent);
    return CatalogComponent;
    var _a, _b, _c, _d;
}());
//# sourceMappingURL=D:/git/fdk/registrering-gui/src/catalog.component.js.map

/***/ }),

/***/ 413:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dataset_service__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__catalog_catalog_service__ = __webpack_require__(145);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DatasetComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var DatasetComponent = (function () {
    function DatasetComponent(route, router, service, catalogService) {
        this.route = route;
        this.router = router;
        this.service = service;
        this.catalogService = catalogService;
        this.title = 'Registrer datasett';
    }
    DatasetComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.language = 'nb';
        this.timer = 0;
        // snapshot alternative
        this.catId = this.route.snapshot.params['cat_id'];
        var datasetId = this.route.snapshot.params['dataset_id'];
        this.service.get(this.catId, datasetId).then(function (dataset) { return _this.dataset = dataset; });
    };
    DatasetComponent.prototype.save = function () {
        var _this = this;
        this.service.save(this.catId, this.dataset)
            .then(function () {
            _this.saved = true;
            var d = new Date();
            _this.lastSaved = ("0" + d.getHours()).slice(-2) + ':' + ("0" + d.getMinutes()).slice(-2) + ':' + ("0" + d.getSeconds()).slice(-2);
        });
    };
    DatasetComponent.prototype.valuechange = function (a, b, c) {
        var that = this;
        this.delay(function () { that.save.call(that); }, 1000);
    };
    DatasetComponent.prototype.delay = function (callback, ms) {
        clearTimeout(this.timer);
        this.timer = setTimeout(callback, ms);
    };
    ;
    DatasetComponent.prototype.back = function () {
        this.router.navigate(['/catalogs', this.catId]);
    };
    DatasetComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Component */])({
            selector: 'app-dataset',
            template: __webpack_require__(817),
            styles: [__webpack_require__(788), __webpack_require__(252), __webpack_require__(253)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["c" /* ActivatedRoute */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__dataset_service__["a" /* DatasetService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__dataset_service__["a" /* DatasetService */]) === 'function' && _c) || Object, (typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__catalog_catalog_service__["a" /* CatalogService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__catalog_catalog_service__["a" /* CatalogService */]) === 'function' && _d) || Object])
    ], DatasetComponent);
    return DatasetComponent;
    var _a, _b, _c, _d;
}());
//# sourceMappingURL=D:/git/fdk/registrering-gui/src/dataset.component.js.map

/***/ }),

/***/ 414:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__catalog_catalog_service__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_router__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__security_authentication_service__ = __webpack_require__(235);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StartComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var StartComponent = (function () {
    function StartComponent(_catalogService, router, authenticationService) {
        this._catalogService = _catalogService;
        this.router = router;
        this.authenticationService = authenticationService;
        this.catalogs = [];
        this.model = {};
        this.loading = false;
        this.error = '';
    }
    StartComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._catalogService.getAll()
            .then(function (catalogs) { return _this.catalogs = catalogs; });
        this.authenticationService.logout();
    };
    StartComponent.prototype.selectCatalog = function (catalog) {
        this.router.navigate(['/catalogs', catalog.id]);
    };
    StartComponent.prototype.login = function () {
        var _this = this;
        this.loading = true;
        this.authenticationService.login(this.model.username, this.model.password)
            .subscribe(function (result) {
            if (result === true) {
                // login successful
                _this.router.navigate(['/']);
            }
            else {
                // login failed
                _this.error = 'Innlogging feilet';
                _this.loading = false;
            }
        });
    };
    StartComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Component */])({
            selector: 'app-start',
            template: __webpack_require__(818),
            styles: [__webpack_require__(789)]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__catalog_catalog_service__["a" /* CatalogService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__catalog_catalog_service__["a" /* CatalogService */]) === 'function' && _a) || Object, (typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_2__angular_router__["b" /* Router */]) === 'function' && _b) || Object, (typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__security_authentication_service__["a" /* AuthenticationService */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_3__security_authentication_service__["a" /* AuthenticationService */]) === 'function' && _c) || Object])
    ], StartComponent);
    return StartComponent;
    var _a, _b, _c;
}());
//# sourceMappingURL=D:/git/fdk/registrering-gui/src/start.component.js.map

/***/ }),

/***/ 608:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 608;


/***/ }),

/***/ 609:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(352);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(729);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(146);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=D:/git/fdk/registrering-gui/src/main.js.map

/***/ }),

/***/ 728:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var AppComponent = (function () {
    function AppComponent() {
        this.title = 'Registrer datakatalog';
    }
    AppComponent.prototype.getUsername = function () {
        return localStorage.getItem('username');
    };
    AppComponent = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_3" /* Component */])({
            selector: 'app-root',
            template: __webpack_require__(815),
            styles: [__webpack_require__(786), __webpack_require__(252), __webpack_require__(253)]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
//# sourceMappingURL=D:/git/fdk/registrering-gui/src/app.component.js.map

/***/ }),

/***/ 729:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(137);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__ = __webpack_require__(725);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(728);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__catalog_catalog_component__ = __webpack_require__(412);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__routes_app_routes__ = __webpack_require__(730);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__angular_platform_browser_dynamic__ = __webpack_require__(352);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__angular_router__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ng2_bootstrap__ = __webpack_require__(799);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__dataset_dataset_component__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__start_start_component__ = __webpack_require__(414);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__catalog_catalog_service__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__dataset_dataset_service__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__security_auth_guard__ = __webpack_require__(731);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__security_authentication_service__ = __webpack_require__(235);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

















var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */],
                __WEBPACK_IMPORTED_MODULE_6__catalog_catalog_component__["a" /* CatalogComponent */],
                __WEBPACK_IMPORTED_MODULE_11__dataset_dataset_component__["a" /* DatasetComponent */],
                __WEBPACK_IMPORTED_MODULE_12__start_start_component__["a" /* StartComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
                __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_4__ng_bootstrap_ng_bootstrap__["a" /* NgbModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_10_ng2_bootstrap__["a" /* AlertModule */].forRoot(),
                __WEBPACK_IMPORTED_MODULE_9__angular_router__["a" /* RouterModule */].forRoot(__WEBPACK_IMPORTED_MODULE_7__routes_app_routes__["a" /* routes */])
            ],
            providers: [__WEBPACK_IMPORTED_MODULE_13__catalog_catalog_service__["a" /* CatalogService */], __WEBPACK_IMPORTED_MODULE_14__dataset_dataset_service__["a" /* DatasetService */], __WEBPACK_IMPORTED_MODULE_15__security_auth_guard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_16__security_authentication_service__["a" /* AuthenticationService */]],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_8__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(AppModule);
//# sourceMappingURL=D:/git/fdk/registrering-gui/src/app.module.js.map

/***/ }),

/***/ 730:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__catalog_catalog_component__ = __webpack_require__(412);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dataset_dataset_component__ = __webpack_require__(413);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__start_start_component__ = __webpack_require__(414);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return routes; });



var routes = [
    { path: '', component: __WEBPACK_IMPORTED_MODULE_2__start_start_component__["a" /* StartComponent */], pathMatch: 'full' },
    { path: 'catalogs/:cat_id', component: __WEBPACK_IMPORTED_MODULE_0__catalog_catalog_component__["a" /* CatalogComponent */], pathMatch: 'full' },
    { path: 'catalogs/:cat_id/datasets/:dataset_id', component: __WEBPACK_IMPORTED_MODULE_1__dataset_dataset_component__["a" /* DatasetComponent */], pathMatch: 'full' }
];
//# sourceMappingURL=D:/git/fdk/registrering-gui/src/app.routes.js.map

/***/ }),

/***/ 731:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__(67);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AuthGuard = (function () {
    function AuthGuard(router) {
        this.router = router;
    }
    AuthGuard.prototype.canActivate = function () {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
        // not logged in so redirect to login page
        this.router.navigate(['/']);
        return false;
    };
    AuthGuard = __decorate([
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(), 
        __metadata('design:paramtypes', [(typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */] !== 'undefined' && __WEBPACK_IMPORTED_MODULE_1__angular_router__["b" /* Router */]) === 'function' && _a) || Object])
    ], AuthGuard);
    return AuthGuard;
    var _a;
}());
//# sourceMappingURL=D:/git/fdk/registrering-gui/src/auth.guard.js.map

/***/ }),

/***/ 786:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 787:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 788:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 789:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(37)();
// imports


// module
exports.push([module.i, "", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 791:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./af": 427,
	"./af.js": 427,
	"./ar": 433,
	"./ar-dz": 428,
	"./ar-dz.js": 428,
	"./ar-ly": 429,
	"./ar-ly.js": 429,
	"./ar-ma": 430,
	"./ar-ma.js": 430,
	"./ar-sa": 431,
	"./ar-sa.js": 431,
	"./ar-tn": 432,
	"./ar-tn.js": 432,
	"./ar.js": 433,
	"./az": 434,
	"./az.js": 434,
	"./be": 435,
	"./be.js": 435,
	"./bg": 436,
	"./bg.js": 436,
	"./bn": 437,
	"./bn.js": 437,
	"./bo": 438,
	"./bo.js": 438,
	"./br": 439,
	"./br.js": 439,
	"./bs": 440,
	"./bs.js": 440,
	"./ca": 441,
	"./ca.js": 441,
	"./cs": 442,
	"./cs.js": 442,
	"./cv": 443,
	"./cv.js": 443,
	"./cy": 444,
	"./cy.js": 444,
	"./da": 445,
	"./da.js": 445,
	"./de": 447,
	"./de-at": 446,
	"./de-at.js": 446,
	"./de.js": 447,
	"./dv": 448,
	"./dv.js": 448,
	"./el": 449,
	"./el.js": 449,
	"./en-au": 450,
	"./en-au.js": 450,
	"./en-ca": 451,
	"./en-ca.js": 451,
	"./en-gb": 452,
	"./en-gb.js": 452,
	"./en-ie": 453,
	"./en-ie.js": 453,
	"./en-nz": 454,
	"./en-nz.js": 454,
	"./eo": 455,
	"./eo.js": 455,
	"./es": 457,
	"./es-do": 456,
	"./es-do.js": 456,
	"./es.js": 457,
	"./et": 458,
	"./et.js": 458,
	"./eu": 459,
	"./eu.js": 459,
	"./fa": 460,
	"./fa.js": 460,
	"./fi": 461,
	"./fi.js": 461,
	"./fo": 462,
	"./fo.js": 462,
	"./fr": 465,
	"./fr-ca": 463,
	"./fr-ca.js": 463,
	"./fr-ch": 464,
	"./fr-ch.js": 464,
	"./fr.js": 465,
	"./fy": 466,
	"./fy.js": 466,
	"./gd": 467,
	"./gd.js": 467,
	"./gl": 468,
	"./gl.js": 468,
	"./he": 469,
	"./he.js": 469,
	"./hi": 470,
	"./hi.js": 470,
	"./hr": 471,
	"./hr.js": 471,
	"./hu": 472,
	"./hu.js": 472,
	"./hy-am": 473,
	"./hy-am.js": 473,
	"./id": 474,
	"./id.js": 474,
	"./is": 475,
	"./is.js": 475,
	"./it": 476,
	"./it.js": 476,
	"./ja": 477,
	"./ja.js": 477,
	"./jv": 478,
	"./jv.js": 478,
	"./ka": 479,
	"./ka.js": 479,
	"./kk": 480,
	"./kk.js": 480,
	"./km": 481,
	"./km.js": 481,
	"./ko": 482,
	"./ko.js": 482,
	"./ky": 483,
	"./ky.js": 483,
	"./lb": 484,
	"./lb.js": 484,
	"./lo": 485,
	"./lo.js": 485,
	"./lt": 486,
	"./lt.js": 486,
	"./lv": 487,
	"./lv.js": 487,
	"./me": 488,
	"./me.js": 488,
	"./mi": 489,
	"./mi.js": 489,
	"./mk": 490,
	"./mk.js": 490,
	"./ml": 491,
	"./ml.js": 491,
	"./mr": 492,
	"./mr.js": 492,
	"./ms": 494,
	"./ms-my": 493,
	"./ms-my.js": 493,
	"./ms.js": 494,
	"./my": 495,
	"./my.js": 495,
	"./nb": 496,
	"./nb.js": 496,
	"./ne": 497,
	"./ne.js": 497,
	"./nl": 499,
	"./nl-be": 498,
	"./nl-be.js": 498,
	"./nl.js": 499,
	"./nn": 500,
	"./nn.js": 500,
	"./pa-in": 501,
	"./pa-in.js": 501,
	"./pl": 502,
	"./pl.js": 502,
	"./pt": 504,
	"./pt-br": 503,
	"./pt-br.js": 503,
	"./pt.js": 504,
	"./ro": 505,
	"./ro.js": 505,
	"./ru": 506,
	"./ru.js": 506,
	"./se": 507,
	"./se.js": 507,
	"./si": 508,
	"./si.js": 508,
	"./sk": 509,
	"./sk.js": 509,
	"./sl": 510,
	"./sl.js": 510,
	"./sq": 511,
	"./sq.js": 511,
	"./sr": 513,
	"./sr-cyrl": 512,
	"./sr-cyrl.js": 512,
	"./sr.js": 513,
	"./ss": 514,
	"./ss.js": 514,
	"./sv": 515,
	"./sv.js": 515,
	"./sw": 516,
	"./sw.js": 516,
	"./ta": 517,
	"./ta.js": 517,
	"./te": 518,
	"./te.js": 518,
	"./tet": 519,
	"./tet.js": 519,
	"./th": 520,
	"./th.js": 520,
	"./tl-ph": 521,
	"./tl-ph.js": 521,
	"./tlh": 522,
	"./tlh.js": 522,
	"./tr": 523,
	"./tr.js": 523,
	"./tzl": 524,
	"./tzl.js": 524,
	"./tzm": 526,
	"./tzm-latn": 525,
	"./tzm-latn.js": 525,
	"./tzm.js": 526,
	"./uk": 527,
	"./uk.js": 527,
	"./uz": 528,
	"./uz.js": 528,
	"./vi": 529,
	"./vi.js": 529,
	"./x-pseudo": 530,
	"./x-pseudo.js": 530,
	"./yo": 531,
	"./yo.js": 531,
	"./zh-cn": 532,
	"./zh-cn.js": 532,
	"./zh-hk": 533,
	"./zh-hk.js": 533,
	"./zh-tw": 534,
	"./zh-tw.js": 534
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 791;


/***/ }),

/***/ 815:
/***/ (function(module, exports) {

module.exports = "<section>\r\n  <div class=\"fdk-header-beta\">\r\n    Dette er en beta-versjon. Gi oss gjerne <a class=\"white-link\" href=\"mailto:fellesdatakatalog@brreg.no\">tilbakemeldinger</a> om hva du synes!\r\n  </div>\r\n</section>\r\n<!-- HEADER MENU-->\r\n<section>\r\n  <div class=\"fdk-header-menu-fullwidth\">\r\n    <div class=\"container\">\r\n\r\n      <!-- Left column / Empty -->\r\n      <div class=\"col-sm-4 col-md-4\">\r\n      </div>\r\n\r\n      <!-- Middle column / Heading -->\r\n      <div class=\"col-sm-4 col-md-4\">\r\n        <h1 class=\"fdk-heading\">Datakataloger</h1>\r\n      </div>\r\n\r\n      <!-- Right column -->\r\n      <div class=\"col-sm-4 col-md-4\">\r\n        <!-- Dropdown menu -->\r\n        <div class=\"dropdown fdk-container-dropdown-menu\">\r\n          <div class=\"dropdown fdk-dropdown-toggle-menu\">\r\n            <a data-toggle=\"dropdown\" href=\"#\"><i class=\"fa fdk-fa-menu fa-bars\"></i></a>\r\n            <ul class=\"dropdown-menu fdk-dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">\r\n              <li><a href=\"#\">Om Felles Datakatalog</a></li>\r\n              <li><a href=\"#\">Spørsmål og svar</a></li>\r\n              <li><a href=\"#\">DCAT-AP-NO 1.1-Standarden</a></li>\r\n              <li><a href=\"#\">Status implementasjon</a></li>\r\n            </ul>\r\n          </div>\r\n        </div>\r\n\r\n        <!-- Dropdown language -->\r\n        <div class=\"dropdown fdk-container-dropdown-language\">\r\n          <button class=\"btn btn-default fdk-dropdown-toggle-language\" type=\"button\" id=\"dropdownMenu1\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"true\">\r\n            <img class=\"fdk-dropdown-language-flag\" src=\"/assets/img/flag-norway.png\"/>Bokmål\r\n            <span class=\"caret\"></span>\r\n          </button>\r\n          <ul class=\"dropdown-menu fdk-dropdown-language\" aria-labelledby=\"dropdownMenu1\">\r\n            <li><a href=\"#\"><img class=\"fdk-dropdown-language-flag\" src=\"/assets/img/flag-england.png\"/>English</a></li>\r\n            <li><a href=\"#\"><img class=\"fdk-dropdown-language-flag\" src=\"/assets/img/flag-norway.png\"/>Bokmål</a></li>\r\n            <li><a href=\"#\"><img class=\"fdk-dropdown-language-flag\" src=\"/assets/img/flag-norway.png\"/>Nynorsk</a></li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</section>\r\n\r\n<section>\r\n  <div class=\"container\">\r\n    <router-outlet></router-outlet>\r\n  </div>\r\n</section>\r\n<section>\r\n  <footer class=\"fdk-footer\">\r\n    <div class=\"container\" style=\"padding-top: 1em\">\r\n      <a href=\"http://www.brreg.no\">\r\n        <img src=\"//scf.brreg.no/bilder/brreg_logo.svg\" alt=\"Brønnøysundregistrene logo\" height=\"200\" width=\"300\" class=\"img-responsive\" id=\"brreg-logo\">\r\n      </a>\r\n    </div>\r\n    <div class=\"login-status\" *ngIf=\"getUsername()\">\r\n      Pålogget som {{getUsername()}}\r\n    </div>\r\n  </footer>\r\n</section>\r\n"

/***/ }),

/***/ 816:
/***/ (function(module, exports) {

module.exports = "<alert type=\"success\" *ngIf=\"saved\">\r\n  Sist lagret {{lastSaved}}\r\n</alert>\r\n<alert type=\"info\" *ngIf=\"!saved\">\r\n  Endringer lagres automatisk\r\n</alert>\r\n\r\n<div class=\"col-md-12\" *ngIf=\"catalog\">\r\n  <div class=\"panel fdk-panel\" *ngIf=\"catalog\">\r\n    <div class=\"fdk-panel-big-heading\">\r\n      <div class=\"form-group\">\r\n        <input id=\"tittel-datakatalog\" (ngModelChange)=\"valuechange()\" type=\"text\" class=\"fdk-register-h1\" placeholder=\"Tittel\" [(ngModel)]=\"catalog.title[language]\" />\r\n      </div>\r\n    </div>\r\n    <div class=\"fdk-panel-big-body\">\r\n      <h2>{{catalog.id}}</h2>\r\n      <textarea class=\"fdk-register-h3\" (ngModelChange)=\"valuechange()\" rows=\"5\" id=\"beskrivelse-datakatalog\" placeholder=\"Beskrivelse\" [(ngModel)]='catalog.description[language]'></textarea>\r\n    </div>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"col-md-12\" *ngIf=\"catalog\">\r\n  <div class=\"panel fdk-panel\">\r\n    <div class=\"fdk-panel-heading\">\r\n      <table class=\"fdk-register\">\r\n        <tbody>\r\n          <tr>\r\n            <td class=\"fdk-register fdk-register-datacatalogue-1\">\r\n              <h4 class=\"fdk-text-white fdk-no-margin\">Datasett</h4>\r\n            </td>\r\n            <td class=\"fdk-register fdk-register-datacatalogue-2 fdk-text-right\">\r\n              <h4 class=\"fdk-text-white fdk-text-right fdk-no-margin\">Sist endret</h4>\r\n            </td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n    <div class=\"fdk-panel-body\">\r\n      <table class=\"fdk-register fdk-table-hover\">\r\n        <tbody>\r\n        <tr *ngFor=\"let dataset of datasets\" id=\"datasets\" class=\"fdk-row-padding\" (click)=\"selectDataset(catalog, dataset)\" >\r\n          <td class=\"fdk-register fdk-register-datacatalogue-1\">{{getTitle(dataset)}}</td>\r\n          <td class=\"fdk-register fdk-register-datacatalogue-2\">\r\n            <div class=\"fdk-text-right\" >{{formatDate(dataset._lastModified).toLocaleString()}}</div>\r\n          </td>\r\n        </tr>\r\n        </tbody>\r\n      </table>\r\n    </div>\r\n  </div>\r\n  <button type=\"button\" class=\"btn btn-default fdk-label fdk-label-default\" (click)=\"newDataset()\">Nytt datasett</button>\r\n  <button type=\"button\" class=\"btn btn-default fdk-label fdk-label-default\" (click)=\"back()\">Tilbake</button>\r\n</div>\r\n"

/***/ }),

/***/ 817:
/***/ (function(module, exports) {

module.exports = "<alert type=\"success\" *ngIf=\"saved\">\r\n  Sist lagret {{lastSaved}}\r\n</alert>\r\n<alert type=\"info\" *ngIf=\"!saved\">\r\n  Endringer lagres automatisk\r\n</alert>\r\n\r\n<div class=\"panel fdk-panel\" *ngIf=\"dataset\" id=\"dataset\">\r\n  <div class=\"fdk-panel-big-heading\">\r\n    <input  class=\"fdk-register-h1\" id=\"tittel-datasett\" (ngModelChange)=\"valuechange()\" type=\"text\" placeholder=\"Tittel\" [(ngModel)]=\"dataset.title[language]\"/>\r\n  </div>\r\n  <div class=\"fdk-panel-big-body\">\r\n    <h2>{{dataset.catalog}}</h2>\r\n    <textarea class=\"fdk-register-h3\" rows=\"5\" id=\"beskrivelse-datasett\" (ngModelChange)=\"valuechange()\" placeholder=\"Beskrivelse\" [(ngModel)]='dataset.description[language]'></textarea>\r\n  </div>\r\n</div>\r\n\r\n<div class=\"panel fdk-panel\" *ngIf=\"dataset\">\r\n  <div class=\"fdk-panel-heading\">\r\n    Opplysninger\r\n  </div>\r\n  <div class=\"fdk-panel-body\">\r\n    <div class=\"form-group\">\r\n      <div class=\"row form-group\">\r\n      <label for=\"emneord-datasett\" class=\"col-md-1 control-label\">Emneord:</label>\r\n        <div class=\"col-md-11\">\r\n          <input id=\"emneord-datasett\" type=\"text\" class=\"form-control\"/>\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"row form-group\">\r\n        <label for=\"begrep-datasett\" class=\"col-md-1 control-label\">Begrep:</label>\r\n        <div class=\"col-md-11\">\r\n          <input id=\"begrep-datasett\" type=\"text\" class=\"form-control\" />\r\n        </div>\r\n      </div>\r\n\r\n      <div class=\"row form-group\">\r\n        <label for=\"tema-datasett\" class=\"col-md-1 control-label\">Tema:</label>\r\n        <div class=\"col-md-11\">\r\n          <input id=\"tema-datasett\" type=\"text\" class=\"form-control\" />\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</div>\r\n<button type=\"button\" class=\"btn btn-default fdk-label fdk-label-default\" (click)=\"back()\">Tilbake</button>\r\n"

/***/ }),

/***/ 818:
/***/ (function(module, exports) {

module.exports = "<h1>\r\n  {{title}}\r\n</h1>\r\n<div class=\"well col-md-6\">\r\n    <div class=\"alert alert-info\">\r\n      Brukernavn: initialer<br />\r\n      Passord: 123\r\n    </div>\r\n    <h3>Logg inn for å redigere</h3>\r\n    <form name=\"loginForm\" (ngSubmit)=\"f.form.valid && login()\" #f=\"ngForm\" novalidate>\r\n      <div class=\"form-group\" [ngClass]=\"{ 'has-error': f.submitted && !username.valid }\">\r\n        <label for=\"username\">Brukernavn</label>\r\n        <input type=\"text\" class=\"form-control\" name=\"username\" [(ngModel)]=\"model.username\" #username=\"ngModel\" required />\r\n        <div *ngIf=\"f.submitted && !username.valid\" class=\"help-block\">Username is required</div>\r\n      </div>\r\n      <div class=\"form-group\" [ngClass]=\"{ 'has-error': f.submitted && !password.valid }\">\r\n        <label for=\"password\">Passord</label>\r\n        <input type=\"password\" class=\"form-control\" name=\"password\" [(ngModel)]=\"model.password\" #password=\"ngModel\" required />\r\n        <div *ngIf=\"f.submitted && !password.valid\" class=\"help-block\">Password is required</div>\r\n      </div>\r\n      <div class=\"form-group\">\r\n        <button [disabled]=\"loading\" class=\"btn btn-primary\">Logg inn</button>\r\n      </div>\r\n      <div *ngIf=\"error\" class=\"alert alert-danger\">{{error}}</div>\r\n    </form>\r\n\r\n</div>\r\n\r\n<div class=\"col-md-12\">\r\n  <h2>Kataloger</h2>\r\n\r\n  <table class=\"table table-striped table-hover\" id=\"datacatalogs\">\r\n    <thead>\r\n    <tr>\r\n      <th>Id</th>\r\n      <th>Tittel</th>\r\n      <th>Beskrivelse</th>\r\n    </tr>\r\n    </thead>\r\n    <tbody>\r\n    <tr *ngFor=\"let catalog of catalogs\" (click)=\"selectCatalog(catalog)\" >\r\n      <td>{{catalog.id}}</td>\r\n      <td>{{catalog.title.nb}}</td>\r\n      <td>{{catalog.description.nb}}</td>\r\n    </tr>\r\n    </tbody>\r\n  </table>\r\n</div>\r\n"

/***/ }),

/***/ 854:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(609);


/***/ })

},[854]);
//# sourceMappingURL=main.bundle.js.map