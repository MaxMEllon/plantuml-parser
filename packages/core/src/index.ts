import * as R from 'remeda'
import P from 'parsimmon'
import { skipOptWs, orOptWs, mapper, many } from './helper'

const classKeyWord = R.pipe(
  'class',
  P.string,
  skipOptWs,
)

const className = R.pipe(
  /^[A-Z]+[a-zA-Z0-9]*/,
  P.regexp,
  skipOptWs,
)

const l = R.pipe(
  P.string('{'),
  skipOptWs,
)
const r = R.pipe(
  P.string('}'),
  skipOptWs,
)

const classExtendsKeyWord = R.pipe(
  'extends',
  P.string,
  skipOptWs,
)

// class Hoge extends Poge
//            ~~~~~~~~~~~~
const classExtendsSection = R.pipe(
  P.seq(classExtendsKeyWord, className),
  orOptWs,
  mapper(name => (Array.isArray(name) ? name[1] : void 0)),
)

const visibility = R.pipe(
  /[\-#~+]{1}/,
  P.regexp,
  orOptWs,
)

const typeIdentify = R.pipe(
  /[A-Za-z]+[a-zA-Z0-9]*/,
  P.regexp,
  skipOptWs,
)

const propertyName = R.pipe(
  /[A-Za-z]+[a-zA-Z0-9]*/,
  P.regexp,
  skipOptWs,
)

const visibilityMap = Object.freeze({
  '-': 'private',
  '+': 'public',
  '#': 'protected',
  '~': 'package',
})

type Visibility = keyof typeof visibilityMap

const convertVisibilityString = (v: string) => {
  const visibility = (/[\-+#~]{1}/.test(v) ? v : '~') as Visibility
  return visibilityMap[visibility]
}

// class Hoge {
//   +String foo
//   ~~~~~~~~~~~
const property = R.pipe(
  P.seq(visibility, typeIdentify, propertyName),
  mapper(([visibility, type, name]) => ({
    visibility: convertVisibilityString(visibility),
    type,
    name,
  })),
  many,
  mapper(properties => ({ properties })),
  orOptWs,
)

// class Hoge { }
//            ~~~
const classBodySection = R.pipe(
  P.seq(l, property, r),
  mapper(([_l, body, _r]) => body),
)

const xlass = R.pipe(
  P.seq(
    //
    P.seq(classKeyWord, className, classExtendsSection),
    classBodySection,
  ),
  mapper(([[_1, name, extended], body]) => ({
    class: {
      name,
      extended,
      body,
    },
  })),
)

const start = R.pipe(
  '@startuml',
  P.string,
  skipOptWs,
)

const end = R.pipe(
  '@enduml',
  P.string,
  skipOptWs,
)

const root = P.optWhitespace.then(
  P.seq(
    start,
    R.pipe(
      R.pipe(
        xlass,
        many,
      ),
      orOptWs,
    ),
    end,
  ),
)

export default root
