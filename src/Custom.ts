/**
 * @file Custom
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable, { CheckAble } from './Verifiable'
import { funcify } from './util/index'

/**
 * Allows customized function to check request.
 *
 * ```javascript
 * const r = custom(function (req) {
 *  if (req === 'ok') {
 *    // passed
 *    return null
 *  }
 *  // Returns unlawful message
 *  return 'should to be `ok`.'
 * })
 * r.ok('ok') === true
 * r.toUnlawfulString('ok') === ''
 * r.toUnlawfulString('okk') === 'should to be `ok`.'
 * ```
 */
export class Custom extends Verifiable {
  public rule: (...args) => CheckAble

  _check(...requests: any[]) {
    return this.rule.apply(null, requests)
  }
}

export default funcify<Custom, (...args) => CheckAble>(Custom)
