// JSON Grammar
// ============
//
// Based on RFC 7159 [1] and Pegjs JSON grammar definition:
// 
// 
//    https://github.com/pegjs/pegjs/blob/647d4881473afb6af3968032ad9b9f01e4254581/examples/json.pegjs
// 
//
// Note that JSON is also specified in ECMA-262 [2], ECMA-404 [3], and on the
// JSON website [4] (somewhat informally). The RFC seems the most authoritative
// source, which is confirmed e.g. by [5].
//
// [1] http://tools.ietf.org/html/rfc7159
// [2] http://www.ecma-international.org/publications/standards/Ecma-262.htm
// [3] http://www.ecma-international.org/publications/standards/Ecma-404.htm
// [4] http://json.org/
// [5] https://www.tbray.org/ongoing/When/201x/2014/03/05/RFC7159-JSON
// 
// 
// MIT License
// 
// Copyright (c) 2010-2016 David Majda
// Copyright (c) 2017 Damien Lebrun
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// 

{
  function expressionNode(expression) {
    return {
      type: 'ExpressionStatement',
      expression: expression,
      loc: loc()
    };
  }

  function objectNode(properties) {
    return {
      type: 'ObjectExpression',
      properties: properties == null ? [] : properties,
      loc: loc()
    };
  }

  function propertyNode(key, value) {
    return {
      type: 'Property',
      key: key,
      value: value,
      loc: loc(),
      kind: 'init'
    };
  }

  function arrayNode(elements) {
    return {
      type: 'ArrayExpression',
      elements: elements == null ? [] : elements,
      loc: loc()
    };
  }

  function literalNode(value) {
    return {
      type: 'Literal',
      value: value,
      raw: text(),
      loc: loc()
    };
  }
  
  function loc() {
    const pegLoc = location();
    
    return {
      start: position(pegLoc.start),
      end: position(pegLoc.end)
    };
  }
  
  function position(pegPosition) {
    return {
      line: pegPosition.line,
      column: pegPosition.column - 1
    };
  }
}

// ----- 2. JSON Grammar -----

JSON_text
  = _ value:value _ { return expressionNode(value); }

begin_array     = _ "[" _
begin_object    = _ "{" _
end_array       = _ "]" _
end_object      = _ "}" _
name_separator  = _ ":" _
value_separator = _ "," _

_ "skip" = ws comment* ws

ws "whitespace" = [ \t\n\r]*

linefeed = unixlf / winlf
unixlf = "\n"
winlf = "\r\n"

comment
  = multiLineComment
  / singleLineComment

multiLineComment
  = ws "/*" (!"*/" .)* "*/"

singleLineComment
  = ws "//" (!linefeed .)*

// ----- 3. Values -----

value
  = false
  / null
  / true
  / object
  / array
  / number
  / string

false = "false" { return literalNode(false); }
null  = "null"  { return literalNode(null);  }
true  = "true"  { return literalNode(true);  }

// ----- 4. Objects -----

object
  = begin_object
    properties:(
      head:property
      tail:(value_separator m:property { return m; })*
      value_separator?
      {
        const properties = [head].concat(tail);
        const foundKeys = {};

        properties.forEach(prop => {
          const name = prop.key.value;

          if (foundKeys[name] === true) {
            error(`'${name}' occurs multiples times.`);
          }

          foundKeys[name] = true;
        });

        return properties;
      }
    )?
    end_object
    { return objectNode(properties); }

property
  = key:key name_separator value:value {
      return propertyNode(key, value);
    }

key
  = quotation_mark chars:(unescaped / escaped)* quotation_mark {
    return literalNode(chars.join(""));
  }

// ----- 5. Arrays -----

array
  = begin_array
    elements:(
      head:value
      tail:(value_separator v:value { return v; })*
      value_separator?
      {
        return [head].concat(tail);
      }
    )?
    end_array
    { return arrayNode(elements); }

// ----- 6. Numbers -----

number "number"
  = minus? int frac? exp? {
    return literalNode(parseFloat(text()));
  }

decimal_point
  = "."

digit1_9
  = [1-9]

e
  = [eE]

exp
  = e (minus / plus)? DIGIT+

frac
  = decimal_point DIGIT+

int
  = zero / (digit1_9 DIGIT*)

minus
  = "-"

plus
  = "+"

zero
  = "0"

// ----- 7. Strings -----

string "string"
  = quotation_mark chars:char* quotation_mark { return literalNode(chars.join("")); }

char
  = unescaped
  / linefeed
  / escaped

escaped
  = escape
    sequence:(
        '"'
      / "\\"
      / "/"
      / "b" { return "\b"; }
      / "f" { return "\f"; }
      / "n" { return "\n"; }
      / "r" { return "\r"; }
      / "t" { return "\t"; }
      / "u" digits:$(HEXDIG HEXDIG HEXDIG HEXDIG) {
          return String.fromCharCode(parseInt(digits, 16));
        }
    )
    { return sequence; }

escape
  = "\\"

quotation_mark
  = '"'

unescaped
  = [^\0-\x1F\x22\x5C]

// ----- Core ABNF Rules -----

// See RFC 4234, Appendix B (http://tools.ietf.org/html/rfc4234).
DIGIT  = [0-9]
HEXDIG = [0-9a-f]i
