export const normalizeComponent = (args) => {
  if (
    typeof args !== 'string' && 
    typeof args !== 'number' && 
    typeof args !== 'boolean' &&
    typeof args !== 'function' &&
    !Array.isArray(args)
  ) throw new Error('Invalid component.')

  if (!Array.isArray(args)) return args

  const tagName = args[0]

  if (typeof tagName !== 'string') throw new Error(`First argument in component must be a valid nodeName, got ${typeof tagName}.`)

  const props = !Array.isArray(args[1]) && typeof args[1] === 'object' ? args[1] : {}

  const children = 
    Array.isArray(args[1]) ? args[1] :
    Array.isArray(args[2]) ? args[2] :
    typeof args[1] === 'string' || typeof args[1] === 'number' || typeof args[1] === 'boolean' ? [args[1]] :
    typeof args[2] === 'string' || typeof args[2] === 'number' || typeof args[2] === 'boolean' ? [args[2]] :
    []

  return { tagName, props, children }
}
