import _ from 'lodash'

const SIZE = 10000000

console.time('_.range')
_.range(SIZE)
console.timeEnd('_.range')

console.time('Array.apply(Array(SIZE))')
Array.apply(null, Array(SIZE))
console.timeEnd('Array.apply(Array(SIZE))')
