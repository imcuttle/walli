/**
 * @file StringMatching
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { funcify } from './util/index'
import { string } from './walli'
import ToEqualReason from './reasons/Equal'

/**
 * String Matching
 *
 * ```javascript
 * // `stringMatching('any')` is equals to `stringMatching(/any/)`
 * stringMatching('any').ok('axanyx') === true
 * stringMatching('any').ok('axanyx') === true
 * stringMatching(/^any/).ok('axanyx') === false
 * ```
 */

export class StringMatching extends Verifiable {
  public rule: RegExp

  constructor(rule: RegExp | string) {
    super(rule)
    if (string.ok(rule)) {
      rule = new RegExp(rule)
    }
    this.rule = <RegExp>rule
  }

  protected _check(request: any) {
    let rule = this.rule
    if ((<RegExp>rule).test(request)) {
      return null
    }

    return new ToEqualReason(this, request)
  }
}

export default funcify<StringMatching>(StringMatching)
