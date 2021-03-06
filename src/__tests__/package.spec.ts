import {
  string,
  every,
  eq,
  leq,
  be,
  number,
  oneOf,
  strictNumber,
  equal,
  Verifiable,
  array,
  object,
  integer,
  any,
  custom,
  boolean,
  function_,
  some,
  arrayOf,
  primitive,
  objectOf,
  util
} from '../walli'
import {getTypeName} from "../util";
const { funcify, constructify, createVerifiableClass, checkEqual } = util

const pkg = require('../../package.json')

function Version() {}
Version.prototype = Object.create(new Verifiable())
Version.prototype.constructor = Version
Version.prototype._check = function _check(request: any) {
  return every([
    string,
    custom(function(version) {
      const arr = version.split('.')
      if (arr.length === 3 && arrayOf(number).ok(arr)) {
        return null
      }
      return 'The version should shape of 1.0.0, but ' + version
    })
  ]).check(request)
}
const version = funcify<Verifiable>(Version)

class VersionRange extends Verifiable {
  _check(req: any) {
    return some([
      every([
        string,
        custom(function(version) {
          const arr = version.split('.')
          if (
            arr.length === 3 &&
            /^[\^\*~]/.test(arr[0]) &&
            arrayOf(number).ok(arr.slice(1))
          ) {
            return null
          }
          return 'The version should shape of ^1.0.0, but ' + version
        })
      ]),
      version()
    ]).check(req)
  }
}
const vRange = funcify(VersionRange)

