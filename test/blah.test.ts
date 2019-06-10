import assert from 'assert'
import parser from '../src'

describe('parser', () => {
  it('works', () => {
    const ast = parser.tryParse(`
@startuml
@enduml
    `)

    assert.deepStrictEqual(ast, [
      '@startuml',
      '@enduml'
    ])
  });
});
