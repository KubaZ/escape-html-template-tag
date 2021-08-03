const CHARACTER_REPLACEMENT_MAP = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#x27;'
}

const HTML_UNSAFE_CHARACTERS_REGEX = /<|>|&|"|'/g
const ATTRIBUTE_UNSAFE_CHARACTERS_REGEX = /"|'/g
const WHITESPACE_REGEX = '[\\n\\r\\t]*'
const MALICIOUS_PROTOCOL_REGEX = new RegExp(Array.from('javascript:', (char) => `${char}${WHITESPACE_REGEX}`).join(''), 'ig')

const $getReplacementString = char => CHARACTER_REPLACEMENT_MAP[char]

const sanitizeAttributeValue = value => value
  .replace(ATTRIBUTE_UNSAFE_CHARACTERS_REGEX, $getReplacementString)
  .replace(MALICIOUS_PROTOCOL_REGEX, '')

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
    this.$ += sub instanceof HtmlSafeString ? sub.$ : String(sub).replace(HTML_UNSAFE_CHARACTERS_REGEX, $getReplacementString)
  }

  toString () {
    return this.$
  }
}

const join = (subs, separator = ',') => subs.length
  ? new HtmlSafeString(['', ...new Array(subs.length - 1).fill(separator), ''], subs)
  : ''

const safe = value => new HtmlSafeString([String(value)], [])
const safeAttribute = value => new HtmlSafeString([sanitizeAttributeValue(String(value))], [])

const html = (parts, ...subs) => new HtmlSafeString(parts, subs)

export default html
export { join, safe, safeAttribute }
