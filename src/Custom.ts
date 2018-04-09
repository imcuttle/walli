/**
 * @file Custom
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable, { CheckAble } from './Verifiable'
import { Reason, Unlawfulness, UnlawfulnessList } from './Unlawful'
import { funcify } from './util/index'
import ToBeReason from './reasons/ToBe'

export class Custom extends Verifiable {
  public rule: (...args) => CheckAble

  _check(...requests: any[]) {
    return this.rule.apply(null, requests)
  }
}

export default funcify<Custom, (...args) => CheckAble>(Custom)
