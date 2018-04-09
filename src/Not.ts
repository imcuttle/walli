/**
 * @file Not
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { Reason, Unlawfulness, UnlawfulnessList } from './Unlawful'
import { funcify } from './util/index'
import ToBeReason from './reasons/ToBe'
import Message from "./reasons/Message";
import checkEqual from "./util/checkEqual";

export class Not extends Verifiable {
  _check(request: any) {
    const rlt = checkEqual(request, this.rule)
    if (!rlt.ok) {
      return null
    }

    return new Unlawfulness(new Message(`(Not) expected: ${this.rule}, actual: ${request}.`))
  }
}

export default funcify<Not>(Not)
