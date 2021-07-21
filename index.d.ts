interface Stringifyable {
    toString(): string
}

interface HtmlSafeString extends Stringifyable {}

type StringLike = Stringifyable | string

export function safe(value: StringLike): HtmlSafeString

export function join(values: Array<StringLike>, separator?: StringLike | undefined): HtmlSafeString

export default function html(parts: TemplateStringsArray, ...subs: Array<StringLike>): HtmlSafeString
