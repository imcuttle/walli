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
  instanceOf,
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
  falseLike,
  trueLike
} from "../walli";
import { util } from "../walli";
const { funcify, constructify, createVerifiableClass, checkEqual } = util;

import { single, double } from "../util/quote";

describe("main test", function() {
  describe("util", function() {
    it("should single quote", function() {
      expect(single("asd'sds\\'asd")).toBe("'asd\\'sds\\\\\\'asd'");
      expect(double('asd"sds\\"asd')).toBe(JSON.stringify('asd"sds\\"asd'));
      expect(double('asdssd"xx"')).toBe(JSON.stringify('asdssd"xx"'));

      expect(single("asd'sds'asd")).toBe("'asd\\'sds\\'asd'");
    });
  });

  it("should String", function() {
    expect(string.check("asdas").ok).toBeTruthy();
    expect(
      string
        .message("message")
        .message()
        .check(null)
        .toString()
    ).toEqual("expected type: string, actual type: null.");

    expect(
      string
        .message("message")
        .check(null)
        .toString()
    ).toEqual("message");
    //
    expect(string.ok(null)).toBeFalsy();
    expect(string.ok("")).toBeTruthy();
  });

  it("should ToBe", function() {
    expect(be({}).check({}).ok).toBeFalsy();
    expect(be(1).check("1").ok).toBeFalsy();
    expect(be("123").check("123").ok).toBeTruthy();
  });

  it("should equal message", function() {
    const r = equal({
      a: 2,
      b: {
        c: "2",
        d: be("d").message("errr")
      },
      c: be("xxxx").message("error .c")
    }).message("error equal");

    expect(r.toUnlawfulString({ a: 2, x: "22", b: { c: "2", d: "d" } })).toBe(
      "error equal"
    );
    expect(r.toUnlawfulString({ a: 2, c: "xxxx", b: { c: "2", d: "d" } })).toBe(
      ""
    );
    expect(r.toUnlawfulString({ a: 2, c: "xxxw", b: { c: "2", d: "d" } })).toBe(
      "c: error .c"
    );

    expect(
      r.toUnlawfulString({ a: 2, c: "xxxx", b: { c: "22", d: "d" } })
    ).toBe("b['c']: error equal");

    expect(
      r.toUnlawfulString({ a: 2, c: "xxxx", b: { c: "2", d: "dd" } })
    ).toBe("b['d']: errr");
  });

  it("should toEqual", function() {
    expect(equal({}).check({}).ok).toBeTruthy();
    expect(equal(1).check("1").ok).toBeFalsy();
    expect(equal({ a: 2 }).ok({})).toBeFalsy();
    expect(equal({ a: 2 }).ok({ a: "2" })).toBeFalsy();

    expect(equal({ a: 2, b: "2" }).ok({ a: 2 })).toBeFalsy();
    console.log(
      equal({ a: 2, b: "2" }).toUnlawfulString({ a: 2, x: "22", b: "2" })
    );

    expect(equal({}).toUnlawfulString({ a: 2 })).toBe(
      "expected keys: [], the actual contains not allowed keys: ['a']."
    );

    expect(equal(string).check("asdas").ok).toBeTruthy();
  });

  it("should leq", function() {
    expect(leq({}).check({}).ok).toBeTruthy();
    expect(leq(1).check(1).ok).toBeTruthy();
    expect(leq(1).check("1").ok).toBeTruthy();
    expect(leq(['222']).ok([222])).toBeTruthy();
    expect(leq({ a: '2' }).ok({ a: 2 })).toBeTruthy();
    expect(leq({ a: leq('2') }).ok({ a: 2 })).toBeTruthy();
    expect(leq({}).ok({ a: 2 })).toBeTruthy();
  });

  it("should equal shallow", function() {
    const a = equal({
      a: string
    });
    expect(
      a.ok({
        a: "ass"
      })
    ).toBeTruthy();

    expect(
      a.ok({
        a: 123
      })
    ).toBeFalsy();

    console.log(
      a
        .check({
          a: 123
        })
        .toString()
    );
  });

  it("should equal deep", function() {
    const a = equal({
      a: {
        "asd\"asd'xx": [string, be("456"), "xxx"]
      }
    });
    expect(
      a.ok({
        a: {
          "asd\"asd'xx": "ass"
        }
      })
    ).toBeFalsy();

    expect(
      a.ok({
        a: {
          "asd\"asd'xx": ["nis", "456", "xxx"]
        }
      })
    ).toBeTruthy();

    console.log(
      a.toUnlawfulString({
        a: {
          "asd\"asd'xx": ["nis", "456", "xxx"]
        }
      })
    );
  });

  it("should number", function() {
    expect(number.check({}).ok).toBeFalsy();
    expect(number.check("1").ok).toBeTruthy();
    expect(number.check(232).ok).toBeTruthy();
  });

  it("should oneOf", function() {
    expect(oneOf([1, 2, 3]).check(3).ok).toBeTruthy();
    expect(oneOf([1, "2", 3]).check(2).ok).toBeFalsy();

    expect(oneOf([1, 2, 3]).check(2).ok).toBeTruthy();
  });

  it("should not", function() {
    expect(not(oneOf([1, 2, 3])).check(3).ok).toBeFalsy();
    expect(
      not(oneOf([1, 2, 3]))
        .check(3)
        .toString()
    ).toEqual(
      expect.stringContaining("(Not) expected: oneOf([1, 2, 3]), actual: 3")
    );

    expect(not("2").check(2).ok).toBeTruthy();
    expect(not("2").check("2").ok).toBeFalsy();

    expect(not(oneOf([1, "2", 3])).check(2).ok).toBeTruthy();
    expect(not(equal({ a: 2 })).check({}).ok).toBeTruthy();
    expect(not(equal({ a: "2" })).check({ a: "2" }).ok).toBeFalsy();
  });

  it("should every", function() {
    const rule = every([number, string]);

    expect(rule.ok({})).toBeFalsy();
    expect(rule.toUnlawfulString({})).toBe(
      "expected type: number, actual type: object."
    );

    expect(rule.ok("12")).toBeTruthy();
    expect(rule.toUnlawfulString("12")).toBe("");

    expect(rule.toUnlawfulString(12)).toBe(
      "expected type: string, actual type: number."
    );
  });

  it("should some", function() {
    const rule = some([number, string]);

    expect(rule.ok({})).toBeFalsy();
    expect(rule.ok("12")).toBeTruthy();
    expect(rule.toUnlawfulString("12")).toBe("");
    expect(rule.toUnlawfulString(12)).toBe("");
    expect(some([number, "abc"]).toUnlawfulString("abc")).toBe("");
  });

  it("should undefined", function() {
    expect(undefined_.ok()).toBeTruthy();
    expect(undefined_.ok("")).toBeFalsy();
    expect(undefined_.ok(null)).toBeFalsy();
    expect(undefined_.ok(undefined)).toBeTruthy();
  });

  it("should null", function() {
    expect(null_.ok()).toBeFalsy();
    expect(null_.ok("")).toBeFalsy();
    expect(null_.ok(null)).toBeTruthy();
    expect(null_.ok(undefined)).toBeFalsy();
  });

  it("should null or undefined", function() {
    expect(nil.ok()).toBeTruthy();
    expect(nil.ok("")).toBeFalsy();
    expect(nil.ok(null)).toBeTruthy();
    expect(nil.ok(undefined)).toBeTruthy();
  });

  it("should instanceOf", function() {
    expect(instanceOf(Object).ok({})).toBeTruthy();
    expect(instanceOf(Object).ok(Object({}))).toBeTruthy();
    expect(instanceOf(Object).ok(null)).toBeFalsy();
    expect(instanceOf(Object).ok("2")).toBeFalsy();

    expect(instanceOf(Date).ok(new Date())).toBeTruthy();
    expect(instanceOf(Date).ok(new Date().getTime())).toBeFalsy();

    expect(instanceOf(Function).ok(() => {})).toBeTruthy();
    expect(instanceOf(Function).ok("22")).toBeFalsy();

    expect(instanceOf(Function).toUnlawfulString("22")).toBe(
      "should instance of Function, but string"
    );

    expect(instanceOf(Object).toUnlawfulString("22")).toBe(
      "should instance of Object, but string"
    );

    expect(instanceOf(Date).toUnlawfulString("22")).toBe(
      "should instance of Date, but string"
    );
  });

  it("should object", function() {
    expect(object.ok({})).toBeTruthy();
    expect(object.ok("22")).toBeFalsy();
    expect(object.ok([])).toBeFalsy();

    const r = objectOf([number, string]);
    expect(
      r.ok({
        a: "22",
        v: 2.222
      })
    ).toBeTruthy();

    expect(
      r
        .clone()
        .set(0, "fixed")
        .toUnlawfulString({
          a: "22",
          v: 2.222
        })
    ).toBe(
      "a: VALUE expected: 'fixed', actual: '22'.\n" +
        "v: VALUE expected: 'fixed', actual: 2.222."
    );
  });

  test("jest expect", () => {
    // expect('abc').toEqual(
    //   expect.stringMatching('bc')
    // )
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
    );
  });

  it("should displayName", function() {
    class T extends Verifiable {
      static displayName = "ABC";
    }
    expect(oneOf().toString()).toEqual("oneOf()");
    expect(new T().toString()).toEqual("ABC()");
    T.displayName = null;
    expect(new T().toString()).toEqual("t()");
  });

  it("should createVerifiableClass", () => {
    const cls = createVerifiableClass({
      _check(req: any) {
        return string.check(req);
      },
      getInitialRule() {
        return "222";
      },
      getInitialOptions() {
        return "opp";
      },
      getDisplayName() {
        return "DDD";
      }
    });

    expect(cls().ok(222)).toBeFalsy();
    expect(cls().ok("22222")).toBeTruthy();
    expect(cls().rule).toBe("222");
    expect(cls().options).toBe("opp");
    expect(cls().toString()).toBe("DDD('222')");
    expect(constructify(cls).displayName).toBe("DDD");

    constructify(cls).displayName = null;
    expect(cls().toString()).toBe("verifiableClass('222')");
  });

  it("should immutable", function() {
    expect(string.message("asdas")).not.toBe(string);
    expect(number.optional).not.toBe(number);
    expect(number.required).not.toBe(number);
    const l = leq({ "2": "aaa" });
    expect(l.set("2", "ss")).not.toBe(l);

    expect(l.assign({ "2": "xxxx" })).not.toBe(l);
    expect(l.merge({ 1: "abc" })).not.toBe(l);
  });

  it("should string matching", function() {
    expect(stringMatching("any").ok("axanyx") === true).toBeTruthy();
    expect(stringMatching("any").ok("axanyx") === true).toBeTruthy();
    expect(stringMatching(/^any/).ok("axanyx") === false).toBeTruthy();

    expect(stringMatching("any").toUnlawfulString("axaxnyx")).toBe(
      "expected: stringMatching(/any/), actual: 'axaxnyx'."
    );
  });

  it("should eq extends", function() {
    const par = eq({
      name: string,
      age: number,

      gender: oneOf(["M", "F"])
    });

    const son = eq({
      name: string.optional,
      age: strictNumber,
      noop: "22"
    }).extends(par);

    expect(
      par.toUnlawfulString({
        age: 12
      })
    ).toBe(
      "name: expected type: string, actual type: undefined.\n" +
        "gender: expected: oneOf(['M', 'F']), actual: undefined."
    );

    expect(
      son.toUnlawfulString({
        age: "2",
        noop: "22"
        // gender: 'M'
      })
    ).toBe(
      "age: expected type: StrictNumber, actual type: string.\n" +
        "gender: expected: oneOf(['M', 'F']), actual: undefined."
    );
  });

  it("should rule stringify", function() {
    expect(
      eq({
        name: string,
        email: string
      }).toString()
    ).toBe("equal({name:string, email:string})");

    expect(
      eq({
        name: string.optional,
        email: string
      }).toString()
    ).toBe("equal({name:string().optional, email:string})");
  });

  it("should trueLike/falseLike", function() {
    expect(trueLike.ok("")).toBe(false);
    expect(trueLike.ok(0)).toBe(false);
    expect(trueLike.ok(1)).toBe(true);
    expect(falseLike.ok("")).toBe(true);
    expect(falseLike.ok(0)).toBe(true);
    expect(falseLike.ok(1)).toBe(false);
  });
});
