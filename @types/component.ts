export type ComponentProps = {
  style?: Record<string, unknown>
  [attributeOrEventName: string]: ((event: Event) => any) | string | number | boolean | Record<string, unknown> | undefined
}

export interface KeyedComponent {
  key: string | number | undefined
  input: Component
  index?: number | string
}

export type Component = 
  | string 
  | number 
  | boolean 
  | ((component: RenderedComponent) => Component) 
  | KeyedComponent
  | [string]
  | [string, Component[] | string | number | boolean]
  | [string, ComponentProps]
  | [string, ComponentProps, Component[] | string | number | boolean]

export interface RenderedComponent <State extends Record<string, unknown> = {}> {
  input: Component

  tagName?: string
  key?: string | number

  props: ComponentProps
  cachedProps: ComponentProps
  
  children: KeyedComponent[]
  renderedChildren: RenderedComponent[],
  nodeChildren: RenderedComponent[],
  
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

export type RenderResult = RenderedComponent | RenderResult[]