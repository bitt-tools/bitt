import { Component, KeyedComponent } from "../@types";

export const key = (
  key: string | number, 
  input: Component,
): KeyedComponent => ({ key, input })
