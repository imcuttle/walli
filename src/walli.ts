/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */

import { CheckAble } from './Verifiable'

export { Be, default as be } from './Be'
export { OneOf, default as oneOf } from './OneOf'
export { default as object, Object_ as Object } from './Object'
export { Array, default as array } from './Array'
export { Equal, default as equal, default as eq } from './Equal'
export { Any, default as any } from './Any'
export { LooseEqual, default as looseEqual, default as leq } from './LooseEqual'
export { Not, default as not } from './Not'
export { Every, default as every } from './Every'
export { Some, default as some } from './Some'
export { Custom, default as custom } from './Custom'

export { default as type, TypeVerifiable } from './TypeVerifiable'
export { default as nil, Nil } from './Nil'
export { default as boolean, Boolean } from './Boolean'
export { default as date, Date } from './Date'
export { default as null_, Null } from './Null'
export { default as undefined_, Undefined } from './Undefined'
export { default as string, String } from './String'
export { default as number, Number } from './Number'
export { default as strictNumber, StrictNumber } from './StrictNumber'
export { default as instanceOf, InstanceOf } from './InstanceOf'
export { default as function_, Function } from './Function'
export { default as integer, Integer } from './Integer'
export { default as Verifiable } from './Verifiable'
export { UnlawfulnessList, Unlawfulness, Reason } from './Unlawful'
export { default as TypeReason, TypeItem } from './reasons/TypeReason'

import checkEqual from './util/checkEqual'
import createVerifiableClass from './util/createVerifiableClass'
import {
  funcify,
  getTypeName,
  getDisplayName,
  isRequired,
  constructify,
  toString
} from './util'
export const util = {
  getDisplayName,
  isRequired,
  toString,
  constructify,
  getTypeName,
  checkEqual,
  funcify,
  createVerifiableClass
}
