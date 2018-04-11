import { funcify, toString } from './index'
import Verifiable from '../Verifiable'

/**
 *
 * @param verifiableFunc {Function}
 * @param args {any[]}
 * @return {Verifiable}
 */
export default function createFinalVerifiable<
  Result = Verifiable,
  Rule = any,
  Options = any
>(verifiableFunc: Function, [rule, options]: any[] = []): Result {
  const v = funcify<Result, Rule, Options>(verifiableFunc).apply(null, [
    rule,
    options
  ])

  v.toString = typeof rule === 'undefined' ? v.getTypeName : v.toString
  return v
}
