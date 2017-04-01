'use strict'

export const clone = (o) => JSON.parse(JSON.stringify(o))

export const sequence = function * () {
  let iterator = 1

  while (true) {
    yield iterator++
  }
}
