import { render } from './render'

export const mount = (root, component) => {
  if (root === undefined) throw new Error('No root element provided.')
  if (component === undefined) throw new Error('No component provided.')
  if (!root instanceof HTMLElement) throw new Error('Invalid root element.')

  const renderedComponent = render(component)

  if (Array.isArray(renderedComponent)) {
    root.append(...renderedComponent.map(({ node }) => node))
  } else {
    root.append(renderedComponent.node)
  }
}
