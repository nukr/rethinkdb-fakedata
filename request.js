#!/usr/bin/env babel-node --stage 0

import fetch from 'node-fetch'
import program from 'commander'

program
  .version('0.0.1')
  .option('-m, --method <method>')
  .option('-i, --index <index>')
  .option('-t, --type <type>')
  .option('-d, --id <id>')
  .option('-f --fake <fake>')
  .parse(process.argv)

let method = program.method || 'get'
let id = program.id || 1
let index = program.index || 'megacorp'
let type = program.type || 'employee'
let fake = program.fake || 'user'
let body = null

if (fake === 'user') {
  body = JSON.stringify({
    first_name: 'Wei',
    last_name: 'Luo',
    age: 22,
    about: 'coding',
    interests: ['football']
  })
}

let headers = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

let opts = {
  method,
  headers,
  body
}

async () => {
  let fetchResult = await fetch(`http://192.168.184.5:9200/${index}/${type}/${id}`, opts)
  let json = await fetchResult.json()
  console.log(json)
}().catch(console.log)
