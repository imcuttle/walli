/**
 * @file Null
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { isInteger } from 'lodash'
import { TypeVerifiable } from './TypeVerifiable'

export class Integer extends TypeVerifiable {
  rule = isInteger
  options = {
    type: Integer,
    typeName: 'int'
  }
}

export default funcify<Integer>(Integer)
