/**
 * @file Required
 * @author Cuttle Cong
 * @date 2018/4/8
 * @description
 */
import { Reason } from '../Unlawful'

export default class Required extends Reason {
  toHumanMessage() {
    return 'required'
  }
}
