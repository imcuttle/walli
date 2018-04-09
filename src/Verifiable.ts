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
import { isString, set, get, PropertyPath } from 'lodash'
import HasMessage from './util/HasMessage'
import { funcify } from './util'

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

  set(paths?: PropertyPath, val?: any) {
    if (typeof paths === 'undefined') {
      this.rule = val
    }
    else {
      set(this.rule, paths, val)
    }
    return this
  }

  get(paths?: PropertyPath, fallBackVal?: any) {
    if (typeof paths === 'undefined') {
      return this.rule
    }
    return get(this.rule, paths, fallBackVal)
  }

  public clone() {
    return funcify<Verifiable>(this.constructor)(this.rule, this.options)
  }

  public isRequired: boolean = true
  public required() {
    this.isRequired = true
    return this
  }
  public optional() {
    this.isRequired = false
    return this
  }

  // should be implemented
  protected _check(request: any): CheckAble {
    return null
  }

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
  public toUnlawfulString(request?: any, options?: object): string {
    return this.check(request).toString(options)
  }

  toString() {
    let name = (<FunctionWithName>this.constructor).name || 'unKnown'
    name = `${name[0].toLowerCase()}${name.slice(1)}`

    return `${name}(${this.rule || ''})`
  }
}
