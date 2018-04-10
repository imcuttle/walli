/**
 * @file Object
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import {Reason, Unlawfulness, UnlawfulnessList} from './Unlawful'
import { funcify, toArray } from './util/index'
import Type, { TypeItem } from './reasons/TypeReason'
import checkEqual from './util/checkEqual'
import { isArray } from 'lodash'

const Gobject = global.Object

/**
 * Checks object's shape.
 *
 * ```javascript
 * object('val').ok({ a: 'val', b: 'val' }) === true
 * object('val').ok({}) === true
 * object('val').ok({ a: 'xxx' }) === false
 * ```
 */
export class Object_ extends Verifiable {
  // [valRule, keyRule]
  public rule: [any, any]

  constructor(rule: any | [any, any]) {
    super(rule)
    if (typeof rule !== 'undefined') {
      this.rule = <[any, any]>toArray(rule)
    }
  }

  protected _check(request: any) {
    if (request === null || typeof request !== 'object') {
      return new Unlawfulness(
        new Type(
          new TypeItem(Gobject, 'object'),
          TypeItem.fromInstance(request)
        )
      )
    }

    if (!this.rule || !this.rule.length) {
      return null
    }

    const [valRule, keyRule] = this.rule
    return new UnlawfulnessList(
      Gobject.keys(request).map(key => {
        const val = request[key]

        if (typeof keyRule !== 'undefined') {
          const ck = checkEqual(key, keyRule)
          if (!ck.ok) {
            ck.eachReasons(function (reason) {
              reason.setPrefix('KEY ' + reason.prefix)
            })
            ck.unshiftPaths(key)
            return ck
          }
        }

        const cv = checkEqual(val, valRule)
        if (!cv.ok) {
          cv.eachReasons(function (reason) {
            reason.setPrefix('VALUE ' + reason.prefix)
          })
          cv.unshiftPaths(key)
          return cv
        }
        return new UnlawfulnessList()
      })
    )
  }
}

export default funcify<Object_>(Object_)
