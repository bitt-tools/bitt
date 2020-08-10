import { render } from './render.js'
import { normalizeComponent } from './normalize.js'

export const processComponent = ({ component, existingElement, rerender, newState }) => {
  const unpackedComponent = typeof component === 'function' ? component({ rerender, newState }) : component

  if (Array.isArray(unpackedComponent[0])) return unpackedComponent[0].map(render)

  const normalizedComponent = normalizeComponent(unpackedComponent)

  if (typeof normalizedComponent === 'string' || typeof normalizedComponent === 'number' ) {
    const node = document.createTextNode(normalizedComponent)

    return { props: [], children: [], node }
  } else {
    const { tagName, props, children } = normalizedComponent

    const node = existingElement !== undefined ? existingElement : document.createElement(tagName)
  
    return { props, children, node }
  }
}
