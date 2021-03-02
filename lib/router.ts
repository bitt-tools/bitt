import { RenderedComponent, Route, RouterOptions } from '../@types/index.js'
import { mount } from './mount.js'

let mode: "hash" | "history"
let testRoutes: () => Promise<void>

import("./mount")

export const goto = (url: string) => {
  if (mode === 'hash') {
    if (url.startsWith('/')) window.location.hash = url
    else location.hash += (/\/$/.test(location.hash) ? '' : '/') + url
  } else {
    history.replaceState({}, url, url)
    testRoutes()
  }
}

export const router = async (root: HTMLElement, routes: Route[], options: RouterOptions = {}) => {
  if (root === undefined) throw Error('No root element provided.')
  if (!(root instanceof HTMLElement)) throw Error('Invalid root element.')
  if (routes === undefined) throw Error('No routes provided.')
  if (!Array.isArray(routes)) throw Error('Routes must be an array.')

  mode = options.mode || "history"

  let currentRenderedComponent: RenderedComponent

  testRoutes = async () => {
    for (const route of routes) {
      if (currentRenderedComponent) {
        if (Array.isArray(currentRenderedComponent)) {
          currentRenderedComponent.forEach(({ unmount }) => unmount())
        } else {
          currentRenderedComponent.unmount()
        }
      }

      const { regex, module, component } = route
      
      const hash = String(window.location.hash).replace(/(^\#\/*|\/$)/g, '')
      const pathname = String(window.location.pathname).replace(/(^\/*|\/$)/g, '')

      if (regex.test(options.mode === 'hash' ?  hash : pathname)) {
        if (route.renderedComponent) {
          mount(root, null, route.renderedComponent)

          currentRenderedComponent = route.renderedComponent
          
          return
        }

        if (component !== undefined) {
          route.renderedComponent = mount(root, component)
        } else if (module !== undefined) {
          const { default: asyncComponent } = await module()

          route.renderedComponent = mount(root, asyncComponent)
        }

        currentRenderedComponent = route.renderedComponent!

        return
      }
    }
  }

  await testRoutes()

  if (options.mode === 'hash') {
    window.addEventListener('hashchange', testRoutes)
  } else {
    window.addEventListener('pushstate', testRoutes)
    window.addEventListener('popstate', testRoutes)
  }
}
