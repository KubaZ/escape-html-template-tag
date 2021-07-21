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

const ENT_REGEX = /<|>|&|"|'|\/|=|`/g

const $getEntity = char => ENTITIES[char]

class HtmlSafeString {
  constructor (parts, subs) {
    this.$ = parts[0]
    for (let i = 0; i < subs.length; i++) {
      const sub = subs[i]
      if (Array.isArray(sub)) for (let j = 0; j < sub.length; j++) this.$esc(sub[j])
      else this.$esc(sub)
      this.$ += parts[i + 1]
    }
  }

  $esc (sub) {
    this.$ += sub instanceof HtmlSafeString ? sub.$ : String(sub).replace(ENT_REGEX, $getEntity)
  }

  toString () {
    return this.$
  }
}

const join = (subs, separator = ',') => subs.length
  ? new HtmlSafeString(['', ...new Array(subs.length - 1).fill(separator), ''], subs)
  : ''

const safe = value => new HtmlSafeString([String(value)], [])

const html = (parts, ...subs) => new HtmlSafeString(parts, subs)

export default html
export { join, safe }
