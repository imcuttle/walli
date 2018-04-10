/**
 * @file Any
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { funcify } from './util/index'

/**
 * Anything is passed.
 *
 * ```javascript
 * any().ok('any') === true
 * ```
 */
export class Any extends Verifiable {
  protected _check(request: any) {
    return null
  }
}

export default funcify<Any>(Any)
