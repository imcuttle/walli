/**
 * @file oneOf
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { Unlawfulness, UnlawfulnessList } from './Unlawful'
import Type, { TypeItem } from './reasons/TypeReason'
import { funcify } from './util/index'
import checkEqual from './util/checkEqual'
import Message from './reasons/Message'

export class OneOf extends Verifiable {
  public rule: any[]
  constructor(rules: any[]) {
    super(rules)
  }

  _check(request: any) {
    const ok = this.rule.some(rule => {
      const result = checkEqual(request, rule)
      return result.ok
    })

    return ok
      ? null
      : `should be one of [${this.rule.join(', ')}], but received: ${request}`
  }
}

export default funcify<OneOf, any[]>(OneOf)
