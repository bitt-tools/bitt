import { mount } from './mount'

let mode

export const goto = (url) => {
  if (mode === 'hash') {
    if (url.startsWith('/')) window.location.hash = url
    else window.location.hash += (/\/$/.test(window.location.hash) ? '' : '/') + url
  } else window.location.pushState({}, url, url)
}

export const router = async (root, routes, options) => {
  if (root === undefined) throw Error('No root element provided.')
  if (!root instanceof HTMLElement) throw Error('Invalid root element.')
  if (routes === undefined) throw Error('No routes provided.')
  if (!Array.isArray(routes)) throw Error('Routes must be an array.')

  mode = options.mode

  const testRoute = async () => {
    for ( const route of routes ) {
      const { regex, module, component } = route
      
      const hash = String(window.location.hash).replace(/(^\#\/*|\/$)/g, '')
      const pathname = String(window.location.pathname).replace(/(^\/*|\/$|\#)/g, '')

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

  await testRoute()

  if (options.mode === 'hash') {
    window.addEventListener('hashchange', testRoute)
  } else {
    window.addEventListener('pushstate', testRoute)
    window.addEventListener('popstate', testRoute)
  }
}
