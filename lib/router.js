import { mount } from './mount'

let mode, testRoutes

export const goto = (url) => {
  if (mode === 'hash') {
    if (url.startsWith('/')) window.location.hash = url
    else location.hash += (/\/$/.test(location.hash) ? '' : '/') + url
  } else {
    history.replaceState({}, url, url)
    testRoutes()
  }
}

export const router = async (root, routes, options = {}) => {
  if (root === undefined) throw Error('No root element provided.')
  if (!root instanceof HTMLElement) throw Error('Invalid root element.')
  if (routes === undefined) throw Error('No routes provided.')
  if (!Array.isArray(routes)) throw Error('Routes must be an array.')

  mode = options.mode

  testRoutes = async () => {
    for ( const route of routes ) {
      const { regex, module, component } = route
      
      const hash = String(window.location.hash).replace(/(^\#\/*|\/$)/g, '')
      const pathname = String(window.location.pathname).replace(/(^\/*|\/$)/g, '')

      if (regex.test(options.mode === 'hash' ?  hash : pathname)) {
        document.body.textContent = ''

        for (const child of root.children) child.remove()

        if (route.renderedComponent) {
          mount(root, null, route.renderedComponent)
          
          return
        }

        if (component !== undefined) {
          route.renderedComponent = mount(root, component)
        } else if (module !== undefined) {
          const { default: dynamicComponent } = await module()

          route.renderedComponent = mount(root, dynamicComponent)
        }

        return
      }
    }
  }

  await testRoutes()

  if (options.mode === 'hash') {
    window.addEventListener('hashchange', testRoutes)
  } else {
    window.addEventListener('pushstate', event => {
      testRoutes()
      console.log(event)
    })

    window.addEventListener('popstate', event => {
      testRoutes()
      console.log(event)
    })
  }
}
