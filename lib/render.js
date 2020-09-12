import { normalizeComponent } from './normalize.js'
import { hookProps } from './props.js'

export const render = (input) => {
  if (input === undefined) throw Error('No component provided.')
  
  if (Array.isArray(input[0])) return input[0].map(render)

  const component = {
    input,

    props: {},
    cachedProps: {},

    style: {},
    
    children: [],
    renderedChildren: [],
    nodeChildren: [],
    
    index: 0,

    listeners: {
      special: {},
      active: [],
    },

    state: null,

    node: null,

    newState (object = {}) {
      if (component.state === null) {
        let rerenderInProgress = false

        component.state = new Proxy(object, {
          get (target, prop) {
            return target[prop]
          },
      
          set (target, prop, value) {
            target[prop] = value

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
      if (input instanceof Element) {
        component.node = input

        return
      }

      const { text } = normalizeComponent(component)

      if (text) {
        if (!component.node) component.node = document.createTextNode('')

        component.node.textContent = text
      } else {
        if (!component.node) component.node = document.createElement(component.tagName)

        hookProps(component)
      }

      for (const { key, index, input } of component.children) {
        if (component.renderedChildren[key] === undefined) {
          const renderedChild = render(input)
          renderedChild.index = index

          component.renderedChildren[key] = renderedChild

          if (index < component.nodeChildren.length - 1) {
            component.node.insertBefore(
              renderedChild.node,
              component.nodeChildren[index].node,
            )
          } else {
            component.node.append(renderedChild.node)
          }

          component.nodeChildren[index] = renderedChild
        } else {
          component.renderedChildren[key].input = input
          component.renderedChildren[key].render()
        }
      }

      for (const key in component.renderedChildren) {
        if (component.children[component.renderedChildren[key].index].key !== key) {
          component.renderedChildren[key].node.remove()
          delete component.nodeChildren[component.renderedChildren[key].index]
          delete component.renderedChildren[key]
        }
      }
    },

    mount () {
      for (const key in component.renderedChildren) {
        const child = component.renderedChildren[key]
        child.mount()
      }

      if (component.listeners.special.onMount) component.listeners.special.onMount.bind(component.node)()
    },

    unmount () {
      for (const key in component.renderedChildren) {
        const child = component.renderedChildren[key]
        child.unmount()
      }
  
      for (const [name, callback] of component.listeners.active) {
        component.node.removeEventListener(name, callback)
      }
  
      if (component.listeners.special.onUnmount) component.listeners.special.onUnmount.bind(component.node)()
  
      component.node.remove()
    },
  }

  component.render()

  return component
}
