import { UnlawfulnessList } from '../Unlawful'
import be from '../Be'
import Verifiable from '../Verifiable'

export default function checkEqual(
  val,
  expect,
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
