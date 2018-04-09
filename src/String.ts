/**
 * @file String
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { isString } from 'lodash'
import { TypeVerifiable } from './TypeVerifiable'

export class String extends TypeVerifiable {
  rule = isString
  options = {
    type: global.String,
    typeName: 'string'
  }
}

export default funcify<String>(String)
