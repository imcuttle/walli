import checkEqual from './checkEqual'
import { UnlawfulnessList } from '../Unlawful'

function _each(rules: any[], request, method): UnlawfulnessList {
  const unlawList = new UnlawfulnessList()
  const ok = method.call(rules, rule => {
    const checked = checkEqual(request, rule)
    if (checked.ok) {
      return true
    }
    unlawList.push(checked)
  })

  if (ok) {
    return null
  }
  return unlawList
}

export function some(rules, request): UnlawfulnessList {
  return _each(rules, request, Array.prototype.some)
}

export function every(rules, request): UnlawfulnessList {
  return _each(rules, request, Array.prototype.every)
}
