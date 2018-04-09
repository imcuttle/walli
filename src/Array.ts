/**
 * @file Array
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { Reason, Unlawfulness, UnlawfulnessList } from './Unlawful'
import { funcify } from './util/index'
import { isArray } from 'lodash'
import Type, { TypeItem } from './reasons/TypeReason'
import checkEqual from "./util/checkEqual";

export class Array extends Verifiable {
  _check(request: any[]) {
    if (!isArray(request)) {
      return new Type(new TypeItem(Array), TypeItem.fromInstance(request))
    }

    if (typeof this.rule === 'undefined') {
      return null
    }

    let unlaw = null
    request.every(req => {
      const c = checkEqual(req, this.rule)
      if (c.ok) {
        return true
      }
      unlaw = c
    })
    return unlaw
  }
}

export default funcify<Array>(Array)
