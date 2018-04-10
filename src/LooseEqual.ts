/**
 * @file LooseEqual
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { InnerEqual } from './InnerEqual'

/**
 * **alias:** `leq`
 *
 * *Checks whether the actual and the expected are **loose** equation.
 * please see the twin brother [[Equal]] for more information.
 * ```javascript
 * leq([]).ok([]) === true
 * leq('222').ok('222') === false
 * leq(['222']).ok([222]) === false
 * leq({ a: { b: '2' } }).ok({ a: { b: '2' } }) === true
 * // The actual value contains `.c` and `.a.d` which are allowed in loose equation.
 * leq({ a: { b: '2' } }).ok({ a: { b: '2', d: 'allowed' }, c: 'ddd' }) === true
 * // `.a.d` is denied when wrapped by `eq`.
 * leq({ a: eq({ b: '2' }) }).ok({ a: { b: '2', d: 'allowed' }, c: 'ddd' }) === false
 * ```
 */
export class LooseEqual extends InnerEqual {
  constructor(public rule?: any) {
    super(rule, { loose: true })
  }
}

export default funcify<LooseEqual>(LooseEqual)
