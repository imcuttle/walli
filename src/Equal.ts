/**
 * @file Equal
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import * as _ from 'lodash'
import { InnerEqual } from './InnerEqual'

/**
 * **alias:** `eq`
 *
 * *Checks whether the actual and the expected are similar.
 * please see the twin brother [[LooseEqual]] for more information.
 * ```javascript
 * eq([]).ok([]) === true
 * eq('222').ok(222) === true
 * eq(['222']).ok([222]) === false
 * eq({ a: { b: '2' } }).ok({ a: { b: '2' } }) === true
 * // The actual value contains `.c` which isn't allowed.
 * eq({ a: { b: '2' } }).ok({ a: { b: '2' }, c: 'ddd' }) === false
 * ```
 */
export class Equal extends InnerEqual {
  constructor(public rule?: any) {
    super(rule, { loose: false })
  }
}

export default funcify<Equal>(Equal)
