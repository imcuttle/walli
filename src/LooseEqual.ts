/**
 * @file Equal
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { InnerEqual } from './InnerEqual'


export class LooseEqual extends InnerEqual {
  constructor(public rule?: any) {
    super(rule, { loose: true })
  }
}

export default funcify<LooseEqual>(LooseEqual)
