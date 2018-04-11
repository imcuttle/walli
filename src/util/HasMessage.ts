/**
 * @file HasMessage
 * @author Cuttle Cong
 * @date 2018/4/9
 * @description
 */

export default class HasMessage {
  public msg: string | null | Function = null

  public hasMessage() {
    return typeof this.msg === 'string' || typeof this.msg === 'function'
  }

  private _setMessage(msg) {
    this.msg = msg
    return this
  }

  public message(msg: string | null | Function = null) {
    return this.clone()._setMessage(msg)
  }

  /**
   * @return {HasMessage}
   */
  public clone() {
    return new (<typeof HasMessage>this.constructor)()
  }
}
