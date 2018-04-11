/**
 * @file types
 * @author Cuttle Cong
 * @date 2018/4/8
 * @description
 */
import { toArray } from './util/index'
import { single } from './util/quote'
import HasMessage from './util/HasMessage'

export class FunctionWithName extends Function {
  name: string
  displayName?: string
}

export class Reason extends HasMessage {
  constructor(public expect?: any, public actual?: any) {
    super()
    this.expect = expect
    this.actual = actual
  }

  public prefix: string = ''
  public setPrefix(prefix: string) {
    this.prefix = prefix
    return this
  }
  public suffix: string = ''
  public setSuffix(suffix: string) {
    this.suffix = suffix
    return this
  }

  protected toHumanMessage(): string {
    return ''
  }

  public message(msg: null | string = null): Reason {
    return <Reason>super.message(msg)
  }
  public clone(): Reason {
    return new (<typeof Reason>this.constructor)(this.expect, this.actual)
  }

  public toMessage() {
    return this.prefix + this.toHumanMessage() + this.suffix
  }

  // human-friendly message
  public toString(): string {
    return !this.hasMessage() ? this.toMessage() : this.msg
  }
}

function pathsToString(paths: string[]) {
  if (paths && paths.length) {
    if (paths.length === 1) {
      return paths[0]
    }

    return (
      paths[0] +
      '[' +
      paths
        .slice(1)
        .map(str => single(str))
        .join('][') +
      ']'
    )
  }
  return ''
}

export class Unlawfulness {
  public reasons: Reason[]
  constructor(reasons: Reason[] | Reason, public paths?: string[]) {
    this.reasons = toArray(reasons)
    this.paths = paths || []
  }
  public unshiftPath(...items) {
    this.paths.unshift(...items)
  }

  toString() {
    let prefix = pathsToString(this.paths)
    prefix = prefix ? prefix + ': ' : prefix

    let process = function(list: string[]) {
      return list
    }

    return `${prefix}${process(
      this.reasons.map(reason => reason.toString())
    ).join(Array(prefix.length).join(' ') + '\n')}`
  }
}

export class UnlawfulnessList {
  public list: Unlawfulness[] = []
  constructor(items: any[] = []) {
    this.push(...items)
  }
  get length(): number {
    return this.list.length
  }
  first() {
    return this.list[0]
  }
  push(...items: any[]) {
    const list = []
    items.forEach(item => {
      if (item instanceof Unlawfulness) {
        list.push(item)
      } else if (item instanceof UnlawfulnessList) {
        list.push(...item.list)
      }
    })

    return this.list.push(...list)
  }
  get ok(): boolean {
    return !this.list.length
  }
  toString({ delimiter = '\n' } = {}) {
    return this.list.map(unlaw => unlaw.toString()).join(delimiter)
  }

  unshiftPaths(...items) {
    this.list.forEach(item => {
      item.unshiftPath(...items)
      return item
    })
    return this
  }

  eachReasons(fn: (reason: Reason, index: number, all: Reason[]) => any) {
    this.list.forEach(item => {
      item.reasons.forEach(fn)
    })
    return this
  }
}
