/**
 * @file Number
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { TypeVerifiable } from './TypeVerifiable'

export class Number extends TypeVerifiable {
  rule = req => {
    return !isNaN(req)
  }
  options = {
    type: Number,
    typeName: 'number'
  }
}

export default funcify<Number>(Number)
