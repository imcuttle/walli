/**
 * @file StrictNumber
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { isNumber } from 'lodash'
import { TypeVerifiable } from './TypeVerifiable'

/**
 * Checks number (excludes string)
 *
 * ```javascript
 * strictNumber().ok('123') === false
 * strictNumber().ok(123) === true
 * ```
 */
export class StrictNumber extends TypeVerifiable {
  rule = isNumber
  options = {
    type: StrictNumber,
    typeName: 'StrictNumber'
  }
}

export default funcify<StrictNumber>(StrictNumber)
