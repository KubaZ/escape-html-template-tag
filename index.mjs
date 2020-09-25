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

const $replace = (unsafe) => String(unsafe).replace(ENT_REGEX, $getEntity)

const $escape = (sub) => {
  if (sub instanceof HtmlSafeString) {
    return sub
  }
  if (Array.isArray(sub)) {
    let res = ''
    const n = sub.length
    for (let i = 0; i < n; i++) {
      res += sub[i] instanceof HtmlSafeString ? sub[i] : $replace(sub[i])
    }
    return res
  }
  return $replace(sub)
}

class HtmlSafeString {
  constructor (parts, subs) {
    this.$p = parts
    this.$s = subs
  }

  toString () {
    let res = this.$p[0]
    const n = this.$s.length
    for (let i = 0; i < n; i++) {
      res += $escape(this.$s[i]) + this.$p[i + 1]
    }
    return res
  }
}

const join = (subs, separator = ',') => {
  if (subs.length) {
    return new HtmlSafeString(['', ...new Array(subs.length - 1).fill(separator), ''], subs)
  }
  return ''
}

const safe = (value) => new HtmlSafeString([String(value)], [])

const html = (parts, ...subs) => new HtmlSafeString(parts, subs)

export default html
export { join, safe }
