/**
 * @file Null
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { isFunction } from 'lodash'
import { TypeVerifiable } from './TypeVerifiable'

export class Function extends TypeVerifiable {
  rule = isFunction
  options = {
    type: global.Function,
    typeName: 'function'
  }
}

export default funcify<Function>(Function)
