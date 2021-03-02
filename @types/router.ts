import { Component, ComponentInput } from "./component";

export interface RouterOptions {
  mode?: "hash" | "history"
} 

export interface LinkOptions {
  href: string
}

export interface Route {
  regex: RegExp
  module?: () => Promise<{ default: ComponentInput }>
  component?: ComponentInput
  renderedComponent?: Component
}
