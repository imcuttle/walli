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

  /**
   * set message
   *
   * ```javascript
   * be('2').message('error').toUnlawfulString(2) === 'error'
   * be('2').message('error').message().toUnlawfulString(2) === "expected: '2', actual: 2."
   * ```
   *
   * Nested case
   *
   * ```
   * const r = equal({
   *   a: 2,
   *   b: {
   *     c: '2',
   *     d: be('d').message('errr')
   *   },
   *   // placeholder: `:expected:` `:actual:`
   *   c: be('xxxx').message(':expected: :actual: error .c')
   * }).message('error equal')
   *
   * expect(r.toUnlawfulString({ a: 2, x: '22', b: { c: '2', d: 'd' } })).toBe(
   *   'error equal'
   * )
   * expect(r.toUnlawfulString({ a: 2, c: 'xxxx', b: { c: '2', d: 'd' } })).toBe(
   *   ''
   * )
   * expect(r.toUnlawfulString({ a: 2, c: 'xxxw', b: { c: '2', d: 'd' } })).toBe(
   *   "c: '2' 'xxxw' error .c"
   * )
   * expect(
   *   r.toUnlawfulString({ a: 2, c: 'xxxx', b: { c: '2', d: 'dd' } })
   * ).toBe("b['d']: errr")
   * ```
   * @param {string | null} msg
   * @return {HasMessage}
   */
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
