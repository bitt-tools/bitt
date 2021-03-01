export const hookProps = (component) => {
  for (const key in component.props) {
    const matchedEvent = key.match(/^on([A-Z][a-z]+)$/)
    const value = component.props[key]

    if (matchedEvent) {
      const [, eventName] = matchedEvent

      switch (eventName) {
        case 'Mount': 
        case 'Unmount':
          if (!component.listeners.special[key]) component.listeners.special[key] = value
          break

        default:
          if (!component.listeners.active[key]) {
            component.listeners.active[key] = value
            component.node.addEventListener(eventName.toLowerCase(), value)
          }
      }
    } else {
      for (const key in component.props) {
        const matchedEvent = key.match(/^on([A-Z][a-z]+)$/)
        const value = component.props[key]

        if (!matchedEvent && (!component.cachedProps[key] || value !== component.cachedProps[key])) {
          component.node.setAttribute(key, value)
        }
      }
    
      for (const key in component.cachedProps) {
        if (!matchedEvent && !component.props[key]) {
          component.node.removeAttribute(key)
        }
      }
    }

    if (typeof component.props.style === 'object') {
      const style = Object.entries(component.props.style)
        .map(([key, value]) => `${(key.replace(/([A-Z])/g, '-$1')).toLowerCase()}: ${value};`)
        .join(' ')

      if (style) component.node.setAttribute('style', style)
    }
  }

  component.cachedProps = component.props
}
