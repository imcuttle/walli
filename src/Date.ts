/**
 * @file NullOrUndefined
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { isDate } from 'lodash'
import { TypeVerifiable } from './TypeVerifiable'

/**
 * Type Verifies: isDate
 */
export class Date extends TypeVerifiable {
  rule = req => isDate(req)
  options = {
    type: global.Date,
    typeName: 'Date'
  }
}

export default funcify<Date>(Date)
