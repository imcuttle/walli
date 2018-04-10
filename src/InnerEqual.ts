/**
 * @file InnerEqual
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { Unlawfulness, UnlawfulnessList } from './Unlawful'
import {funcify, isRequired, toString} from './util/index'
import * as _ from 'lodash'
import ToEqualReason from './reasons/Equal'
import Type, { TypeItem } from './reasons/TypeReason'
import checkEqual from './util/checkEqual'
import any from './Any'

function isObjectMap(data: any) {
  return _.isObject(data) && !_.isNull(data)
}

export class InnerEqual extends Verifiable {
  constructor(public rule?: any, public options = { loose: false }) {
    super(rule, options)
  }

  private _eq = (rule?: any) => {
    return new InnerEqual(rule, this.options)
  }

  private _extends(method: Function, ...objs: any[]) {
    objs = objs.map(obj => {
      if (obj instanceof Verifiable) {
        obj = obj.rule
      }
      return obj
    })

    method(this.rule, ...objs)
    return this
  }

  public merge(...data: Array<any | Verifiable>) {
    return this._extends(_.merge, ...data)
  }

  public assign(...data: Array<any | Verifiable>) {
    return this._extends(_.assign, ...data)
  }

  _check(request: any) {
    const loose = this.options.loose

    const rule = this.rule
    if (!(rule instanceof Verifiable)) {
      // pure object / array  shallow walk
      if (_.isArray(rule) || isObjectMap(rule)) {
        // this._required &&
        if (
          _.isArray(rule) !== _.isArray(request) ||
          isObjectMap(rule) !== isObjectMap(request)
        ) {
          return new Unlawfulness(
            new Type(
              TypeItem.fromInstance(rule),
              TypeItem.fromInstance(request)
            )
          )
        }

        let ruleKeys = Object.keys(rule)
        let requiredRuleKeys = ruleKeys.filter(
          key => isRequired(rule[key])
        )
        let reqKeys = Object.keys(request)
        if (!loose) {
          if (requiredRuleKeys.length !== reqKeys.length) {
            return `expected keys: ${toString(
              requiredRuleKeys
            )}, actual keys: ${toString(reqKeys)}.`
          }
        }

        const list = Array(reqKeys.length)
        const appendList = []
        Object.keys(rule).forEach(key => {
          let reqKeyIndex = reqKeys.indexOf(key)
          let r = rule[key]
          // Skipping when the rule is optional and the value is undefined.
          if (
            r instanceof Verifiable &&
            !r.isRequired &&
            typeof request[key] === 'undefined'
          ) {
            return
          }

          let checked = checkEqual(request[key], r, this._eq)
          if (!checked.ok) {
            checked.unshiftPaths(key)

            if (reqKeyIndex >= 0) {
              list[reqKeyIndex] = checked
            } else {
              appendList.push(checked)
            }
          }
        })

        return new UnlawfulnessList(
          list.filter(x => !_.isUndefined(x)).concat(appendList)
        )
      }
      if (rule == request || _.isEqual(rule, request)) {
        return null
      }
      return new ToEqualReason(rule, request)
    }

    return rule.check(request)
  }
}

export default funcify<InnerEqual>(InnerEqual)
