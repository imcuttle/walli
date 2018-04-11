/**
 * @file Required
 * @author Cuttle Cong
 * @date 2018/4/8
 * @description
 */
import { getTypeName } from '../util'
import Reason from './Reason'

export class TypeItem {
  static fromInstance(ins: any) {
    return new TypeItem(ins == null ? ins : ins.constructor, getTypeName(ins))
  }

  constructor(public type: Function & { name?: string }, public name?: string) {
    this.type = type
    this.name = name
  }

  public getDisplayName() {
    return this.name || getTypeName(this.type)
  }
}

export default class TypeReason extends Reason {
  public expect: TypeItem
  public actual: TypeItem

  toExpectedString() {
    return this.expect.getDisplayName()
  }

  toActualString() {
    return this.actual.getDisplayName()
  }

  toHumanMessage() {
    return `expected type: :expected:, actual type: :actual:.`
  }
}
