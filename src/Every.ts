/**
 * @file Every
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { funcify, toArray } from './util/index'
import { every } from './util/ruleEachBreakable'
import { UnlawfulnessList } from './Unlawful'

/**
 * Combines rules when every rule is ok.
 *
 * ```javascript
 * every([string(), 'abc']).ok('abc') === true
 * // Type of 123 is number, not string.
 * every([string(), 'abc']).ok(123) === false
 * // '123' !== 'abc'
 * every([string(), 'abc']).ok('123') === false
 * ```
 */
export class Every extends Verifiable {
  public rule: any[]

  _check(request: any) {
    return <UnlawfulnessList>every(this.rule, request)
  }
}

export default funcify<Every, any[]>(Every)
