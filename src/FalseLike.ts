/**
 * @file NullOrUndefined
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from "./util/index";
import { TypeVerifiable } from "./TypeVerifiable";

export class FalseLike extends TypeVerifiable {
  rule = v => !v;
  options = {
    type: FalseLike,
    typeName: "FalseLike"
  };
}

export default funcify<FalseLike>(FalseLike);
