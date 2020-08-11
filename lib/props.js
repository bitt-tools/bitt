export const hookProps = (component) => {
  for ( const [ key, value ] of Object.entries(component.props) ) {
    const matchedEvent = key.match(/^on([A-Z][a-z]+)$/)

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
      for ( const [ key, value ] of Object.entries(component.props) ) {
        const matchedEvent = key.match(/^on([A-Z][a-z]+)$/)
    
        if (!matchedEvent && (!component.cachedProps[key] || value !== component.cachedProps[key])) {
          component.node.setAttribute(key, value)
        }
      }
    
      for ( const key of Object.keys(component.cachedProps) ) {
        if (!matchedEvent && !component.props[key]) {
          component.node.removeAttribute(key)
        }
      }
    }
  }

  component.cachedProps = component.props
}
