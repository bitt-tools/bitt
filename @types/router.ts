import { RenderedComponent, Component } from "./component";

export interface RouterOptions {
  mode?: "hash" | "history"
} 

export interface LinkOptions {
  href: string
}

export interface Route {
  regex: RegExp
  module?: () => Promise<{ default: Component }>
  component?: Component
  renderedComponent?: RenderedComponent
}
