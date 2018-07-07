export function equals (o1, o2) {
  if (isScalar(o1)) {
    return o1 === o2
  }

  const keys1 = Object.keys(o1)

  if (keys1.length !== Object.keys(o2).length) {
    return false
  }

  return keys1.findIndex((key) => !o2.hasOwnProperty(key) || o1[key] !== o2[key]) === -1
}

export function isScalar (value) {
  if (value === null) {
    return true
  }
  return /string|number|boolean|undefined/.test(typeof value)
}

export function merge (dest, src) {
  Object.keys(src).forEach((key) => {
    const value = src[key]

    if (isScalar(value)) {
      dest[key] = value
    } else if (value instanceof Array) {
      dest[key] = [ ...value ]
    } else if (value instanceof Function) {
      dest[key] = value
    } else {
      if (!dest[key]) {
        dest[key] = {}
      }
      merge(dest[key], value)
    }
  })

  return dest
}

export const assign = merge

export function clone (object) {
  return merge({}, object)
}

export function clear (object) {
  for (let key in object) {
    delete object[key]
  }
}

export function isEmpty (object) {
  for (let key in object) {
    return false
  }
  return true
}
