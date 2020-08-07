import { goto } from '../lib/router'

export const link = (options, children) => {
  const attributes =  typeof options === 'string' ? { href: options } : options

  return ['a', {
    ...attributes,

    onClick (event) {
      event.preventDefault()
      goto(attributes.href)
    }
  }, children]
}