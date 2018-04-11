
The document is about writing a customized verifiable type.

## Using `custom`

walli provides `custom` method as follows:

```javascript
import { custom } from 'walli'

const tenCheck = custom(function([reqA, reqB]) {
  // Passed
  if (reqA + reqB === 10) {
    return null
  }
  // Unlawful
  // Allows returning string, Unlawfulness, Reason or UnlawfulnessList
  return 'reqA + reqB should be equals 10.'
})

tenCheck.ok([1, 2]) === false
tenCheck.ok([8, 2]) === true
```

However, `tenCheck` is an instance of Verifiable **rather than manageable Verifiable class**.

so we should create the TenCheck Verifiable class

## Creates the VerifiableClass

The two ways es5 and es6 are on the scene.

### ES5
```javascript
import { util } from 'walli'
const { createVerifiableClass } = util

const es5TenCheck = createVerifiableClass({
  _check(req) {
    return tenCheck.check(req)
  },
  getDisplayName() {
    return 'tenCheck'
  }
})

es5TenCheck().ok([1, 2]) === false
```

### ES6

```javascript
import { Verifiable, util } from 'walli'
const { funcify } from 'util'

class ES6TenCheck extends Verifiable {
  _check(req) {
    return tenCheck.check(req)
  },
  static displayName = 'tenCheck'
}
const es6TenCheck = funcify(ES6TenCheck)

es6TenCheck().ok([1, 2]) === false
```

### Creates an standard TypeVerifiableClass

See [Boolean.ts](../src/Boolean.ts)
