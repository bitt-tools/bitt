import { render } from './render'

export const mount = (root, component, renderedComponent) => {
  if (root === undefined) throw Error('No root element provided.')
  if (component === undefined) throw Error('No component provided.')
  if (!root instanceof HTMLElement) throw Error('Invalid root element.')

  if (component) renderedComponent = render(component)

  if (Array.isArray(renderedComponent)) {
    console.log('mounting', ...renderedComponent.map(({ node }) => node), root)
    root.append(...renderedComponent.map(({ node }) => node))
  } else {
    console.log('mounting', renderedComponent.node, root)
    root.append(renderedComponent.node)
  }

  renderedComponent.mount()

  return renderedComponent
}
