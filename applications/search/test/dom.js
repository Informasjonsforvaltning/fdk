/* dom.js */
/*
var jsdom = require('jsdom');
var exposedProperties = ['window', 'navigator', 'document'];

//global.document = jsdom('');
const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

//global.document = jsdom('<!doctype HTML><html><body></body></html>');
//global.window = document.defaultView;
global.window = window;
Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js'
};
*/

/* setup.js */

const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html><body></body></html>');
const { window } = jsdom;

function copyProps(src, target) {
  const props = Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .map(prop => Object.getOwnPropertyDescriptor(src, prop));
  Object.defineProperties(target, props);
}

global.window = window;
global.document = window.document;
global.navigator = {
  userAgent: 'node.js'
};
copyProps(window, global);