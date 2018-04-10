import { UnlawfulnessList } from '../Unlawful'
import be from '../Be'
import Verifiable from '../Verifiable'

/**
 * ```javascript
 * checkEqual('123', '123').ok === true
 * checkEqual('123', 123).ok === false
 * checkEqual('123', 123, eq).ok === true
 * checkEqual('123', string()).ok === true
 * ```
 * @param val
 * @param expect
 * @param fallbackVerf - funcified Verifiable (default: `be`)
 * @return {UnlawfulnessList}
 */
export default function checkEqual(
  val,
  expect: any | Verifiable,
  fallbackVerf?
): UnlawfulnessList {
  if (!fallbackVerf) {
    fallbackVerf = be
  }

  if (expect instanceof Verifiable) {
    return expect.check(val)
  }
  return fallbackVerf(expect).check(val)
}
