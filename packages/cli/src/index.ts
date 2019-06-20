#!/usr/bin/env node

import parser from '@plantuml-parser/core'

const stdin = process.openStdin()

let data = ""

stdin.on('data', (chunk) => { data += chunk })

stdin.on('end', () => {
  console.log(JSON.stringify(parser.tryParse(data), null, 2))
})
