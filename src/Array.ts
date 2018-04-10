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

    let unlawList = new UnlawfulnessList()
    request.forEach((req, i) => {
      const c = checkEqual(req, this.rule)
      if (c.ok) {
        return
      }
      c.unshiftPaths(i)
      unlawList.push(c)
    })
    return unlawList
  }
}

export default funcify<Array>(Array)
