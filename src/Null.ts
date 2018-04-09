/**
 * @file Null
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { isNull } from 'lodash'
import { TypeVerifiable } from './TypeVerifiable'

export class Null extends TypeVerifiable {
  rule = isNull
  options = {
    type: null,
    typeName: 'null'
  }
}

export default funcify<Null>(Null)
