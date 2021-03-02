import { RenderedComponent, Component } from '../@types/index.js'
import { render } from './render.js'

export const mount = (root: HTMLElement, input: Component | null, renderedComponent?: RenderedComponent) => {
  if (root === undefined) throw Error('No root element provided.')
  if (input === undefined) throw Error('No component provided.')
  if (!(root instanceof HTMLElement)) throw Error('Invalid root element.')

  // TODO: again, ensure that this is really a RenderedComponent
  if (!renderedComponent) renderedComponent = render(input!) as RenderedComponent

  if (Array.isArray(renderedComponent)) {
    root.append(...renderedComponent.map(({ node }) => node))
  } else {
    root.append(renderedComponent.node as string | Node)
  }

  renderedComponent.mount()

  return renderedComponent
}
