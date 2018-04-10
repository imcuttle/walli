/**
 * @file InstanceOf
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { funcify, getTypeName } from './util/index'

/**
 * Type Verifies: Checks instance of rule
 * ```javascript
 * instanceOf(Function).ok(() => {}) === true
 * instanceOf(Object).ok({}) === true
 * ```
 */
export class InstanceOf extends Verifiable {
  rule: Function

  protected _check(request: any) {
    if (request instanceof this.rule) {
      return null
    }

    return `should instance of ${getTypeName(this.rule)}, but ${getTypeName(request)}`
  }
}

export default funcify<InstanceOf>(InstanceOf)
