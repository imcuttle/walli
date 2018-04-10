/**
 * @file oneOf
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { Unlawfulness, UnlawfulnessList } from './Unlawful'
import Type, { TypeItem } from './reasons/TypeReason'
import { funcify, toString } from './util/index'
import checkEqual from './util/checkEqual'
import ToEqualReason from "./reasons/Equal";

export class OneOf extends Verifiable {
  public rule: any[]
  constructor(rules: any[]) {
    super(rules)
  }

  _check(request: any) {
    let unlaw, errorRule
    const ok = this.rule.some((rule, k) => {
      errorRule = rule
      unlaw = checkEqual(request, rule)
      return unlaw.ok
    })

    if (ok) {
      return null
    }

    return new ToEqualReason(this, request)
  }
}

export default funcify<OneOf, any[]>(OneOf)
