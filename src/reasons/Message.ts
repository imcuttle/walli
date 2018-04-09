/**
 * @file Required
 * @author Cuttle Cong
 * @date 2018/4/8
 * @description
 */
import { Reason } from '../Unlawful'

export default class Message extends Reason {
  constructor(public humanMessage: string) {
    super()
    this.humanMessage = humanMessage
  }
  toHumanMessage() {
    return this.humanMessage
  }
}
