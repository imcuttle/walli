/**
 * @file createVerifiableClass
 * @author Cuttle Cong
 * @date 2018/4/10
 * @description
 */
import Verifiable, { CheckAble } from '../Verifiable'
import { Unlawfulness, UnlawfulnessList } from '../Unlawful'
import { funcify, constructify } from './index'
import { inherits } from 'util'

export default function createVerifiableClass<
  Result = Verifiable,
  Rule = any,
  Options = any
>(
  entry: {
    _check?: (req: any) => CheckAble
    getRuleString?: Function
    getTypeName?: Function
    toString?: Function

    getInitialRule?: () => any
    getInitialOptions?: () => any
    getDisplayName?: () => string
  } = {},
  { useFuncify = true, ParentClass = Verifiable } = {}
): (rule?: Rule, options?: Options) => Result {
  const {
    getDisplayName = () => null,
    getInitialOptions = () => undefined,
    getInitialRule = () => undefined,
    ...proto
  } = entry

  const VerifiableClass = function() {
    this.rule = getInitialRule()
    this.options = getInitialOptions()
  }
  ParentClass = constructify(ParentClass)
  VerifiableClass.prototype = Object.create(
    new ParentClass(getInitialRule(), getInitialOptions())
  )
  VerifiableClass.prototype.constructor = VerifiableClass

  Object.keys(proto)
    .forEach(name => {
      VerifiableClass.prototype[name] = proto[name]
    })

  VerifiableClass['displayName'] = getDisplayName()

  inherits(VerifiableClass, ParentClass)

  return useFuncify
    ? funcify<Result, Rule, Options>(VerifiableClass)
    : <(rule?: Rule, options?: Options) => Result>VerifiableClass
}
