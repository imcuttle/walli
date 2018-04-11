/**
 * @file Primitive
 * @author Cuttle Cong
 * @date 2018/4/7
 * @description
 */
import { funcify, toString } from './util/index'
import { TypeVerifiable } from './TypeVerifiable'

const arr = [
  'undefined',
  'string',
  'number',
  'boolean',
  'symbol'
]
const set = new Set(arr)

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
    typeName: toString(arr)
  }
}

export default funcify<Primitive>(Primitive)
