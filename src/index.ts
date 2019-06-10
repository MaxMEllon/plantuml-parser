import * as R from 'remeda'
import P from 'parsimmon'
import { lexme } from './helper'

const classKeyWord = R.pipe(
  'class',
  P.string,
  lexme,
)

const className = R.pipe(
  /^[A-Z]+[a-zA-Z0-9]*/,
  P.regexp,
  lexme,
)

const l = R.pipe(
  P.string('{'),
  lexme,
)
const r = R.pipe(
  P.string('}'),
  lexme,
)

const classExtendsKeyWord = R.pipe(
  'extends',
  P.string,
  lexme,
)

const xlass = P.seq(
  // class Hoge
  // ~~~~~~~~~~
  P.seq(
    classKeyWord,
    className,
    // class Hoge extends Poge
    //            ~~~~~~~~~~~~
    P.seq(
      classExtendsKeyWord,
      className,
    ).or(P.optWhitespace)
     .map((name) => name[1])
  ).map(([_1, name, extended]) => [name, extended]),
  // class Hoge { }
  //            ~~~
  P.seq(
    l,
    P.optWhitespace, // TODO
    r,
  ).map(([_l, body, _r]) => body)
).map(([[name, extended], body]) => ({
  class: {
    name,
    extended, 
    body
  }
}))

const start = R.pipe(
  '@startuml',
  P.string,
  lexme,
)

const end = R.pipe(
  '@enduml',
  P.string,
  lexme,
)

const root = P.optWhitespace.then(
  P.seq(
    start,
    xlass.or(P.optWhitespace),
    end,
  )
)

export default root