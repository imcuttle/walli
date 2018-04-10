/**
 * @file NullOrUndefined
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { isBoolean } from 'lodash'
import { TypeVerifiable } from './TypeVerifiable'

/**
 * Type Verifies: Checks isBoolean
 */
export class Boolean extends TypeVerifiable {
  rule = isBoolean
  options = {
    type: global.Boolean,
    typeName: 'boolean'
  }
}

export default funcify<Boolean>(Boolean)
