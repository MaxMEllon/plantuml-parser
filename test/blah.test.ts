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
      '',
      '@enduml',
    ])
  });
});

describe('parser', () => {
  it('works', () => {
    const ast = parser.tryParse(`
@startuml
class Hoge { }
@enduml
    `)

    assert.deepStrictEqual(ast, [
      '@startuml',
      {
        class: {
          name: "Hoge",
          body: "",
          extended: undefined,
        },
      },
      '@enduml'
    ])
  });
});

describe('parser', () => {
  it('works', () => {
    const ast = parser.tryParse(`
@startuml
class Hoge extends Poge { }
@enduml
    `)

    assert.deepStrictEqual(ast, [
      '@startuml',
      {
        class: {
          name: "Hoge",
          body: "",
          extended: "Poge",
        },
      },
      '@enduml'
    ])
  });
});
