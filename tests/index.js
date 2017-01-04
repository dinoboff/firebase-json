'use strict';

const json = require('../');
const chai = require('chai');
const path = require('path');
const expect = chai.expect;

chai.use(require('dirty-chai'));

const PLAIN = `{
  "foo": "bar",
  "baz": [2, 3]
}`;

const PLAIN_ERROR = `{
  foo: "bar",
  baz: [2, 3]
}`;

const MULTI_LINE_COMMENT = `/*start*/
{
  /**
   * header
   */
  "foo"/* key */: /* value */ "bar" /* value */, /* trail */
  "baz": /*array*/ [ /*item*/ 2, /*item*/ 3 /*item*/ ] /*array*/
} /*end*/`;

const SINGLE_LINE_COMMENT = `// start
{ //
  // header
  //
  "foo"  // key
  :      // value
  "bar"  // value
  ,
  "baz":
  // array
  [
       // item
    2, // item
    3  // item
  ]
  //
  // footer
  //
} // end`;

const MULTI_LINE_STRING = '"one\ntwo\nthree"';

const SAME_KEY = `{
  "foo": 1,
  "bar": 2,
  "bar": 3,
  "baz": 4
}`;

describe('firebase-json', function() {
  const packagePath = path.join(__dirname, '../package.json');

  describe('parse', function() {

    it('should parse plain json', function() {
      expect(json.parse(PLAIN)).to.deep.equal({
        foo: 'bar',
        baz: [2, 3]
      });
    });

    it('should throw an syntax error', function() {
      expect(() => json.parse(PLAIN_ERROR)).to.throw();
    });

    it('should parse multi line comments', function() {
      expect(json.parse(MULTI_LINE_COMMENT)).to.deep.equal({
        foo: 'bar',
        baz: [2, 3]
      });
    });

    it('should parse single line comments', function() {
      expect(json.parse(SINGLE_LINE_COMMENT)).to.deep.equal({
        foo: 'bar',
        baz: [2, 3]
      });
    });

    it('should parse multi line string', function() {
      expect(json.parse(MULTI_LINE_STRING)).to.deep.equal('one\ntwo\nthree');
    });

    it('should throw on duplicated keys', function() {
      expect(() => json.parse(SAME_KEY)).to.throw();
    });

    it('should report the error line and column number', function() {
      expect(() => json.parse('foo')).to.throw(/Line 1, column 1:/);
      expect(() => json.parse(`{
        "foo": 1,
        "bar": {
          "baz": 2,
          "baz": 3
        }
      }`)).to.throw(/Line 4, column 11:/);
    });

  });

  describe('load', function() {

    it('should load json content asynchronously', function() {
      return json.load(packagePath).then(
        pkg => expect(pkg.name).to.equal('firebase-json')
      );
    });

  });

  describe('loadAsync', function() {

    it('should load json content synchronously', function() {
      expect(json.loadSync(packagePath).name).to.equal('firebase-json');
    });

  });

});

