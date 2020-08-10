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

  let cachedProps = {}
  
  let listeners = {
    special: {},
    active: [],
  }

  let rerenderInProgress = false

  const rerender = (newChild) => {
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

    for (const i in renderedChildren) {
      renderedChildren[i].rerender(flattenChildren(newChildren)[i])
    }

    hookCachedProps(node, props, cachedProps)

    cachedProps = props
  }

  const mount = () => {
    for ( const { node: childElement } of renderedChildren ) {
      node.append(childElement)
    }

    for (const child of renderedChildren) {
      child.mount()
    }
    
    if (listeners.special.onMount) listeners.special.onMount.bind(node)()
  }

  const unmount = () => {
    for (const child of renderedChildren) {
      child.unmount()
    }

    for (const [name, callback] of listeners.active) {
      node.removeEventListener(name, callback)
    }

    if (listeners.special.onUnmount) listeners.special.onUnmount.bind(node)()

    node.remove()
  }

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

  cachedProps = props

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

  if (node.nodeName !== '#text') listeners = hookProps(node, props).listeners

  return { component, children, props, rerender, mount, unmount, renderedChildren, node }
}
