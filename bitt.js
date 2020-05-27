export const normalizeComponent = (args) => {
  if (!Array.isArray(args)) return args

  const tagName = args[0]

  const props = !Array.isArray(args[1]) && typeof args[1] === 'object' ? args[1] : {}

  const children = 
    Array.isArray(args[1]) ? args[1] :
    Array.isArray(args[2]) ? args[2] :
    typeof args[1] === 'string' || typeof args[1] === 'number' ? [args[1]] :
    typeof args[2] === 'string' || typeof args[2] === 'number' ? [args[2]] :
    []

  return { tagName, props, children }
}

export const processComponent = ({ component, existingElement, rerender, newState }) => {
  const normalized = normalizeComponent(
    typeof component === 'function' ? component({ rerender, newState }) : component
  )

  if (typeof normalized === 'string' || typeof normalized === 'number' ) {
    const node = document.createTextNode(normalized)

    return { props: [], children: [], node }
  } else {
    const { tagName, props, children } = normalized

    const node = existingElement !== undefined ? existingElement : document.createElement(tagName)
  
    return { props, children, node }
  }
}

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

export const render = (component) => {
  let rerender = () => {}

  let rerenderInProgress = false

  const state = new Proxy({}, {
    get (target, prop) {
      return target[prop]
    },

    set (target, prop, value) {
      target[prop] = value
      
      if (!rerenderInProgress){ 
        rerenderInProgress = true
        requestAnimationFrame(() => {
          rerender()
          rerenderInProgress = false
        })
      }

      return true
    },
  })

  const newState = (object) => Object.assign(state, object)

  const { props, children, node } = processComponent({ 
    component, 
    rerender, 
    newState,
  })

  hookProps(node, props)

  const renderedChildren = children.map(render)

  for ( const { node: childElement } of renderedChildren ) {
    node.append(childElement)
  }

  rerender = (newChild) => {
    if (node.nodeName === '#text' && newChild !== component) {
      node.textContent = newChild
      component = newChild
    }

    const { props, children: newChildren } = processComponent({ 
      component: newChild !== undefined ? newChild : component, 
      existingElement: node, 
      rerender,
      newState: () => state,
    }, node)

    // hookProps(props, node)

    for (const i in renderedChildren) {
      renderedChildren[i].rerender(newChildren[i])
    }
  }

  return { component, children, props, rerender, renderedChildren, node }
}

export const mount = (root, component) => root.append(render(component).node)

export const router = (routes, root) => {
  const testRoute = async () => {
    for ( const { regex, module, component } of routes ) {
      if (regex.test(window.location.pathname)) {
        if (component !== undefined) {
          mount(root, component)
        } else if (module !== undefined) {
          const { default: dynamicComponent } = await module()

          mount(root, dynamicComponent)
        }
      }
    }
  }

  testRoute()
}
