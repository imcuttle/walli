/**
 * @file HasMessage
 * @author Cuttle Cong
 * @date 2018/4/9
 * @description
 */

export default class HasMessage {
  public msg: string | null = null
  public hasMessage() {
    return typeof this.msg === 'string'
  }
  public message(msg: string | null = null) {
    this.msg = msg
    return this
  }
}
