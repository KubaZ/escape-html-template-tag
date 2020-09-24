const ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
}

const ENT_REGEX = new RegExp(Object.keys(ENTITIES).join('|'), 'g')

const $getEntity = (char) => ENTITIES[char]

const $recurr = (sub) => {
  if (sub.$safe) {
    return sub.toString()
  }
  return Array.isArray(sub) ? join(sub, '').toString() : sub
}

const HtmlSafeString = (parts, subs) => {
  const pairs = [['', parts[0]]]

  for (let i = 0; i < subs.length; i++) {
    const nextSub = subs[i]
    pairs.push([
      Array.isArray(nextSub) || nextSub.$safe ? nextSub : String(nextSub).replace(ENT_REGEX, $getEntity),
      parts[i + 1]
    ])
  }

  return {
    $safe: true,
    toString () {
      let concat = ''
      const n = pairs.length
      for (let i = 0; i < n; i++) {
        const next = pairs[i]
        concat += $recurr(next[0]) + next[1]
      }
      return concat
    }
  }
}

const join = (array, separator) => {
  if (separator == null) {
    separator = ','
  }
  if (!array.length) {
    return HtmlSafeString([''], [])
  }
  return HtmlSafeString(['', ...Array(array.length - 1).fill(separator), ''], array)
}

const safe = (value) => HtmlSafeString([String(value)], [])

const escapeHtml = (parts, ...subs) => HtmlSafeString(parts, subs)

export default escapeHtml
export { join, safe }
