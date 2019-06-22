import * as R from 'remeda'
import P from 'parsimmon'
import { skip, or, mapper, then, many } from './helper'
import { ClassPropertyAST, Visibility, VisibilityChars } from 'types'

const _ = P.optWhitespace

const classKeyWord = R.pipe(
  'class',
  P.string,
  skip(_),
)

const className = R.pipe(
  /^[A-Z]+[a-zA-Z0-9]*/,
  P.regexp,
  skip(_),
)

const l = R.pipe(
  P.string('{'),
  skip(_),
)
const r = R.pipe(
  P.string('}'),
  skip(_),
)

const classExtendsKeyWord = R.pipe(
  'extends',
  P.string,
  skip(_),
)

// class Hoge extends Poge
//            ~~~~~~~~~~~~
const classExtendsSection = R.pipe(
  P.seq(classExtendsKeyWord, className),
  or(_),
  mapper(name => (Array.isArray(name) ? name[1] : void 0)),
)

const visibility = R.pipe(
  /[\-#~+]{1}/,
  P.regexp,
  or(_),
)

const typeIdentify = R.pipe(
  /[A-Za-z]+[a-zA-Z0-9]*/,
  P.regexp,
  skip(_),
)

const propertyName = R.pipe(
  /[A-Za-z]+[a-zA-Z0-9]*/,
  P.regexp,
  skip(_),
)

const visibilityMap = Object.freeze({
  '-': 'private',
  '+': 'public',
  '#': 'protected',
  '~': 'package',
}) as { [t: string]: Visibility }

const convertVisibilityString = (v: string): Visibility => {
  const visibility = (/[\-+#~]{1}/.test(v) ? v : '~') as VisibilityChars
  return visibilityMap[visibility]
}

// class Hoge {
//   +String foo
//   ~~~~~~~~~~~
const propertyMapper = ([visibility, type, name]: [string, string, string]): ClassPropertyAST => ({
  visibility: convertVisibilityString(visibility),
  type,
  name,
})

const property = R.pipe(
  P.seq(visibility, typeIdentify, propertyName),
  mapper(propertyMapper),
  many,
  mapper(properties => ({ properties })),
  or(_),
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
  skip(_),
)

const end = R.pipe(
  '@enduml',
  P.string,
  skip(_),
)

const root = R.pipe(
  _,
  then(
    P.seq(
      start,
      R.pipe(
        many(xlass),
        or(_),
      ),
      end,
    ),
  ),
)

export default root
