/**
 * @file createVerifiableClass
 * @author Cuttle Cong
 * @date 2018/4/10
 * @description
 */
import Verifiable, { CheckAble } from '../Verifiable'
import { Unlawfulness, UnlawfulnessList } from '../Unlawful'
import { funcify, constructify, inherits } from './index'

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
    getDisplayName,
    getInitialOptions = () => undefined,
    getInitialRule = () => undefined,
    ...proto
  } = entry

  const VerifiableClass = function() {
    this.rule = getInitialRule()
    this.options = getInitialOptions()
  }
  ParentClass = constructify(ParentClass)
  inherits(VerifiableClass, ParentClass)

  if (typeof getDisplayName === 'function') {
    VerifiableClass['displayName'] = getDisplayName()
  }
  Object.keys(proto).forEach(name => {
    VerifiableClass.prototype[name] = proto[name]
  })

  return useFuncify
    ? funcify<Result, Rule, Options>(VerifiableClass)
    : <(rule?: Rule, options?: Options) => Result>VerifiableClass
}
