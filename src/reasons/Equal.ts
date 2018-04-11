import { Reason } from '../Unlawful'
import { toString } from '../util'

/**
 * @file ToBe
 * @author Cuttle Cong
 * @date 2018/4/8
 * @description
 */

export default class ToEqualReason extends Reason {
  toHumanMessage() {
    return `expected: :expected:, actual: :actual:.`
  }
}
