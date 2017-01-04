'use strict';

const fs = require('fs');
const parser = require('./src/firebase-json.js');

/**
 * Create a SyntaxError with fileName, lineNumber, columnNumber and stack
 * pointing to the syntax error in the the json file.
 *
 * @param  {Error}  original Pegjs syntax error.
 * @param  {string} filname  JSON file name
 * @return {Error}
 */
function error(original, fileName) {
  if (
    original == null ||
    original.location == null ||
    original.location.start == null
  ) {
    return original;
  }

  const start = original.location.start;
  const lineNumber = start.line == null ? 1 : start.line;
  const columnNumber = start.column == null ? 1 : start.column;
  const err = new SyntaxError(`Line ${lineNumber}, column ${columnNumber}: ${original.message}`);

  Object.assign(err, {fileName, lineNumber, columnNumber, original});

  if (fileName == null) {
    return err;
  }

  err.stack = `SyntaxError: ${err.message}\n
    at ${fileName}:${lineNumber}:${columnNumber}
  `;

  return err;
}

/**
 * Parse JSON-like encoded string.
 *
 * @param  {string} json Content to decode
 * @return {any}
 */
exports.parse = function(json, fileName) {
  try {
    return parser.parse(json.toString());
  } catch (e) {
    throw error(e, fileName);
  }
};

/**
 * Load and decode a JSON-like file.
 *
 * @param  {string}        filePath  File to load
 * @param  {string|object} [options] fs.readFile options
 * @return {Promise<any,Error>}
 */
exports.load = function(filePath, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, options, (err, data) => {
      if (err == null) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  }).then(
    json => exports.parse(json, filePath)
  );
};

/**
 * Load and decode synchronously a JSON-like file.
 *
 * @param  {string}        filePath  File to load
 * @param  {string|object} [options] fs.readFile options
 * @return {any}
 */
exports.loadSync = function(filePath, options) {
  const json = fs.readFileSync(filePath, options);

  return exports.parse(json, filePath);
};
