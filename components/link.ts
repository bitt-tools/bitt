import { ComponentInput, LinkOptions } from '../@types/index.js'
import { goto } from '../lib/router.js'

export const link = (options: LinkOptions | string, children: ComponentInput[]) => {
  const attributes: LinkOptions =  typeof options === 'string' 
    ? { href: options } 
    : options

  const input: ComponentInput = ['a', {
    ...attributes,

    onClick (event) {
      event.preventDefault()
      goto(attributes.href)
    }
  }, children]

  return input
}