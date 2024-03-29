/**
 * @file InnerEqual
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from "./Verifiable";
import { Unlawfulness, UnlawfulnessList } from "./Unlawful";
import { funcify, isRequired, toString } from "./util/index";
import * as _ from "lodash";
import ToEqualReason from "./reasons/Equal";
import Type, { TypeItem } from "./reasons/TypeReason";
import checkEqual from "./util/checkEqual";
import primitive from "./Primitive";

function isObjectMap(data: any) {
  return _.isObject(data) && !_.isNull(data);
}

export class InnerEqual extends Verifiable {
  constructor(public rule?: any, public options = { loose: false }) {
    super(rule, options);
  }

  private _eq = (rule?: any) => {
    return new InnerEqual(rule, this.options);
  };

  public clone() {
    return new (<typeof InnerEqual>this.constructor)(
      _.clone(this.rule),
      this.options
    );
  }

  public deepClone() {
    return new (<typeof InnerEqual>this.constructor)(
      _.cloneDeep(this.rule),
      this.options
    );
  }

  private _extends(clone: InnerEqual, method: Function, ...objs: any[]) {
    objs = objs.map(obj => {
      if (obj instanceof Verifiable) {
        obj = obj.rule;
      }
      return obj;
    });

    method(clone.rule, ...objs);
    return clone;
  }

  /**
   * Merge rules
   * @param {any | Verifiable} data
   * @return {Verifiable}
   */
  public merge(...data: Array<any | Verifiable>) {
    return this._extends(this.deepClone(), _.merge, ...data);
  }

  /**
   * Extends parent
   * @param {InnerEqual} parent
   * @return {Verifiable}
   */
  public extends(parent: InnerEqual) {
    return parent.assign(this);
  }

  /**
   * Assigns rules
   * @param {any | Verifiable} data
   * @return {Verifiable}
   */
  public assign(...data: Array<any | Verifiable>) {
    return this._extends(this.clone(), _.assign, ...data);
  }

  protected _check(request: any) {
    const loose = this.options.loose;

    const rule = this.rule;
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
          );
        }

        let ruleKeys = Object.keys(rule);
        let reqKeys = Object.keys(request);
        if (!loose) {
          const notAllowedKeys = reqKeys.filter(
            key => ruleKeys.indexOf(key) < 0
          );

          if (notAllowedKeys.length > 0) {
            let keys = [];
            ruleKeys.forEach(key => {
              if (isRequired(rule[key])) {
                keys.push(key);
              } else {
                keys.push(key + "?");
              }
            });
            return `expected keys: ${toString(
              keys
            )}, the actual contains not allowed keys: ${toString(
              notAllowedKeys
            )}.`;
          }
        }

        const list = Array(reqKeys.length);
        const appendList = [];
        Object.keys(rule).forEach(key => {
          let reqKeyIndex = reqKeys.indexOf(key);
          let r = rule[key];
          // Skipping when the rule is optional and the value is undefined.
          if (
            r instanceof Verifiable &&
            !r.isRequired &&
            typeof request[key] === "undefined"
          ) {
            return;
          }

          let checked = checkEqual(request[key], r, this._eq);
          if (!checked.ok) {
            checked.unshiftPaths(key);

            if (reqKeyIndex >= 0) {
              list[reqKeyIndex] = checked;
            } else {
              appendList.push(checked);
            }
          }
        });

        return new UnlawfulnessList(
          list.filter(x => !_.isUndefined(x)).concat(appendList)
        );
      }
      if (primitive().ok(rule) && primitive().ok(request)) {
        if (loose) {
          if (rule == request) {
            return null;
          }
          return new ToEqualReason(rule, request);
        }
        if (rule === request) {
          return null;
        }
        return new ToEqualReason(rule, request);
      }

      if (_.isEqual(rule, request)) {
        return null;
      }
      return new ToEqualReason(rule, request);
    }

    return rule.check(request);
  }
}

export default funcify<InnerEqual>(InnerEqual);
