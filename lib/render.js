import { processComponent } from './process'
import { hookProps, hookCachedProps } from './props'

export const render = (component) => {
  if (component === undefined) throw Error('No component provided.')

  if (
    typeof component !== 'string' && 
    typeof component !== 'number' && 
    typeof component !== 'boolean' &&
    typeof component !== 'function' &&
    !Array.isArray(component)
  ) {
    console.error('Invalid component', component)
    throw Error('Invalid component.')
  }

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

  const flattenChildren = children => {
    return children.reduce((accumulator, child) => {
      if (Array.isArray(child[0])) {
        accumulator.push(...child)
      } else {
        accumulator.push(child)
      }

      return accumulator
    }, [])
  }

  const renderedChildren = flattenChildren(children).map(render)

  for ( const { node: childElement } of renderedChildren ) {
    node.append(childElement)
  }

  let cachedProps = props

  if (node.nodeName !== '#text') hookProps(node, props)

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

    hookCachedProps(node, props, cachedProps)

    cachedProps = props

    for (const i in renderedChildren) {
      renderedChildren[i].rerender(flattenChildren(newChildren)[i])
    }
  }

  return { component, children, props, rerender, renderedChildren, node }
}
