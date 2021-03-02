export type ComponentProps = {
  style?: Record<string, unknown>
  [attributeOrEventName: string]: ((event: Event) => any) | string | number | boolean | Record<string, unknown> | undefined
}

export interface KeyedComponentInput {
  key: string | number | undefined
  input: ComponentInput
  index?: number | string
}

export type ComponentInput = 
  | string 
  | number 
  | boolean 
  | ((component: Component) => ComponentInput) 
  | KeyedComponentInput
  | [
      string, 
      ComponentInput[] | ComponentProps | string | number | boolean | undefined, 
      ComponentInput[] | string | number | boolean | undefined
    ]

export interface Component <State extends Record<string, unknown> = {}> {
  input: ComponentInput

  tagName?: string
  key?: string | number

  props: ComponentProps
  cachedProps: ComponentProps
  
  children: KeyedComponentInput[]
  renderedChildren: Component[],
  nodeChildren: Component[],
  
  index: number,

  listeners: {
    special: {
      onMount? (): void
      onUnmount? (): void
    },
    
    active: [string, EventListenerOrEventListenerObject][],
  },

  state?: State,
  node?: Element | Text,

  newState (object: State): ProxyHandler<State>
  render (): void
  mount (): void
  unmount (): void
}

export type RenderResult = Component | RenderResult[]