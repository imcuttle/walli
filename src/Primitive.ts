/**
 * @file Primitive
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify } from './util/index'
import { TypeVerifiable } from './TypeVerifiable'

const set = new Set([
  'undefined',
  'string',
  'number',
  'boolean',
  'symbol'
])

/**
 * Checks primitive ([null, undefined, string, number, boolean, symbol])
 *
 */
export class Primitive extends TypeVerifiable {
  rule = req => {
    return null === req || set.has(typeof req)
  }
  options = {
    type: Primitive,
    typeName: 'Primitive'
  }
}

export default funcify<Primitive>(Primitive)
