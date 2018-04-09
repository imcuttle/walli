/**
 * @file Any
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { funcify } from './util/index'

export class Any extends Verifiable {
  _check(request: any) {
    return null
  }
}

export default funcify<Any>(Any)
