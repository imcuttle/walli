/**
 * @file NullOrUndefined
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from "./util/index";
import { TypeVerifiable } from "./TypeVerifiable";

export class TrueLike extends TypeVerifiable {
  rule = v => !!v;
  options = {
    type: TrueLike,
    typeName: "TrueLike"
  };
}

export default funcify<TrueLike>(TrueLike);
