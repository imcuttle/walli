/**
 * @file Not
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { Reason, Unlawfulness, UnlawfulnessList } from './Unlawful'
import { funcify } from './util/index'
import Message from './reasons/Message'
import checkEqual from './util/checkEqual'

/**
 * Checks the value on the contrary.
 *
 * ```javascript
 * not('2').ok('2') === false
 * not('2').ok('12') === true
 * not(eq('2')).ok(2) === false
 * ```
 */
export class Not extends Verifiable {
  _check(request: any) {
    const rlt = checkEqual(request, this.rule)
    if (!rlt.ok) {
      return null
    }

    return new Unlawfulness(
      new Message(`(Not) expected: ${this.rule}, actual: ${request}.`)
    )
  }
}

export default funcify<Not>(Not)
