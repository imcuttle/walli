/**
 * @file Equal
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import * as _ from 'lodash'
import { InnerEqual } from './InnerEqual'

export class Equal extends InnerEqual {
  constructor(public rule?: any) {
    super(rule, { loose: false })
  }
}

export default funcify<Equal>(Equal)
