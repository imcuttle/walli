/**
 * @file createVerifiableClass
 * @author Cuttle Cong
 * @date 2018/4/10
 * @description
 */
import Verifiable, { CheckAble } from '../Verifiable'
import { Unlawfulness, UnlawfulnessList } from '../Unlawful'
import { funcify, constructify, inherits } from './index'

export type ES5Entry = {
  _check?: (req: any) => CheckAble
  getRuleString?: Function
  getTypeName?: Function
  toString?: Function
  getInitialRule?: () => any
  getInitialOptions?: () => any
  getDisplayName?: () => string
}

/**
 * Creates a verifiable Class.
 *
 * ```javascript
 * const age = createVerifiableClass({
 *   _check(req) {
 *     return integer()._check(req)
 *   },
 *   getDisplayName() {
 *     return 'Age'
 *   },
 *   getInitialRule() { return null },
 *   getInitialOptions() { return null }
 * })
 *
 * age().ok(22) === true
 * age().ok('22') === false
 * age().getTypeName() === 'Age'
 * age().toString() === 'Age()'
 *
 * // es6 inheritance
 * class Age extends Verifiable {
 *    _check() {
 *      return integer()._check(req)
 *    }
 *    static displayName = 'Age'
 *    constructor(rule, options) {
 *      super(rule, options)
 *      this.rule = null
 *      this.options = null
 *    }
 * }
 *
 * const age = funcify(Age)
 * const age() instanceof Age // true
 * new Age() instanceof Age // true
 *
 * constructify(age) === Age // true
 * ```
 * @param {ES5Entry} entry
 * @param {any} useFuncify
 * @param {any} ParentClass
 * @return {(rule?: Rule, options?: Options) => Result}
 */
export default function createVerifiableClass<
  Result = Verifiable,
  Rule = any,
  Options = any
>(
  entry: ES5Entry = {},
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
