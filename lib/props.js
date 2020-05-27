export const hookProps = (node, props) => {
  const listeners = []

  for ( const [ key, value ] of Object.entries(props) ) {
    const matchedEvent = key.match(/^on([A-Z][a-z]+)$/)

    if (matchedEvent) {
      const [, eventName] = matchedEvent

      switch (eventName) {
        case 'Mounted': 
          value.bind(node)()
          break

        default:
          listeners.push([eventName.toLowerCase(), value])
          node.addEventListener(eventName.toLowerCase(), value)
      }
    } else {
      node.setAttribute(key, value)
    }
  }

  return listeners
}
