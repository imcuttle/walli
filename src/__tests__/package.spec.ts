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
  some
} from '../walli'
import { util } from '../walli'
const { funcify } = util

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
        "dependencies['lodash']: KEY expected type number, actual type string.\n" +
        "dependencies['x']: KEY expected type number, actual type string."
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
      "dependencies['lodash']: KEY expected type number, actual type string.\n" +
        "dependencies['x']: KEY expected type number, actual type string."
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
      'version: expected type string, actual type undefined.\n' +
        "dependencies['lodash']: KEY expected type number, actual type string.\n" +
        "dependencies['x']: KEY expected type number, actual type string."
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
      "dependencies['lodash']: KEY expected type number, actual type string.\n" +
        "dependencies['x']: KEY expected type number, actual type string."
    )
  })
})
