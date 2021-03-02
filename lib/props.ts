import { Component } from "../@types"

export const hookProps = (component: Component) => {
  if (!(component.node instanceof HTMLElement)) return;

  for (const key in component.props) {
    const matchedEvent = key.match(/^on([A-Z][a-z]+)$/)
    const value = component.props[key]

    if (matchedEvent) {
      const [, eventName] = matchedEvent

      const handler = value as ((event: Event) => any)

      switch (eventName) {
        case 'Mount': 
        case 'Unmount':
          // @ts-ignore
          if (!component.listeners.special[key]) component.listeners.special[key] = value
          break

        default:
          // @ts-ignore
          if (!component.listeners.active[key]) {
            // @ts-ignore
            component.listeners.active[key] = value
            component.node.addEventListener(eventName.toLowerCase(), handler)
          }
      }
    } else {
      for (const key in component.props) {
        const matchedEvent = key.match(/^on([A-Z][a-z]+)$/)
        const value = component.props[key] as number | string | boolean

        if (!matchedEvent && (!component.cachedProps[key] || value !== component.cachedProps[key])) {
          component.node.setAttribute(key, String(value))
        }
      }
    
      for (const key in component.cachedProps) {
        if (!matchedEvent && !component.props[key]) {
          component.node.removeAttribute(key)
        }
      }
    }

    if (typeof component.props.style === 'object') {
      // TODO: runtime type checks for style values
      const style = Object.entries(component.props.style)
        .map(([key, value]) => `${(key.replace(/([A-Z])/g, '-$1')).toLowerCase()}: ${String(value)};`)
        .join(' ')

      if (style) component.node.setAttribute('style', style)
    }
  }

  component.cachedProps = component.props
}
