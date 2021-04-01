'use strict';

var utils = require('../utils');

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string?} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
function AxiosError(message, config, code, request, response) {
  Error.call(this);
  this.message = message;
  this.name = this.constructor.name;
  this.config = config;
  code && (this.code = code);
  this.request = request;
  this.response = response;
}

utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  }
});

var prototype = AxiosError.prototype;

Object.defineProperty(prototype, 'isAxiosError', {value: true});

// eslint-disable-next-line func-names
AxiosError.from = function(error, config, code, request, response) {
  var axiosError = Object.create(prototype);

  var props;
  var i;
  var prop;
  var obj = error;
  var merged = {};

  do {
    props = Object.getOwnPropertyNames(obj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if (!merged[prop]) {
        axiosError[prop] = obj[prop];
        merged[prop] = true;
      }
    }
    obj = Object.getPrototypeOf(obj);
  } while (obj && obj !== Error.prototype && obj !== Object.prototype);

  AxiosError.call(axiosError, error.message, config, code, request, response);

  axiosError.name = error.name;

  return axiosError;
};

module.exports = AxiosError;
