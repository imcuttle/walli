import { toString } from '../util'
import HasMessage from '../util/HasMessage'
import { single } from '../util/quote'

/**
 * @file Reason
 * @author Cuttle Cong
 * @date 2018/4/11
 * @description
 */

export default class Reason extends HasMessage {
  constructor(public expect?: any, public actual?: any) {
    super()
    this.expect = expect
    this.actual = actual
  }

  public prefix: string = ''
  public setPrefix(prefix: string) {
    this.prefix = prefix
    return this
  }
  public suffix: string = ''
  public setSuffix(suffix: string) {
    this.suffix = suffix
    return this
  }

  protected toHumanMessage(): string {
    return ''
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
  public message(msg: null | string | Function = null): Reason {
    return <Reason>super.message(msg)
  }
  public clone(): Reason {
    return new (<typeof Reason>this.constructor)(this.expect, this.actual)
  }

  public toExpectedString() {
    return toString(this.expect, { empty: 'undefined' })
  }

  public toActualString() {
    return toString(this.actual, { empty: 'undefined' })
  }

  // human-friendly message
  public toString(): string {
    let string = !this.hasMessage() ? this.toHumanMessage() : this.msg

    if (typeof string === 'function') {
      string = <string>string(this.expect, this.actual)
    }

    string = this.prefix + string + this.suffix

    return string
      .replace(/:expected:/g, this.toExpectedString())
      .replace(/:actual:/g, this.toActualString())
  }
}

