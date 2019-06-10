import * as R from 'remeda'
import P from 'parsimmon'
import { lexme } from 'helper';

const classWord = R.pipe(
  'class',
  P.string,
  lexme,
)

const className = R.pipe(
  /^[A-Z]+[a-zA-Z0-9]*/,
  P.regexp,
  lexme,
)

const classExtendsKeyWord = R.pipe(
  'extends',
  P.string,
  lexme,
)

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
    end
  )
)


export default root