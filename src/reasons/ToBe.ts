import { Reason } from '../Unlawful'

/**
 * @file ToBe
 * @author Cuttle Cong
 * @date 2018/4/8
 * @description
 */
import { toString } from '../util'

export default class ToBeReason extends Reason {
  constructor(public expect: any, public actual: any) {
    super()
    this.expect = expect
    this.actual = actual
  }

  toHumanMessage() {
    return `expected: ${toString(this.expect, { empty: 'nothing' })}, actual: ${toString(this.actual, { empty: 'nothing' })}.`
  }
}
