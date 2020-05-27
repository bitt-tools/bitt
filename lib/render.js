import { processComponent } from './process'
import { hookProps } from './props'

export const render = (component) => {
  if (component === undefined) throw new Error('No component provided.')

  if (
    typeof component !== 'string' && 
    typeof component !== 'number' && 
    typeof component !== 'boolean' &&
    typeof component !== 'function' &&
    !Array.isArray(component)
  ) throw new Error('Invalid component.')

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

  const processedComponent = processComponent({ 
    component, 
    rerender, 
    newState,
  })

  if (Array.isArray(processedComponent)) return processedComponent

  const { props, children, node } = processedComponent

  if (node.nodeName !== '#text') hookProps(node, props)

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
