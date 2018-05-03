import { string, eq, oneOf, array, arrayOf, integer, be } from '../walli'
import { util } from '../walli'
import createFinalVerifiable from '../util/createFinalVerifiable'
import Verifiable from '../Verifiable'
import { funcify } from '../util'
const { createVerifiableClass } = util

describe('examples', function() {
  it('should person', function() {
    type Person = {
      name: string
      age: number
      gender: 'F' | 'M'
      father?: Person
      mother?: Person
      children?: Person[]
    }

    const person = createVerifiableClass({
      getDisplayName() {
        return 'person'
      },
      _check(req) {
        return eq({
          name: string,
          age: integer,
          gender: oneOf(['F', 'M']),
          father: person().optional,
          mother: person().optional,
          children: arrayOf(person()).optional
        }).check(req)
      }
    })

    expect(
      person().toUnlawfulString({
        name: 'cy',
        age: 19,
        gender: 'F',
        father: {
          name: 'cyy',
          age: 49,
          gender: 'X'
        }
      })
    ).toBe("father['gender']: expected: oneOf(['F', 'M']), actual: 'X'.")

    const fperson = createFinalVerifiable(person)
    expect(
      fperson.toUnlawfulString({
        name: 'cy',
        age: 19,
        gender: 'F',
        father: {
          name: 'cyy',
          age: 49,
          gender: 'X'
        }
      })
    ).toBe("father['gender']: expected: oneOf(['F', 'M']), actual: 'X'.")

    // Or using es6 syntax
    class ES6Person extends Verifiable {
      static displayName = 'person'
      _check(req) {
        return person().check(req)
      }
    }

    expect(
      createFinalVerifiable(ES6Person).toUnlawfulString({
        name: 'cy',
        age: 19,
        gender: 'F',
        father: {
          name: 'cyy',
          age: 49,
          gender: 'X'
        }
      })
    ).toBe("father['gender']: expected: oneOf(['F', 'M']), actual: 'X'.")
  })

  it('should stringify', function() {
    const a = { a: '2' }
    a['circle'] = a
    expect(be(a).toUnlawfulString('xxx')).toBe(
      "expected: {a:'2', circle:[Circular]}, actual: 'xxx'."
    )
  })
})
