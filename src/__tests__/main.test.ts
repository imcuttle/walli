import string from '../String'
import be from '../Be'
import equal from '../Equal'
import number from '../Number'
import oneOf from '../OneOf'
import not from '../Not'
import every from '../Every'
import some from '../Some'
import leq from '../LooseEqual'
import _undefined from '../Undefined'
import _null from '../Null'
import nil from '../Nil'
import instanceOf from '../InstanceOf'
import object from '../Object'

import { single, double } from '../util/quote'
import Verifiable from '../Verifiable'
import createVerifiableClass from '../util/createVerifiableClass'
import { constructify } from '../util'

describe('main test', function() {
  describe('util', function() {
    it('should single quote', function() {
      expect(single("asd'sds\\'asd")).toBe("'asd\\'sds\\\\\\'asd'")
      expect(double('asd"sds\\"asd')).toBe(JSON.stringify('asd"sds\\"asd'))
      expect(double('asdssd"xx"')).toBe(JSON.stringify('asdssd"xx"'))

      expect(single("asd'sds'asd")).toBe("'asd\\'sds\\'asd'")
    })
  })

  it('should String', function() {
    expect(string().check('asdas').ok).toBeTruthy()
    expect(
      string()
        .message('message')
        .message()
        .check(null)
        .toString()
    ).toEqual('expected type: string, actual type: null.')

    expect(
      string()
        .message('message')
        .check(null)
        .toString()
    ).toEqual('message')
    //
    expect(string().ok(null)).toBeFalsy()
    expect(string().ok('')).toBeTruthy()
  })

  it('should ToBe', function() {
    expect(be({}).check({}).ok).toBeFalsy()
    expect(be(1).check('1').ok).toBeFalsy()
    expect(be('123').check('123').ok).toBeTruthy()
  })

  it('should toEqual', function() {
    expect(equal({}).check({}).ok).toBeTruthy()
    expect(equal(1).check('1').ok).toBeFalsy()
    expect(equal({ a: 2 }).ok({})).toBeFalsy()
    expect(equal({ a: 2 }).ok({ a: '2' })).toBeFalsy()

    expect(equal({ a: 2, b: '2' }).ok({ a: 2 })).toBeFalsy()
    console.log(
      equal({ a: 2, b: '2' }).toUnlawfulString({ a: 2, x: '22', b: '2' })
    )

    expect(equal({}).toUnlawfulString({ a: 2 })).toBe(
      "expected keys: [], the actual contains not allowed keys: ['a']."
    )

    expect(equal(string()).check('asdas').ok).toBeTruthy()
  })

  it('should leq', function() {
    expect(leq({}).check({}).ok).toBeTruthy()
    expect(leq(1).check(1).ok).toBeTruthy()
    expect(leq(1).check('1').ok).toBeFalsy()
    expect(leq({}).ok({ a: 2 })).toBeTruthy()
  })

  it('should equal shallow', function() {
    const a = equal({
      a: string()
    })
    expect(
      a.ok({
        a: 'ass'
      })
    ).toBeTruthy()

    expect(
      a.ok({
        a: 123
      })
    ).toBeFalsy()

    console.log(
      a
        .check({
          a: 123
        })
        .toString()
    )
  })

  it('should equal deep', function() {
    const a = equal({
      a: {
        'asd"asd\'xx': [string(), be('456'), 'xxx']
      }
    })
    expect(
      a.ok({
        a: {
          'asd"asd\'xx': 'ass'
        }
      })
    ).toBeFalsy()

    expect(
      a.ok({
        a: {
          'asd"asd\'xx': ['nis', '456', 'xxx']
        }
      })
    ).toBeTruthy()

    console.log(
      a.toUnlawfulString({
        a: {
          'asd"asd\'xx': ['nis', '456', 'xxx']
        }
      })
    )
  })

  it('should number', function() {
    expect(number().check({}).ok).toBeFalsy()
    expect(number().check('1').ok).toBeTruthy()
    expect(number().check(232).ok).toBeTruthy()
  })

  it('should oneOf', function() {
    expect(oneOf([1, 2, 3]).check(3).ok).toBeTruthy()
    expect(oneOf([1, '2', 3]).check(2).ok).toBeFalsy()

    expect(oneOf([1, 2, 3]).check(2).ok).toBeTruthy()
  })

  it('should not', function() {
    expect(not(oneOf([1, 2, 3])).check(3).ok).toBeFalsy()
    expect(
      not(oneOf([1, 2, 3]))
        .check(3)
        .toString()
    ).toEqual(
      expect.stringContaining('(Not) expected: oneOf([1, 2, 3]), actual: 3')
    )

    expect(not('2').check(2).ok).toBeTruthy()
    expect(not('2').check('2').ok).toBeFalsy()

    expect(not(oneOf([1, '2', 3])).check(2).ok).toBeTruthy()
    expect(not(equal({ a: 2 })).check({}).ok).toBeTruthy()
    expect(not(equal({ a: '2' })).check({ a: '2' }).ok).toBeFalsy()
  })

  it('should every', function() {
    const rule = every([number(), string()])

    expect(rule.ok({})).toBeFalsy()
    expect(rule.toUnlawfulString({})).toBe(
      'expected type: number, actual type: object.'
    )

    expect(rule.ok('12')).toBeTruthy()
    expect(rule.toUnlawfulString('12')).toBe('')

    expect(rule.toUnlawfulString(12)).toBe(
      'expected type: string, actual type: number.'
    )
  })

  it('should some', function() {
    const rule = some([number(), string()])

    expect(rule.ok({})).toBeFalsy()
    expect(rule.ok('12')).toBeTruthy()
    expect(rule.toUnlawfulString('12')).toBe('')
    expect(rule.toUnlawfulString(12)).toBe('')
    expect(some([number(), 'abc']).toUnlawfulString('abc')).toBe('')
  })

  it('should undefined', function() {
    expect(_undefined().ok()).toBeTruthy()
    expect(_undefined().ok('')).toBeFalsy()
    expect(_undefined().ok(null)).toBeFalsy()
    expect(_undefined().ok(undefined)).toBeTruthy()
  })

  it('should null', function() {
    expect(_null().ok()).toBeFalsy()
    expect(_null().ok('')).toBeFalsy()
    expect(_null().ok(null)).toBeTruthy()
    expect(_null().ok(undefined)).toBeFalsy()
  })

  it('should null or undefined', function() {
    expect(nil().ok()).toBeTruthy()
    expect(nil().ok('')).toBeFalsy()
    expect(nil().ok(null)).toBeTruthy()
    expect(nil().ok(undefined)).toBeTruthy()
  })

  it('should instanceOf', function() {
    expect(instanceOf(Object).ok({})).toBeTruthy()
    expect(instanceOf(Object).ok(Object({}))).toBeTruthy()
    expect(instanceOf(Object).ok(null)).toBeFalsy()
    expect(instanceOf(Object).ok('2')).toBeFalsy()

    expect(instanceOf(Date).ok(new Date())).toBeTruthy()
    expect(instanceOf(Date).ok(new Date().getTime())).toBeFalsy()

    expect(instanceOf(Function).ok(() => {})).toBeTruthy()
    expect(instanceOf(Function).ok('22')).toBeFalsy()

    expect(instanceOf(Function).toUnlawfulString('22')).toBe(
      'should instance of function, but string'
    )
  })

  it('should object', function() {
    expect(object().ok({})).toBeTruthy()
    expect(object().ok('22')).toBeFalsy()
    expect(object().ok([])).toBeTruthy()

    const r = object([number(), string()])
    expect(
      r.ok({
        a: '22',
        v: 2.222
      })
    ).toBeTruthy()

    expect(
      r
        .clone()
        .set(0, 'fixed')
        .toUnlawfulString({
          a: '22',
          v: 2.222
        })
    ).toBe(
      "a: VALUE expected: 'fixed', actual: '22'.\n" +
        "v: VALUE expected: 'fixed', actual: 2.222."
    )
  })

  test('jest expect', () => {
    expect({
      x: 2,
      a: {
        b: {
          // c: '2'
        }
      }
    }).toEqual(
      expect.objectContaining({
        a: {
          b: {}
        }
      })
    )
  })

  it('should displayName', function() {
    class T extends Verifiable {
      static displayName = 'ABC'
    }
    expect(oneOf().toString()).toEqual('oneOf()')
    expect(new T().toString()).toEqual('ABC()')
    T.displayName = null
    expect(new T().toString()).toEqual('t()')
  })

  it('should createVerifiableClass', () => {
    const cls = createVerifiableClass({
      _check(req: any) {
        return string().check(req)
      },
      getInitialRule() {
        return '222'
      },
      getInitialOptions() {
        return 'opp'
      },
      getDisplayName() {
        return 'DDD'
      }
    })

    expect(cls().ok(222)).toBeFalsy()
    expect(cls().ok('22222')).toBeTruthy()
    expect(cls().rule).toBe('222')
    expect(cls().options).toBe('opp')
    expect(cls().toString()).toBe("DDD('222')")
    expect(constructify(cls).displayName).toBe('DDD')

    constructify(cls).displayName = null
    expect(cls().toString()).toBe("verifiableClass('222')")
  })
})
