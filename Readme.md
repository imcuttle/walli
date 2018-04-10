# Walli

[![build status](https://img.shields.io/travis/imcuttle/walli/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/walli)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/walli.svg?style=flat-square)](https://codecov.io/github/imcuttle/walli?branch=master)
[![NPM version](https://img.shields.io/npm/v/walli.svg?style=flat-square)](https://www.npmjs.com/package/walli)
[![NPM Downloads](https://img.shields.io/npm/dm/walli.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/walli)

A functional style validation library.

## [Exported API](./src/walli.ts)

[More Detail](https://imcuttle.github.io/walli)

## Verifiable List
### function_()
### null_()
### undefined_()
### object(...)
#### object(value)
#### object([value, key])
### array(value)
### be(value)
### oneOf([a, b, c])
### equal(value)
- Alias `eq`
### looseEqual(value)
- Alias `leq`
### any()
### not(value)
### every([a, b, c])
### some([a, b, c])
### custom((...requests) => string | null)
### nil()
- null or undefined
### string()
### number()
### strictNumber()
### instanceOf(Type)
### integer()

## Class List
### Verifiable
### UnlawfulnessList
### Unlawfulness
### Reason
### TypeReason
### TypeItem
### ToEqualReason

## Utilities
### checkEqual(request: any, expected, fallbackVerifiable)
### single(str)
### double(str)
### inherits(Child, Parent)
### getDisplayName(Type)
### isRequired(req)
### toString(instance)
### funcify(Class)
### constructify(Class)
### getTypeName(Type)
### createVerifiableClass(entities, options)
