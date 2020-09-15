const flattenChildren = children => {
  return children.reduce((accumulator, child) => {
    if (Array.isArray(child[0])) {
      accumulator.push(...child[0])
    } else {
      accumulator.push(child)
    }

    return accumulator
  }, [])
}

export const normalizeComponent = (component) => {
  if (
    typeof component.input !== 'string' && 
    typeof component.input !== 'number' && 
    typeof component.input !== 'boolean' &&
    typeof component.input !== 'function' &&
    !Array.isArray(component.input)
  ) throw Error('Invalid component type.')

  const input = typeof component.input === 'function' ? component.input(component) : component.input

  if (!Array.isArray(input)) return { text: input }

  component.tagName = input[0]

  if (typeof component.tagName !== 'string') throw Error(`First argument in component must be a valid nodeName, got ${typeof tagName}.`)

  component.props = !Array.isArray(input[1]) && typeof input[1] === 'object' ? input[1] : {}

  const children = 
    Array.isArray(input[1]) ? input[1] :
    Array.isArray(input[2]) ? input[2] :
    typeof input[1] === 'string' || typeof input[1] === 'number' || typeof input[1] === 'boolean' ? [input[1]] :
    typeof input[2] === 'string' || typeof input[2] === 'number' || typeof input[2] === 'boolean' ? [input[2]] :
    []

  const keyedChildren = []

  const flattenedChildren = flattenChildren(children)

  for (const index in flattenedChildren) {
    const { key, component: input } = flattenedChildren[index]

    if (key !== undefined && keyedChildren[key] !== undefined) throw Error('Duplicate keys detected.')

    if (key !== undefined) keyedChildren[index] = { key: String(key), index, input }
    else keyedChildren[index] = { key: 'bitt-' + index, index, input: flattenedChildren[index] }
  }

  component.children = keyedChildren

  return { text: undefined }
}
