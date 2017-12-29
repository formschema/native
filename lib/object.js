'use strict'

export const equals = (o1, o2) => {
  const keys1 = Object.keys(o1)

  if (keys1.length !== Object.keys(o2).length) {
    return false
  }

  return keys1.findIndex((key) => !o2.hasOwnProperty(key) || o1[key] !== o2[key]) === -1
}
