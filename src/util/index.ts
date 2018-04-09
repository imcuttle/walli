/**
 * @file util
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { inherits } from 'util'
import { find } from 'lodash'

export function funcify<T, S = any, O = any>(FuncConstructor): (rule?: S, options?: O) => T {
  const funcifyCons = function(...args): T {
    if (!(this instanceof FuncConstructor)) {
      return new FuncConstructor(...args)
    }

    FuncConstructor.apply(this, args)
  }
  inherits(funcifyCons, FuncConstructor)

  return funcifyCons
}

export function toArray<T>(item): T[] {
  if (Array.isArray(item)) {
    return item
  }
  return [item]
}

const rename = [
  [Array, 'array'],
  [String, 'string'],
  [Object, 'object'],
  [Boolean, 'boolean'],
  [Number, 'number'],
  [Function, 'function']
]

export function name(ins: any): string {
  if (typeof ins === 'function') {
    return ins.name
  }

  let name = ins + ''
  if (ins && ins.constructor) {
    const found = find(rename, ([Method, name]) => Method === ins.constructor)
    name = (found && found[1]) || ins.constructor.name || 'unKnow'
  }
  return name
}
