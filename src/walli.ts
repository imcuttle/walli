/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */

// methods

export { Be, default as be } from './Be'
export { OneOf, default as oneOf } from './OneOf'
export { default as objectOf, Object_ as Object } from './Object'
export { Array, default as arrayOf } from './Array'
export { Equal, default as equal, default as eq } from './Equal'
export { LooseEqual, default as looseEqual, default as leq } from './LooseEqual'
export { Not, default as not } from './Not'
export { Every, default as every } from './Every'
export { Some, default as some } from './Some'
export { Custom, default as custom } from './Custom'
export { default as instanceOf, InstanceOf } from './InstanceOf'

export { default as type, TypeVerifiable } from './TypeVerifiable'
export { Nil } from './Nil'
export { Primitive } from './Primitive'
export { Boolean } from './Boolean'
export { Date } from './Date'
export { Null } from './Null'
export { Undefined } from './Undefined'
export { String } from './String'
export { Number } from './Number'
export { StrictNumber } from './StrictNumber'
export { Function } from './Function'
export { Integer } from './Integer'
export { Any } from './Any'

// types
export { default as Verifiable } from './Verifiable'
export { UnlawfulnessList, Unlawfulness } from './Unlawful'
export { default as TypeReason, TypeItem } from './reasons/TypeReason'
export { default as ToEqualReason } from './reasons/Equal'
export { default as Reason } from './reasons/Reason'
export { CheckAble } from './Verifiable'

// util
import checkEqual from './util/checkEqual'
import { single, double } from './util/quote'
import createVerifiableClass from './util/createVerifiableClass'
import createFinalVerifiable from './util/createFinalVerifiable'
import {
  funcify,
  getTypeName,
  getDisplayName,
  isRequired,
  constructify,
  toString,
  inherits
} from './util'
export const util = {
  single,
  double,
  inherits,
  getDisplayName,
  isRequired,
  toString,
  funcify,
  constructify,
  getTypeName,
  checkEqual,
  createVerifiableClass,
  createFinalVerifiable
}

// final
import Verifiable from './Verifiable'
import _string from './String'
import _null_ from './Null'
import _undefined_ from './Undefined'
import _date from './Date'
import _strictNumber from './StrictNumber'
import _number from './Number'
import _array from './Array'
import _boolean from './Boolean'
import _function_ from './Function'
import _nil from './Nil'
import _integer from './Integer'
import _primitive from './Primitive'
import _any from './Any'
import _object from './Object'

export const string = createFinalVerifiable(_string)
export const number = createFinalVerifiable(_number)
export const strictNumber = createFinalVerifiable(_strictNumber)
export const array = createFinalVerifiable(_array)
export const date = createFinalVerifiable(_date)
export const boolean = createFinalVerifiable(_boolean)
export const integer = createFinalVerifiable(_integer)
export const nil = createFinalVerifiable(_nil)
export const null_ = createFinalVerifiable(_null_)
export const undefined_ = createFinalVerifiable(_undefined_)
export const function_ = createFinalVerifiable(_function_)
export const primitive = createFinalVerifiable(_primitive)
export const any = createFinalVerifiable(_any)
export const object = createFinalVerifiable(_object)
