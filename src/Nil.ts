/**
 * @file NullOrUndefined
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { isNil } from 'lodash'
import { TypeVerifiable } from './TypeVerifiable'

export class Nil extends TypeVerifiable {
  rule = isNil
  options = {
    type: Nil,
    typeName: 'Nil'
  }
}

export default funcify<Nil>(Nil)
