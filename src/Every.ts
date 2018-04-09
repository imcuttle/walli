/**
 * @file Every
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { funcify, toArray } from './util/index'
import { every } from './util/ruleEachBreakable'
import { UnlawfulnessList } from './Unlawful'

export class Every extends Verifiable {
  public rule: any[]

  _check(request: any) {
    return <UnlawfulnessList>every(this.rule, request)
  }
}

export default funcify<Every, any[]>(Every)
