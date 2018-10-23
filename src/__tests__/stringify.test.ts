import {
  string,
  every,
  eq,
  leq,
  be,
  number,
  oneOf,
  equal,
  Verifiable,
  not,
  stringMatching,
  array,
  object,
  objectOf,
  integer,
  any,
  custom,
  boolean,
  function_,
  some,
  undefined_,
  null_,
  nil,
  strictNumber,
  instanceOf
} from '../walli'
import { util } from '../walli'
const { funcify, constructify, createVerifiableClass, checkEqual } = util

import { single, double } from '../util/quote'

describe('stringify test', function() {
  it('oneOf([instanceOf])', function() {
    expect(
      oneOf([instanceOf(String)]).toUnlawfulString(new Boolean('ok'))
    ).toMatchInlineSnapshot(
      `"expected: oneOf([instanceOf(String)]), actual: true."`
    )
    expect(
      instanceOf(String).toUnlawfulString(new Boolean('ok'))
    ).toMatchInlineSnapshot(`"should instance of String, but boolean"`)
  })
})
