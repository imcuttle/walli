/**
 * @file InnerEqual
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { Unlawfulness, UnlawfulnessList } from './Unlawful'
import { funcify } from './util/index'
import * as _ from 'lodash'
import ToEqualReason from './reasons/ToEqual'
import Type, { TypeItem } from './reasons/TypeReason'
import checkEqual from "./util/checkEqual";

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

        if (!loose) {
          let ruleKeys = Object.keys(rule)
          let reqKeys = Object.keys(request)
          if (ruleKeys.length !== reqKeys.length) {
            return `expected keys: [${ruleKeys.join(', ')}], actual keys: [${reqKeys.join(', ')}]`
          }
        }

        return new UnlawfulnessList(
          Object.keys(rule).map(key => {
            const r = rule[key]
            // skip
            if ((r instanceof Verifiable) && !r.isRequired && !(key in request)) {
              return new UnlawfulnessList()
            }

            let checked = checkEqual(request[key], r, this._eq)
            checked.unshiftPaths(key)
            return checked
          })
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
