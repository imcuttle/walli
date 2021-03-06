/**
 * @file TypeVerifiable
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import Verifiable from './Verifiable'
import { Unlawfulness, UnlawfulnessList } from './Unlawful'
import Type, { TypeItem } from './reasons/TypeReason'
import {getDisplayName, funcify} from './util/index'

export class TypeVerifiable extends Verifiable {
  public rule: (req: any) => boolean
  public options: {
    type?: Function
    typeName?: string
  }

  protected _check(request: any) {
    if (this.rule(request)) {
      return null
    }

    return new Type(
      new TypeItem(this.options.type, this.options.typeName),
      TypeItem.fromInstance(request)
    )
  }

  getRuleString() {
    return ''
  }
}

export default funcify<String>(String)
