import { Reason } from '../Unlawful'
import {
  toString
} from '../util'

/**
 * @file ToBe
 * @author Cuttle Cong
 * @date 2018/4/8
 * @description
 */

export default class ToEqualReason extends Reason {
  constructor(public expect: any, public actual: any) {
    super()
    this.expect = expect
    this.actual = actual
  }

  toHumanMessage() {
    return `expected: ${toString(this.expect, { empty: 'undefined' })}, actual: ${toString(this.actual, { empty: 'undefined' })}`
  }
}