describe('package', function() {
  const rule = leq({
    name: string,
    version: version(), //.message('vvv'),
    main: string.optional,
    description: string.optional,
    scripts: {
      test: be('jest')
    },
    dependencies: objectOf([vRange(), number]),
    keywords: arrayOf(string)
  })

  it('package spec', function() {
    expect(
      rule.toUnlawfulString({
        ...pkg,
        dependencies: {
          ...pkg.dependencies,
          x: '1.2.3'
        },
        version: 'x2.3.1'
      })
    ).toEqual(
      'version: The version should shape of 1.0.0, but x2.3.1\n' +
        "dependencies['json-stringify-safe']: KEY expected type: number, actual type: string.\n" +
        "dependencies['lodash']: KEY expected type: number, actual type: string.\n" +
        "dependencies['x']: KEY expected type: number, actual type: string."
    )
  })

  it('package spec clone/set', () => {
    const versionR = rule.get('version')
    expect(
      rule
        .clone()
        .set('version', any)
        .toUnlawfulString({
          ...pkg,
          dependencies: {
            ...pkg.dependencies,
            x: '1.2.3'
          },
          version: 'x2.3.1'
        })
    ).toEqual(
      "dependencies['json-stringify-safe']: KEY expected type: number, actual type: string.\n" +
        "dependencies['lodash']: KEY expected type: number, actual type: string.\n" +
        "dependencies['x']: KEY expected type: number, actual type: string."
    )

    rule.set('version', versionR)
  })

  it('package spec optional', () => {
    const val = {
      ...pkg,
      dependencies: {
        ...pkg.dependencies,
        x: '1.2.3'
      },
      version: undefined
    }

    expect(rule.toUnlawfulString(val)).toEqual(
      'version: expected type: string, actual type: undefined.\n' +
        "dependencies['json-stringify-safe']: KEY expected type: number, actual type: string.\n" +
        "dependencies['lodash']: KEY expected type: number, actual type: string.\n" +
        "dependencies['x']: KEY expected type: number, actual type: string."
    )

    delete val.version
    expect(
      rule
        .clone()
        .set('version', rule.get('version').clone().optional)
        .toUnlawfulString(val)
    ).toEqual(
      "dependencies['json-stringify-safe']: KEY expected type: number, actual type: string.\n" +
        "dependencies['lodash']: KEY expected type: number, actual type: string.\n" +
        "dependencies['x']: KEY expected type: number, actual type: string."
    )
  })

  it('should edam config', function() {
    const strictSource = createVerifiableClass({
      _check(req: any) {
        return leq({
          type: oneOf(['file', 'git', 'npm']),
          url: string,
          checkout: string.optional,
          version: string.optional
        }).check(req)
      },
      getDisplayName() {
        return 'strictSource'
      }
    })

    const source = createVerifiableClass({
      _check(req: any) {
        return oneOf([strictSource(), string]).check(req)
      },
      getDisplayName() {
        return 'source'
      }
    })

    // console.log(constructify(source).displayName, source().tostring)

    const rc = leq({
      source: source().optional,
      cacheDir: oneOf([boolean, string]).optional,
      alias: objectOf(source()).optional,
      extends: oneOf([string, arrayOf(string)]).optional,
      output: string.optional,
      plugins: arrayOf(eq([function_, any])).optional,
      pull: eq({
        npmClient: oneOf(['yarn', 'npm']),
        git: oneOf(['clone', 'download']).optional
      }).optional,
      storePrompts: boolean
    })

    const edam = rc.assign(
      leq({
        name: string.optional,
        updateNotify: boolean.optional,
        yes: boolean.optional,
        silent: boolean.optional
      })
    )

    expect(
      edam.toUnlawfulString({
        name: null,
        updateNotify: '222',
        plugins: [[function() {}, {}], [null, null], null],
        output: 'aaa',
        pull: {
          npmClient: 'abc'
          // git: 'clone'
        },
        storePrompts: true,
        source: {
          type: 'npm',
          url: 'asdadsa'
          // checkout: ''
        }
      })
    ).toEqual(
      'name: expected type: string, actual type: null.\n' +
        'updateNotify: expected type: boolean, actual type: string.\n' +
        "plugins['1']['0']: expected type: function, actual type: null.\n" +
        "plugins['2']: expected type: array, actual type: null.\n" +
        "pull['npmClient']: expected: oneOf(['yarn', 'npm']), actual: 'abc'."
    )
  })

  it('should example', function() {
    expect(oneOf(['123', string]).getRuleString()).toBe("['123', string]")

    expect(
      eq({ a: 'a' })
        .set('a', 'bbb')
        .ok({ a: 'bbb' }) === true
    ).toBeTruthy()

    // expect(
    //   eq({ a: 'a' })
    //     .set(void 0, 'bbb')
    //     .ok('bbb') === true
    // ).toBeTruthy()
    //
    // expect(eq({ a: 'a' }).get('a') === 'a').toBeTruthy()
    // expect(eq({ a: 'a' }).ok(eq({ a: 'a' }).get()) === true).toBeTruthy()
  })

  it('should example2', function() {
    expect(checkEqual('123', '123').ok === true).toBeTruthy()
    expect(checkEqual('123', 123).ok === true).toBeFalsy()
    expect(checkEqual('123', '1234').ok === false).toBeTruthy()
    expect(checkEqual('123', string).ok === true).toBeTruthy()
    expect(checkEqual('123', 123, any).ok === true).toBeTruthy()

    const age = createVerifiableClass({
      _check(req) {
        return integer.check(req)
      },
      getDisplayName() {
        return 'Age'
      }
    })

    expect(age().ok(22) === true).toBeTruthy()
    expect(age().ok('22') === false).toBeTruthy()
    expect(age().getTypeName() === 'Age').toBeTruthy()
    expect(age().toString()).toBe('Age()')
    expect(age().isRequired).toBe(true)
  })

  it('should es6 inheritance', function() {
    class Age extends Verifiable {
      _check() {
        return null
      }
      static displayName = 'Age'
      constructor(rule?, options?) {
        super(rule, options)
        this.rule = null
        this.options = null
      }
    }

    const age = funcify(Age)
    expect(age() instanceof Age).toBeTruthy() // true
    expect(new Age() instanceof Age).toBeTruthy() // true
    expect(constructify(age) === Age).toBeTruthy()
  })

  it('should custom demo', function() {
    const tenCheck = custom(function([reqA, reqB]) {
      // Passed
      if (reqA + reqB === 10) {
        return null
      }
      // Unlawful
      // Allows returning string, Unlawfulness, Reason or UnlawfulnessList
      return 'reqA + reqB should be equals 10.'
    })

    expect(tenCheck.ok([1, 2]) === false).toBeTruthy()
    expect(
      tenCheck.toUnlawfulString([1, 2]) === 'reqA + reqB should be equals 10.'
    ).toBeTruthy()
  })

  it('should final', function() {
    expect(primitive.ok('2')).toBeTruthy()

    expect(primitive.message('sds').toUnlawfulString([])).toBe('sds')

    expect(primitive.toUnlawfulString([])).toBe(
      "expected type: ['undefined', 'string', 'number', 'boolean', 'symbol'], actual type: array."
    )

    expect(array.ok([1, 2])).toBeTruthy()
    expect(object.ok([1, 2])).toBeFalsy()
    expect(object.ok(new String('22'))).toBeFalsy()
    expect(object.ok(new Boolean(false))).toBeFalsy()

    expect(object.ok({ a: 2 })).toBeTruthy()
    expect(object.ok(new Date())).toBeFalsy()

    expect(object.ok({})).toBeTruthy()
  })

  it('should final using in leq', () => {
    leq({
      name: string
    })
  })

  it('should getTypeName', function() {
    expect(getTypeName('')).toEqual('string')
    expect(getTypeName(1)).toEqual('number')
    expect(getTypeName(0)).toEqual('number')
    expect(getTypeName(null)).toEqual('null')
    expect(getTypeName(false)).toEqual('boolean')
    expect(getTypeName(undefined)).toEqual('undefined')
    expect(getTypeName('1')).toEqual('string')
  })

  it('should strictNumber', function () {
    expect(strictNumber.check('').toString()).toEqual('expected type: StrictNumber, actual type: string.')
  });

  it('should dynamic message', function() {
    expect(string.message(':expected::actual:').toUnlawfulString(2222)).toBe(
      'stringnumber'
    )

    expect(
      string
        .message((expect, actual) => {
          return expect + '::' + actual
        })
        .toUnlawfulString(2222)
    ).toBe('[object Object]::[object Object]')
  })
})
