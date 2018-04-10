/**
 * @file Be
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { Reason, Unlawfulness, UnlawfulnessList } from './Unlawful'
import { funcify } from './util/index'
import ToEqual from './reasons/Equal'

/**
 * Checks the actual value to be the expected.
 *
 * ```javascript
 * be({}).ok({}) === false
 * be('23').ok('23') === true
 * be(23).ok('23') === false
 * ```
 */
export class Be extends Verifiable {
  _check(request: any) {
    if (this.rule === request) {
      return null
    }
    return new Unlawfulness(new ToEqual(this.rule, request))
  }
}

export default funcify<Be>(Be)
