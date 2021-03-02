import { Component, LinkOptions } from '../@types/index.js'
import { goto } from '../lib/router.js'

export const link = (options: LinkOptions | string, children: Component[]) => {
  const attributes: LinkOptions =  typeof options === 'string' 
    ? { href: options } 
    : options

  const input: Component = ['a', {
    ...attributes,

    onClick (event) {
      event.preventDefault()
      goto(attributes.href)
    }
  }, children]

  return input
}