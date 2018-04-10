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

  /**
   * set message
   * ```javascript
   * be('2').message('error').toUnlawfulString(2) === 'error'
   * be('2').message('error').message().toUnlawfulString(2) === "expected: '2', actual: 2."
   * ```
   * @param {string | null} msg
   * @return {this}
   */
  public message(msg: string | null = null) {
    this.msg = msg
    return this
  }
}
