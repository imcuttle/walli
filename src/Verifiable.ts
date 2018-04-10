/**
 * @file Verifiable
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import {
  FunctionWithName,
  Reason,
  Unlawfulness,
  UnlawfulnessList
} from './Unlawful'
import Message from './reasons/Message'
import {
  camelCase,
  isString,
  isFunction,
  set,
  get,
  isArray,
  PropertyPath
} from 'lodash'
import HasMessage from './util/HasMessage'
import { getDisplayName, funcify, toString, toArray } from './util'

export type CheckAble =
  | string
  | UnlawfulnessList
  | Unlawfulness
  | Unlawfulness[]
  | Reason
  | null

export default class Verifiable extends HasMessage {
  constructor(public rule?: any, public options: any = {}) {
    super()
    this.rule = rule
    this.options = options
  }

  /**
   * set rule
   * ```javascript
   * eq({ a: 'a' }).set('a', 'bbb').ok({ a: 'bbb' }) === true
   * eq({ a: 'a' }).set(null, 'bbb').ok('bbb') === true
   * ```
   * @param {"../index".PropertyPath} paths
   * @param val
   * @return {any | undefined}
   */
  set(paths?: PropertyPath, val?: any) {
    if (paths == null) {
      this.rule = val
    } else {
      set(this.rule, paths, val)
    }
    return this
  }

  /**
   * get rule
   * ```
   * eq({ a: 'a' }).get('a') === 'a'
   * eq({ a: 'a' }).ok(
   *  eq({ a: 'a' }).get()
   * ) === true
   * ```
   * @param {"../index".PropertyPath} paths
   * @param fallBackVal
   * @return {this}
   */
  get(paths?: PropertyPath, fallBackVal?: any) {
    if (paths == null) {
      return this.rule
    }
    return get(this.rule, paths, fallBackVal)
  }

  /**
   * clone the instance shallowly.
   * @return {Verifiable}
   */
  public clone() {
    return funcify<Verifiable>(this.constructor)(this.rule, this.options)
  }

  /**
   * The verifiable instance is required.
   * @type {boolean}
   */
  public isRequired: boolean = true
  /**
   * Set the verifiable rule to be required. please see [[required]].
   * @return {this}
   */
  public required() {
    this.isRequired = true
    return this
  }

  /**
   * Set the verifiable rule to be optional.
   *
   * ```javascript
   * const r = eq({
   *  a: string().optional(),
   *  b: string() // .required()  by default
   * })
   *
   * r.ok({ b: 'abc' }) === true
   * r.ok({ a: 'abc' }) === false
   * ```
   * @return {this}
   */
  public optional() {
    this.isRequired = false
    return this
  }

  /**
   * Should be implemented
   * @param request
   * @return {CheckAble}
   * @protected
   */
  protected _check(request: any): CheckAble {
    return null
  }

  /**
   * The main check method which would invokes [[_check]].
   * @param request
   * @return {UnlawfulnessList}
   */
  public check(request?: any): UnlawfulnessList {
    const res = this._check(request)
    let result: UnlawfulnessList
    if (res instanceof UnlawfulnessList) {
      result = res
    } else if (res instanceof Unlawfulness) {
      result = new UnlawfulnessList([res])
    } else if (Array.isArray(res)) {
      result = new UnlawfulnessList(res)
    } else if (isString(res)) {
      result = new UnlawfulnessList([new Unlawfulness(new Message(res))])
    } else if (res instanceof Reason) {
      result = new UnlawfulnessList([new Unlawfulness(res)])
    } else {
      result = new UnlawfulnessList()
    }

    if (this.hasMessage()) {
      result.list = result.list.map(item => {
        item.reasons = item.reasons.map(
          reason => (reason.hasMessage() ? reason : reason.message(this.msg))
        )
        return item
      })
    }
    return result
  }

  public ok(request?: any): boolean {
    const out = this.check(request)
    return out.ok
  }

  /**
   * ```
   * be('2').toUnlawfulString('2') === ''
   * be('2').toUnlawfulString(2) === "expected: '2', actual: 2."
   * ```
   * @param request
   * @param {object} options
   * @return {string}
   */
  public toUnlawfulString(request?: any, options?: object): string {
    return this.check(request).toString(options)
  }

  static displayName: string

  /**
   * Gets the type name
   * ```javascript
   * oneOf(['123', string()]).getTypeName() === "oneOf"
   * ```
   * @return {string}
   */
  public getTypeName(): string {
    return getDisplayName(this.constructor, { camel: true }) || 'unKnown'
  }

  /**
   * Gets the rule string
   * ```javascript
   * oneOf(['123', string()]).getRuleString() === "['123', string()]"
   * ```
   * @return {string}
   */
  public getRuleString(): string {
    return toString(this.rule, { empty: '' })
  }

  /**
   * Gets the verifiable instance string
   * ```javascript
   * oneOf(['123', string()]).getRuleString() === "oneOf(['123', string()])"
   * ```
   * @return {string}
   */
  toString() {
    let name = this.getTypeName()
    return `${name}(${this.getRuleString()})`
  }
}
