/**
 * @file Required
 * @author Cuttle Cong
 * @date 2018/4/8
 * @description
 */
import { Reason } from '../Unlawful'
import { getTypeName } from '../util'

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

  toHumanMessage() {
    return `expected type: ${this.expect.getDisplayName()}, actual type: ${this.actual.getDisplayName()}.`
  }
}
