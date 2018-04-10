import {
  string,
  every,
  eq,
  leq,
  be,
  number,
  oneOf,
  equal,
  Verifiable,
  array,
  object,
  any,
  custom,
  boolean,
  function_,
  some
} from '../walli'
import { util } from '../walli'
import { constructify } from '../util'
const { funcify, createVerifiableClass } = util

const pkg = require('../../package.json')

function Version() {}
Version.prototype = Object.create(new Verifiable())
Version.prototype.constructor = Version
Version.prototype._check = function _check(request: any) {
  return every([
    string(),
    custom(function(version) {
      const arr = version.split('.')
      if (arr.length === 3 && array(number()).ok(arr)) {
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
        string(),
        custom(function(version) {
          const arr = version.split('.')
          if (
            arr.length === 3 &&
            /^[\^\*~]/.test(arr[0]) &&
            array(number()).ok(arr.slice(1))
          ) {
            return null
          }
          return 'The version should shape of ^1.0.0, but ' + version
        })
      ]),
      version()
    ])._check(req)
  }
}
const vRange = funcify(VersionRange)

describe('package', function() {
  const rule = leq({
    name: string(),
    version: version(), //.message('vvv'),
    main: string().optional(),
    description: string().optional(),
    scripts: {
      test: be('jest')
    },
    dependencies: object([vRange(), number()]),
    keywords: array(string())
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
        .set('version', any())
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
        .set(
          'version',
          rule
            .get('version')
            .clone()
            .optional()
        )
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
          url: string(),
          checkout: string().optional(),
          version: string().optional()
        })._check(req)
      },
      getDisplayName() {
        return 'strictSource'
      }
    })

    const source = createVerifiableClass({
      _check(req: any) {
        return oneOf([strictSource(), string()])._check(req)
      },
      getDisplayName() {
        return 'source'
      }
    })

    // console.log(constructify(source).displayName, source().toString())

    const rc = leq({
      source: source().optional(),
      cacheDir: oneOf([boolean(), string()]).optional(),
      alias: object(source()).optional(),
      extends: oneOf([string(), array(string())]).optional(),
      output: string().optional(),
      plugins: array(eq([function_(), any()])).optional(),
      pull: eq({
        npmClient: oneOf(['yarn', 'npm']),
        git: oneOf(['clone', 'download']).optional()
      }).optional(),
      storePrompts: boolean()
    })

    const edam = rc.assign(
      leq({
        name: string().optional(),
        updateNotify: boolean().optional(),
        yes: boolean().optional(),
        silent: boolean().optional()
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
          url: 'asdadsa',
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
})
