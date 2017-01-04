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
  "bar": *array*/ [ /*item*/ 1, /*item*/ 2 /*item*/ ] /*array*/
} /*end*/`;

const SINGLE_LINE_COMMENT = `// start
{
  //
  // header
  //
  "foo" // key
  : // value
  "bar" // value
  , // trail
  "baz": 1
  //
  // footer
  //
} // end`;

const MULTI_LINE_STRING = '"one\ntwo\nthree"';

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

    it.skip('should parse multi line comments', function() {
      expect(json.parse(MULTI_LINE_COMMENT)).to.deep.equal({
        foo: 'baz',
        baz: [2, 3]
      });
    });

    it.skip('should parse single line comments', function() {
      expect(json.parse(SINGLE_LINE_COMMENT)).to.deep.equal({
        foo: 'baz',
        baz: [2, 3]
      });
    });

    it.skip('should parse multi line string', function() {
      expect(json.parse(MULTI_LINE_STRING)).to.deep.equal('one\ntwo\nthree');
    });

  });

  describe('load', function() {

    it('should load json content asynchronously', function() {
      return json.load(packagePath).then(
        pkg => expect(pkg.name).to.equal('firebase-json')
      )
    });

  });

  describe('loadAsync', function() {

    it('should load json content synchronously', function() {
      expect(json.loadSync(packagePath).name).to.equal('firebase-json');
    });

  });

});

