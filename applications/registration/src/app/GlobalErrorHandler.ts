import {ErrorHandler, Injectable} from '@angular/core';
import * as StackTrace from 'stacktrace-js';


@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor() {
  }

  handleError(error) {
    alert(error);
    console.error(error.stack);
    // IMPORTANT: Rethrow the error otherwise it gets swallowed
    throw error;
  }

}
