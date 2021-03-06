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
      [],
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
      [
        {
          class: {
            name: "Hoge",
            body: {
              properties: [],
            },
            extended: undefined,
          },
        },
      ],
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
      [
        {
          class: {
            name: "Hoge",
            body: {
              properties: [],
            },
            extended: "Poge",
          },
        },
      ],
      '@enduml'
    ])
  });
});

describe('parser', () => {
  it('works', () => {
    const ast = parser.tryParse(`
@startuml
class Hoge extends Poge {
  String foo
  -Number boo
  +Foo poge
}
@enduml
    `)

    assert.deepStrictEqual(ast, [
      '@startuml',
      [
        {
          class: {
            name: "Hoge",
            body: {
              properties: [
                {
                  name: 'foo',
                  type: 'String',
                  visibility: 'package',
                },
                {
                  name: 'boo',
                  type: 'Number',
                  visibility: 'private',
                },
                {
                  name: 'poge',
                  type: 'Foo',
                  visibility: 'public',
                },
              ],
            },
            extended: "Poge",
          },
        },
      ],
      '@enduml'
    ])
  });
});
