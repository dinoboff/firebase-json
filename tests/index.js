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

  describe('ast', function() {

    it('should parse json strings into an ExpressionStatement node', function() {
      const ast = json.ast('null');

      expect(ast).to.have.property('type', 'ExpressionStatement');
      expect(ast).to.have.property('expression');
      expect(ast).to.have.property('loc');
      expect(ast.loc.start.line).to.equal(1);
      expect(ast.loc.start.column).to.equal(0);
      expect(ast.loc.end.line).to.equal(1);
      expect(ast.loc.end.column).to.equal(4);
    });

    it('should parse object into an ObjectExpression node', function() {
      const expr = json.ast('{"foo": 1}').expression;

      expect(expr).to.have.property('type', 'ObjectExpression');
      expect(expr).to.have.property('properties');
      expect(expr.properties).to.have.length(1);
      expect(expr.properties[0]).to.have.property('key');
      expect(expr.properties[0]).to.have.property('value');
      expect(expr.properties[0]).to.have.property('kind', 'init');
    });

    it('should parse array into an ArrayExpression node', function() {
      const expr = json.ast('[1, 2]').expression;

      expect(expr).to.have.property('type', 'ArrayExpression');
      expect(expr).to.have.property('elements');
      expect(expr.elements).to.have.length(2);
    });

    [1, 2.0, -3, -4.0, 2e100, 'one', true, false, null].forEach(literal => {
      it(`should parse ${literal} into a Literal node`, function() {
        const raw = JSON.stringify(literal);
        const expr = json.ast(raw).expression;

        expect(expr).to.have.property('type', 'Literal');
        expect(expr).to.have.property('value', literal);
        expect(expr).to.have.property('raw', raw);
      });
    });

  });

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

    it('should throw on multiline keys', function() {
      expect(() => json.parse('{"foo\nbar": 1}')).to.throw();
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

    it('should accept trailing comma in objects', function() {
      expect(json.parse('{"foo": 1}')).to.deep.equal({foo: 1});
      expect(json.parse('{"foo": 1,}')).to.deep.equal({foo: 1});
      expect(json.parse('{"foo": 1, "bar": 2}')).to.deep.equal({foo: 1, bar: 2});
      expect(json.parse('{"foo": 1, "bar": 2,}')).to.deep.equal({foo: 1, bar: 2});
      expect(() => json.parse('{,}')).to.throw();
      expect(() => json.parse('{"foo": 1,,}')).to.throw();
      expect(() => json.parse('{"foo": 1, bar: 2,,}')).to.throw();
    });

    it('should accept trailing comma in array', function() {
      expect(json.parse('[1]')).to.deep.equal([1]);
      expect(json.parse('[1,]')).to.deep.equal([1]);
      expect(json.parse('[1, 2]')).to.deep.equal([1, 2]);
      expect(json.parse('[1, 2,]')).to.deep.equal([1, 2]);
      expect(() => json.parse('[,]')).to.throw();
      expect(() => json.parse('[1,,]')).to.throw();
      expect(() => json.parse('[1,2,,]')).to.throw();
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

