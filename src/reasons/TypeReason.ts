/**
 * @file Required
 * @author Cuttle Cong
 * @date 2018/4/8
 * @description
 */
import { Reason } from '../Unlawful'
import { format } from 'util'
import { name } from '../util'

export class TypeItem {
  static fromInstance(ins: any) {
    return new TypeItem(ins == null ? ins : ins.constructor, name(ins))
  }

  constructor(public type: Function & { name?: string }, public name?: string) {
    this.type = type
    this.name = name
  }

  public getDisplayName() {
    return this.name || this.type.name || 'Unknown'
  }
}

export default class TypeReason extends Reason {
  constructor(public expectType: TypeItem, public actualType?: TypeItem) {
    super()
    this.expectType = expectType
    this.actualType = actualType
  }

  toHumanMessage() {
    return format(
      'expected type %s, actual type %s.',
      this.expectType.getDisplayName(),
      this.actualType.getDisplayName()
    )
  }
}
