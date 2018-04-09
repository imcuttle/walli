/**
 * @file Some
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { funcify, toArray } from './util/index'
import { some } from './util/ruleEachBreakable'
import { UnlawfulnessList } from './Unlawful'

export class Some extends Verifiable {
  public rule: any[]

  _check(request: any) {
    return <UnlawfulnessList>some(this.rule, request)
  }
}

export default funcify<Some, any[]>(Some)
