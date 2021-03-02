import { RenderedComponent, Component, KeyedComponent } from "../@types"

/**
 * Flatten nested components for multiple top level inputs.
 */
const flattenChildren = (children: Component[]): Component[] => {
  return children.reduce((accumulator, child) => {
    if (Array.isArray(child) && Array.isArray(child[0])) {
      accumulator.push(...child[0])
    } else {
      accumulator.push(child)
    }

    return accumulator
  }, [] as Component[])
}

/**
 * Check if the input can be turned into a text node.
 */
export const canStringify = (input: Component): boolean => (
  typeof input === 'string' ||
  typeof input === 'number' ||
  typeof input === 'boolean'
)

/**
 * Take varied component inputs and props, and manipulate them to standardize.
 */
export const normalizeComponent = (component: RenderedComponent): {
  text: string | boolean | number | undefined
} => {
  if (
    !canStringify(component.input) &&
    typeof component.input !== 'function' &&
    !Array.isArray(component.input)
  ) throw Error('Invalid component type.')

  const input = typeof component.input === 'function' ? component.input(component) : component.input

  if (canStringify(input)) return { text: input as string | boolean | number }

  if (!Array.isArray(input)) return { text: undefined }

  component.tagName = input[0]

  if (typeof component.tagName !== 'string') throw Error(`First argument in component must be a valid nodeName, got ${typeof component.tagName}.`)

  component.props = !Array.isArray(input[1]) && typeof input[1] === 'object' ? input[1] : {}

  let children: Component[] = []

  if (Array.isArray(input[1])) { 
    // ["div", [["p", "hello world"]]]
    children = input[1] 
  } 
  
  else if (Array.isArray(input[2])) { 
    // ["div", { style: { color: "red" } }, [["p", "hello world"]]]
    children = input[2] 
  } 
  
  else if (canStringify(input[1] as Component)) {
    // ["div", "hello world"]
    children = [input[1] as Component] 
  } 
  
  else if (canStringify(input[2] as Component)) {
    // ["div", { style: { color: "red" } }, "hello world"]
    children = [input[2] as Component] 
  }

  const keyedChildren: KeyedComponent[] = []

  const flattenedChildren = flattenChildren(children)

  for (const index in flattenedChildren) {
    const child: KeyedComponent = typeof flattenedChildren[index] === "object" && !Array.isArray(flattenedChildren[index]) 
      ? flattenedChildren[index] as KeyedComponent
      : {
          key: undefined,
          input: flattenedChildren[index],
        }

    const { key, input } = child

    if (key !== undefined && keyedChildren[key as number] !== undefined) {
      throw Error('Duplicate keys detected.')
    }

    if (key !== undefined) {
      keyedChildren[index] = { key: String(key), index, input }
    } else {
      keyedChildren[index] = { key: 'bitt-' + index, index, input: flattenedChildren[index] }
    }
  }

  component.children = keyedChildren

  return { text: undefined }
}
