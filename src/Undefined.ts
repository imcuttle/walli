/**
 * @file Undefined
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { isUndefined } from 'lodash'
import { TypeVerifiable } from './TypeVerifiable'

export class Undefined extends TypeVerifiable {
  rule = isUndefined
  options = {
    type: Undefined,
    typeName: 'undefined'
  }
}

export default funcify<Undefined>(Undefined)
