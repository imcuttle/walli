/**
 * @file util
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { find, isArray, each, camelCase, isPlainObject } from 'lodash'
import Verifiable from '../Verifiable'
import { single } from './quote'
import { FunctionWithName } from '../Unlawful'

const safeStringify = require('json-stringify-safe')

/**
 * Constructify(reverse of funcify) the function, see [[createVerifiableClass]].
 * @param func
 * @return {(rule?: Rule, options?: Options) => Result}
 */
export function constructify(func: any) {
  return func && func['__Walli_Constructor__']
    ? func['__Walli_Constructor__']
    : func
}

function isFuncified(Func) {
  return !!Func['__Walli_Constructor__']
}

/**
 * Funcify the constructor, see [[createVerifiableClass]].
 * @param FuncConstructor
 * @return {(rule?: Rule, options?: Options) => Result}
 */
export function funcify<Result = Verifiable, Rule = any, Options = any>(
  FuncConstructor
): (rule?: Rule, options?: Options) => Result {
  if (isFuncified(FuncConstructor)) {
    return FuncConstructor
  }

  FuncConstructor = constructify(FuncConstructor)
  function Funcify(...args): Result {
    if (!(this instanceof FuncConstructor)) {
      return new FuncConstructor(...args)
    }

    FuncConstructor.apply(this, args)
  }
  inherits(Funcify, FuncConstructor)
  Funcify['__Walli_Constructor__'] = FuncConstructor

  return Funcify
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

export function inherits(Child, Super) {
  const extendStatics =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function(Child, Super) {
        Child.__proto__ = Super
      }) ||
    function(Child, Super) {
      for (let p in Super) if (Super.hasOwnProperty(p)) Child[p] = Super[p]
    }
  extendStatics(Child, Super)
  // Node Version
  Child.super_ = Super
  function __() {
    this.constructor = Child
  }
  Child.prototype = Object.setPrototypeOf
    ? Object.setPrototypeOf(Child.prototype, Super.prototype)
    : Super === null
      ? Object.create(Super)
      : ((__.prototype = Super.prototype), new __())
}

/**
 * Gets display name from Function.
 */
export function getDisplayName(
  func: FunctionWithName,
  { camel = false } = {}
): string {
  if (typeof func.displayName === 'string') {
    return func.displayName
  }

  if (typeof func.name === 'string') {
    return camel ? camelCase(func.name) : func.name
  }
  return 'unKnow'
}

/**
 * Gets type's name from instance.
 * @param ins
 * @return {string}
 */
export function getTypeName(ins: any): string {
  let name = ins + ''
  if (ins != null && ins.constructor) {
    const found = find(rename, ([Method, name]) => Method === ins.constructor)
    name = <string>(found && found[1]) || getDisplayName(ins.constructor)
  }
  return name
}

/**
 * To pretty string from anything.
 * @param rule
 * @param {object} options.empty - the string placeholder when equals undefined
 * @return {string}
 */
export function toString(rule, options?) {
  const { empty = 'undefined' } = options || {}
  if (typeof rule === 'undefined') {
    return empty
  }

  if (isArray(rule)) {
    return `[${rule.map(x => toString(x)).join(', ')}]`
  }
  if (isPlainObject(rule)) {
    let strings = []
    each(rule, (value, key) => {
      let valStr = ''
      if (value === rule) {
        valStr = '[Circular]'
      }
      else if (value instanceof Verifiable) {
        valStr = value.toString()
      } else {
        valStr = toString(value, options) // toString(value, options)
      }

      strings.push(`${key}:${valStr}`)
    })
    return ['{', strings.join(', '), '}'].join('')
  }

  if (typeof rule === 'string') {
    return single(rule)
  }

  if (rule === null) {
    return 'null'
  }

  return rule.toString() || ''
}

/**
 * Checks rule is required
 * @param rule
 * @return {boolean}
 */
export function isRequired(rule) {
  if (rule instanceof Verifiable) {
    return rule.isRequired
  }

  return true
}
