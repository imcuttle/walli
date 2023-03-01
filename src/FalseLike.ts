/**
 * @file NullOrUndefined
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from "./util/index";
import { TypeVerifiable } from "./TypeVerifiable";

/**
 * False Like
 *
 * ```javascript
 * falseLike.ok(false) === true
 * falseLike.ok(true) === false
 * falseLike.ok(0) === true
 * falseLike.ok(1) === false
 * falseLike.ok('') === true
 * ```
 */
export class FalseLike extends TypeVerifiable {
  rule = v => !v;
  options = {
    type: FalseLike,
    typeName: "FalseLike"
  };
}

export default funcify<FalseLike>(FalseLike);
