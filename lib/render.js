import { normalizeComponent } from './normalize.js'
import { hookProps } from './props.js'

export const render = (input) => {
  if (input === undefined) throw Error('No component provided.')
  
  if (Array.isArray(input[0])) return input[0].map(render)

  const component = {
    input,

    props: {},
    cachedProps: {},
    
    children: [],
    
    listeners: {
      special: {},
      active: [],
    },

    state: null,

    node: null,

    renderedChildren: null,

    setState (object = {}) {
      if (component.state === null) {
        let rerenderInProgress = false

        component.state = new Proxy(object, {
          get (target, prop) {
            return target[prop]
          },
      
          set (target, prop, value) {
            target[prop] = value

            console.log(prop, value)
            
            if (!rerenderInProgress){ 
              rerenderInProgress = true
              requestAnimationFrame(() => {
                component.render()
                rerenderInProgress = false
              })
            }
      
            return true
          },
        })
      }

      return component.state
    },

    render () {
      const { text } = normalizeComponent(component)

      if (component.renderedChildren === null) component.renderedChildren = component.children.map(render)
      else for (const i in component.renderedChildren) {
        component.renderedChildren[i].input = component.children[i]
        component.renderedChildren[i].render()
      }

      if (text) {
        if (!component.node) component.node = document.createTextNode('')

        component.node.textContent = text
      } else {
        if (!component.node) component.node = document.createElement(component.tagName)

        hookProps(component)
      }
    },

    mount () {
      for (const child of component.renderedChildren) {
        component.node.append(child.node)
        child.mount()
      }
      
      if (component.listeners.special.onMount) component.listeners.special.onMount.bind(component.node)()
    },

    unmount () {
      for (const child of component.renderedChildren) {
        child.unmount()
      }
  
      for (const [name, callback] of listeners.active) {
        component.node.removeEventListener(name, callback)
      }
  
      if (component.listeners.special.onUnmount) component.listeners.special.onUnmount.bind(component.node)()
  
      component.node.remove()
    },
  }

  component.render()

  return component
}
