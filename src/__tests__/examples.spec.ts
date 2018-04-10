import {
  string,
  eq,
  oneOf,
  array,
  integer,
} from '../walli'
import { util } from '../walli'
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
          name: string(),
          age: integer(),
          gender: oneOf(['F', 'M']),
          father: person().optional(),
          mother: person().optional(),
          children: array(person()).optional()
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
  })
})
