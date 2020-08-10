export const hookProps = (node, props) => {
  const listeners = {
    active: [],
    special: {},
  }

  for ( const [ key, value ] of Object.entries(props) ) {
    const matchedEvent = key.match(/^on([A-Z][a-z]+)$/)

    if (matchedEvent) {
      const [, eventName] = matchedEvent

      switch (eventName) {
        case 'Mount': 
        case 'Unmount':
          listeners.special[key] = value
          break

        default:
          listeners.active.push([eventName.toLowerCase(), value])
          node.addEventListener(eventName.toLowerCase(), value)
      }
    } else {
      node.setAttribute(key, value)
    }
  }

  return { listeners }
}

export const hookCachedProps = (node, props, cache) => {
  for ( const [ key, value ] of Object.entries(props) ) {
    const matchedEvent = key.match(/^on([A-Z][a-z]+)$/)

    if (!matchedEvent && props[key] !== cache[key]) {
      node.setAttribute(key, value)
    }
  }
}
