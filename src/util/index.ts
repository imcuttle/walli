/**
 * @file util
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { inherits } from 'util'
import { find, isArray, camelCase, isPlainObject } from 'lodash'
import Verifiable from '../Verifiable'
import { single } from './quote'

const safeStringify = require('json-stringify-safe')

export function constructify(func: any) {
  return func && func['__Walli_Constructor__']
    ? func['__Walli_Constructor__']
    : func
}

export function funcify<Result = Verifiable, Rule = any, Options = any>(
  FuncConstructor
): (rule?: Rule, options?: Options) => Result {
  FuncConstructor = constructify(FuncConstructor)
  const funcifyCons = function(...args): Result {
    if (!(this instanceof FuncConstructor)) {
      return new FuncConstructor(...args)
    }

    FuncConstructor.apply(this, args)
  }
  inherits(funcifyCons, FuncConstructor)
  funcifyCons['__Walli_Constructor__'] = FuncConstructor

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

export function getDisplayName(data: any, { camel = false } = {}) {
  if (typeof data.displayName === 'string') {
    return data.displayName
  }

  if (typeof data.name === 'string') {
    return camel ? camelCase(data.name) : data.name
  }
  return 'unKnow'
}

export function getTypeName(ins: any): string {
  let name = ins + ''
  if (ins && ins.constructor) {
    const found = find(rename, ([Method, name]) => Method === ins.constructor)
    name = (found && found[1]) || getDisplayName(ins.constructor)
  }
  return name
}

export function toString(rule, { empty = 'undefined' } = {}) {
  if (typeof rule === 'undefined') {
    return empty
  }

  if (isArray(rule)) {
    return `[${rule.map(x => toString(x)).join(', ')}]`
  }
  if (isPlainObject(rule)) {
    return safeStringify(rule)
  }

  if (typeof rule === 'string') {
    return single(rule)
  }

  if (rule === null) {
    return 'null'
  }

  return rule.toString() || ''
}

export function isRequired(rule) {
  if (rule instanceof Verifiable) {
    return rule.isRequired
  }

  return true
}
