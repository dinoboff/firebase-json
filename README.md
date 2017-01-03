# firebase-json

Parser for Firebase rules JSON files.

It Supersedes [RFC 7159] to allow:

- Multi line comments.
- Single line comments.
- Multi line string.


## Example

To parse Firebase rules:

```js
const json = require('firebase-json');
const fs = require('js');
const rules = json.parse(fs.readFileSync('./rules.json', 'utf8'));

console.log(rules);
```


## Motivation

This primarily meant to be used with [targaryen] test.

The current alternatives:

- To strip the comment (with [strip-json-comments]) and to not use multi line
  string.
- To write the rules in [json5] and compile the rules before testing them in
  [targaryen] or upload them (json5 rules using multi line string won't be
  compatible with Firebase format).
- To write the rules in Firebase's [bolt] and compile the rules before testing
  them with [targaryen]; for deployment, [firebase-tools] support bolt rules.

Those solutions limit or disrupt current work flow or deployment. Parsing the
rule might allow us later to map a - rule - syntax or evaluation error to a
specific place in the JSON file similarly to Firebase simulator.


## Installation

```shell
npm install firebase-json
```


## API

- `parse(json: rules): any`

    Parse the firebase-json encoded string.

- `load(filePath: string, options: void|string|object): Promise<any,Error>`

    Read the file and parse its firebase-json encoded content.

- `loadSync(filePath: string, options: void|string|object): any`

    Read the file synchronously and parse its firebase-json encoded content.


## Tests

```shell
git clone git@github.com:dinoboff/firebase-json.git
cd firebase-json
npm i
npm test
```


## License

MIT License

Copyright (c) 2017 Damien Lebrun


[RFC 7159]: http://tools.ietf.org/html/rfc7159
[targaryen]: https://github.com/goldibex/targaryen
[strip-json-comments]: https://github.com/sindresorhus/strip-json-comments
[Firebase's bolt]: https://github.com/firebase/bolt
[firebase-tools]: https://github.com/firebase/firebase-tools
