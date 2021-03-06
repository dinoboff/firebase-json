<a name="0.4.0"></a>
# [0.4.0](https://github.com/dinoboff/firebase-json/compare/v0.3.0...v0.4.0) (2017-06-25)


### Features

* allows trailing commas in object/array ([1b78268](https://github.com/dinoboff/firebase-json/commit/1b78268)), closes [#6](https://github.com/dinoboff/firebase-json/issues/6)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/dinoboff/firebase-json/compare/v0.2.1...v0.3.0) (2017-01-06)


### Bug Fixes

* fix ast positions to use 0-indexed column ([02efe24](https://github.com/dinoboff/firebase-json/commit/02efe24))


### Features

* add `ast` to parse json to intermediary AST ([0082d19](https://github.com/dinoboff/firebase-json/commit/0082d19))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/dinoboff/firebase-json/compare/v0.2.0...v0.2.1) (2017-01-06)


### Bug Fixes

* disallow multi line object key ([eaa04e0](https://github.com/dinoboff/firebase-json/commit/eaa04e0))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/dinoboff/firebase-json/compare/v0.1.0...v0.2.0) (2017-01-04)


### Features

* disallow duplicate keys in objects ([056adcf](https://github.com/dinoboff/firebase-json/commit/056adcf))
* implement better parsing error message ([af99779](https://github.com/dinoboff/firebase-json/commit/af99779))


### BREAKING CHANGES

* `parse(json)` throws a builtin SyntaxError instead of the Pegjs one. Instead of a location property, the error includes the lineNumber and columnNumber property.



<a name="0.1.0"></a>
# [0.1.0](https://github.com/dinoboff/firebase-json/compare/08424be...v0.1.0) (2017-01-04)


### Features

* add initial JSON parser ([08424be](https://github.com/dinoboff/firebase-json/commit/08424be))
* add support for comment in JSON ([4380c8c](https://github.com/dinoboff/firebase-json/commit/4380c8c))
* add support for multi line string ([26ee9b0](https://github.com/dinoboff/firebase-json/commit/26ee9b0))



