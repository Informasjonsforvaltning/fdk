import {ErrorHandler, Injectable} from '@angular/core';
//import * as StackTrace from 'stacktrace-js';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
  ) {
  }

  handleError(error) {
    //alert(error);
    //throw error;
    return Promise.reject(error.message || error);
  }

}
