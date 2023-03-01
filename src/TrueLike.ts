/**
 * @file NullOrUndefined
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from "./util/index";
import { TypeVerifiable } from "./TypeVerifiable";


/**
 * True Like
 *
 * ```javascript
 * trueLike.ok(false) === false
 * trueLike.ok(true) === true
 * trueLike.ok(0) === false
 * trueLike.ok(1) === true
 * trueLike.ok('') === false
 * ```
 */

export class TrueLike extends TypeVerifiable {
  rule = v => !!v;
  options = {
    type: TrueLike,
    typeName: "TrueLike"
  };
}

export default funcify<TrueLike>(TrueLike);
