import { mount } from './mount'

export const router = async (root, routes) => {
  if (root === undefined) throw Error('No root element provided.')
  if (!root instanceof HTMLElement) throw Error('Invalid root element.')
  if (routes === undefined) throw Error('No routes provided.')
  if (!Array.isArray(routes)) throw Error('Invalid routes array.')

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

  await testRoute()
}
