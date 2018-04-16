# Walli

[![build status](https://img.shields.io/travis/imcuttle/walli/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/walli)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/walli.svg?style=flat-square)](https://codecov.io/github/imcuttle/walli?branch=master)
[![NPM version](https://img.shields.io/npm/v/walli.svg?style=flat-square)](https://www.npmjs.com/package/walli)
[![NPM Downloads](https://img.shields.io/npm/dm/walli.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/walli)

A manageable and immutable validation library.

[Chinese](https://imcuttle.github.io/walli-born)

[REPL](https://npm.runkit.com/walli)

## Installation

```bash
npm install walli --save
```

## Usage

* `ok`

```javascript
import { string, arrayOf } from 'walli'

string.ok('1') === true
string.ok(1) === false
arrayOf(string).ok(['a']) === true
arrayOf(string).ok(['a', 1]) === false
```

* `toUnlawfulString`

```javascript
string.toUnlawfulString('1') === ''
string.toUnlawfulString(1) === 'expected type: string, actual type: number.'
stringMatching('any').toUnlawfulString('axaxnyx', { delimiter: '\n' }) ===
  "expected: stringMatching(/any/), actual: 'axaxnyx'."
```

* `check`

```javascript
string.check('1').ok === true
string.check('1').toString({ delimiter: '\n' }) ===
  'expected type: string, actual type: number.'
```

* `message`

```javascript
// :actual: and :expected: are special placeholders.
string.message('error! :expected:  :actual:').toUnlawfulString(1) ===
  'error! string  number'

const foo = eq({
  name: string.message('name error!'),
  age: number
}).message('error happened')

foo.toUnlawfulString({
  name: '',
  age: 'er'
}) === 'age: error happened'

foo.toUnlawfulString({
  name: 222,
  age: 19
}) === 'name: name error!'
```

## [Custom Type](./src/__tests__/examples.spec.ts)

* Expected Struction

```typescript
// typescript
type Person = {
  name: string
  age: string
  gender: 'F' | 'M'
  father?: Person
  mother?: Person
  children?: Person[]
}
```

* Walli Type's Definition

```javascript
import { string, eq, oneOf, arrayOf, array, integer, Verifiable } from 'walli'
import { util } from 'walli'
const { funcify, createVerifiableClass, createFinalVerifiable } = util

const person = createVerifiableClass({
  getDisplayName() {
    return 'person'
  },
  _check(req) {
    return eq({
      name: string,
      age: integer,
      gender: oneOf(['F', 'M']),
      father: person().optional,
      mother: person().optional,
      children: arrayOf(person()).optional
    }).check(req)
  }
})

person().ok({
  name: 'cy',
  age: 22,
  gender: 'F'
}) === true
person().toUnlawfulString({
  // ...
})
// creates final verifiable instance like string / null_
const fperson = createFinalVerifiable(person)
fperson.ok({
  // ...
})

// Or using es6 syntax
class Person extends Verifiable {
  static displayName = 'person'
  _check(req) {
    // same code here
  }
}
const es6Person = funcify(Person)
```

And the document named [How to write a customized type](./docs/How-To-Write-Customized-Type.md) would give you more help.

## Related

* [json-schema-walli](https://github.com/imcuttle/transform-json-schema) Transform json schema to walli definition.

## [Exported API](./src/walli.ts)

[More Detail](https://imcuttle.github.io/walli)

## Verifiable List

### function\_

### null\_

### undefined\_

### primitive

### object

### array

### any

### nil

* null or undefined

### string

### number

### strictNumber

### integer

### any

### objectOf(...)

#### objectOf()

#### objectOf(value)

#### objectOf([value, key])

### arrayOf(value)

### be(value)

### oneOf([a, b, c])

### equal(value)

* Alias `eq`

### looseEqual(value)

* Alias `leq`

### not(value)

### every([a, b, c])

### some([a, b, c])

### custom((...requests) => string | null)

### instanceOf(Type)

### stringMatching(string | regexp)

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

### createFinalVerifiable(Verifiable, [rule, options])
