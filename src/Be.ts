/**
 * @file Be
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { Reason, Unlawfulness, UnlawfulnessList } from './Unlawful'
import { funcify } from './util/index'
import ToBeReason from './reasons/ToBe'

export class Be extends Verifiable {
  _check(request: any) {
    if (this.rule === request) {
      return null
    }
    return new Unlawfulness(new ToBeReason(this.rule, request))
  }
}

export default funcify<Be>(Be)
