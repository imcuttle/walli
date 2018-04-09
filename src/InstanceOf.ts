/**
 * @file InstanceOf
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { funcify, name } from './util/index'

export class InstanceOf extends Verifiable {
  rule: Function

  _check(request: any) {
    if (request instanceof this.rule) {
      return null
    }

    return `should instance of ${name(this.rule)}, but ${name(request)}`
  }
}

export default funcify<InstanceOf>(InstanceOf)
